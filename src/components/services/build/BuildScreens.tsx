import { useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useTransform,
  type MotionValue,
} from "motion/react";
import { useScrollStyle } from "../../../lib/useScrollStyle";
import type { CursorKey } from "./GhostCursor";
import type { FocusMove } from "./camera";
import type { ChromeTone } from "./WindowChrome";

/**
 * The five Design-chapter screens.
 *
 * 17c-1's canvas was one toy window redressed five times; the verdict was
 * that it read as a pastel wireframe. These are five different pieces of
 * software: a brand board, a local-business website, a dark analytics
 * dashboard, a component library and a release dashboard. Different
 * layouts, different palettes, different chrome, real-looking content.
 *
 * Everything is React/CSS/SVG. No screenshots, no stock photography, no
 * real marks. Every name, street, number and review below is invented,
 * plausible for the GTA, and the window carries ILLUSTRATIVE throughout.
 *
 * Each screen reads the same local beat progress the ghost cursor is
 * choreographed against, so a click and its response cannot drift.
 */

function at(t: number, a: number, b: number) {
  if (b === a) return t >= b ? 1 : 0;
  const r = (t - a) / (b - a);
  return r < 0 ? 0 : r > 1 ? 1 : r;
}

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

/*
 * Timing convention: a screen's LAYOUT finishes assembling by local 0.40,
 * which is where the dwell starts. Everything after that is the cursor's
 * interaction and the screen's response to it — a field filling, a range
 * switching, a theme flipping. A screen still building during its own
 * dwell reads as unfinished rather than as software being used.
 */

/* ── the brand the demo business ends up with ─────────────────── */

const BRAND = {
  name: "NORTHGATE",
  sub: "HOME SERVICES",
  ink: "#16211D",
  primary: "#1F5D4C",
  accentA: "#C8763C",
  accentB: "#3E7CA6",
  sand: "#EFE7D8",
  paper: "#FBF9F4",
};

/** `compact` renders a restructured mobile layout rather than the
 *  desktop one shrunk — see AutomateScreens for why that distinction
 *  matters (the scaled-stills gotcha). */
export type ScreenProps = { local: MotionValue<number>; compact?: boolean };


/* ── mobile variants ─────────────────────────────────────────────
 *
 * Restructured, never scaled. The desktop compositions are dense
 * two-pane layouts whose 8-10px type is fine at 880px and illegible at
 * 327px; shrinking them is the scaled-stills gotcha. Each of these
 * rebuilds the same idea as a single column at real sizes, with 11px as
 * the floor for every text node.
 */

const MIN = 11;

function MRow({
  label,
  value,
  tint,
}: {
  label: React.ReactNode;
  value?: React.ReactNode;
  tint?: string;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 0", borderTop: "1px solid rgba(27,31,29,0.08)" }}>
      <span style={{ flex: 1, fontSize: 13, color: "#1B1F1D" }}>{label}</span>
      {value != null ? (
        <span style={{ fontFamily: "var(--font-mono)", fontSize: MIN, color: tint || "rgba(27,31,29,0.6)" }}>{value}</span>
      ) : null}
    </div>
  );
}

