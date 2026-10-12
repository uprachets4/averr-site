/** Derive the /about world from the ages-well panel, and check AA. */
const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const lin = (c) => { const s = c / 255; return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4; };
const L = (h) => { const [r, g, b] = hex(h); return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b); };
const ratio = (a, b) => { const x = L(a), y = L(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
function hsl(h) {
  let [r, g, b] = hex(h).map((v) => v / 255);
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn;
  let H = 0;
  if (d) {
    if (mx === r) H = ((g - b) / d) % 6;
    else if (mx === g) H = (b - r) / d + 2;
    else H = (r - g) / d + 4;
    H *= 60; if (H < 0) H += 360;
  }
  const Lu = (mx + mn) / 2;
  const S = d === 0 ? 0 : d / (1 - Math.abs(2 * Lu - 1));
  return { h: Math.round(H), s: Math.round(S * 100), l: Math.round(Lu * 100) };
}

console.log("── the panel this world comes from ──");
for (const [n, v] of [
  ["ages-well gradient start (violet)", "#7C5CFF"],
  ["ages-well gradient end (cyan)", "#2BD4D9"],
  ["ages-well CTA ink (deep indigo)", "#3B2BBF"],
  ["the panel's ground (--color-dark)", "#141412"],
]) {
  const c = hsl(v);
  console.log(`  ${n.padEnd(36)} ${v}  hue ${String(c.h).padStart(3)}°  sat ${String(c.s).padStart(3)}%  lum ${String(c.l).padStart(2)}%`);
}

console.log("\n── the /about world ──");
const TOK = {
  "--about-ground": "#0A0D14",
  "--about-surface": "#111624",
  "--about-surface-2": "#171D2E",
  "--about-glow": "#3D6BFF",
  "--about-glow-2": "#7C5CFF",
};
for (const [n, v] of Object.entries(TOK)) {
  const c = hsl(v);
  console.log(`  ${n.padEnd(18)} ${v}  hue ${String(c.h).padStart(3)}°  sat ${String(c.s).padStart(3)}%  lum ${String(c.l).padStart(2)}%`);
}

console.log("\n── text on the ground (AA needs 4.5:1 body, 3:1 large/UI) ──");
const G = "#0A0D14", S = "#111624", S2 = "#171D2E";
const CANDIDATES = ["#EDE9E2", "#C7CFE4", "#B6C0DA", "#A8B3D0", "#9AA6C6", "#8C99BC", "#7E8CB0"];
for (const c of CANDIDATES) {
  console.log(
    `  ${c}  ground ${ratio(c, G).toFixed(2).padStart(5)}:1   surface ${ratio(c, S).toFixed(2).padStart(5)}:1   surface-2 ${ratio(c, S2).toFixed(2).padStart(5)}:1  ${ratio(c, S2) >= 4.5 ? "AA on all three" : ratio(c, G) >= 4.5 ? "AA on ground only" : "fails"}`
  );
}

console.log("\n── the glows as text / as a rule ──");
for (const c of ["#3D6BFF", "#7C5CFF", "#6E90FF", "#8FA8FF"]) {
  console.log(`  ${c}  on ground ${ratio(c, G).toFixed(2)}:1   on surface-2 ${ratio(c, S2).toFixed(2)}:1`);
}

console.log("\n── surfaces against the ground (needs to read as a step) ──");
console.log(`  surface vs ground    ${ratio(S, G).toFixed(2)}:1`);
console.log(`  surface-2 vs ground  ${ratio(S2, G).toFixed(2)}:1`);
console.log(`  surface-2 vs surface ${ratio(S2, S).toFixed(2)}:1`);
