import { useCallback, useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { duration, ease, easing } from "../../../lib/motion";
import { ReadFill } from "../../case-study/ReadFill";
import { PRINCIPLES } from "../../../data/principles";
import Monitor from "./Monitor";
import ScreenCraft from "./ScreenCraft";
import ScreenDirection from "./ScreenDirection";
import ScreenMotion from "./ScreenMotion";
import ScreenAges from "./ScreenAges";
import { SPILLS } from "./types";

/**
 * The desk — /about's signature.
 *
 * One monitor, four things shown on it. The previous build put four
 * small cards on a horizontal track; the complaint was that they were
 * small and pale on an empty page, so the work is now shown at full
 * size on a real object and the room is lit by it.
 *
 * ONE scroll value drives everything: which screen is on, the caption,
 * the light spill, the progress marks. A second value — the approach,
 * before the pin starts — drives the dolly, so the monitor arrives
 * rather than being there already.
 *
 * The pin math is the handoff's: the wrapper is four screens of travel
 * plus the extra viewport the n+1 rule wants, and the mapping is
 * stepped so every principle holds on its mark instead of being passed
 * through. No timers anywhere.
 *
 * All four screens stay mounted and stacked, with only the active one
 * visible and reachable. That keeps each demo's state across a
 * hand-off, and — because they are opaque on an opaque monitor — it is
 * what makes the screen never go blank mid-change.
 */

const N = 4;
const SCREENS = [ScreenCraft, ScreenDirection, ScreenMotion, ScreenAges];

/** Hold for most of a slot, ease between them. */
const STOPS = [0, 0.1, 0.26, 0.42, 0.58, 0.74, 0.9, 1];
const FRAMES = [0, 0, 1, 1, 2, 2, 3, 3];
/** Where each screen sits still — the marks scroll to these. */
const CENTRES = [0.045, 0.34, 0.66, 0.955];
/** The slice over which each caption's body fills itself. */
const FILL: [number, number][] = [
  [0, 0.08],
  [0.26, 0.4],
  [0.58, 0.72],
  [0.9, 0.98],
];

export default function PrincipleDesk() {
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

  if (stacked || reduce) return <StackedDesk />;
  return <PinnedDesk />;
}

/* ── desktop: the pinned desk ─────────────────────────────────────── */

function PinnedDesk() {
  const wrapRef = useRef<HTMLDivElement | null>(null);

  // the pin itself
  const { scrollYProgress: pin } = useScroll({
    target: wrapRef,
    offset: ["start start", "end end"],
  });
  // the approach — everything before the pin begins — drives the dolly
  const { scrollYProgress: approach } = useScroll({
    target: wrapRef,
    offset: ["start end", "start start"],
  });

  // `easing.*` callables; the `ease.*` tuples throw in useTransform (§5.14)
  const dolly = useTransform(approach, [0.25, 1], [0.88, 1], {
    ease: easing.outQuart,
    clamp: true,
  });
  const tilt = useTransform(approach, [0.25, 1], [6, 0], {
    ease: easing.outQuart,
    clamp: true,
  });

  const stepped = useTransform(pin, STOPS, FRAMES, {
    ease: STOPS.slice(1).map(() => easing.inOut),
  });

  const [active, setActive] = useState(0);
  useMotionValueEvent(stepped, "change", function onStep(v) {
    const i = Math.max(0, Math.min(N - 1, Math.round(v)));
    setActive(i);
  });

  // one fill value per caption, so the hook count never changes
  const f0 = useTransform(pin, FILL[0], [0, 1], { clamp: true });
  const f1 = useTransform(pin, FILL[1], [0, 1], { clamp: true });
  const f2 = useTransform(pin, FILL[2], [0, 1], { clamp: true });
  const f3 = useTransform(pin, FILL[3], [0, 1], { clamp: true });
  const fills = [f0, f1, f2, f3];

  const jump = useCallback(function jumpTo(i: number) {
    const el = wrapRef.current;
    if (!el) return;
    const travel = el.offsetHeight - window.innerHeight;
    const top = el.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: top + travel * CENTRES[i], behavior: "smooth" });
  }, []);

  return (
    <div ref={wrapRef} style={{ height: `${(N + 1) * 100}vh`, position: "relative" }}>
      <section
        aria-label="How the studio works"
        style={{ position: "sticky", top: 0, height: "100vh", overflow: "hidden" }}
      >
        <div className="desk">
          <div className="desk-caption">
          <Caption index={active} progress={fills[active]} reduce={false} />

          </div>

          <div className="desk-screen">
            <Monitor
              dolly={dolly}
              tilt={tilt}
              spill={SPILLS[active]}
              scanKey={active}
              reduce={false}
            >
              {PRINCIPLES.map((p, i) => {
                const Screen = SCREENS[i];
                const on = active === i;
                return (
                  <motion.div
                    key={p.n}
                    // every screen stays mounted so its state survives a
                    // hand-off; only the active one is visible and
                    // reachable, and all of them are opaque, so the
                    // monitor is never blank during a change
                    className="desk-slot"
                    inert={!on}
                    aria-hidden={!on}
                    initial={false}
                    animate={{ opacity: on ? 1 : 0 }}
                    transition={{ duration: duration.base, ease: ease.outQuart }}
                    style={{ zIndex: on ? 2 : 1 }}
                  >
                    <Screen active={on} dark />
                  </motion.div>
                );
              })}
            </Monitor>
          </div>
        </div>

        <div className="desk-marks">
          {PRINCIPLES.map((p, i) => (
            <button
              key={p.n}
              type="button"
              aria-current={active === i ? "true" : undefined}
              aria-label={`Principle ${p.n} — ${p.title}`}
              className={active === i ? "desk-mark desk-mark--on" : "desk-mark"}
              onClick={() => jump(i)}
            >
              <span className="desk-mark__bar" />
              <span className="desk-mark__n">{p.n}</span>
            </button>
          ))}
        </div>
      </section>

      <style>{`
        .desk {
          height: 100%;
          width: 100%;
          max-width: var(--container-wide);
          margin: 0 auto;
          display: grid;
          grid-template-columns: minmax(0, 34fr) minmax(0, 62fr);
          gap: 4%;
          align-items: center;
          padding-bottom: 68px;
        }
        .desk-screen { min-width: 0; }
        /* The four captions differ in height by up to 123px, and a
           centred column meant every hand-off moved them — 0.026 CLS
           across a traversal. The box reserves the tallest, and the
           captions start at the same y instead of being centred, so the
           eyebrow no longer jumps between principles either. */
        .desk-caption {
          min-width: 0;
          min-height: 460px;
          display: flex;
          align-items: flex-start;
        }
        .desk-slot { position: absolute; inset: 0; }

        .desk-marks {
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          bottom: 26px;
          display: flex;
          gap: 8px;
          z-index: 4;
        }
        .desk-mark {
          background: none; border: none; cursor: pointer; padding: 10px 6px;
          display: flex; flex-direction: column; align-items: center; gap: 7px;
          min-width: 46px; min-height: 44px; font-family: inherit;
        }
        .desk-mark__bar {
          display: block; width: 32px; height: 2px; border-radius: 2px;
          background: var(--about-hair-hi);
          transition: background ${duration.base}s ease, width ${duration.base}s ease,
                      box-shadow ${duration.base}s ease;
        }
        .desk-mark--on .desk-mark__bar {
          background: var(--about-glow);
          width: 46px;
          box-shadow: 0 0 10px rgba(61,107,255,0.7);
        }
        .desk-mark__n {
          font-family: var(--font-mono); font-size: 13px; letter-spacing: 0.08em;
          color: var(--about-body); transition: color ${duration.base}s ease;
        }
        .desk-mark--on .desk-mark__n { color: var(--about-ink); }
        .desk-mark:focus-visible { outline: 2px solid var(--about-glow-text); outline-offset: 2px; border-radius: 8px; }

        @media (max-width: 1200px) { .desk { gap: 3%; } }
      `}</style>
    </div>
  );
}

