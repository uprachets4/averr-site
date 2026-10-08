import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { duration, spring } from "../../../lib/motion";
import type { ScreenProps } from "./types";

/**
 * Principle 02 at monitor size — the direction sheet assembling.
 *
 * At card size this was five swatches and a ruler. On the monitor it is
 * the actual thing that comes back from the one checkpoint: palette,
 * type, spacing, and the signature moves written down. The tokens are
 * the studio's own — this page's own world — so the sheet is a real
 * specimen rather than a picture of one.
 *
 * It assembles the first time the reader arrives and stays assembled;
 * Replay re-runs it from a button, so nothing needs a timer or a mouse.
 */

const SWATCHES = [
  { name: "ground", value: "#0A0D14" },
  { name: "surface", value: "#111624" },
  { name: "surface-2", value: "#171D2E" },
  { name: "glow", value: "#3D6BFF" },
  { name: "glow-2", value: "#7C5CFF" },
  { name: "ink", value: "#EDE9E2" },
];

const STEPS = [4, 8, 16, 32, 64, 128];

const MOVES = [
  "Pinned stages, one scroll value",
  "Light as the section boundary",
  "Read-fill on every paragraph",
  "Type that paints at first frame",
];

const FACES = [
  { id: "geist", label: "Geist", family: "var(--font-display)", weight: 500 },
  { id: "cormorant", label: "Cormorant", family: '"Cormorant Garamond", Georgia, serif', weight: 600 },
] as const;

