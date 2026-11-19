/**
 * /services/websites — the Websites pillar.
 *
 * The first pillar page, and the pattern for the three that follow. It
 * exists because the site claimed four services and had one service
 * URL: /services owns "web design services toronto" and the other
 * three lines had nothing competing for a search of their own.
 *
 * Everything here is derived from data the site already ships, which
 * is deliberate. A service page assembled by hand drifts from the rest
 * of the site within a month — a timeline typed here disagrees with
 * /about, a case file renamed elsewhere leaves a dead card behind.
 * Nothing on this page is typed that something else already owns.
 *
 * What this page does NOT carry, and why, because the omissions are
 * the decisions worth recording:
 *
 *   - No FAQ. The five website questions — builders, page count,
 *     phones, Google, rebuilds — were merged onto /services and are
 *     answered there. Repeating them in FAQPage markup on two URLs
 *     puts both in the running for one rich result and usually wins
 *     neither. The close links to them instead.
 *   - No process section. /services renders the five steps and /about
 *     renders the same steps split into what you do and what I do. A
 *     third telling would be the section that exists because service
 *     pages have one.
 *
 * What is left is what no other page carries: the two case files where
 * a website was the job rather than part of it, and the two guides
 * written for the person deciding. Those are the pillar's own.
 */
import { PILLAR_SERVICES, PILLAR_TIMELINE } from "./servicePillars";
import { BUILT, type BuiltProject } from "./builtByAverr";
import { GUIDES, type Guide } from "./guides";
import { SERVICE_COLOR } from "./serviceColors";

/** "2 – 3 weeks", read from the one place that owns it. */
export const WEBSITES_TIMELINE = PILLAR_TIMELINE.design;

/** The same window inside a sentence: "2 – 3 week build". */
const WINDOW = WEBSITES_TIMELINE.replace(/s$/, "");

export const WEBSITES_ACCENT = SERVICE_COLOR.websites;

/**
 * The case files where a website was the job.
 *
 * `svc[0]` is the lead service, so this is the work someone hired us
 * to do rather than work that happened to include a website. The
 * difference matters more here than anywhere: this is the page making
 * the claim, and a dashboard build listed as website proof is the kind
 * of stretch a reader notices.
 */
export const WEBSITES_PROOF: BuiltProject[] = BUILT.filter(
  function led(p) {
    return p.svc[0] === "websites";
  }
);

/**
 * What a website build includes.
 *
 * Filtered from the Design pillar's records by whether a websites-led
 * case file backs them, rather than taking the pillar wholesale. The
 * Design pillar is a delivery grouping, not a service: it also holds
 * product and SaaS interfaces and design systems, both of which are
 * only evidenced by app work. Listing those here would put dashboards
 * on a page about websites — which is what the first attempt at this
 * page did, by reading the whole pillar.
 */
const WEBSITES_PROOF_SLUGS = new Set(WEBSITES_PROOF.map((p) => p.slug));

export const WEBSITES_INCLUDED = PILLAR_SERVICES.design.filter(
  function evidenced(record) {
    return record.proof.some((slug) => WEBSITES_PROOF_SLUGS.has(slug));
  }
);

/**
 * The guides that hand their reader to this service.
 *
 * The cluster, made visible. These two already declare `svc:
 * ["websites"]` and already link up here; this is the same edge
 * pointing back down, which is the half that was missing — a reader
 * on the pillar who is not ready to book had nothing to read.
 */
export const WEBSITES_GUIDES: Guide[] = GUIDES.filter(function supports(g) {
  return g.svc.includes("websites");
});

export const WEBSITES_HERO = {
  eyebrow: "Websites · Toronto & the GTA",
  /* Names the search without reading as though it were written for
     one. "Custom" is the whole argument of the page and the word a
     buyer comparing a builder to a build actually types. */
  head: "A custom website, built by hand",
  headEmphasis: "for your business.",
  sub: `Designed and built by the person you brief, in ${WEBSITES_TIMELINE}. No theme, no page builder, no account manager between you and the work.`,
} as const;

export const WEBSITES_PROOF_INTRO = `Two businesses in the GTA who needed a site that did real work. Both built in ${WINDOW}.`;
