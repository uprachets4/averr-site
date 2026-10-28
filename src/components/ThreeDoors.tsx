import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "motion/react";
import { duration, ease, spring } from "../lib/motion";
import LineReveal from "./LineReveal";
import MagneticCTA from "./MagneticCTA";
import { PILLAR_SERVICES, PILLAR_TIMELINE } from "../data/servicePillars";
import { PILLAR_SERVICE, SERVICE_COLOR, serviceGlow, withAlpha } from "../data/serviceColors";

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

/** How many service names each door prints. */
const DOOR_SERVICE_COUNT = 4;

/* ── one door ──────────────────────────────────────────────────────── */

/**
 * Session 29, owner decision: the hover previews are gone.
 *
 * Each door used to open a live miniature of the real /services screens
 * (`DoorPreviewLive`, now deleted) with the hand-made stills behind it.
 * Those screens are the Northgate simulation and carry invented figures —
 * "★ 4.8 · 186 reviews" and the rest — which may not appear on home, and
 * they could not be stripped here because they belong to /services and
 * this session may not edit that page.
 *
 * What replaces them is a static hover in the door's own service colour:
 * the top hairline, a soft wash across the row and the glow. No imagery,
 * no numbers, nothing to keep in sync with another page.
 */
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
  const nameRef = useRef<HTMLSpanElement | null>(null);
  const dim = anyActive && !active && !mobile && !reduce;

  /* One colour per door: the dot before its name, the top hairline, the
     wash and the glow. The colour never touches type — the system forbids
     service colour on body text, and the violet would break its own 14px
     floor on the mono list. */
  const service = PILLAR_SERVICE[door.id];
  const accent = SERVICE_COLOR[service];
  const lit = active && !reduce;

  return (
    <Link
      to={`/services#${door.id}`}
      onMouseEnter={onActivate}
      onMouseLeave={onDeactivate}
      onFocus={function focus(e) {
        if (e.currentTarget.matches(":focus-visible")) onActivate();
      }}
      onBlur={onDeactivate}
      style={{
        display: "block",
        borderTop: `1px solid ${active ? accent : "var(--hair)"}`,
        boxShadow: lit ? serviceGlow(service) : "none",
        background: lit
          ? `linear-gradient(90deg, ${withAlpha(accent, 0.07)} 0%, ${withAlpha(accent, 0.02)} 55%, transparent 100%)`
          : "transparent",
        transition: reduce
          ? "none"
          : `border-color ${duration.base * 1000}ms ease, box-shadow ${duration.base * 1000}ms ease, background-color ${duration.base * 1000}ms ease`,
        textDecoration: "none",
        color: "inherit",
      }}
    >
      <div
        style={{
          maxWidth: "var(--container-wide)",
          margin: "0 auto",
          padding: mobile ? "28px 0" : "48px 0",
          display: mobile ? "block" : "grid",
          // max-content on the name: a fractional track squeezes it and
          // LineReveal's overflow:hidden then clips the word.
          gridTemplateColumns: mobile ? undefined : "max-content minmax(0, 1fr) 20px",
          alignItems: "center",
          gap: mobile ? 16 : 24,
          opacity: dim ? 0.4 : 1,
          transition: reduce
            ? "none"
            : `opacity ${duration.base * 1000}ms cubic-bezier(${ease.outQuart.join(",")})`,
        }}
      >
        <motion.div
          className="type-display-l"
          style={{
            color: "var(--color-ink)",
            x: reduce || mobile ? 0 : active ? 16 : 0,
          }}
          transition={spring.soft}
        >
          <span
            ref={nameRef}
            style={{ display: "inline-flex", alignItems: "center", gap: 14 }}
          >
            <span
              aria-hidden
              style={{
                width: 7,
                height: 7,
                flex: "none",
                borderRadius: "50%",
                background: accent,
              }}
            />
            <LineReveal delay={0.08 * index}>{door.name}</LineReveal>
          </span>
        </motion.div>

        <div
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
          {/* The services themselves, always visible — the promise says what
              the pillar is for, this says what you actually buy. Read from
              the shared record, so home and /services cannot disagree. */}
          <div
            className="type-eyebrow"
            style={{
              fontFamily: "var(--font-mono)",
              color: "var(--color-muted-2)",
              marginBottom: 8,
            }}
          >
            {PILLAR_SERVICES[door.id]
              .slice(0, DOOR_SERVICE_COUNT)
              .map((x) => x.name)
              .join(" · ")}
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
        <MagneticCTA to="/services" variant="text" size="md" tone="dark">
          Explore services
        </MagneticCTA>
      </div>
    </section>
  );
}
