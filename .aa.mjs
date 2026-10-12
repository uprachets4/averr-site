import { chromium } from "playwright";
const BASE = "https://averr-git-redesign-v2-prachets-upadhyay-s-projects.vercel.app";

const lin = (c) => { const s = c / 255; return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4; };
const L = ([r, g, b]) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
const ratio = (a, b) => { const x = L(a), y = L(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
const parse = (s) => (s.match(/[\d.]+/g) || []).map(Number);
/** composite fg over bg at alpha a */
const over = (fg, bg, a) => fg.map((c, i) => a * c + (1 - a) * bg[i]);

const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto(BASE + "/about", { waitUntil: "load" });
await p.waitForTimeout(2500);

/* ── the hero paints at the first frame ──────────────────────────── */
const paint = await p.evaluate(() => {
  const h1 = document.querySelector("h1");
  const spans = [...h1.querySelectorAll("span")].filter((s) => (s.textContent || "").trim());
  return {
    h1Opacity: getComputedStyle(h1).opacity,
    charOpacities: [...new Set(spans.map((s) => getComputedStyle(s).opacity))],
    transforms: [...new Set(spans.map((s) => getComputedStyle(s).transform))].slice(0, 3),
  };
});
console.log("HERO paint:", JSON.stringify(paint));

/* ── the contrast table, measured off the live page ─────────────── */
const samples = await p.evaluate(() => {
  const root = getComputedStyle(document.documentElement);
  const tok = (n) => root.getPropertyValue(n).trim();
  const grab = (sel, label) => {
    const el = document.querySelector(sel);
    if (!el) return null;
    const c = getComputedStyle(el);
    return { label, color: c.color, size: c.fontSize, weight: c.fontWeight };
  };
  return {
    ground: tok("--about-ground"),
    surface: tok("--about-surface"),
    surface2: tok("--about-surface-2"),
    glow: tok("--about-glow"),
    glow2: tok("--about-glow-2"),
    glowText: tok("--about-glow-text"),
    ink: tok("--about-ink"),
    body: tok("--about-body"),
    rfFloor: tok("--rf-floor"),
    items: [
      grab("h1", "hero h1"),
      grab(".about-hero__copy p", "hero subhead"),
      grab('section[aria-label="How the studio works"] h2', "principle title"),
      grab('section[aria-label="How the studio works"] .type-eyebrow', "principle eyebrow"),
      grab(".read-fill", "principle body"),
      grab(".pl-week", "process week label"),
      grab(".sa-mono", "screen 04 mono"),
    ].filter(Boolean),
  };
});

const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const G = hex(samples.ground), S2 = hex(samples.surface2);
console.log("\nTOKENS", JSON.stringify({
  ground: samples.ground, surface: samples.surface, surface2: samples.surface2,
  glow: samples.glow, glow2: samples.glow2, glowText: samples.glowText,
  ink: samples.ink, body: samples.body, rfFloor: samples.rfFloor,
}));

console.log("\nMEASURED ON THE LIVE PAGE (vs --about-ground):");
for (const it of samples.items) {
  const c = parse(it.color).slice(0, 3);
  const r = ratio(c, G);
  const large = parseFloat(it.size) >= 24 || (parseFloat(it.size) >= 18.66 && Number(it.weight) >= 700);
  const need = large ? 3 : 4.5;
  console.log(`  ${it.label.padEnd(22)} ${it.color.padEnd(22)} ${it.size.padStart(6)}  ${r.toFixed(2)}:1  needs ${need}  ${r >= need ? "PASS" : "FAIL"}`);
}

console.log("\nTHE TWO GLOWS AS TEXT (why --about-glow-text exists):");
for (const [n, v] of [["--about-glow", samples.glow], ["--about-glow-2", samples.glow2], ["--about-glow-text", samples.glowText]]) {
  const c = hex(v.trim());
  console.log(`  ${n.padEnd(20)} ${v.trim()}  ground ${ratio(c, G).toFixed(2)}:1   surface-2 ${ratio(c, S2).toFixed(2)}:1`);
}

console.log("\nREAD-FILL, composited (the unread floor is the transient state):");
const bodyC = hex(samples.body.trim());
const floor = parseFloat(samples.rfFloor) || 0.22;
console.log(`  unread  alpha ${floor}  →  ${ratio(over(bodyC, G, floor), G).toFixed(2)}:1`);
console.log(`  settled alpha 1.00  →  ${ratio(bodyC, G).toFixed(2)}:1`);

await b.close();
