import { chromium } from "playwright";
const ROUTE = process.env.ROUTE || "/about";
const BASE = "https://averr-git-redesign-v2-prachets-upadhyay-s-projects.vercel.app";
const VIEWPORTS = [
  { w: 1440, h: 900 },
  { w: 1920, h: 1080 },
  { w: 375, h: 812 },
];
// crash / normal / gentle
const SPEEDS = [
  { name: "crash", step: 900, wait: 16 },
  { name: "normal", step: 320, wait: 45 },
  { name: "gentle", step: 110, wait: 90 },
];

const b = await chromium.launch();
for (const v of VIEWPORTS) {
  for (const s of SPEEDS) {
    const p = await b.newPage({ viewport: { width: v.w, height: v.h } });
    const errs = [];
    p.on("console", (m) => {
      if (m.type() === "error") errs.push(m.text().slice(0, 120));
    });
    p.on("pageerror", (e) => errs.push("PAGEERROR " + String(e).slice(0, 120)));
    await p.goto(BASE + ROUTE, { waitUntil: "load" });
    await p.waitForTimeout(1500);
    await p.evaluate(() => {
      window.__cls = 0;
      window.__worst = 0;
      new PerformanceObserver((l) => {
        for (const e of l.getEntries()) {
          if (!e.hadRecentInput) {
            window.__cls += e.value;
            window.__worst = Math.max(window.__worst, e.value);
          }
        }
      }).observe({ type: "layout-shift", buffered: false });
    });
    const H = await p.evaluate(() => document.documentElement.scrollHeight);
    let maxW = 0;
    for (let dir of [1, -1]) {
      const from = dir === 1 ? 0 : H;
      for (let y = from; dir === 1 ? y <= H : y >= 0; y += dir * s.step) {
        await p.evaluate((t) => window.scrollTo(0, t), y);
        await p.waitForTimeout(s.wait);
        if (y % (s.step * 6) === 0) {
          const w = await p.evaluate(() => document.documentElement.scrollWidth);
          if (w > maxW) maxW = w;
        }
      }
    }
    const m = await p.evaluate(() => ({
      cls: +window.__cls.toFixed(4),
      worst: +window.__worst.toFixed(4),
      docW: document.documentElement.scrollWidth,
    }));
    console.log(
      `${v.w}x${v.h} ${s.name.padEnd(6)} cls=${m.cls} worstShift=${m.worst} maxDocW=${Math.max(maxW, m.docW)} (win ${v.w}) errors=${errs.length}${errs.length ? " :: " + errs.slice(0, 3).join(" | ") : ""}`
    );
    await p.close();
  }
}
await b.close();
