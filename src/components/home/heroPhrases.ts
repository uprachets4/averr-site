import type { PillarId } from "../../data/servicePillars";

/**
 * The hero's three outcomes, in the owner's order.
 *
 * The h1 reads "We're here to help / your business / [phrase]." — it
 * talks TO the business rather than about it, which is the whole point
 * of the change. Each phrase is one pillar, and each pillar owns one of
 * /services' real screens, so the sentence and the picture can never
 * drift apart.
 */
export type Phrase = {
  /** The slab's words, including the full stop. */
  text: string;
  /** What the selector under the h1 calls it. */
  label: string;
  pillar: PillarId;
};

export const PHRASES: Phrase[] = [
  { text: "look serious.", label: "Design", pillar: "design" },
  { text: "get found.", label: "Grow", pillar: "grow" },
  { text: "run itself.", label: "Automate", pillar: "automate" },
];

/** The h1's accessible name: the whole sentence, every outcome in it. */
export const H1_SENTENCE =
  "We're here to help your business look serious, get found, and run itself.";

export const LEAD_1 = "We're here to help";
export const LEAD_2 = "your business";

/** How long a phrase holds before the hero moves on by itself. */
export const CYCLE_MS = 3200;
