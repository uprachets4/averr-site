import { motion } from "motion/react";
import { duration, ease } from "../../../lib/motion";

/**
 * One fictional local-business homepage, at five fidelities.
 *
 * It is the SAME page throughout — the same boxes in the same places —
 * so moving between stages is a change of treatment, never a cut to a
 * different site. Everything is React/CSS/SVG; there are no images.
 *
 * `within` is the scroll progress through the current stage's dwell, so
 * the things that would otherwise want a timer — the sketch drawing
 * itself, the code typing, the pins resolving, the score counting — are
 * all driven by the same scroll the stage selection is.
 */

export const STAGE_NAMES = ["Direction", "Design", "Build", "Refine", "Ship"];

const GOLD = "#B18544";
const INK = "var(--color-ink)";
const SOFT = "var(--color-muted)";

/** The review notes for Refine. Short, and about craft, not content. */
const PINS = [
  { x: 16, y: 26, note: "Tighten spacing" },
  { x: 73, y: 22, note: "Contrast on CTA" },
  { x: 24, y: 72, note: "Baseline the row" },
  { x: 66, y: 63, note: "Crop the hero" },
];

const CODE = [
  "export function Hero() {",
  "  return (",
  '    <section className="hero">',
  "      <Eyebrow>Open since 1994</Eyebrow>",
  "      <h1>Bread worth the walk.</h1>",
  "      <CTA href=\"/order\">Order ahead</CTA>",
  "    </section>",
  "  );",
  "}",
];

