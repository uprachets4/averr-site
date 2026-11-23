/**
 * Copy and derivations for the industry pages.
 *
 * Same split as `pillarPages.ts`: what can be computed from the data is
 * computed, and the words are written per vertical. An industry page
 * whose copy could be generated from its name is the doorway page the
 * registry comment warns about, so there is no default copy here and a
 * vertical without an entry renders nothing.
 *
 * The "needs" rows are the one thing that genuinely cannot be derived.
 * A pillar page lists capabilities from `PILLAR_SERVICES` — what the
 * studio sells. An industry page has to say what this trade actually
 * needs, which comes from having built for them rather than from any
 * record in the data. Each row below traces to a decision on the
 * Express Contractors or CG Walls & Floors build.
 */
import { BUILT, type BuiltProject } from "./builtByAverr";
import { GUIDES, type Guide } from "./guides";
import { INDUSTRIES } from "./industries";

export type IndustryNeed = { name: string; outcome: string };

export type IndustryCopy = {
  eyebrow: string;
  head: string;
  headAccent: string;
  sub: string;
  needsEyebrow: string;
  needsHead: string;
  needs: IndustryNeed[];
  proofEyebrow: string;
  proofHead: string;
  proofLede: string;
  readEyebrow: string;
  readHead: string;
  closeHead: string;
  closeBody: string;
  closeAltLabel: string;
};

/** The case files backing this vertical, in declared order. */
export function industryProof(key: string): BuiltProject[] {
  const slugs = INDUSTRIES[key]?.proof ?? [];
  return slugs
    .map((s) => BUILT.find((p) => p.slug === s))
    .filter(function present(p): p is BuiltProject {
      return Boolean(p);
    });
}

/** The guides supporting this vertical, in declared order. */
export function industryGuides(key: string): Guide[] {
  const slugs = INDUSTRIES[key]?.guides ?? [];
  return slugs
    .map((s) => GUIDES.find((g) => g.slug === s))
    .filter(function present(g): g is Guide {
      return Boolean(g);
    });
}

export const INDUSTRY_COPY: Record<string, IndustryCopy> = {
  contractors: {
    eyebrow: "Contractors and home services",
    head: "A website that gets you",
    headAccent: "called.",
    /* Two corrections went into this line, both caught by reading the
       case files again rather than from the brief.
       First: an earlier draft said both builds lead with the licence.
       Only Express does — gas work demands it, renovation does not.
       Second, and the one that reshaped the page: it claimed both were
       built around what a homeowner decides. Express is. CG is a
       one-person renovation crew whose stated problem is growing with
       no ad budget through realtors, "who hear from every contractor
       in the GTA" — its audience is the referrer, not the homeowner.
       Papering over that would have put a claim on the page that the
       linked case file contradicts one click later. The honest version
       is also the more useful page: a trade gets work two ways, and the
       page owes something different to each. */
    sub: "Two builds for GTA trades — an appliance installer who gets found by homeowners searching, and a renovation crew that grows through realtor referrals. Two routes to the same thing, and your page has to serve whichever one actually brings you work.",
    needsEyebrow: "What a trade site needs",
    needsHead: "Different from a company website, in six specific ways",
    /* Each row is a decision made on one of the two builds rather than
       a generic benefit. "Fast on site" and "Proof of the hidden work"
       in particular are things a trades site needs and a SaaS site does
       not, which is the whole justification for this page existing
       separately from /services/websites. */
    needs: [
      {
        name: "Credentials in the first screen",
        outcome:
          "Licence, registration and years in the trade where a homeowner is already looking, not buried in an About page. For gas work it is the permission to be in the room.",
      },
      {
        name: "Proof of the hidden work",
        outcome:
          "Real job photographs of the parts nobody sees, labelled at the point where the work is. Every competitor shows the finished result; almost none show what is behind it.",
      },
      {
        name: "One tap to the phone",
        outcome:
          "Tap-to-call visible without scrolling and repeated at the end, plus the steps that follow the call — most trades traffic is a phone, and not knowing what the call is like is what stops people making it.",
      },
      {
        name: "A named coverage area",
        outcome:
          "The towns written down rather than \"the GTA and surrounding regions\". Vagueness loses calls in both directions, and the places you serve are the words people type.",
      },
      {
        name: "Fast on a phone, on site",
        outcome:
          "People look you up standing in the kitchen on mobile data. Pages are prerendered and images lazy-loaded so the first screen arrives before they lose patience.",
      },
      {
        name: "Something a referrer can send",
        outcome:
          "If your work comes through realtors, builders or property managers, the page has a second job: making the person who recommended you look right. That is a finished-work gallery and a clean link, not a sales pitch.",
      },
    ],
    proofEyebrow: "Built for trades",
    proofHead: "Two contractors, two different routes to work",
    proofLede:
      "An appliance installation business and a one-person renovation crew. Express gets found by homeowners searching; CG grows through realtors, who hear from every contractor in the GTA. The two routes ask different things of a page, and between them they cover most of how a trade actually gets hired.",
    readEyebrow: "Read first",
    readHead: "What belongs on the page, section by section",
    closeHead: "Tell us the five jobs you want more of",
    /* An earlier draft ended this with "two of the trades we have worked
       with needed less than they expected", which is a claim about
       engagements that nothing in the data supports. Invented, and cut. */
    closeBody:
      "That and the photos already on your phone is enough to lay out a first version. The call is thirty minutes, and if what you need is a better Google listing rather than a new website, you will hear that instead.",
    closeAltLabel: "What a build includes",
  },
};
