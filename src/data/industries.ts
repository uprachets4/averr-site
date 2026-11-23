/**
 * Verticals as search pillars.
 *
 * An industry page sits between a service pillar and the case files
 * under it: /services/websites says what a website build includes,
 * /industries/contractors says what it includes for a contractor and
 * shows the two contractor builds together. It exists because a
 * category search deserves a category page.
 *
 * The specific thing that prompted it: "contractor website design
 * toronto" was declared on the CG Walls & Floors case file, which was
 * the only one of the five carrying a category-plus-city commercial
 * term — the other four are project-shaped ("appliance installer
 * website design", "fintech dashboard design"). So the site's most
 * commercial vertical keyword was pinned to a leaf node that can only
 * ever show one project, passes authority to nothing below it, and
 * answers "what did you do for them" when the query asks "do you do
 * this for businesses like me".
 *
 * That keyword now lives here and CG has been retargeted in line with
 * the other four. Worth doing in November 2026 rather than later
 * precisely because the page had no ranking history to lose: the same
 * change against an established page is a real trade-off, and this one
 * cost nothing.
 *
 * Gated like PILLARS, for the same reason. Industry pages are the
 * classic doorway-page shape — one template, the vertical swapped,
 * twenty pages, no substance — and Google filters exactly that. So an
 * industry page may only ship with at least two case files of its own
 * and a live parent pillar, and `tools/keyword-map.test.ts` enforces
 * both by name rather than leaving it to judgement.
 *
 * Readiness when this was written:
 *
 *   contractors   2 case files, 1 guide, websites live   → live
 *   grocery       0 case files                           → waiting
 */
/* Explicit extensions: this file is in the import graph of
   tools/keyword-map.test.ts, which runs under `node --test`. Vite
   resolves extensionless imports and Node does not, so dropping the
   `.ts` builds clean and fails the test suite — the same way
   documentMeta.ts did when it started importing pillars. */
import { pillarHref } from "./pillars.ts";
import type { ServiceId } from "./serviceColors.ts";

export type Industry = {
  /** URL segment under /industries. Kebab-case. */
  slug: string;
  /** Full name, for the H1 and the page title. */
  name: string;
  /** Short form, for breadcrumbs and in-sentence links. */
  short: string;
  /**
   * The service pillar this vertical buys. An industry page may not
   * ship while its pillar has no page, because the crumb trail and the
   * "what this includes" link would both point at an anchor on the
   * overview rather than at a page — the hierarchy this exists to
   * create would not exist.
   */
  pillar: ServiceId;
  /**
   * Case file slugs, in the order they should read.
   *
   * Declared rather than matched on `sector`, and that is deliberate:
   * sectors are prose written for a reader ("Home renovation, GTA",
   * "Appliance installation, GTA"), so any string match that groups
   * those two today breaks the moment someone writes "Renovations" or
   * drops the ", GTA". The same lesson as `Pillar.capabilities`, which
   * was derived first and got Web Apps wrong.
   *
   * `tools/keyword-map.test.ts` asserts every slug here resolves, so a
   * renamed case file fails the build instead of quietly emptying the
   * proof section.
   */
  proof: string[];
  /** Guide slugs that support this vertical, by slug for the same reason. */
  guides: string[];
  /**
   * The one search this page owns, or null while it has no page.
   * Unique across the site; the keyword test fails if two pages claim
   * the same search.
   */
  target: string | null;
  /** True when a page actually ships at /industries/<slug>. */
  live: boolean;
  /** Why there is no page yet — the reason, not just the flag. */
  waitingOn?: string;
};

export const INDUSTRIES: Record<string, Industry> = {
  contractors: {
    slug: "contractors",
    name: "Contractors and home services",
    short: "Contractors",
    pillar: "websites",
    /* Express first: it is the fuller build of the two and the one
       with the review history, so it carries more weight with a
       contractor deciding whether this studio understands the trade. */
    proof: ["express-contractors", "cg-walls-and-floors"],
    guides: ["what-to-put-on-a-contractor-website"],
    target: "contractor website design toronto",
    live: true,
  },
  grocery: {
    slug: "grocery",
    name: "Grocery and food retail",
    short: "Grocery",
    pillar: "webApps",
    proof: [],
    guides: [],
    target: null,
    live: false,
    waitingOn:
      "its first case file. Indian Brothers Supermarket is a website plus an online ordering and delivery platform, which is the whole vertical in one project — but one project is an anecdote, and this page needs two before it is more than a template with a vertical swapped in.",
  },
};

/**
 * Where to send someone who wants this vertical.
 *
 * A live industry gets its own page; one that is not yet live falls
 * back to its parent pillar, so a link is never dead and never waits
 * on the page being built. Same contract as `pillarHref`.
 */
export function industryHref(key: string): string {
  const i = INDUSTRIES[key];
  if (!i) return "/services";
  /* The fallback goes through `pillarHref` rather than building
     `/services/<slug>` here. Writing the slug by hand meant mapping
     camelCase ids to kebab segments a second time, which was already
     wrong for aiAutomation, and it would have linked to a pillar page
     that does not exist whenever the parent is not live. */
  return i.live ? `/industries/${i.slug}` : pillarHref(i.pillar);
}

/** The industries that ship a page, in declaration order. */
export function liveIndustries(): string[] {
  return Object.keys(INDUSTRIES).filter((k) => INDUSTRIES[k].live);
}

/**
 * The live industry pages under one pillar.
 *
 * This exists because the first version of /industries/contractors
 * shipped orphaned — nothing on the site linked to it. That is fatal
 * for a page whose whole argument is that it sits above the case files
 * and passes authority down: with no inbound links it collects nothing
 * to pass. The pillar page and the supporting guides link through here
 * so a new vertical is linked the moment it goes live rather than
 * whenever someone remembers to add it.
 */
export function industriesForPillar(id: ServiceId): Industry[] {
  return liveIndustries()
    .map((k) => INDUSTRIES[k])
    .filter((i) => i.pillar === id);
}

/** The live industries whose cluster includes this guide. */
export function industriesForGuide(slug: string): Industry[] {
  return liveIndustries()
    .map((k) => INDUSTRIES[k])
    .filter((i) => i.guides.includes(slug));
}