export default function EvolvingPage({
  stage,
  within,
  reduce,
}: {
  stage: number;
  /** 0 → 1 through the active stage's dwell. */
  within: number;
  reduce: boolean;
}) {
  const designed = stage >= 1;
  const built = stage >= 2;
  const refining = stage === 3;
  const shipped = stage >= 4;

  // Refine: pins land, then resolve one by one, then the score settles
  // Refine resolves as you scroll through it; Ship inherits the finished
  // page rather than whatever Refine happened to be mid-way through
  const resolved = shipped ? PINS.length : refining ? Math.min(PINS.length, Math.floor(within * 5.2)) : 0;
  const score = shipped ? 98 : refining ? Math.round(72 + (98 - 72) * Math.min(1, within * 1.25)) : 72;
  // Build: the code types itself as you scroll
  const codeChars = built && stage === 2 ? Math.floor(within * 1.15 * CODE.join("\n").length) : CODE.join("\n").length;

  const t = { duration: reduce ? 0 : duration.slow, ease: ease.outQuart };

  return (
    <div className="ep">
      {/* ── the page ── */}
      <motion.div
        className="ep-page"
        animate={{ opacity: designed ? 1 : 0.22, scale: designed ? 1 : 0.985 }}
        transition={t}
        style={{ filter: designed ? "none" : "saturate(0)" }}
      >
        <div className="ep-bar">
          <span className="ep-logo" style={{ fontFamily: designed ? "var(--font-display)" : "var(--font-body)" }}>
            Harbourview Bakehouse
          </span>
          <div className="ep-nav">
            {["Menu", "Orders", "Visit"].map((n) => (
              <span key={n}>{n}</span>
            ))}
          </div>
        </div>

        <div className="ep-hero">
          <div className="ep-copy">
            <span className="ep-eyebrow" style={{ color: designed ? GOLD : SOFT }}>
              Open since 1994
            </span>
            <span
              className="ep-h"
              style={{
                fontFamily: designed ? "var(--font-display)" : "var(--font-body)",
                fontWeight: designed ? 500 : 700,
                letterSpacing: designed ? "-0.02em" : "0",
              }}
            >
              Bread worth {designed ? <span className="type-accent">the walk</span> : "the walk"}.
            </span>
            <span className="ep-sub">
              Sourdough, rye and pastry, baked each morning on the harbour road.
            </span>
            <div className="ep-btns">
              {/* live from Build onward — the visitor can actually press these */}
              <button type="button" className="ep-cta" disabled={!built} tabIndex={built ? 0 : -1}>
                Order ahead
              </button>
              <button type="button" className="ep-ghost" disabled={!built} tabIndex={built ? 0 : -1}>
                Opening hours
              </button>
            </div>
          </div>
          <div className="ep-art" aria-hidden="true">
            <span className="ep-art-loaf" />
            <span className="ep-art-steam" />
          </div>
        </div>

        <div className="ep-row">
          {[
            { t: "Sourdough", d: "48-hour ferment" },
            { t: "Rye", d: "Stone-milled" },
            { t: "Pastry", d: "From 7am" },
          ].map((c) => (
            <div key={c.t} className="ep-card">
              <span className="ep-ct">{c.t}</span>
              <span className="ep-cd">{c.d}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ── Direction: the sketch over the top, drawing itself ── */}
      <motion.svg
        className="ep-sketch"
        viewBox="0 0 600 380"
        preserveAspectRatio="none"
        aria-hidden="true"
        animate={{ opacity: stage === 0 ? 1 : 0 }}
        transition={t}
      >
        {SKETCH.map((d, i) => {
          // A PLAIN path, not motion.path: motion owns stroke-dasharray
          // and stroke-dashoffset whenever `pathLength` is set on one of
          // its SVG components, and it was overwriting this every frame
          // — the offset sat at 1 forever and nothing ever drew.
          const drawn = reduce
            ? 1
            : stage === 0
              ? Math.max(0, Math.min(1, within * 1.9 - i * 0.045))
              : 1;
          return (
            <path
              key={i}
              d={d}
              fill="none"
              stroke={INK}
              strokeWidth={1.6}
              strokeLinecap="round"
              pathLength={1}
              strokeDasharray={1}
              strokeDashoffset={1 - drawn}
              opacity={0.72}
            />
          );
        })}
      </motion.svg>

      {/* ── Direction: the decisions, beside the sketch ── */}
      <motion.div
        className="ep-direction"
        animate={{ opacity: stage === 0 ? 1 : 0, y: stage === 0 ? 0 : -8 }}
        transition={t}
        aria-hidden={stage !== 0}
      >
        <span className="ep-dlabel">Palette</span>
        <div className="ep-chips">
          {["#F4F0E6", "#EDE9E2", "#B18544", "#2A2926", "#141412"].map((c) => (
            <span key={c} className="ep-chip" style={{ background: c }} />
          ))}
        </div>
        <span className="ep-dlabel">Type</span>
        <div className="ep-spec">
          <span style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>Aa</span>
          <span className="type-accent">Aa</span>
        </div>
      </motion.div>

      {/* ── Build: the code panel ── */}
      <motion.div
        className="ep-code"
        animate={{ x: stage === 2 ? "0%" : "104%", opacity: stage === 2 ? 1 : 0 }}
        transition={{ duration: reduce ? 0 : duration.slow, ease: ease.outExpo }}
        aria-hidden="true"
      >
        <pre>{CODE.join("\n").slice(0, codeChars)}</pre>
      </motion.div>

      {/* ── Refine: the review pins ── */}
      {PINS.map((pin, i) => (
        <motion.div
          key={pin.note}
          className={i < resolved ? "ep-pin ep-pin--done" : "ep-pin"}
          style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
          animate={{ opacity: refining ? 1 : 0, scale: refining ? 1 : 0.8 }}
          transition={{ duration: reduce ? 0 : duration.base, delay: reduce ? 0 : i * 0.06, ease: ease.outQuart }}
          aria-hidden="true"
        >
          <span className="ep-pin-dot">{i < resolved ? "✓" : i + 1}</span>
          <span className="ep-pin-note">{pin.note}</span>
        </motion.div>
      ))}

      {/* ── Refine: the score ── */}
      <motion.div
        className="ep-score"
        animate={{ opacity: refining ? 1 : 0, y: refining ? 0 : 6 }}
        transition={t}
        aria-hidden="true"
      >
        <span className="ep-score-n" style={{ color: score >= 90 ? "#2F7D4F" : GOLD }}>{score}</span>
        <span className="ep-score-l">Speed</span>
      </motion.div>

      {/* ── Ship: the launch pulse ── */}
      <motion.span
        className="ep-pulse"
        aria-hidden="true"
        animate={shipped && !reduce ? { opacity: [0, 0.5, 0], scale: [0.9, 1.5, 1.9] } : { opacity: 0 }}
        transition={{ duration: 1.6, ease: ease.outQuart }}
      />

      <span className="ep-illus">Illustrative</span>

      <style>{`
        .ep { position: absolute; inset: 0; overflow: hidden; background: var(--color-bg); }
        .ep-page { position: absolute; inset: 0; padding: 26px 30px; display: flex; flex-direction: column; }
        .ep-bar { display: flex; align-items: center; justify-content: space-between; }
        .ep-logo { font-size: 17px; font-weight: 600; color: ${INK}; }
        .ep-nav { display: flex; gap: 18px; font-size: 13px; color: ${SOFT}; }
        .ep-hero { display: grid; grid-template-columns: 1.1fr 0.9fr; gap: 26px; margin-top: 26px; align-items: center; }
        .ep-copy { display: flex; flex-direction: column; gap: 11px; min-width: 0; }
        .ep-eyebrow { font-family: var(--font-mono); font-size: 13px; letter-spacing: 0.09em; text-transform: uppercase; }
        .ep-h { font-size: 34px; line-height: 1.08; color: ${INK}; }
        .ep-sub { font-size: 14px; line-height: 1.55; color: ${SOFT}; }
        .ep-btns { display: flex; gap: 10px; margin-top: 6px; }
        .ep-cta, .ep-ghost {
          font-family: inherit; font-size: 13px; font-weight: 500;
          padding: 10px 18px; border-radius: 999px; cursor: pointer;
          transition: background ${duration.fast}s ease, color ${duration.fast}s ease,
                      border-color ${duration.fast}s ease, transform ${duration.fast}s ease;
        }
        .ep-cta { background: ${INK}; color: var(--color-bg); border: 1px solid ${INK}; }
        .ep-ghost { background: transparent; color: ${INK}; border: 1px solid rgba(20,20,18,0.28); }
        .ep-cta:not(:disabled):hover { background: ${GOLD}; border-color: ${GOLD}; transform: translateY(-1px); }
        .ep-ghost:not(:disabled):hover { border-color: ${INK}; transform: translateY(-1px); }
        .ep-cta:disabled, .ep-ghost:disabled { cursor: default; }
        .ep-cta:focus-visible, .ep-ghost:focus-visible { outline: 2px solid ${GOLD}; outline-offset: 3px; }
        .ep-art {
          position: relative; height: 150px; border-radius: 10px;
          background: linear-gradient(160deg, #EDE9E2 0%, #E3DCCB 100%);
          border: 1px solid rgba(20,20,18,0.10); overflow: hidden;
        }
        .ep-art-loaf {
          position: absolute; left: 50%; bottom: 18%; transform: translateX(-50%);
          width: 58%; height: 46%; border-radius: 46% 46% 38% 38%;
          background: linear-gradient(170deg, #C89B5E 0%, #9A6F38 100%);
          box-shadow: inset 0 -6px 12px rgba(0,0,0,0.18);
        }
        .ep-art-steam {
          position: absolute; left: 50%; top: 14%; transform: translateX(-50%);
          width: 34%; height: 26%; border-radius: 50%;
          background: radial-gradient(circle, rgba(255,255,255,0.65), transparent 70%);
        }
        .ep-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; margin-top: 24px; }
        .ep-card {
          border: 1px solid rgba(20,20,18,0.12); border-radius: 8px; padding: 13px;
          display: flex; flex-direction: column; gap: 5px; background: rgba(177,133,68,0.04);
        }
        .ep-ct { font-family: var(--font-display); font-weight: 500; font-size: 16px; color: ${INK}; }
        .ep-cd { font-size: 13px; color: ${SOFT}; }

        /* decorative overlays NEVER take the pointer — this one sat over
           the whole page at opacity 0 and made Build's live buttons
           unhoverable and unclickable */
        .ep-sketch { pointer-events: none; position: absolute; inset: 26px 30px; width: calc(100% - 60px); height: calc(100% - 52px); }
        .ep-direction {
          pointer-events: none;
          position: absolute; right: 30px; top: 26px; width: 168px;
          display: flex; flex-direction: column; gap: 7px;
          background: var(--color-bg); border: 1px solid rgba(20,20,18,0.12);
          border-radius: 8px; padding: 13px;
        }
        .ep-dlabel { font-family: var(--font-mono); font-size: 13px; letter-spacing: 0.08em; text-transform: uppercase; color: ${SOFT}; }
        .ep-chips { display: flex; gap: 5px; }
        .ep-chip { width: 22px; height: 22px; border-radius: 5px; border: 1px solid rgba(20,20,18,0.14); }
        .ep-spec { display: flex; gap: 14px; align-items: baseline; font-size: 26px; color: ${INK}; }

        .ep-code {
          position: absolute; right: 0; top: 0; bottom: 0; width: 42%;
          background: #16161A; border-left: 1px solid rgba(20,20,18,0.4);
          padding: 20px 18px; overflow: hidden;
        }
        .ep-code pre {
          margin: 0; font-family: var(--font-mono); font-size: 13px; line-height: 1.65;
          color: #C9D4E6; white-space: pre-wrap; word-break: break-word;
        }

        .ep-pin { pointer-events: none; position: absolute; display: flex; align-items: center; gap: 7px; z-index: 4; }
        .ep-pin-dot {
          width: 24px; height: 24px; border-radius: 50%; flex: 0 0 24px;
          display: grid; place-items: center;
          background: ${GOLD}; color: #fff;
          font-family: var(--font-mono); font-size: 13px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.25);
          transition: background ${duration.base}s ease;
        }
        .ep-pin--done .ep-pin-dot { background: #2F7D4F; }
        .ep-pin-note {
          font-family: var(--font-mono); font-size: 13px; white-space: nowrap;
          background: rgba(20,20,18,0.88); color: #F4F0E6;
          padding: 5px 9px; border-radius: 5px;
          transition: opacity ${duration.base}s ease;
        }
        .ep-pin--done .ep-pin-note { opacity: 0.45; text-decoration: line-through; }

        .ep-score {
          pointer-events: none;
          position: absolute; right: 30px; bottom: 26px; z-index: 4;
          display: flex; align-items: baseline; gap: 8px;
          background: var(--color-bg); border: 1px solid rgba(20,20,18,0.14);
          border-radius: 8px; padding: 10px 14px;
        }
        .ep-score-n { font-family: var(--font-display); font-weight: 500; font-size: 30px; transition: color ${duration.base}s ease; }
        .ep-score-l { font-family: var(--font-mono); font-size: 13px; color: ${SOFT}; }

        .ep-pulse {
          position: absolute; left: 50%; top: 50%; width: 60%; height: 60%;
          margin: -30% 0 0 -30%; border-radius: 50%; pointer-events: none; z-index: 3;
          background: radial-gradient(circle, rgba(47,125,79,0.30), transparent 68%);
        }
        .ep-illus {
          position: absolute; left: 30px; bottom: 26px; z-index: 4;
          font-family: var(--font-mono); font-size: 13px; letter-spacing: 0.08em;
          text-transform: uppercase; color: ${SOFT};
        }
        @media (max-width: 900px) {
          .ep-page { padding: 14px 15px; }
          .ep-nav, .ep-row { display: none; }
          .ep-hero { grid-template-columns: 1fr; gap: 12px; margin-top: 14px; }
          .ep-art { height: 86px; }
          .ep-h { font-size: 22px; }
          .ep-sketch { inset: 14px 15px; width: calc(100% - 30px); height: calc(100% - 28px); }
          .ep-direction { width: 128px; right: 15px; top: 14px; padding: 10px; }
          .ep-code { width: 58%; padding: 14px 12px; }
          .ep-pin-note { display: none; }
          .ep-score { right: 15px; bottom: 14px; padding: 7px 10px; }
          .ep-illus { left: 15px; bottom: 14px; }
        }
      `}</style>
    </div>
  );
}

/** Hand-drawn-looking wireframe strokes, in the page's own geometry. */
const SKETCH = [
  // the bar
  "M14 16 q 60 -4 118 1",
  "M470 18 q 40 -3 116 0",
  // the headline block
  "M14 92 q 150 -6 300 2",
  "M14 128 q 110 -5 214 3",
  // the body
  "M14 166 q 130 -4 262 2",
  // the buttons
  "M14 200 q 54 -4 106 1 q 3 18 0 34 q -54 4 -106 0 q -3 -18 0 -35",
  "M136 200 q 54 -4 106 1 q 3 18 0 34 q -54 4 -106 0 q -3 -18 0 -35",
  // the art block
  "M352 86 q 118 -6 234 3 q 5 70 0 142 q -118 6 -234 -2 q -5 -70 0 -143",
  "M400 180 q 70 -40 140 2",
  // the three cards
  "M14 282 q 86 -5 172 2 q 4 36 0 72 q -86 5 -172 -1 q -4 -36 0 -73",
  "M200 282 q 86 -5 172 2 q 4 36 0 72 q -86 5 -172 -1 q -4 -36 0 -73",
  "M386 282 q 86 -5 172 2 q 4 36 0 72 q -86 5 -172 -1 q -4 -36 0 -73",
];
