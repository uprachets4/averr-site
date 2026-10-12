import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { animate, motion, useMotionValue, useMotionValueEvent, useReducedMotion, useScroll } from "motion/react";
import { duration, ease } from "../../lib/motion";
import {
  PILLAR_NAME,
  PILLAR_ORDER,
  PILLAR_SERVICES,
  serviceSlug,
  type PillarId,
} from "../../data/servicePillars";
import MagneticCTA from "../MagneticCTA";

/**
 * Chapter 3 — what we do.
 *
 * Three panels, one per pillar, in a pinned frame. Scroll moves between
 * them and so do the tabs; both write the same index, so neither can
 * disagree with the other. Each panel names its pillar, promises one
 * thing, and lists every one of that pillar's services as a chip that
 * deep-links into /services at that service's own beat.
 *
 * On the right is the REAL /services screen — the same component the
 * build stage pins, not a picture of it — with one thing you can play:
 *
 *   Design    the palette chips re-tint the brand board
 *   Automate  "Run agent" scores the lead
 *   Grow      "Publish update" climbs the pin into the top three
 *
 * Every one of those screens is a function of a single `local` value
 * from 0 to 1, which is why a button can drive one: pressing it animates
 * `local` and the screen performs. Only the active pillar's screen is
 * mounted, and all three chunks are already on the page for the hero's
 * sketch, so this costs nothing extra to show.
 */

const Brand = lazy(async function b() {
  return { default: (await import("../services/build/BuildScreens")).ScreenBrandBoard };
});
const Agent = lazy(async function a() {
  return { default: (await import("../services/build/AutomateScreens")).ScreenAgent };
});
const Map = lazy(async function m() {
  return { default: (await import("../services/build/GrowScreens")).ScreenMap };
});

/** One line per pillar. New copy, written for this chapter. */
const PROMISE: Record<PillarId, string> = {
  design: "A site that looks like you meant it, and reads like you wrote it.",
  automate: "The repetitive half of the week, handled before you get in.",
  grow: "Found by the people already looking for what you do.",
};

/** What the one playable control says, and what it does to `local`. */
const PLAY: Record<PillarId, { label: string; to: number; from?: number; ms: number }> = {
  design: { label: "Pick the accent", to: 0.78, from: 0.3, ms: 900 },
  automate: { label: "Run agent", to: 1, from: 0, ms: 2400 },
  grow: { label: "Publish update", to: 1, from: 0, ms: 2400 },
};

function Panel({
  pillar,
  active,
  compact,
}: {
  pillar: PillarId;
  active: boolean;
  compact: boolean;
}) {
  const reduce = !!useReducedMotion();
  const local = useMotionValue(reduce ? 1 : 0);
  const [played, setPlayed] = useState(false);
  const play = PLAY[pillar];

  function run() {
    setPlayed(true);
    if (reduce) {
      local.set(local.get() > 0.5 ? (play.from ?? 0) : play.to);
      return;
    }
    const at = local.get();
    const target = at > (play.to + (play.from ?? 0)) / 2 ? (play.from ?? 0) : play.to;
    animate(local, target, { duration: play.ms / 1000, ease: ease.outQuart });
  }

  const Screen = pillar === "design" ? Brand : pillar === "automate" ? Agent : Map;

  return (
    <div className={active ? "sp-panel sp-panel--on" : "sp-panel"} aria-hidden={!compact && !active}>
      <div className="sp-copy">
        <h3 className="type-display-l sp-name">{PILLAR_NAME[pillar]}</h3>
        <p className="sp-promise">{PROMISE[pillar]}</p>
        <ul className="sp-chips">
          {PILLAR_SERVICES[pillar].map(function chip(s) {
            return (
              <li key={s.name}>
                <Link className="sp-chip" to={`/services#${serviceSlug(s.name)}`}>
                  {s.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="sp-stage">
        <div className="sp-screen">
          {active || compact ? (
            <Suspense fallback={null}>
              <Screen local={local} compact={compact} />
            </Suspense>
          ) : null}
        </div>
        <div className="sp-play">
          <button type="button" className="sp-btn" onClick={run}>
            {play.label}
          </button>
          <span className={played ? "sp-cue sp-cue--off" : "sp-cue"} aria-hidden>
            press it
          </span>
        </div>
      </div>
    </div>
  );
}

export default function ServicePanels() {
  const reduce = !!useReducedMotion();
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [i, setI] = useState(0);
  const [compact, setCompact] = useState(false);
  /** A tab click wins until the reader scrolls again. */
  const pickedRef = useRef(false);

  useEffect(function watch() {
    const mq = window.matchMedia("(max-width: 1023px)");
    function on(e: MediaQueryList | MediaQueryListEvent) {
      setCompact(e.matches);
    }
    on(mq);
    mq.addEventListener("change", on);
    return function off() {
      mq.removeEventListener("change", on);
    };
  }, []);

  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", function track(p) {
    if (pickedRef.current) return;
    const n = PILLAR_ORDER.length;
    setI(Math.min(n - 1, Math.max(0, Math.floor(p * n * 0.999))));
  });

  function jump(n: number) {
    setI(n);
    pickedRef.current = true;
    const el = wrapRef.current;
    if (!el) return;
    const span = el.offsetHeight - window.innerHeight;
    const top = el.offsetTop + span * ((n + 0.5) / PILLAR_ORDER.length);
    window.scrollTo({ top, behavior: reduce ? "auto" : "smooth" });
    window.setTimeout(function release() {
      pickedRef.current = false;
    }, 900);
  }

  if (compact || reduce) {
    return (
      <section className="sp sp--stacked">
        <SPHead />
        {PILLAR_ORDER.map(function panel(p) {
          return <Panel key={p} pillar={p} active compact />;
        })}
        <SPFoot />
      </section>
    );
  }

  return (
    <div ref={wrapRef} className="sp-wrap">
      <section className="sp sp--pinned">
        <SPHead />
        <div className="sp-tabs" role="tablist" aria-label="What we do">
          {PILLAR_ORDER.map(function tab(p, n) {
            return (
              <button
                key={p}
                role="tab"
                type="button"
                aria-selected={n === i}
                className={n === i ? "sp-tab sp-tab--on" : "sp-tab"}
                onClick={function go() {
                  jump(n);
                }}
              >
                {PILLAR_NAME[p]}
              </button>
            );
          })}
        </div>

        <div className="sp-stack">
          {PILLAR_ORDER.map(function panel(p, n) {
            return (
              <motion.div
                key={p}
                className="sp-slot"
                animate={{ opacity: n === i ? 1 : 0, y: n === i ? 0 : 18 }}
                transition={{ duration: reduce ? 0 : duration.base, ease: ease.outQuart }}
                style={{ pointerEvents: n === i ? "auto" : "none" }}
              >
                <Panel pillar={p} active={n === i} compact={false} />
              </motion.div>
            );
          })}
        </div>

        <SPFoot />
      </section>
    </div>
  );
}

function SPHead() {
  return (
    <div className="sp-head">
      <div className="type-eyebrow sp-eyebrow">//_WHAT WE DO</div>
      <h2 className="type-h2 sp-h2">Sixteen services. Three things they add up to.</h2>
    </div>
  );
}

function SPFoot() {
  return (
    <div className="sp-foot">
      <MagneticCTA to="/services" variant="text" size="md">
        Watch all 16 being built
      </MagneticCTA>
    </div>
  );
}
