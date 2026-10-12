import { chromium } from "playwright";
const BASE = "https://averr-git-redesign-v2-prachets-upadhyay-s-projects.vercel.app";
const D = "/private/tmp/claude-501/-Users-prachetsupadhyay/e9dd0f4b-ba61-4032-9e87-82b09ddfd1d8/scratchpad";
const b = await chromium.launch();

/* ── home: initial JS, door previews, reel ───────────────────────── */
{
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  const js = [];
  p.on("response", (r) => {
    const u = r.url();
    if (u.includes("/assets/") && u.endsWith(".js")) js.push({ u: u.split("/assets/")[1], n: Number(r.headers()["content-length"] || 0) });
  });
  await p.goto(BASE + "/", { waitUntil: "load", timeout: 90000 });
  await p.waitForTimeout(3000);
  const initial = js.reduce((a, c) => a + c.n, 0);
  console.log("HOME initial JS:", (initial / 1024).toFixed(1), "kB over", js.length, "files");
  console.log("  ", js.map((x) => x.u).join(", "));

  // hover a door → the live preview loads on demand
  const before = js.length;
  const door = p.locator("a,[role=link],li").filter({ hasText: /Design/ }).first();
  await p.evaluate(() => {
    const el = [...document.querySelectorAll("*")].find((e) => /Design/.test(e.textContent || "") && e.closest("section"));
    el?.scrollIntoView({ block: "center" });
  });
  await p.waitForTimeout(900);
  const rows = await p.$$(".door-row, [data-door], section a");
  // hover whatever carries the door name
  const target = await p.evaluateHandle(() => {
    const cands = [...document.querySelectorAll("div,li,a")].filter((e) => (e.textContent || "").trim().startsWith("Design") && e.querySelector("svg,div"));
    return cands[cands.length - 1] || null;
  });
  const el = target.asElement();
  if (el) {
    await el.hover().catch(() => {});
    await p.waitForTimeout(3200);
  }
  const after = js.length;
  console.log("  door hover pulled", after - before, "extra chunks:", js.slice(before).map((x) => x.u).join(", ") || "(none)");
  console.log("  live preview mounted:", await p.evaluate(() => !!document.querySelector(".dpl")));
  await p.screenshot({ path: `${D}/s20-door-live.png` });

  // the reel
  await p.evaluate(() => window.scrollTo(0, 0));
  await p.waitForTimeout(800);
  const card = p.locator(".reel-card").first();
  if (await card.count()) {
    await card.hover();
    await p.waitForTimeout(600);
    console.log("REEL hover:", JSON.stringify(await p.evaluate(() => {
      const cs = [...document.querySelectorAll(".reel-card")];
      return { opacities: cs.map((c) => +getComputedStyle(c).opacity.slice(0, 4)), lifted: getComputedStyle(cs[0]).transform.slice(0, 30) };
    })));
    await p.screenshot({ path: `${D}/s20-reel-hover.png` });
  }
  await p.close();
}

/* ── the 404 ─────────────────────────────────────────────────────── */
{
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  await p.goto(BASE + "/nope", { waitUntil: "load", timeout: 90000 });
  await p.waitForTimeout(2600);
  console.log("\n404", JSON.stringify(await p.evaluate(() => ({
    h1: document.querySelector("h1")?.textContent?.trim(),
    accent: document.querySelector("h1 .type-accent")?.textContent,
    sub: document.querySelector(".nf-sub")?.textContent,
    rows: [...document.querySelectorAll(".nf-row")].map((r) => r.textContent.trim().slice(0, 34)),
    pill: document.querySelectorAll(".pill-hl").length,
    h1Opacity: getComputedStyle(document.querySelector("h1")).opacity,
  }))));
  await p.screenshot({ path: `${D}/s20-404.png` });
  await p.close();
}

/* ── /contact submits with no timeline ───────────────────────────── */
{
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  await p.goto(BASE + "/contact?mockSend=1", { waitUntil: "load", timeout: 90000 });
  await p.waitForTimeout(2400);
  await p.evaluate(() => document.getElementById("brief").scrollIntoView({ block: "start" }));
  await p.waitForTimeout(800);
  const f = await p.$$(".bs-input");
  await f[0].fill("Sam Okafor");
  await f[1].fill("sam@harbourview.ca");
  await f[4].fill("A new site for the bakery.");   // timeline (index 3) left empty
  await p.locator(".bs-submit button, .bs-submit a").first().click();
  await p.waitForTimeout(1600);
  console.log("\nCONTACT no-timeline submit → receipt:", await p.evaluate(() => !!document.querySelector(".bs-receipt")),
    "| errors shown:", await p.evaluate(() => document.querySelectorAll(".bs-err").length));
  await p.close();
}

/* ── PillHl inventory + overflow, all routes ─────────────────────── */
{
  const ROUTES = ["/", "/work", "/services", "/about", "/contact", "/work/cg-walls-and-floors", "/work/capitalcommand", "/work/sift", "/work/cadencestack", "/nope"];
  let pill = 0;
  console.log("");
  for (const r of ROUTES) {
    const p = await b.newPage({ viewport: { width: 375, height: 812 } });
    await p.goto(BASE + r, { waitUntil: "load", timeout: 90000 });
    await p.waitForTimeout(1600);
    const H = await p.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y <= H; y += 700) { await p.evaluate((t) => window.scrollTo(0, t), y); await p.waitForTimeout(50); }
    const m = await p.evaluate(() => ({ pills: document.querySelectorAll(".pill-hl").length, docW: document.documentElement.scrollWidth, win: window.innerWidth }));
    pill += m.pills;
    console.log(`${r.padEnd(28)} PillHl=${m.pills}  docW=${m.docW} (win ${m.win}) ${m.docW > m.win ? "OVERFLOW" : "ok"}`);
    await p.close();
  }
  console.log("TOTAL PillHl:", pill, "(expect 2 — home only)");
}
await b.close();
