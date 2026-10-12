import { chromium } from "playwright";
const b = await chromium.launch();
const W = Number(process.argv[4] || 1440), HT = Number(process.argv[5] || 900);
const p = await b.newPage({ viewport: { width: W, height: HT } });
await p.goto("https://averr-git-redesign-v2-prachets-upadhyay-s-projects.vercel.app" + (process.env.ROUTE || "/about"), { waitUntil: "load" });
await p.waitForTimeout(2000);

await p.evaluate(() => {
  window.__s = [];
  new PerformanceObserver((l) => {
    for (const e of l.getEntries()) {
      if (e.hadRecentInput) continue;
      for (const s of e.sources || []) {
        const n = s.node;
        window.__s.push({
          v: +e.value.toFixed(4),
          tag: n ? n.tagName : "?",
          cls: n && n.className ? String(n.className).slice(0, 44) : "",
          dy: s.previousRect && s.currentRect ? Math.round(s.currentRect.y - s.previousRect.y) : null,
          dh: s.previousRect && s.currentRect ? Math.round(s.currentRect.height - s.previousRect.height) : null,
        });
      }
    }
  }).observe({ type: "layout-shift", buffered: false });
});

const H = await p.evaluate(() => document.documentElement.scrollHeight);
const STEP = Number(process.argv[2] || 320), WAIT = Number(process.argv[3] || 45);
for (let y = 0; y <= H; y += STEP) {
  await p.evaluate((t) => window.scrollTo(0, t), y);
  await p.waitForTimeout(WAIT);
}
for (let y = H; y >= 0; y -= STEP) {
  await p.evaluate((t) => window.scrollTo(0, t), y);
  await p.waitForTimeout(WAIT);
}

const s = await p.evaluate(() => window.__s);
const agg = {};
for (const e of s) {
  const k = `${e.tag}.${e.cls}`;
  agg[k] = (agg[k] || 0) + e.v;
}
console.log("total", s.reduce((a, c) => a + c.v, 0).toFixed(3), "| events", s.length);
console.log(
  Object.entries(agg)
    .sort((a, c) => c[1] - a[1])
    .slice(0, 10)
    .map(([k, v]) => `  ${v.toFixed(4)}  ${k}`)
    .join("\n")
);
console.log("samples:", JSON.stringify(s.slice(0, 6)));
await b.close();
