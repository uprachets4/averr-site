import { caseStudies } from "./caseStudies";

/**
 * The hero reel — one screen per live case study, each chosen because it is
 * NOT already rendered on the home page (StorySoFar uses every study's 01-*
 * screen, CaseStudies uses cgwalls/gallery.jpg).
 */
const REEL_IMAGE: Record<string, { src: string; alt: string }> = {
  "cg-walls-and-floors": {
    src: "/work/cgwalls/gallery2.jpg",
    alt: "CG Walls & Floors — the project gallery page, before-and-after renovation cards",
  },
  capitalcommand: {
    src: "/work/capitalcommand/03-markets.jpg",
    alt: "CapitalCommand — the market regimes dashboard, cross-asset signal cards",
  },
  sift: {
    src: "/work/sift/08-command-insights.jpg",
    alt: "SIFT — the command insights view, application funnel and source breakdown",
  },
  cadencestack: {
    src: "/work/cadencestack/04-performance-analytics.jpg",
    alt: "CadenceStack — the performance analytics view, post reach and engagement over time",
  },
};

export type ReelCard = {
  slug: string;
  client: string;
  tags: string[];
  sector: string;
  src: string;
  alt: string;
};

/** Live studies only, in data order. */
export const reelCards: ReelCard[] = Object.values(caseStudies)
  .filter(function isLive(study) {
    return study.status === "live" && !!REEL_IMAGE[study.slug];
  })
  .map(function toCard(study) {
    const image = REEL_IMAGE[study.slug];
    return {
      slug: study.slug,
      client: study.client,
      tags: study.pillars,
      sector: study.sector,
      src: image.src,
      alt: image.alt,
    };
  });
