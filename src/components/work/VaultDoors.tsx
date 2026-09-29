import { useEffect, useRef, useState } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import { duration, ease, easing } from "../../lib/motion";
import { useScrollStyle } from "../../lib/useScrollStyle";
import LineReveal from "../LineReveal";
import { liveCount } from "../../data/workIndex";

/** Load timings, unchanged from the old header. */
const T = { eyebrow: 0.2, h1: 0.35, sub: 0.9 };

/**
 * The vault doors — an overlay, not a section.
 *
 * Two cream panels sit ON TOP of the pinned film and part to reveal it, so
 * the first project is already in place behind them and there is no empty
 * stage at any scroll position. (A dark rectangle growing from a slit left
 * the stage blank until the film's own wrapper began.)
 *
 * Panels move in measured pixels: they have to clear the viewport exactly.
 */
export default function VaultDoors({ lead = 1.5 }: { lead?: number }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement | null>(null);
  const [vw, setVw] = useState(0);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  useEffect(function measure() {
    function read() {
      setVw(document.documentElement.clientWidth);
    }
    read();
    window.addEventListener("resize", read);
    return function cleanup() {
      window.removeEventListener("resize", read);
    };
  }, []);

  const d = function delay(v: number) {
    return reduce ? 0 : v;
  };

  if (reduce) return null;

  return (
    <div
      ref={ref}
      className="vault-doors"
      aria-hidden
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: `${lead * 100}vh`,
        zIndex: 10,
        pointerEvents: "none",
      }}
    >
      <div style={{ position: "sticky", top: 0, height: "100vh", overflow: "hidden" }}>
        <Panel side={-1} progress={scrollYProgress} vw={vw} />
        <Panel side={1} progress={scrollYProgress} vw={vw} />

        {/* the title rides on the doors and leaves with them */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            zIndex: 3,
            padding: "0 var(--gutter)",
          }}
        >
          <Fading progress={scrollYProgress} range={[0, 0.17]}>
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: d(0.5), ease: ease.outQuart, delay: d(T.eyebrow) }}
              className="type-eyebrow"
              style={{ color: "var(--color-muted)", marginBottom: 28 }}
            >
              Selected work · {liveCount} live
            </motion.div>
          </Fading>

          <h1
            aria-label="The vault."
            className="type-display-2xl"
            style={{
              color: "var(--color-ink)",
              margin: 0,
              display: "flex",
              gap: "0.25em",
              whiteSpace: "nowrap",
            }}
          >
            <Half progress={scrollYProgress} vw={vw} side={-1}>
              <LineReveal delay={d(T.h1)} duration={duration.slow}>
                The
              </LineReveal>
            </Half>
            <Half progress={scrollYProgress} vw={vw} side={1}>
              <LineReveal delay={d(T.h1)} duration={duration.slow}>
                vault.
              </LineReveal>
            </Half>
          </h1>

          <Fading progress={scrollYProgress} range={[0, 0.15]}>
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: d(0.6), ease: ease.outQuart, delay: d(T.sub) }}
              className="type-body-lg measure-body"
              style={{ color: "var(--color-muted)", margin: "32px auto 0" }}
            >
              Every project below is real. Numbers are measured, not marketing.
              Descriptions are what happened, not what we wish we had.
            </motion.p>
          </Fading>
        </div>
      </div>
    </div>
  );
}

/** One cream door, sliding off its own edge. */
function Panel({
  side,
  progress,
  vw,
}: {
  side: 1 | -1;
  progress: MotionValue<number>;
  vw: number;
}) {
  const x = useTransform(progress, [0.05, 0.3], [0, side * (vw / 2 + 2)], {
    ease: [easing.inOut],
  });

  return (
    <motion.div
      style={{
        position: "absolute",
        top: 0,
        bottom: 0,
        left: side === -1 ? 0 : "50%",
        width: "50%",
        backgroundColor: "var(--color-bg)",
        zIndex: 2,
        x,
      }}
    >
      <div className="grain-light" aria-hidden="true" />
    </motion.div>
  );
}

/** One half of the title, walking off its own edge as it fades. */
function Half({
  progress,
  vw,
  side,
  children,
}: {
  progress: MotionValue<number>;
  vw: number;
  side: 1 | -1;
  children: React.ReactNode;
}) {
  const x = useTransform(progress, [0, 0.3], [0, side * vw * 0.32], {
    ease: [easing.inOut],
  });
  const opacity = useTransform(progress, [0.06, 0.24], [1, 0]);
  const ref = useScrollStyle<HTMLSpanElement>(opacity);

  return (
    <motion.span ref={ref} style={{ display: "inline-block", x }}>
      {children}
    </motion.span>
  );
}

/** Fades up and out of the way as the doors part. */
function Fading({
  progress,
  range,
  children,
}: {
  progress: MotionValue<number>;
  range: [number, number];
  children: React.ReactNode;
}) {
  const opacity = useTransform(progress, range, [1, 0]);
  const y = useTransform(progress, range, [0, -24], { ease: [easing.inOut] });
  const ref = useScrollStyle<HTMLDivElement>(opacity);

  return (
    <motion.div ref={ref} style={{ y }}>
      {children}
    </motion.div>
  );
}
