import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";

/**
 * The light in the room.
 *
 * Two soft lamps — one electric blue, one violet, the two colours the
 * studio's world is built from — drifting on long loops of different
 * lengths so they never settle into a visible cycle. This is the
 * atmosphere the page was missing; it is also the only thing moving
 * while the reader is still reading the hero, so it has to be slow
 * enough to be felt rather than watched.
 *
 * CSS keyframes rather than motion values, so that leaving the hero
 * genuinely PAUSES the animation (play-state) instead of unmounting and
 * restarting it — and so an offscreen hero costs nothing. Reduced
 * motion holds both lamps still; the light stays, the drift goes.
 */
export default function AmbientDrift() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement | null>(null);
  const [onScreen, setOnScreen] = useState(false);

  useEffect(function watch() {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setOnScreen(true);
      return;
    }
    const io = new IntersectionObserver(
      function seen(entries) {
        setOnScreen(entries.some((e) => e.isIntersecting));
      },
      { threshold: 0 }
    );
    io.observe(el);
    return function off() {
      io.disconnect();
    };
  }, []);

  const state = reduce || !onScreen ? "paused" : "running";

  return (
    <div ref={ref} aria-hidden="true" className="ad">
      <span className="ad-lamp ad-lamp--blue" style={{ animationPlayState: state }} />
      <span className="ad-lamp ad-lamp--violet" style={{ animationPlayState: state }} />
      <style>{`
        .ad {
          position: absolute;
          inset: 0;
          overflow: hidden;
          pointer-events: none;
          z-index: 0;
        }
        .ad-lamp {
          position: absolute;
          display: block;
          border-radius: 50%;
          will-change: transform;
        }
        .ad-lamp--blue {
          width: 86vmin; height: 86vmin;
          top: -14vmin; left: -10vmin;
          background: radial-gradient(circle at 50% 50%,
            rgba(61,107,255,0.26) 0%,
            rgba(61,107,255,0.10) 38%,
            transparent 68%);
          animation: ad-blue 86s ease-in-out infinite alternate;
        }
        .ad-lamp--violet {
          width: 72vmin; height: 72vmin;
          right: -12vmin; bottom: -18vmin;
          background: radial-gradient(circle at 50% 50%,
            rgba(124,92,255,0.22) 0%,
            rgba(124,92,255,0.09) 40%,
            transparent 70%);
          animation: ad-violet 68s ease-in-out infinite alternate;
        }
        @keyframes ad-blue {
          from { transform: translate3d(0, 0, 0) scale(1); }
          to   { transform: translate3d(14vmin, 9vmin, 0) scale(1.12); }
        }
        @keyframes ad-violet {
          from { transform: translate3d(0, 0, 0) scale(1.06); }
          to   { transform: translate3d(-11vmin, -8vmin, 0) scale(0.94); }
        }
        @media (prefers-reduced-motion: reduce) {
          .ad-lamp { animation: none; }
        }
      `}</style>
    </div>
  );
}
