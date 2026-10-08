import { useCallback, useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import type { MotionValue } from "motion/react";
import { duration, easing } from "../../lib/motion";
import { ReadFill } from "../case-study/ReadFill";
import { PRINCIPLES, type Principle, type PrincipleTone } from "../../data/principles";
import TemplateToCrafted from "./demos/TemplateToCrafted";
import DirectionSheet from "./demos/DirectionSheet";
import MotionLanguage from "./demos/MotionLanguage";
import AgesWell from "./demos/AgesWell";

/**
 * The principles playground — /about's signature mechanic.
 *
 * Four panels on one horizontal track, driven by vertical scroll from a
 * SINGLE scroll value. The wrapper is 4 × 100vh of travel plus the extra
 * viewport the n+1 rule wants (§5.4), so panel 04 gets real pinned time
 * instead of sliding past as the sticky lets go.
 *
 * The track's x is STEPPED rather than linear: each panel holds for most
 * of its slot and the move between them is eased. A linear map would put
 * every panel on its mark for one instant and spend the rest of the
 * scroll mid-slide.
 *
 * Each panel carries its own ground, so the cream / alt / cream / dark
 * rhythm the four principles always had survives the rebuild — and the
 * stage still hands the next chapter a dark edge, which is what
 * `Chapter from="dark"` downstream is expecting.
 *
 * The only scroll-linked style in the sticky frame is the track's
 * transform. No scroll-linked opacity (§5.1), no ViewTimeline.
 *
 * Below 900px, and under reduced motion, the track becomes a stack: the
 * demos keep working, nothing is driven by scroll.
 */

const N = 4;

/** Hold for most of a slot, ease between them. */
const STOPS = [0, 0.08, 0.25, 0.42, 0.58, 0.75, 0.92, 1];
const FRAMES = [0, 0, -100, -100, -200, -200, -300, -300];
/** Where each panel sits still — the progress marks scroll to these. */
const CENTRES = [0.04, 0.335, 0.665, 0.96];
/**
 * The slice of the track over which each panel's body fills itself. It
 * starts as the panel arrives and finishes while it is still on its
 * mark, so the reading never runs on a panel that is sliding away.
 */
const FILL: [number, number][] = [
  [0, 0.07],
  [0.25, 0.39],
  [0.58, 0.72],
  [0.91, 0.99],
];

const DEMOS = [TemplateToCrafted, DirectionSheet, MotionLanguage, AgesWell];

type Skin = { bg: string; ink: string; muted: string };

function skin(tone: PrincipleTone): Skin {
  if (tone === "dark") {
    return {
      bg: "var(--color-dark)",
      ink: "var(--color-parch)",
      muted: "var(--color-muted-l)",
    };
  }
  return {
    bg: tone === "alt" ? "var(--color-bg-alt)" : "var(--color-bg)",
    ink: "var(--color-ink)",
    muted: "var(--color-muted)",
  };
}

export default function PrinciplesTrack() {
  const reduce = useReducedMotion();
  const [stacked, setStacked] = useState(false);

  useEffect(function watchWidth() {
    const mq = window.matchMedia("(max-width: 899px)");
    setStacked(mq.matches);
    function on(e: MediaQueryListEvent) {
      setStacked(e.matches);
    }
    mq.addEventListener("change", on);
    return function off() {
      mq.removeEventListener("change", on);
    };
  }, []);

  if (stacked || reduce) return <StackedPrinciples />;
  return <TrackedPrinciples />;
}

/* ── desktop: the pinned track ────────────────────────────────────── */

function TrackedPrinciples() {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ["start start", "end end"],
  });

  // `easing.*` callables, never the `ease.*` tuples — useTransform calls
  // what it is handed and a tuple throws at runtime (§5.14).
  const x = useTransform(scrollYProgress, STOPS, FRAMES, {
    ease: STOPS.slice(1).map(() => easing.inOut),
  });
  const xVw = useTransform(x, (v) => `${v}vw`);

  const [active, setActive] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", function nearestPanel(p) {
    let best = 0;
    let bestD = Infinity;
    for (let i = 0; i < CENTRES.length; i++) {
      const d = Math.abs(p - CENTRES[i]);
      if (d < bestD) {
        bestD = d;
        best = i;
      }
    }
    setActive(best);
  });

  const jump = useCallback(function jumpTo(i: number) {
    const el = wrapRef.current;
    if (!el) return;
    const travel = el.offsetHeight - window.innerHeight;
    const top = el.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: top + travel * CENTRES[i], behavior: "smooth" });
  }, []);

  const marks = skin(PRINCIPLES[active].tone);
  const onDark = PRINCIPLES[active].tone === "dark";

  return (
    <div
      ref={wrapRef}
      style={{ height: `${(N + 1) * 100}vh`, position: "relative" }}
    >
      <section
        aria-label="How the studio works"
        style={{ position: "sticky", top: 0, height: "100vh", overflow: "hidden" }}
      >
        <motion.div
          style={{
            display: "flex",
            width: `${N * 100}vw`,
            height: "100%",
            x: xVw,
            willChange: "transform",
          }}
        >
          {PRINCIPLES.map((p, i) => (
            <Panel
              key={p.n}
              principle={p}
              active={active === i}
              index={i}
              track={scrollYProgress}
            />
          ))}
        </motion.div>

        <div className="pt-marks">
          {PRINCIPLES.map((p, i) => (
            <button
              key={p.n}
              type="button"
              aria-current={active === i ? "true" : undefined}
              aria-label={`Principle ${p.n} — ${p.title}`}
              className={active === i ? "pt-mark pt-mark--on" : "pt-mark"}
              onClick={() => jump(i)}
            >
              <span className="pt-mark__bar" />
              <span className="pt-mark__n">{p.n}</span>
            </button>
          ))}
        </div>
      </section>

      <style>{`
        .pt-marks {
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          bottom: 34px;
          display: flex;
          gap: 8px;
          z-index: 2;
        }
        .pt-mark {
          background: none; border: none; cursor: pointer; padding: 10px 6px;
          display: flex; flex-direction: column; align-items: center; gap: 7px;
          min-width: 46px; min-height: 44px; font-family: inherit;
        }
        .pt-mark__bar {
          display: block; width: 32px; height: 2px; border-radius: 2px;
          background: ${onDark ? "rgba(237,233,226,0.28)" : "rgba(20,20,18,0.22)"};
          transition: background ${duration.base}s ease, width ${duration.base}s ease;
        }
        .pt-mark--on .pt-mark__bar { background: ${marks.ink}; width: 44px; }
        .pt-mark__n {
          font-family: var(--font-mono); font-size: 11px; letter-spacing: 0.08em;
          color: ${marks.muted};
          transition: color ${duration.base}s ease;
        }
        .pt-mark--on .pt-mark__n { color: ${marks.ink}; }
        .pt-mark:focus-visible { outline: 2px solid ${marks.ink}; outline-offset: 2px; border-radius: 8px; }

        .pt-panel {
          height: 100%;
          width: 100%;
          max-width: var(--container-wide);
          margin: 0 auto;
          display: grid;
          grid-template-columns: minmax(0, 0.92fr) minmax(0, 1.08fr);
          gap: 64px;
          align-items: center;
          padding-bottom: 76px;
        }
        /* The frames size to their content; the cap is a guard for a
           short viewport, not the working height. */
        .pt-demo { min-width: 0; align-self: center; max-height: min(74vh, 600px); overflow: hidden; }
        @media (max-width: 1200px) {
          .pt-panel { gap: 44px; }
        }
      `}</style>
    </div>
  );
}

