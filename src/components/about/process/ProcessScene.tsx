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
import SiteWindow from "./SiteWindow";
import { STEPS } from "./steps";

/**
 * "One site, idea to live" — the process, as a thing that happens.
 *
 * A pinned stage holding ONE browser window. The same fictional local
 * business homepage rises in fidelity through the five stages, so the
 * process is shown rather than listed. One scroll value drives which
 * stage is active, the playhead's position, and every sub-animation
 * that would otherwise want a timer — the sketch drawing, the code
 * typing, the pins resolving, the score counting.
 *
 * Pin math per the handoff: five stages of travel plus the extra
 * viewport the n+1 rule wants, so the last stage gets real pinned time
 * rather than sliding away as the sticky lets go.
 *
 * Below 900px and under reduced motion it becomes five stacked blocks,
 * each showing the window at that stage's completed state.
 */

const N = STEPS.length; // 5

/** Hold for most of a slot, ease between. */
const STOPS = [0, 0.09, 0.19, 0.29, 0.39, 0.49, 0.59, 0.69, 0.79, 0.9, 1];
const FRAMES = [0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 4];
/** Each stage's dwell, for the scroll-driven sub-animations. */
const DWELL: [number, number][] = [
  [0, 0.09],
  [0.19, 0.29],
  [0.39, 0.49],
  [0.59, 0.69],
  [0.79, 1],
];
/** Where each stage sits still — the rail's buttons scroll to these. */
const CENTRES = [0.045, 0.24, 0.44, 0.64, 0.9];

export default function ProcessScene() {
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

  if (stacked || reduce) return <StackedProcess reduce={!!reduce} />;
  return <PinnedProcess />;
}

/* ── desktop: the pinned scene ────────────────────────────────────── */

function PinnedProcess() {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress: pin } = useScroll({
    target: wrapRef,
    offset: ["start start", "end end"],
  });

  // `easing.*` callables; the `ease.*` tuples throw in useTransform (§5.14)
  const stageV = useTransform(pin, STOPS, FRAMES, {
    ease: STOPS.slice(1).map(() => easing.inOut),
  });
  // the playhead reads the same value, so it can never disagree with
  // which stage is lit
  const headX = useTransform(stageV, (v) => `${(v / (N - 1)) * 100}%`);

  const [active, setActive] = useState(0);
  useMotionValueEvent(stageV, "change", function onStage(v) {
    const i = Math.max(0, Math.min(N - 1, Math.round(v)));
    setActive((was) => (was === i ? was : i));
  });

  // one dwell-progress value per stage, so the hook count never changes
  const w0 = useTransform(pin, DWELL[0], [0, 1], { clamp: true });
  const w1 = useTransform(pin, DWELL[1], [0, 1], { clamp: true });
  const w2 = useTransform(pin, DWELL[2], [0, 1], { clamp: true });
  const w3 = useTransform(pin, DWELL[3], [0, 1], { clamp: true });
  const w4 = useTransform(pin, DWELL[4], [0, 1], { clamp: true });
  const withins = [w0, w1, w2, w3, w4];

  // the sub-animations need a NUMBER, and they change slowly enough
  // that a state write per step is cheaper than it looks
  const [within, setWithin] = useState(0);
  useMotionValueEvent(withins[active], "change", function onWithin(v) {
    const q = Math.round(v * 60) / 60;
    setWithin((was) => (was === q ? was : q));
  });
  useEffect(
    function syncOnStageChange() {
      setWithin(withins[active].get());
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [active]
  );

  const jump = useCallback(function jumpTo(i: number) {
    const el = wrapRef.current;
    if (!el) return;
    const travel = el.offsetHeight - window.innerHeight;
    const top = el.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: top + travel * CENTRES[i], behavior: "smooth" });
  }, []);

  const step = STEPS[active];

  return (
    <div ref={wrapRef} style={{ height: `${(N + 1) * 100}vh`, position: "relative" }}>
      <div className="ps-sticky">
        <div className="ps">
          {/* the rail */}
          <div className="ps-rail">
            <div className="ps-track" aria-hidden="true">
              <motion.span className="ps-head" style={{ left: headX }} />
            </div>
            <div className="ps-stages">
              {STEPS.map((s, i) => (
                <button
                  key={s.n}
                  type="button"
                  className={active === i ? "ps-stage ps-stage--on" : "ps-stage"}
                  aria-current={active === i ? "step" : undefined}
                  onClick={() => jump(i)}
                >
                  <span className="ps-sn">{s.n}</span>
                  <span className="ps-sname">{s.name}</span>
                  <span className="ps-sweek">{s.duration}</span>
                </button>
              ))}
            </div>
          </div>

          {/* the window */}
          <div className="ps-window">
            <SiteWindow stage={active} within={within} reduce={false} />
          </div>

          {/* the stage's own words, swapped out then in */}
          <div className="ps-say">
            <AnimatePresence mode="wait" initial={false}>
              <motion.p
                key={step.n}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: duration.base, ease: ease.outQuart }}
                className="type-body"
              >
                {step.body}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>
      </div>

      <style>{`
        .ps-sticky { position: sticky; top: 0; height: 100vh; overflow: hidden; }
        .ps {
          height: 100%; max-width: var(--container-wide); margin: 0 auto;
          display: grid; grid-template-rows: auto 1fr auto;
          gap: clamp(14px, 2.2vh, 26px);
          padding: clamp(78px, 10vh, 104px) 0 clamp(24px, 4vh, 44px);
          align-content: center;
        }
        .ps-rail { position: relative; }
        .ps-track {
          position: relative; height: 2px; border-radius: 2px;
          background: rgba(20,20,18,0.14);
          margin: 0 10% 14px;
        }
        .ps-head {
          position: absolute; top: 50%; width: 12px; height: 12px;
          margin: -6px 0 0 -6px; border-radius: 50%;
          background: #B18544; box-shadow: 0 0 0 5px rgba(177,133,68,0.18);
        }
        .ps-stages { display: grid; grid-template-columns: repeat(5, 1fr); }
        .ps-stage {
          display: flex; flex-direction: column; align-items: center; gap: 3px;
          background: none; border: none; cursor: pointer;
          padding: 8px 6px; min-height: 44px; font: inherit;
          opacity: 0.45; transition: opacity ${duration.base}s ease;
        }
        .ps-stage--on { opacity: 1; }
        .ps-sn { font-family: var(--font-mono); font-size: 13px; letter-spacing: 0.08em; color: var(--color-muted-2); }
        .ps-sname { font-family: var(--font-display); font-weight: 500; font-size: 19px; color: var(--color-ink); }
        .ps-sweek { font-family: var(--font-mono); font-size: 13px; letter-spacing: 0.05em; color: #B18544; }
        .ps-stage:focus-visible { outline: 2px solid var(--color-ink); outline-offset: 2px; border-radius: 8px; }

        .ps-window { min-height: 0; display: flex; align-items: center; justify-content: center; }
        .ps-say { min-height: 52px; display: flex; justify-content: center; }
        .ps-say p { margin: 0; max-width: 62ch; text-align: center; color: var(--color-ink-soft); }
      `}</style>
    </div>
  );
}