/* ── the caption, swapped out then in ─────────────────────────────── */

function Caption({
  index,
  progress,
  reduce,
}: {
  index: number;
  progress: React.ComponentProps<typeof ReadFill>["progress"];
  reduce: boolean;
}) {
  const p = PRINCIPLES[index];
  return (
    <div style={{ minWidth: 0, position: "relative" }}>
      {/* mode="wait" IS the sequencing: the old caption finishes leaving
          before the new one arrives, with no timer to keep in step. */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={p.n}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: duration.base, ease: ease.outQuart }}
          style={{ display: "flex", flexDirection: "column", gap: 18 }}
        >
          <span className="type-eyebrow" style={{ color: "var(--about-glow-text)" }}>
            Principle {p.n}
          </span>
          <h2
            className="type-display-l"
            style={{ color: "var(--about-ink)", margin: 0 }}
          >
            {p.title}
          </h2>
          <ReadFill
            text={p.body}
            progress={progress}
            reduce={reduce}
            className="type-body"
            style={{ color: "var(--about-body)", maxWidth: "40ch" }}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/* ── mobile and reduced motion: caption, then a framed screen ─────── */

function StackedDesk() {
  return (
    /* overflow-x: clip, not hidden — the spill is MEANT to bleed past
       the monitor vertically; only the horizontal leak is a bug, and
       the pinned stage clips it for free where it is sticky. */
    <section
      aria-label="How the studio works"
      style={{ padding: "80px 0", overflowX: "clip" }}
    >
      {PRINCIPLES.map(function stack(p, i) {
        return <StackedPrinciple key={p.n} index={i} />;
      })}
    </section>
  );
}

function StackedPrinciple({ index }: { index: number }) {
  const reduce = !!useReducedMotion();
  const p = PRINCIPLES[index];
  const Screen = SCREENS[index];
  const ref = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 92%", "end 62%"],
  });

  return (
    <div
      style={{
        maxWidth: "var(--container-wide)",
        margin: "0 auto",
        marginBottom: index === PRINCIPLES.length - 1 ? 0 : 76,
      }}
    >
      <span className="type-eyebrow" style={{ color: "var(--about-glow-text)" }}>
        Principle {p.n}
      </span>
      <h2 className="type-h2" style={{ color: "var(--about-ink)", margin: "12px 0 14px" }}>
        {p.title}
      </h2>
      <div ref={ref} style={{ marginBottom: 24 }}>
        <ReadFill
          text={p.body}
          progress={scrollYProgress}
          reduce={reduce}
          className="type-body"
          style={{ color: "var(--about-body)" }}
        />
      </div>
      {/* the same monitor, at column width, with no dolly and no
          scanline — there is no hand-off to cover here */}
      <Monitor dolly={1} tilt={0} spill={SPILLS[index]} scanKey={0} reduce>
        <div style={{ position: "absolute", inset: 0 }}>
          <Screen active stacked dark />
        </div>
      </Monitor>
    </div>
  );
}
