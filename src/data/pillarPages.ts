/**
 * The data behind every service pillar page.
 *
 * `/services/websites` was built first and called the pattern for the
 * rest, which it was — but a pattern asserted once is a copy waiting
 * to happen. The second pillar is the moment to factor it, so the
 * third and fourth are data rather than another page file, and a
 * layout fix lands on all of them at once instead of three times.
 *
 * Three things are derived, because the site already owns them and a
 * second copy would drift: the proof, the capability rows and the
 * guide cluster. One thing is written per pillar, because it cannot be
 * derived and should not be templated: the words. A page whose hero is
 * generated from the service name reads exactly like what it is.
 */
import { PILLAR_SERVICES } from "./servicePillars";
import { PILLARS } from "./pillars";
import { BUILT, type BuiltProject } from "./builtByAverr";
import { GUIDES, type Guide } from "./guides";
import { SERVICE_COLOR, type ServiceId } from "./serviceColors";

/** A capability row: what this service actually delivers. */
export type Capability = { name: string; outcome: string };

/** Every capability record across the three delivery pillars, flat. */
const ALL_CAPABILITIES: Capability[] = Object.values(PILLAR_SERVICES).flat();

/**
 * The capability rows for a pillar, in the order it declares them.
 *
 * Resolved by name against the flat record list. Unknown names are
 * dropped here rather than throwing — a missing row is a thin page,
 * a thrown error at module load is a blank site — and
 * `tools/keyword-map.test.ts` fails on any name that does not resolve,
 * so the quiet version cannot survive a build.
 */
export function pillarCapabilities(id: ServiceId): Capability[] {
  return PILLARS[id].capabilities
    .map((name) => ALL_CAPABILITIES.find((c) => c.name === name))
    .filter(function present(c): c is Capability {
      return Boolean(c);
    });
}

/**
 * The case files where this service was the job.
 *
 * `svc[0]` is the lead service, so this is work someone hired us to
 * do rather than work that happened to touch it. It matters most on
 * these pages, because this is the page making the claim: AI
 * automation appears in four case files and has led none, and a page
 * built on tags rather than leads would not show that.
 */
export function pillarProof(id: ServiceId): BuiltProject[] {
  return BUILT.filter((p) => p.svc[0] === id);
}

/** The guides that hand their reader up to this service. */
export function pillarGuides(id: ServiceId): Guide[] {
  return GUIDES.filter((g) => g.svc.includes(id));
}

export function pillarAccent(id: ServiceId): string {
  return SERVICE_COLOR[id];
}

/**
 * The words. Written per pillar, never templated from the service
 * name — the whole argument of each page is different, and a reader
 * comparing two of them should not be able to see the mould.
 */
export type PillarCopy = {
  eyebrow: string;
  head: string;
  /** Set in the service's own colour, so one page is never painted
   *  with the four-service gradient. */
  headAccent: string;
  sub: string;
  includedEyebrow: string;
  includedHead: string;
  /** Rows true of this service that no capability record covers. */
  extraIncluded?: Capability[];
  proofEyebrow: string;
  proofHead: string;
  proofLede: string;
  readEyebrow: string;
  readHead: string;
  closeHead: string;
  closeBody: string;
  /** Where the secondary close link goes, and what it says. */
  closeAltLabel: string;
};

export const PILLAR_COPY: Partial<Record<ServiceId, PillarCopy>> = {
  websites: {
    eyebrow: "Websites · Toronto & the GTA",
    head: "A custom website, built by hand",
    headAccent: "for your business.",
    sub: "Designed and built by the person you brief, in 2 – 3 weeks. No theme, no page builder, no account manager between you and the work.",
    includedEyebrow: "What a build includes",
    includedHead: "Direction first, then the site itself.",
    extraIncluded: [
      {
        name: "The person you brief builds it",
        outcome:
          "No handover to a production team. You review each section as it is ready and change what doesn't feel like you.",
      },
    ],
    proofEyebrow: "Where it's gone live",
    proofHead: "Sites doing real work.",
    proofLede: "Two businesses in the GTA who needed a site that did real work.",
    readEyebrow: "Before you decide",
    readHead: "Worth reading first, whoever you hire.",
    closeHead: "Thirty minutes, and you'll know what your site needs.",
    closeBody:
      "Tell me what you do and who it's for. You'll get a fixed scope, a fixed timeline and a fixed price in writing within 3 business days. If a site builder would serve you better for now, you'll hear that instead.",
    closeAltLabel: "All four services, and the questions",
  },
  webApps: {
    eyebrow: "Web apps · Toronto & the GTA",
    head: "Software for the part of the business",
    headAccent: "a spreadsheet stopped holding.",
    sub: "Dashboards, internal tools and client portals, built by the person you brief. Scoped around the one record your work revolves around, not around a feature list.",
    includedEyebrow: "What a build includes",
    includedHead: "The thinking you can't see in a demo.",
    extraIncluded: [
      {
        name: "Permissions decided before code",
        outcome:
          "Who sees what, and who can change it. It is most of the work on any app and none of it is visible on a screenshot.",
      },
      {
        name: "A history of who changed what",
        outcome:
          "You will want it the first time something is wrong, and it cannot be added convincingly afterwards.",
      },
    ],
    proofEyebrow: "Shipped and in use",
    proofHead: "Three tools people work in daily.",
    proofLede:
      "A job-search pipeline, a content operation and a markets desk. Different industries, the same problem: the work had outgrown what a spreadsheet could hold.",
    readEyebrow: "Before you decide",
    readHead: "Two questions worth settling first.",
    closeHead: "Thirty minutes, and you'll know what it takes.",
    closeBody:
      "Bring the thing you do by hand every week. We'll work out whether it's an app, a website with one feature, or a process that wants writing down before anybody builds anything. You'll get a fixed scope and price in writing within 3 business days.",
    closeAltLabel: "All four services, and the questions",
  },
};
