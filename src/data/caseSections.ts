/**
 * The case-study chapters, named once.
 *
 * Each section renders its eyebrow from here and the reading rail labels
 * itself from the same records, so the rail can never drift from the page
 * a reader lands on. Numbers stay fixed to the section, not to a study's
 * own sequence — CG Walls has no Signatures, and its Outcome is still 05.
 */
export type CaseSection = {
  /** Anchor id, also the scroll target the rail links to. */
  id: string;
  /** The "//_NN" marker. */
  number: string;
  /** The section's own name, lowercase as the eyebrow prints it. */
  label: string;
};

export const SECTIONS = {
  context: { id: "context", number: "01", label: "context" },
  approach: { id: "approach", number: "02", label: "approach" },
  inventory: { id: "built", number: "03", label: "what we built" },
  signatures: { id: "signatures", number: "04", label: "signature moments" },
  outcome: { id: "outcome", number: "05", label: "outcome" },
  next: { id: "next", number: "06", label: "what's next" },
} satisfies Record<string, CaseSection>;

/** The eyebrow string a section prints, e.g. "//_01 · context". */
export function eyebrowFor(section: CaseSection) {
  return `//_${section.number} · ${section.label}`;
}

/**
 * The chapters the rail offers, in reading order — Context through Outcome,
 * skipping what a study doesn't carry. Next and the CTA sit past the rail's
 * range, matching the spec's "hero end → Outcome end" window.
 */
export function railSections(opts: { hasSignatures: boolean }): CaseSection[] {
  const list: CaseSection[] = [
    SECTIONS.context,
    SECTIONS.approach,
    SECTIONS.inventory,
  ];
  if (opts.hasSignatures) list.push(SECTIONS.signatures);
  list.push(SECTIONS.outcome);
  return list;
}
