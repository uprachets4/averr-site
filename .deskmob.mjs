import { chromium } from "playwright";
const BASE = "https://averr-git-redesign-v2-prachets-upadhyay-s-projects.vercel.app";
const D = "/private/tmp/claude-501/-Users-prachetsupadhyay/e9dd0f4b-ba61-4032-9e87-82b09ddfd1d8/scratchpad";
const b = await chromium.launch();

/* ── 375: stacked, framed, interactive, ≥13px, ≥44px, no overflow ── */
{
  const p = await b.newPage({ viewport: { width: 375, height: 812 }, deviceScaleFactor: 2 });
  const errs = [];
  p.on("pageerror", (e) => errs.push(String(e).slice(0, 100)));
  await p.goto(BASE + "/about", { waitUntil: "load" });
  await p.waitForTimeout(2200);
  // walk the page so everything mounts
  const H = await p.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y <= H; y += 600) {
    await p.evaluate((t) => window.scrollTo(0, t), y);
    await p.waitForTimeout(70);
  }
  await p.waitForTimeout(500);
  const r = await p.evaluate(() => {
    const stage = document.querySelector('section[aria-label="How the studio works"]');
    const texts = [...document.querySelectorAll("body *")]
      .filter((e) => e.children.length === 0 && (e.textContent || "").trim())
      .map((e) => ({ f: parseFloat(getComputedStyle(e).fontSize), t: e.textContent.trim().slice(0, 20) }));
    const small = texts.filter((o) => o.f < 13).slice(0, 5);
    const controls = [...document.querySelectorAll("button, a, input[type=range]")]
      .map((e) => { const b = e.getBoundingClientRect(); return { t: (e.textContent || e.id || e.tagName).trim().slice(0, 18), w: Math.round(b.width), h: Math.round(b.height) }; })
      .filter((c) => c.w > 0 && c.h > 0 && (c.w < 44 || c.h < 44));
    return {
      stagePosition: getComputedStyle(stage).position,
      monitors: document.querySelectorAll(".mon-screen").length,
      headings: [...stage.querySelectorAll("h2")].map((h) => h.textContent.trim()),
      minFont: Math.min(...texts.map((o) => o.f)),
      under13: small,
      under44: controls,
      docW: document.documentElement.scrollWidth,
      win: window.innerWidth,
    };
  });
  console.log("375", JSON.stringify(r, null, 1));
  console.log("375 page errors:", errs.length ? errs.join(" | ") : 0);

  // the screens still work by touch
  await p.locator(".sc-page").first().scrollIntoViewIfNeeded();
  await p.waitForTimeout(400);
  await p.locator(".sc-page").first().click();
  await p.waitForTimeout(600);
  console.log("375 card after tap:", await p.evaluate(() => document.querySelector(".sc-state").textContent.trim().split(/\s{2,}/)[0]));
  await p.screenshot({ path: `${D}/mob-375-screen01.png` });

  const slider = p.locator("#desk-year");
  await slider.scrollIntoViewIfNeeded();
  await p.waitForTimeout(400);
  const g0 = await p.evaluate(() => [...document.querySelectorAll(".sa-frame")].map((f) => getComputedStyle(f).filter));
  await slider.focus();
  await p.keyboard.press("ArrowRight");
  await p.keyboard.press("ArrowRight");
  await p.waitForTimeout(500);
  const g1 = await p.evaluate(() => [...document.querySelectorAll(".sa-frame")].map((f) => getComputedStyle(f).filter));
  console.log("375 slider before", JSON.stringify(g0), "after", JSON.stringify(g1));
  await p.screenshot({ path: `${D}/mob-375-screen04.png` });
  await p.close();
}

/* ── reduced motion ───────────────────────────────────────────────── */
{
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
  const p = await ctx.newPage();
  await p.goto(BASE + "/about", { waitUntil: "load" });
  await p.waitForTimeout(2200);
  const r = await p.evaluate(() => {
    const stage = document.querySelector('section[aria-label="How the studio works"]');
    const lamp = document.querySelector(".ad-lamp");
    return {
      stagePosition: getComputedStyle(stage).position,
      monitors: document.querySelectorAll(".mon-screen").length,
      headings: stage.querySelectorAll("h2").length,
      scanlines: document.querySelectorAll(".mon-scan").length,
      lampAnimation: lamp ? getComputedStyle(lamp).animationName : null,
      dolly: getComputedStyle(document.querySelector(".mon-body")).transform,
      swatchOpacity: [...document.querySelectorAll(".sd-sw")].slice(0, 3).map((e) => getComputedStyle(e).opacity),
      readFillP: [...document.querySelectorAll(".read-fill")].slice(0, 3).map((e) => e.style.getPropertyValue("--p")),
      docW: document.documentElement.scrollWidth,
    };
  });
  console.log("REDUCED", JSON.stringify(r));
  await ctx.close();
}

/* ── 1920 ─────────────────────────────────────────────────────────── */
{
  const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
  await p.goto(BASE + "/about", { waitUntil: "load" });
  await p.waitForTimeout(2200);
  const g = await p.evaluate(() => {
    const s = document.querySelector('section[aria-label="How the studio works"]');
    const w = s.parentElement;
    return { top: w.getBoundingClientRect().top + window.scrollY, travel: w.offsetHeight - window.innerHeight };
  });
  for (const [i, c] of [0.045, 0.34, 0.66, 0.955].entries()) {
    await p.evaluate((y) => window.scrollTo(0, y), Math.round(g.top + g.travel * c));
    await p.waitForTimeout(800);
    await p.screenshot({ path: `${D}/desk-1920-screen-0${i + 1}.png` });
  }
  console.log("1920 captured; docW", await p.evaluate(() => document.documentElement.scrollWidth));
  await p.close();
}

await b.close();
