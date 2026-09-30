import { useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useTransform,
  type MotionValue,
} from "motion/react";
import { useScrollStyle } from "../../../lib/useScrollStyle";
import type { CursorKey } from "./GhostCursor";
import type { CameraMove } from "./camera";
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

export type ScreenProps = { local: MotionValue<number> };

/* ═══════════════════════════════════════════════════════════════
   B1 · Brand board
   ═══════════════════════════════════════════════════════════════ */

const PALETTE: Array<[string, string]> = [
  ["Forest", BRAND.primary],
  ["Sand", BRAND.sand],
  ["Ink", BRAND.ink],
  ["Slate", "#6F7D78"],
];

export function ScreenBrandBoard({ local }: ScreenProps) {
  // the cursor picks the accent at 0.54; everything downstream re-tints
  const [accent, setAccent] = useState(BRAND.accentA);
  useMotionValueEvent(local, "change", function pick(t) {
    setAccent(t > 0.545 ? BRAND.accentB : BRAND.accentA);
  });

  const draw = useTransform(local, (t) => at(t, 0.1, 0.42));
  const chips = useTransform(local, (t) => at(t, 0.3, 0.5));
  const spec = useTransform(local, (t) => at(t, 0.4, 0.6));
  const apps = useTransform(local, (t) => at(t, 0.58, 0.8));

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
              fontSize: 9.5,
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
                <div style={{ fontSize: 9.5, fontWeight: 600, marginTop: 6 }}>{n}</div>
                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 8.5,
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
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 9 }}>
              Söhne · 600 / 40
            </span>
          </div>
          <div style={{ fontSize: 11.5, lineHeight: 1.55, color: "rgba(22,33,29,0.72)", marginTop: 8 }}>
            Basement renovations, flooring and tile across Durham Region —
            quoted in person, finished on schedule.
          </div>
          <div style={{ display: "flex", gap: 14, marginTop: 10 }}>
            {["12 / 18", "16 / 24", "22 / 30"].map((s) => (
              <span
                key={s}
                style={{ fontFamily: "var(--font-mono)", fontSize: 8.5, color: "rgba(22,33,29,0.45)" }}
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
                style={{ flex: 1, height: 34, borderRadius: 5, background: g }}
              />
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
            <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.16em" }}>
              {BRAND.name}
            </span>
          </div>
          <div>
            <div style={{ fontSize: 10.5, fontWeight: 500 }}>Marcus Delacroix</div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 8.5, opacity: 0.6, marginTop: 3 }}>
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
            <text x="146" y="59" fill="rgba(255,255,255,0.72)" fontSize="7" fontFamily="var(--font-mono)" letterSpacing="1">
              (905) 555-0142
            </text>
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
        fontSize: 8.5,
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

export function ScreenLocalSite({ local }: ScreenProps) {
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
            <span style={{ fontSize: 11.5, fontWeight: 600, letterSpacing: "0.14em", color: BRAND.ink }}>
              {BRAND.name}
            </span>
          </span>
          {["Services", "Gallery", "About", "Reviews"].map((l) => (
            <span key={l} style={{ fontSize: 10.5, color: "rgba(22,33,29,0.66)" }}>
              {l}
            </span>
          ))}
          <span style={{ flex: 1 }} />
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 10.5, fontWeight: 600, color: BRAND.primary }}>
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
            <div style={{ fontSize: 11.5, lineHeight: 1.55, color: "rgba(22,33,29,0.66)", marginTop: 12, maxWidth: 300 }}>
              Licensed, insured and finishing on schedule since 2009. Free
              on-site estimate, usually within three days.
            </div>
            <div style={{ display: "flex", gap: 18, marginTop: 16 }}>
              {[["4.9★", "212 reviews"], ["17 yrs", "in business"], ["Licensed", "& insured"]].map(([a, b]) => (
                <div key={a}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: BRAND.ink }}>{a}</div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 8.5, color: "rgba(22,33,29,0.5)" }}>{b}</div>
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
            <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 12, color: BRAND.ink }}>
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
                fontSize: 11.5,
                fontWeight: 600,
              }}
            >
              Get a quote
            </div>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 8,
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
                <div style={{ fontSize: 10.5, fontWeight: 600, color: BRAND.ink }}>{t}</div>
                <div style={{ fontSize: 9, color: "rgba(22,33,29,0.55)", marginTop: 3 }}>{d}</div>
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
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 8.5, marginTop: 5, color: "rgba(22,33,29,0.5)" }}>
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
              <div style={{ fontSize: 10, color: BRAND.accentA, letterSpacing: 1 }}>★★★★★</div>
              <div style={{ fontSize: 10, lineHeight: 1.5, color: "rgba(22,33,29,0.75)", margin: "6px 0 8px" }}>
                "{body}"
              </div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 8.5, color: "rgba(22,33,29,0.48)" }}>
                {n} · {city}
              </div>
            </div>
          ))}
        </div>

        {/* footer */}
        <div style={{ background: BRAND.ink, color: "rgba(251,249,244,0.66)", padding: "16px 24px", fontSize: 9 }}>
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
        <span style={{ fontSize: 10.5 }}>
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
          fontSize: 8,
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
          fontSize: 10.5,
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

