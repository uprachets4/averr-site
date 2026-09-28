import { useCallback, useEffect, useRef, useState } from "react";
import type { MotionValue } from "motion/react";

/**
 * The read-fill mechanism, shared by Context and Signatures.
 *
 * Contract (from 15a): ONE scroll-derived custom property per paragraph
 * (`--p`, 0 → 1). Each word is a span carrying its index (`--i`) and the
 * word count (`--n`); CSS derives the opacity. No per-word MotionValues,
 * no per-word listeners — a paragraph costs a single style write per frame.
 *
 * The rules themselves live in index.css (.read-fill / .read-fill__w) so
 * both call sites share them.
 */

/**
 * Writes `--p` onto the nearest `.read-fill` ancestor of the node it is
 * attached to. Written by subscription rather than as a motion style
 * because motion 12.43.0 accelerates scroll-linked values onto a
 * ViewTimeline, which is meaningless for an element that isn't moving
 * through its own scrollport.
 */
export function useFillVar(progress: MotionValue<number>, reduce: boolean) {
  const row = useRef<HTMLElement | null>(null);

  const write = useCallback(
    function writeP(v: number) {
      const el = row.current;
      if (el) el.style.setProperty("--p", String(reduce ? 1 : v));
    },
    [reduce]
  );

  useEffect(
    function subscribe() {
      write(progress.get());
      return progress.on("change", write);
    },
    [progress, write]
  );

  return useCallback(
    function attach(node: HTMLElement | null) {
      row.current = node ? node.closest<HTMLElement>(".read-fill") : null;
      write(progress.get());
    },
    [progress, write]
  );
}

/**
 * The words the eye reads, plus the sentence a screen reader reads once.
 *
 * `emphasis`, when it is a verbatim substring, marks the words it covers so
 * the highlighter can sweep them. A phrase that isn't found is ignored
 * rather than approximated.
 */
export function FillWords({
  text,
  attach,
  emphasis,
}: {
  text: string;
  attach: (node: HTMLElement | null) => void;
  emphasis?: string;
}) {
  const words = text.split(" ");

  // word range covered by the emphasis, by character offset
  let from = -1;
  let to = -1;
  if (emphasis) {
    const at = text.indexOf(emphasis);
    if (at >= 0) {
      let cursor = 0;
      words.forEach(function locate(w, i) {
        const start = cursor;
        const end = cursor + w.length;
        if (from < 0 && end > at) from = i;
        if (start < at + emphasis.length) to = i;
        cursor = end + 1;
      });
    }
  }

  return (
    <>
      <span aria-hidden="true" ref={attach}>
        {words.map(function word(w, i) {
          const lit = from >= 0 && i >= from && i <= to;
          return (
            <span
              key={i}
              className={lit ? "read-fill__w read-fill__hl" : "read-fill__w"}
              style={
                { ["--i" as string]: i, ["--n" as string]: words.length } as React.CSSProperties
              }
            >
              {w}
              {i < words.length - 1 ? " " : ""}
            </span>
          );
        })}
      </span>
      <span className="sr-only">{text}</span>
    </>
  );
}

/** A paragraph that fills itself as it crosses the reading line. */
export function ReadFill({
  text,
  progress,
  reduce,
  tint,
  emphasis,
  className,
  style,
  as: Tag = "p",
}: {
  text: string;
  progress: MotionValue<number>;
  reduce: boolean;
  tint?: string;
  emphasis?: string;
  className?: string;
  style?: React.CSSProperties;
  as?: "p" | "div";
}) {
  const attach = useFillVar(progress, reduce);
  const lit = useLitOnce(progress, reduce);
  return (
    <Tag
      className={["read-fill", lit ? "read-fill--lit" : null, className]
        .filter(Boolean)
        .join(" ")}
      style={
        {
          // margin lives in .read-fill, not inline: an inline shorthand here
          // would beat any margin a caller sets via a class
          ["--tint" as string]: tint || "var(--color-ink)",
          ...(reduce ? { ["--p" as string]: 1 } : null),
          ...style,
        } as React.CSSProperties
      }
    >
      <FillWords text={text} attach={attach} emphasis={emphasis} />
    </Tag>
  );
}

/** Flips true the first time the paragraph finishes filling, and stays true. */
export function useLitOnce(progress: MotionValue<number>, reduce: boolean) {
  const [lit, setLit] = useState(reduce);
  useEffect(
    function watch() {
      if (reduce) {
        setLit(true);
        return;
      }
      function check(v: number) {
        if (v >= 0.92) setLit(true);
      }
      check(progress.get());
      return progress.on("change", check);
    },
    [progress, reduce]
  );
  return lit;
}
