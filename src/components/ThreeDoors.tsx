import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  motion,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from "motion/react";
import { duration, ease, spring } from "../lib/motion";
import LineReveal from "./LineReveal";
import MagneticCTA from "./MagneticCTA";
import { DESIGN_PREVIEW_SHOTS } from "../data/homeScenes";
import {
  GROW_METRICS,
  ILLUSTRATIVE_LABEL,
  PILLAR_TIMELINE,
} from "../data/servicePillars";

const MOBILE_QUERY = "(max-width: 767px)";

/** Name and promise are home's own copy; the timeline is the pillar's, read
 *  from the shared record so the two pages can't disagree. No prices — the
 *  studio quotes on the call. */
const DOORS = [
  {
    id: "design",
    name: "Design",
    promise:
      "Marketing sites, product interfaces and design systems that don't look templated.",
    timeline: PILLAR_TIMELINE.design,
  },
  {
    id: "automate",
    name: "Automate",
    promise:
      "AI systems and workflow automations that take the weekly busywork off your team.",
    timeline: PILLAR_TIMELINE.automate,
  },
  {
    id: "grow",
    name: "Grow",
    promise:
      "Paid acquisition and organic content that fills the funnel above the rest of the work.",
    timeline: PILLAR_TIMELINE.grow,
  },
] as const;

/* Preview panel geometry. 360x225 (16:10) where the row has room at 1280+,
   easing down to 260 wide at 1024 so the name, preview and promise still fit
   one line each. */
const PANEL_W = "clamp(260px, 39.0625vw - 140px, 360px)";
const PANEL_MAX_H = 225;
/** Clear space the panel must leave on either side — the row's name to its
 *  left, the promise copy to its right. */
const EDGE_CLEARANCE = 24;
const DRIFT = 40;

/* ── previews ──────────────────────────────────────────────────────── */

function DesignPreview() {
  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      {DESIGN_PREVIEW_SHOTS.map(function drawShot(shot, i) {
        return (
          <img
            key={shot.src}
            src={shot.src}
            alt=""
            aria-hidden
            width={1680}
            height={1050}
            loading="lazy"
            decoding="async"
            style={{
              position: "absolute",
              width: "72%",
              height: "auto",
              left: `${i * 13}%`,
              top: `${i * 12}%`,
              borderRadius: 6,
              border: "1px solid var(--hair)",
              boxShadow: "0 8px 24px rgba(20,20,18,0.12)",
              transform: `rotate(${(i - 1) * 3}deg)`,
              objectFit: "cover",
            }}
          />
        );
      })}
    </div>
  );
}

const FLOW_NODES = ["Trigger", "AI", "Review", "Publish"];

function AutomatePreview({ reduce }: { reduce: boolean }) {
  return (
    <div
      aria-hidden
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        gap: 10,
        padding: 16,
      }}
    >
      {FLOW_NODES.map(function drawNode(label, i) {
        return (
          <motion.div
            key={label}
            initial={reduce ? false : { opacity: 0.35 }}
            animate={reduce ? undefined : { opacity: [0.35, 1, 0.35] }}
            transition={
              reduce
                ? undefined
                : {
                    duration: 2.4,
                    repeat: Infinity,
                    ease: ease.inOut,
                    delay: i * 0.3,
                  }
            }
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "var(--color-ink)",
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "var(--color-ink)",
                flexShrink: 0,
              }}
            />
            {label}
          </motion.div>
        );
      })}
    </div>
  );
}

const MONO_MICRO = {
  fontFamily: "var(--font-mono)",
  fontSize: 10,
  letterSpacing: "0.14em",
  textTransform: "uppercase",
} as const;

/** Grow — a mini of the /services dashboard: two tiles off the same sample
 *  figures, plus the trend line. Labelled, because the numbers are invented. */
function GrowPreview({ reduce }: { reduce: boolean }) {
  const tiles = GROW_METRICS.slice(0, 2);

  return (
    <div
      aria-hidden
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        gap: 10,
        // top pad clears the ILLUSTRATIVE tag; the card fills its frame so the
        // tag sits on the dashboard rather than floating above it
        padding: "28px 16px 16px",
      }}
    >
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)", gap: 8 }}>
        {tiles.map(function drawTile(m) {
          return (
            <div
              key={m.label}
              style={{
                border: "1px solid var(--hair)",
                borderRadius: 6,
                padding: "8px 10px",
                background: "rgba(200,175,120,0.06)",
              }}
            >
              <div style={{ ...MONO_MICRO, color: "var(--color-muted)" }}>{m.label}</div>
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: 6,
                  marginTop: 4,
                }}
              >
                <span
                  className="tnum"
                  style={{ fontSize: 17, lineHeight: 1, color: "var(--color-ink)" }}
                >
                  {m.format(m.end)}
                </span>
                <span style={{ ...MONO_MICRO, color: "#B18544" }}>{m.delta}</span>
              </div>
            </div>
          );
        })}
      </div>

      <svg
        viewBox="0 0 240 48"
        preserveAspectRatio="none"
        style={{ width: "100%", flex: 1, minHeight: 30, display: "block" }}
      >
        <motion.path
          d="M4 42 C 40 39, 62 30, 92 27 S 150 19, 178 11 S 220 5, 236 3"
          fill="none"
          stroke="#B18544"
          strokeWidth={2}
          strokeLinecap="round"
          initial={reduce ? false : { pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={
            reduce ? { duration: 0 } : { duration: duration.slow * 2, ease: ease.outQuart }
          }
        />
      </svg>
    </div>
  );
}

