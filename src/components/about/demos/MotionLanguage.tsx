import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { duration, ease } from "../../../lib/motion";
import MagneticCTA from "../../MagneticCTA";
import DemoFrame, { demoInk, type DemoProps } from "./DemoFrame";

/**
 * Principle 03 — motion as language, in two parts.
 *
 * (a) The site's own MagneticCTA, labelled so the reader knows to try it.
 *     Pressing it replays the track below, so the button does something
 *     rather than standing there as a sample.
 * (b) A dot crossing a track under either a linear ramp or the site's
 *     outQuart. Same distance, same time, different sentence — which is
 *     the whole claim the principle makes.
 *
 * Both halves are buttons, so a keyboard reader gets the same demo.
 */

const DOT = 18;
const RUN = 1.1;

const CURVES = {
  linear: { label: "Linear", spec: "linear" },
  eased: { label: "Eased", spec: `cubic-bezier(${ease.outQuart.join(", ")})` },
} as const;

type Mode = keyof typeof CURVES;

export default function MotionLanguage({ dark }: DemoProps) {
  const reduce = useReducedMotion();
  const c = demoInk(dark);
  const [mode, setMode] = useState<Mode>("eased");
  const [tick, setTick] = useState(0);

  // The dot travels a measured distance, not a percentage: `x` as a
  // percentage would resolve against the dot's own 18px, not the rail.
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

  function replay(next?: Mode) {
    if (next) setMode(next);
    setTick((t) => t + 1);
  }

  return (
    <DemoFrame label="Motion, two ways" hint="try it" dark={dark}>
      <div
        style={{
          flex: 1,
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 48,
        }}
      >
        {/* (a) the real CTA */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <span style={mono(c.muted)}>MagneticCTA — it leans toward the cursor</span>
          <div>
            <MagneticCTA
              variant="primary"
              size="md"
              tone={dark ? "dark" : "light"}
              onClick={() => replay()}
              ariaLabel="Try the magnetic button — it replays the track below"
            >
              Try me
            </MagneticCTA>
          </div>
        </div>

        {/* (b) the same distance, two curves */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <span style={mono(c.muted)}>
            Same distance, same time — a different sentence
          </span>
          <div style={{ display: "flex", gap: 8 }}>
            {(Object.keys(CURVES) as Mode[]).map((m) => {
              const on = mode === m;
              return (
                <button
                  key={m}
                  type="button"
                  aria-pressed={on}
                  onClick={() => replay(m)}
                  className="ml-seg"
                  style={{
                    padding: "8px 16px",
                    borderRadius: 999,
                    border: `1px solid ${on ? c.ink : c.line}`,
                    background: on ? c.ink : "transparent",
                    color: on ? (dark ? "var(--color-dark)" : "var(--color-bg)") : c.ink,
                    fontFamily: "var(--font-mono)",
                    fontSize: 12,
                    letterSpacing: "0.04em",
                    cursor: "pointer",
                    transition: `background ${duration.fast}s ease, border-color ${duration.fast}s ease, color ${duration.fast}s ease`,
                  }}
                >
                  {CURVES[m].label}
                </button>
              );
            })}
          </div>

          {/* quarter ticks, so the difference between the curves is
              read off the track rather than felt */}
          <div style={{ display: "flex", justifyContent: "space-between", padding: "0 8px" }}>
            {[0, 1, 2, 3, 4].map((q) => (
              <span key={q} style={{ width: 1, height: 7, background: c.line }} />
            ))}
          </div>

          <div
            ref={railRef}
            style={{
              position: "relative",
              height: DOT,
              borderRadius: 999,
              background: c.skeleton,
            }}
          >
            {/* Remounted on every run so the dot always starts at the
                left edge, whichever curve is selected. */}
            <motion.span
              key={`${mode}-${tick}`}
              aria-hidden
              initial={reduce ? false : { x: 0 }}
              animate={{ x: travel }}
              transition={
                reduce
                  ? { duration: 0 }
                  : {
                      duration: RUN,
                      ease: mode === "linear" ? "linear" : ease.outQuart,
                    }
              }
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                width: DOT,
                height: DOT,
                borderRadius: 999,
                background: c.gold,
              }}
            />
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
            <span style={mono(c.muted)}>{CURVES[mode].spec}</span>
            <button
              type="button"
              onClick={() => replay()}
              className="ml-replay"
              style={{
                ...mono(c.ink),
                background: "transparent",
                border: "none",
                padding: "4px 2px",
                cursor: "pointer",
                textDecoration: "underline",
                textUnderlineOffset: 3,
              }}
            >
              Replay
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .ml-seg:focus-visible, .ml-replay:focus-visible {
          outline: 2px solid ${c.ink}; outline-offset: 2px; border-radius: 999px;
        }
      `}</style>
    </DemoFrame>
  );
}

function mono(color: string): React.CSSProperties {
  return {
    fontFamily: "var(--font-mono)",
    fontSize: 11,
    letterSpacing: "0.04em",
    color,
  };
}
