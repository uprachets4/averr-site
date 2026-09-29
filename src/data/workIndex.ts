import { caseStudies, type Pillar } from "./caseStudies";

/**
 * The vault index. Every field comes straight from the case-study records,
 * including the headline figure — home and /work read the same one.
 *
 * PREVIEWS are each study's case-hero front image, so /work's film and the
 * case study it opens into show the same screen.
 *
 * A study's `year` carries both halves of its timeline ("2026 — internal
 * alpha"). The vault shows each half exactly once: the number in the row's
 * meta line, and the status only in the figure slot of rows with no measured
 * figure. Nothing is invented — both halves are the study's own string.
 * The case-study page still prints the full year unsplit.
 */
function splitYear(year: string) {
  const [head, ...rest] = year.split("—");
  const tail = rest.join("—").trim();
  return {
    number: head.trim(),
    status: tail ? tail.charAt(0).toUpperCase() + tail.slice(1) : undefined,
  };
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
  /** The year number alone — the status tail is carried by `status`. */
  year: string;
  pillars: Pillar[];
  figure?: { value: string; caption: string };
  /** Shown in the figure slot when there is no measured figure. */
  status?: string;
  preview?: { src: string; alt: string };
  /** The client's own accent, for the film's light. Ambient only. */
  tint?: string;
  live: boolean;
};

/** Live studies in data order, then anything still in production. */
export const vault: VaultEntry[] = Object.values(caseStudies)
  .map(function toEntry(study): VaultEntry {
    const year = splitYear(study.year);
    return {
      slug: study.slug,
      name: study.client,
      sector: study.sector,
      year: year.number,
      pillars: study.pillars,
      figure: study.headlineFigure,
      status: study.headlineFigure ? undefined : year.status,
      preview: PREVIEWS[study.slug],
      tint: study.tint,
      live: study.status === "live",
    };
  })
  .sort(function liveFirst(a, b) {
    return Number(b.live) - Number(a.live);
  });

export const liveCount = vault.filter(function isLive(e) {
  return e.live;
}).length;

