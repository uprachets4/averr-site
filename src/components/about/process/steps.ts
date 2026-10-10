import type { Step } from "./stepTypes";

/**
 * The five stages, lifted out of ProcessTimeline in Session 18e so the
 * scene and the old line can share them. Names, bodies and week labels
 * are byte-identical to what the page shipped with.
 */
export const STEPS: Step[] = [
  {
    n: "01",
    name: "Direction",
    duration: "Week 1",
    body: "Palette, typography, signature moves, interaction plan. One checkpoint. Locked before any code.",
  },
  {
    n: "02",
    name: "Design",
    duration: "Week 1-2",
    body: "Section-by-section build. Self-critique per section. Portfolio-quality bar before moving to the next.",
  },
  {
    n: "03",
    name: "Build",
    duration: "Week 2-3",
    body: "Framer or Next.js. Motion, interaction, responsive system. Zero template sections.",
  },
  {
    n: "04",
    name: "Refine",
    duration: "Week 3",
    body: "Polish pass. Accessibility audit. Mobile-first review. Reduced-motion verified.",
  },
  {
    n: "05",
    name: "Ship",
    duration: "Week 3-4",
    body: "Launch, monitor, iterate. 30-day post-launch window included.",
  },
];
