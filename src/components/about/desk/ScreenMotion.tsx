import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { duration, ease } from "../../../lib/motion";
import MagneticCTA from "../../MagneticCTA";
import type { ScreenProps } from "./types";

/**
 * Principle 03 at monitor size — motion as language.
 *
 * The site's own MagneticCTA, big enough to actually want to touch, and
 * the same distance crossed twice: once on a linear ramp, once on the
 * studio's outQuart. Both run at the same time on two stacked tracks
 * now rather than behind a toggle — at monitor size there is room to
 * show the comparison instead of asking the reader to remember it.
 *
 * Everything here is a button, so a keyboard gets the same demo.
 */

const DOT = 22;
const RUN = 1.25;

export default function ScreenMotion({ active }: ScreenProps) {
  const reduce = useReducedMotion();
  const [tick, setTick] = useState(0);
  const railRef = useRef<HTMLDivElement | null>(null);
  const [travel, setTravel] = useState(0);

  useEffect(function measure() {
    const el = railRef.current;
    if (!el) return;
    function read() {
      setTravel(Math.max(0, el!.clientWidth - DOT));
    }
    read();
    if (typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(read);
    ro.observe(el);
    return function off() {
      ro.disconnect();
    };
  }, []);

  // plays once when the reader arrives, then only on request
  useEffect(
    function onArrival() {
      if (active) setTick((t) => t + 1);
    },
    [active]
  );

  const tracks = [
    { name: "Linear", spec: "linear", curve: "linear" as const },
    { name: "Eased", spec: `cubic-bezier(${ease.outQuart.join(", ")})`, curve: ease.outQuart },
  ];

  return (
    <div className="sm">
      <div className="sm-head">
        <span className="sm-title">Motion, two ways</span>
        <span className="sm-sub">Same distance, same time — a different sentence</span>
      </div>

      <div className="sm-cta">
        <span className="sm-label">MagneticCTA — it leans toward the cursor</span>
        <MagneticCTA
          variant="primary"
          size="lg"
          tone="dark"
          onClick={() => setTick((t) => t + 1)}
          ariaLabel="Try the magnetic button — it replays both tracks"
        >
          Try me
        </MagneticCTA>
      </div>

      <div className="sm-tracks" ref={railRef}>
        {tracks.map((t, i) => (
          <div key={t.name} className="sm-track">
            <div className="sm-trackhead">
              <span className="sm-name">{t.name}</span>
              <span className="sm-spec">{t.spec}</span>
            </div>
            <div className="sm-ticks" aria-hidden="true">
              {[0, 1, 2, 3, 4].map((q) => (
                <span key={q} />
              ))}
            </div>
            <div className="sm-rail">
              <motion.span
                key={`${i}-${tick}`}
                aria-hidden="true"
                className="sm-dot"
                initial={reduce ? false : { x: 0 }}
                animate={{ x: travel }}
                transition={
                  reduce ? { duration: 0 } : { duration: RUN, ease: t.curve }
                }
              />
            </div>
          </div>
        ))}
      </div>

      <div className="sm-foot">
        <button type="button" className="sm-replay" onClick={() => setTick((t) => t + 1)}>
          Replay both
        </button>
        <span className="sm-note">
          They start together and arrive together. Only the middle differs — and
          the middle is what the reader feels.
        </span>
      </div>

      <style>{`
        .sm {
          position: absolute; inset: 0;
          display: flex; flex-direction: column; gap: 22px;
          justify-content: center;
          background: var(--about-surface);
          padding: 28px 34px;
        }
        .sm-head { display: flex; flex-direction: column; gap: 6px; }
        .sm-title {
          font-family: var(--font-display); font-weight: 500; font-size: 19px;
          color: var(--about-ink);
        }
        .sm-sub, .sm-label {
          font-family: var(--font-mono); font-size: 13px; letter-spacing: 0.04em;
          color: var(--about-body);
        }
        .sm-cta { display: flex; flex-direction: column; gap: 12px; align-items: flex-start; }
        .sm-tracks { display: flex; flex-direction: column; gap: 22px; }
        .sm-track { display: flex; flex-direction: column; gap: 8px; }
        .sm-trackhead { display: flex; align-items: baseline; justify-content: space-between; gap: 14px; }
        .sm-name {
          font-family: var(--font-mono); font-size: 13px; letter-spacing: 0.08em;
          text-transform: uppercase; color: var(--about-ink);
        }
        .sm-spec {
          font-family: var(--font-mono); font-size: 13px; color: var(--about-body);
        }
        .sm-ticks { display: flex; justify-content: space-between; padding: 0 10px; }
        .sm-ticks span { width: 1px; height: 8px; background: var(--about-hair-hi); }
        .sm-rail {
          position: relative; height: ${DOT}px; border-radius: 999px;
          background: rgba(160, 180, 230, 0.10);
          box-shadow: inset 0 0 0 1px var(--about-hair);
        }
        .sm-dot {
          position: absolute; left: 0; top: 0;
          width: ${DOT}px; height: ${DOT}px; border-radius: 999px;
          background: linear-gradient(180deg, #8FA8FF 0%, var(--about-glow) 100%);
          box-shadow: 0 0 14px rgba(61,107,255,0.65);
        }
        .sm-foot { display: flex; align-items: center; gap: 16px; flex-wrap: wrap; }
        .sm-replay {
          padding: 9px 18px; border-radius: 999px;
          border: 1px solid var(--about-hair-hi); background: transparent;
          color: var(--about-ink); font-family: var(--font-mono);
          font-size: 13px; letter-spacing: 0.04em; cursor: pointer;
          transition: border-color ${duration.fast}s ease, background ${duration.fast}s ease;
        }
        .sm-replay:hover { border-color: var(--about-glow); background: rgba(61,107,255,0.10); }
        .sm-replay:focus-visible { outline: 2px solid var(--about-glow-text); outline-offset: 3px; }
        .sm-note { font-size: 13px; color: var(--about-body); max-width: 46ch; }
        @media (max-width: 900px) {
          .sm { padding: 16px; gap: 14px; }
          .sm-tracks { gap: 14px; }
          .sm-note { display: none; }
        }
      `}</style>
    </div>
  );
}
