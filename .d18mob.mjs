import { chromium } from "playwright";
const BASE = "https://averr-git-redesign-v2-prachets-upadhyay-s-projects.vercel.app";
const D = "/private/tmp/claude-501/-Users-prachetsupadhyay/e9dd0f4b-ba61-4032-9e87-82b09ddfd1d8/scratchpad";
const b = await chromium.launch();

{
  const ctx = await b.newContext({ viewport: { width: 375, height: 812 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true });
  const p = await ctx.newPage();
  p.setDefaultTimeout(90000);
  await p.goto(BASE + "/about", { waitUntil: "load", timeout: 90000 });
  await p.waitForTimeout(2400);
  const H = await p.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y <= H; y += 600) { await p.evaluate((t) => window.scrollTo(0, t), y); await p.waitForTimeout(60); }
  await p.waitForTimeout(400);
  console.log("375", JSON.stringify(await p.evaluate(() => {
    const stage = document.querySelector('section[aria-label="How the studio works"]');
    const inStage = [...stage.querySelectorAll("*")]
      .filter((e) => e.children.length === 0 && (e.textContent || "").trim())
      .map((e) => parseFloat(getComputedStyle(e).fontSize));
    const ctrls = [...document.querySelectorAll('.mon-screen button, .mon-screen a, .mon-screen input, .mon-screen [role=slider], .desk-mark, .pl-head')]
      .map((e) => { const r = e.getBoundingClientRect();
        return { t: (e.textContent || e.id || e.getAttribute("aria-label") || e.tagName).trim().slice(0, 22), w: Math.round(r.width), h: Math.round(r.height) }; })
      .filter((c) => c.w > 0 && (c.w < 44 || c.h < 44));
    return { stageMin: Math.min(...inStage), deskControlsUnder44: ctrls, docW: document.documentElement.scrollWidth, monitors: document.querySelectorAll(".mon-screen").length };
  })));

  const grip = p.locator(".dc-grip").first();
  await grip.scrollIntoViewIfNeeded();
  await p.waitForTimeout(600);
  const before = await p.evaluate(() => Number(document.querySelector(".dc-grip").getAttribute("aria-valuenow")));
  const bb = await grip.boundingBox();
  await p.mouse.move(bb.x + bb.width / 2, bb.y + bb.height / 2);
  await p.mouse.down();
  await p.mouse.move(bb.x + 95, bb.y + bb.height / 2, { steps: 10 });
  await p.mouse.up();
  await p.waitForTimeout(450);
  const after = await p.evaluate(() => Number(document.querySelector(".dc-grip").getAttribute("aria-valuenow")));
  console.log(`375 drag handle by touch: ${before} -> ${after}`);
  await p.screenshot({ path: `${D}/d18-375.png` });
  await ctx.close();
}

{
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
  const r = await ctx.newPage();
  await r.goto(BASE + "/about", { waitUntil: "load", timeout: 90000 });
  await r.waitForTimeout(2200);
  console.log("REDUCED", JSON.stringify(await r.evaluate(() => {
    const node = document.querySelector(".pl-step--on .pl-node");
    const host = document.querySelector('section[aria-label="How the studio works"] > div');
    return {
      stage: getComputedStyle(document.querySelector('section[aria-label="How the studio works"]')).position,
      scanlines: document.querySelectorAll(".mon-scan").length,
      flyClip: host ? getComputedStyle(host).clipPath : "(stacked)",
      nodePulse: node ? getComputedStyle(node).animationName : "(none on screen)",
      docW: document.documentElement.scrollWidth,
    };
  })));
  await ctx.close();
}
await b.close();
