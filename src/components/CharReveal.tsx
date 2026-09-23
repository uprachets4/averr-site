import { Fragment } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ease } from "../lib/motion";

/**
 * Word-preserving character reveal — shared shape used by /about, /contact,
 * Manifesto, case-study Outcome, and the landing-page retrofit.
 *
 * The container span wraps each word in an inline-block + whiteSpace:nowrap
 * span so the browser breaks at word boundaries only. Spaces between words
 * are real text nodes at parent level via <Fragment>.
 */

const STAGGER = 0.02;
const PER_CHAR = 0.35;

function splitWords(text: string): string[][] {
  return text.split(" ").map(function toChars(w) {
    return Array.from(w);
  });
}

export function CharRevealInView({
  text,
  className,
  style,
}: {
  text: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  const reduce = useReducedMotion();
  const words = splitWords(text);
  let gi = -1;
  return (
    <span className={className} style={style}>
      {words.map(function drawWord(chars, wi) {
        return (
          <Fragment key={wi}>
            <span style={{ display: "inline-block", whiteSpace: "nowrap" }}>
              {chars.map(function drawChar(ch, ci) {
                gi++;
                const idx = gi;
                return (
                  <motion.span
                    key={ci}
                    initial={{
                      opacity: reduce ? 1 : 0,
                      y: reduce ? 0 : 20,
                    }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-15% 0px" }}
                    transition={{
                      duration: reduce ? 0 : PER_CHAR,
                      ease: ease.outQuart,
                      delay: reduce ? 0 : idx * STAGGER,
                    }}
                    style={{ display: "inline-block" }}
                  >
                    {ch}
                  </motion.span>
                );
              })}
            </span>
            {wi < words.length - 1 ? " " : null}
          </Fragment>
        );
      })}
    </span>
  );
}
