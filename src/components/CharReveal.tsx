import { Fragment } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ease } from "../lib/motion";

/**
 * Word-preserving character reveal — the single shared implementation.
 *
 * The locked pattern, unchanged:
 *   - each WORD is an inline-block span with whiteSpace:nowrap, so the
 *     browser only ever breaks at word boundaries
 *   - each CHARACTER inside a word is its own motion.span, staggered
 *   - inter-word spaces are real text nodes at parent level, emitted via
 *     Fragment, so the browser handles wrapping natively
 *   - 20ms stagger, 350ms per char, continuous global index across words
 *
 * Segments let one phrase inside a headline carry the Cormorant italic
 * accent voice. Accent words reveal on the same timeline as everything
 * else — the stagger index does not reset at a segment boundary.
 */

const STAGGER = 0.02;
const PER_CHAR = 0.35;

export type Segment = { text: string; accent?: boolean };

type Token = { chars: string[]; accent: boolean };

/** Flatten segments into per-word tokens, carrying the accent flag. */
function tokenize(segments: Segment[]): Token[] {
  const tokens: Token[] = [];
  for (const seg of segments) {
    for (const word of seg.text.split(" ")) {
      if (word.length === 0) continue;
      tokens.push({ chars: Array.from(word), accent: !!seg.accent });
    }
  }
  return tokens;
}

function toSegments(text?: string, segments?: Segment[]): Segment[] {
  if (segments) return segments;
  return [{ text: text ?? "" }];
}

type SharedProps = {
  text?: string;
  segments?: Segment[];
  className?: string;
  style?: React.CSSProperties;
};

/** Render the word/char tree. `mode` picks mount-driven vs viewport-driven. */
function Words({
  tokens,
  reduce,
  mode,
  delay,
}: {
  tokens: Token[];
  reduce: boolean;
  mode: "mount" | "inView";
  delay: number;
}) {
  let globalIdx = -1;
  return (
    <>
      {tokens.map(function drawWord(token, wi) {
        return (
          <Fragment key={wi}>
            <span
              className={token.accent ? "type-accent" : undefined}
              style={{ display: "inline-block", whiteSpace: "nowrap" }}
            >
              {token.chars.map(function drawChar(ch, ci) {
                globalIdx++;
                const idx = globalIdx;
                const transition = {
                  duration: reduce ? 0 : PER_CHAR,
                  ease: ease.outQuart,
                  delay: reduce ? 0 : delay + idx * STAGGER,
                };
                const initial = {
                  opacity: reduce ? 1 : 0,
                  y: reduce ? 0 : 20,
                };
                return mode === "mount" ? (
                  <motion.span
                    key={ci}
                    initial={initial}
                    animate={{ opacity: 1, y: 0 }}
                    transition={transition}
                    style={{ display: "inline-block" }}
                  >
                    {ch}
                  </motion.span>
                ) : (
                  <motion.span
                    key={ci}
                    initial={initial}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-15% 0px" }}
                    transition={transition}
                    style={{ display: "inline-block" }}
                  >
                    {ch}
                  </motion.span>
                );
              })}
            </span>
            {wi < tokens.length - 1 ? " " : null}
          </Fragment>
        );
      })}
    </>
  );
}

/** Reveals when scrolled into view. The default for section headlines. */
export function CharRevealInView({
  text,
  segments,
  className,
  style,
}: SharedProps) {
  const reduce = useReducedMotion();
  const tokens = tokenize(toSegments(text, segments));
  return (
    <span className={className} style={style}>
      <Words tokens={tokens} reduce={!!reduce} mode="inView" delay={0} />
    </span>
  );
}

/** Reveals on mount. For above-the-fold hero copy with a timed entrance. */
export function CharReveal({
  text,
  segments,
  delay = 0,
  className,
  style,
}: SharedProps & { delay?: number }) {
  const reduce = useReducedMotion();
  const tokens = tokenize(toSegments(text, segments));
  return (
    <span className={className} style={style}>
      <Words tokens={tokens} reduce={!!reduce} mode="mount" delay={delay} />
    </span>
  );
}
