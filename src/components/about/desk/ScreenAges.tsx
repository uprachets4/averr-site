import { useState } from "react";
import { duration } from "../../../lib/motion";
import type { ScreenProps } from "./types";

/**
 * Principle 04 at monitor size — the same two sites, three years on.
 *
 * This is the screen the whole /about world was derived from, so its
 * look is the reference and is kept: the violet→cyan gradient, the
 * glassy blob, the "2026 TREND" tag that turns up on anything you can
 * date. Only the scale changes.
 *
 * The right-hand mockup is wired to nothing at all. That is the claim
 * the principle makes, so it is worth being literal about: the slider
 * cannot reach it.
 */

const FIRST = 2026;
const LAST = 2029;

export default function ScreenAges({ active: _active }: ScreenProps) {
  const [year, setYear] = useState(FIRST);
  const t = (year - FIRST) / (LAST - FIRST);

  return (
    <div className="sa">
      <div className="sa-head">
        <span className="sa-title">The same two sites, three years on</span>
        <span className="sa-sub">Illustration · drag, or use arrow keys</span>
      </div>

      <div className="sa-row">
        <Mock caption="Trend-led" aged={t} />
        <Mock caption="Built to last" />
      </div>

      <div className="sa-control">
        <div className="sa-readout">
          <label htmlFor="desk-year" className="sa-mono">Year</label>
          <span className="sa-year">{year}</span>
        </div>
        <input
          id="desk-year"
          className="sa-range"
          type="range"
          min={FIRST}
          max={LAST}
          step={1}
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
        />
        <div className="sa-scale">
          {[2026, 2027, 2028, 2029].map((y) => (
            <span key={y} className="sa-mono">{y}</span>
          ))}
        </div>
      </div>

      <style>{`
        .sa {
          position: absolute; inset: 0;
          display: flex; flex-direction: column; gap: 20px;
          justify-content: center;
          background: var(--about-surface);
          padding: 26px 32px;
        }
        .sa-head { display: flex; flex-direction: column; gap: 6px; }
        .sa-title {
          font-family: var(--font-display); font-weight: 500; font-size: 19px;
          color: var(--about-ink);
        }
        .sa-sub, .sa-mono {
          font-family: var(--font-mono); font-size: 13px; letter-spacing: 0.04em;
          color: var(--about-body);
        }
        /* the row takes the slack rather than leaving it under the slider */
        .sa-row { flex: 1; min-height: 0; display: grid; grid-template-columns: 1fr 1fr; gap: 22px; min-width: 0; }
        .sa-control { display: flex; flex-direction: column; gap: 9px; }
        .sa-readout { display: flex; align-items: baseline; justify-content: space-between; }
        .sa-year {
          font-family: var(--font-mono); font-size: 17px; color: var(--about-ink);
        }
        .sa-range { width: 100%; height: 26px; cursor: pointer; accent-color: #8FA8FF; }
        .sa-range:focus-visible { outline: 2px solid var(--about-glow-text); outline-offset: 4px; border-radius: 4px; }
        .sa-scale { display: flex; justify-content: space-between; }

        .sa-mock { display: flex; flex-direction: column; gap: 9px; min-width: 0; min-height: 0; }
        .sa-frame {
          position: relative; border-radius: 10px; overflow: hidden;
          flex: 1; min-height: 0;
          border: 1px solid var(--about-hair);
          transition: filter ${duration.base}s ease;
        }
        .sa-tag {
          position: absolute; top: 11px; right: 11px;
          padding: 4px 9px; border-radius: 5px;
          background: rgba(6, 8, 14, 0.78); color: #F4F0E6;
          font-family: var(--font-mono); font-size: 13px; letter-spacing: 0.07em;
          transition: opacity ${duration.base}s ease;
        }
        .sa-inner { position: absolute; inset: 0; padding: 20px; }
        .sa-blob {
          position: absolute; right: -26px; bottom: -34px;
          width: 136px; height: 136px; border-radius: 50%;
          background: rgba(255,255,255,0.3); filter: blur(3px);
        }
        .sa-h {
          font-family: var(--font-display); font-weight: 800; font-size: 24px;
          line-height: 1.14; color: #fff;
          transition: letter-spacing ${duration.base}s ease, text-shadow ${duration.base}s ease;
        }
        .sa-h--calm {
          font-weight: 500; letter-spacing: -0.01em; color: var(--about-ink);
        }
        .sa-bars { margin-top: 14px; display: flex; flex-direction: column; gap: 7px; }
        .sa-pill {
          position: absolute; left: 20px; bottom: 20px;
          padding: 7px 16px; border-radius: 999px;
          font-family: var(--font-body); font-size: 13px; font-weight: 700;
        }
        .sa-rule { display: block; width: 44px; height: 2px; margin: 14px 0; background: var(--about-glow); }
        @media (max-width: 900px) {
          .sa { padding: 16px; gap: 14px; }
          .sa-range { height: 44px; }
          .sa-row { gap: 12px; }
          .sa-h { font-size: 16px; }
          .sa-inner { padding: 12px; }
          .sa-pill { left: 12px; bottom: 12px; padding: 5px 11px; }
        }
      `}</style>
    </div>
  );
}

function Mock({ caption, aged }: { caption: string; aged?: number }) {
  const t = aged ?? 0;
  const trend = aged !== undefined;

  return (
    <div className="sa-mock">
      <div
        className="sa-frame"
        style={{
          background: trend
            ? "linear-gradient(135deg, #7C5CFF 0%, #2BD4D9 100%)"
            : "var(--about-surface-2)",
          filter: trend ? `saturate(${1 - 0.78 * t}) contrast(${1 - 0.12 * t})` : undefined,
        }}
      >
        {trend ? (
          <div className="sa-inner">
            <span className="sa-blob" aria-hidden="true" />
            <div
              className="sa-h"
              style={{
                letterSpacing: `${t * 0.08}em`,
                textShadow: t > 0.2 ? `0 1px 0 rgba(0,0,0,${0.3 * t})` : "none",
              }}
            >
              Supercharge
              <br />
              your workflow
            </div>
            <div className="sa-bars">
              <span style={{ display: "block", width: "80%", height: 7, borderRadius: 4, background: "rgba(255,255,255,0.55)" }} />
              <span style={{ display: "block", width: "62%", height: 7, borderRadius: 4, background: "rgba(255,255,255,0.4)" }} />
            </div>
            <span className="sa-pill" style={{ background: "rgba(255,255,255,0.92)", color: "#3B2BBF" }}>
              Get started
            </span>
          </div>
        ) : (
          <div className="sa-inner">
            <div className="sa-h sa-h--calm">
              The studio
              <br />
              for founders
            </div>
            <span className="sa-rule" />
            <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
              <span style={{ display: "block", width: "78%", height: 7, borderRadius: 4, background: "rgba(160,180,230,0.16)" }} />
              <span style={{ display: "block", width: "58%", height: 7, borderRadius: 4, background: "rgba(160,180,230,0.16)" }} />
            </div>
            <span
              className="sa-pill"
              style={{ background: "var(--about-ink)", color: "var(--about-ground)", fontWeight: 500 }}
            >
              See the work
            </span>
          </div>
        )}

        {trend ? (
          <span className="sa-tag" aria-hidden={t === 0} style={{ opacity: Math.min(1, t * 2.4) }}>
            2026 TREND
          </span>
        ) : null}
      </div>
      <span className="sa-mono">{caption}</span>
    </div>
  );
}
