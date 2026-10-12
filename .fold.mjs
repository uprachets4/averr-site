import { chromium } from "playwright";
const BASE = "https://averr-git-redesign-v2-prachets-upadhyay-s-projects.vercel.app";
const D = "/private/tmp/claude-501/-Users-prachetsupadhyay/e9dd0f4b-ba61-4032-9e87-82b09ddfd1d8/scratchpad";

const SIZES = [
  { w: 1440, h: 900 },
  { w: 1366, h: 768 },
  { w: 1280, h: 720 },
  { w: 390, h: 844, mobile: true },
];

const b = await chromium.launch();
for (const v of SIZES) {
  const ctx = await b.newContext({
    viewport: { width: v.w, height: v.h },
    deviceScaleFactor: v.mobile ? 3 : 1,
    isMobile: !!v.mobile,
    hasTouch: !!v.mobile,
  });
  const p = await ctx.newPage();
  await p.goto(BASE + "/about", { waitUntil: "load", timeout: 90000 });
  await p.waitForTimeout(5200); // the full draw ladder has run by now

  const m = await p.evaluate(() => {
    const h1 = document.querySelector("h1");
    const r = h1.getBoundingClientRect();
    const svg = document.querySelector('svg[aria-label="Prachets Upadhyay monogram"]');
    const mr = svg.getBoundingClientRect();
    // first line box of the h1
    const range = document.createRange();
    range.selectNodeContents(h1);
    const rects = [...range.getClientRects()].filter((x) => x.height > 4);
    const firstLine = rects.length ? rects[0] : r;
    const sub = [...document.querySelectorAll(".about-hero p")].find((e) =>
      e.textContent.includes("The studio for founders")
    );
    const cta = [...document.querySelectorAll(".about-hero a")].find((a) =>
      a.textContent.includes("See the work")
    );
    return {
      vh: window.innerHeight,
      markW: Math.round(mr.width),
      markH: Math.round(mr.height),
      h1Top: Math.round(r.top),
      h1Bottom: Math.round(r.bottom),
      h1Lines: rects.length,
      firstLineBottom: Math.round(firstLine.bottom),
      subBottom: sub ? Math.round(sub.getBoundingClientRect().bottom) : null,
      ctaBottom: cta ? Math.round(cta.getBoundingClientRect().bottom) : null,
      docW: document.documentElement.scrollWidth,
    };
  });

  const full = m.h1Bottom <= m.vh;
  const firstOk = m.firstLineBottom <= m.vh;
  const verdict = v.mobile
    ? `first line bottom ${m.firstLineBottom} / ${m.vh} → ${firstOk ? "PASS" : "FAIL"} (full h1 ${full ? "also visible" : "below fold"})`
    : `h1 bottom ${m.h1Bottom} / ${m.vh}  → ${full ? "PASS" : "FAIL"}  (${m.vh - m.h1Bottom}px clear)`;
  console.log(
    `${String(v.w).padStart(4)}x${v.h}  mark ${m.markW}x${m.markH}  h1 ${m.h1Top}→${m.h1Bottom} (${m.h1Lines} lines)  sub ${m.subBottom}  cta ${m.ctaBottom}  docW ${m.docW}`
  );
  console.log(`            ${verdict}`);
  await p.screenshot({ path: `${D}/fold-${v.w}x${v.h}.png` });
  await ctx.close();
}
await b.close();
