import { chromium } from "playwright";
const BASE = "https://averr-git-redesign-v2-prachets-upadhyay-s-projects.vercel.app";
const D = "/private/tmp/claude-501/-Users-prachetsupadhyay/e9dd0f4b-ba61-4032-9e87-82b09ddfd1d8/scratchpad";
const CENTRES = [0.045, 0.34, 0.66, 0.955];
const W = Number(process.argv[2] || 1440);
const H = Number(process.argv[3] || 900);

const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: W, height: H } });
const errs = [];
p.on("pageerror", (e) => errs.push(String(e).slice(0, 120)));
await p.goto(BASE + "/about", { waitUntil: "load" });
await p.waitForTimeout(2500);

const geo = await p.evaluate(() => {
  const s = document.querySelector('section[aria-label="How the studio works"]');
  if (!s) return { error: "no desk" };
  const w = s.parentElement;
  return {
    top: w.getBoundingClientRect().top + window.scrollY,
    wrapH: w.offsetHeight,
    travel: w.offsetHeight - window.innerHeight,
    vh: window.innerHeight,
    sticky: getComputedStyle(s).position,
    screens: document.querySelectorAll(".desk-slot").length,
    marks: document.querySelectorAll(".desk-mark").length,
    monW: Math.round(document.querySelector(".mon-screen").getBoundingClientRect().width),
    monH: Math.round(document.querySelector(".mon-screen").getBoundingClientRect().height),
  };
});
console.log("DESK", JSON.stringify(geo));
if (geo.error) { await b.close(); process.exit(1); }
console.log(`  wrapper ${geo.wrapH}px = ${(geo.wrapH / geo.vh).toFixed(1)}vh, travel ${geo.travel}px = ${(geo.travel / geo.vh).toFixed(1)}vh (n+1 wants ${4}×100vh travel)`);

// the dolly, on approach
for (const d of [-0.9, -0.5, -0.15, 0]) {
  await p.evaluate((y) => window.scrollTo(0, Math.max(0, y)), Math.round(geo.top + geo.vh * d));
  await p.waitForTimeout(250);
  const m = await p.evaluate(() => {
    const el = document.querySelector(".mon-body");
    const t = new DOMMatrixReadOnly(getComputedStyle(el).transform);
    return { scale: +t.a.toFixed(3), m: getComputedStyle(el).transform.slice(0, 18) };
  });
  console.log(`  approach ${d}vh → dolly scale ${m.scale}`);
}

// each screen at its dwell
for (let i = 0; i < 4; i++) {
  await p.evaluate((y) => window.scrollTo(0, y), Math.round(geo.top + geo.travel * CENTRES[i]));
  await p.waitForTimeout(900);
  const s = await p.evaluate((idx) => {
    const slots = [...document.querySelectorAll(".desk-slot")];
    const cap = document.querySelector('section[aria-label="How the studio works"] h2');
    const eyebrow = document.querySelector('section[aria-label="How the studio works"] .type-eyebrow');
    const spill = document.querySelector(".mon-spill");
    const on = [...document.querySelectorAll(".desk-mark")].findIndex((m) => m.classList.contains("desk-mark--on"));
    const sticky = document.querySelector('section[aria-label="How the studio works"]').getBoundingClientRect();
    // smallest rendered font inside the live screen
    const live = slots[idx];
    const sizes = [...live.querySelectorAll("*")]
      .filter((e) => (e.textContent || "").trim() && e.children.length === 0)
      .map((e) => parseFloat(getComputedStyle(e).fontSize));
    return {
      stickyTop: Math.round(sticky.top),
      opacities: slots.map((s) => +getComputedStyle(s).opacity.slice(0, 4)),
      inert: slots.map((s) => (s.hasAttribute("inert") ? 1 : 0)).join(""),
      caption: cap ? cap.textContent.trim() : null,
      eyebrow: eyebrow ? eyebrow.textContent.trim() : null,
      spill: getComputedStyle(spill).backgroundImage.match(/rgba?\([^)]*\)/)?.[0] ?? "?",
      activeMark: on,
      minFont: sizes.length ? Math.min(...sizes) : null,
    };
  }, i);
  console.log(`SCREEN ${i + 1}`, JSON.stringify(s));
  await p.screenshot({ path: `${D}/desk-${W}-screen-0${i + 1}.png` });
}

console.log("page errors:", errs.length ? errs.join(" | ") : 0);
await b.close();
