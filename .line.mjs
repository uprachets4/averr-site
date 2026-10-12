import { chromium } from "playwright";
const BASE = "https://averr-git-redesign-v2-prachets-upadhyay-s-projects.vercel.app";
const DIR = "/private/tmp/claude-501/-Users-prachetsupadhyay/e9dd0f4b-ba61-4032-9e87-82b09ddfd1d8/scratchpad";

const b = await chromium.launch();

/* ── desktop: the line draws, the nodes light in order ──────────── */
{
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  await p.goto(BASE + "/about", { waitUntil: "load" });
  await p.waitForTimeout(1500);
  const geo = await p.evaluate(() => {
    const el = document.querySelector(".pl");
    const r = el.getBoundingClientRect();
    return {
      top: r.top + window.scrollY,
      h: Math.round(r.height),
      w: Math.round(r.width),
      sticky: getComputedStyle(el).position,
      railW: Math.round(document.querySelector(".pl-rail").getBoundingClientRect().width),
      containerWide: getComputedStyle(document.documentElement).getPropertyValue("--container-wide"),
      steps: document.querySelectorAll(".pl-step").length,
    };
  });
  console.log("LINE geo", JSON.stringify(geo));

  // walk the line through the viewport and watch scaleX + lit nodes
  const rows = [];
  for (let y = geo.top - 900; y <= geo.top + geo.h + 100; y += 90) {
    await p.evaluate((t) => window.scrollTo(0, Math.max(0, t)), y);
    await p.waitForTimeout(140);
    rows.push(
      await p.evaluate(() => {
        const d = document.querySelector(".pl-draw");
        const sx = +new DOMMatrixReadOnly(getComputedStyle(d).transform).a.toFixed(3);
        const on = [...document.querySelectorAll(".pl-step")].map((s) =>
          s.classList.contains("pl-step--on") ? 1 : 0
        );
        const texts = [...document.querySelectorAll(".pl-text")].map((t) =>
          +getComputedStyle(t).opacity.slice(0, 4)
        );
        return `sx=${sx} lit=${on.join("")} text=${texts.map((t) => t.toFixed(1)).join(",")}`;
      })
    );
  }
  // only print the rows where something changed
  let prev = "";
  for (const r of rows) {
    const key = r.split(" lit=")[1];
    if (key !== prev) { console.log("  ", r); prev = key; }
  }

  // monotonic order check
  const final = await p.evaluate(() => {
    const on = [...document.querySelectorAll(".pl-step")].map((s) => s.classList.contains("pl-step--on"));
    const weeks = [...document.querySelectorAll(".pl-week")].map((w) => w.textContent.trim());
    const names = [...document.querySelectorAll(".pl-name")].map((w) => w.textContent.trim());
    const wk = getComputedStyle(document.querySelector(".pl-week"));
    return { allLit: on.every(Boolean), weeks, names, weekFont: wk.fontFamily.split(",")[0], weekSize: wk.fontSize };
  });
  console.log("LINE final", JSON.stringify(final));
  await p.evaluate(() => document.querySelector(".pl").scrollIntoView({ block: "center" }));
  await p.waitForTimeout(900);
  await p.screenshot({ path: `${DIR}/after-process-line-1440.png` });
  await p.close();
}

/* ── 375: the same line, vertical ───────────────────────────────── */
{
  const p = await b.newPage({ viewport: { width: 375, height: 812 }, deviceScaleFactor: 2 });
  await p.goto(BASE + "/about", { waitUntil: "load" });
  await p.waitForTimeout(1500);
  await p.evaluate(() => document.querySelector(".pl").scrollIntoView({ block: "center" }));
  await p.waitForTimeout(1200);
  console.log("375 line", JSON.stringify(await p.evaluate(() => {
    const el = document.querySelector(".pl");
    const rail = document.querySelector(".pl-rail").getBoundingClientRect();
    return {
      vertical: el.classList.contains("pl--v"),
      railW: Math.round(rail.width), railH: Math.round(rail.height),
      lit: [...document.querySelectorAll(".pl-step")].map((s) => (s.classList.contains("pl-step--on") ? 1 : 0)).join(""),
      docW: document.documentElement.scrollWidth, win: window.innerWidth,
    };
  })));
  await p.screenshot({ path: `${DIR}/after-process-line-375.png` });
  await p.close();
}

/* ── reduced motion: everything final ───────────────────────────── */
{
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
  const p = await ctx.newPage();
  await p.goto(BASE + "/about", { waitUntil: "load" });
  await p.waitForTimeout(1200);
  console.log("REDUCED line", JSON.stringify(await p.evaluate(() => {
    const d = document.querySelector(".pl-draw");
    return {
      scaleX: +new DOMMatrixReadOnly(getComputedStyle(d).transform).a.toFixed(2),
      lit: [...document.querySelectorAll(".pl-step")].map((s) => (s.classList.contains("pl-step--on") ? 1 : 0)).join(""),
      textOpacity: [...document.querySelectorAll(".pl-text")].map((t) => getComputedStyle(t).opacity),
    };
  })));
  await ctx.close();
}

await b.close();
