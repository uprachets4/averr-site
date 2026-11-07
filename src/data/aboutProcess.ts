/**
 * "How we work" — the five steps, spec 33 step 4.
 *
 * Copy is the reference's, word for word. The line SVG is
 * `aria-hidden`; these cards carry the content, in an `aria-live`
 * region.
 */

/* Explicit `.ts` so `tools/about-tokens.test.ts` can run this file
   through node's own runner with no build step, as aboutTokens does. */
import { PILLAR_TIMELINE } from "./servicePillars.ts";

/**
 * "Within the 2 – 3 week build".
 *
 * The spec allows exactly four timings in this section, and this one
 * must equal the Websites pillar's. It is composed from
 * `PILLAR_TIMELINE.design` rather than typed, so the two can never
 * disagree: "2 – 3 weeks" minus its plural, inside the sentence.
 * `tools/about-tokens.test.ts` asserts the result.
 */
export const BUILD_WINDOW = `Within the ${PILLAR_TIMELINE.design.replace(
  /s$/,
  ""
)} build`;

export type ProcessStep = {
  /** The step's name, as the rail and the card title say it. */
  name: string;
  /** One line on what the step is. */
  line: string;
  /** When it happens — the only timings this section may state. */
  when: string;
  /** What you do. */
  you: string;
  /** What Prachets does. */
  prachets: string;
  /** What lands in your hands at the end of it. */
  receive: string;
  /** The step's colour, which the "You receive" chip takes. */
  color: string;
};

export const PROCESS: ProcessStep[] = [
  {
    name: "Direction",
    line: "We start with a conversation, not a template. What you do, who it's for and how it should feel, settled before anything is drawn.",
    when: "Starts at kickoff",
    you: "A 30-minute call. Tell me what you do and who it's for.",
    prachets:
      "Palette, type, the signature moment and how it moves, on one board.",
    receive: "Direction board",
    color: "#F9AF97",
  },
  {
    name: "Design",
    line: "Every section designed on purpose, one at a time, each held to a portfolio bar before the next begins.",
    when: BUILD_WINDOW,
    you: "Review each section as it's ready. Change what doesn't feel like you.",
    prachets:
      "Design section by section on one grid and one spacing scale.",
    receive: "Section designs",
    color: "#D5818C",
  },
  {
    name: "Build",
    line: "Hand-built in code: motion, interaction and a layout made for every screen. Nothing dropped in from a theme.",
    when: BUILD_WINDOW,
    you: "Watch it come together on a live preview link.",
    prachets: "Build it by hand, with real motion and every screen size.",
    receive: "Live preview link",
    color: "#9874E8",
  },
  {
    name: "Refine",
    line: "The polish pass. Contrast, phones, keyboards and reduced motion, checked one by one until nothing is rough.",
    when: "Before launch",
    you: "Click through it on your own phone and flag anything.",
    prachets: "Check every page against the list, and fix until it passes.",
    receive: "Polish checklist, all passed",
    color: "#708DF8",
  },
  {
    name: "Ship",
    line: "Live, watched and adjusted. You get a site that earns its place, and the person who built it stays on call.",
    when: "30-day window after launch",
    you: "Share it. Send people to it.",
    prachets: "Launch, monitor and adjust for 30 days.",
    receive: "Your live site",
    color: "#569AFA",
  },
];

/* ── the line itself ─────────────────────────────────────────────── */

/**
 * The pen's path, verbatim from the reference. One continuous stroke
 * through all five scenes, in a `0 0 5000 600` viewBox.
 */
export const LINE_D =
  "M40,300 C140,300 240,300 330,300 A170,170 0 1 1 670,300 A170,170 0 1 1 330,300 L470,300 L500,150 L530,300 L500,450 L470,300 L530,300 L670,300 C780,300 840,470 1000,470 C1120,470 1200,490 1300,490 L1300,110 L1700,110 L1700,490 L1300,490 L1340,470 L1340,180 C1380,150 1420,210 1460,180 C1500,150 1540,210 1580,180 C1610,160 1630,190 1640,185 L1640,240 L1340,240 L1340,275 L1560,275 L1560,320 L1660,320 L1660,450 L1380,450 L1380,320 L1560,320 L1660,450 L1700,470 C1800,520 1900,300 2000,300 C2120,300 2200,170 2400,170 L2280,300 L2400,430 L2440,450 L2560,150 L2600,170 L2720,300 L2600,430 C2700,520 2860,380 3000,380 C3120,380 3220,270 3350,270 A130,130 0 1 1 3610,270 A130,130 0 1 1 3350,270 L3380,245 L3400,295 L3420,245 L3440,295 L3460,270 C3490,240 3520,240 3550,270 C3570,290 3590,290 3610,270 A130,130 0 0 1 3572,362 L3700,490 C3800,570 3900,420 4000,420 C4150,420 4250,250 4180,220 C4110,190 4100,330 4240,330 C4400,330 4480,200 4600,180 L4840,100 L4690,190 L4680,260 L4840,100 L4600,180 L4690,190";

/** Where along the viewBox each step's panel begins. */
export const STEP_X = [0, 1240, 2240, 3300, 4060];
/** Where the camera settles for each step. */
export const CAMERA_X = [500, 1500, 2500, 3480, 4580];
/**
 * A scene's details light once the pen has passed this x.
 * Ship has no x of its own — it lights on `q > .985` instead.
 */
export const DETAIL_DONE = [700, 1720, 2730, 3620, Infinity];
