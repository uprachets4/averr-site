import { chromium } from "playwright";
const BASE = "https://averr-git-redesign-v2-prachets-upadhyay-s-projects.vercel.app";
const PROBE = `window.__m={lcp:0,el:"",cls:0,fcp:0};
new PerformanceObserver(l=>{for(const e of l.getEntries()){window.__m.lcp=e.startTime;const x=e.element;window.__m.el=x?x.tagName+" "+(x.textContent||"").trim().slice(0,30):"";}}).observe({type:"largest-contentful-paint",buffered:true});
new PerformanceObserver(l=>{for(const e of l.getEntries())if(!e.hadRecentInput)window.__m.cls+=e.value}).observe({type:"layout-shift",buffered:true});
new PerformanceObserver(l=>{for(const e of l.getEntries())if(e.name==="first-contentful-paint")window.__m.fcp=e.startTime}).observe({type:"paint",buffered:true});`;

const PATHS = process.argv.slice(2).length ? process.argv.slice(2) : ["/about"];
const b = await chromium.launch();

for (const path of PATHS) {
  const runs = [];
  // one warm-up pass first: a cold edge has read 500ms+ high before
  for (let r = 0; r < 4; r++) {
    const ctx = await b.newContext({
      viewport: { width: 390, height: 844 },
      deviceScaleFactor: 3,
      isMobile: true,
      hasTouch: true,
      timezoneId: "America/Toronto",
    });
    const p = await ctx.newPage();
    const cdp = await ctx.newCDPSession(p);
    await cdp.send("Network.emulateNetworkConditions", {
      offline: false,
      latency: 150,
      downloadThroughput: (1.6 * 1024 * 1024) / 8,
      uploadThroughput: (750 * 1024) / 8,
    });
    await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
    await p.addInitScript(PROBE);
    await p.goto(BASE + path, { waitUntil: "load", timeout: 90000 });
    await p.waitForTimeout(6000);
    const m = await p.evaluate("window.__m");
    if (r > 0) runs.push(m);
    else console.log(`${path} warm-up ${Math.round(m.lcp)}ms (discarded)`);
    await ctx.close();
  }
  const lcps = runs.map((m) => m.lcp).sort((a, c) => a - c);
  const median = lcps[1];
  console.log(
    `${path}  LCP median of 3 = ${Math.round(median)}ms  [${lcps.map((v) => Math.round(v)).join(", ")}]  ` +
      `FCP ${Math.round(runs.map((m) => m.fcp).sort((a, c) => a - c)[1])}ms  ` +
      `load-window CLS ${runs.map((m) => m.cls).sort((a, c) => a - c)[1].toFixed(4)}  ` +
      `${median < 2500 ? "PASS" : "FAIL"} (<2500)  | LCP element: ${runs[1].el}`
  );
}
await b.close();
