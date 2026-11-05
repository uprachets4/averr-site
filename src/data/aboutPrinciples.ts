/**
 * "How we think" — the four principles, spec 33 step 3.
 *
 * Copy is the reference's, word for word. The kinetic words themselves
 * are `aria-hidden`; everything a screen reader gets is here, in
 * `line`, plus the proof panels, which are real text.
 */

export type PrincipleId = "craft" | "direction" | "motion" | "timeless";

export type Principle = {
  id: PrincipleId;
  /** The giant word, and the letters it is split into. */
  word: string;
  /** The name as the dots and the principle line say it. */
  name: string;
  /** The sentence under the word. */
  line: string;
  /** The word's colour, which tints the stage glow. */
  color: string;
  /** The tag above the word, before and after it settles. */
  tagBefore: string;
  tagAfter: string;
};

export const PRINCIPLES: Principle[] = [
  {
    id: "craft",
    word: "CRAFT",
    name: "Craft",
    line: "Every letter, every gap, every pixel placed on purpose. Nothing sits where a template dropped it.",
    color: "#F9AF97",
    tagBefore: "Placed by default",
    tagAfter: "Placed on purpose",
  },
  {
    id: "direction",
    word: "DIRECTION",
    name: "Direction",
    line: "One direction, agreed before any code. Then everything on the page points the same way.",
    color: "#D5818C",
    tagBefore: "Spinning",
    tagAfter: "Locked · one direction",
  },
  {
    id: "motion",
    word: "MOTION",
    name: "Motion",
    line: "Motion that tells you where to look, and in what order. Never motion for its own sake.",
    color: "#9874E8",
    tagBefore: "Everything bounces",
    tagAfter: "Choreographed",
  },
  {
    id: "timeless",
    word: "TIMELESS",
    name: "Timeless",
    line: "Trends date fast. Clear type and honest spacing still look right years from now.",
    color: "#569AFA",
    tagBefore: "Trend · Chrome",
    tagAfter: "Clean type · still holds",
  },
];

/** The trend styles TIMELESS flips through, in order, and their tags. */
export const TREND_STYLES = [
  "chrome",
  "neon",
  "glitch",
  "bubble",
  "clean",
] as const;
export type TrendStyle = (typeof TREND_STYLES)[number];

export const TREND_TAG: Record<TrendStyle, string> = {
  chrome: "Trend · Chrome",
  neon: "Trend · Neon",
  glitch: "Trend · Glitch",
  bubble: "Trend · Bubble",
  clean: "Clean type · still holds",
};

export const TREND_LABEL: Record<TrendStyle, string> = {
  chrome: "Chrome",
  neon: "Neon",
  glitch: "Glitch",
  bubble: "Bubble",
  clean: "Clean type",
};

/** The MOTION proof's four rules. The values come from aboutTokens. */
export const MOTION_ORDER =
  "eyebrow 0 → headline 100 → body 200 → action 300 ms";
export const MOTION_REDUCED = "Everything still arrives. Nothing moves.";

/** The headline the TIMELESS proof sets in each trend, then clean. */
export const TIMELESS_HEADLINE_PLAIN =
  "You work directly with the person who builds it.";