function MShell({ bg, children }: { bg: string; children: React.ReactNode }) {
  return (
    <div style={{ position: "absolute", inset: 0, background: bg, padding: 16, overflow: "hidden" }}>
      {children}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   B1 · Brand board
   ═══════════════════════════════════════════════════════════════ */

const PALETTE: Array<[string, string]> = [
  ["Forest", BRAND.primary],
  ["Sand", BRAND.sand],
  ["Ink", BRAND.ink],
  ["Slate", "#6F7D78"],
];

export function ScreenBrandBoard({ local, compact }: ScreenProps) {
  // the cursor picks the accent at 0.54; everything downstream re-tints
  const [accent, setAccent] = useState(BRAND.accentA);
  useMotionValueEvent(local, "change", function pick(t) {
    setAccent(t > 0.545 ? BRAND.accentB : BRAND.accentA);
  });

  const draw = useTransform(local, (t) => at(t, 0.08, 0.28));
  const chips = useTransform(local, (t) => at(t, 0.14, 0.3));
  const spec = useTransform(local, (t) => at(t, 0.2, 0.34));
  const apps = useTransform(local, (t) => at(t, 0.26, 0.4));


  if (compact) {
    return (
      <MShell bg={BRAND.paper}>
        <div style={{ display: "flex", alignItems: "center", gap: 11, marginBottom: 14 }}>
          <svg width="28" height="28" viewBox="0 0 48 48" fill="none">
            <path d="M8 38 L8 14 L24 24 L40 14 L40 38" stroke={BRAND.primary} strokeWidth="3.6" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="24" cy="36" r="3.1" fill={accent} />
          </svg>
          <span>
            <span style={{ display: "block", fontSize: 15, fontWeight: 600, letterSpacing: "0.14em", color: BRAND.ink }}>{BRAND.name}</span>
            <span style={{ display: "block", fontFamily: "var(--font-mono)", fontSize: MIN, letterSpacing: "0.2em", color: "rgba(22,33,29,0.5)", marginTop: 3 }}>{BRAND.sub}</span>
          </span>
        </div>
        <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
          {[...PALETTE, ["Accent", accent] as [string, string]].map(([n, c]) => (
            <div key={n} style={{ flex: 1 }}>
              <div style={{ height: 34, borderRadius: 6, background: c, boxShadow: "inset 0 0 0 1px rgba(22,33,29,0.08)" }} />
              <div style={{ fontSize: MIN, marginTop: 5, color: "rgba(22,33,29,0.6)" }}>{n}</div>
            </div>
          ))}
        </div>
        <MRow label="Display" value="Söhne 600" />
        <MRow label="Body" value="16 / 24" />
        <MRow label="Applications" value="Card · van" />
      </MShell>
    );
  }

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: BRAND.paper,
        padding: "26px 30px",
        display: "grid",
        gridTemplateColumns: "1.15fr 1fr",
        gridTemplateRows: "auto 1fr",
        gap: 22,
        color: BRAND.ink,
        overflow: "hidden",
      }}
    >
      {/* lockup */}
      <div style={{ gridColumn: "1 / -1", display: "flex", alignItems: "center", gap: 18 }}>
        <svg width="46" height="46" viewBox="0 0 48 48" fill="none">
          <motion.path
            d="M8 38 L8 14 L24 24 L40 14 L40 38"
            stroke={BRAND.primary}
            strokeWidth="3.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ pathLength: draw }}
          />
          <motion.circle cx="24" cy="36" r="3.1" fill={accent} style={{ scale: draw }} />
        </svg>
        <div>
          <div
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: 27,
              fontWeight: 600,
              letterSpacing: "0.16em",
              lineHeight: 1,
            }}
          >
            {BRAND.name}
          </div>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              letterSpacing: "0.34em",
              color: "rgba(22,33,29,0.5)",
              marginTop: 6,
            }}
          >
            {BRAND.sub}
          </div>
        </div>
        <span style={{ flex: 1 }} />
        {/* the picker the cursor uses */}
        <div
          style={{
            display: "flex",
            gap: 7,
            padding: 7,
            borderRadius: 10,
            background: "#fff",
            boxShadow: "0 2px 10px rgba(22,33,29,0.10)",
          }}
        >
          {[BRAND.accentA, BRAND.accentB].map((c) => (
            <span
              key={c}
              style={{
                width: 22,
                height: 22,
                borderRadius: 6,
                background: c,
                boxShadow:
                  accent === c
                    ? `0 0 0 2px #fff, 0 0 0 3.5px ${c}`
                    : "inset 0 0 0 1px rgba(22,33,29,0.12)",
              }}
            />
          ))}
        </div>
      </div>

      {/* left column: palette + type */}
      <div style={{ display: "flex", flexDirection: "column", gap: 20, minHeight: 0 }}>
        <Fade opacity={chips}>
          <SectionLabel>Palette</SectionLabel>
          <div style={{ display: "flex", gap: 9 }}>
            {[...PALETTE, ["Accent", accent] as [string, string]].map(([n, c]) => (
              <div key={n} style={{ flex: 1 }}>
                <div
                  style={{
                    height: 46,
                    borderRadius: 7,
                    background: c,
                    boxShadow: "inset 0 0 0 1px rgba(22,33,29,0.08)",
                  }}
                />
                <div style={{ fontSize: 13, fontWeight: 600, marginTop: 6 }}>{n}</div>
                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 11,
                    color: "rgba(22,33,29,0.45)",
                  }}
                >
                  {c.toUpperCase()}
                </div>
              </div>
            ))}
          </div>
        </Fade>

        <Fade opacity={spec}>
          <SectionLabel>Type</SectionLabel>
          <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
            <span style={{ fontSize: 40, fontWeight: 600, letterSpacing: "-0.03em" }}>
              Aa
            </span>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 11 }}>
              Söhne · 600 / 40
            </span>
          </div>
          <div style={{ fontSize: 13, lineHeight: 1.55, color: "rgba(22,33,29,0.72)", marginTop: 8 }}>
            Basement renovations, flooring and tile across Durham Region —
            quoted in person, finished on schedule.
          </div>
          <div style={{ display: "flex", gap: 14, marginTop: 10 }}>
            {["12 / 18", "16 / 24", "22 / 30"].map((s) => (
              <span
                key={s}
                style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "rgba(22,33,29,0.45)" }}
              >
                {s}
              </span>
            ))}
          </div>
        </Fade>

        <Fade opacity={spec}>
          <SectionLabel>Photography</SectionLabel>
          <div style={{ display: "flex", gap: 8 }}>
            {[
              `linear-gradient(135deg, ${BRAND.sand}, #CBB99A)`,
              `linear-gradient(135deg, ${BRAND.primary}, #16211D)`,
              `linear-gradient(135deg, #D9D2C4, #9AA79F)`,
              `linear-gradient(135deg, ${accent}, #7A4420)`,
            ].map((g, i) => (
              <span
                key={i}
                style={{ flex: 1, height: 46, borderRadius: 5, background: g }}
              />
            ))}
          </div>
        </Fade>

        {/* The board used to stop here, leaving the bottom third of the
            window empty cream. Lockups are what a brand board carries
            next, and they fill it with something the beat is about. */}
        <Fade opacity={spec}>
          <SectionLabel>Lockups</SectionLabel>
          <div style={{ display: "flex", gap: 10 }}>
            {[
              { label: "Primary", stacked: false, mark: true },
              { label: "Stacked", stacked: true, mark: true },
              { label: "Mark only", stacked: false, mark: "only" as const },
            ].map((l) => (
              <div
                key={l.label}
                style={{
                  flex: 1,
                  borderRadius: 7,
                  border: "1px solid rgba(22,33,29,0.12)",
                  background: "#fff",
                  padding: "13px 12px 11px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 9,
                  minHeight: 86,
                  justifyContent: "center",
                }}
              >
                <span
                  style={{
                    display: "flex",
                    flexDirection: l.stacked ? "column" : "row",
                    alignItems: "center",
                    gap: l.stacked ? 4 : 7,
                  }}
                >
                  <svg width="17" height="17" viewBox="0 0 48 48" fill="none">
                    <path d="M8 38 L8 14 L24 24 L40 14 L40 38" stroke={accent} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {l.mark !== "only" ? (
                    <span style={{ fontSize: 13, fontWeight: 600, letterSpacing: "0.14em", color: BRAND.ink }}>
                      {BRAND.name}
                    </span>
                  ) : null}
                </span>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "rgba(22,33,29,0.45)" }}>
                  {l.label}
                </span>
              </div>
            ))}
          </div>
        </Fade>
      </div>

      {/* right column: applications */}
      <Fade opacity={apps} style={{ minHeight: 0 }}>
        <SectionLabel>Applications</SectionLabel>

        {/* business card */}
        <div
          style={{
            width: "100%",
            aspectRatio: "1.75 / 1",
            borderRadius: 8,
            background: BRAND.ink,
            color: BRAND.paper,
            padding: 16,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            boxShadow: "0 10px 26px rgba(22,33,29,0.22)",
            marginBottom: 14,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <svg width="17" height="17" viewBox="0 0 48 48" fill="none">
              <path d="M8 38 L8 14 L24 24 L40 14 L40 38" stroke={accent} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span style={{ fontSize: 13, fontWeight: 600, letterSpacing: "0.16em" }}>
              {BRAND.name}
            </span>
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 500 }}>Marcus Delacroix</div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, opacity: 0.6, marginTop: 3 }}>
              (905) 555-0142 · northgate.ca
            </div>
          </div>
        </div>

        {/* van decal */}
        <div
          style={{
            position: "relative",
            height: 92,
            borderRadius: 8,
            background: "#fff",
            boxShadow: "inset 0 0 0 1px rgba(22,33,29,0.1)",
            overflow: "hidden",
          }}
        >
          <svg viewBox="0 0 320 92" style={{ width: "100%", height: "100%", display: "block" }}>
            <path d="M18 66 L18 34 Q18 28 25 28 L176 28 L206 46 L288 46 Q296 46 296 54 L296 66 Z" fill={BRAND.primary} />
            <path d="M180 32 L200 45 L180 45 Z" fill="rgba(255,255,255,0.22)" />
            <circle cx="72" cy="68" r="11" fill="#22282A" />
            <circle cx="72" cy="68" r="4.4" fill="#8D9A96" />
            <circle cx="252" cy="68" r="11" fill="#22282A" />
            <circle cx="252" cy="68" r="4.4" fill="#8D9A96" />
            <text x="52" y="50" fill="#fff" fontSize="15" fontWeight="600" letterSpacing="3.4" fontFamily="var(--font-sans)">
              {BRAND.name}
            </text>
            <rect x="52" y="55" width="86" height="3" rx="1.5" fill={accent} />
          </svg>
        </div>
      </Fade>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontFamily: "var(--font-mono)",
        fontSize: 11,
        letterSpacing: "0.22em",
        textTransform: "uppercase",
        color: "rgba(22,33,29,0.42)",
        marginBottom: 9,
      }}
    >
      {children}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   B2 · Local-business website
   ═══════════════════════════════════════════════════════════════ */

const SERVICES_GRID = [
  ["Basement finishing", "Framing to final coat"],
  ["Flooring", "Hardwood, vinyl, tile"],
  ["Kitchens", "Cabinets and counters"],
  ["Bathrooms", "Full gut and refit"],
  ["Painting", "Interior and exterior"],
  ["Tiling", "Floors, walls, backsplash"],
];

const REVIEWS = [
  ["Priya R.", "Whitby", "Quoted Tuesday, started the next Monday. The basement is unrecognisable."],
  ["Dan M.", "Ajax", "Clean crew, no surprises on the invoice. Would hire again."],
];

