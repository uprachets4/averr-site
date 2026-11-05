/**
 * The real values the "How we think" proofs are built from.
 *
 * Spec 33 step 3: the proofs show averrstudios.com's OWN tokens, so
 * none of these numbers may be typed into a component. They live here
 * once, and `tools/about-tokens.test.ts` re-reads `src/index.css` and
 * asserts that every one of them still matches the stylesheet. Change
 * a token in `index.css` and that test fails until this file follows.
 *
 * The colours are not mirrored at all — they are imported straight
 * from `serviceColors.ts`, which is already the single source.
 */

/* The `.ts` extension is explicit so `tools/about-tokens.test.ts` can
   run this file straight through node's own runner, with no build
   step. `allowImportingTsExtensions` is on, so Vite is happy too. */
import { SERVICE_COLOR, SERVICE_NAMES, type ServiceId } from "./serviceColors.ts";

/**
 * The studio spacing scale, in px.
 *
 * NOTE: unlike the type, duration and easing values below, this scale
 * has NO `--space-*` custom property in `index.css` to check against —
 * it is a convention the site follows rather than a declared token.
 * So this array is the source, not a mirror, and the test can only
 * assert its shape. If the scale is ever given real tokens, point the
 * test at them.
 */
export const SPACING_SCALE = [4, 8, 12, 16, 24, 32, 48, 64, 96, 128] as const;

/**
 * The maximum of each `--type-*-size` clamp in `index.css`, in px,
 * with the label the proof shows. `--type-body-size` and
 * `--type-eyebrow-size` are flat values, not clamps; their "maximum"
 * is simply the value.
 */
export const TYPE_SCALE: { label: string; token: string; max: number }[] = [
  { label: "Display", token: "--type-display-2xl-size", max: 208 },
  { label: "H1", token: "--type-h1-size", max: 72 },
  { label: "H2", token: "--type-h2-size", max: 56 },
  { label: "H3", token: "--type-h3-size", max: 28 },
  { label: "Body", token: "--type-body-size", max: 17 },
  { label: "Eyebrow", token: "--type-eyebrow-size", max: 13 },
];

/** `--duration-*`, in ms. */
export const DURATIONS: { label: string; token: string; ms: number }[] = [
  { label: "fast", token: "--duration-fast", ms: 150 },
  { label: "base", token: "--duration-base", ms: 300 },
  { label: "slow", token: "--duration-slow", ms: 600 },
  { label: "hero", token: "--duration-hero", ms: 800 },
];

/** `--ease-out-quart`, verbatim. */
export const EASE_OUT_QUART_TOKEN = "--ease-out-quart";
export const EASE_OUT_QUART = "cubic-bezier(0.25, 1, 0.5, 1)";

/**
 * The five swatches the DIRECTION proof shows: the four service
 * colours in the owner's fixed order, plus the gradient's bridge stop.
 *
 * The bridge is the one value here with no service of its own — it
 * exists only inside `STUDIO_GRADIENT`, between AI Automation and
 * Marketing, so it is labelled "Bridge" rather than given a name it
 * does not have.
 */
export const GRADIENT_BRIDGE = "#708DF8";

const SERVICE_ORDER: ServiceId[] = [
  "websites",
  "webApps",
  "aiAutomation",
  "marketing",
];

export const DIRECTION_SWATCHES: { hex: string; name: string }[] = [
  ...SERVICE_ORDER.slice(0, 3).map((id) => ({
    hex: SERVICE_COLOR[id],
    name: SERVICE_NAMES[id],
  })),
  { hex: GRADIENT_BRIDGE, name: "Bridge" },
  { hex: SERVICE_COLOR.marketing, name: SERVICE_NAMES.marketing },
];

/** The MOTION proof's stagger and the demo's per-step offset, in ms. */
export const MOTION_STAGGER_MS = 100;
/** How long the demo waits before looping, in ms. */
export const MOTION_LOOP_MS = 3200;
