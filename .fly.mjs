import { chromium } from "playwright";
const BASE = "https://averr-git-redesign-v2-prachets-upadhyay-s-projects.vercel.app";
const D = "/private/tmp/claude-501/-Users-prachetsupadhyay/e9dd0f4b-ba61-4032-9e87-82b09ddfd1d8/scratchpad";

const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
const errs = [];
p.on("pageerror", (e) => errs.push(String(e).slice(0, 110)));
await p.goto(BASE + "/about", { waitUntil: "load" });
await p.waitForTimeout(2500);

// watch for long tasks across the whole transition
await p.evaluate(() => {
  window.__lt = [];
  try {
    new PerformanceObserver((l) => {
      for (const e of l.getEntries()) window.__lt.push(Math.round(e.duration));
    }).observe({ type: "longtask", buffered: false });
  } catch {}
});

const g = await p.evaluate(() => {
  const s = document.querySelector('section[aria-label="How the studio works"]');
  const w = s.parentElement;
  return { top: w.getBoundingClientRect().top + window.scrollY, vh: window.innerHeight };
});

// the approach runs from one viewport before the pin to the pin
const FRAMES = [0, 0.2, 0.4, 0.6, 0.8, 1.0];
for (const [i, f] of FRAMES.entries()) {
  const y = Math.round(g.top - g.vh * (1 - f));
  await p.evaluate((t) => window.scrollTo(0, Math.max(0, t)), y);
  await p.waitForTimeout(420);
  const s = await p.evaluate(() => {
    const host = document.querySelector('section[aria-label="How the studio works"] > div');
    const path = document.querySelector("clipPath path");
    const screen = document.querySelector(".mon-screen");
    // is anything actually painted in the viewport?
    const vis = [...document.querySelectorAll(".desk h2, .mon-bezel")].map((e) => {
      const r = e.getBoundingClientRect();
      return r.width > 0 && r.bottom > 0 && r.top < window.innerHeight;
    });
    return {
      clip: host ? getComputedStyle(host).clipPath.slice(0, 26) : null,
      tr: path ? (path.getAttribute("transform") || "").slice(0, 46) : null,
      scale: path ? +(path.getAttribute("transform") || "").match(/scale\(([\d.]+)\)/)?.[1] : null,
      onScreen: vis,
      screenBg: screen ? getComputedStyle(screen).backgroundColor : null,
    };
  });
  console.log(`frame ${i + 1}/6  approach ${f.toFixed(1)}  ${JSON.stringify(s)}`);
  await p.screenshot({ path: `${D}/fly-${i + 1}.png` });
}

console.log("long tasks during the fly-in:", JSON.stringify(await p.evaluate(() => window.__lt)));
console.log("page errors:", errs.length ? errs.join(" | ") : 0);

// reduced motion: no mask
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
const r = await ctx.newPage();
await r.goto(BASE + "/about", { waitUntil: "load" });
await r.waitForTimeout(2000);
console.log("REDUCED clip:", await r.evaluate(() => {
  const host = document.querySelector('section[aria-label="How the studio works"] > div');
  return host ? getComputedStyle(host).clipPath : "(stacked — no sticky stage)";
}));
await ctx.close();
await b.close();
