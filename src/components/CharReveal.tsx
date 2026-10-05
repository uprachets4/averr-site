import { Fragment } from "react";
import { motion, useReducedMotion } from "motion/react";
import { duration as DUR, ease } from "../lib/motion";

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

/**
 * `paint` keeps every character at opacity 1 from the first frame and
 * animates the transform only.
 *
 * The browser cannot measure a largest contentful paint it cannot see, so
 * a reveal that starts at opacity 0 pushes LCP out by its own delay plus
 * duration — which is how /about ended up at 2.7s behind a 2.2s delay.
 *
 * The per-character stagger is kept: painted characters still travel in
 * reading order, so the line reads as a reveal rather than a block nudge.
 * Only the fade is gone.
 */

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
  /** LCP element: paint immediately, animate transform only. */
  paint?: boolean;
};

/** Render the word/char tree. `mode` picks mount-driven vs viewport-driven. */
function Words({
  tokens,
  reduce,
  mode,
  delay,
  paint,
}: {
  tokens: Token[];
  reduce: boolean;
  mode: "mount" | "inView";
  delay: number;
  paint?: boolean;
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
                  duration: reduce ? 0 : paint ? DUR.base : PER_CHAR,
                  ease: ease.outQuart,
                  delay: reduce ? 0 : delay + idx * STAGGER,
                };
                const initial = {
                  opacity: reduce || paint ? 1 : 0,
                  y: reduce ? 0 : paint ? 8 : 20,
                };
                return mode === "mount" ? (
                  <motion.span
                    key={ci}
                    initial={initial}
                    animate={paint ? { y: 0 } : { opacity: 1, y: 0 }}
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
  paint,
}: SharedProps) {
  const reduce = useReducedMotion();
  const tokens = tokenize(toSegments(text, segments));
  return (
    <span className={className} style={style}>
      <Words tokens={tokens} reduce={!!reduce} mode="inView" delay={0} paint={paint} />
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
  paint,
}: SharedProps & { delay?: number }) {
  const reduce = useReducedMotion();
  const tokens = tokenize(toSegments(text, segments));
  return (
    <span className={className} style={style}>
      <Words tokens={tokens} reduce={!!reduce} mode="mount" delay={delay} paint={paint} />
    </span>
  );
}