export default function ScreenDirection({ active }: ScreenProps) {
  // the sheet is not a picture of a decision — making one here changes
  // the page beside it
  const [accent, setAccent] = useState(SWATCHES[3].value);
  const [face, setFace] = useState<(typeof FACES)[number]["id"]>("geist");
  const chosen = FACES.find((f) => f.id === face)!;
  const reduce = useReducedMotion();
  const [run, setRun] = useState(0);
  const [played, setPlayed] = useState(false);

  useEffect(
    function playOnArrival() {
      if (active) setPlayed(true);
    },
    [active]
  );
  const shown = played || !!reduce;

  function piece(i: number) {
    if (reduce) return { initial: false as const, transition: { duration: 0 } };
    return {
      initial: { opacity: 0, y: 20, rotate: i % 2 ? -2 : 2 },
      transition: { ...spring.snappy, delay: i * 0.045 },
    };
  }
  const settle = { opacity: 1, y: 0, rotate: 0 };

  return (
    <div className="sd">
      <div className="sd-head">
        <span className="sd-title">Direction sheet</span>
        <span className="sd-sub">One checkpoint · locked before any code</span>
      </div>

      <div key={run} className="sd-grid">
        {/* ── palette ── */}
        <section className="sd-cell">
          <h4 className="sd-label">Palette</h4>
          <div className="sd-swatches">
            {SWATCHES.map((s, i) => {
              const p = piece(i);
              return (
                <motion.div
                  key={s.name}
                  initial={p.initial}
                  animate={shown ? settle : undefined}
                  transition={p.transition}
                  className="sd-sw"
                >
                  <button
                    type="button"
                    className={accent === s.value ? "sd-pick sd-pick--on" : "sd-pick"}
                    aria-pressed={accent === s.value}
                    aria-label={`Use ${s.name} as the accent`}
                    onClick={() => setAccent(s.value)}
                  >
                    <span className="sd-chip" style={{ background: s.value }} />
                  </button>
                  <span className="sd-mono">{s.name}</span>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* ── type ── */}
        <section className="sd-cell">
          <h4 className="sd-label">Type</h4>
          <div className="sd-type">
            {[
              {
                spec: "Geist 500 — display",
                node: <span style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>Aa</span>,
              },
              { spec: "Cormorant italic — accent", node: <span className="type-accent">Aa</span> },
            ].map((t, i) => {
              const p = piece(SWATCHES.length + i);
              return (
                <motion.div
                  key={t.spec}
                  initial={p.initial}
                  animate={shown ? settle : undefined}
                  transition={p.transition}
                  className="sd-spec"
                >
                  <span className="sd-aa">{t.node}</span>
                  <span className="sd-mono">{t.spec}</span>
                </motion.div>
              );
            })}
          </div>
          <div className="sd-faces">
            {FACES.map((f) => (
              <button
                key={f.id}
                type="button"
                className={face === f.id ? "sd-face sd-face--on" : "sd-face"}
                aria-pressed={face === f.id}
                onClick={() => setFace(f.id)}
              >
                {f.label}
              </button>
            ))}
          </div>
        </section>

        {/* ── spacing ── */}
        <section className="sd-cell">
          <h4 className="sd-label">Spacing</h4>
          <div className="sd-ruler">
            {STEPS.map((s, i) => {
              const p = piece(SWATCHES.length + 3 + i);
              return (
                <motion.div
                  key={s}
                  initial={p.initial}
                  animate={shown ? settle : undefined}
                  transition={p.transition}
                  className="sd-bar"
                >
                  <span style={{ height: Math.max(5, s * 0.78) }} />
                  <span className="sd-mono">{s}</span>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* ── the decision, applied ── */}
        <section className="sd-cell">
          <h4 className="sd-label">Applied, live</h4>
          <div className="sd-mini">
            <span className="sd-mini-eyebrow" style={{ color: accent }}>Field recordings</span>
            <span
              className="sd-mini-h"
              style={{ fontFamily: chosen.family, fontWeight: chosen.weight, fontStyle: face === "cormorant" ? "italic" : "normal" }}
            >
              Sound that knows where it is.
            </span>
            <span className="sd-mini-rule" style={{ background: accent }} />
            <span className="sd-mini-cta" style={{ background: accent }}>Hear it</span>
          </div>
        </section>

        {/* ── signature moves ── */}
        <section className="sd-cell sd-cell--moves">
          <h4 className="sd-label">Signature moves</h4>
          <ul className="sd-moves">
            {MOVES.map((m, i) => {
              const p = piece(SWATCHES.length + 9 + i);
              return (
                <motion.li
                  key={m}
                  initial={p.initial}
                  animate={shown ? settle : undefined}
                  transition={p.transition}
                >
                  <span className="sd-tick" style={{ background: accent }} />
                  {m}
                </motion.li>
              );
            })}
          </ul>
        </section>
      </div>

      <div className="sd-foot">
        <button
          type="button"
          className="sd-replay"
          onClick={() => {
            setPlayed(false);
            setRun((r) => r + 1);
            requestAnimationFrame(() => setPlayed(true));
          }}
        >
          Replay
        </button>
      </div>

      <style>{`
        .sd {
          position: absolute; inset: 0;
          display: flex; flex-direction: column;
          background: var(--about-surface);
          padding: 24px 30px 18px;
        }
        .sd-head { display: flex; align-items: baseline; gap: 14px; flex-wrap: wrap; }
        .sd-title {
          font-family: var(--font-display); font-weight: 500; font-size: 19px;
          color: var(--about-ink);
        }
        .sd-sub {
          font-family: var(--font-mono); font-size: 13px; letter-spacing: 0.04em;
          color: var(--about-body);
        }
        .sd-grid {
          flex: 1; min-height: 0;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 22px 34px;
          align-content: center;
          padding: 18px 0;
        }
        .sd-cell { min-width: 0; }
        .sd-label {
          font-family: var(--font-mono); font-size: 13px; letter-spacing: 0.1em;
          text-transform: uppercase; color: var(--about-body);
          margin: 0 0 12px; font-weight: 500;
        }
        .sd-swatches { display: flex; gap: 12px; flex-wrap: wrap; }
        .sd-sw { display: flex; flex-direction: column; gap: 5px; }
        .sd-chip {
          display: block; width: 46px; height: 46px; border-radius: 8px;
          border: 1px solid var(--about-hair-hi);
        }
        .sd-mono {
          font-family: var(--font-mono); font-size: 13px; letter-spacing: 0.03em;
          color: var(--about-ink);
        }
        .sd-dim { color: var(--about-body); }
        .sd-type { display: flex; gap: 30px; align-items: flex-end; }
        .sd-spec { display: flex; flex-direction: column; gap: 4px; }
        .sd-aa { font-size: 44px; line-height: 1.05; color: var(--about-ink); }
        .sd-line {
          margin: 14px 0 0;
          font-family: var(--font-display); font-weight: 500; font-size: 20px;
          color: var(--about-ink);
        }
        .sd-ruler { display: flex; align-items: flex-end; gap: 14px; height: 118px; }
        .sd-bar { display: flex; flex-direction: column; align-items: center; gap: 6px; }
        .sd-bar > span:first-child {
          display: block; width: 24px; border-radius: 2px;
          background: linear-gradient(180deg, var(--about-glow) 0%, var(--about-glow-2) 100%);
        }
        .sd-moves { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 10px; }
        .sd-moves li {
          display: flex; align-items: center; gap: 10px;
          font-size: 14px; color: var(--about-ink);
        }
        .sd-tick {
          width: 7px; height: 7px; border-radius: 50%;
          background: var(--about-glow); flex: 0 0 7px;
          box-shadow: 0 0 0 3px rgba(61,107,255,0.18);
        }
        .sd-pick {
          padding: 0; border: none; background: none; cursor: pointer;
          border-radius: 10px; line-height: 0;
          min-width: 44px; min-height: 44px; display: grid; place-items: center;
          transition: box-shadow ${duration.fast}s ease;
        }
        .sd-pick--on { box-shadow: 0 0 0 2px var(--about-ink); }
        .sd-pick:focus-visible { outline: 2px solid var(--about-glow-text); outline-offset: 2px; }
        .sd-faces { display: flex; gap: 8px; margin-top: 12px; }
        .sd-face {
          min-height: 44px; padding: 9px 15px; border-radius: 999px;
          border: 1px solid var(--about-hair-hi); background: transparent;
          color: var(--about-ink); cursor: pointer;
          font-family: var(--font-mono); font-size: 13px; letter-spacing: 0.04em;
          transition: background ${duration.fast}s ease, border-color ${duration.fast}s ease;
        }
        .sd-face--on { background: var(--about-ink); color: var(--about-ground); border-color: var(--about-ink); }
        .sd-face:focus-visible { outline: 2px solid var(--about-glow-text); outline-offset: 2px; }
        .sd-mini {
          border: 1px solid var(--about-hair); border-radius: 8px;
          padding: 15px; display: flex; flex-direction: column; gap: 9px;
          background: rgba(160,186,255,0.04);
        }
        .sd-mini-eyebrow {
          font-family: var(--font-mono); font-size: 13px; letter-spacing: 0.09em;
          text-transform: uppercase;
        }
        .sd-mini-h { font-size: 21px; line-height: 1.12; color: var(--about-ink); }
        .sd-mini-rule { display: block; width: 40px; height: 2px; }
        .sd-mini-cta {
          align-self: flex-start; padding: 8px 15px; border-radius: 999px;
          font-size: 13px; font-weight: 500; color: var(--about-ground);
        }
        .sd-foot { display: flex; }
        .sd-replay {
          min-height: 44px;
          padding: 9px 18px; border-radius: 999px;
          border: 1px solid var(--about-hair-hi);
          background: transparent; color: var(--about-ink);
          font-family: var(--font-mono); font-size: 13px; letter-spacing: 0.04em;
          cursor: pointer; transition: border-color ${duration.fast}s ease, background ${duration.fast}s ease;
        }
        .sd-replay:hover { border-color: var(--about-glow); background: rgba(61,107,255,0.10); }
        .sd-replay:focus-visible { outline: 2px solid var(--about-glow-text); outline-offset: 3px; }
        @media (max-width: 900px) {
          .sd { padding: 16px 16px 14px; }
          .sd-grid { grid-template-columns: 1fr; gap: 16px; padding: 12px 0; overflow: hidden; }
          .sd-aa { font-size: 34px; }
          .sd-ruler { height: 78px; gap: 10px; }
          .sd-bar > span:first-child { width: 16px; }
        }
      `}</style>
    </div>
  );
}