/** Sits on any preview whose numbers are made up. */
function IllustrativeTag() {
  return (
    <div
      aria-hidden
      className="type-eyebrow"
      style={{
        position: "absolute",
        top: 6,
        right: 8,
        zIndex: 3,
        fontFamily: "var(--font-mono)",
        color: "var(--color-muted-2)",
        pointerEvents: "none",
      }}
    >
      {ILLUSTRATIVE_LABEL}
    </div>
  );
}

function Preview({ id, reduce }: { id: string; reduce: boolean }) {
  if (id === "design") return <DesignPreview />;
  if (id === "automate") return <AutomatePreview reduce={reduce} />;
  return (
    <>
      <GrowPreview reduce={reduce} />
      <IllustrativeTag />
    </>
  );
}

/* ── one door ──────────────────────────────────────────────────────── */

function Door({
  door,
  index,
  active,
  anyActive,
  onActivate,
  onDeactivate,
  mobile,
  reduce,
}: {
  door: (typeof DOORS)[number];
  index: number;
  active: boolean;
  anyActive: boolean;
  onActivate: () => void;
  onDeactivate: () => void;
  mobile: boolean;
  reduce: boolean;
}) {
  const rowRef = useRef<HTMLAnchorElement | null>(null);
  const nameRef = useRef<HTMLSpanElement | null>(null);
  const cellRef = useRef<HTMLDivElement | null>(null);
  const promiseRef = useRef<HTMLDivElement | null>(null);
  const px = useMotionValue(0);
  const sx = useSpring(px, spring.soft);

  function onMove(e: React.MouseEvent<HTMLAnchorElement>) {
    if (reduce || mobile || !rowRef.current) return;
    const r = rowRef.current.getBoundingClientRect();
    const raw = (e.clientX - r.left) / r.width;
    let next = Math.max(-DRIFT, Math.min(DRIFT, (raw - 0.5) * 160));

    // the panel drifts with the cursor, so cap that travel against its
    // neighbours' measured edges — otherwise it slides over the name one way
    // and the promise the other (/work clamps its cursor preview the same
    // way). cellRef is the untranslated grid cell, so its box is the panel's
    // rest position.
    const name = nameRef.current?.getBoundingClientRect();
    const promise = promiseRef.current?.getBoundingClientRect();
    const cell = cellRef.current?.getBoundingClientRect();
    if (name && promise && cell) {
      const lo = name.right + EDGE_CLEARANCE - cell.left;
      const hi = promise.left - EDGE_CLEARANCE - cell.right;
      // lo wins when the row is too tight for both: never cover the name
      next = Math.max(lo, Math.min(hi, next));
    }

    px.set(next);
  }

  const dim = anyActive && !active && !mobile && !reduce;

  return (
    <Link
      ref={rowRef}
      to={`/services#${door.id}`}
      onMouseEnter={onActivate}
      onMouseLeave={onDeactivate}
      onMouseMove={onMove}
      onFocus={function focus(e) {
        if (e.currentTarget.matches(":focus-visible")) onActivate();
      }}
      onBlur={onDeactivate}
      style={{
        display: "block",
        borderTop: "1px solid var(--hair)",
        textDecoration: "none",
        color: "inherit",
      }}
    >
      <div
        style={{
          maxWidth: "var(--container-wide)",
          margin: "0 auto",
          // fixed height so hover never animates layout
          minHeight: mobile ? undefined : PANEL_MAX_H + 24,
          padding: mobile ? "28px 0" : 0,
          display: mobile ? "block" : "grid",
          // max-content on the name: a fractional track squeezes it and
          // LineReveal's overflow:hidden then clips the word.
          gridTemplateColumns: mobile
            ? undefined
            : `max-content ${PANEL_W} minmax(0, 1fr) 20px`,
          alignItems: "center",
          gap: mobile ? 16 : 24,
          opacity: dim ? 0.4 : 1,
          transition: reduce
            ? "none"
            : `opacity ${duration.base * 1000}ms cubic-bezier(${ease.outQuart.join(",")})`,
        }}
      >
        <motion.div
          // display-l, not -xl: at display-xl "Automate" is ~633px at 1440 and
          // ~450px at 1024, which leaves no room for the preview and promise
          // in the same row.
          className="type-display-l"
          style={{
            color: "var(--color-ink)",
            x: reduce || mobile ? 0 : active ? 16 : 0,
          }}
          transition={spring.soft}
        >
          <span ref={nameRef} style={{ display: "inline-block" }}>
            <LineReveal delay={0.08 * index}>{door.name}</LineReveal>
          </span>
        </motion.div>

        {/* preview panel — lives inside the row, between name and promise */}
        <div
          ref={cellRef}
          style={{
            position: "relative",
            // 16:10, capped so the panel never outgrows the row
            height: mobile ? 120 : undefined,
            aspectRatio: mobile ? undefined : "16 / 10",
            maxHeight: mobile ? undefined : PANEL_MAX_H,
            marginTop: mobile ? 16 : 0,
            pointerEvents: "none",
          }}
        >
          <motion.div
            style={{
              position: "absolute",
              inset: 0,
              x: mobile || reduce ? 0 : sx,
              overflow: "hidden",
              borderRadius: 8,
            }}
            initial={false}
            animate={{
              opacity: mobile || active ? 1 : 0,
              scale: mobile || active ? 1 : 0.96,
            }}
            transition={
              reduce
                ? { duration: 0 }
                : { duration: duration.base, ease: ease.outQuart }
            }
          >
            <Preview id={door.id} reduce={reduce} />
          </motion.div>
        </div>

        <div
          ref={promiseRef}
          style={{
            textAlign: mobile ? "left" : "right",
            marginTop: mobile ? 16 : 0,
          }}
        >
          <div
            className="type-body"
            style={{ color: "var(--color-muted)", marginBottom: 8 }}
          >
            {door.promise}
          </div>
          <div
            className="type-eyebrow"
            style={{ fontFamily: "var(--font-mono)", color: "var(--color-ink-soft)" }}
          >
            {door.timeline}
          </div>
        </div>

        {!mobile ? (
          <motion.div
            aria-hidden
            style={{ width: 20, height: 20, color: "var(--color-ink)", justifySelf: "end" }}
            animate={{ rotate: active && !reduce ? -45 : 0 }}
            transition={reduce ? { duration: 0 } : { duration: duration.base, ease: ease.outQuart }}
          >
            <svg viewBox="0 0 20 20" fill="none" style={{ display: "block" }}>
              <path d="M4 10h12M11 5l5 5-5 5" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </motion.div>
        ) : null}
      </div>
    </Link>
  );
}

