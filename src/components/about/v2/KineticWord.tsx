import { useEffect, useRef } from "react";
import type { Principle } from "../../../data/aboutPrinciples";

/**
 * One giant word, split into letters that act out its meaning.
 *
 * Letters are spans whose transforms are written STRAIGHT onto the
 * element — never through React state. These change every scroll
 * frame, and a state write would re-render the page sixty times a
 * second (handoff 5.1, and spec 33 step 3).
 *
 * Each letter carries `--i` (its index) and `--n` (the word's length).
 * Every clip-text fill in the sheet — the studio gradient, chrome,
 * bubble — uses those two to slide one shared gradient across the
 * letters with `background-position`. That is why the fill is applied
 * PER LETTER and never on `.wd`: the letters are transformed
 * `inline-block` boxes, and a `background-clip:text` on the parent
 * paints a gradient the transforms then move out from under.
 */

export default function KineticWord({
  principle,
  index,
  wordRef,
  tagRef,
  lettersRef,
  wdRef,
  children,
}: {
  principle: Principle;
  index: number;
  wordRef: (el: HTMLDivElement | null) => void;
  tagRef: (el: HTMLSpanElement | null) => void;
  lettersRef: (els: HTMLSpanElement[]) => void;
  wdRef: (el: HTMLDivElement | null) => void;
  /** The proof panel that rises once the word has landed. */
  children: React.ReactNode;
}) {
  const letters = useRef<HTMLSpanElement[]>([]);
  const chars = [...principle.word];

  useEffect(
    function publish() {
      lettersRef(letters.current.filter(Boolean));
    },
    [lettersRef]
  );

  return (
    <div
      /* TIMELESS is the one word whose proof is showing from the
         start: the two cards ARE the argument, and they have to be
         readable while the lettering flips through the trends above
         them. The other three earn `proofon` by landing. */
      className={
        `word ${WORD_CLASS[index]}` +
        (index === 0 ? " on" : "") +
        (index === 3 ? " proofon" : "")
      }
      data-w={principle.word}
      ref={wordRef}
      {...(index === 3 ? { "data-style": "chrome" } : {})}
    >
      <span className="wtag" ref={tagRef}>
        {principle.tagBefore}
      </span>

      {/* The word itself carries no meaning a reader can use — the
          principle line and the proof below say it in real text. */}
      <div className="wd" aria-hidden="true" ref={wdRef}>
        {chars.map(function letter(c, i) {
          return (
            <span
              className="kwl"
              key={`${c}${i}`}
              style={
                { "--i": i, "--n": chars.length } as React.CSSProperties
              }
              ref={(el) => {
                if (el) letters.current[i] = el;
              }}
            >
              {c}
            </span>
          );
        })}
        {index === 0 ? (
          <>
            <i className="guide cap" />
            <i className="guide base" />
          </>
        ) : null}
      </div>

      {children}
    </div>
  );
}

/** The per-word hook the sheet styles each behaviour from. */
const WORD_CLASS = ["craft", "dir", "mot", "tim"];