export function ScreenLocalSite({ local, compact }: ScreenProps) {
  const [postal, setPostal] = useState("");
  const [toast, setToast] = useState(false);
  useMotionValueEvent(local, "change", function type(t) {
    const target = "L1N 8K4";
    const typed = at(t, 0.4, 0.55);
    setPostal(target.slice(0, Math.round(typed * target.length)));
    setToast(t > 0.645 && t < 0.93);
  });

  // the page scrolls inside its own window
  const pageY = useTransform(local, (t) => -at(t, 0.62, 0.98) * 300);


  if (compact) {
    return (
      <MShell bg="#fff">
        <div style={{ height: 34, borderRadius: 6, background: BRAND.ink, display: "flex", alignItems: "center", padding: "0 11px", marginBottom: 13 }}>
          <span style={{ fontSize: MIN + 1, fontWeight: 600, letterSpacing: "0.1em", color: "#fff" }}>{BRAND.name}</span>
        </div>
        <div style={{ fontSize: 17, fontWeight: 600, lineHeight: 1.2, color: BRAND.ink, marginBottom: 8 }}>
          Basement renovations across Durham Region.
        </div>
        <div style={{ fontSize: MIN + 1, color: "rgba(22,33,29,0.62)", marginBottom: 13 }}>
          4.9★ · 212 reviews · Licensed &amp; insured
        </div>
        <div style={{ background: "#FAF8F4", border: "1px solid rgba(22,33,29,0.12)", borderRadius: 9, padding: 12, marginBottom: 12 }}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8, color: BRAND.ink }}>Get a free quote</div>
          <div style={{ height: 30, borderRadius: 6, border: "1px solid rgba(22,33,29,0.16)", background: "#fff", display: "flex", alignItems: "center", padding: "0 10px", fontSize: MIN + 1, color: "rgba(22,33,29,0.75)", marginBottom: 8 }}>
            {postal || "Postal code"}
          </div>
          <div style={{ height: 32, borderRadius: 6, background: BRAND.primary, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: MIN + 1, fontWeight: 600 }}>
            {toast ? "Sent ✓" : "Get a quote"}
          </div>
        </div>
        {SERVICES_GRID.slice(0, 3).map(([t, d]) => <MRow key={t} label={t} value={d} />)}
      </MShell>
    );
  }

  return (
    <div style={{ position: "absolute", inset: 0, background: "#fff", overflow: "hidden" }}>
      <motion.div style={{ y: pageY }}>
        {/* nav */}
        <div
          style={{
            height: 46,
            display: "flex",
            alignItems: "center",
            gap: 20,
            padding: "0 24px",
            borderBottom: "1px solid rgba(22,33,29,0.08)",
          }}
        >
          <span style={{ display: "flex", alignItems: "center", gap: 7 }}>
            <svg width="16" height="16" viewBox="0 0 48 48" fill="none">
              <path d="M8 38 L8 14 L24 24 L40 14 L40 38" stroke={BRAND.primary} strokeWidth="4.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span style={{ fontSize: 13, fontWeight: 600, letterSpacing: "0.14em", color: BRAND.ink }}>
              {BRAND.name}
            </span>
          </span>
          {["Services", "Gallery", "About", "Reviews"].map((l) => (
            <span key={l} style={{ fontSize: 13, color: "rgba(22,33,29,0.66)" }}>
              {l}
            </span>
          ))}
          <span style={{ flex: 1 }} />
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 600, color: BRAND.primary }}>
            (905) 555-0142
          </span>
        </div>

        {/* hero + booking */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.25fr 1fr",
            gap: 26,
            padding: "26px 24px 22px",
            background: `linear-gradient(160deg, ${BRAND.sand}, #fff 70%)`,
          }}
        >
          <div>
            <div style={{ fontSize: 30, fontWeight: 600, lineHeight: 1.1, letterSpacing: "-0.025em", color: BRAND.ink }}>
              Basement renovations
              <br />
              across Durham Region.
            </div>
            <div style={{ fontSize: 13, lineHeight: 1.55, color: "rgba(22,33,29,0.66)", marginTop: 12, maxWidth: 300 }}>
              Licensed, insured and finishing on schedule since 2009. Free
              on-site estimate, usually within three days.
            </div>
            <div style={{ display: "flex", gap: 18, marginTop: 16 }}>
              {[["4.9★", "212 reviews"], ["17 yrs", "in business"], ["Licensed", "& insured"]].map(([a, b]) => (
                <div key={a}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: BRAND.ink }}>{a}</div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "rgba(22,33,29,0.5)" }}>{b}</div>
                </div>
              ))}
            </div>
          </div>

          {/* booking widget — the thing the cursor uses */}
          <div
            style={{
              background: "#fff",
              borderRadius: 10,
              padding: 16,
              boxShadow: "0 10px 30px rgba(22,33,29,0.12)",
            }}
          >
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12, color: BRAND.ink }}>
              Get a free quote
            </div>
            <Field label="Service">Basement finishing ▾</Field>
            <Field label="Postal code">
              <span>
                {postal}
                <span style={{ opacity: postal.length < 7 ? 1 : 0, color: BRAND.primary }}>|</span>
              </span>
            </Field>
            <div
              style={{
                marginTop: 12,
                height: 34,
                borderRadius: 7,
                background: BRAND.primary,
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              Get a quote
            </div>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                color: "rgba(22,33,29,0.42)",
                textAlign: "center",
                marginTop: 8,
              }}
            >
              No obligation · Reply within 1 business day
            </div>
          </div>
        </div>

        {/* services grid */}
        <div style={{ padding: "20px 24px" }}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12, color: BRAND.ink }}>
            What we do
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
            {SERVICES_GRID.map(([t, d]) => (
              <div
                key={t}
                style={{
                  border: "1px solid rgba(22,33,29,0.1)",
                  borderRadius: 8,
                  padding: 11,
                }}
              >
                <span
                  style={{
                    display: "flex",
                    width: 22,
                    height: 22,
                    borderRadius: 6,
                    background: BRAND.sand,
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 8,
                  }}
                >
                  <svg width="11" height="11" viewBox="0 0 16 16" fill="none">
                    <path d="M2 13 L9 6 M6 3 L13 10" stroke={BRAND.primary} strokeWidth="1.8" strokeLinecap="round" />
                  </svg>
                </span>
                <div style={{ fontSize: 13, fontWeight: 600, color: BRAND.ink }}>{t}</div>
                <div style={{ fontSize: 13, color: "rgba(22,33,29,0.55)", marginTop: 3 }}>{d}</div>
              </div>
            ))}
          </div>
        </div>

        {/* before / after */}
        <div style={{ padding: "6px 24px 20px" }}>
          <div style={{ display: "flex", gap: 10 }}>
            {[["Before", "#B9B2A6", "#8E877C"], ["After", BRAND.sand, "#C9B593"]].map(([l, a, b]) => (
              <div key={l} style={{ flex: 1 }}>
                <div
                  style={{
                    height: 78,
                    borderRadius: 8,
                    background: `linear-gradient(170deg, ${a}, ${b})`,
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  <span style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 22, background: "rgba(22,33,29,0.18)" }} />
                  <span style={{ position: "absolute", left: "14%", bottom: 22, width: "26%", height: 30, background: "rgba(255,255,255,0.25)", borderRadius: 3 }} />
                </div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, marginTop: 5, color: "rgba(22,33,29,0.5)" }}>
                  {l}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* reviews */}
        <div style={{ padding: "0 24px 22px", display: "flex", gap: 10 }}>
          {REVIEWS.map(([n, city, body]) => (
            <div
              key={n}
              style={{
                flex: 1,
                background: "#FAF8F4",
                borderRadius: 8,
                padding: 12,
              }}
            >
              <div style={{ fontSize: 13, color: BRAND.accentA, letterSpacing: 1 }}>★★★★★</div>
              <div style={{ fontSize: 13, lineHeight: 1.5, color: "rgba(22,33,29,0.75)", margin: "6px 0 8px" }}>
                "{body}"
              </div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "rgba(22,33,29,0.48)" }}>
                {n} · {city}
              </div>
            </div>
          ))}
        </div>

        {/* footer */}
        <div style={{ background: BRAND.ink, color: "rgba(251,249,244,0.66)", padding: "16px 24px", fontSize: 13 }}>
          © 2026 {BRAND.name} Home Services · Ajax · Pickering · Whitby · Oshawa
        </div>
      </motion.div>

      {/* success toast */}
      <motion.div
        animate={{ opacity: toast ? 1 : 0, y: toast ? 0 : 10 }}
        transition={{ duration: 0.28 }}
        style={{
          position: "absolute",
          right: 18,
          bottom: 18,
          background: BRAND.ink,
          color: "#fff",
          borderRadius: 9,
          padding: "11px 15px",
          display: "flex",
          alignItems: "center",
          gap: 10,
          boxShadow: "0 12px 28px rgba(22,33,29,0.3)",
          zIndex: 20,
        }}
      >
        <span
          style={{
            width: 18,
            height: 18,
            borderRadius: "50%",
            background: "#3FA06B",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
            <path d="M2.5 6.4 L4.8 8.6 L9.5 3.6" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <span style={{ fontSize: 13 }}>
          Quote request sent — we'll call within 1 business day.
        </span>
      </motion.div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 9 }}>
      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 11,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: "rgba(22,33,29,0.45)",
          marginBottom: 4,
        }}
      >
        {label}
      </div>
      <div
        style={{
          height: 30,
          borderRadius: 6,
          border: "1px solid rgba(22,33,29,0.16)",
          background: "#FCFBF8",
          display: "flex",
          alignItems: "center",
          padding: "0 10px",
          fontSize: 13,
          color: "rgba(22,33,29,0.8)",
        }}
      >
        {children}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   B3 · Dark analytics dashboard
   ═══════════════════════════════════════════════════════════════ */

