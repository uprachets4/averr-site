import { PILLAR_ORDER, PILLAR_NAME, PILLAR_SERVICES, type PillarId } from "../../data/servicePillars";

/**
 * /contact's copy, and the mappings this rebuild had to make.
 *
 * TRUTH RULE: nothing here is a new promise. Every line is already on
 * the site; where a line moved, its old home is named.
 */

/** The response time, verbatim from the dark statement band. */
export const RESPONSE_TIME = "24 hours";
/** Surfaced in the direct row by the 19 ruling; source: the meta description. */
export const SERVICE_AREA = "Toronto & the GTA";

export const EMAIL_ADDR = "prachets@averrstudios.com";
export const LINKEDIN_URL = "https://www.linkedin.com/in/prachetsupadhyay";
export const LINKEDIN_LABEL = "linkedin.com/in/prachetsupadhyay";

/**
 * The four "A few things that speed up the first reply." tips, moved
 * verbatim under the fields they match. The cards section is gone.
 *
 *   "What you're building."  → the message field
 *   "Links to anything."     → the message field (also about what to send)
 *   "Rough timeline."        → the timeline field
 *   "Budget shape."          → DROPPED with the budget field (ruling 1);
 *                              it is the one tip with no home, because
 *                              there is no budget talk on the site now.
 */
export const HELP_MESSAGE = [
  "A sentence. A paragraph. A rough sketch. Anywhere in that range works.",
  "Inspiration, your current site, a notes doc, a Figma. Anything visual saves us 20 questions.",
];
export const HELP_TIMELINE =
  "Soft launch. Hard deadline. “Figuring it out.” Any of these tells us how to prioritize.";

/**
 * The chips replace the old `projectType` select. The payload keeps
 * sending a `projectType` so the inbox format does not change:
 *
 *   design            → "new-site"     (was "New site")
 *   design + others   → "new-site"
 *   automate only     → "automation"   (was "Automation")
 *   grow only         → "other"        (was "Something else")
 *   nothing / unsure  → "other"
 *
 * The full chip selection is also sent as `services`, so nothing is
 * lost by the narrowing.
 */
export function legacyProjectType(pillars: PillarId[], unsure: boolean): string {
  if (unsure || pillars.length === 0) return "other";
  if (pillars.includes("design")) return "new-site";
  if (pillars.includes("automate")) return "automation";
  return "other";
}

export type Chip = { id: string; label: string; pillar: PillarId };

/** Each pillar, expandable to the services /services already lists. */
export const PILLARS = PILLAR_ORDER.map(function build(id) {
  return {
    id,
    name: PILLAR_NAME[id],
    services: PILLAR_SERVICES[id].map((s) => s.name),
  };
});

export const UNSURE_ID = "unsure";
export const UNSURE_LABEL = "Not sure yet";

/** "Design and Automate" rather than "Design, Automate". */
export function joinNaturally(items: string[]): string {
  if (items.length === 0) return "";
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
}

/**
 * One line per selected pillar, taken from /services' own outcome copy
 * for that pillar's first service — so the preview promises nothing the
 * site does not already say.
 */
export const PILLAR_LINE: Record<PillarId, string> = {
  design: PILLAR_SERVICES.design[0].outcome,
  automate: PILLAR_SERVICES.automate[0].outcome,
  grow: PILLAR_SERVICES.grow[0].outcome,
};

/** The next step, from the dark statement band. No new promise. */
export const NEXT_STEP = `I read every message myself and reply within ${RESPONSE_TIME} — usually with a follow-up question or two, sometimes with a rough proposal.`;

/** Shown on any failure. The server's own words are never rendered. */
export const FAILURE_LINE =
  "Something went wrong on our side. Email us directly and we'll reply within 24 hours.";
