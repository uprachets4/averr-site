import { chromium } from "playwright";
const BASE = "https://averr-git-redesign-v2-prachets-upadhyay-s-projects.vercel.app";
const D = "/private/tmp/claude-501/-Users-prachetsupadhyay/e9dd0f4b-ba61-4032-9e87-82b09ddfd1d8/scratchpad";
const CENTRES = [0.045, 0.24, 0.44, 0.64, 0.9];
const W = Number(process.argv[2] || 1440), H = Number(process.argv[3] || 900);

const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: W, height: H } });
const errs = [];
p.on("pageerror", (e) => errs.push(String(e).slice(0, 110)));
await p.goto(BASE + "/about", { waitUntil: "load", timeout: 90000 });
await p.waitForTimeout(2500);

const g = await p.evaluate(() => {
  const st = document.querySelector(".ps-sticky");
  if (!st) return { error: "no scene" };
  const w = st.parentElement;
  return {
    top: w.getBoundingClientRect().top + window.scrollY,
    wrapH: w.offsetHeight,
    travel: w.offsetHeight - window.innerHeight,
    vh: window.innerHeight,
    stages: document.querySelectorAll(".ps-stage").length,
  };
});
console.log("SCENE", JSON.stringify(g));
if (g.error) { await b.close(); process.exit(1); }
console.log(`  wrapper ${(g.wrapH / g.vh).toFixed(1)}vh, travel ${(g.travel / g.vh).toFixed(1)}vh (5 stages + the n+1 viewport)`);

const read = () => p.evaluate(() => {
  const on = [...document.querySelectorAll(".ps-stage")].findIndex((s) => s.classList.contains("ps-stage--on"));
  const head = document.querySelector(".ps-head");
  const say = document.querySelector(".ps-say p");
  const host = document.querySelector(".sw-host");
  const live = document.querySelector(".sw-live");
  const sketch = document.querySelector(".ep-sketch");
  const code = document.querySelector(".ep-code");
  const pins = [...document.querySelectorAll(".ep-pin")];
  const score = document.querySelector(".ep-score-n");
  const cta = document.querySelector(".ep-cta");
  const sticky = document.querySelector(".ps-sticky").getBoundingClientRect();
  return {
    stickyTop: Math.round(sticky.top),
    active: on,
    week: document.querySelectorAll(".ps-sweek")[on]?.textContent,
    headLeft: head ? getComputedStyle(head).left : null,
    say: say ? say.textContent.slice(0, 38) : null,
    host: host ? host.textContent : null,
    liveOpacity: live ? getComputedStyle(live).opacity : null,
    sketchOpacity: sketch ? getComputedStyle(sketch).opacity : null,
    codeOpacity: code ? getComputedStyle(code).opacity : null,
    codeChars: code ? code.textContent.length : 0,
    pinsVisible: pins.filter((x) => +getComputedStyle(x).opacity > 0.5).length,
    pinsDone: pins.filter((x) => x.classList.contains("ep-pin--done")).length,
    score: score ? score.textContent : null,
    ctaDisabled: cta ? cta.disabled : null,
  };
});

for (let i = 0; i < 5; i++) {
  await p.evaluate((y) => window.scrollTo(0, y), Math.round(g.top + g.travel * CENTRES[i]));
  await p.waitForTimeout(1100);
  console.log(`STAGE ${i + 1}`, JSON.stringify(await read()));
  await p.screenshot({ path: `${D}/ps-${W}-stage-${i + 1}.png` });
}

// morph frames between Design and Build — no cut, no blank
console.log("— morph, Design → Build —");
for (const f of [0.49, 0.53, 0.56, 0.59]) {
  await p.evaluate((y) => window.scrollTo(0, y), Math.round(g.top + g.travel * f));
  await p.waitForTimeout(260);
  const m = await p.evaluate(() => {
    const page = document.querySelector(".ep-page");
    const logo = document.querySelector(".ep-logo");
    return {
      pageOpacity: getComputedStyle(page).opacity,
      logoText: logo.textContent,
      codeX: getComputedStyle(document.querySelector(".ep-code")).transform.slice(0, 30),
      windowBg: getComputedStyle(document.querySelector(".sw-viewport")).backgroundColor,
    };
  });
  console.log(`  p=${f}`, JSON.stringify(m));
  await p.screenshot({ path: `${D}/ps-morph-${String(f).replace(".", "")}.png` });
}

// clicking a stage jumps to it
await p.evaluate((y) => window.scrollTo(0, y), Math.round(g.top + g.travel * CENTRES[0]));
await p.waitForTimeout(700);
await p.locator(".ps-stage").nth(4).click();
await p.waitForTimeout(1600);
const j = await read();
console.log("CLICK stage 05 →", JSON.stringify({ active: j.active, host: j.host, live: j.liveOpacity }),
  "expected y≈", Math.round(g.top + g.travel * CENTRES[4]), "actual", await p.evaluate(() => Math.round(window.scrollY)));

// the Build buttons are live
await p.evaluate((y) => window.scrollTo(0, y), Math.round(g.top + g.travel * CENTRES[2]));
await p.waitForTimeout(900);
const before = await p.evaluate(() => getComputedStyle(document.querySelector(".ep-cta")).backgroundColor);
await p.locator(".ep-cta").hover();
await p.waitForTimeout(350);
const after = await p.evaluate(() => getComputedStyle(document.querySelector(".ep-cta")).backgroundColor);
console.log("BUILD cta hover:", before, "→", after, before !== after ? "LIVE" : "NO RESPONSE");
await p.evaluate(() => document.querySelector(".ep-cta").focus());
console.log("BUILD cta focusable:", await p.evaluate(() => document.activeElement.className));

console.log("page errors:", errs.length ? errs.join(" | ") : 0);
await b.close();
