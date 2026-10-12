import { chromium } from "playwright";
const BASE = "https://averr-git-redesign-v2-prachets-upadhyay-s-projects.vercel.app";
const D = "/private/tmp/claude-501/-Users-prachetsupadhyay/e9dd0f4b-ba61-4032-9e87-82b09ddfd1d8/scratchpad";

/** The panel is always in the DOM; it is ACTIVE only when visible and
    not fully inset off-screen. Testing for its existence was my bug. */
const WIPE_ACTIVE = `(() => {
  const el = document.querySelector(".rw");
  if (!el) return false;
  const cs = getComputedStyle(el);
  if (cs.visibility === "hidden") return false;
  const c = cs.clipPath || "";
  return !/inset\\(100%/.test(c);
})()`;

const b = await chromium.launch();

/* ── 1. the transition, three route pairs, six frames ───────────── */
for (const [from, linkText, expect] of [
  ["/", "Services", "Services"],
  ["/services", "About", "About"],
  ["/about", "Book a call", "Contact"],
]) {
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  await p.goto(BASE + from, { waitUntil: "load", timeout: 90000 });
  await p.waitForTimeout(2200);
  const t0 = Date.now();
  await p.locator(`nav a:has-text("${linkText}")`).first().click();
  const frames = [];
  for (const ms of [60, 140, 240, 360, 500, 700]) {
    await p.waitForTimeout(ms - (frames.length ? [60, 140, 240, 360, 500, 700][frames.length - 1] : 0));
    frames.push(await p.evaluate(() => {
      const panel = document.querySelector(".rw");
      const name = document.querySelector(".rw-name");
      const h1 = document.querySelector("main h1");
      return {
        panel: panel ? (getComputedStyle(panel).visibility === "hidden" ? "inert" : getComputedStyle(panel).clipPath.replace(/px/g, "").slice(0, 22)) : "gone",
        name: name ? name.textContent : null,
        path: location.pathname,
        h1: h1 ? h1.textContent.trim().slice(0, 18) : null,
      };
    }));
  }
  // when is the destination hero actually painted?
  await p.waitForFunction(() => {
    const h = document.querySelector("main h1");
    if (!h || h.getBoundingClientRect().width === 0) return false;
    const el = document.querySelector(".rw");
    if (!el) return true;
    const cs = getComputedStyle(el);
    return cs.visibility === "hidden" || /inset\(100%/.test(cs.clipPath || "");
  }, { timeout: 6000 }).catch(() => {});
  const paint = Date.now() - t0;
  console.log(`\nTRANSITION ${from} → ${expect}  click→painted hero ${paint}ms ${paint <= 800 ? "PASS" : "FAIL"} (≤800)`);
  frames.forEach((f, i) => console.log(`   frame ${i + 1}`, JSON.stringify(f)));
  await p.screenshot({ path: `${D}/s20-wipe-${expect}.png` });
  console.log("   after:", JSON.stringify(await p.evaluate(() => ({
    path: location.pathname,
    title: document.title,
    focused: document.activeElement?.tagName + ":" + (document.activeElement?.textContent || "").trim().slice(0, 18),
    live: document.querySelector("[aria-live]")?.textContent,
    scrollY: Math.round(window.scrollY),
  }))));
  await p.close();
}

/* ── 2. the exclusions ───────────────────────────────────────────── */
{
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  await p.goto(BASE + "/work", { waitUntil: "load", timeout: 90000 });
  await p.waitForTimeout(2600);
  const link = p.locator('a[href^="/work/"]').first();
  if (await link.count()) {
    await link.click({ force: true });
    await p.waitForTimeout(150);
    console.log("\nEXCLUSION /work → case study, wipe panel present:",
      await p.evaluate(WIPE_ACTIVE), "(expect false)");
    await p.waitForTimeout(1600);
    console.log("   landed:", await p.evaluate(() => location.pathname));
  }
  // back/forward
  await p.goBack();
  await p.waitForTimeout(120);
  console.log("EXCLUSION back, wipe panel present:", await p.evaluate(WIPE_ACTIVE), "(expect false)");
  await p.waitForTimeout(900);
  // hash link
  await p.goto(BASE + "/about", { waitUntil: "load", timeout: 90000 });
  await p.waitForTimeout(2000);
  const hash = p.locator('a[href*="#"]').first();
  if (await hash.count()) {
    await hash.click({ force: true }).catch(() => {});
    await p.waitForTimeout(140);
    console.log("EXCLUSION hash link, wipe panel present:", await p.evaluate(WIPE_ACTIVE), "(expect false)");
  }
  await p.close();
}

/* ── 3. reduced motion: no wipe ──────────────────────────────────── */
{
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
  const p = await ctx.newPage();
  await p.goto(BASE + "/", { waitUntil: "load", timeout: 90000 });
  await p.waitForTimeout(2200);
  await p.locator('nav a:has-text("About")').first().click();
  await p.waitForTimeout(140);
  console.log("\nREDUCED wipe panel present:", await p.evaluate(WIPE_ACTIVE), "(expect false)");
  await p.waitForTimeout(900);
  console.log("REDUCED landed:", await p.evaluate(() => location.pathname));
  await ctx.close();
}

/* ── 4. the footer ───────────────────────────────────────────────── */
for (const [w, h, n] of [[1440, 900, "1440"], [1920, 1080, "1920"], [375, 812, "375"]]) {
  const p = await b.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: n === "375" ? 2 : 1 });
  await p.goto(BASE + "/about", { waitUntil: "load", timeout: 90000 });
  await p.waitForTimeout(2000);
  await p.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await p.waitForTimeout(1800);
  console.log(`\nFOOTER ${n}`, JSON.stringify(await p.evaluate(() => {
    const word = document.querySelector(".fm-word");
    const wrap = document.querySelector(".fm-mask");
    const rise = document.querySelector(".fm-rise");
    const texts = [...document.querySelectorAll("footer *")]
      .filter((e) => e.children.length === 0 && (e.textContent || "").trim())
      .map((e) => parseFloat(getComputedStyle(e).fontSize));
    return {
      wordW: word ? Math.round(word.getBoundingClientRect().width) : 0,
      maskW: wrap ? Math.round(wrap.getBoundingClientRect().width) : 0,
      fits: word && wrap ? word.getBoundingClientRect().width <= wrap.getBoundingClientRect().width + 1 : false,
      risen: rise ? getComputedStyle(rise).transform : "none",
      clock: document.querySelector("footer")?.innerText.match(/\d{1,2}:\d{2}\s*[AP]M/)?.[0] ?? "none",
      minFont: Math.min(...texts),
      legalLinks: [...document.querySelectorAll('footer a[href^="/privacy"], footer a[href^="/cookies"], footer a[href^="/terms"]')].length,
      docW: document.documentElement.scrollWidth,
    };
  })));
  await p.screenshot({ path: `${D}/s20-footer-${n}.png` });
  await p.close();
}
await b.close();
