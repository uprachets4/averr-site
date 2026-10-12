import { chromium } from "playwright";
const BASE = "https://averr-git-redesign-v2-prachets-upadhyay-s-projects.vercel.app";
const D = "/private/tmp/claude-501/-Users-prachetsupadhyay/e9dd0f4b-ba61-4032-9e87-82b09ddfd1d8/scratchpad";

const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
const errs = [];
p.on("pageerror", (e) => errs.push(String(e).slice(0, 110)));
await p.goto(BASE + "/about", { waitUntil: "load", timeout: 90000 });
await p.waitForTimeout(2500);

/* ── founder credits ─────────────────────────────────────────────── */
await p.evaluate(() => document.querySelector(".fc").scrollIntoView({ block: "start" }));
await p.waitForTimeout(400);
const early = await p.evaluate(() =>
  [...document.querySelectorAll(".fc-line")].map((e) => +getComputedStyle(e).opacity.slice(0, 4))
);
await p.evaluate(() => window.scrollBy(0, 520));
await p.waitForTimeout(1200);
const late = await p.evaluate(() => ({
  opacities: [...document.querySelectorAll(".fc-line")].map((e) => +getComputedStyle(e).opacity.slice(0, 4)),
  labels: [...document.querySelectorAll(".fc-label")].map((e) => e.textContent),
  lines: [...document.querySelectorAll(".fc-line")].map((e) => e.textContent),
  push: getComputedStyle(document.querySelector(".fc-plate")).transform.slice(0, 40),
  sticky: getComputedStyle(document.querySelector(".fc-mark")).position,
  images: document.querySelectorAll(".fc img").length,
}));
console.log("FOUNDER lines reveal:", JSON.stringify(early), "→", JSON.stringify(late.opacities));
console.log("FOUNDER credits:", JSON.stringify(late.labels));
late.lines.forEach((l, i) => console.log(`   ${late.labels[i].padEnd(12)} ${l}`));
console.log("FOUNDER push-in:", late.push, "| mark sticky:", late.sticky, "| images in block:", late.images);
await p.screenshot({ path: `${D}/e18-founder.png` });

/* ── the closer signature ────────────────────────────────────────── */
await p.evaluate(() => {
  const secs = [...document.querySelectorAll("section")];
  secs[secs.length - 1].scrollIntoView({ block: "center" });
});
await p.waitForTimeout(2600);
console.log("CLOSER signature:", JSON.stringify(await p.evaluate(() => {
  const svg = document.querySelector(".sig-svg");
  const path = svg.querySelector("path");
  const cs = getComputedStyle(path);
  return {
    present: !!svg,
    stroke: cs.stroke,
    fill: cs.fill,
    strokeWidth: cs.strokeWidth,
    dashoffset: cs.strokeDashoffset,
    glow: getComputedStyle(svg).filter.slice(0, 60),
    width: Math.round(svg.getBoundingClientRect().width),
    eyebrowAfter: !!document.querySelector(".sig")?.nextElementSibling,
  };
})));
await p.screenshot({ path: `${D}/e18-closer.png` });

/* ── palette audit: anything off-palette outside window/monitor ──── */
const audit = await p.evaluate(() => {
  function odd(c) {
    const m = (c.match(/\d+(\.\d+)?/g) || []).map(Number);
    if (m.length < 3) return false;
    const [r, g, b] = m;
    if (m.length > 3 && m[3] === 0) return false;
    const mx = Math.max(r, g, b), mn = Math.min(r, g, b);
    // the site is cream/ink/gold: warm, low-chroma, or near-neutral
    if (mx - mn < 26) return false;            // neutral
    if (r >= g && g >= b) return false;         // warm (cream, gold, ink-warm)
    return true;
  }
  const out = [];
  for (const el of document.querySelectorAll("body *")) {
    if (el.closest(".studio-screen") || el.closest(".sw")) continue;
    const cs = getComputedStyle(el);
    for (const prop of ["color", "backgroundColor", "borderTopColor"]) {
      const v = cs[prop];
      if (v && v !== "none" && odd(v)) {
        out.push(`${el.tagName}.${String(el.className).slice(0, 26)} ${prop}=${v}`);
        break;
      }
    }
  }
  return out.slice(0, 8);
});
console.log("OFF-PALETTE outside the window/monitor:", audit.length ? audit.join(" | ") : "NONE");
console.log("page errors:", errs.length ? errs.join(" | ") : 0);
await b.close();
