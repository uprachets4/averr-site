import { useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useTransform,
  type MotionValue,
} from "motion/react";
import { easing } from "../../lib/motion";
import { useScrollStyle } from "../../lib/useScrollStyle";
import { ILLUSTRATIVE_LABEL } from "../../data/servicePillars";

/**
 * The canvas: a generic business's site being built as you scroll.
 *
 * Everything here is drawn in CSS and inline SVG — no screenshots, no
 * brand marks, nothing that could be mistaken for a real client. The site
 * is "yourbusiness.ca" and the whole surface carries an ILLUSTRATIVE
 * label, because a convincing-looking dashboard full of numbers is
 * exactly what rule 12 exists to stop.
 *
 * Three structural rules this file keeps to:
 *   - every scene stays mounted for the life of the stage and crossfades
 *     on one continuous scroll position. Nothing is keyed on an index
 *     that flips (the /work film desync, §5.13) and nothing unmounts
 *     mid-transition (the AnimatePresence gap, §5.6).
 *   - all scroll-linked OPACITY goes through `useScrollStyle`. This lives
 *     inside a `position: sticky` frame, where motion binds opacity to a
 *     ViewTimeline that never advances (§5.1). Transforms are unaffected.
 *   - anything that needs a hook per item is its own component. Hooks in
 *     a `.map()` happen to work while the array length is constant, and
 *     stop working the moment it isn't.
 */

/** Clamped sub-range of a 0–1 value. */
function sub(p: number, a: number, b: number) {
  if (b === a) return p >= b ? 1 : 0;
  const t = (p - a) / (b - a);
  return t < 0 ? 0 : t > 1 ? 1 : t;
}

/** Opacity-only layer inside the pinned frame. */
function Fade({
  opacity,
  children,
  style,
}: {
  opacity: MotionValue<number>;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}) {
  const ref = useScrollStyle<HTMLDivElement>(opacity);
  return (
    <div ref={ref} style={style}>
      {children}
    </div>
  );
}

const INK = "var(--color-ink)";
const SOFT = "rgba(20,20,18,0.10)";
const SOFTER = "rgba(20,20,18,0.06)";
const HAIR = "rgba(20,20,18,0.14)";
/** The palette the brand beat drops in — deliberately not Averr's own, so
 *  the canvas reads as someone else's business. */
const SWATCHES = ["#2F5D50", "#C8763C", "#E8DFCD", "#1B1B19", "#8FA9A0"];

/** Phase map inside one beat, as ruled in 17c-1: the completed canvas and
 *  its caption hold from 0.40 to 0.85 — 29.25vh of a 65vh beat. */
export const PHASE = {
  captionIn: 0.15,
  buildFrom: 0.05,
  buildTo: 0.4,
  dwellTo: 0.85,
};

export type SceneProps = { build: MotionValue<number> };

/* ═══════════════════════════════════════════════════════════════
   The browser frame
   ═══════════════════════════════════════════════════════════════ */

