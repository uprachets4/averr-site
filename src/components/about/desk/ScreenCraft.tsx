import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { duration, ease } from "../../../lib/motion";
import type { ScreenProps } from "./types";

/**
 * Principle 01 at monitor size — a whole landing page being rebuilt.
 *
 * Not a card any more: a nav bar, a hero, a three-card row and a footer
 * strip, all of which start as the grey slabs a theme would hand you
 * and resolve into something that was actually designed. The crafted
 * content is always in normal flow and the slabs sit absolutely over
 * it, so the page is exactly as tall in both states and the toggle can
 * never shift the screen.
 *
 * Hovering or focusing the page previews the crafted state; the toggle
 * pins it. Both the page and the toggle are reachable by keyboard.
 */

function Slab({ w, h, r = 3 }: { w: string | number; h: number; r?: number }) {
  return (
    <span
      style={{
        display: "block",
        width: w,
        height: h,
        borderRadius: r,
        background: "rgba(160, 180, 230, 0.13)",
      }}
    />
  );
}

/** One row: crafted content in flow, the theme's slabs absolutely over it. */
function Row({
  crafted,
  step,
  slabs,
  children,
  style,
}: {
  crafted: boolean;
  step: number;
  slabs: React.ReactNode;
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  const reduce = useReducedMotion();
  const t = {
    duration: reduce ? 0 : duration.base,
    delay: reduce ? 0 : step * 0.05,
    ease: ease.outQuart,
  };
  return (
    <div style={{ position: "relative", ...style }}>
      <motion.div initial={false} animate={{ opacity: crafted ? 1 : 0 }} transition={t}>
        {children}
      </motion.div>
      <motion.div
        aria-hidden
        initial={false}
        animate={{ opacity: crafted ? 0 : 1 }}
        transition={t}
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 9,
          pointerEvents: "none",
        }}
      >
        {slabs}
      </motion.div>
    </div>
  );
}

