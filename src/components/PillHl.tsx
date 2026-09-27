import { motion, useReducedMotion } from "motion/react";
import { duration, ease } from "../lib/motion";

type Props = {
  children: React.ReactNode;
  /** "none" (default) is the original static pill, byte-identical.
   *  "slab" grows the surface scaleX 0 → 1 from the left behind the word
   *  while the word crossfades ink → parch. */
  entrance?: "none" | "slab";
  /** Seconds from mount, for entrance="slab". */
  delay?: number;
  /** Play the entrance instantly (reader scrolled before the film finished). */
  skip?: boolean;
  /** False draws the word with no surface of its own — for the hero takeover,
   *  where a separate dark layer is the pill and a second one would double up. */
  surface?: boolean;
};

export default function PillHl({
  children,
  entrance = "none",
  delay = 0,
  skip = false,
  surface = true,
}: Props) {
  const reduce = useReducedMotion();

  // Original path — untouched.
  if (entrance === "none" && surface) {
    return (
      <span className="pill-hl">
        <span style={{ WebkitTextFillColor: "transparent" }}>{children}</span>
      </span>
    );
  }

  const instant = reduce || skip;

  return (
    <span
      className={surface ? "pill-hl pill-hl--bare" : "pill-hl pill-hl--bare"}
      style={{ position: "relative", isolation: "isolate" }}
    >
      {surface ? (
        <motion.span
          aria-hidden
          className="pill-hl__slab"
          initial={{ scaleX: instant ? 1 : 0 }}
          animate={{ scaleX: 1 }}
          transition={
            instant
              ? { duration: 0 }
              : { delay, duration: duration.slow, ease: ease.outExpo }
          }
        />
      ) : null}
      <motion.span
        className="pill-hl__word"
        initial={{ opacity: instant ? 1 : 0 }}
        animate={{ opacity: 1 }}
        transition={
          instant
            ? { duration: 0 }
            : { delay: delay + 0.12, duration: duration.base, ease: ease.outExpo }
        }
      >
        {children}
      </motion.span>
    </span>
  );
}