const JOBS = [
  ["Basement — Ravenscroft Rd", "Crew A", "In progress", "8,400"],
  ["Flooring — Kingston Rd E", "Crew B", "Scheduled", "3,150"],
  ["Bathroom — Harwood Ave", "Crew A", "Quoted", "11,900"],
  ["Kitchen — Rossland Rd W", "Crew C", "Complete", "22,600"],
  ["Tiling — Brock St N", "Crew B", "In progress", "2,480"],
];

const STATUS_TINT: Record<string, [string, string]> = {
  "In progress": ["rgba(90,160,255,0.16)", "#8FBEFF"],
  Scheduled: ["rgba(200,170,90,0.16)", "#E0C070"],
  Quoted: ["rgba(255,255,255,0.08)", "rgba(237,231,218,0.7)"],
  Complete: ["rgba(90,200,140,0.16)", "#7FD3A3"],
};

export function ScreenAnalytics({ local }: ScreenProps) {
  const [range, setRange] = useState<"7d" | "30d">("7d");
  const [notif, setNotif] = useState(false);
  useMotionValueEvent(local, "change", function drive(t) {
    setRange(t > 0.5 ? "30d" : "7d");
    setNotif(t > 0.72 && t < 0.95);
  });
  const kpis = range === "30d" ? KPI_30D : KPI_7D;
  const chartDraw = useTransform(local, (t) => at(t, 0.14, 0.46));

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
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 8.5, color: "rgba(237,231,218,0.42)", marginTop: 2 }}>
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
                  fontSize: 9.5,
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
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 8, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(237,231,218,0.42)" }}>
                {label}
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 7, marginTop: 6 }}>
                <span style={{ fontSize: 19, fontWeight: 600, letterSpacing: "-0.02em" }}>{value}</span>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 8.5, color: delta.startsWith("−") ? "#E08C7F" : "#7FD3A3" }}>
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
            <span style={{ fontSize: 10.5, fontWeight: 500 }}>Revenue booked</span>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 8.5, color: "rgba(237,231,218,0.4)" }}>
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
              fontSize: 8,
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
                  fontSize: 10,
                }}
              >
                <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{job}</span>
                <span style={{ color: "rgba(237,231,218,0.6)", fontFamily: "var(--font-mono)", fontSize: 9 }}>{crew}</span>
                <span>
                  <span style={{ background: bg, color: fg, borderRadius: 999, padding: "2.5px 8px", fontSize: 8.5, fontFamily: "var(--font-mono)" }}>
                    {status}
                  </span>
                </span>
                <span style={{ textAlign: "right", fontFamily: "var(--font-mono)", fontSize: 9.5 }}>{rev}</span>
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
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 8, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(237,231,218,0.4)", marginBottom: 8 }}>
          Notifications
        </div>
        {[["New quote request", "Ravenscroft Rd · 2m"], ["Crew B checked in", "Kingston Rd E · 18m"]].map(([a, b]) => (
          <div key={a} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#3FA06B", marginTop: 4 }} />
            <span>
              <span style={{ display: "block", fontSize: 10 }}>{a}</span>
              <span style={{ display: "block", fontFamily: "var(--font-mono)", fontSize: 8, color: "rgba(237,231,218,0.42)" }}>{b}</span>
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

export function ScreenLibrary({ local }: ScreenProps) {
  const [dark, setDark] = useState(false);
  useMotionValueEvent(local, "change", function toggle(t) {
    setDark(t > 0.56);
  });

  const bg = dark ? "#16181C" : "#FFFFFF";
  const panel = dark ? "#1D2025" : "#F7F5F0";
  const ink = dark ? "#EDE7DA" : "#1B1F1D";
  const muted = dark ? "rgba(237,231,218,0.5)" : "rgba(27,31,29,0.52)";
  const line = dark ? "rgba(255,255,255,0.09)" : "rgba(27,31,29,0.1)";

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
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 7.5, letterSpacing: "0.16em", textTransform: "uppercase", color: muted, marginBottom: 7 }}>
              {group}
            </div>
            {items.map((it) => (
              <div
                key={it}
                style={{
                  fontSize: 10,
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
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 8.5, color: muted }}>4 variants · 4 states</span>
          <span style={{ flex: 1 }} />
          {/* the toggle the cursor flips */}
          <span style={{ display: "flex", alignItems: "center", gap: 7 }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 8.5, color: muted }}>Dark mode</span>
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
            <span key={s} style={{ fontFamily: "var(--font-mono)", fontSize: 7.5, letterSpacing: "0.12em", textTransform: "uppercase", color: muted }}>
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
                    fontSize: 10,
                    color: val ? ink : muted,
                    background: dark ? "rgba(255,255,255,0.03)" : "#fff",
                  }}
                >
                  {val || "Postal code"}
                </div>
                {state === "Error" ? (
                  <div style={{ fontSize: 8.5, color: "#E0705F", marginTop: 3 }}>Enter a full postal code</div>
                ) : null}
              </div>
            ))}
          </div>

          <div style={{ border: `1px solid ${line}`, borderRadius: 8, padding: 11, minHeight: 0, overflow: "hidden" }}>
            <PanelLabel muted={muted}>Tokens</PanelLabel>
            {[
              ["color/primary", "#1F5D4C"],
              ["space/3", "12px"],
              ["radius/md", "8px"],
              ["text/body", "14 / 22"],
            ].map(([k, v]) => (
              <div
                key={k}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontFamily: "var(--font-mono)",
                  fontSize: 9,
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
    <div style={{ fontFamily: "var(--font-mono)", fontSize: 7.5, letterSpacing: "0.16em", textTransform: "uppercase", color: muted, marginBottom: 8 }}>
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
      <span style={{ fontFamily: "var(--font-mono)", fontSize: 8.5, color: muted }}>{variant}</span>
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
            fontSize: 9.5,
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

const CHANGELOG: Array<[string, string, string]> = [
  ["v1.3", "12 Mar", "Booking widget on every service page"],
  ["v1.2", "26 Feb", "Compressed gallery images, lazy below the fold"],
  ["v1.1", "09 Feb", "Added Whitby and Oshawa service areas"],
  ["v1.0", "22 Jan", "Launch"],
];

const VITALS: Array<[string, string, string]> = [
  ["LCP", "1.4 s", "Good"],
  ["INP", "84 ms", "Good"],
  ["CLS", "0.02", "Good"],
];

export function ScreenRelease({ local }: ScreenProps) {
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
  const entries = useTransform(local, (t) => at(t, 0.12, 0.44));

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
              fontSize: 10,
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
          {CHANGELOG.map(([v, date, note], i) => (
            <div
              key={v}
              style={{
                display: "flex",
                gap: 11,
                padding: "9px 0",
                borderTop: i === 0 ? "none" : "1px solid rgba(27,31,29,0.08)",
                opacity: i === 0 && !published ? 0.42 : 1,
                transition: "opacity 300ms ease",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 9,
                  fontWeight: 600,
                  background: i === 0 ? "#1F5D4C" : "rgba(27,31,29,0.08)",
                  color: i === 0 ? "#fff" : "rgba(27,31,29,0.66)",
                  borderRadius: 5,
                  padding: "3px 7px",
                  height: "fit-content",
                }}
              >
                {v}
              </span>
              <span style={{ flex: 1 }}>
                <span style={{ display: "block", fontSize: 10.5 }}>{note}</span>
                <span style={{ display: "block", fontFamily: "var(--font-mono)", fontSize: 8.5, color: "rgba(27,31,29,0.45)", marginTop: 2 }}>
                  {date} · deployed in 42 s
                </span>
              </span>
            </div>
          ))}
        </Fade>

        {/* diff card */}
        <div style={{ border: "1px solid rgba(27,31,29,0.1)", borderRadius: 8, background: "#fff", padding: 11, marginTop: 8 }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 8, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(27,31,29,0.45)", marginBottom: 7 }}>
            New page shipped
          </div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, lineHeight: 1.7 }}>
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
            <div style={{ fontSize: 12, fontWeight: 600 }}>Performance</div>
            <div style={{ fontSize: 10, color: "rgba(27,31,29,0.58)", marginTop: 3, lineHeight: 1.5 }}>
              Mobile, simulated 4G.
              <br />
              Measured after each deploy.
            </div>
          </div>
        </div>

        <div style={{ background: "#fff", border: "1px solid rgba(27,31,29,0.09)", borderRadius: 10, padding: 13 }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 8, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(27,31,29,0.45)", marginBottom: 9 }}>
            Core Web Vitals
          </div>
          {VITALS.map(([k, v, verdict]) => (
            <div key={k} style={{ display: "flex", alignItems: "center", gap: 9, padding: "6px 0" }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 9.5, width: 30, color: "rgba(27,31,29,0.6)" }}>{k}</span>
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
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 9.5, width: 42, textAlign: "right" }}>{v}</span>
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 8,
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
  camera: CameraMove | null;
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
    camera: { from: 0.1, hold: 0.26, to: 0.46, x: 16, y: 14, scale: 1.55 },
    Screen: ScreenBrandBoard,
  },
  {
    tone: "light",
    url: "yourbusiness.ca",
    // fills the postal field, presses Get a quote
    cursor: [
      { at: 0.16, x: 30, y: 30 },
      { at: 0.36, x: 78, y: 40 },
      { at: 0.42, x: 78, y: 40, press: true },
      { at: 0.6, x: 78, y: 52 },
      { at: 0.65, x: 78, y: 52, press: true },
      { at: 0.86, x: 60, y: 74 },
    ],
    camera: { from: 0.3, hold: 0.46, to: 0.72, x: 78, y: 44, scale: 1.5 },
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
    camera: { from: 0.46, hold: 0.6, to: 0.78, x: 24, y: 32, scale: 1.55 },
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
    camera: { from: 0.62, hold: 0.76, to: 0.95, x: 78, y: 78, scale: 1.6 },
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
    camera: { from: 0.52, hold: 0.68, to: 0.9, x: 74, y: 26, scale: 1.6 },
    Screen: ScreenRelease,
  },
];