export function BrowserFrame({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ position: "relative", width: "100%" }}>
      <div
        className="type-eyebrow"
        style={{
          position: "absolute",
          top: -26,
          right: 0,
          fontFamily: "var(--font-mono)",
          color: "var(--color-muted-2)",
          pointerEvents: "none",
        }}
      >
        {ILLUSTRATIVE_LABEL}
      </div>

      <div
        style={{
          width: "100%",
          aspectRatio: "16 / 10",
          borderRadius: 12,
          overflow: "hidden",
          background: "var(--color-bg)",
          border: `1px solid ${HAIR}`,
          boxShadow: "0 18px 48px rgba(20,20,18,0.10)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            height: 34,
            flex: "0 0 34px",
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "0 12px",
            borderBottom: `1px solid ${SOFT}`,
            background: "rgba(20,20,18,0.03)",
          }}
        >
          <span style={{ display: "flex", gap: 5 }}>
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "rgba(20,20,18,0.16)",
                }}
              />
            ))}
          </span>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              color: "var(--color-muted-2)",
              background: "var(--color-bg)",
              border: `1px solid ${SOFT}`,
              borderRadius: 999,
              padding: "3px 12px",
              letterSpacing: "0.06em",
            }}
          >
            yourbusiness.ca
          </span>
        </div>

        <div
          style={{
            position: "relative",
            flex: 1,
            overflow: "hidden",
            background: "var(--color-bg)",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   1 · Brand & design direction
   ═══════════════════════════════════════════════════════════════ */

function SwatchDrop({ build, colour, i }: { build: MotionValue<number>; colour: string; i: number }) {
  const drop = useTransform(build, (p) => sub(p, 0.06 + i * 0.045, 0.2 + i * 0.045));
  const y = useTransform(drop, [0, 1], [-16, 0]);
  return (
    <Fade opacity={drop}>
      <motion.span
        style={{
          display: "block",
          width: 34,
          height: 22,
          borderRadius: 5,
          background: colour,
          y,
        }}
      />
    </Fade>
  );
}

function BrandCard({ tint, i }: { tint: MotionValue<number>; i: number }) {
  const bg = useTransform(
    tint,
    [0, 1],
    [SOFTER, i === 1 ? SWATCHES[4] : SWATCHES[2]]
  );
  return (
    <motion.div
      style={{
        flex: 1,
        height: 54,
        borderRadius: 6,
        background: bg,
        border: `1px solid ${SOFT}`,
      }}
    />
  );
}

export function SceneBrand({ build }: SceneProps) {
  const colour = useTransform(build, (p) => sub(p, 0.28, 0.66));
  const serifIn = useTransform(build, (p) => sub(p, 0.58, 0.82));
  const sansOut = useTransform(build, (p) => 1 - sub(p, 0.58, 0.82));
  const markDraw = useTransform(build, (p) => sub(p, 0.72, 1));

  const headerBg = useTransform(colour, [0, 1], [SOFTER, SWATCHES[3]]);
  const heroBg = useTransform(colour, [0, 1], ["rgba(20,20,18,0.04)", SWATCHES[2]]);
  const accentBg = useTransform(colour, [0, 1], [SOFT, SWATCHES[1]]);

  return (
    <div style={{ position: "absolute", inset: 0, padding: 18 }}>
      <div style={{ display: "flex", gap: 8, marginBottom: 14, height: 22 }}>
        {SWATCHES.map((c, i) => (
          <SwatchDrop key={c} build={build} colour={c} i={i} />
        ))}
      </div>

      <motion.div
        style={{
          height: 26,
          borderRadius: 5,
          background: headerBg,
          marginBottom: 12,
          display: "flex",
          alignItems: "center",
          paddingLeft: 10,
          gap: 8,
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <motion.path
            d="M12 3 L21 19 L3 19 Z"
            stroke="var(--color-parch)"
            strokeWidth="2"
            strokeLinejoin="round"
            style={{ pathLength: markDraw }}
          />
        </svg>
        <span style={{ display: "flex", gap: 6 }}>
          {[22, 18, 20].map((w, i) => (
            <span
              key={i}
              style={{
                width: w,
                height: 4,
                borderRadius: 2,
                background: "rgba(237,231,218,0.5)",
              }}
            />
          ))}
        </span>
      </motion.div>

      <motion.div
        style={{
          position: "relative",
          height: 92,
          borderRadius: 6,
          background: heroBg,
          padding: 14,
          marginBottom: 12,
          overflow: "hidden",
        }}
      >
        <div style={{ position: "relative", height: 28 }}>
          <Fade opacity={sansOut} style={{ position: "absolute", inset: 0 }}>
            <span
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: 21,
                fontWeight: 600,
                color: INK,
                letterSpacing: "-0.02em",
              }}
            >
              Your business, online.
            </span>
          </Fade>
          <Fade opacity={serifIn} style={{ position: "absolute", inset: 0 }}>
            <span className="type-accent" style={{ fontSize: 23, color: INK }}>
              Your business, online.
            </span>
          </Fade>
        </div>
        <div style={{ display: "flex", gap: 6, marginTop: 10 }}>
          {[120, 90].map((w, i) => (
            <span
              key={i}
              style={{
                width: w,
                height: 5,
                borderRadius: 3,
                background: "rgba(20,20,18,0.18)",
              }}
            />
          ))}
        </div>
        <motion.span
          style={{
            display: "block",
            width: 68,
            height: 18,
            borderRadius: 999,
            background: accentBg,
            marginTop: 12,
          }}
        />
      </motion.div>

      <div style={{ display: "flex", gap: 10 }}>
        {[0, 1, 2].map((i) => (
          <BrandCard key={i} tint={colour} i={i} />
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   2 · Marketing websites
   ═══════════════════════════════════════════════════════════════ */

const SITE_BLOCKS = [
  { h: 24, label: "nav" },
  { h: 86, label: "hero" },
  { h: 56, label: "cards" },
  { h: 44, label: "testimonial" },
  { h: 34, label: "cta" },
] as const;

function SiteBlock({
  build,
  block,
  i,
}: {
  build: MotionValue<number>;
  block: (typeof SITE_BLOCKS)[number];
  i: number;
}) {
  const inAt = useTransform(build, (p) => sub(p, i * 0.15, 0.32 + i * 0.15));
  const y = useTransform(inAt, [0, 1], [26, 0]);

  return (
    <Fade opacity={inAt}>
      <motion.div style={{ y }}>
        {block.label === "cards" ? (
          <div style={{ display: "flex", gap: 10 }}>
            {[0, 1, 2].map((c) => (
              <div
                key={c}
                style={{
                  flex: 1,
                  height: block.h,
                  borderRadius: 6,
                  background: "var(--color-bg-alt)",
                  border: `1px solid ${SOFT}`,
                  padding: 10,
                }}
              >
                <span
                  style={{
                    display: "block",
                    width: 26,
                    height: 6,
                    borderRadius: 3,
                    background: SWATCHES[1],
                    marginBottom: 8,
                  }}
                />
                <span
                  style={{
                    display: "block",
                    width: "78%",
                    height: 4,
                    borderRadius: 2,
                    background: "rgba(20,20,18,0.16)",
                  }}
                />
              </div>
            ))}
          </div>
        ) : (
          <div
            style={{
              height: block.h,
              borderRadius: block.label === "nav" ? 5 : 6,
              background:
                block.label === "nav"
                  ? SWATCHES[3]
                  : block.label === "cta"
                  ? SWATCHES[0]
                  : "var(--color-bg-alt)",
              border:
                block.label === "nav" || block.label === "cta"
                  ? "none"
                  : `1px solid ${SOFT}`,
              display: "flex",
              alignItems: "center",
              padding: "0 12px",
              gap: 8,
            }}
          >
            {block.label === "hero" ? (
              <div>
                <span
                  className="type-accent"
                  style={{
                    display: "block",
                    fontSize: 22,
                    color: INK,
                    marginBottom: 8,
                  }}
                >
                  Your business, online.
                </span>
                <span
                  style={{
                    display: "block",
                    width: 150,
                    height: 5,
                    borderRadius: 3,
                    background: "rgba(20,20,18,0.16)",
                  }}
                />
              </div>
            ) : null}
            {block.label === "testimonial" ? (
              <>
                <span
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: "50%",
                    background: SWATCHES[4],
                    flex: "0 0 26px",
                  }}
                />
                <span
                  style={{
                    flex: 1,
                    height: 5,
                    borderRadius: 3,
                    background: "rgba(20,20,18,0.16)",
                  }}
                />
              </>
            ) : null}
            {block.label === "cta" ? (
              <span
                style={{
                  margin: "0 auto",
                  width: 90,
                  height: 16,
                  borderRadius: 999,
                  background: "rgba(237,231,218,0.9)",
                }}
              />
            ) : null}
          </div>
        )}
      </motion.div>
    </Fade>
  );
}

export function SceneWebsite({ build }: SceneProps) {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        padding: 18,
        display: "flex",
        flexDirection: "column",
        gap: 10,
      }}
    >
      {SITE_BLOCKS.map((b, i) => (
        <SiteBlock key={b.label} build={build} block={b} i={i} />
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   3 · Product & SaaS interfaces  (also the ground for 4 and 5)
   ═══════════════════════════════════════════════════════════════ */

const STAT_VALUES = ["1,284", "38%", "4.6"];

function StatCard({ build, i }: { build: MotionValue<number>; i: number }) {
  const inAt = useTransform(build, (p) => sub(p, 0.2 + i * 0.08, 0.5 + i * 0.08));
  const y = useTransform(inAt, [0, 1], [12, 0]);
  return (
    <Fade opacity={inAt} style={{ flex: 1 }}>
      <motion.div
        style={{
          y,
          borderRadius: 6,
          border: `1px solid ${SOFT}`,
          background: "var(--color-bg)",
          padding: 10,
        }}
      >
        <span
          style={{
            display: "block",
            width: 30,
            height: 4,
            borderRadius: 2,
            background: "rgba(20,20,18,0.2)",
            marginBottom: 8,
          }}
        />
        <span
          style={{
            display: "block",
            fontFamily: "var(--font-mono)",
            fontSize: 17,
            color: INK,
          }}
        >
          {STAT_VALUES[i]}
        </span>
      </motion.div>
    </Fade>
  );
}

function TableRow({ build, i }: { build: MotionValue<number>; i: number }) {
  const inAt = useTransform(build, (p) => sub(p, 0.58 + i * 0.1, 0.82 + i * 0.1));
  return (
    <Fade opacity={inAt}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "7px 0",
          borderTop: i === 0 ? "none" : `1px solid ${SOFTER}`,
        }}
      >
        <span
          style={{
            width: 7,
            height: 7,
            borderRadius: "50%",
            background: SWATCHES[0],
          }}
        />
        <span
          style={{
            flex: 1,
            height: 4,
            borderRadius: 2,
            background: "rgba(20,20,18,0.14)",
          }}
        />
        <span
          style={{
            width: 34,
            height: 4,
            borderRadius: 2,
            background: "rgba(20,20,18,0.1)",
          }}
        />
      </div>
    </Fade>
  );
}

export function SceneDashboard({ build }: SceneProps) {
  const sideX = useTransform(build, (p) => -110 * (1 - sub(p, 0, 0.3)));
  const chart = useTransform(build, (p) => sub(p, 0.5, 1));

  return (
    <div style={{ position: "absolute", inset: 0, display: "flex" }}>
      <motion.div
        style={{
          width: 96,
          flex: "0 0 96px",
          background: SWATCHES[3],
          padding: 14,
          display: "flex",
          flexDirection: "column",
          gap: 9,
          x: sideX,
        }}
      >
        <span
          style={{
            width: 26,
            height: 6,
            borderRadius: 3,
            background: SWATCHES[1],
            marginBottom: 6,
          }}
        />
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            style={{
              width: i === 0 ? "88%" : "68%",
              height: 5,
              borderRadius: 3,
              background:
                i === 0 ? "rgba(237,231,218,0.85)" : "rgba(237,231,218,0.32)",
            }}
          />
        ))}
      </motion.div>

      <div style={{ flex: 1, padding: 16, position: "relative" }}>
        <motion.div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
          {[0, 1, 2].map((i) => (
            <StatCard key={i} build={build} i={i} />
          ))}
        </motion.div>

        <div
          style={{
            height: 66,
            borderRadius: 6,
            border: `1px solid ${SOFT}`,
            background: "var(--color-bg)",
            marginBottom: 12,
            overflow: "hidden",
          }}
        >
          <svg
            viewBox="0 0 300 66"
            preserveAspectRatio="none"
            style={{ width: "100%", height: "100%", display: "block" }}
          >
            <motion.path
              d="M6 52 C 46 46, 66 20, 104 28 S 168 54, 200 30 S 258 12, 294 18"
              fill="none"
              stroke={SWATCHES[1]}
              strokeWidth="2.5"
              strokeLinecap="round"
              style={{ pathLength: chart }}
            />
          </svg>
        </div>

        <div>
          {[0, 1, 2].map((i) => (
            <TableRow key={i} build={build} i={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   4 · Design systems — a labelled specimen grid
   ═══════════════════════════════════════════════════════════════ */

/**
 * The first pass pulled the dashboard apart with x-offsets and floated
 * three labels over it. On screen that read as a broken layout with stray
 * tags, not as a system: the sidebar slid out leaving a dead gutter, the
 * table ran past the frame, and each label sat beside something it did
 * not name. This is the thing the brief actually asked for — the
 * components lifted out as labelled specimens.
 */
const SPECIMENS = ["Button", "Card", "Input", "Tokens", "Spacing"] as const;

function Specimen({
  build,
  name,
  i,
}: {
  build: MotionValue<number>;
  name: (typeof SPECIMENS)[number];
  i: number;
}) {
  const inAt = useTransform(build, (p) => sub(p, 0.12 + i * 0.12, 0.42 + i * 0.12));
  const y = useTransform(inAt, [0, 1], [14, 0]);

  return (
    <Fade opacity={inAt}>
      <motion.div style={{ y }}>
        <span
          style={{
            display: "block",
            fontFamily: "var(--font-mono)",
            fontSize: 9,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "var(--color-muted-2)",
            marginBottom: 7,
          }}
        >
          {name}
        </span>
        <div
          style={{
            border: `1px solid ${SOFT}`,
            borderRadius: 7,
            background: "var(--color-bg)",
            padding: 12,
            minHeight: 62,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {name === "Button" ? (
            <span
              style={{
                padding: "7px 16px",
                borderRadius: 999,
                background: SWATCHES[0],
                color: "var(--color-parch)",
                fontSize: 11,
                fontWeight: 500,
              }}
            >
              Get a quote
            </span>
          ) : null}

          {name === "Card" ? (
            <div style={{ width: "100%" }}>
              <span
                style={{
                  display: "block",
                  width: 24,
                  height: 5,
                  borderRadius: 3,
                  background: SWATCHES[1],
                  marginBottom: 7,
                }}
              />
              <span
                style={{
                  display: "block",
                  fontFamily: "var(--font-mono)",
                  fontSize: 14,
                  color: INK,
                }}
              >
                1,284
              </span>
            </div>
          ) : null}

          {name === "Input" ? (
            <span
              style={{
                display: "flex",
                alignItems: "center",
                width: "100%",
                height: 26,
                borderRadius: 5,
                border: `1px solid ${HAIR}`,
                background: "var(--color-bg-alt)",
                padding: "0 9px",
                gap: 2,
              }}
            >
              <span
                style={{
                  width: 42,
                  height: 4,
                  borderRadius: 2,
                  background: "rgba(20,20,18,0.2)",
                }}
              />
              <span style={{ width: 1, height: 12, background: SWATCHES[0] }} />
            </span>
          ) : null}

          {name === "Tokens" ? (
            <span style={{ display: "flex", gap: 5 }}>
              {SWATCHES.map((c) => (
                <span
                  key={c}
                  style={{
                    width: 16,
                    height: 16,
                    borderRadius: 4,
                    background: c,
                  }}
                />
              ))}
            </span>
          ) : null}

          {name === "Spacing" ? (
            <span style={{ display: "flex", alignItems: "flex-end", gap: 5 }}>
              {[5, 9, 14, 20, 27].map((h) => (
                <span
                  key={h}
                  style={{
                    width: 7,
                    height: h,
                    borderRadius: 2,
                    background: "rgba(20,20,18,0.2)",
                  }}
                />
              ))}
            </span>
          ) : null}
        </div>
      </motion.div>
    </Fade>
  );
}

export function SceneSystem({ build }: SceneProps) {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        padding: 18,
        display: "grid",
        gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
        gridTemplateRows: "auto auto",
        gap: 14,
        alignContent: "center",
      }}
    >
      {SPECIMENS.map((name, i) => (
        <Specimen key={name} build={build} name={name} i={i} />
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   5 · Post-launch refinement
   ═══════════════════════════════════════════════════════════════ */

const VERSIONS = ["v1.0", "v1.1", "v1.2", "v1.3"];
const PLUS_MARKS: Array<[string, string]> = [
  ["26%", "20%"],
  ["58%", "60%"],
  ["76%", "32%"],
];

function PlusMark({
  build,
  left,
  top,
  i,
}: {
  build: MotionValue<number>;
  left: string;
  top: string;
  i: number;
}) {
  const show = useTransform(build, (p) => sub(p, 0.2 + i * 0.2, 0.42 + i * 0.2));
  const scale = useTransform(show, [0, 1], [0.6, 1]);
  return (
    <Fade opacity={show} style={{ position: "absolute", left, top }}>
      <motion.span
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 18,
          height: 18,
          borderRadius: "50%",
          background: SWATCHES[1],
          color: "var(--color-parch)",
          fontFamily: "var(--font-mono)",
          fontSize: 12,
          lineHeight: 1,
          scale,
        }}
      >
        +
      </motion.span>
    </Fade>
  );
}

export function SceneRefine({ build }: SceneProps) {
  const [version, setVersion] = useState(VERSIONS[0]);
  useMotionValueEvent(build, "change", function tick(p) {
    const i = Math.min(
      VERSIONS.length - 1,
      Math.max(0, Math.floor(p * VERSIONS.length))
    );
    setVersion(VERSIONS[i]);
  });

  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          top: 12,
          right: 14,
          fontFamily: "var(--font-mono)",
          fontSize: 10,
          letterSpacing: "0.08em",
          color: "var(--color-parch)",
          background: SWATCHES[0],
          padding: "3px 9px",
          borderRadius: 999,
        }}
      >
        {version}
      </div>
      {PLUS_MARKS.map(([left, top], i) => (
        <PlusMark key={left} build={build} left={left} top={top} i={i} />
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   The scene stack
   ═══════════════════════════════════════════════════════════════ */

export function SceneStack({
  position,
  beatCount,
}: {
  position: MotionValue<number>;
  beatCount: number;
}) {
  return (
    <>
      {Array.from({ length: beatCount }).map((_, i) => (
        <SceneLayer key={i} index={i} position={position} />
      ))}
    </>
  );
}

function SceneLayer({
  index,
  position,
}: {
  index: number;
  position: MotionValue<number>;
}) {
  const opacity = useTransform(
    position,
    [index - 0.16, index + 0.02, index + 0.98, index + 1.16],
    [0, 1, 1, 0],
    { ease: [easing.inOut, easing.inOut, easing.inOut] }
  );
  const build = useTransform(position, (p) =>
    sub(p - index, PHASE.buildFrom, PHASE.buildTo)
  );
  // Beats 4 and 5 stand on a finished dashboard rather than rebuilding it.
  const complete = useTransform(position, () => 1);
  const ref = useScrollStyle<HTMLDivElement>(opacity);

  let scene: React.ReactNode = null;
  if (index === 0) scene = <SceneBrand build={build} />;
  else if (index === 1) scene = <SceneWebsite build={build} />;
  else if (index === 2) scene = <SceneDashboard build={build} />;
  else if (index === 3) scene = <SceneSystem build={build} />;
  else if (index === 4)
    scene = (
      <>
        <SceneDashboard build={complete} />
        <SceneRefine build={build} />
      </>
    );

  return (
    <div ref={ref} style={{ position: "absolute", inset: 0 }}>
      {scene}
    </div>
  );
}
