/**
 * The /services process facts — the three steps, the refusals, and the
 * illustrative pipeline chips.
 *
 * Lifted out of Services.tsx in Session 17 so the page file stays readable
 * once the kickoff calendar, the struck "no" list and the pipeline each own
 * a component. No prices live here — the studio quotes on the call.
 */

/* ── the three steps, mapped onto a 14-day calendar ──────────────────
 *
 * Day 01 is a Monday. That is what makes "3 business days" land on day 04
 * without stepping over a weekend, and it is the only assumption the
 * mapping adds to the copy.
 *
 *   01        Mon    the call
 *   02 – 03   Tue–Wed  (unlabelled — the copy does not say)
 *   04        Thu    the proposal, 3 business days after the call
 *   05        Fri    (unlabelled)
 *   06 – 07   Sat–Sun  weekend
 *   08 – 12   Mon–Fri  kickoff week
 *   13 – 14   Sat–Sun  weekend; day 14 is the outer bound the h2 promises
 *
 * Only these three steps' own copy is allowed to appear on the calendar.
 * Every other cell stays unlabelled: inventing a caption for day 05 would
 * be inventing process the page never claims.
 */

export type ProcessStep = {
  n: string;
  title: string;
  body: string;
};

export const STEPS: ProcessStep[] = [
  {
    n: "01",
    title: "Book a discovery call.",
    body: "20 minutes. No slide deck. We ask questions, you ask questions, both sides decide whether this is a fit.",
  },
  {
    n: "02",
    title: "Scoped proposal in 3 business days.",
    body: "Fixed scope, fixed timeline, fixed price. If we can't quote it, we tell you why and refer you to someone who can.",
  },
  {
    n: "03",
    title: "Kickoff week.",
    body: "Async by default, one review call a week. You get preview URLs from day one, not deliverables at the end.",
  },
];






/* ── what we don't do ─────────────────────────────────────────────── */

export type Refusal = {
  text: string;
  /** The thing being refused — a VERBATIM substring of `text`. A 2px rule
   *  draws across exactly this span and it drops to 0.45 opacity; the rest
   *  of the sentence stays at full weight. Decorative only: screen readers
   *  get `text` unchanged. Verified as a substring at module load below. */
  struck: string;
};

export const NOT_DOING: Refusal[] = [
  {
    text: "We don't do retainers with 12-month minimums.",
    struck: "retainers with 12-month minimums",
  },
  {
    text: "We don't white-label for agencies.",
    struck: "white-label for agencies",
  },
  {
    text: "We don't take projects we can't ship in 90 days.",
    struck: "projects we can't ship in 90 days",
  },
];

/**
 * The verbatim rule, enforced rather than trusted.
 *
 * A struck phrase that is not an exact substring of its own sentence is a
 * bug we would otherwise only catch by eye, so it throws in development and
 * degrades to "no strike" in production rather than rendering a lie.
 */
export function splitRefusal(r: Refusal): {
  before: string;
  struck: string;
  after: string;
} {
  const i = r.text.indexOf(r.struck);
  if (i < 0) {
    if (import.meta.env.DEV) {
      throw new Error(
        `[servicesProcess] struck phrase is not verbatim: "${r.struck}" not found in "${r.text}"`
      );
    }
    return { before: r.text, struck: "", after: "" };
  }
  return {
    before: r.text.slice(0, i),
    struck: r.struck,
    after: r.text.slice(i + r.struck.length),
  };
}

/* ── the automate pipeline ────────────────────────────────────────── */

/**
 * What one task is called as it clears each node of the Automate diagram.
 * Index i is the label a chip carries after passing node i, so a chip
 * leaving "Trigger" reads "New lead" and one arriving at "Measure" reads
 * "Logged".
 *
 * ILLUSTRATIVE — a plausible shape for a lead-intake system, not a log of
 * anything that ran. Every surface rendering them carries the label.
 */
export const PIPELINE_CHIPS = [
  "New lead",
  "Enriched",
  "Draft ready",
  "Sent",
  "Logged",
];
