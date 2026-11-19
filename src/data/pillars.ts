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
   * The capability records from `PILLAR_SERVICES` this page lists,
   * by name, in the order they should read.
   *
   * Declared rather than derived, and the first version was derived:
   * a record was taken to belong here if any case file backing it was
   * led by this service. That gave the right two records for Websites
   * and was a coincidence. Applied to Web Apps it pulled in "Marketing
   * websites", because Sift is cited as proof of that capability while
   * being a web-app build — `proof` means "work that demonstrates
   * this", not "work this service leads".
   *
   * Which capability belongs on which service page is an editorial
   * call, so it is written down. `tools/keyword-map.test.ts` asserts
   * every name here resolves to a real record, so a rename shows up as
   * a failing test rather than as a page quietly missing a row.
   */
  capabilities: string[];
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
    capabilities: ["Brand & design direction", "Marketing websites", "Post-launch refinement"],
    /* /services keeps "web design services toronto": it is indexed
       under that phrase already and it genuinely is the overview. This
       is the narrower buying search, which is what a pillar should
       win. Worth revisiting which page should hold the stronger phrase
       once this one has ranking history of its own. */
    target: "custom website design toronto",
    /* The first pillar to ship. The readiness rules guarded this flip:
       2 websites-led case files and 2 guides behind it, which is what
       `a live pillar is a ready pillar` checks on every run. */
    live: true,
  },
  webApps: {
    slug: "web-apps",
    capabilities: ["Product & SaaS interfaces", "Design systems", "Human review built in", "Post-launch refinement"],
    target: "web app development toronto",
    /* Second pillar to ship. It was waiting on guides, not on build
       time — "website vs web app" and "when to replace a spreadsheet"
       were written to unlock it, and the readiness rule flipped to
       READY on its own once they existed. */
    live: true,
  },
  aiAutomation: {
    slug: "ai-automation",
    capabilities: ["Workflow audit", "AI agents", "Tool integration", "Handoff documentation"],
    target: null,
    live: false,
    waitingOn:
      "proof and guides. Four case files touch automation but none was hired as an automation job, and no guide supports it — so the service most visible in the work is the least evidenced as a service.",
  },
  marketing: {
    slug: "marketing",
    capabilities: ["Local search", "Outreach campaigns", "Content", "Reporting"],
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
