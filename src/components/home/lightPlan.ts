/**
 * The site's new colour standard, piloted on home.
 *
 * ONE dark ground for the whole page. The story is told with LIGHT: a
 * single fixed layer whose colour and position interpolate continuously
 * with scroll, so a chapter's colour arrives before its content does and
 * leaves after it. No cream grounds, no clip-path slab switching between
 * two grounds.
 *
 * SESSION 26 — the light is LIGHT IN A ROOM, not a coloured blob. The
 * tight radial "glow" is retired: a soft-edged circle reads as a
 * gradient smear behind the content, which is exactly the look the
 * owner called out. What replaces it:
 *
 *   the HORIZON  a wide, low wash along the bottom of the frame, up to
 *                0.3 — the room's floor bounce.
 *   two BEAMS    soft diagonal volumetric shafts crossing the frame,
 *                blurred and masked at both ends so they read as light
 *                through air rather than as shapes. `alpha` is now the
 *                beams' peak strength.
 *
 * `x`/`y` steer where the beams cross, so the light still belongs to the
 * side of the frame the chapter's scene occupies and the text column
 * stays off the brightest part.
 *
 * Contrast is measured off the brightest actually-lit pixel behind text,
 * not assumed from the token — see the handoff's table.
 */

export type ChapterLight = {
  id: string;
  /** The glow's colour. */
  rgb: [number, number, number];
  /** Peak alpha of the volumetric beams, 0–0.5. */
  alpha: number;
  /** Peak alpha of the low horizon wash, 0–0.3. */
  horizon: number;
  /** Where the beams cross, in % of the viewport. */
  x: number;
  y: number;
};

export const LIGHTS: ChapterLight[] = [
  { id: "ch-build", rgb: [255, 255, 255], alpha: 0.13, horizon: 0.1, x: 62, y: 46 },
  /* every service chapter's scene sits in the LEFT column, so the beams
     cross there and the right-hand text stays off the brightest part */
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
    /* The horizon is painted by the layer itself; the beams are its two
       children, so they can be rotated and blurred. Everything travels
       as custom properties — one style write per frame either way. */
    horizonCss:
      `radial-gradient(130% 44% at 50% 108%, ` +
      `rgba(${r},${g},${bl},${hz.toFixed(3)}) 0%, ` +
      `rgba(${r},${g},${bl},${(hz * 0.45).toFixed(3)}) 42%, ` +
      `rgba(${r},${g},${bl},0) 84%)`,
    rgb: [r, g, bl] as [number, number, number],
    alpha: al,
    x,
    y,
  };
}
