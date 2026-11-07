import type { ProcessStep } from "../../../data/aboutProcess";

/**
 * One step of the process.
 *
 * All five are in the DOM, stacked and vertically centred; only the
 * active one is `on`, and they crossfade. The "You receive" chip takes
 * the step's own colour through `--sc`.
 *
 * Below 900px on a short screen the You/Prachets row is hidden by the
 * sheet, not by a condition here — the content stays in the document
 * for anything reading it.
 */
export default function StepCard({
  step,
  index,
  total,
  cardRef,
}: {
  step: ProcessStep;
  index: number;
  total: number;
  cardRef: (el: HTMLElement | null) => void;
}) {
  return (
    <article
      className={`step${index === 0 ? " on" : ""}`}
      aria-hidden={index === 0 ? "false" : "true"}
      style={{ "--sc": step.color } as React.CSSProperties}
      ref={cardRef}
    >
      <div className="top">
        <span className="mono">
          Step {index + 1} of {total}
        </span>
        <span className="when">{step.when}</span>
      </div>
      <h3>{step.name}</h3>
      <p>{step.line}</p>
      <div className="who2">
        <div>
          <b>You</b>
          {step.you}
        </div>
        <div>
          <b>Prachets</b>
          {step.prachets}
        </div>
      </div>
      <div className="recv">
        You receive <span>{step.receive}</span>
      </div>
    </article>
  );
}
