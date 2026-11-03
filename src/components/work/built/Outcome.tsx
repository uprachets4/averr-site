import { useEffect, useRef, useState, type CSSProperties } from "react";
import type { BuiltProject } from "../../../data/builtByAverr";
import { Phrase } from "./bits";

/**
 * 05 — the outcome: the measured figure counting up once, or, for a
 * project with no figure, a status chip carrying the tail of its own
 * timeline ("ongoing", "internal alpha").
 *
 * The count runs for 1400ms on a cubic ease-out and only ever runs
 * once, the first time the figure reaches the screen. It keeps the
 * figure's own decimals, so 5.0 counts in tenths and 85% in whole
 * numbers, and under reduced motion the final value is simply there.
 */
export default function Outcome({
  project,
  number,
}: {
  project: BuiltProject;
  number: string;
}) {
  const figure = project.figure;
  const figureRef = useRef<HTMLSpanElement | null>(null);
  const [shown, setShown] = useState(figure ? figure.value : "");

  useEffect(
    function countUpOnce() {
      const el = figureRef.current;
      if (!el || !figure) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const match = figure.value.match(/^([\d.]+)(.*)$/);
      if (!match) return;
      const end = parseFloat(match[1]);
      const decimals = (match[1].split(".")[1] || "").length;
      const suffix = match[2];

      let frame = 0;
      const io = new IntersectionObserver(
        function onSeen(entries) {
          if (!entries.some((e) => e.isIntersecting)) return;
          io.disconnect();
          const t0 = performance.now();
          (function step(now: number) {
            const k = Math.min(1, (now - t0) / 1400);
            const eased = 1 - Math.pow(1 - k, 3);
            setShown((end * eased).toFixed(decimals) + suffix);
            if (k < 1) frame = requestAnimationFrame(step);
          })(t0);
        },
        { threshold: 0.15 }
      );
      io.observe(el);
      return function stop() {
        io.disconnect();
        if (frame) cancelAnimationFrame(frame);
      };
    },
    [figure]
  );

  return (
    <section className="bb-sec bb-gut">
      <div className="bb-wrap">
        <div className="bb-label bb-reveal">
          <h2 className="bb-eyebrow">The outcome</h2>
          <span className="bb-n">{number}</span>
        </div>
        <div className="bb-out">
          <div className="bb-bigfig bb-reveal">
            {figure ? (
              <>
                <span className="bb-v bb-gt" ref={figureRef}>
                  {shown}
                </span>
                <span className="bb-cap">{figure.caption}</span>
              </>
            ) : (
              <span className="bb-status" style={{ "--c": project.c } as CSSProperties}>
                <i />
                {project.year.split("·").pop()!.trim()}
              </span>
            )}
          </div>
          <div className="bb-reveal">
            <h3>{project.outcome.headline}</h3>
            <p>
              <Phrase text={project.outcome.body} emphasis={project.outcome.emphasis} />
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
