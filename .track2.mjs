import { chromium } from "playwright";

const BASE = "https://averr-git-redesign-v2-prachets-upadhyay-s-projects.vercel.app";
const CENTRES = [0.04, 0.335, 0.665, 0.96];

const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto(BASE + "/about", { waitUntil: "networkidle" });
await p.waitForTimeout(1000);

const base = await p.evaluate(() => {
  const sticky = document.querySelector('section[aria-label="How the studio works"]');
  const wrap = sticky.parentElement;
  return { top: wrap.getBoundingClientRect().top + window.scrollY, travel: wrap.offsetHeight - window.innerHeight };
});

// ── 1. the dwell profile: x across the whole travel ──────────────
const prof = [];
for (let s = 0; s <= 1.0001; s += 0.05) {
  await p.evaluate((t) => window.scrollTo(0, t), Math.round(base.top + base.travel * s));
  await p.waitForTimeout(260);
  const x = await p.evaluate(() => {
    const tr = document.querySelector('section[aria-label="How the studio works"] div');
    return +(new DOMMatrixReadOnly(getComputedStyle(tr).transform).m41 / window.innerWidth).toFixed(2);
  });
  prof.push(`${s.toFixed(2)}:${x}`);
}
console.log("DWELL", prof.join("  "));

// ── 2. per panel: ground, ink, clipping ──────────────────────────
for (let i = 0; i < 4; i++) {
  await p.evaluate((t) => window.scrollTo(0, t), Math.round(base.top + base.travel * CENTRES[i]));
  await p.waitForTimeout(600);
  const r = await p.evaluate((idx) => {
    const tr = document.querySelector('section[aria-label="How the studio works"] div');
    const panel = tr.children[idx];
    const h2 = panel.querySelector("h2");
    const body = panel.querySelector("p");
    const demo = panel.querySelector(".pt-demo > div");
    // the frame's content box is the second child of the frame
    const inner = demo ? demo.children[1] : null;
    const eyebrow = panel.querySelector(".type-eyebrow");
    const sizes = [...panel.querySelectorAll("*")]
      .map((el) => parseFloat(getComputedStyle(el).fontSize))
      .filter((n) => n > 0);
    return {
      ground: getComputedStyle(panel).backgroundColor,
      h2Color: getComputedStyle(h2).color,
      bodyColor: getComputedStyle(body).color,
      eyebrow: eyebrow.textContent.trim(),
      demoH: demo ? demo.clientHeight : null,
      innerScroll: inner ? inner.scrollHeight : null,
      innerClient: inner ? inner.clientHeight : null,
      clipped: inner ? inner.scrollHeight - inner.clientHeight : null,
      minFont: Math.min(...sizes),
      grain: !!panel.querySelector(".grain-dark"),
    };
  }, i);
  console.log(`P${i + 1}`, JSON.stringify(r));
}

// ── 3. no ViewTimeline anywhere on the stage ─────────────────────
const vt = await p.evaluate(() => {
  const sticky = document.querySelector('section[aria-label="How the studio works"]');
  let n = 0;
  for (const el of sticky.querySelectorAll("*")) {
    const cs = getComputedStyle(el);
    if (cs.animationTimeline && cs.animationTimeline !== "auto") n++;
    if (cs.viewTimelineName && cs.viewTimelineName !== "none") n++;
  }
  return n;
});
console.log("VIEWTIMELINE on stage descendants:", vt);

// ── 4. page-wide overflow at 1440 ────────────────────────────────
const ov = await p.evaluate(() => ({
  docW: document.documentElement.scrollWidth,
  win: window.innerWidth,
}));
console.log("OVERFLOW 1440", JSON.stringify(ov));

await b.close();
