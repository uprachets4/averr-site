import { useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { ease, easing, spring } from "../../lib/motion";
import { useScrollStyle } from "../../lib/useScrollStyle";
import { MARK_PATH_D } from "../MonogramMark";
import { CREDITS, FOUNDER_LINE } from "../about/FounderCredits";
import MagneticCTA from "../MagneticCTA";

/**
 * Chapter 4 — who builds it.
 *
 * The mark again, but drawn BY THE SCROLL rather than on a timer: the
 * stroke's `pathLength` is the chapter's own progress, so it is the
 * reader's hand on it. /about keeps its timed draw; this is the same
 * mark on a different clock, which is the point — home previews the
 * idea, it does not copy the mechanic.
 *
 * Once drawn, the mark leans toward the cursor.
 *
 * ASSET: `public/about/` is empty, so there is no founder photograph to
 * reveal as the mark completes. The chapter is built so that adding
 * `public/about/founder.webp` is the only change needed.
 */

/** The three credit lines this chapter prints, from the founder data. */
const SHOWN = ["Co-founded", "Sales", "Based"];

export default function FounderChapter() {
  const reduce = !!useReducedMotion();
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const markRef = useRef<HTMLDivElement | null>(null);
  const [drawn, setDrawn] = useState(false);

  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ["start end", "end start"],
  });

  /** The draw happens across the middle of the chapter's pass. */
  const length = useTransform(scrollYProgress, [0.16, 0.56], [0, 1], { ease: easing.inOut });
  const glow = useTransform(scrollYProgress, [0.4, 0.62], [0, 1]);
  const glowRef = useScrollStyle<HTMLDivElement>(glow);

  /* the lean, once it is there to lean */
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, spring.soft);
  const sry = useSpring(ry, spring.soft);

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    if (reduce || !markRef.current) return;
    const r = markRef.current.getBoundingClientRect();
    ry.set(((e.clientX - r.left) / r.width - 0.5) * 14);
    rx.set(-((e.clientY - r.top) / r.height - 0.5) * 14);
  }

  const credits = CREDITS.filter(function keep(c) {
    return SHOWN.includes(c.label);
  });

  return (
    <div ref={wrapRef} className="fc-wrap">
      <section className="fc">
        <div
          ref={markRef}
          className="fc-markbox"
          onMouseMove={onMove}
          onMouseLeave={function out() {
            rx.set(0);
            ry.set(0);
          }}
        >
          <motion.div
            className="fc-mark"
            style={{ rotateX: reduce ? 0 : srx, rotateY: reduce ? 0 : sry, transformPerspective: 900 }}
          >
            <svg viewBox="0 0 327 454" fill="none" role="img" aria-label="Averr Studios monogram" className="fc-svg">
              <motion.path
                d={MARK_PATH_D}
                fill="none"
                stroke="var(--color-ink)"
                strokeWidth={2}
                strokeLinecap="round"
                fillRule="evenodd"
                pathLength={1}
                style={{ pathLength: reduce ? 1 : length }}
                onUpdate={function watch(l: { pathLength?: number }) {
                  if (typeof l.pathLength === "number") setDrawn(l.pathLength > 0.96);
                }}
              />
            </svg>
            {/* the photograph lands here when one exists */}
            <div ref={glowRef as React.Ref<HTMLDivElement>} className="fc-glow" aria-hidden />
          </motion.div>
        </div>

        <div className="fc-copy">
          <div className="type-eyebrow fc-eyebrow">//_WHO BUILDS IT</div>
          <p className="fc-line">Here's who you'll work with.</p>
          <h2 className="type-h2 fc-h2">
            You work directly with{" "}
            <span className="type-accent">the person who builds it.</span>
          </h2>
          <p className="fc-statement">{FOUNDER_LINE}</p>
          <dl className="fc-credits">
            {credits.map(function row(c) {
              return (
                <div key={c.label} className="fc-credit">
                  <dt>{c.label}</dt>
                  <dd>{c.line}</dd>
                </div>
              );
            })}
          </dl>
          <motion.div
            className="fc-cta"
            initial={false}
            animate={{ opacity: reduce || drawn ? 1 : 0.45 }}
            transition={{ duration: reduce ? 0 : 0.4, ease: ease.outQuart }}
          >
            <MagneticCTA to="/about" variant="ghost" tone="dark">
              Meet the person who builds it
            </MagneticCTA>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
