/**
 * The site's new colour standard, piloted on home.
 *
 * ONE dark ground for the whole page. The story is told with LIGHT: a
 * single fixed layer whose colour and position interpolate continuously
 * with scroll, so a chapter's colour arrives before its content does and
 * leaves after it. No cream grounds, no clip-path slab switching between
 * two grounds.
 *
 * TWO layers per chapter, raised by the 25b ruling so the colour reads
 * as colour:
 *
 *   the GLOW   a tight radial behind that chapter's 3D object, up to
 *              0.5. It sits on the object's side of the frame, not
 *              under the text, which is what lets it be this strong
 *              without taking the body copy under 7:1.
 *   the HORIZON a wide, low wash along the bottom of the frame, up to
 *              0.3, so the colour belongs to the room rather than to one
 *              hotspot.
 *
 * Contrast is measured off the brightest actually-lit pixel behind text,
 * not assumed from the token — see the handoff's table.
 */

export type ChapterLight = {
  id: string;
  /** The glow's colour. */
  rgb: [number, number, number];
  /** Peak alpha of the object glow, 0–0.5. */
  alpha: number;
  /** Peak alpha of the low horizon wash, 0–0.3. */
  horizon: number;
  /** Where the glow sits, in % of the viewport. */
  x: number;
  y: number;
};

export const LIGHTS: ChapterLight[] = [
  { id: "ch-build", rgb: [255, 255, 255], alpha: 0.14, horizon: 0.1, x: 62, y: 46 },
  /* every service chapter's object sits in the LEFT column, so the glow
     does too and the right-hand text stays off the hotspot */
  { id: "ch-websites", rgb: [200, 118, 60], alpha: 0.5, horizon: 0.3, x: 24, y: 48 },
  { id: "ch-products", rgb: [61, 107, 255], alpha: 0.46, horizon: 0.26, x: 24, y: 48 },
  { id: "ch-ai", rgb: [123, 92, 255], alpha: 0.48, horizon: 0.28, x: 24, y: 48 },
  { id: "ch-marketing", rgb: [212, 168, 75], alpha: 0.5, horizon: 0.3, x: 24, y: 48 },
  { id: "ch-work", rgb: [255, 255, 255], alpha: 0.16, horizon: 0.12, x: 50, y: 42 },
  { id: "ch-founder", rgb: [237, 233, 226], alpha: 0.26, horizon: 0.16, x: 28, y: 50 },
  { id: "ch-start", rgb: [226, 160, 96], alpha: 0.34, horizon: 0.3, x: 50, y: 88 },
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
  const hz = lerp(a.horizon, b.horizon, k);
  const x = lerp(a.x, b.x, k);
  const y = lerp(a.y, b.y, k);
  return {
    css:
      /* the glow, tight and on the object's side */
      `radial-gradient(34% 40% at ${x.toFixed(1)}% ${y.toFixed(1)}%, ` +
      `rgba(${r},${g},${bl},${al.toFixed(3)}) 0%, ` +
      `rgba(${r},${g},${bl},${(al * 0.4).toFixed(3)}) 42%, ` +
      `rgba(${r},${g},${bl},0) 78%), ` +
      /* the horizon, wide and low */
      `radial-gradient(118% 46% at 50% 108%, ` +
      `rgba(${r},${g},${bl},${hz.toFixed(3)}) 0%, ` +
      `rgba(${r},${g},${bl},${(hz * 0.45).toFixed(3)}) 40%, ` +
      `rgba(${r},${g},${bl},0) 82%)`,
    rgb: [r, g, bl] as [number, number, number],
    alpha: al,
  };
}
