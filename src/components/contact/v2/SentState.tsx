import { useEffect, useRef } from "react";
import { MARK_PATH_D } from "../../MonogramMark";
import { NEXT_STEPS } from "../../../data/contactBrief";
import { prefersReducedMotion, easeInOut } from "../../about/v2/useSectionProgress";

/**
 * What you see once the letter has actually landed: the mark signs,
 * "Talk soon.", and the four steps arriving in sequence.
 *
 * It takes focus and is a `role="status"`, so a screen reader is
 * told the send worked rather than left wondering.
 *
 * The signing and the four steps are written onto their nodes, but
 * this component is only mounted once the send has succeeded and
 * nothing re-renders it afterwards, so there is nothing to reconcile
 * them away.
 */
export default function SentState({
  email,
  onAgain,
  onBook,
}: {
  email: string;
  onAgain: () => void;
  onBook: () => void;
}) {
  const panelRef = useRef<HTMLDivElement | null>(null);
  const strokeRef = useRef<SVGPathElement | null>(null);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(function arrive() {
    const panel = panelRef.current;
    const path = strokeRef.current;
    if (!panel || !path) return;

    panel.focus({ preventScroll: true });

    const reduce = prefersReducedMotion();
    const L = path.getTotalLength();
    path.style.strokeDasharray = String(L);
    path.style.strokeDashoffset = String(L);

    const timers: number[] = [];
    let raf = 0;

    if (reduce) {
      path.style.strokeDashoffset = "0";
      panel.classList.add("signed");
      stepRefs.current.forEach((s) => s?.classList.add("on"));
      return;
    }

    const t0 = performance.now();
    (function sign(now: number) {
      const k = Math.min(1, (now - t0) / 1800);
      path.style.strokeDashoffset = String(L * (1 - easeInOut(k)));
      if (k < 1) raf = requestAnimationFrame(sign);
      else panel.classList.add("signed");
    })(t0);

    stepRefs.current.forEach(function stagger(s, i) {
      timers.push(window.setTimeout(() => s?.classList.add("on"), 500 + i * 220));
    });

    return function stop() {
      if (raf) cancelAnimationFrame(raf);
      for (const t of timers) window.clearTimeout(t);
    };
  }, []);

  return (
    <div className="sent">
      <div className="sentL" tabIndex={-1} role="status" ref={panelRef}>
        <svg viewBox="0 0 327 454" aria-hidden="true">
          <path className="mfill" d={MARK_PATH_D} fillRule="evenodd" />
          <path className="mstroke" d={MARK_PATH_D} fillRule="evenodd" ref={strokeRef} />
        </svg>
        <span className="eyebrow">Sent</span>
        <h3>
          Talk <span className="gt">soon</span>.
        </h3>
        <p>
          Your letter is in my inbox. I'll reply to {email} within 24 hours.
        </p>
        <div className="row">
          <button className="btn" type="button" onClick={onBook}>
            Book the call now →
          </button>
          <button className="ghost" type="button" onClick={onAgain}>
            Write another
          </button>
        </div>
      </div>

      <div className="next" aria-label="What happens next">
        <span className="mono">What happens next</span>
        {NEXT_STEPS.map(function step(s, i) {
          return (
            <div
              className="nx"
              key={s.title}
              ref={(el) => {
                stepRefs.current[i] = el;
              }}
            >
              <i>{s.mark}</i>
              <div>
                <b>{s.title}</b>
                <span>{s.line}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
