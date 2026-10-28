import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "motion/react";
import { duration, ease, spring } from "../lib/motion";
import LineReveal from "./LineReveal";
import MagneticCTA from "./MagneticCTA";
import { serviceSlug } from "../data/servicePillars";
import {
  SERVICE_COLOR,
  serviceGlow,
  withAlpha,
  type ServiceId,
} from "../data/serviceColors";

/**
 * Home's services chapter — Session 29, owner decision.
 *
 * Was three doors named Design / Automate / Grow, the September pillar
 * vocabulary, as full-width rows. It is now the four services the studio
 * actually sells, as a grid: four columns at 1200 and up, 2x2 between 768
 * and 1199, stacked below 768.
 *
 * Each card carries its own service colour — the dot before its name, the
 * 1px rule along its top, and the glow it lifts on while hovered or
 * focused. The colour never touches type.
 *
 * Copy is the owner's, verbatim. Two of the four have no timeline and
 * print no timeline line at all rather than an empty one.
 */

const MOBILE_QUERY = "(max-width: 767px)";

type Door = {
  id: ServiceId;
  name: string;
  promise: string;
  /** Absent where the work is not quoted in weeks. */
  timeline?: string;
  /**
   * The /services beat this door opens on. `ServicesBuild` resolves both
   * pillar ids and individual SERVICE slugs from the hash, so each door
   * lands on its own service rather than on a shared chapter.
   */
  service: string;
};

const DOORS: Door[] = [
  {
    id: "websites",
    name: "Websites",
    promise:
      "Marketing sites and landing pages designed from your world, built from scratch, fast on every phone.",
    timeline: "2 – 3 weeks",
    service: "Marketing websites",
  },
  {
    id: "webApps",
    name: "Web Apps",
    promise:
      "Customer portals, booking and ordering systems and internal tools that replace the spreadsheets and workarounds.",
    service: "Product & SaaS interfaces",
  },
  {
    id: "aiAutomation",
    name: "AI Automation",
    promise:
      "Agents and workflow automations that take the weekly busywork off your team, with a person signing off.",
    timeline: "1 – 2 weeks",
    service: "AI agents",
  },
  {
    id: "marketing",
    name: "Marketing",
    promise:
      "Local search, outreach, paid ads and content that fill the funnel and compound month over month.",
    service: "Local search",
  },
];

function Card({
  door,
  index,
  active,
  anyActive,
  onActivate,
  onDeactivate,
  mobile,
  reduce,
}: {
  door: Door;
  index: number;
  active: boolean;
  anyActive: boolean;
  onActivate: () => void;
  onDeactivate: () => void;
  mobile: boolean;
  reduce: boolean;
}) {
  const accent = SERVICE_COLOR[door.id];
  const dim = anyActive && !active && !mobile && !reduce;
  const lit = active && !reduce;

  return (
    <Link
      className="svc-card"
      to={`/services#${serviceSlug(door.service)}`}
      onMouseEnter={onActivate}
      onMouseLeave={onDeactivate}
      onFocus={function focus(e) {
        if (e.currentTarget.matches(":focus-visible")) onActivate();
      }}
      onBlur={onDeactivate}
      style={{
        borderTop: `1px solid ${accent}`,
        boxShadow: lit ? serviceGlow(door.id) : "none",
        background: lit
          ? `linear-gradient(180deg, ${withAlpha(accent, 0.07)} 0%, ${withAlpha(accent, 0.015)} 60%, transparent 100%)`
          : "transparent",
        opacity: dim ? 0.45 : 1,
        transition: reduce
          ? "none"
          : `box-shadow ${duration.base * 1000}ms ease, background-color ${duration.base * 1000}ms ease, opacity ${duration.base * 1000}ms cubic-bezier(${ease.outQuart.join(",")})`,
      }}
    >
      <motion.div
        className="type-h2 svc-name"
        style={{
          color: "var(--color-ink)",
          y: reduce || mobile ? 0 : active ? -4 : 0,
        }}
        transition={spring.soft}
      >
        <span style={{ display: "inline-flex", alignItems: "center", gap: 12 }}>
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
          <LineReveal delay={0.06 * index}>{door.name}</LineReveal>
        </span>
      </motion.div>

      <p className="type-body svc-promise" style={{ color: "var(--color-muted)" }}>
        {door.promise}
      </p>

      <div className="svc-foot">
        {door.timeline ? (
          <span
            className="type-eyebrow"
            style={{ fontFamily: "var(--font-mono)", color: "var(--color-ink-soft)" }}
          >
            {door.timeline}
          </span>
        ) : (
          <span />
        )}
        <motion.span
          aria-hidden
          className="svc-arrow"
          style={{ color: "var(--color-ink)" }}
          animate={{ rotate: active && !reduce ? -45 : 0 }}
          transition={reduce ? { duration: 0 } : { duration: duration.base, ease: ease.outQuart }}
        >
          <svg viewBox="0 0 20 20" fill="none" style={{ display: "block" }}>
            <path d="M4 10h12M11 5l5 5-5 5" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </motion.span>
      </div>
    </Link>
  );
}

export default function ServiceDoors() {
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
          Four ways to be taken seriously.
        </h2>
      </div>

      <div className="svc-grid">
        {DOORS.map(function drawCard(door, i) {
          return (
            <Card
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

      {/* The grid's breakpoints are the owner's. Compound selectors
          throughout, so nothing here turns on source order (§5.38). */}
      <style>{`
        .svc-grid {
          position: relative;
          z-index: 2;
          max-width: var(--container-wide);
          margin: 0 auto;
          display: grid;
          /* minmax(0,1fr), never 1fr: a display name sets min-content and
             breaks out of the track otherwise (§5.10). */
          grid-template-columns: minmax(0, 1fr);
          gap: 32px 24px;
        }
        @media (min-width: 768px) {
          .svc-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        }
        @media (min-width: 1200px) {
          .svc-grid { grid-template-columns: repeat(4, minmax(0, 1fr)); }
          /* At four columns "AI Automation" takes two lines where the
             other three take one, so its promise started 40px below its
             neighbours'. The name reserves two lines, computed from the
             tier's own tokens rather than a measured pixel, so it stays
             right if the scale moves. Every widest single word still fits
             its column (§5.5), so nothing is overflowing — this is only
             the ragged start the wrap left behind. */
          .svc-grid .svc-name {
            min-height: calc(2 * var(--type-h2-leading) * var(--type-h2-size));
          }
        }
        .svc-grid .svc-card {
          display: flex;
          flex-direction: column;
          gap: 16px;
          padding: 24px 0 20px;
          text-decoration: none;
          color: inherit;
          min-width: 0;
        }
        .svc-grid .svc-name { min-width: 0; }
        .svc-grid .svc-promise { margin: 0; flex: 1; }
        .svc-grid .svc-foot {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }
        .svc-grid .svc-arrow { width: 20px; height: 20px; flex: none; }
        .svc-grid .svc-card:focus-visible {
          outline: 2px solid var(--color-ink);
          outline-offset: 4px;
        }
      `}</style>
    </section>
  );
}