/* ── mobile and reduced motion: five blocks ───────────────────────── */

function StackedProcess({ reduce }: { reduce: boolean }) {
  return (
    <div style={{ maxWidth: "var(--container-wide)", margin: "0 auto" }}>
      {STEPS.map((s, i) => (
        <StackedStage key={s.n} index={i} reduce={reduce} />
      ))}
    </div>
  );
}

function StackedStage({ index, reduce }: { index: number; reduce: boolean }) {
  const s = STEPS[index];
  const ref = useRef<HTMLDivElement | null>(null);
  const [played, setPlayed] = useState(reduce);

  // each block plays its own change once, on entry
  useEffect(
    function playOnce() {
      if (reduce) return;
      const el = ref.current;
      if (!el || typeof IntersectionObserver === "undefined") {
        setPlayed(true);
        return;
      }
      const io = new IntersectionObserver(
        (entries) => {
          if (entries.some((e) => e.isIntersecting)) {
            io.disconnect();
            setPlayed(true);
          }
        },
        { rootMargin: "-15% 0px" }
      );
      io.observe(el);
      return function off() {
        io.disconnect();
      };
    },
    [reduce]
  );

  return (
    <div ref={ref} style={{ marginBottom: index === STEPS.length - 1 ? 0 : 56 }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 6 }}>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, letterSpacing: "0.08em", color: "var(--color-muted-2)" }}>
          {s.n}
        </span>
        <span className="type-h3" style={{ color: "var(--color-ink)" }}>{s.name}</span>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, letterSpacing: "0.05em", color: "#B18544" }}>
          {s.duration}
        </span>
      </div>
      <p className="type-body" style={{ color: "var(--color-ink-soft)", margin: "0 0 16px", maxWidth: "54ch" }}>
        {s.body}
      </p>
      {/* the window at THIS stage's completed state */}
      <SiteWindow stage={index} within={played ? 1 : 0} reduce={reduce} />
    </div>
  );
}
