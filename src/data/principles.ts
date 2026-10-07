/**
 * The four principles — /about's spine.
 *
 * Lifted out of About.tsx in Session 18 so the principles playground can
 * import them. The copy is byte-identical to what the page shipped with.
 * `tone` is the ground the principle keeps: the playground's panels carry
 * their own background across the track, so the cream / alt / cream / dark
 * rhythm the page was built on survives the rebuild and /about still
 * hands the next chapter a dark edge.
 */
export type PrincipleTone = "cream" | "alt" | "dark";

export type Principle = {
  n: string;
  title: string;
  body: string;
  tone: PrincipleTone;
};

export const PRINCIPLES: Principle[] = [
  {
    n: "01",
    title: "Craft over checklists.",
    body: "We don't ship template sections because “websites have this section.” Every element earns its place. Every animation serves comprehension or delight. If a section could sit on a ThemeForest template unchanged, it gets rebuilt.",
    tone: "cream",
  },
  {
    n: "02",
    title: "Direction first, build second.",
    body: "Before any code is written, you get a design direction — palette, typography, signature moves, interaction plan. One checkpoint. One decision. Then the studio builds independently. No approval-by-committee.",
    tone: "alt",
  },
  {
    n: "03",
    title: "Motion as language.",
    body: "Every scroll frame, every hover, every page load is choreographed. Motion tells the visitor how to read the site. When it doesn’t serve that, it doesn’t ship.",
    tone: "cream",
  },
  {
    n: "04",
    title: "A site that ages well.",
    body: "Trend-driven design ages in 18 months. The studio designs for typography, spacing, and interaction fundamentals that hold up in three years. Every project is built to be portfolio-worthy for the studio and for the client.",
    tone: "dark",
  },
];