const KPI_7D = [
  ["Jobs booked", "38", "+12%"],
  ["Quote → job", "41%", "+4pt"],
  ["Avg. ticket", "6,420", "+3%"],
  ["Crew utilisation", "78%", "−2pt"],
];
const KPI_30D = [
  ["Jobs booked", "164", "+22%"],
  ["Quote → job", "46%", "+7pt"],
  ["Avg. ticket", "7,180", "+9%"],
  ["Crew utilisation", "86%", "+6pt"],
];

/** A jobs board has a board's worth of rows; five left the table ending
 *  ~190px above the bottom of the window. */
const JOBS = [
  ["Basement — Ravenscroft Rd", "Crew A", "In progress", "8,400"],
  ["Flooring — Kingston Rd E", "Crew B", "Scheduled", "3,150"],
  ["Bathroom — Harwood Ave", "Crew A", "Quoted", "11,900"],
  ["Kitchen — Rossland Rd W", "Crew C", "Complete", "22,600"],
  ["Tiling — Brock St N", "Crew B", "In progress", "2,480"],
  ["Deck rebuild — Simcoe St N", "Crew C", "Scheduled", "6,900"],
  ["Basement — Taunton Rd W", "Crew A", "Quoted", "14,250"],
  ["Flooring — Brock St S", "Crew B", "Complete", "4,180"],
];

const STATUS_TINT: Record<string, [string, string]> = {
  "In progress": ["rgba(90,160,255,0.16)", "#8FBEFF"],
  Scheduled: ["rgba(200,170,90,0.16)", "#E0C070"],
  Quoted: ["rgba(255,255,255,0.08)", "rgba(237,231,218,0.7)"],
  Complete: ["rgba(90,200,140,0.16)", "#7FD3A3"],
};

