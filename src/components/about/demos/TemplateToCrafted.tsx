import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { duration, ease } from "../../../lib/motion";
import DemoFrame, { demoInk, type DemoProps } from "./DemoFrame";

/**
 * Principle 01 — the template card rebuilding into a crafted one.
 *
 * One card, five rows. In TEMPLATE state each row is a grey slab of the
 * shape a theme would put there; in CRAFTED state the slab clears and the
 * real thing is underneath — a mono eyebrow, a display headline with the
 * accent voice, a gold rule, set body copy, an ink CTA.
 *
 * The crafted content is always in normal flow and the slabs are absolute
 * over it, so the card is exactly as tall in both states and the toggle
 * cannot shift the panel.
 *
 * Hovering or focusing the card previews the crafted state; clicking pins
 * it. One control, operable by mouse and keyboard, and the reader can
 * always get back.
 */

/** Grey slabs, per row, in the shape a theme template would use. */
const SLABS: { w: string; h: number }[][] = [
  [{ w: "84px", h: 10 }],
  [
    { w: "100%", h: 26 },
    { w: "62%", h: 26 },
  ],
  [{ w: "48px", h: 2 }],
  [
    { w: "100%", h: 12 },
    { w: "96%", h: 12 },
    { w: "70%", h: 12 },
  ],
  [{ w: "132px", h: 42 }],
];

// `active` is unread on purpose: this demo is driven entirely by the
// reader, so arriving at the panel must not change what it shows.
export default function TemplateToCrafted({ dark }: DemoProps) {
  const reduce = useReducedMotion();
  const c = demoInk(dark);
  const [pinned, setPinned] = useState(false);
  const [peek, setPeek] = useState(false);
  const crafted = pinned || peek;

  // The slabs' exit is staggered top-down so the card reads as being
  // rebuilt row by row rather than cross-fading in one lump.
  function slabTransition(row: number) {
    return {
      duration: reduce ? 0 : duration.base,
      delay: reduce ? 0 : row * 0.06,
      ease: ease.outQuart,
    };
  }

  return (
    <DemoFrame
      label={crafted ? "Crafted" : "Template"}
      hint="hover, focus or click"
      dark={dark}
    >
      <button
        type="button"
        aria-pressed={pinned}
        aria-label={
          pinned
            ? "Showing the crafted card. Activate to go back to the template."
            : "Showing the template card. Activate to pin the crafted one."
        }
        onClick={() => setPinned((p) => !p)}
        onMouseEnter={() => setPeek(true)}
        onMouseLeave={() => setPeek(false)}
        onFocus={() => setPeek(true)}
        onBlur={() => setPeek(false)}
        className="ttc-card"
        style={{
          flex: 1,
          minWidth: 0,
          alignSelf: "center",
          textAlign: "left",
          padding: "28px 26px",
          borderRadius: 10,
          border: `1px solid ${crafted ? c.line : "transparent"}`,
          background: crafted ? "transparent" : c.wash,
          transition: `background ${duration.base}s, border-color ${duration.base}s`,
          cursor: "pointer",
          font: "inherit",
          color: "inherit",
        }}
      >
        {/* row 1 — eyebrow */}
        <Row slabs={SLABS[0]} crafted={crafted} c={c} t={slabTransition(0)}>
          <span
            className="type-eyebrow"
            style={{ color: c.muted, display: "block" }}
          >
            Case study
          </span>
        </Row>

        {/* row 2 — headline */}
        <Row slabs={SLABS[1]} crafted={crafted} c={c} t={slabTransition(1)} gap={14}>
          <span
            className="type-h3"
            style={{ color: c.ink, display: "block", margin: 0 }}
          >
            A site that sells <span className="type-accent">the work</span>.
          </span>
        </Row>

        {/* row 3 — the rule a template never earns */}
        <Row slabs={SLABS[2]} crafted={crafted} c={c} t={slabTransition(2)} gap={16}>
          <span
            style={{ display: "block", width: 48, height: 2, background: c.gold }}
          />
        </Row>

        {/* row 4 — body */}
        <Row slabs={SLABS[3]} crafted={crafted} c={c} t={slabTransition(3)} gap={16}>
          <span className="type-small" style={{ color: c.muted, display: "block" }}>
            Built in three weeks, shipped on a preview URL from day one, and
            still the thing the founder sends first.
          </span>
        </Row>

        {/* row 5 — CTA */}
        <Row slabs={SLABS[4]} crafted={crafted} c={c} t={slabTransition(4)} gap={22}>
          <span
            className="type-small"
            style={{
              display: "inline-block",
              padding: "12px 22px",
              borderRadius: 999,
              background: c.ink,
              color: dark ? "var(--color-dark)" : "var(--color-bg)",
              fontWeight: 500,
            }}
          >
            See the work
          </span>
        </Row>
      </button>

      <style>{`
        .ttc-card:focus-visible { outline: 2px solid ${c.ink}; outline-offset: 3px; }
      `}</style>
    </DemoFrame>
  );
}

/**
 * One row: the crafted content in flow, the grey slabs absolutely over it.
 * `active` is not read here — the demo is driven entirely by the reader.
 */
function Row({
  slabs,
  crafted,
  c,
  t,
  gap = 0,
  children,
}: {
  slabs: { w: string; h: number }[];
  crafted: boolean;
  c: ReturnType<typeof demoInk>;
  t: { duration: number; delay: number; ease: readonly number[] };
  gap?: number;
  children: React.ReactNode;
}) {
  return (
    <div style={{ position: "relative", marginTop: gap }}>
      <motion.div
        animate={{ opacity: crafted ? 1 : 0 }}
        transition={{ duration: t.duration, delay: t.delay, ease: t.ease as never }}
        initial={false}
      >
        {children}
      </motion.div>
      <motion.div
        aria-hidden
        animate={{ opacity: crafted ? 0 : 1 }}
        transition={{ duration: t.duration, delay: t.delay, ease: t.ease as never }}
        initial={false}
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 7,
          pointerEvents: "none",
        }}
      >
        {slabs.map((s, i) => (
          <span
            key={i}
            style={{
              display: "block",
              width: s.w,
              height: s.h,
              borderRadius: s.h > 20 ? 4 : 2,
              background: c.skeleton,
            }}
          />
        ))}
      </motion.div>
    </div>
  );
}
