/**
 * The site's new colour standard, piloted on home.
 *
 * ONE dark ground for the whole page. The story is told with LIGHT: a
 * single fixed layer whose colour and position interpolate continuously
 * with scroll, so a chapter's colour arrives before its content does and
 * leaves after it. No cream grounds, no clip-path slab switching between
 * two grounds.
 *
 * Every value is kept at or under 35% intensity over #141412, which
 * leaves parch type (#EDE9E2) above 12:1 on every lit ground — measured
 * in the handoff's token table rather than assumed.
 */

export type ChapterLight = {
  id: string;
  /** The glow's colour. */
  rgb: [number, number, number];
  /** Peak alpha of the radial, 0–0.35. */
  alpha: number;
  /** Where the glow sits, in % of the viewport. */
  x: number;
  y: number;
};

export const LIGHTS: ChapterLight[] = [
  { id: "ch-build", rgb: [255, 255, 255], alpha: 0.1, x: 62, y: 46 },
  { id: "ch-websites", rgb: [200, 118, 60], alpha: 0.3, x: 72, y: 42 },
  { id: "ch-products", rgb: [61, 107, 255], alpha: 0.26, x: 30, y: 52 },
  { id: "ch-ai", rgb: [123, 92, 255], alpha: 0.28, x: 68, y: 50 },
  { id: "ch-marketing", rgb: [212, 168, 75], alpha: 0.3, x: 34, y: 46 },
  { id: "ch-work", rgb: [255, 255, 255], alpha: 0.12, x: 50, y: 44 },
  { id: "ch-founder", rgb: [237, 233, 226], alpha: 0.16, x: 36, y: 50 },
  { id: "ch-start", rgb: [226, 160, 96], alpha: 0.26, x: 50, y: 76 },
];

export function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

/** The light at a given blend between two chapters. */
export function blend(a: ChapterLight, b: ChapterLight, t: number) {
  const k = t < 0 ? 0 : t > 1 ? 1 : t;
  const r = Math.round(lerp(a.rgb[0], b.rgb[0], k));
  const g = Math.round(lerp(a.rgb[1], b.rgb[1], k));
  const bl = Math.round(lerp(a.rgb[2], b.rgb[2], k));
  const al = lerp(a.alpha, b.alpha, k);
  const x = lerp(a.x, b.x, k);
  const y = lerp(a.y, b.y, k);
  return {
    css:
      `radial-gradient(58% 54% at ${x.toFixed(1)}% ${y.toFixed(1)}%, ` +
      `rgba(${r},${g},${bl},${al.toFixed(3)}) 0%, ` +
      `rgba(${r},${g},${bl},${(al * 0.42).toFixed(3)}) 38%, ` +
      `rgba(${r},${g},${bl},0) 72%)`,
    rgb: [r, g, bl] as [number, number, number],
    alpha: al,
  };
}
