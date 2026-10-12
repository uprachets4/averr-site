import { chromium } from "playwright";
const BASE = "https://averr-git-redesign-v2-prachets-upadhyay-s-projects.vercel.app";
const D = "/private/tmp/claude-501/-Users-prachetsupadhyay/e9dd0f4b-ba61-4032-9e87-82b09ddfd1d8/scratchpad";
const CENTRES = [0.045, 0.34, 0.66, 0.955];

const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
const errs = [];
p.on("pageerror", (e) => errs.push(String(e).slice(0, 110)));
await p.goto(BASE + "/about", { waitUntil: "load" });
await p.waitForTimeout(2500);
const g = await p.evaluate(() => {
  const s = document.querySelector('section[aria-label="How the studio works"]');
  const w = s.parentElement;
  return { top: w.getBoundingClientRect().top + window.scrollY, travel: w.offsetHeight - window.innerHeight };
});
const go = async (i) => {
  await p.evaluate((y) => window.scrollTo(0, y), Math.round(g.top + g.travel * CENTRES[i]));
  await p.waitForTimeout(900);
};

/* ── 01 drag to compare: pointer + keyboard ──────────────────────── */
await go(0);
const now = () => p.evaluate(() => Number(document.querySelector(".dc-grip").getAttribute("aria-valuenow")));
console.log("01 after the arrival sweep:", await now());
const gb = await p.locator(".dc-grip").boundingBox();
await p.mouse.move(gb.x + gb.width / 2, gb.y + gb.height / 2);
await p.mouse.down();
await p.mouse.move(gb.x + 260, gb.y + gb.height / 2, { steps: 12 });
await p.mouse.up();
await p.waitForTimeout(350);
const dragged = await now();
console.log("01 after a pointer drag right:", dragged);
await p.screenshot({ path: `${D}/d18-01-drag.png` });
await p.evaluate(() => document.querySelector(".dc-grip").focus());
await p.keyboard.press("ArrowLeft");
await p.keyboard.press("ArrowLeft");
await p.waitForTimeout(250);
const kb = await now();
console.log(`01 after two ArrowLefts: ${kb} (was ${dragged})`);
console.log("01 clip tracks the handle:", await p.evaluate(() => getComputedStyle(document.querySelector(".dc-cut")).clipPath));
// template-half legibility
console.log("01 template type:", JSON.stringify(await p.evaluate(() => {
  const pg = document.querySelectorAll(".pg")[1];
  const h = pg.querySelector(".pg-h");
  return { bg: getComputedStyle(pg).backgroundColor, headColor: getComputedStyle(h).color,
    min: Math.min(...[...pg.querySelectorAll("*")].filter(e=>e.children.length===0&&(e.textContent||"").trim()).map(e=>parseFloat(getComputedStyle(e).fontSize))) };
})));

/* ── 02 click to recolour ────────────────────────────────────────── */
await go(1);
const mini = () => p.evaluate(() => {
  const e = document.querySelector(".sd-mini-eyebrow");
  const h = document.querySelector(".sd-mini-h");
  const r = document.querySelector(".sd-mini-rule");
  return { accent: getComputedStyle(e).color, rule: getComputedStyle(r).backgroundColor,
    face: getComputedStyle(h).fontFamily.split(",")[0], style: getComputedStyle(h).fontStyle };
});
console.log("02 before:", JSON.stringify(await mini()));
await p.locator(".sd-pick").nth(4).click();
await p.waitForTimeout(350);
console.log("02 after clicking swatch 5:", JSON.stringify(await mini()));
await p.evaluate(() => document.querySelectorAll(".sd-face")[1].focus());
await p.keyboard.press("Enter");
await p.waitForTimeout(350);
console.log("02 after Enter on Cormorant:", JSON.stringify(await mini()));
await p.screenshot({ path: `${D}/d18-02-recolour.png` });

/* ── 04 still works ──────────────────────────────────────────────── */
await go(3);
await p.evaluate(() => document.getElementById("desk-year").focus());
for (let i = 0; i < 3; i++) { await p.keyboard.press("ArrowRight"); await p.waitForTimeout(140); }
await p.waitForTimeout(400);
console.log("04 year:", await p.evaluate(() => document.getElementById("desk-year").value),
  "| trend filter:", await p.evaluate(() => getComputedStyle(document.querySelectorAll(".sa-frame")[0]).filter),
  "| calm filter:", await p.evaluate(() => getComputedStyle(document.querySelectorAll(".sa-frame")[1]).filter));

/* ── 05 the process opens ────────────────────────────────────────── */
await p.evaluate(() => document.querySelector("#process").scrollIntoView({ block: "center" }));
await p.waitForTimeout(900);
const heads = p.locator(".pl-head");
console.log("05 stages:", await heads.count(), "| expanded before:", await p.evaluate(() =>
  [...document.querySelectorAll(".pl-head")].map((h) => h.getAttribute("aria-expanded")).join(",")));
await heads.nth(1).click();
await p.waitForTimeout(500);
console.log("05 after clicking 02:", await p.evaluate(() => ({
  expanded: [...document.querySelectorAll(".pl-head")].map((h) => h.getAttribute("aria-expanded")).join(","),
  panelText: (document.querySelector(".pl-body") || {}).textContent?.slice(0, 44),
  controls: document.querySelector(".pl-head[aria-expanded=true]").getAttribute("aria-controls"),
})));
await p.evaluate(() => document.querySelectorAll(".pl-head")[3].focus());
await p.keyboard.press("Enter");
await p.waitForTimeout(500);
console.log("05 after Enter on 04 (one at a time):", await p.evaluate(() =>
  [...document.querySelectorAll(".pl-head")].map((h) => h.getAttribute("aria-expanded")).join(",")));
await p.screenshot({ path: `${D}/d18-05-process.png` });

/* ── the founder note is gone ────────────────────────────────────── */
console.log("founder note present:", await p.evaluate(() => document.body.innerText.includes("Grid absorbs")));
console.log("page errors:", errs.length ? errs.join(" | ") : 0);
await b.close();
