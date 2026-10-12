import { chromium } from "playwright";
const BASE = "https://averr-git-redesign-v2-prachets-upadhyay-s-projects.vercel.app";
const DIR = "/private/tmp/claude-501/-Users-prachetsupadhyay/e9dd0f4b-ba61-4032-9e87-82b09ddfd1d8/scratchpad";

const EXPECT_STATEMENT =
  "Toronto-based design engineer with a background spanning B2B SaaS sales within Google's extended workforce program, frontend development, and AI workflow automation.";
const EXPECT_SUPPORT =
  "Previously co-founded KlaasX Edutech (15-person team, 150+ institutions). Started Averr Studios to build the kind of client websites that actually earn their portfolio slot.";

const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto(BASE + "/about", { waitUntil: "load" });
await p.waitForTimeout(1500);

const r = await p.evaluate(() => {
  const band = document.querySelector(".founder-band");
  const row = document.querySelector(".founder-row");
  const h2 = band.querySelector("h2");
  const h3 = band.querySelector("h3");
  const mark = row.children[0].getBoundingClientRect();
  const rf = [...band.querySelectorAll(".read-fill")];
  const links = [...band.querySelectorAll("a")].map((a) => ({
    text: a.textContent.trim(),
    href: a.getAttribute("href"),
    target: a.getAttribute("target"),
    rel: a.getAttribute("rel"),
  }));
  const imgs = band.querySelectorAll("img");
  return {
    nameText: h2.textContent.trim(),
    nameClass: h2.className,
    nameSize: getComputedStyle(h2).fontSize,
    role: [...band.querySelectorAll(".type-eyebrow")].map((e) => e.textContent.trim()),
    statement: h3 ? h3.querySelector(".sr-only")?.textContent.trim() : null,
    statementTag: h3 ? h3.tagName : null,
    support: rf[1] ? rf[1].querySelector(".sr-only")?.textContent.trim() : null,
    readFills: rf.length,
    markLeft: Math.round(mark.left),
    markW: Math.round(mark.width),
    cols: getComputedStyle(row).gridTemplateColumns,
    links,
    images: imgs.length,
    italicNote: [...band.querySelectorAll("p")].map((x) => x.textContent.trim()).filter((t) => t.startsWith("Grid absorbs")),
  };
});
console.log("FOUNDER", JSON.stringify(r, null, 1));
console.log("statement verbatim:", r.statement === EXPECT_STATEMENT);
console.log("support verbatim:", r.support === EXPECT_SUPPORT);
console.log("NO placeholder image in the band:", r.images === 0);

// the fill actually runs
await p.evaluate(() => document.querySelector(".founder-band").scrollIntoView({ block: "end" }));
await p.waitForTimeout(200);
const early = await p.evaluate(() =>
  [...document.querySelectorAll(".founder-band .read-fill")].map((e) => e.style.getPropertyValue("--p"))
);
await p.evaluate(() => window.scrollBy(0, 700));
await p.waitForTimeout(500);
const late = await p.evaluate(() =>
  [...document.querySelectorAll(".founder-band .read-fill")].map((e) => e.style.getPropertyValue("--p"))
);
console.log("read-fill --p early:", JSON.stringify(early), "later:", JSON.stringify(late));

await p.evaluate(() => document.querySelector(".founder-band").scrollIntoView({ block: "center" }));
await p.waitForTimeout(1400);
await p.screenshot({ path: `${DIR}/after-founder-1440.png` });

// 375
const m = await b.newPage({ viewport: { width: 375, height: 812 }, deviceScaleFactor: 2 });
await m.goto(BASE + "/about", { waitUntil: "load" });
await m.waitForTimeout(1500);
await m.evaluate(() => document.querySelector(".founder-band").scrollIntoView({ block: "start" }));
await m.waitForTimeout(1200);
console.log("375 founder", JSON.stringify(await m.evaluate(() => ({
  cols: getComputedStyle(document.querySelector(".founder-row")).gridTemplateColumns,
  docW: document.documentElement.scrollWidth,
  win: window.innerWidth,
}))));
await m.screenshot({ path: `${DIR}/after-founder-375.png` });

// reduced motion: the paragraphs are simply there
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
const rp = await ctx.newPage();
await rp.goto(BASE + "/about", { waitUntil: "load" });
await rp.waitForTimeout(1200);
console.log("REDUCED founder", JSON.stringify(await rp.evaluate(() => {
  const w = [...document.querySelectorAll(".founder-band .read-fill__w")];
  return {
    p: [...document.querySelectorAll(".founder-band .read-fill")].map((e) => e.style.getPropertyValue("--p")),
    firstWordOpacity: w.length ? getComputedStyle(w[0]).opacity : null,
    lastWordOpacity: w.length ? getComputedStyle(w[w.length - 1]).opacity : null,
  };
})));

await b.close();
