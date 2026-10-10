import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { ease } from "../../lib/motion";
import { MARK_PATH_D } from "../MonogramMark";

/**
 * The page's signature.
 *
 * /about opens on the mark drawing itself; it closes on the same mark
 * drawing once more, in parch on the dark closing band, so the page
 * signs off with the thing it began with.
 *
 * Stroke only — no fill — with a warm glow carried by a drop-shadow on
 * the SVG. No filter touches any text. Triggered once when it comes
 * into view, not on a loop, and simply drawn under reduced motion.
 */
export default function SignatureMark() {
  const reduce = !!useReducedMotion();
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-18% 0px" });
  const draw = reduce || inView;

  return (
    <div ref={ref} className="sig">
      <motion.svg
        viewBox="0 0 327 454"
        fill="none"
        role="img"
        aria-label="Averr Studios monogram"
        className="sig-svg"
        initial={false}
        animate={{
          filter: draw
            ? "drop-shadow(0 0 16px rgba(237,233,226,0.30)) drop-shadow(0 0 44px rgba(177,133,68,0.22))"
            : "drop-shadow(0 0 0 rgba(237,233,226,0))",
        }}
        transition={{ duration: reduce ? 0 : 1.6, delay: reduce ? 0 : 0.4, ease: ease.inOut }}
      >
        <motion.path
          d={MARK_PATH_D}
          fill="none"
          stroke="var(--color-parch)"
          strokeWidth={2}
          strokeLinecap="round"
          fillRule="evenodd"
          pathLength={1}
          initial={false}
          animate={{ pathLength: draw ? 1 : 0, opacity: draw ? 1 : 0 }}
          transition={{
            pathLength: { duration: reduce ? 0 : 1.6, ease: ease.inOut },
            opacity: { duration: reduce ? 0 : 0.3 },
          }}
        />
      </motion.svg>

      <style>{`
        .sig { display: grid; place-items: center; margin-bottom: clamp(26px, 4vh, 44px); }
        .sig-svg { display: block; width: clamp(54px, 7vh, 84px); height: auto; overflow: visible; }
      `}</style>
    </div>
  );
}