/* ── the band ──────────────────────────────────────────────────────── */

export default function ThreeDoors() {
  const reduce = useReducedMotion();
  const [mobile, setMobile] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(function watch() {
    const mq = window.matchMedia(MOBILE_QUERY);
    function onChange(e: MediaQueryListEvent) {
      setMobile(e.matches);
    }
    setMobile(mq.matches);
    mq.addEventListener("change", onChange);
    return function cleanup() {
      mq.removeEventListener("change", onChange);
    };
  }, []);

  return (
    <section
      id="services"
      style={{
        backgroundColor: "var(--color-bg-alt)",
        padding: "112px 0 96px",
        position: "relative",
      }}
    >
      <div className="grain-light" aria-hidden="true" />

      <div
        style={{
          maxWidth: "var(--container-wide)",
          margin: "0 auto",
          position: "relative",
          zIndex: 2,
          marginBottom: 56,
        }}
      >
        <div
          className="type-eyebrow"
          style={{ color: "var(--color-muted)", marginBottom: 20 }}
        >
          //_02 · SERVICES
        </div>
        <h2 className="type-h2 measure-wide" style={{ color: "var(--color-ink)" }}>
          Three ways we make you look serious.
        </h2>
      </div>

      <div style={{ position: "relative", zIndex: 2 }}>
        {DOORS.map(function drawDoor(door, i) {
          return (
            <Door
              key={door.id}
              door={door}
              index={i}
              active={activeId === door.id}
              anyActive={activeId !== null}
              onActivate={function on() {
                setActiveId(door.id);
              }}
              onDeactivate={function off() {
                setActiveId(null);
              }}
              mobile={mobile}
              reduce={!!reduce}
            />
          );
        })}
        <div style={{ borderTop: "1px solid var(--hair)" }} />
      </div>

      <div
        style={{
          maxWidth: "var(--container-wide)",
          margin: "0 auto",
          paddingTop: 40,
          position: "relative",
          zIndex: 2,
        }}
      >
        <MagneticCTA to="/services" variant="text" size="md">
          Explore services
        </MagneticCTA>
      </div>
    </section>
  );
}
