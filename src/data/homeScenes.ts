import type { Segment } from "../components/CharReveal";

/**
 * The three-scene argument. Headlines, accents and body copy are carried over
 * verbatim from StorySoFar — only the staging changes.
 */
export const SCENES: Array<{
  eyebrow: string;
  segments: Segment[];
  body: string;
}> = [
  {
    eyebrow: "The Studio",
    segments: [
      { text: "We started because most agency work" },
      { text: "looks the same.", accent: true },
    ],
    body: "Every studio ships the same three templates with the logo swapped. We kept meeting founders who had paid for a site that could have belonged to anyone.",
  },
  {
    eyebrow: "The Approach",
    segments: [
      { text: "So we built one that starts from the" },
      { text: "client's world.", accent: true },
    ],
    body: "Their market, their proof, their constraints. The design follows the argument the business needs to make — not a layout we already had lying around.",
  },
  {
    eyebrow: "The Result",
    segments: [
      { text: "Sites that earn their portfolio slot." },
      { text: "Yours and ours.", accent: true },
    ],
    body: "Every client site ships as Averr's next portfolio piece. No exceptions. No template shortcuts.",
  },
];

/** Scene 2 — the four screens StorySoFar showed today, one per live study. */
export const SCENE_TWO_SHOTS: Array<{ src: string; alt: string; client: string }> = [
  {
    src: "/work/cgwalls/hero.jpg",
    alt: "CG Walls & Floors — the site's home page",
    client: "CG Walls & Floors",
  },
  {
    src: "/work/capitalcommand/01-overview.jpg",
    alt: "CapitalCommand — the command overview dashboard",
    client: "CapitalCommand",
  },
  {
    src: "/work/sift/01-command-overview.jpg",
    alt: "SIFT — the command overview dashboard",
    client: "SIFT",
  },
  {
    src: "/work/cadencestack/01-command-center.jpg",
    alt: "CadenceStack — the command centre dashboard",
    client: "CadenceStack",
  },
];

/**
 * Scene 3 — the full-bleed result. CapitalCommand's portfolio screen: the
 * densest surface we ship, and not rendered anywhere else on home.
 */
export const SCENE_THREE_SHOT = {
  src: "/work/capitalcommand/02-portfolio.jpg",
  alt: "CapitalCommand — the portfolio view, holdings and allocation breakdown",
};

/**
 * The Design door's preview. The spec named the /services mood-board set, but
 * those are exactly scene 2's four screens and home must not repeat an image —
 * so these are three real case-study screens that appear nowhere else on home.
 */
export const DESIGN_PREVIEW_SHOTS: Array<{ src: string; alt: string }> = [
  { src: "/work/sift/02-tailor-resume.jpg", alt: "SIFT — resume tailoring screen" },
  { src: "/work/cadencestack/02-content-pillars.jpg", alt: "CadenceStack — content pillars" },
  { src: "/work/capitalcommand/06-research-lab.jpg", alt: "CapitalCommand — research lab" },
];
