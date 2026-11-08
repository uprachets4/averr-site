import { useCallback, useRef, useState } from "react";
import { prefersReducedMotion } from "../../about/v2/useSectionProgress";

/**
 * The letter turning to paper, folding into the paper plane, and
 * flying off along a gradient trail.
 *
 * Driven with the Web Animations API, not React: the clip-path morph
 * and the flight path are per-frame values, and nothing here goes
 * near a render. The ONE exception is `folding`, which is React
 * state on purpose. Spec 33's lesson was that a re-render reconciles
 * `className` back to what the JSX says and silently wipes a class
 * animation code has set — and the send DOES re-render mid-flight,
 * when the request settles. So the class the stylesheet keys off
 * lives in state, where a re-render preserves it.
 *
 * `run()` resolves when the plane is gone. `cancel()` puts the letter
 * back exactly as it was, for when the request fails.
 */

/** The reference's two polygons: the flat sheet, and the plane. */
const SHEET = "polygon(0% 0%,100% 0%,100% 100%,0% 100%,0% 50%)";
const PLANE = "polygon(0% 52%,100% 8%,60% 92%,46% 64%,0% 52%)";

const FOLD_MS = 900;
const FLIGHT_MS = 1000;

export function useFoldFlight(
  letterRef: React.RefObject<HTMLElement | null>,
  briefRef: React.RefObject<HTMLElement | null>,
  trailRef: React.RefObject<SVGPathElement | null>,
  flightRef: React.RefObject<HTMLElement | null>
) {
  const [folding, setFolding] = useState(false);
  const running = useRef(false);

  const cancel = useCallback(function cancel() {
    running.current = false;
    for (const el of [letterRef.current, briefRef.current, flightRef.current]) {
      el?.getAnimations?.().forEach((a) => a.cancel());
    }
    trailRef.current?.removeAttribute("d");
    setFolding(false);
  }, [letterRef, briefRef, trailRef, flightRef]);

  const run = useCallback(
    function run(): Promise<void> {
      const letter = letterRef.current;
      const trail = trailRef.current;
      const flight = flightRef.current;
      if (!letter || !trail || !flight || prefersReducedMotion()) {
        return Promise.resolve();
      }

      running.current = true;
      letter.scrollIntoView({ block: "center", behavior: "smooth" });

      return new Promise<void>(function fly(resolve) {
        window.setTimeout(function startFold() {
          if (!running.current) return resolve();

          /* Measured AFTER the scroll settles: the flight path is
             built from where the letter actually is on screen. */
          const r = letter.getBoundingClientRect();
          setFolding(true);
          briefRef.current?.animate([{ opacity: 1 }, { opacity: 0.25 }], {
            duration: 400,
            fill: "forwards",
          });

          const fold = letter.animate(
            [
              { clipPath: SHEET, transform: "none" },
              { clipPath: SHEET, transform: "scale(.96)", offset: 0.25 },
              { clipPath: PLANE, transform: "scale(.5) rotate(-8deg)", offset: 0.7 },
              { clipPath: PLANE, transform: "scale(.3) rotate(-14deg)" },
            ],
            { duration: FOLD_MS, easing: "cubic-bezier(.65,0,.35,1)", fill: "forwards" }
          );

          fold.onfinish = function thenFlight() {
            if (!running.current) return resolve();

            const cx = r.left + r.width / 2;
            const cy = r.top + r.height / 2;
            const ex = window.innerWidth + 160;
            const ey = -200;
            trail.setAttribute(
              "d",
              `M${cx},${cy} C${cx + window.innerWidth * 0.15},${cy - 40} ` +
                `${cx + window.innerWidth * 0.1},${cy - window.innerHeight * 0.45} ${ex},${ey}`
            );

            const L = trail.getTotalLength();
            trail.style.strokeDasharray = String(L);
            trail.style.strokeDashoffset = String(L);
            trail.animate([{ strokeDashoffset: L }, { strokeDashoffset: 0 }], {
              duration: FLIGHT_MS,
              easing: "cubic-bezier(.5,0,.75,0)",
              fill: "forwards",
            });

            const pts = [0, 0.25, 0.5, 0.75, 1].map((k) =>
              trail.getPointAtLength(L * k)
            );
            const glide = letter.animate(
              pts.map((p, i) => ({
                transform:
                  `translate(${p.x - cx}px,${p.y - cy}px) ` +
                  `scale(${0.3 - i * 0.05}) rotate(${-14 - i * 6}deg)`,
                clipPath: PLANE,
                opacity: i === 4 ? 0 : 1,
              })),
              { duration: FLIGHT_MS, easing: "cubic-bezier(.5,0,.75,0)", fill: "forwards" }
            );

            glide.onfinish = function land() {
              flight.animate([{ opacity: 1 }, { opacity: 0 }], {
                duration: 500,
                fill: "forwards",
              }).onfinish = function clear() {
                trail.removeAttribute("d");
                flight.getAnimations().forEach((a) => a.cancel());
              };
              letter.getAnimations().forEach((a) => a.cancel());
              briefRef.current?.getAnimations().forEach((a) => a.cancel());
              running.current = false;
              setFolding(false);
              resolve();
            };
          };
        }, 450);
      });
    },
    [letterRef, briefRef, trailRef, flightRef]
  );

  return { folding, run, cancel };
}
