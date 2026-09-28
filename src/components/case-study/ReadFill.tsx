import { useCallback, useEffect, useRef } from "react";
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

/** The words the eye reads, plus the sentence a screen reader reads once. */
export function FillWords({
  text,
  attach,
}: {
  text: string;
  attach: (node: HTMLElement | null) => void;
}) {
  const words = text.split(" ");
  return (
    <>
      <span aria-hidden="true" ref={attach}>
        {words.map(function word(w, i) {
          return (
            <span
              key={i}
              className="read-fill__w"
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
  className,
  style,
}: {
  text: string;
  progress: MotionValue<number>;
  reduce: boolean;
  tint?: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  const attach = useFillVar(progress, reduce);
  return (
    <p
      className={["read-fill", className].filter(Boolean).join(" ")}
      style={
        {
          margin: 0,
          ["--tint" as string]: tint || "var(--color-ink)",
          ...(reduce ? { ["--p" as string]: 1 } : null),
          ...style,
        } as React.CSSProperties
      }
    >
      <FillWords text={text} attach={attach} />
    </p>
  );
}
