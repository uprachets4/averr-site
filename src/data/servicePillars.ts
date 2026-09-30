/**
 * The pillar facts that more than one surface prints.
 *
 * /services owns the full pillar records; these are the fields home also
 * shows, lifted out so the two can't drift apart the way a duplicated
 * literal does. No prices live here — the studio quotes on the call.
 */

export type PillarId = "design" | "automate" | "grow";

/** Delivery time per pillar. /services prints it beside "Book a call";
 *  home's doors print it where the price used to sit. */
export const PILLAR_TIMELINE: Record<PillarId, string> = {
  design: "2 – 3 weeks",
  automate: "1 – 2 weeks",
  grow: "Ongoing",
};

/* ── the services themselves ──────────────────────────────────────── */

export type Service = {
  /** What the thing is called, in the words a buyer would use. */
  name: string;
  /** What they get, one sentence. */
  outcome: string;
  /**
   * Case-study slugs whose OWN copy shows this service was delivered —
   * inventory, approach or a signature, not an inference. A service with
   * no verified pair gets an empty array and renders no proof chip; that
   * is intended, not a gap to be filled with a weaker link.
   */
  proof: string[];
  /**
   * The original "what's included" string this line renders in plain
   * language. Never rendered. Kept so every service on the page can be
   * traced back to the claim it came from — Session 17b rewrote the
   * wording, not the offer.
   */
  from: string;
};

export const PILLAR_SERVICES: Record<PillarId, Service[]> = {
  design: [
    {
      name: "Brand & design direction",
      outcome:
        "A palette, type and look that's yours, before a line of code.",
      proof: ["cg-walls-and-floors", "sift"],
      from: "Brand audit + design direction",
    },
    {
      name: "Marketing websites",
      outcome: "Custom-built on Next.js or Framer, up to 15 pages.",
      proof: ["cg-walls-and-floors", "sift"],
      from: "Custom site build (Next.js or Framer, up to 15 pages)",
    },
    {
      name: "Product & SaaS interfaces",
      outcome:
        "Dashboards and apps people can actually find their way around.",
      proof: ["capitalcommand", "sift", "cadencestack"],
      from: "SaaS product UI + component library",
    },
    {
      name: "Design systems",
      outcome: "Components, tokens and motion your team can reuse.",
      proof: ["sift"],
      from: "Design tokens + motion primitives",
    },
    {
      name: "Post-launch refinement",
      outcome: "We keep improving it after it's live.",
      proof: [],
      from: "Iterative refinement post-launch",
    },
  ],
  automate: [
    {
      name: "Workflow audit",
      outcome:
        "We map where your team's hours go, and what can come off their plate.",
      // A reduced-hours figure shows an outcome, not that an audit was
      // delivered. Ruled out in 17b rather than linked on an inference.
      proof: [],
      from: "Workflow audit + system design",
    },
    {
      name: "AI agents",
      outcome:
        "Lead qualification, intake and research, handled automatically.",
      proof: ["cg-walls-and-floors", "capitalcommand", "sift"],
      from: "AI agent build (lead qual, intake, research)",
    },
    {
      name: "Tool integration",
      outcome:
        "CRM, email and calendar talking to each other, no copy-paste.",
      proof: [],
      from: "CRM + email + calendar integration",
    },
    {
      name: "Human review built in",
      outcome:
        "AI drafts, your team approves, and nothing goes out unchecked.",
      // CapitalCommand's "research before execution" is product philosophy,
      // not a review layer we built for a team. Ruled out in 17b.
      proof: ["sift", "cadencestack"],
      from: "Human-review layer for LLM outputs",
    },
    {
      name: "Handoff documentation",
      outcome: "Your team can run and change it without us.",
      proof: [],
      from: "Documentation for team handoff",
    },
  ],
  grow: [
    {
      name: "Local search",
      outcome:
        "Google Business Profile, reviews and local rankings that bring in nearby customers.",
      proof: ["cg-walls-and-floors"],
      from: "Google Business Profile optimization + Durham Region hotspot map",
    },
    {
      name: "Outreach campaigns",
      outcome: "Targeted outreach to the people most likely to hire you.",
      proof: ["cg-walls-and-floors"],
      from: "Realtor lead-gen infrastructure + door-to-door playbook",
    },
    {
      name: "Paid ads",
      outcome:
        "Google, Meta, LinkedIn and Local Services Ads, run and tuned.",
      proof: [],
      from: "Paid campaigns (Google, Meta, LinkedIn, LSA)",
    },
    {
      name: "Landing pages",
      outcome: "Built for each campaign, so clicks turn into enquiries.",
      proof: [],
      from: "Landing pages built for the ads",
    },
    {
      name: "Content",
      outcome:
        "Long-form, LinkedIn and YouTube that build trust over time.",
      proof: ["cadencestack"],
      from: "Long-form content + LinkedIn + YouTube",
    },
    {
      name: "Reporting",
      outcome:
        "Attribution and monthly reports that show what's working, in plain numbers.",
      proof: [],
      from: "Attribution + monthly reporting",
    },
  ],
};

/** Pillar order, everywhere. */
export const PILLAR_ORDER: PillarId[] = ["design", "automate", "grow"];

/** Display name per pillar — the eyebrow the index groups under. */
export const PILLAR_NAME: Record<PillarId, string> = {
  design: "Design",
  automate: "Automate",
  grow: "Grow",
};

/** Counted from the data, so the hero's "N WAYS WE HELP" can never drift
 *  from the list underneath it. */
export const SERVICE_COUNT = PILLAR_ORDER.reduce(
  (n, p) => n + PILLAR_SERVICES[p].length,
  0
);

/* ── the Grow visual's sample figures ─────────────────────────────── */

export type GrowMetric = {
  label: string;
  end: number;
  format: (n: number) => string;
  delta: string;
};

/**
 * Sample figures for the Grow visual — a plausible engagement curve, NOT a
 * client result. Every surface that renders them must carry the
 * "ILLUSTRATIVE" label so they can't be read as proof.
 */
export const GROW_METRICS: GrowMetric[] = [
  {
    label: "Impressions",
    end: 48.2,
    format: (n) => `${n.toFixed(1)}K`,
    delta: "+42%",
  },
  {
    label: "Engagement",
    end: 6.8,
    format: (n) => `${n.toFixed(1)}%`,
    delta: "+18%",
  },
  {
    label: "CTR",
    end: 3.4,
    format: (n) => `${n.toFixed(1)}%`,
    delta: "+24%",
  },
  {
    label: "Sessions",
    end: 12.1,
    format: (n) => `${n.toFixed(1)}K`,
    delta: "+36%",
  },
];

/** The label every illustrative figure carries. */
export const ILLUSTRATIVE_LABEL = "Illustrative";
