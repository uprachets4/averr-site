/**
 * The four services as search pillars.
 *
 * A pillar is a page that owns one commercial search and has a cluster
 * of guides and case studies pointing up at it. The site had the
 * services (four of them, on one page) and the material (five case
 * files, four guides) but no pillars, so three of four revenue lines
 * had nothing competing for their own search, and every guide pointed
 * at /contact rather than at the thing it sells.
 *
 * Why this is a registry and not four page files: a pillar is only
 * worth shipping when there is something behind it. Four pages built
 * off one skeleton with the service name swapped is the doorway-page
 * pattern, and Google filters those. So readiness is declared here and
 * enforced in `tools/keyword-map.test.ts` — a pillar cannot go live
 * until it has proof and a cluster, and the test says so by name.
 *
 * Readiness when this was written:
 *
 *   websites       2 case studies, 2 guides   → live
 *   webApps        3 case studies, 0 guides   → waiting on guides
 *   aiAutomation   4 case studies, 0 guides   → waiting on guides
 *   marketing      2 case studies, 2 guides   → waiting on real proof
 *
 * That table is the whole argument for doing this in order rather than
 * all at once. It also decides what to write next: a guide is worth
 * writing when it unlocks a pillar, which is a better reason than
 * picking the next idea off the content bank.
 */
import type { ServiceId } from "./serviceColors";

export type Pillar = {
  /** URL segment under /services. Kebab-case; the ServiceId is camel. */
  slug: string;
  /**
   * The one search this pillar owns, or null while it has no page.
   * Unique across the whole site — `tools/keyword-map.test.ts` fails
   * if two pages claim one search.
   */
  target: string | null;
  /**
   * True when a page actually ships at /services/<slug>.
   *
   * Declared, not derived — and deliberately separate from whether the
   * pillar is *ready*. Readiness is computed from the data (how many
   * case studies and guides point at this service) in
   * `tools/keyword-map.test.ts`, which asserts that anything live is
   * ready and prints the ready-but-not-live ones as the to-do list.
   * Keeping the two apart is what lets this file stay pure: the guide
   * pages import it for a link and must not drag the whole case-study
   * set into their bundle to do it.
   */
  live: boolean;
  /**
   * Why this pillar has no page yet. Kept in code, not in a doc,
   * because the next person to look at this will be deciding whether
   * to flip `live` and deserves the reason rather than the flag.
   */
  waitingOn?: string;
};

export const PILLARS: Record<ServiceId, Pillar> = {
  websites: {
    slug: "websites",
    /* /services keeps "web design services toronto": it is indexed
       under that phrase already and it genuinely is the overview. This
       is the narrower buying search, which is what a pillar should
       win. Worth revisiting which page should hold the stronger phrase
       once this one has ranking history of its own. */
    target: "custom website design toronto",
    /* Ready — 2 case studies, 2 guides — and the only one that is.
       Flipping this to true is the page's own change, so that the
       readiness rules guard the flip instead of being checked by hand
       after the fact. */
    live: false,
    waitingOn:
      "only the page. Proof and cluster are both in place, so this is the pillar to build first and the pattern for the rest.",
  },
  webApps: {
    slug: "web-apps",
    target: null,
    live: false,
    waitingOn:
      "guides. Sift, CadenceStack and CapitalCommand are real proof, but no guide supports this service, so the page would ship with nothing linking up to it.",
  },
  aiAutomation: {
    slug: "ai-automation",
    target: null,
    live: false,
    waitingOn:
      "proof and guides. Four case files touch automation but none was hired as an automation job, and no guide supports it — so the service most visible in the work is the least evidenced as a service.",
  },
  marketing: {
    slug: "marketing",
    target: null,
    live: false,
    waitingOn:
      "a marketing-led case study. Two case files tag marketing and neither was hired for it — both are builds with a Grow phase. By tag counts this pillar reads ready, which is exactly why the readiness rule counts lead work only. Indian Brothers at launch is the first real candidate.",
  },
};

/**
 * Where to send someone who wants this service.
 *
 * A live pillar gets its own page; one that is not yet live falls back
 * to its section on the overview, so a link is never dead and never
 * waits on the page being built. Every service link on the site goes
 * through here, which is what makes flipping `live` a one-line change.
 */
export function pillarHref(id: ServiceId): string {
  const p = PILLARS[id];
  return p.live ? `/services/${p.slug}` : `/services#${p.slug}`;
}

/** The pillars that ship a page, in declaration order. */
export function livePillars(): ServiceId[] {
  return (Object.keys(PILLARS) as ServiceId[]).filter((id) => PILLARS[id].live);
}