function Panel({
  principle,
  active,
  index,
  track,
}: {
  principle: Principle;
  active: boolean;
  index: number;
  track: MotionValue<number>;
}) {
  const reduce = !!useReducedMotion();
  const s = skin(principle.tone);
  const Demo = DEMOS[index];
  // The body fills off the SAME scroll value that drives the track —
  // the panel is pinned, so it is not moving through its own
  // scrollport and useScroll on it would never progress.
  const fill = useTransform(track, FILL[index], [0, 1], { clamp: true });
  return (
    <div
      style={{
        width: "100vw",
        flex: "0 0 100vw",
        height: "100%",
        position: "relative",
        background: s.bg,
      }}
    >
      {principle.tone === "dark" ? <div className="grain-dark" aria-hidden="true" /> : null}
      <div className="pt-panel">
        <div style={{ minWidth: 0 }}>
          <div className="type-eyebrow" style={{ color: s.muted }}>
            Principle {principle.n}
          </div>
          <h2
            className="type-h1"
            style={{ color: s.ink, margin: "18px 0 22px" }}
          >
            {principle.title}
          </h2>
          <ReadFill
            text={principle.body}
            progress={fill}
            reduce={reduce}
            className="type-body-lg measure-body"
            style={{ color: s.muted }}
          />
        </div>
        <div className="pt-demo">
          <Demo active={active} dark={principle.tone === "dark"} />
        </div>
      </div>
    </div>
  );
}

/* ── mobile and reduced motion: the same four, stacked ────────────── */

function StackedPrinciples() {
  return (
    <section aria-label="How the studio works">
      {PRINCIPLES.map(function stack(p, i) {
        return <StackedPrinciple key={p.n} principle={p} index={i} />;
      })}
    </section>
  );
}

function StackedPrinciple({ principle, index }: { principle: Principle; index: number }) {
  const reduce = !!useReducedMotion();
  const s = skin(principle.tone);
  const Demo = DEMOS[index];
  // Here the paragraph DOES move through the scrollport, so it reads off
  // its own position.
  const ref = useRef<HTMLParagraphElement | null>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 92%", "end 62%"] });

  return (
    <div style={{ position: "relative", background: s.bg, padding: "88px 0" }}>
      {principle.tone === "dark" ? <div className="grain-dark" aria-hidden="true" /> : null}
      <div
        style={{ position: "relative", maxWidth: "var(--container-wide)", margin: "0 auto" }}
      >
        <div className="type-eyebrow" style={{ color: s.muted }}>
          Principle {principle.n}
        </div>
        <h2 className="type-h2" style={{ color: s.ink, margin: "14px 0 18px" }}>
          {principle.title}
        </h2>
        <div ref={ref} style={{ marginBottom: 30 }}>
          <ReadFill
            text={principle.body}
            progress={scrollYProgress}
            reduce={reduce}
            className="type-body-lg"
            style={{ color: s.muted }}
          />
        </div>
        {/* `active` is true for all four here: nothing is scroll-driven,
            so every demo shows its settled state and stays interactive. */}
        <div style={{ height: 440 }}>
          <Demo active stacked dark={principle.tone === "dark"} />
        </div>
      </div>
    </div>
  );
}
