import { motion, useReducedMotion } from "motion/react";
import { ease } from "../lib/motion";

export default function LineReveal({
  delay,
  duration = 0.8,
  children,
}: {
  delay: number;
  duration?: number;
  children: React.ReactNode;
}) {
  const reduce = useReducedMotion();
  return (
    <span style={{ display: "block", overflow: "hidden" }}>
      <motion.span
        style={{ display: "inline-block" }}
        initial={{
          y: reduce ? 0 : "100%",
          opacity: reduce ? 1 : 0,
        }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          delay: reduce ? 0 : delay,
          duration: reduce ? 0 : duration,
          ease: ease.outExpo,
        }}
      >
        {children}
      </motion.span>
    </span>
  );
}