export default function ScreenCraft({ dark: _dark }: ScreenProps) {
  const [pinned, setPinned] = useState(false);
  const [peek, setPeek] = useState(false);
  const crafted = pinned || peek;

  const INK = "var(--about-ink)";
  const BODY = "var(--about-body)";
  const GLOW = "var(--about-glow)";

  return (
    <div className="sc">
      <button
        type="button"
        className="sc-page"
        aria-pressed={pinned}
        aria-label={
          pinned
            ? "Showing the crafted page. Activate to go back to the template."
            : "Showing the template page. Activate to pin the crafted one."
        }
        onClick={() => setPinned((p) => !p)}
        onMouseEnter={() => setPeek(true)}
        onMouseLeave={() => setPeek(false)}
        onFocus={() => setPeek(true)}
        onBlur={() => setPeek(false)}
      >
        {/* ── the site's own bar ── */}
        <Row
          crafted={crafted}
          step={0}
          style={{ height: 34 }}
          slabs={
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <Slab w={74} h={12} />
              <div style={{ display: "flex", gap: 14 }}>
                <Slab w={42} h={10} />
                <Slab w={42} h={10} />
                <Slab w={42} h={10} />
              </div>
              <Slab w={86} h={26} r={13} />
            </div>
          }
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 34 }}>
            <span style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 17, color: INK }}>
              Northbound
            </span>
            <div style={{ display: "flex", gap: 20 }}>
              {["Work", "Studio", "Contact"].map((n) => (
                <span key={n} style={{ fontSize: 13, color: BODY }}>{n}</span>
              ))}
            </div>
            <span
              style={{
                fontSize: 13,
                fontWeight: 500,
                padding: "7px 16px",
                borderRadius: 999,
                background: INK,
                color: "var(--about-ground)",
              }}
            >
              Start a project
            </span>
          </div>
        </Row>

        <span className="sc-rule" />

        {/* ── the hero ── */}
        <Row
          crafted={crafted}
          step={1}
          style={{ marginTop: 26 }}
          slabs={
            <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
              <Slab w={96} h={11} />
              <Slab w="92%" h={30} r={5} />
              <Slab w="64%" h={30} r={5} />
              <Slab w="78%" h={13} />
              <div style={{ display: "flex", gap: 12, marginTop: 6 }}>
                <Slab w={118} h={34} r={17} />
                <Slab w={104} h={34} r={17} />
              </div>
            </div>
          }
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 13,
                letterSpacing: "0.09em",
                textTransform: "uppercase",
                color: GLOW,
              }}
            >
              Field recordings
            </span>
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 500,
                fontSize: 40,
                lineHeight: 1.06,
                letterSpacing: "-0.02em",
                color: INK,
              }}
            >
              Sound that knows{" "}
              <span className="type-accent">where it is</span>.
            </span>
            <span style={{ fontSize: 14, lineHeight: 1.55, color: BODY, maxWidth: "62%" }}>
              A catalogue of location recordings, licensed by the minute, built
              for people who score to picture.
            </span>
            <div style={{ display: "flex", gap: 12, marginTop: 6 }}>
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 500,
                  padding: "10px 22px",
                  borderRadius: 999,
                  background: INK,
                  color: "var(--about-ground)",
                }}
              >
                Hear the catalogue
              </span>
              <span
                style={{
                  fontSize: 13,
                  padding: "10px 20px",
                  borderRadius: 999,
                  border: "1px solid var(--about-hair-hi)",
                  color: INK,
                }}
              >
                How licensing works
              </span>
            </div>
          </div>
        </Row>

        {/* ── three cards ── */}
        <Row
          crafted={crafted}
          step={2}
          style={{ marginTop: 30 }}
          slabs={
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
              {[0, 1, 2].map((i) => (
                <div key={i} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <Slab w="100%" h={56} r={6} />
                  <Slab w="70%" h={11} />
                  <Slab w="90%" h={10} />
                </div>
              ))}
            </div>
          }
        >
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
            {[
              { n: "01", t: "Coastal", d: "47 recordings · Atlantic" },
              { n: "02", t: "Interior", d: "63 recordings · rooms" },
              { n: "03", t: "Transit", d: "38 recordings · rail" },
            ].map((c) => (
              <div
                key={c.n}
                style={{
                  border: "1px solid var(--about-hair)",
                  borderRadius: 8,
                  padding: 14,
                  display: "flex",
                  flexDirection: "column",
                  gap: 7,
                  background: "rgba(160,186,255,0.03)",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 13,
                    color: GLOW,
                    letterSpacing: "0.08em",
                  }}
                >
                  {c.n}
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 500,
                    fontSize: 18,
                    color: INK,
                  }}
                >
                  {c.t}
                </span>
                <span style={{ fontSize: 13, color: BODY }}>{c.d}</span>
              </div>
            ))}
          </div>
        </Row>

        {/* ── the footer strip ── */}
        <Row
          crafted={crafted}
          step={3}
          style={{ marginTop: 24 }}
          slabs={
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Slab w={120} h={10} />
              <Slab w={72} h={10} />
            </div>
          }
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              paddingTop: 14,
              borderTop: "1px solid var(--about-hair)",
            }}
          >
            <span style={{ fontSize: 13, color: BODY }}>Northbound Sound, Halifax</span>
            <span style={{ fontSize: 13, color: BODY }}>Licensing</span>
          </div>
        </Row>
      </button>

      <div className="sc-state">
        <span className={crafted ? "sc-dot sc-dot--on" : "sc-dot"} />
        {crafted ? "Crafted" : "Template"}
        <span className="sc-hint">hover, focus or click to pin</span>
      </div>

      <style>{`
        .sc {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          background: var(--about-surface);
          padding: 26px 30px 0;
        }
        .sc-page {
          flex: 1;
          min-height: 0;
          text-align: left;
          font: inherit;
          color: inherit;
          background: none;
          border: none;
          cursor: pointer;
          display: block;
        }
        .sc-page:focus-visible { outline: 2px solid var(--about-glow-text); outline-offset: 4px; border-radius: 6px; }
        .sc-rule { display: block; height: 1px; background: var(--about-hair); margin-top: 14px; }
        .sc-state {
          display: flex;
          align-items: center;
          gap: 9px;
          padding: 12px 0 14px;
          border-top: 1px solid var(--about-hair);
          margin-top: 10px;
          font-family: var(--font-mono);
          font-size: 13px;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--about-ink);
        }
        .sc-dot {
          width: 8px; height: 8px; border-radius: 50%;
          background: var(--about-hair-hi);
          transition: background ${duration.base}s ease, box-shadow ${duration.base}s ease;
        }
        .sc-dot--on {
          background: var(--about-glow);
          box-shadow: 0 0 0 4px rgba(61,107,255,0.22);
        }
        .sc-hint {
          margin-left: auto;
          text-transform: none;
          letter-spacing: 0.03em;
          color: var(--about-body);
        }
        @media (max-width: 900px) {
          .sc { padding: 16px 16px 0; }
          .sc-hint { display: none; }
        }
      `}</style>
    </div>
  );
}
