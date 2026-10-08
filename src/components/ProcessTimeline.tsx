import { useEffect, useRef, useState } from "react";
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from "motion/react";
import { duration, ease, easing } from "../lib/motion";

/**
 * The process line — five stages on one line that draws as you reach it.
 *
 * Rebuilt in Session 18b. It used to be five cards with an SVG rule
 * behind them, each card arriving on its own whileInView timer, so the
 * rule and the cards told slightly different stories. Now one scroll
 * value drives everything: the line's scaleX, which node is lit, and
 * which step has spoken. The line reaching a node IS the node lighting.
 *
 * Normal flow, never sticky — the brief is a line you scroll past, not a
 * stage you are held in. Below 900px the same line runs vertically.
 */

type Step = {
  n: string;
  name: string;
  duration: string;
  body: string;
};

const STEPS: Step[] = [
  {
    n: "01",
    name: "Direction",
    duration: "Week 1",
    body: "Palette, typography, signature moves, interaction plan. One checkpoint. Locked before any code.",
  },
  {
    n: "02",
    name: "Design",
    duration: "Week 1-2",
    body: "Section-by-section build. Self-critique per section. Portfolio-quality bar before moving to the next.",
  },
  {
    n: "03",
    name: "Build",
    duration: "Week 2-3",
    body: "Framer or Next.js. Motion, interaction, responsive system. Zero template sections.",
  },
  {
    n: "04",
    name: "Refine",
    duration: "Week 3",
    body: "Polish pass. Accessibility audit. Mobile-first review. Reduced-motion verified.",
  },
  {
    n: "05",
    name: "Ship",
    duration: "Week 3-4",
    body: "Launch, monitor, iterate. 30-day post-launch window included.",
  },
];

const LINE = "#B18544";
const LINE_TEXT = "#B18544";

export default function ProcessTimeline() {
  const reduce = useReducedMotion();
  const [isDesktop, setIsDesktop] = useState(true);
  useEffect(function detect() {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(min-width: 901px)");
    setIsDesktop(mq.matches);
    function onChange(e: MediaQueryListEvent) {
      setIsDesktop(e.matches);
    }
    mq.addEventListener("change", onChange);
    return function cleanup() {
      mq.removeEventListener("change", onChange);
    };
  }, []);

  const ref = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 85%", "end 55%"],
  });
  // `easing.*` is a callable; the `ease.*` tuples throw here (§5.14).
  const draw = useTransform(scrollYProgress, [0, 1], [0, 1], { ease: easing.outQuart });

  // How many nodes the line has reached. Derived from the same value
  // that draws the line, so the two can never disagree.
  const [reached, setReached] = useState(reduce ? STEPS.length : 0);
  useMotionValueEvent(draw, "change", function light(p) {
    const n = STEPS.reduce((acc, _s, i) => (p >= i / (STEPS.length - 1) - 0.001 ? i + 1 : acc), 0);
    setReached(n);
  });

  const vertical = !isDesktop;
  const lit = reduce ? STEPS.length : reached;

  return (
    <div ref={ref} className={vertical ? "pl pl--v" : "pl"} style={{ position: "relative" }}>
      {/* the rail, and the line that draws along it */}
      <div className="pl-rail" aria-hidden>
        <motion.div
          className="pl-draw"
          style={
            reduce
              ? { transform: vertical ? "scaleY(1)" : "scaleX(1)" }
              : vertical
                ? { scaleY: draw }
                : { scaleX: draw }
          }
        />
      </div>

      <ol className="pl-steps">
        {STEPS.map(function drawStep(step, i) {
          const on = i < lit;
          return (
            <li key={step.n} className={on ? "pl-step pl-step--on" : "pl-step"}>
              <span className="pl-node" aria-hidden />
              <motion.div
                className="pl-text"
                initial={false}
                animate={{ opacity: on ? 1 : 0, y: on || reduce ? 0 : 14 }}
                transition={{ duration: reduce ? 0 : duration.slow, ease: ease.outQuart }}
              >
                <span className="pl-n">{step.n}</span>
                <span className="type-h3 pl-name">{step.name}</span>
                <span className="pl-week">{step.duration}</span>
                <p className="type-body pl-body">{step.body}</p>
              </motion.div>
            </li>
          );
        })}
      </ol>

      <style>{`
        .pl { max-width: var(--container-wide); margin: 0 auto; }

        .pl-rail {
          position: absolute;
          left: 10%; width: 80%;
          top: 7px; height: 2px;
          background: rgba(20,20,18,0.14);
          border-radius: 2px;
        }
        .pl-draw {
          width: 100%; height: 100%;
          background: ${LINE};
          border-radius: 2px;
          transform-origin: left center;
          will-change: transform;
        }

        .pl-steps {
          position: relative;
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 24px;
          list-style: none;
          margin: 0; padding: 0;
        }
        .pl-step { display: flex; flex-direction: column; align-items: flex-start; min-width: 0; }

        .pl-node {
          width: 16px; height: 16px; border-radius: 50%;
          background: var(--color-bg-alt);
          border: 2px solid rgba(20,20,18,0.18);
          /* the node sits centred on its column, on the rail */
          margin-left: calc(50% - 8px);
          transition: border-color ${duration.base}s ease, background ${duration.base}s ease,
                      box-shadow ${duration.base}s ease;
        }
        .pl-step--on .pl-node {
          border-color: ${LINE};
          background: ${LINE};
          box-shadow: 0 0 0 5px rgba(177,133,68,0.16);
        }

        .pl-text { display: flex; flex-direction: column; gap: 10px; padding-top: 26px; }
        .pl-n {
          font-family: var(--font-mono); font-size: 13px; letter-spacing: 0.08em;
          color: var(--color-muted-2);
        }
        .pl-name { color: var(--color-ink); }
        .pl-week {
          font-family: var(--font-mono); font-size: 13px; letter-spacing: 0.06em;
          color: ${LINE_TEXT};
        }
        .pl-body { color: var(--color-muted-2); margin: 0; max-width: 40ch; }

        /* ── the same line, running down ── */
        .pl--v .pl-rail {
          left: 7px; width: 2px;
          top: 8px; height: calc(100% - 16px);
        }
        .pl--v .pl-draw { transform-origin: center top; }
        .pl--v .pl-steps {
          grid-template-columns: 1fr;
          gap: 44px;
        }
        .pl--v .pl-step { flex-direction: row; align-items: flex-start; gap: 22px; }
        .pl--v .pl-node { margin-left: 0; flex: 0 0 16px; }
        .pl--v .pl-text { padding-top: 0; margin-top: -3px; }
      `}</style>
    </div>
  );
}
