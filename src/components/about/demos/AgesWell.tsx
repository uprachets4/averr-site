import { useState } from "react";
import { duration } from "../../../lib/motion";
import DemoFrame, { demoInk, type DemoProps } from "./DemoFrame";

/**
 * Principle 04 — the same two sites, three years later.
 *
 * The reader drags a year from 2026 to 2029. The trend-led mockup dates:
 * its gradient desaturates, a "2026 TREND" tag turns up on it, and its
 * type drifts off-era. The one built on fundamentals is pixel-identical
 * at every year — that is the claim, so the right half is deliberately
 * not wired to the slider at all.
 *
 * Both mockups are CSS; nothing here is an image. The frame says
 * ILLUSTRATION because that is what it is: no real client site is being
 * shown ageing.
 */

const FIRST = 2026;
const LAST = 2029;

export default function AgesWell({ dark }: DemoProps) {
  const c = demoInk(dark);
  const [year, setYear] = useState(FIRST);
  const t = (year - FIRST) / (LAST - FIRST);

  return (
    <DemoFrame label="Illustration" hint="drag, or use arrow keys" dark={dark}>
      <div
        style={{
          flex: 1,
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 22,
        }}
      >
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, minWidth: 0 }}>
          <Mock
            caption="Trend-led"
            c={c}
            /* the only half the slider touches */
            aged={t}
          />
          <Mock caption="Built to last" c={c} />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <label htmlFor="ages-well-year" style={mono(c.muted)}>
              Year
            </label>
            <span style={{ ...mono(c.ink), fontSize: 13 }}>{year}</span>
          </div>
          <input
            id="ages-well-year"
            className="aw-range"
            type="range"
            min={FIRST}
            max={LAST}
            step={1}
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            style={{ accentColor: c.ink, width: "100%" }}
          />
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            {[2026, 2027, 2028, 2029].map((y) => (
              <span key={y} style={mono(c.muted)}>
                {y}
              </span>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .aw-range { height: 24px; cursor: pointer; }
        .aw-range:focus-visible { outline: 2px solid ${c.ink}; outline-offset: 4px; border-radius: 4px; }
      `}</style>
    </DemoFrame>
  );
}

/**
 * One mini site. With no `aged` it is a fixed drawing: that is the whole
 * point of the right-hand half, so it takes no ageing input at all.
 */
function Mock({
  caption,
  c,
  aged,
}: {
  caption: string;
  c: ReturnType<typeof demoInk>;
  aged?: number;
}) {
  const t = aged ?? 0;
  const trend = aged !== undefined;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, minWidth: 0 }}>
      <div
        style={{
          position: "relative",
          borderRadius: 10,
          border: `1px solid ${c.line}`,
          overflow: "hidden",
          aspectRatio: "4 / 3",
          background: trend
            ? "linear-gradient(135deg, #7C5CFF 0%, #2BD4D9 100%)"
            : c.surface,
          // ageing is a colour story: the gradient loses its charge
          filter: trend ? `saturate(${1 - 0.78 * t}) contrast(${1 - 0.12 * t})` : undefined,
          transition: `filter ${duration.base}s ease`,
        }}
      >
        {trend ? <TrendInside t={t} /> : <CraftedInside c={c} />}

        {/* the tag that turns up on anything you can date */}
        {trend ? (
          <span
            aria-hidden={t === 0}
            style={{
              position: "absolute",
              top: 8,
              right: 8,
              padding: "3px 7px",
              borderRadius: 4,
              background: "rgba(20,20,18,0.72)",
              color: "#F4F0E6",
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              letterSpacing: "0.08em",
              opacity: Math.min(1, t * 2.4),
              transition: `opacity ${duration.base}s ease`,
            }}
          >
            2026 TREND
          </span>
        ) : null}
      </div>
      <span style={mono(c.muted)}>{caption}</span>
    </div>
  );
}

/** Glassy, blobby, of its moment — and drifting off-era as t rises. */
function TrendInside({ t }: { t: number }) {
  return (
    <div style={{ position: "absolute", inset: 0, padding: 14 }}>
      <span
        aria-hidden
        style={{
          position: "absolute",
          right: -18,
          bottom: -24,
          width: 86,
          height: 86,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.3)",
          filter: "blur(2px)",
        }}
      />
      <div
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 800,
          fontSize: 17,
          lineHeight: 1.15,
          color: "#fff",
          // the type ages: tracking opens up, the glow comes back
          letterSpacing: `${t * 0.08}em`,
          textShadow: t > 0.2 ? `0 1px 0 rgba(0,0,0,${0.3 * t})` : "none",
          transition: `letter-spacing ${duration.base}s ease, text-shadow ${duration.base}s ease`,
        }}
      >
        Supercharge
        <br />
        your workflow
      </div>
      <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 5 }}>
        <span style={{ display: "block", width: "80%", height: 5, borderRadius: 3, background: "rgba(255,255,255,0.55)" }} />
        <span style={{ display: "block", width: "62%", height: 5, borderRadius: 3, background: "rgba(255,255,255,0.4)" }} />
      </div>
      <span
        style={{
          position: "absolute",
          left: 14,
          bottom: 14,
          padding: "5px 12px",
          borderRadius: 999,
          background: "rgba(255,255,255,0.9)",
          color: "#3B2BBF",
          fontFamily: "var(--font-body)",
          fontSize: 11,
          fontWeight: 700,
        }}
      >
        Get started
      </span>
    </div>
  );
}

/** Type, spacing, one rule. Nothing to date. */
function CraftedInside({ c }: { c: ReturnType<typeof demoInk> }) {
  return (
    <div style={{ position: "absolute", inset: 0, padding: 14 }}>
      <div
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 500,
          fontSize: 17,
          lineHeight: 1.15,
          letterSpacing: "-0.01em",
          color: c.ink,
        }}
      >
        The studio
        <br />
        for founders
      </div>
      <span style={{ display: "block", width: 34, height: 2, background: c.gold, margin: "10px 0" }} />
      <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
        <span style={{ display: "block", width: "78%", height: 5, borderRadius: 3, background: c.skeleton }} />
        <span style={{ display: "block", width: "58%", height: 5, borderRadius: 3, background: c.skeleton }} />
      </div>
      <span
        style={{
          position: "absolute",
          left: 14,
          bottom: 14,
          padding: "5px 12px",
          borderRadius: 999,
          background: c.ink,
          color: c.surface,
          fontFamily: "var(--font-body)",
          fontSize: 11,
          fontWeight: 500,
        }}
      >
        See the work
      </span>
    </div>
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
