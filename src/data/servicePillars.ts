/**
 * The pillar facts that more than one surface prints.
 *
 * /services owns the full pillar records; these are the fields home also
 * shows, lifted out so the two can't drift apart the way a duplicated
 * literal does. No prices live here — the studio quotes on the call.
 */

/** Delivery time per pillar. /services prints it beside "Book a call";
 *  home's doors print it where the price used to sit. */
export const PILLAR_TIMELINE: Record<"design" | "automate" | "grow", string> = {
  design: "2 – 3 weeks",
  automate: "1 – 2 weeks",
  grow: "Ongoing",
};

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
