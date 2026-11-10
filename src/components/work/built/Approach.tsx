import { useEffect, useRef, useState, type CSSProperties } from "react";
import { screen, type BuiltStep } from "../../../data/builtByAverr";
import { SERVICE_COLOR, SERVICE_NAMES } from "../../../data/serviceColors";
import { Phrase } from "./bits";

/**
 * 02 — the approach: one sentence per service beside a sticky device
 * that swaps screens as each step crosses the middle of the viewport.
 *
 * `rootMargin: -45% 0px -45% 0px` is the reference's: it collapses the
 * viewport to a 10% band across the middle, so a step becomes the
 * active one exactly as it passes the centre line. Below 900px the
 * stylesheet unpins the device, lifts it above the steps and shows
 * every step at full opacity, so the observer's result is invisible
 * there rather than wrong.
 */
export default function Approach({
  steps,
  name,
  number,
}: {
  steps: BuiltStep[];
  name: string;
  number: string;
}) {
  const stepsRef = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState(0);

  useEffect(function watchSteps() {
    const host = stepsRef.current;
    if (!host) return;
    const nodes = Array.from(host.children) as HTMLElement[];

    const io = new IntersectionObserver(
      function onCross(entries) {
        entries.forEach(function each(e) {
          if (!e.isIntersecting) return;
          const j = Number((e.target as HTMLElement).dataset.j);
          if (!Number.isNaN(j)) setActive(j);
        });
      },
      { rootMargin: "-45% 0px -45% 0px" }
    );
    nodes.forEach((n) => io.observe(n));
    return function stop() {
      io.disconnect();
    };
  }, []);

  return (
    <section className="bb-sec bb-gut">
      <div className="bb-wrap">
        <div className="bb-label bb-reveal">
          <h2 className="bb-eyebrow">The approach</h2>
          <span className="bb-n">{number}</span>
        </div>

        <div className="bb-built">
          <div className="bb-steps" ref={stepsRef}>
            {steps.map(function step(a, j) {
              const colour = SERVICE_COLOR[a.service];
              return (
                <div
                  className={j === active ? "bb-step bb-on" : "bb-step"}
                  data-j={j}
                  key={`${a.label}-${j}`}
                  style={{ "--c": colour } as CSSProperties}
                >
                  <span className="bb-k">
                    <i className="bb-dot" style={{ "--c": colour } as CSSProperties} />
                    {SERVICE_NAMES[a.service]} · {a.label}
                  </span>
                  <p>
                    <Phrase text={a.text} emphasis={a.emphasis} />
                  </p>
                </div>
              );
            })}
          </div>

          <div className="bb-stick">
            <div className="bb-device">
              <div className="bb-chrome" aria-hidden="true">
                <i />
                <i />
                <i />
                <span>{name}</span>
              </div>
              {steps.map(function shot(a, j) {
                return (
                  <img
                    key={`${a.image}-${j}`}
                    src={screen(a.image).small}
                    alt={`${name}: ${a.label}`}
                    className={j === active ? "bb-on" : undefined}
                    loading="lazy"
                    decoding="async"
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
