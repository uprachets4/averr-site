import { chromium } from "playwright";
const BASE = "https://averr-git-redesign-v2-prachets-upadhyay-s-projects.vercel.app";
const b = await chromium.launch();

/* ── a short laptop: does the sheet still fit? ───────────────────── */
{
  const p = await b.newPage({ viewport: { width: 1440, height: 700 } });
  await p.goto(BASE + "/about", { waitUntil: "load" });
  await p.waitForTimeout(900);
  const base = await p.evaluate(() => {
    const s = document.querySelector('section[aria-label="How the studio works"]');
    const w = s.parentElement;
    return { top: w.getBoundingClientRect().top + window.scrollY, travel: w.offsetHeight - window.innerHeight };
  });
  const out = [];
  for (const [i, c] of [0.04, 0.335, 0.665, 0.96].entries()) {
    await p.evaluate((t) => window.scrollTo(0, t), Math.round(base.top + base.travel * c));
    await p.waitForTimeout(450);
    out.push(
      await p.evaluate((idx) => {
        const tr = document.querySelector('section[aria-label="How the studio works"] div');
        const inner = tr.children[idx].querySelector(".pt-demo > div").children[1];
        return `P${idx + 1} clip=${inner.scrollHeight - inner.clientHeight}`;
      }, i)
    );
  }
  console.log("1440x700", out.join("  "));
  await p.close();
}

/* ── reduced motion at 1440: stacked, settled, no track ──────────── */
{
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
  const p = await ctx.newPage();
  await p.goto(BASE + "/about", { waitUntil: "load" });
  await p.waitForTimeout(1200);
  const r = await p.evaluate(() => {
    const stage = document.querySelector('section[aria-label="How the studio works"]');
    const sticky = getComputedStyle(stage).position;
    const h2s = [...stage.querySelectorAll("h2")].map((h) => h.textContent.trim());
    const sw = stage.querySelectorAll("span[style*='border-radius: 8px']");
    const opacities = [...sw].map((s) => +getComputedStyle(s.parentElement).opacity.slice(0, 4));
    return {
      stagePosition: sticky,
      hasTrack: !!stage.querySelector("div[style*='400vw']"),
      headings: h2s.length,
      firstHeading: h2s[0],
      swatchOpacity: opacities,
      docW: document.documentElement.scrollWidth,
      win: window.innerWidth,
    };
  });
  console.log("REDUCED", JSON.stringify(r));
  await ctx.close();
}

/* ── 375: stacked, interactive, no overflow, 11px floor ──────────── */
{
  const p = await b.newPage({ viewport: { width: 375, height: 812 }, deviceScaleFactor: 2 });
  await p.goto(BASE + "/about", { waitUntil: "load" });
  await p.waitForTimeout(1200);
  const r = await p.evaluate(() => {
    const stage = document.querySelector('section[aria-label="How the studio works"]');
    const h2s = [...stage.querySelectorAll("h2")].map((h) => h.textContent.trim());
    const fonts = [...stage.querySelectorAll("*")]
      .map((el) => ({ f: parseFloat(getComputedStyle(el).fontSize), t: (el.textContent || "").trim().slice(0, 22) }))
      .filter((o) => o.f > 0 && o.t.length);
    const min = fonts.reduce((a, c) => (c.f < a.f ? c : a));
    return {
      headings: h2s,
      stagePosition: getComputedStyle(stage).position,
      minFont: min.f,
      minFontText: min.t,
      docW: document.documentElement.scrollWidth,
      win: window.innerWidth,
      marks: document.querySelectorAll(".pt-mark").length,
    };
  });
  console.log("375", JSON.stringify(r));

  // the card toggles by tap
  const card = p.locator(".ttc-card").first();
  await card.scrollIntoViewIfNeeded();
  await card.click();
  await p.waitForTimeout(500);
  console.log("375 card after tap:", await p.evaluate(() => {
    const f = document.querySelector(".ttc-card").closest(".pt-demo, div[style*='border-radius: 14px']");
    return document.querySelector(".ttc-card").closest("div[style*='flex-direction: column']")
      ? [...document.querySelectorAll("span")].find((s) => ["Template", "Crafted"].includes(s.textContent.trim()))?.textContent.trim()
      : null;
  }));

  // the slider still drives only the trend half
  const slider = p.locator("#ages-well-year");
  await slider.scrollIntoViewIfNeeded();
  await p.waitForTimeout(300);
  const g0 = await p.evaluate(() => {
    const m = document.querySelectorAll("div[style*='aspect-ratio']");
    return [getComputedStyle(m[0]).filter, getComputedStyle(m[1]).filter];
  });
  await slider.focus();
  await p.keyboard.press("ArrowRight");
  await p.keyboard.press("ArrowRight");
  await p.waitForTimeout(500);
  const g1 = await p.evaluate(() => {
    const m = document.querySelectorAll("div[style*='aspect-ratio']");
    return [getComputedStyle(m[0]).filter, getComputedStyle(m[1]).filter, document.getElementById("ages-well-year").value];
  });
  console.log("375 slider: before", JSON.stringify(g0), "after", JSON.stringify(g1));
  await p.close();
}

/* ── 1920 overflow ───────────────────────────────────────────────── */
{
  const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
  await p.goto(BASE + "/about", { waitUntil: "load" });
  await p.waitForTimeout(900);
  console.log("1920", JSON.stringify(await p.evaluate(() => ({
    docW: document.documentElement.scrollWidth, win: window.innerWidth,
  }))));
  await p.close();
}

await b.close();
