import { chromium } from "playwright";

const BASE = "https://averr-git-redesign-v2-prachets-upadhyay-s-projects.vercel.app";
const CENTRES = [0.04, 0.335, 0.665, 0.96];

const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto(BASE + "/about", { waitUntil: "networkidle" });
await p.waitForTimeout(1200);

const geo = await p.evaluate(() => {
  const sticky = document.querySelector('section[aria-label="How the studio works"]');
  if (!sticky) return { error: "no stage" };
  const wrap = sticky.parentElement;
  const track = sticky.querySelector("div");
  return {
    wrapTop: wrap.getBoundingClientRect().top + window.scrollY,
    wrapH: wrap.offsetHeight,
    stickyPos: getComputedStyle(sticky).position,
    stickyH: sticky.offsetHeight,
    trackW: track.offsetWidth,
    panels: track.children.length,
    marks: document.querySelectorAll(".pt-mark").length,
    vh: window.innerHeight,
  };
});
console.log("GEO", JSON.stringify(geo));
if (geo.error) { await b.close(); process.exit(1); }

const travel = geo.wrapH - geo.vh;
console.log("travel(px)", travel, "expected 400vh =", 4 * geo.vh);

// where each panel sits, and whether the stage is actually pinned there
for (let i = 0; i < CENTRES.length; i++) {
  const y = Math.round(geo.wrapTop + travel * CENTRES[i]);
  await p.evaluate((t) => window.scrollTo(0, t), y);
  await p.waitForTimeout(650);
  const s = await p.evaluate(() => {
    const sticky = document.querySelector('section[aria-label="How the studio works"]');
    const track = sticky.querySelector("div");
    const m = new DOMMatrixReadOnly(getComputedStyle(track).transform);
    const r = sticky.getBoundingClientRect();
    const h2s = [...track.querySelectorAll("h2")].map((h) => {
      const b = h.getBoundingClientRect();
      return { t: h.textContent.trim(), cx: Math.round(b.left + b.width / 2) };
    });
    const centred = h2s.reduce((a, c) =>
      Math.abs(c.cx - window.innerWidth / 2) < Math.abs(a.cx - window.innerWidth / 2) ? c : a
    );
    const on = [...document.querySelectorAll(".pt-mark")].findIndex((el) =>
      el.classList.contains("pt-mark--on")
    );
    // the ground under the middle of the viewport
    const mid = document.elementFromPoint(window.innerWidth / 2, 8);
    return {
      stickyTop: Math.round(r.top),
      x: Math.round(m.m41),
      xVw: +(m.m41 / window.innerWidth).toFixed(3),
      centred: centred.t,
      centredOffset: Math.round(centred.cx - window.innerWidth / 2),
      activeMark: on,
      bg: mid ? getComputedStyle(mid).backgroundColor : null,
    };
  });
  console.log(`PANEL ${i + 1} @y=${y}`, JSON.stringify(s));
}

await p.screenshot({ path: "/private/tmp/claude-501/-Users-prachetsupadhyay/e9dd0f4b-ba61-4032-9e87-82b09ddfd1d8/scratchpad/p4.png" });
await b.close();
