import { chromium } from "playwright";
const BASE = "https://averr-git-redesign-v2-prachets-upadhyay-s-projects.vercel.app";
const DIR = "/private/tmp/claude-501/-Users-prachetsupadhyay/e9dd0f4b-ba61-4032-9e87-82b09ddfd1d8/scratchpad";
const CENTRES = [0.04, 0.335, 0.665, 0.96];

const b = await chromium.launch();

/* ── full page, 1440 and 375 ─────────────────────────────────────── */
for (const v of [{ w: 1440, h: 900, n: "1440" }, { w: 375, h: 812, n: "375" }]) {
  const p = await b.newPage({ viewport: { width: v.w, height: v.h } });
  await p.goto(BASE + "/about", { waitUntil: "load" });
  await p.waitForTimeout(2500);
  const h = await p.evaluate(() => document.documentElement.scrollHeight);
  await p.screenshot({ path: `${DIR}/after-about-${v.n}-full.png`, fullPage: true });
  console.log(`AFTER full ${v.n}: height=${h}`);
  await p.close();
}

/* ── the four panel midpoints, and each demo mid-interaction ─────── */
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto(BASE + "/about", { waitUntil: "load" });
await p.waitForTimeout(2000);
const base = await p.evaluate(() => {
  const s = document.querySelector('section[aria-label="How the studio works"]');
  const w = s.parentElement;
  return { top: w.getBoundingClientRect().top + window.scrollY, travel: w.offsetHeight - window.innerHeight };
});
async function toPanel(i) {
  await p.evaluate((t) => window.scrollTo(0, t), Math.round(base.top + base.travel * CENTRES[i]));
  await p.waitForTimeout(700);
}

for (let i = 0; i < 4; i++) {
  await toPanel(i);
  await p.screenshot({ path: `${DIR}/after-panel-0${i + 1}.png` });
  console.log(`panel 0${i + 1} captured`);
}

// 01 mid-interaction: the card crafted
await toPanel(0);
await p.locator(".ttc-card").first().hover();
await p.waitForTimeout(120);
await p.screenshot({ path: `${DIR}/after-demo-01-rebuilding.png` });
await p.waitForTimeout(600);
await p.screenshot({ path: `${DIR}/after-demo-01-crafted.png` });
console.log("01 mid-rebuild + crafted captured");

// 02 mid-assemble
await toPanel(1);
await p.locator(".ds-replay").first().click();
await p.waitForTimeout(170);
await p.screenshot({ path: `${DIR}/after-demo-02-assembling.png` });
await p.waitForTimeout(1000);
await p.screenshot({ path: `${DIR}/after-demo-02-assembled.png` });
console.log("02 assembling + assembled captured");

// 03 the dot mid-track on each curve
await toPanel(2);
await p.locator(".ml-seg").nth(0).click();
await p.waitForTimeout(330);
await p.screenshot({ path: `${DIR}/after-demo-03-linear.png` });
await p.locator(".ml-seg").nth(1).click();
await p.waitForTimeout(330);
await p.screenshot({ path: `${DIR}/after-demo-03-eased.png` });
console.log("03 linear + eased captured");

// 04 both years
await toPanel(3);
await p.screenshot({ path: `${DIR}/after-demo-04-2026.png` });
await p.evaluate(() => document.getElementById("ages-well-year").focus());
for (let i = 0; i < 3; i++) { await p.keyboard.press("ArrowRight"); await p.waitForTimeout(140); }
await p.waitForTimeout(600);
await p.screenshot({ path: `${DIR}/after-demo-04-2029.png` });
console.log("04 2026 + 2029 captured");

await p.close();

/* ── the stack at 375 ────────────────────────────────────────────── */
const m = await b.newPage({ viewport: { width: 375, height: 812 }, deviceScaleFactor: 2 });
await m.goto(BASE + "/about", { waitUntil: "load" });
await m.waitForTimeout(1800);
await m.locator('section[aria-label="How the studio works"] h2').first().scrollIntoViewIfNeeded();
await m.waitForTimeout(500);
await m.screenshot({ path: `${DIR}/after-375-principle-01.png` });
await m.locator("#ages-well-year").scrollIntoViewIfNeeded();
await m.waitForTimeout(500);
await m.screenshot({ path: `${DIR}/after-375-principle-04.png` });
console.log("375 stacked panels captured");
await m.close();

await b.close();
