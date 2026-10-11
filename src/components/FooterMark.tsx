import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { easing } from "../lib/motion";
import MonogramMark from "./MonogramMark";

/**
 * The giant wordmark the footer rises into.
 *
 * "Averr" is set as SVG text on a viewBox the container scales to, so
 * it spans the width exactly at every size without a measured px
 * anywhere — the one case where SVG text is the right answer rather
 * than the trap, because the glyphs are the artwork and nothing is
 * positioned against them.
 *
 * It rises on the footer's own scroll: y 40% → 0 behind a mask, which
 * is a transform and a clip, so nothing reflows. Reduced motion simply
 * has it in place.
 */
export default function FooterMark() {
  const reduce = !!useReducedMotion();
  const ref = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 95%", "end 85%"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["40%", "0%"], {
    ease: easing.outQuart,
    clamp: true,
  });

  return (
    <div className="fm" ref={ref}>
      <div className="fm-mask">
        <motion.div className="fm-rise" style={{ y: reduce ? "0%" : y }}>
          <svg
            className="fm-word"
            viewBox="0 0 420 100"
            preserveAspectRatio="xMidYMid meet"
            role="img"
            aria-label="Averr Studios"
          >
            <text
              x="0"
              y="78"
              fontFamily="Geist, ui-sans-serif, system-ui, sans-serif"
              fontWeight="600"
              fontSize="100"
              letterSpacing="-4"
              fill="currentColor"
            >
              Averr
            </text>
          </svg>
        </motion.div>
      </div>

      <div className="fm-sig" aria-hidden="true">
        <MonogramMark variant="mini" />
      </div>

      <style>{`
        .fm {
          display: flex; align-items: flex-end; gap: clamp(16px, 3vw, 44px);
          margin: clamp(36px, 6vh, 72px) 0 clamp(28px, 4vh, 48px);
        }
        /* the mask the wordmark rises out of */
        .fm-mask { flex: 1; min-width: 0; overflow: hidden; }
        .fm-rise { will-change: transform; }
        .fm-word {
          display: block; width: 100%; height: auto;
          color: var(--color-ink);
        }
        .fm-sig { flex: 0 0 auto; width: clamp(38px, 5vw, 64px); color: var(--color-ink); }
        .fm-sig > div { width: 100% !important; }
        @media (max-width: 760px) {
          .fm { gap: 14px; }
          .fm-sig { width: 32px; }
        }
      `}</style>
    </div>
  );
}
