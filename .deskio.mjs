import { chromium } from "playwright";
const BASE = "https://averr-git-redesign-v2-prachets-upadhyay-s-projects.vercel.app";
const D = "/private/tmp/claude-501/-Users-prachetsupadhyay/e9dd0f4b-ba61-4032-9e87-82b09ddfd1d8/scratchpad";
const CENTRES = [0.045, 0.34, 0.66, 0.955];

const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto(BASE + "/about", { waitUntil: "load" });
await p.waitForTimeout(2200);
const g = await p.evaluate(() => {
  const s = document.querySelector('section[aria-label="How the studio works"]');
  const w = s.parentElement;
  return { top: w.getBoundingClientRect().top + window.scrollY, travel: w.offsetHeight - window.innerHeight };
});
const go = async (i) => {
  await p.evaluate((y) => window.scrollTo(0, y), Math.round(g.top + g.travel * CENTRES[i]));
  await p.waitForTimeout(850);
};

/* ── 01: template ↔ crafted, mouse then keyboard ─────────────────── */
await go(0);
const state = () => p.evaluate(() => document.querySelector(".sc-state").textContent.trim().split(/\s{2,}|hover/)[0].trim());
console.log("01 initial:", await state());
await p.locator(".sc-page").hover();
await p.waitForTimeout(500);
console.log("01 hover:", await state());
await p.screenshot({ path: `${D}/io-01-crafted.png` });
await p.mouse.move(30, 30);
await p.waitForTimeout(500);
console.log("01 away:", await state());
await p.evaluate(() => document.querySelector(".sc-page").focus());
await p.waitForTimeout(450);
console.log("01 keyboard focus:", await state(),
  "| ring:", await p.evaluate(() => { const c = getComputedStyle(document.querySelector(".sc-page")); return c.outlineWidth + " " + c.outlineStyle; }));
await p.keyboard.press("Enter");
await p.waitForTimeout(250);
await p.evaluate(() => document.querySelector(".sc-page").blur());
await p.waitForTimeout(450);
console.log("01 Enter pins (after blur):", await state());

/* ── 02: the sheet replays, click then keyboard ──────────────────── */
await go(1);
const sw = () => p.evaluate(() => [...document.querySelectorAll(".sd-sw")].map((e) => +getComputedStyle(e).opacity.slice(0, 4)));
console.log("02 settled on arrival:", JSON.stringify(await sw()));
await p.locator(".sd-replay").click();
await p.waitForTimeout(130);
console.log("02 130ms into replay (click):", JSON.stringify(await sw()));
await p.waitForTimeout(1100);
await p.evaluate(() => document.querySelector(".sd-replay").focus());
await p.keyboard.press("Enter");
await p.waitForTimeout(130);
console.log("02 130ms into replay (keyboard):", JSON.stringify(await sw()));
await p.waitForTimeout(200);
await p.screenshot({ path: `${D}/io-02-assembling.png` });

/* ── 03: the CTA and the two curves ──────────────────────────────── */
await go(2);
const cta = await p.evaluate(() => {
  const el = document.querySelector('.sm-cta button, .sm-cta a');
  return el ? { tag: el.tagName, text: el.textContent.trim(), label: el.getAttribute("aria-label") } : null;
});
console.log("03 MagneticCTA:", JSON.stringify(cta));
const dots = () => p.evaluate(() =>
  [...document.querySelectorAll(".sm-dot")].map((d) => Math.round(new DOMMatrixReadOnly(getComputedStyle(d).transform).m41))
);
await p.locator(".sm-replay").click();
await p.waitForTimeout(360);
const mid = await dots();
console.log(`03 dots at ~360ms — linear ${mid[0]}px, eased ${mid[1]}px (eased should lead)`);
await p.screenshot({ path: `${D}/io-03-midrun.png` });
await p.waitForTimeout(1200);
await p.evaluate(() => document.querySelector(".sm-replay").focus());
await p.keyboard.press("Enter");
await p.waitForTimeout(360);
const midk = await dots();
console.log(`03 keyboard replay at ~360ms — linear ${midk[0]}px, eased ${midk[1]}px`);

/* ── 04: the slider touches one half only ────────────────────────── */
await go(3);
const sig = () => p.evaluate(() => {
  const mocks = [...document.querySelectorAll(".sa-frame")];
  const snap = (el) => [el, ...el.querySelectorAll("*")].map((n) => {
    const c = getComputedStyle(n); const r = n.getBoundingClientRect();
    return [n.tagName, Math.round(r.width), Math.round(r.height), c.filter, c.opacity, c.color, c.backgroundImage.slice(0, 40), c.letterSpacing, c.textShadow].join("|");
  }).join("\n");
  return { trend: snap(mocks[0]), calm: snap(mocks[1]) };
});
const before = await sig();
await p.evaluate(() => document.getElementById("desk-year").focus());
for (let i = 0; i < 3; i++) { await p.keyboard.press("ArrowRight"); await p.waitForTimeout(160); }
await p.waitForTimeout(520);
const after = await sig();
console.log("04 year:", await p.evaluate(() => document.getElementById("desk-year").value));
console.log("04 trend-led changed:", before.trend !== after.trend);
console.log("04 built-to-last IDENTICAL:", before.calm === after.calm);
console.log("04 tag at 2029:", await p.evaluate(() => {
  const t = document.querySelector(".sa-tag"); return t ? `${getComputedStyle(t).opacity} / ${getComputedStyle(t).fontSize}` : "none";
}));
await p.screenshot({ path: `${D}/io-04-2029.png` });

/* ── the hand-off: a mid-change frame, and never blank ───────────── */
await go(2);
await p.evaluate((y) => window.scrollTo(0, y), Math.round(g.top + g.travel * 0.79));
await p.waitForTimeout(120);
const handoff = await p.evaluate(() => {
  const slots = [...document.querySelectorAll(".desk-slot")];
  const scan = document.querySelector(".mon-scan");
  return {
    opacities: slots.map((s) => +getComputedStyle(s).opacity.slice(0, 4)),
    maxOpacity: Math.max(...slots.map((s) => parseFloat(getComputedStyle(s).opacity))),
    scanPresent: !!scan,
    scanTop: scan ? getComputedStyle(scan).top : null,
    screenBg: getComputedStyle(document.querySelector(".mon-screen")).backgroundColor,
  };
});
console.log("HANDOFF mid-change:", JSON.stringify(handoff));
await p.screenshot({ path: `${D}/io-handoff.png` });

/* ── marks jump ───────────────────────────────────────────────────── */
await go(0);
await p.locator(".desk-mark").nth(3).click();
await p.waitForTimeout(1500);
console.log("MARK 04 →", JSON.stringify(await p.evaluate(() => ({
  y: Math.round(window.scrollY),
  on: [...document.querySelectorAll(".desk-mark")].findIndex((m) => m.classList.contains("desk-mark--on")),
}))), "expected y≈", Math.round(g.top + g.travel * CENTRES[3]));

/* ── no ViewTimeline on anything inside the pin ──────────────────── */
console.log("ViewTimeline on stage descendants:", await p.evaluate(() => {
  const s = document.querySelector('section[aria-label="How the studio works"]');
  let n = 0;
  for (const el of s.querySelectorAll("*")) {
    const c = getComputedStyle(el);
    if (c.animationTimeline && c.animationTimeline !== "auto") n++;
    if (c.viewTimelineName && c.viewTimelineName !== "none") n++;
  }
  return n;
}));

await b.close();
