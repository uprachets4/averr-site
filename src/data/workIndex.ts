import { caseStudies, type Pillar } from "./caseStudies";

/**
 * The vault index. Everything except the headline figure comes straight from
 * the case-study records.
 *
 * Figures: the case-study data has no numeric outcome — `outcome` is prose —
 * so the two published figures are carried over from the home page's own
 * constants. CapitalCommand and CadenceStack have no figure anywhere, and
 * deliberately show none rather than inventing one.
 */
const FIGURES: Record<string, { value: string; caption: string }> = {
  "cg-walls-and-floors": {
    value: "85%",
    caption: "Reduction in manual outreach hours",
  },
  sift: {
    value: "42%",
    caption: "ATS-score improvement average after AI resume rewrite",
  },
};

const PREVIEWS: Record<string, { src: string; alt: string }> = {
  "cg-walls-and-floors": {
    src: "/work/cgwalls/hero.jpg",
    alt: "CG Walls & Floors — the site's home page",
  },
  capitalcommand: {
    src: "/work/capitalcommand/01-overview.jpg",
    alt: "CapitalCommand — the command overview dashboard",
  },
  sift: {
    src: "/work/sift/01-command-overview.jpg",
    alt: "SIFT — the command overview dashboard",
  },
  cadencestack: {
    src: "/work/cadencestack/01-command-center.jpg",
    alt: "CadenceStack — the command centre dashboard",
  },
};

export type VaultEntry = {
  slug: string;
  name: string;
  sector: string;
  year: string;
  pillars: Pillar[];
  figure?: { value: string; caption: string };
  preview?: { src: string; alt: string };
  live: boolean;
};

/** Live studies in data order, then anything still in production. */
export const vault: VaultEntry[] = Object.values(caseStudies)
  .map(function toEntry(study): VaultEntry {
    return {
      slug: study.slug,
      name: study.client,
      sector: study.sector,
      year: study.year,
      pillars: study.pillars,
      figure: FIGURES[study.slug],
      preview: PREVIEWS[study.slug],
      live: study.status === "live",
    };
  })
  .sort(function liveFirst(a, b) {
    return Number(b.live) - Number(a.live);
  });

export const liveCount = vault.filter(function isLive(e) {
  return e.live;
}).length;

export const PILLARS: Pillar[] = ["Design", "Automate", "Grow"];

export function countFor(pillar: Pillar | null) {
  return vault.filter(function matches(e) {
    return e.live && (pillar === null || e.pillars.includes(pillar));
  }).length;
}
