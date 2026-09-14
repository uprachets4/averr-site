export type Pillar = "Design" | "Automate" | "Grow";

export type CaseStudy = {
  slug: string;
  client: string;
  status: "live" | "draft";
  pillars: Pillar[];
  sector: string;
  year: string;
  hero: {
    eyebrow: string;
    thesis: string;
    thesisPill: string;
    kicker: string;
  };
  context: string[];
  approach: { pillar: Pillar; body: string }[];
  inventory: string[];
  signatures: { title: string; body: string }[];
  outcome: string;
  stack: string[];
  next: string;
};

const draft = (
  slug: string,
  client: string,
  pillars: Pillar[],
  sector: string
): CaseStudy => ({
  slug,
  client,
  status: "draft",
  pillars,
  sector,
  year: "",
  hero: { eyebrow: "", thesis: "", thesisPill: "", kicker: "" },
  context: [],
  approach: [],
  inventory: [],
  signatures: [],
  outcome: "",
  stack: [],
  next: "",
});

export const caseStudies: Record<string, CaseStudy> = {
  "cg-walls-and-floors": {
    slug: "cg-walls-and-floors",
    client: "CG Walls & Floors",
    status: "live",
    pillars: ["Design", "Automate", "Grow"],
    sector: "Home renovation, GTA",
    year: "2025 — ongoing",
    hero: {
      eyebrow: "//_CASE_STUDY",
      thesis:
        "A one-man renovation crew, a zero-budget mandate, and a realtor referral engine that runs itself.",
      thesisPill: "runs itself",
      kicker:
        "Turning a solo operator into a market presence that punches three brokerages above its weight.",
    },
    context: [
      "CG Walls & Floors is Max Francis's renovation business — drywall, paint, flooring, framing, trim, and door-and-window install. Ontario-registered, fully insured, one person in the truck.",
      "The mandate was blunt: no ad budget, no headcount, no time to burn. Growth had to come from realtor referrals — the single highest-leverage channel in the trade, where one relationship compounds into ten jobs a year. But realtors get pitched by every contractor in the GTA. The work was to make CG feel like the obvious call.",
    ],
    approach: [
      {
        pillar: "Design",
        body: "A single-page site that opens with the work, not the company. Cormorant Garamond display, copper accent — deliberately positioned to read like a boutique interior firm, not a Kijiji handyman.",
      },
      {
        pillar: "Automate",
        body: "A realtor activity monitor that surfaces which properties are about to hit market and need pre-listing touch-ups, plus an outreach system that drafts personalized emails per realtor, per listing.",
      },
      {
        pillar: "Grow",
        body: 'A Durham Region door-to-door playbook covering 29 neighbourhoods tier-ranked by home era and density, Google Business Profile optimization, and a single repeatable "free estimate" CTA baked into every touchpoint.',
      },
    ],
    inventory: [
      "Premium React site: animated hero, interactive service cards, tap-to-call CTAs wired to Max's number, Ontario-registered and fully-insured trust bar",
      "Realtor lead-gen infrastructure: scrapers that watch posting activity, AI email generator that references the specific listing",
      "Durham Region hotspot map: 29 neighbourhoods across Ajax, Pickering, Whitby, Oshawa, and Clarington — target streets, home-era data, tier rankings, tailored pitches, route planning, and a 15-second script playbook (Brock, Uxbridge, and Scugog flagged as skip zones)",
      "Google Business Profile seeded with an authentic Brampton homeowner review (basement flooring + paint, on-time delivery, transparent pricing)",
      "Zero-budget channel stack: Kijiji monitoring, Facebook Groups, building-permit data, NextDoor",
    ],
    signatures: [
      {
        title: "Copper on cream",
        body: "A deliberate departure from the trades-industry default of black and hazard yellow. Cost nothing; changed how the business reads at a glance.",
      },
      {
        title: '"Free estimate" as the only CTA',
        body: "One commitment, everywhere, in the same voice. No secondary asks fighting for attention.",
      },
      {
        title:
          "The map isn't a marketing asset — it's an operations tool",
        body: "Built for the driver behind the wheel, not the visitor scrolling a homepage.",
      },
    ],
    outcome:
      "The business now has a repeatable outreach rhythm one person can run between jobs, a website that reads at the same level as the firms three tiers up, and a referral infrastructure aimed at the highest-leverage segment in the trade. Realtor outreach that used to be ad-hoc is now templated, targeted, and personalized at scale — without a headcount to run it.",
    stack: [
      "React",
      "Framer",
      "Python scrapers",
      "Claude API",
      "Google Business Profile",
    ],
    next: "Brokerage-specific sequences across RE/MAX, Century 21, and Royal LePage. Landlord and pre-listing-seller flows. NextDoor as a warm-neighbourhood test channel.",
  },
  "careerclarity-ai": draft(
    "careerclarity-ai",
    "CareerClarity AI",
    ["Automate"],
    "AI for education"
  ),
  sift: draft("sift", "SIFT", ["Design", "Automate", "Grow"], "SaaS — job search"),
  cadencestack: draft(
    "cadencestack",
    "CadenceStack",
    ["Design", "Grow"],
    "SaaS — LinkedIn growth"
  ),
};