export function ScreenAnalytics({ local, compact }: ScreenProps) {
  const [range, setRange] = useState<"7d" | "30d">("7d");
  const [notif, setNotif] = useState(false);
  useMotionValueEvent(local, "change", function drive(t) {
    setRange(t > 0.5 ? "30d" : "7d");
    setNotif(t > 0.72 && t < 0.95);
  });
  const kpis = range === "30d" ? KPI_30D : KPI_7D;
  const chartDraw = useTransform(local, (t) => at(t, 0.1, 0.38));


  if (compact) {
    return (
      <div style={{ position: "absolute", inset: 0, background: "#101215", padding: 16, overflow: "hidden", color: "#EDE7DA" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 13 }}>
          <span style={{ fontSize: 13, fontWeight: 600, flex: 1 }}>Operations</span>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: MIN, background: "rgba(255,255,255,0.1)", borderRadius: 6, padding: "3px 9px" }}>{range}</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 9, marginBottom: 13 }}>
          {kpis.map(([label, value, delta]) => (
            <div key={label} style={{ background: "rgba(255,255,255,0.05)", borderRadius: 9, padding: 11 }}>
              <div style={{ fontSize: MIN, color: "rgba(237,231,218,0.55)" }}>{label}</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginTop: 4 }}>
                <span style={{ fontSize: 19, fontWeight: 600 }}>{value}</span>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: MIN, color: delta.startsWith("−") ? "#E08C7F" : "#7FD3A3" }}>{delta}</span>
              </div>
            </div>
          ))}
        </div>
        {JOBS.slice(0, 3).map(([job, , status]) => (
          <div key={job} style={{ display: "flex", alignItems: "center", gap: 9, padding: "9px 0", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
            <span style={{ flex: 1, fontSize: 13, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{job}</span>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: MIN, background: STATUS_TINT[status][0], color: STATUS_TINT[status][1], borderRadius: 999, padding: "2px 8px" }}>{status}</span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: "#101215",
        display: "flex",
        color: "#EDE7DA",
        overflow: "hidden",
      }}
    >
      {/* sidebar */}
      <div
        style={{
          width: 54,
          flex: "0 0 54px",
          borderRight: "1px solid rgba(255,255,255,0.07)",
          padding: "16px 0",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 16,
          background: "#0C0E11",
        }}
      >
        <span style={{ width: 20, height: 20, borderRadius: 6, background: "#3FA06B" }} />
        {[0, 1, 2, 3, 4].map((i) => (
          <span
            key={i}
            style={{
              width: 18,
              height: 18,
              borderRadius: 5,
              background: i === 1 ? "rgba(255,255,255,0.14)" : "transparent",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="11" height="11" viewBox="0 0 16 16" fill="none">
              <rect x="2" y={i === 1 ? 2 : 3} width="12" height={i === 1 ? 12 : 10} rx="2.5" stroke={i === 1 ? "#EDE7DA" : "rgba(237,231,218,0.35)"} strokeWidth="1.4" />
            </svg>
          </span>
        ))}
      </div>

      <div style={{ flex: 1, minWidth: 0, padding: "16px 20px", display: "flex", flexDirection: "column", gap: 13 }}>
        {/* header */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div>
            <div style={{ fontSize: 13.5, fontWeight: 600 }}>Operations</div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "rgba(237,231,218,0.42)", marginTop: 2 }}>
              Ajax · Pickering · Whitby
            </div>
          </div>
          <span style={{ flex: 1 }} />
          {/* date range — the control the cursor clicks */}
          <div style={{ display: "flex", background: "rgba(255,255,255,0.06)", borderRadius: 7, padding: 3 }}>
            {(["7d", "30d"] as const).map((r) => (
              <span
                key={r}
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                  padding: "5px 12px",
                  borderRadius: 5,
                  background: range === r ? "rgba(255,255,255,0.14)" : "transparent",
                  color: range === r ? "#EDE7DA" : "rgba(237,231,218,0.45)",
                  transition: "background 220ms ease, color 220ms ease",
                }}
              >
                {r}
              </span>
            ))}
          </div>
          <span
            style={{
              width: 26,
              height: 26,
              borderRadius: 7,
              background: "rgba(255,255,255,0.06)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
            }}
          >
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
              <path d="M4 6.5a4 4 0 118 0c0 3 1 4 1 4H3s1-1 1-4z" stroke="rgba(237,231,218,0.7)" strokeWidth="1.3" strokeLinejoin="round" />
            </svg>
            <span style={{ position: "absolute", top: 4, right: 4, width: 5, height: 5, borderRadius: "50%", background: "#F05C4B" }} />
          </span>
        </div>

        {/* KPI row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0,1fr))", gap: 10 }}>
          {kpis.map(([label, value, delta]) => (
            <div
              key={label}
              style={{
                background: "rgba(255,255,255,0.035)",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: 9,
                padding: "10px 11px",
              }}
            >
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(237,231,218,0.42)" }}>
                {label}
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 7, marginTop: 6 }}>
                <span style={{ fontSize: 19, fontWeight: 600, letterSpacing: "-0.02em" }}>{value}</span>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: delta.startsWith("−") ? "#E08C7F" : "#7FD3A3" }}>
                  {delta}
                </span>
              </div>
              <svg viewBox="0 0 80 18" style={{ width: "100%", height: 16, marginTop: 6, display: "block" }}>
                <path
                  d={range === "30d" ? "M2 14 L14 11 L26 12 L38 6 L50 8 L62 4 L78 2" : "M2 12 L14 13 L26 8 L38 10 L50 6 L62 9 L78 5"}
                  fill="none"
                  stroke="rgba(127,211,163,0.8)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          ))}
        </div>

        {/* area chart */}
        <div
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 9,
            padding: "10px 12px 4px",
            flex: "0 0 auto",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <span style={{ fontSize: 13, fontWeight: 500 }}>Revenue booked</span>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "rgba(237,231,218,0.4)" }}>
              {range === "30d" ? "last 30 days" : "last 7 days"}
            </span>
          </div>
          <svg viewBox="0 0 400 96" preserveAspectRatio="none" style={{ width: "100%", height: 92, display: "block" }}>
            <defs>
              <linearGradient id="bwfill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3FA06B" stopOpacity="0.34" />
                <stop offset="100%" stopColor="#3FA06B" stopOpacity="0" />
              </linearGradient>
            </defs>
            {[20, 44, 68].map((y) => (
              <line key={y} x1="0" y1={y} x2="400" y2={y} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
            ))}
            <motion.path
              d={
                range === "30d"
                  ? "M4 74 C 60 66, 92 40, 140 46 S 226 64, 268 34 S 342 14, 396 10 L396 92 L4 92 Z"
                  : "M4 80 C 60 74, 92 56, 140 60 S 226 72, 268 50 S 342 34, 396 28 L396 92 L4 92 Z"
              }
              fill="url(#bwfill)"
              style={{ opacity: chartDraw }}
            />
            <motion.path
              d={
                range === "30d"
                  ? "M4 74 C 60 66, 92 40, 140 46 S 226 64, 268 34 S 342 14, 396 10"
                  : "M4 80 C 60 74, 92 56, 140 60 S 226 72, 268 50 S 342 34, 396 28"
              }
              fill="none"
              stroke="#3FA06B"
              strokeWidth="2"
              strokeLinecap="round"
              style={{ pathLength: chartDraw }}
            />
          </svg>
        </div>

        {/* table */}
        <div style={{ flex: 1, minHeight: 0, overflow: "hidden" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "2.2fr 0.8fr 1fr 0.8fr",
              gap: 8,
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "rgba(237,231,218,0.36)",
              paddingBottom: 7,
              borderBottom: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            <span>Job ↓</span>
            <span>Crew</span>
            <span>Status</span>
            <span style={{ textAlign: "right" }}>Revenue</span>
          </div>
          {JOBS.map(([job, crew, status, rev]) => {
            const [bg, fg] = STATUS_TINT[status];
            return (
              <div
                key={job}
                style={{
                  display: "grid",
                  gridTemplateColumns: "2.2fr 0.8fr 1fr 0.8fr",
                  gap: 8,
                  alignItems: "center",
                  padding: "7px 0",
                  borderBottom: "1px solid rgba(255,255,255,0.04)",
                  fontSize: 13,
                }}
              >
                <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{job}</span>
                <span style={{ color: "rgba(237,231,218,0.6)", fontFamily: "var(--font-mono)", fontSize: 11 }}>{crew}</span>
                <span>
                  <span style={{ background: bg, color: fg, borderRadius: 999, padding: "2.5px 8px", fontSize: 11, fontFamily: "var(--font-mono)" }}>
                    {status}
                  </span>
                </span>
                <span style={{ textAlign: "right", fontFamily: "var(--font-mono)", fontSize: 11 }}>{rev}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* notifications popover */}
      <motion.div
        animate={{ opacity: notif ? 1 : 0, y: notif ? 0 : -8 }}
        transition={{ duration: 0.26 }}
        style={{
          position: "absolute",
          right: 16,
          top: 52,
          width: 212,
          background: "#1A1D21",
          border: "1px solid rgba(255,255,255,0.09)",
          borderRadius: 10,
          padding: 11,
          boxShadow: "0 18px 40px rgba(0,0,0,0.5)",
          zIndex: 22,
        }}
      >
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(237,231,218,0.4)", marginBottom: 8 }}>
          Notifications
        </div>
        {[["New quote request", "Ravenscroft Rd · 2m"], ["Crew B checked in", "Kingston Rd E · 18m"]].map(([a, b]) => (
          <div key={a} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#3FA06B", marginTop: 4 }} />
            <span>
              <span style={{ display: "block", fontSize: 13 }}>{a}</span>
              <span style={{ display: "block", fontFamily: "var(--font-mono)", fontSize: 11, color: "rgba(237,231,218,0.42)" }}>{b}</span>
            </span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   B4 · Component library
   ═══════════════════════════════════════════════════════════════ */

const TREE = [
  ["Foundations", ["Colour", "Type", "Spacing", "Radius"]],
  ["Components", ["Button", "Input", "Card", "Badge", "Table"]],
] as const;

export function ScreenLibrary({ local, compact }: ScreenProps) {
  const [dark, setDark] = useState(false);
  useMotionValueEvent(local, "change", function toggle(t) {
    setDark(t > 0.56);
  });

  const bg = dark ? "#16181C" : "#FFFFFF";
  const panel = dark ? "#1D2025" : "#F7F5F0";
  const ink = dark ? "#EDE7DA" : "#1B1F1D";
  const muted = dark ? "rgba(237,231,218,0.5)" : "rgba(27,31,29,0.52)";
  const line = dark ? "rgba(255,255,255,0.09)" : "rgba(27,31,29,0.1)";


  if (compact) {
    return (
      <div style={{ position: "absolute", inset: 0, background: dark ? "#16181C" : "#fff", color: dark ? "#EDE7DA" : "#1B1F1D", padding: 16, overflow: "hidden", transition: "background 320ms ease, color 320ms ease" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 14 }}>
          <span style={{ fontSize: 13, fontWeight: 600, flex: 1 }}>Button</span>
          <span style={{ fontSize: MIN, color: dark ? "rgba(237,231,218,0.5)" : "rgba(27,31,29,0.52)" }}>Dark mode</span>
          <span style={{ width: 32, height: 18, borderRadius: 999, background: dark ? "#3FA06B" : "rgba(27,31,29,0.18)", position: "relative", transition: "background 260ms ease" }}>
            <span style={{ position: "absolute", top: 2, left: dark ? 16 : 2, width: 14, height: 14, borderRadius: "50%", background: "#fff", transition: "left 260ms cubic-bezier(0.25,1,0.5,1)" }} />
          </span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 14 }}>
          {(["Primary", "Secondary", "Ghost", "Danger"] as const).map((v) => (
            <span key={v} style={{ height: 32, borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center", fontSize: MIN + 1, fontWeight: 500,
              background: v === "Primary" ? "#1F5D4C" : v === "Danger" ? "#B4432F" : v === "Secondary" ? (dark ? "rgba(255,255,255,0.09)" : "#EFEBE1") : "transparent",
              color: v === "Primary" || v === "Danger" ? "#fff" : dark ? "#EDE7DA" : "#1B1F1D",
              border: v === "Ghost" ? `1px solid ${dark ? "rgba(255,255,255,0.18)" : "rgba(27,31,29,0.16)"}` : "none" }}>
              {v}
            </span>
          ))}
        </div>
        {[["color/primary", "#1F5D4C"], ["space/3", "12px"], ["radius/md", "8px"]].map(([k, v]) => (
          <div key={k} style={{ display: "flex", justifyContent: "space-between", fontFamily: "var(--font-mono)", fontSize: MIN, padding: "7px 0", borderTop: `1px solid ${dark ? "rgba(255,255,255,0.09)" : "rgba(27,31,29,0.1)"}`, color: dark ? "rgba(237,231,218,0.5)" : "rgba(27,31,29,0.52)" }}>
            <span>{k}</span><span style={{ color: dark ? "#EDE7DA" : "#1B1F1D" }}>{v}</span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        background: bg,
        color: ink,
        transition: "background 320ms ease, color 320ms ease",
        overflow: "hidden",
      }}
    >
      {/* tree */}
      <div style={{ width: 128, flex: "0 0 128px", borderRight: `1px solid ${line}`, padding: "14px 12px", background: panel, transition: "background 320ms ease" }}>
        {TREE.map(([group, items]) => (
          <div key={group} style={{ marginBottom: 14 }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", color: muted, marginBottom: 7 }}>
              {group}
            </div>
            {items.map((it) => (
              <div
                key={it}
                style={{
                  fontSize: 13,
                  padding: "4px 7px",
                  borderRadius: 5,
                  marginBottom: 1,
                  background: it === "Button" ? (dark ? "rgba(255,255,255,0.1)" : "rgba(27,31,29,0.07)") : "transparent",
                  fontWeight: it === "Button" ? 600 : 400,
                }}
              >
                {it}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* canvas */}
      <div style={{ flex: 1, minWidth: 0, padding: "14px 18px", display: "flex", flexDirection: "column", gap: 12, overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 13, fontWeight: 600 }}>Button</span>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: muted }}>4 variants · 4 states</span>
          <span style={{ flex: 1 }} />
          {/* the toggle the cursor flips */}
          <span style={{ display: "flex", alignItems: "center", gap: 7 }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: muted }}>Dark mode</span>
            <span
              style={{
                width: 32,
                height: 18,
                borderRadius: 999,
                background: dark ? "#3FA06B" : "rgba(27,31,29,0.18)",
                position: "relative",
                transition: "background 260ms ease",
              }}
            >
              <span
                style={{
                  position: "absolute",
                  top: 2,
                  left: dark ? 16 : 2,
                  width: 14,
                  height: 14,
                  borderRadius: "50%",
                  background: "#fff",
                  transition: "left 260ms cubic-bezier(0.25,1,0.5,1)",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
                }}
              />
            </span>
          </span>
        </div>

        {/* variant × state matrix */}
        <div style={{ display: "grid", gridTemplateColumns: "58px repeat(4, minmax(0,1fr))", gap: 8, alignItems: "center" }}>
          <span />
          {["Default", "Hover", "Active", "Disabled"].map((s) => (
            <span key={s} style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: muted }}>
              {s}
            </span>
          ))}
          {(["Primary", "Secondary", "Ghost", "Danger"] as const).map((v) => (
            <VariantRow key={v} variant={v} dark={dark} muted={muted} line={line} />
          ))}
        </div>

        {/* lower panels */}
        <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 12, flex: 1, minHeight: 0 }}>
          <div style={{ border: `1px solid ${line}`, borderRadius: 8, padding: 11, minHeight: 0 }}>
            <PanelLabel muted={muted}>Input</PanelLabel>
            {[
              ["Empty", line, ""],
              ["Focus", "#3FA06B", "L1N 8K4"],
              ["Error", "#E0705F", "L1N"],
              ["Filled", line, "L1J 2K8"],
              ["Disabled", line, "—"],
            ].map(([state, colour, val]) => (
              <div key={state} style={{ marginBottom: 7 }}>
                <div
                  style={{
                    height: 26,
                    borderRadius: 6,
                    border: `1.5px solid ${colour}`,
                    display: "flex",
                    alignItems: "center",
                    padding: "0 9px",
                    fontSize: 13,
                    color: val ? ink : muted,
                    background: dark ? "rgba(255,255,255,0.03)" : "#fff",
                  }}
                >
                  {val || "Postal code"}
                </div>
                {state === "Error" ? (
                  <div style={{ fontSize: 11.5, color: "#E0705F", marginTop: 3 }}>Enter a full postal code</div>
                ) : null}
              </div>
            ))}

            {/* the rest of the form kit, so the panel is not three boxes
                over 350px of dark */}
            <div style={{ marginTop: 12, paddingTop: 11, borderTop: `1px solid ${line}` }}>
              <div style={{ display: "flex", gap: 9, marginBottom: 9 }}>
                {["Select a service", "▾"].map((t, i) => (
                  <span
                    key={t}
                    style={{
                      flex: i === 0 ? 1 : "0 0 30px", height: 26, borderRadius: 6,
                      border: `1.5px solid ${line}`, display: "flex", alignItems: "center",
                      justifyContent: i === 0 ? "flex-start" : "center", padding: "0 9px",
                      fontSize: 13, color: muted,
                      background: dark ? "rgba(255,255,255,0.03)" : "#fff",
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>
              <div
                style={{
                  height: 54, borderRadius: 6, border: `1.5px solid ${line}`,
                  padding: "7px 9px", fontSize: 13, color: muted,
                  background: dark ? "rgba(255,255,255,0.03)" : "#fff",
                }}
              >
                Tell us about the job
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 9, marginTop: 10, fontSize: 13, color: ink }}>
                <span style={{ width: 15, height: 15, borderRadius: 4, background: "#3FA06B", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "#fff" }}>✓</span>
                Send me the estimate by email
              </div>
            </div>
          </div>

          <div style={{ border: `1px solid ${line}`, borderRadius: 8, padding: 11, minHeight: 0, overflow: "hidden" }}>
            <PanelLabel muted={muted}>Tokens</PanelLabel>
            {[
              ["color/primary", "#1F5D4C"],
              ["color/accent", "#C8763C"],
              ["color/ink", "#16211D"],
              ["color/paper", "#EFE7D8"],
              ["space/2", "8px"],
              ["space/3", "12px"],
              ["space/5", "24px"],
              ["radius/sm", "4px"],
              ["radius/md", "8px"],
              ["text/body", "14 / 22"],
              ["text/h3", "20 / 26"],
              ["shadow/card", "0 8 24 / 10%"],
            ].map(([k, v]) => (
              <div
                key={k}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                  padding: "4.5px 0",
                  borderBottom: `1px solid ${line}`,
                  color: muted,
                }}
              >
                <span>{k}</span>
                <span style={{ color: ink }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function PanelLabel({ children, muted }: { children: React.ReactNode; muted: string }) {
  return (
    <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", color: muted, marginBottom: 8 }}>
      {children}
    </div>
  );
}

function VariantRow({
  variant,
  dark,
  muted,
  line,
}: {
  variant: "Primary" | "Secondary" | "Ghost" | "Danger";
  dark: boolean;
  muted: string;
  line: string;
}) {
  const base: Record<string, { bg: string; fg: string; border: string }> = {
    Primary: { bg: "#1F5D4C", fg: "#fff", border: "transparent" },
    Secondary: { bg: dark ? "rgba(255,255,255,0.09)" : "#EFEBE1", fg: dark ? "#EDE7DA" : "#1B1F1D", border: "transparent" },
    Ghost: { bg: "transparent", fg: dark ? "#EDE7DA" : "#1B1F1D", border: line },
    Danger: { bg: "#B4432F", fg: "#fff", border: "transparent" },
  };
  const s = base[variant];
  const states = [1, 0.86, 0.72, 0.32];

  return (
    <>
      <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: muted }}>{variant}</span>
      {states.map((o, i) => (
        <span
          key={i}
          style={{
            height: 26,
            borderRadius: 6,
            background: s.bg,
            color: s.fg,
            border: `1px solid ${s.border}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 13,
            fontWeight: 500,
            opacity: o,
            transform: i === 2 ? "scale(0.97)" : "none",
            transition: "background 320ms ease, color 320ms ease",
          }}
        >
          Book
        </span>
      ))}
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════
   B5 · Release / performance
   ═══════════════════════════════════════════════════════════════ */

const CHANGELOG: Array<[string, string, string, string]> = [
  ["v1.3", "12 Mar", "Booking widget on every service page", "feature"],
  ["v1.2", "26 Feb", "Compressed gallery images, lazy below the fold", "perf"],
  ["v1.1", "09 Feb", "Added Whitby and Oshawa service areas", "content"],
  ["v1.0.4", "02 Feb", "Fixed quote form validation on iOS Safari", "fix"],
  ["v1.0.3", "28 Jan", "Schema markup for local business + reviews", "seo"],
  ["v1.0.2", "26 Jan", "Phone number click-to-call on mobile", "fix"],
  ["v1.0.1", "24 Jan", "Swapped hero image, trimmed 340 KB", "perf"],
  ["v1.0", "22 Jan", "Launch", "release"],
];

const TAG_TINT: Record<string, [string, string]> = {
  feature: ["rgba(31,93,76,0.12)", "#1F5D4C"],
  perf: ["rgba(62,124,166,0.14)", "#31627F"],
  content: ["rgba(200,118,60,0.14)", "#9A5526"],
  fix: ["rgba(27,31,29,0.08)", "rgba(27,31,29,0.6)"],
  seo: ["rgba(111,125,120,0.16)", "#55635E"],
  release: ["rgba(63,160,107,0.16)", "#2E7A50"],
};

/** Deploys per week — the small history chart under the vitals. */
const DEPLOYS = [2, 4, 3, 6, 5, 8, 6, 9, 7, 11];

const VITALS: Array<[string, string, string]> = [
  ["LCP", "1.4 s", "Good"],
  ["INP", "84 ms", "Good"],
  ["CLS", "0.02", "Good"],
];

export function ScreenRelease({ local, compact }: ScreenProps) {
  const [published, setPublished] = useState(false);
  useMotionValueEvent(local, "change", function publish(t) {
    setPublished(t > 0.48);
  });

  const scoreT = useTransform(local, (t) => at(t, 0.5, 0.82));
  const [score, setScore] = useState(72);
  useMotionValueEvent(scoreT, "change", function count(v) {
    setScore(Math.round(72 + (98 - 72) * v));
  });
  const ringLen = useTransform(scoreT, (v) => 0.72 + (0.98 - 0.72) * v);
  const entries = useTransform(local, (t) => at(t, 0.08, 0.36));


  if (compact) {
    return (
      <MShell bg="#F7F6F2">
        <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 13 }}>
          <span style={{ fontSize: 13, fontWeight: 600, flex: 1 }}>Releases</span>
          <span style={{ fontSize: MIN, fontWeight: 600, color: "#fff", background: published ? "#3FA06B" : "#1F5D4C", borderRadius: 7, padding: "5px 11px" }}>
            {published ? "Published ✓" : "Publish v1.3"}
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 13, background: "#fff", border: "1px solid rgba(27,31,29,0.09)", borderRadius: 10, padding: 13, marginBottom: 13 }}>
          <span style={{ width: 52, height: 52, borderRadius: "50%", border: "6px solid #3FA06B", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, fontWeight: 600, flex: "0 0 52px" }}>
            {score}
          </span>
          <span>
            <span style={{ display: "block", fontSize: 13, fontWeight: 600 }}>Performance</span>
            <span style={{ display: "block", fontSize: MIN, color: "rgba(27,31,29,0.58)", marginTop: 2 }}>Mobile, after each deploy</span>
          </span>
        </div>
        {CHANGELOG.slice(0, 4).map(([v, date, note]) => (
          <MRow key={v} label={note} value={`${v} · ${date}`} />
        ))}
      </MShell>
    );
  }

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: "#F7F6F2",
        display: "grid",
        gridTemplateColumns: "1.15fr 1fr",
        gap: 16,
        padding: "18px 20px",
        color: "#1B1F1D",
        overflow: "hidden",
      }}
    >
      {/* changelog */}
      <div style={{ display: "flex", flexDirection: "column", minHeight: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 12 }}>
          <span style={{ fontSize: 13, fontWeight: 600 }}>Releases</span>
          <span style={{ flex: 1 }} />
          <span
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: "#fff",
              background: published ? "#3FA06B" : "#1F5D4C",
              borderRadius: 7,
              padding: "6px 13px",
              transition: "background 260ms ease",
            }}
          >
            {published ? "Published ✓" : "Publish v1.3"}
          </span>
        </div>

        <Fade opacity={entries} style={{ flex: 1, minHeight: 0 }}>
          {CHANGELOG.map(([v, date, note, tag], i) => {
            const [tbg, tfg] = TAG_TINT[tag];
            return (
              <div
                key={v}
                style={{
                  display: "flex",
                  gap: 11,
                  alignItems: "flex-start",
                  padding: "7px 0",
                  borderTop: i === 0 ? "none" : "1px solid rgba(27,31,29,0.07)",
                  opacity: i === 0 && !published ? 0.42 : 1,
                  transition: "opacity 300ms ease",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 11,
                    fontWeight: 600,
                    background: i === 0 ? "#1F5D4C" : "rgba(27,31,29,0.07)",
                    color: i === 0 ? "#fff" : "rgba(27,31,29,0.62)",
                    borderRadius: 5,
                    padding: "3px 7px",
                    height: "fit-content",
                    minWidth: 44,
                    textAlign: "center",
                  }}
                >
                  {v}
                </span>
                <span style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ display: "block", fontSize: 13, lineHeight: 1.35 }}>
                    {note}
                  </span>
                  <span style={{ display: "flex", alignItems: "center", gap: 7, marginTop: 3 }}>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "rgba(27,31,29,0.45)" }}>
                      {date} · deployed in {28 + i * 4} s
                    </span>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, background: tbg, color: tfg, borderRadius: 999, padding: "1.5px 7px" }}>
                      {tag}
                    </span>
                  </span>
                </span>
              </div>
            );
          })}
        </Fade>

        {/* diff card */}
        <div style={{ border: "1px solid rgba(27,31,29,0.1)", borderRadius: 8, background: "#fff", padding: 11, marginTop: 8 }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(27,31,29,0.45)", marginBottom: 7 }}>
            New page shipped
          </div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, lineHeight: 1.7 }}>
            <div style={{ background: "rgba(63,160,107,0.12)", padding: "1px 6px", borderRadius: 3 }}>
              + /services/basement-finishing
            </div>
            <div style={{ background: "rgba(63,160,107,0.12)", padding: "1px 6px", borderRadius: 3, marginTop: 3 }}>
              + BookingWidget on 6 pages
            </div>
          </div>
        </div>
      </div>

      {/* score + vitals */}
      <div style={{ display: "flex", flexDirection: "column", gap: 13, minHeight: 0 }}>
        <div
          style={{
            background: "#fff",
            border: "1px solid rgba(27,31,29,0.09)",
            borderRadius: 10,
            padding: 15,
            display: "flex",
            alignItems: "center",
            gap: 16,
          }}
        >
          <div style={{ position: "relative", width: 92, height: 92, flex: "0 0 92px" }}>
            <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%", transform: "rotate(-90deg)" }}>
              <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(27,31,29,0.09)" strokeWidth="8" />
              <motion.circle
                cx="50"
                cy="50"
                r="42"
                fill="none"
                stroke="#3FA06B"
                strokeWidth="8"
                strokeLinecap="round"
                style={{ pathLength: ringLen }}
              />
            </svg>
            <span
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 25,
                fontWeight: 600,
                letterSpacing: "-0.02em",
              }}
            >
              {score}
            </span>
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600 }}>Performance</div>
            <div style={{ fontSize: 13, color: "rgba(27,31,29,0.58)", marginTop: 3, lineHeight: 1.5 }}>
              Mobile, simulated 4G.
              <br />
              Measured after each deploy.
            </div>
          </div>
        </div>

        <div style={{ background: "#fff", border: "1px solid rgba(27,31,29,0.09)", borderRadius: 10, padding: 13 }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(27,31,29,0.45)", marginBottom: 9 }}>
            Core Web Vitals
          </div>
          {VITALS.map(([k, v, verdict]) => (
            <div key={k} style={{ display: "flex", alignItems: "center", gap: 9, padding: "6px 0" }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, width: 30, color: "rgba(27,31,29,0.6)" }}>{k}</span>
              <span style={{ flex: 1, height: 5, borderRadius: 3, background: "rgba(27,31,29,0.08)", overflow: "hidden" }}>
                <motion.span
                  style={{
                    display: "block",
                    height: "100%",
                    background: published ? "#3FA06B" : "#D8C07A",
                    width: published ? "88%" : "54%",
                    transition: "width 500ms cubic-bezier(0.25,1,0.5,1), background 400ms ease",
                  }}
                />
              </span>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, width: 42, textAlign: "right" }}>{v}</span>
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                  background: published ? "rgba(63,160,107,0.14)" : "rgba(216,192,122,0.2)",
                  color: published ? "#2E7A50" : "#8A6E22",
                  borderRadius: 999,
                  padding: "2px 7px",
                  transition: "background 400ms ease, color 400ms ease",
                }}
              >
                {published ? verdict : "Needs work"}
              </span>
            </div>
          ))}
        </div>

        <div style={{ background: "#fff", border: "1px solid rgba(27,31,29,0.09)", borderRadius: 10, padding: 13, flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 10 }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(27,31,29,0.45)" }}>
              Deploys
            </span>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "rgba(27,31,29,0.4)" }}>
              last 10 weeks
            </span>
            <span style={{ flex: 1 }} />
            <span style={{ fontSize: 13, fontWeight: 600 }}>61</span>
          </div>
          <div style={{ flex: 1, display: "flex", alignItems: "flex-end", gap: 6, minHeight: 54 }}>
            {DEPLOYS.map((d, i) => (
              <span
                key={i}
                style={{
                  flex: 1,
                  height: `${(d / 11) * 100}%`,
                  borderRadius: 3,
                  background: i === DEPLOYS.length - 1 ? "#3FA06B" : "rgba(31,93,76,0.22)",
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Per-beat specs: chrome, cursor choreography, camera
   ═══════════════════════════════════════════════════════════════ */

export type BeatSpec = {
  tone: ChromeTone;
  url?: string;
  title?: string;
  cursor: CursorKey[];
  camera: FocusMove | null;
  Screen: (p: ScreenProps) => React.ReactElement;
};

export const DESIGN_SPECS: BeatSpec[] = [
  {
    tone: "light",
    title: "Northgate — Brand board",
    // ends on the accent picker, top right
    cursor: [
      { at: 0.16, x: 22, y: 62 },
      { at: 0.38, x: 58, y: 40 },
      { at: 0.5, x: 92, y: 12 },
      { at: 0.55, x: 92, y: 12, press: true },
      { at: 0.72, x: 74, y: 70 },
    ],
    // the lockup, top-left
    camera: { from: 0.44, hold: 0.56, to: 0.74, rect: { x: 4, y: 4, w: 54, h: 20 } },
    Screen: ScreenBrandBoard,
  },
  {
    tone: "light",
    url: "northgate.ca",
    // fills the postal field, presses Get a quote
    cursor: [
      { at: 0.16, x: 30, y: 30 },
      { at: 0.36, x: 78, y: 40 },
      { at: 0.42, x: 78, y: 40, press: true },
      { at: 0.6, x: 78, y: 52 },
      { at: 0.65, x: 78, y: 52, press: true },
      { at: 0.86, x: 60, y: 74 },
    ],
    // the booking widget the cursor is filling
    camera: { from: 0.44, hold: 0.58, to: 0.8, rect: { x: 60, y: 6, w: 38, h: 40 } },
    Screen: ScreenLocalSite,
  },
  {
    tone: "dark",
    title: "Northgate Ops — Analytics",
    // clicks 30d, then opens notifications
    cursor: [
      { at: 0.16, x: 30, y: 60 },
      { at: 0.44, x: 82, y: 12 },
      { at: 0.5, x: 82, y: 12, press: true },
      { at: 0.68, x: 94, y: 12 },
      { at: 0.73, x: 94, y: 12, press: true },
      { at: 0.9, x: 60, y: 70 },
    ],
    // the KPI row that changes when the range switches
    camera: { from: 0.52, hold: 0.64, to: 0.82, rect: { x: 7, y: 12, w: 90, h: 24 } },
    Screen: ScreenAnalytics,
  },
  {
    tone: "light",
    title: "Northgate Design System",
    // flips dark mode, then reads the tokens table
    cursor: [
      { at: 0.16, x: 18, y: 36 },
      { at: 0.5, x: 88, y: 12 },
      { at: 0.57, x: 88, y: 12, press: true },
      { at: 0.78, x: 76, y: 76 },
    ],
    // the token table
    camera: { from: 0.62, hold: 0.74, to: 0.9, rect: { x: 58, y: 44, w: 40, h: 34 } },
    Screen: ScreenLibrary,
  },
  {
    tone: "light",
    title: "Northgate — Releases",
    // presses Publish v1.3, then watches the score
    cursor: [
      { at: 0.16, x: 26, y: 60 },
      { at: 0.42, x: 44, y: 11 },
      { at: 0.49, x: 44, y: 11, press: true },
      { at: 0.74, x: 74, y: 28 },
    ],
    // the score ring counting up
    camera: { from: 0.56, hold: 0.7, to: 0.88, rect: { x: 56, y: 4, w: 42, h: 26 } },
    Screen: ScreenRelease,
  },
];
