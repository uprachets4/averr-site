import { chromium } from "playwright";
/**
 * The no-"$" sweep, with the blind spot closed.
 *
 * `.sweep.mjs` read document.body.innerText, which never sees a
 * CustomSelect's options because the listbox only mounts while open —
 * so five "$" labels sat on /contact for sessions and were reported
 * clean every time. This one OPENS every collapsed control first.
 */
const BASE = "https://averr-git-redesign-v2-prachets-upadhyay-s-projects.vercel.app";
const ROUTES = [
  "/", "/work", "/services", "/about", "/contact",
  "/work/cg-walls-and-floors", "/work/capitalcommand", "/work/sift", "/work/cadencestack",
  "/nope",
];
/** price-shaped strings, not just the glyph */
const PRICE = /\$|\bUSD\b|\bCAD\s*\d/;  // the literal money glyph and currency codes only

const b = await chromium.launch();
let total = 0;
for (const route of ROUTES) {
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  await p.goto(BASE + route, { waitUntil: "load", timeout: 90000 });
  await p.waitForTimeout(1800);
  // walk the page so lazy sections mount
  const H = await p.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y <= H; y += 700) {
    await p.evaluate((t) => window.scrollTo(0, t), y);
    await p.waitForTimeout(55);
  }
  await p.waitForTimeout(400);

  // open everything that hides its content until asked
  const opened = await p.evaluate(() => {
    let n = 0;
    for (const d of document.querySelectorAll("details")) {
      if (!d.open) { d.open = true; n++; }
    }
    return n;
  });
  const triggers = await p.$$(
    '[role=combobox], [aria-haspopup=listbox], [aria-haspopup=menu], [aria-expanded=false], summary, select'
  );
  let clicked = 0;
  const seen = new Set();
  for (const t of triggers) {
    try {
      await t.click({ timeout: 1200 });
      clicked++;
      await p.waitForTimeout(220);
      const txt = await p.evaluate(() =>
        [...document.querySelectorAll('[role=option], [role=menuitem], option, [role=listbox]')]
          .map((o) => o.textContent.trim()).join(" | ")
      );
      if (txt) seen.add(txt);
      await p.keyboard.press("Escape").catch(() => {});
      await p.waitForTimeout(120);
    } catch { /* not clickable here */ }
  }

  const pageText = await p.evaluate(() => document.body.innerText);
  const all = pageText + "\n" + [...seen].join("\n");
  const hits = all.split("\n").map((l) => l.trim()).filter((l) => l && PRICE.test(l));
  total += hits.length;
  console.log(
    `${route.padEnd(28)} opened ${String(opened + clicked).padStart(2)} controls  ${hits.length ? "HITS: " + JSON.stringify(hits.slice(0, 6)) : "clean"}`
  );
  await p.close();
}
console.log("\nTOTAL price-shaped strings site-wide (collapsed controls opened):", total);
await b.close();
