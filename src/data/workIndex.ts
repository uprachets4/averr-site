import { caseStudies, type Pillar } from "./caseStudies";

/**
 * The vault index. Every field comes straight from the case-study records,
 * including the headline figure — home and /work read the same one.
 *
 * Studies without a published figure fall back to their status, derived from
 * the tail of their own `year` string ("2026 — internal alpha" → "Internal
 * alpha"). Nothing is invented.
 */
function statusFrom(year: string) {
  const tail = year.split("—").pop()?.trim();
  if (!tail) return undefined;
  return tail.charAt(0).toUpperCase() + tail.slice(1);
}

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
  /** Shown in the figure slot when there is no measured figure. */
  status?: string;
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
      figure: study.headlineFigure,
      status: study.headlineFigure ? undefined : statusFrom(study.year),
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

