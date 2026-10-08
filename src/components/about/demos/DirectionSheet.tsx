import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { duration, spring } from "../../../lib/motion";
import DemoFrame, { demoInk, type DemoProps } from "./DemoFrame";

/**
 * Principle 02 — the direction sheet assembling itself.
 *
 * Palette, type, spacing: the three things that come back from the one
 * checkpoint, drawn from the site's own tokens so the specimen is the
 * real thing rather than a picture of one. Pieces arrive staggered and
 * snap into place on a spring.
 *
 * It plays when the panel becomes the one the reader is parked on, and
 * Replay re-runs it from a button, so nothing here needs a timer or a
 * pointer.
 */

/** Real tokens, with their real values — the labels are the point. */
const SWATCHES: { name: string; value: string }[] = [
  { name: "--color-bg", value: "#F4F0E6" },
  { name: "--color-bg-warm", value: "#E8E1D0" },
  { name: "--color-muted", value: "#6B665C" },
  { name: "--color-ink-soft", value: "#2A2926" },
  { name: "--color-dark", value: "#141412" },
];

const STEPS = [4, 8, 16, 32, 64, 128];

export default function DirectionSheet({ active, dark }: DemoProps) {
  const reduce = useReducedMotion();
  const c = demoInk(dark);
  const [run, setRun] = useState(0);
  const [played, setPlayed] = useState(false);

  // The sheet assembles the first time the reader arrives, then stays
  // assembled. Re-running it every time the panel passes would turn a
  // one-off reveal into a flicker on the way back up.
  useEffect(
    function playOnArrival() {
      if (active) setPlayed(true);
    },
    [active]
  );

  const shown = played || reduce;

  function piece(i: number) {
    if (reduce) return { initial: false as const, transition: { duration: 0 } };
    return {
      initial: { opacity: 0, y: 18, rotate: i % 2 ? -2.5 : 2.5 },
      transition: { ...spring.snappy, delay: i * 0.055 },
    };
  }

  return (
    <DemoFrame label="Direction sheet" hint="one checkpoint" dark={dark}>
      <div
        key={run}
        style={{
          flex: 1,
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 26,
        }}
      >
        {/* Palette and type share a row: stacking all three groups
            overflowed the frame by 2px at 1440×900 and would have
            clipped badly on a short laptop. */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "26px 40px",
            alignItems: "flex-start",
          }}
        >
        {/* ── palette ── */}
        <Group label="Palette" c={c}>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {SWATCHES.map((s, i) => {
              const p = piece(i);
              return (
                <motion.div
                  key={s.name}
                  initial={p.initial}
                  animate={shown ? { opacity: 1, y: 0, rotate: 0 } : undefined}
                  transition={p.transition}
                  style={{ display: "flex", flexDirection: "column", gap: 6, minWidth: 0 }}
                >
                  <span
                    style={{
                      width: 46,
                      height: 46,
                      borderRadius: 8,
                      background: s.value,
                      border: `1px solid ${c.line}`,
                    }}
                  />
                  <span style={mono(c.muted)}>{s.name.replace("--color-", "")}</span>
                </motion.div>
              );
            })}
          </div>
        </Group>

        {/* ── type ── */}
        <Group label="Type" c={c}>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 30 }}>
            {[
              { spec: "Geist 500", node: <span style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>Aa</span> },
              { spec: "Cormorant italic", node: <span className="type-accent">Aa</span> },
            ].map((t, i) => {
              const p = piece(SWATCHES.length + i);
              return (
                <motion.div
                  key={t.spec}
                  initial={p.initial}
                  animate={shown ? { opacity: 1, y: 0, rotate: 0 } : undefined}
                  transition={p.transition}
                  style={{ display: "flex", flexDirection: "column", gap: 4 }}
                >
                  <span style={{ fontSize: 46, lineHeight: 1.1, color: c.ink }}>{t.node}</span>
                  <span style={mono(c.muted)}>{t.spec}</span>
                </motion.div>
              );
            })}
          </div>
        </Group>
        </div>

        {/* ── spacing ── */}
        <Group label="Spacing" c={c}>
          {/* Read as a ruler across the sheet rather than a stack of bars:
              stacked, it left the whole right half of the frame empty. */}
          <div style={{ display: "flex", alignItems: "flex-end", gap: 14, height: 120 }}>
            {STEPS.map((s, i) => {
              const p = piece(SWATCHES.length + 2 + i);
              return (
                <motion.div
                  key={s}
                  initial={p.initial}
                  animate={shown ? { opacity: 1, y: 0, rotate: 0 } : undefined}
                  transition={p.transition}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <span
                    style={{
                      display: "block",
                      width: 16,
                      height: Math.max(4, s * 0.72),
                      borderRadius: 2,
                      background: c.gold,
                      opacity: 0.5 + i * 0.1,
                    }}
                  />
                  <span style={mono(c.muted)}>{s}</span>
                </motion.div>
              );
            })}
          </div>
        </Group>

        <button
          type="button"
          onClick={() => {
            setPlayed(false);
            setRun((r) => r + 1);
            // next frame, so the remounted pieces start from their
            // initial state rather than being born already shown
            requestAnimationFrame(() => setPlayed(true));
          }}
          className="ds-replay"
          style={{
            alignSelf: "flex-start",
            padding: "8px 16px",
            borderRadius: 999,
            border: `1px solid ${c.line}`,
            background: "transparent",
            color: c.ink,
            fontFamily: "var(--font-mono)",
            fontSize: 12,
            letterSpacing: "0.04em",
            cursor: "pointer",
            transition: `border-color ${duration.fast}s ease`,
          }}
        >
          Replay
        </button>
      </div>

      <style>{`
        .ds-replay:hover { border-color: ${c.ink}; }
        .ds-replay:focus-visible { outline: 2px solid ${c.ink}; outline-offset: 2px; }
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

function Group({
  label,
  c,
  children,
}: {
  label: string;
  c: ReturnType<typeof demoInk>;
  children: React.ReactNode;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <span
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 11,
          letterSpacing: "0.09em",
          textTransform: "uppercase",
          color: c.muted,
        }}
      >
        {label}
      </span>
      {children}
    </div>
  );
}
