import { chromium } from "playwright";
const BASE = "https://averr-git-redesign-v2-prachets-upadhyay-s-projects.vercel.app";
const D = "/private/tmp/claude-501/-Users-prachetsupadhyay/e9dd0f4b-ba61-4032-9e87-82b09ddfd1d8/scratchpad";
const b = await chromium.launch();

/* ── keyboard-only completion ────────────────────────────────────── */
{
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  await p.goto(BASE + "/contact?mockSend=1", { waitUntil: "load", timeout: 90000 });
  await p.waitForTimeout(2200);
  await p.evaluate(() => document.getElementById("brief").scrollIntoView({ block: "start" }));
  await p.waitForTimeout(800);
  // tab in from the top of the form
  await p.evaluate(() => document.querySelector(".bs-input").focus());
  await p.keyboard.type("Sam Okafor");
  await p.keyboard.press("Tab");
  await p.keyboard.type("sam@harbourview.ca");
  await p.keyboard.press("Tab");
  await p.keyboard.type("Harbourview Bakehouse");
  const reached = [];
  for (let i = 0; i < 16; i++) {
    await p.keyboard.press("Tab");
    const el = await p.evaluate(() => {
      const a = document.activeElement;
      return { cls: String(a.className).slice(0, 18), tag: a.tagName, txt: (a.textContent || a.id || "").trim().slice(0, 16) };
    });
    reached.push(`${el.tag}.${el.cls}:${el.txt}`);
    if (el.cls.includes("bs-chip")) { await p.keyboard.press("Enter"); }
    if (el.tag === "TEXTAREA") { await p.keyboard.type("A new site for the bakery."); }
    if (el.cls.includes("magnetic") || el.txt.includes("Send")) break;
  }
  console.log("KEYBOARD path:", JSON.stringify(reached.slice(0, 10)));
  await p.keyboard.press("Enter");
  await p.waitForTimeout(1500);
  console.log("KEYBOARD submit → receipt:", await p.evaluate(() => !!document.querySelector(".bs-receipt")));
  await p.close();
}

/* ── 375 ─────────────────────────────────────────────────────────── */
{
  const ctx = await b.newContext({ viewport: { width: 375, height: 812 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  const p = await ctx.newPage();
  await p.goto(BASE + "/contact", { waitUntil: "load", timeout: 90000 });
  await p.waitForTimeout(2400);
  const H = await p.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y <= H; y += 600) { await p.evaluate((t) => window.scrollTo(0, t), y); await p.waitForTimeout(70); }
  await p.waitForTimeout(600);
  console.log("\n375", JSON.stringify(await p.evaluate(() => {
    const scope = document.querySelector("#brief");
    const texts = [...scope.querySelectorAll("*")]
      .filter((e) => e.children.length === 0 && (e.textContent || "").trim())
      .map((e) => ({ f: parseFloat(getComputedStyle(e).fontSize), t: e.textContent.trim().slice(0, 16) }));
    const ctrls = [...document.querySelectorAll("button, a, input, textarea")]
      .map((e) => { const r = e.getBoundingClientRect();
        return { t: (e.textContent || e.id || e.tagName).trim().slice(0, 16), w: Math.round(r.width), h: Math.round(r.height) }; })
      .filter((c) => c.w > 0 && (c.w < 44 || c.h < 44));
    return {
      previewBelowForm: (() => {
        const f = document.querySelector(".bs-form").getBoundingClientRect();
        const pv = document.querySelector(".bs-preview").getBoundingClientRect();
        return pv.top >= f.top;
      })(),
      previewSticky: getComputedStyle(document.querySelector(".bs-sticky")).position,
      minFont: Math.min(...texts.map((t) => t.f)),
      under13: texts.filter((t) => t.f < 13).slice(0, 4),
      under44: ctrls.slice(0, 5),
      docW: document.documentElement.scrollWidth,
    };
  })));
  await p.evaluate(() => document.getElementById("brief").scrollIntoView({ block: "start" }));
  await p.waitForTimeout(900);
  await p.screenshot({ path: `${D}/c19-375-brief.png` });
  await p.evaluate(() => window.scrollTo(0, 0));
  await p.waitForTimeout(700);
  await p.screenshot({ path: `${D}/c19-375-hero.png` });
  await ctx.close();
}

/* ── reduced motion ──────────────────────────────────────────────── */
{
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
  const p = await ctx.newPage();
  await p.goto(BASE + "/contact?mockSend=1", { waitUntil: "load", timeout: 90000 });
  await p.waitForTimeout(2200);
  await p.evaluate(() => document.getElementById("brief").scrollIntoView({ block: "start" }));
  await p.waitForTimeout(700);
  const f = await p.$$(".bs-input");
  await f[0].fill("Sam"); await f[1].fill("sam@x.ca"); await f[4].fill("A site.");
  await p.locator(".bs-submit button, .bs-submit a").first().click();
  await p.waitForTimeout(1300);
  console.log("\nREDUCED", JSON.stringify(await p.evaluate(() => ({
    draftTransform: getComputedStyle(document.querySelector(".bs-draft")).transform,
    receipt: !!document.querySelector(".bs-receipt"),
    docW: document.documentElement.scrollWidth,
  }))));
  await ctx.close();
}

/* ── palette audit: site tokens only ─────────────────────────────── */
{
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  await p.goto(BASE + "/contact", { waitUntil: "load", timeout: 90000 });
  await p.waitForTimeout(2500);
  const H = await p.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y <= H; y += 700) { await p.evaluate((t) => window.scrollTo(0, t), y); await p.waitForTimeout(60); }
  console.log("\nPALETTE", JSON.stringify(await p.evaluate(() => {
    function odd(c) {
      const m = (c.match(/\d+(\.\d+)?/g) || []).map(Number);
      if (m.length < 3) return false;
      const [r, g, bl] = m;
      if (m.length > 3 && m[3] === 0) return false;
      const mx = Math.max(r, g, bl), mn = Math.min(r, g, bl);
      if (mx - mn < 26) return false;
      if (r >= g && g >= bl) return false;  // warm: cream, gold, ink
      return true;
    }
    const out = [];
    for (const el of document.querySelectorAll("body *")) {
      if (el.closest("iframe")) continue;
      const cs = getComputedStyle(el);
      for (const prop of ["color", "backgroundColor", "borderTopColor"]) {
        const v = cs[prop];
        if (v && v !== "none" && odd(v)) { out.push(`${el.tagName}.${String(el.className).slice(0, 22)} ${prop}=${v}`); break; }
      }
    }
    return out.slice(0, 8);
  })));
  await p.close();
}
await b.close();
