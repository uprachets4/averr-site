import { chromium } from "playwright";
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto("https://averr-git-redesign-v2-prachets-upadhyay-s-projects.vercel.app/about", { waitUntil: "load" });
await p.waitForTimeout(1500); // exactly as .track5.mjs does

await p.evaluate(() => {
  window.__cls = 0;
  window.__s = [];
  new PerformanceObserver((l) => {
    for (const e of l.getEntries()) {
      if (e.hadRecentInput) continue;
      window.__cls += e.value;
      for (const s of e.sources || []) {
        const n = s.node;
        window.__s.push({
          v: +e.value.toFixed(4),
          tag: n ? n.tagName : "?",
          cls: n && n.className ? String(n.className).slice(0, 50) : "",
          id: n && n.id ? n.id : "",
          dy: s.previousRect && s.currentRect ? Math.round(s.currentRect.y - s.previousRect.y) : null,
          dh: s.previousRect && s.currentRect ? Math.round(s.currentRect.height - s.previousRect.height) : null,
          w: s.currentRect ? Math.round(s.currentRect.width) : null,
        });
      }
    }
  }).observe({ type: "layout-shift", buffered: false });
});

const H = await p.evaluate(() => document.documentElement.scrollHeight);
const step = 900, wait = 16;
for (const dir of [1, -1]) {
  const from = dir === 1 ? 0 : H;
  for (let y = from; dir === 1 ? y <= H : y >= 0; y += dir * step) {
    await p.evaluate((t) => window.scrollTo(0, t), y);
    await p.waitForTimeout(wait);
    if (y % (step * 6) === 0) await p.evaluate(() => document.documentElement.scrollWidth);
  }
}

const out = await p.evaluate(() => ({ cls: +window.__cls.toFixed(4), s: window.__s }));
console.log("track5-style CLS:", out.cls, "| sources", out.s.length);
const agg = {};
for (const e of out.s) {
  const k = `${e.tag}.${e.cls || e.id || "-"}`;
  agg[k] = (agg[k] || 0) + e.v;
}
console.log(
  Object.entries(agg).sort((a, c) => c[1] - a[1]).slice(0, 8)
    .map(([k, v]) => `  ${v.toFixed(4)}  ${k}`).join("\n")
);
console.log("biggest:", JSON.stringify(out.s.slice().sort((a, c) => c.v - a.v).slice(0, 5)));
await b.close();
