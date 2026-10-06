import { useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { duration, ease } from "../../lib/motion";

/**
 * A date that changes as one token, not as a column of digits.
 *
 * The per-digit odometer it replaces rolled ten glyphs behind a clipped
 * window. At rest that window still cut the neighbours: "Oct 12" showed
 * the leading 1 as a bar with stray strokes above it, and a pass row
 * read "Monday, Oct 1g". A column of glyphs clipped to a line box can
 * only ever be one mis-measured pixel away from showing the next one.
 *
 * So nothing is clipped tightly here. The whole string slides out and
 * the new one slides in, and the clip box is MEASURED from the font's
 * real ink extents — `actualBoundingBoxAscent`/`Descent` for every digit
 * plus the string itself, in the element's own computed font. Cormorant
 * italic draws well outside its line box; the padding that gives it room
 * is cancelled by an equal negative margin, so the surrounding layout is
 * unchanged.
 *
 * Transform and opacity only. Reduced motion swaps instantly.
 */
export default function DateToken({
  text,
  className,
  style,
  reduce,
  srText,
}: {
  text: string;
  className?: string;
  style?: React.CSSProperties;
  reduce: boolean;
  /** What assistive tech should hear instead of the animated layers. */
  srText?: string;
}) {
  const sizerRef = useRef<HTMLSpanElement | null>(null);
  const [bleed, setBleed] = useState({ top: 0, bottom: 0 });

  useLayoutEffect(
    function measureInk() {
      function run() {
        const el = sizerRef.current;
        if (!el) return;
        const cs = getComputedStyle(el);
        const fs = parseFloat(cs.fontSize);
        if (!fs) return;
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        ctx.font = `${cs.fontStyle} ${cs.fontWeight} ${fs}px ${cs.fontFamily}`;
        // every digit, so one measurement holds for any date this renders
        const m = ctx.measureText(`${text}0123456789`);
        const lineH = el.getBoundingClientRect().height || fs;
        // where the baseline sits inside the line box
        const fontAscent = m.fontBoundingBoxAscent || fs * 0.8;
        const baseline = (lineH - fs) / 2 + fontAscent;
        const top = Math.ceil(Math.max(0, (m.actualBoundingBoxAscent || 0) - baseline) + 1);
        const bottom = Math.ceil(
          Math.max(0, (m.actualBoundingBoxDescent || 0) - (lineH - baseline)) + 1
        );
        setBleed((b) => (b.top === top && b.bottom === bottom ? b : { top, bottom }));
      }
      run();
      // the fonts may still be swapping in when this first runs
      if (document.fonts?.ready) document.fonts.ready.then(run).catch(() => undefined);
      window.addEventListener("resize", run);
      return function off() {
        window.removeEventListener("resize", run);
      };
    },
    [text]
  );

  const layer: React.CSSProperties = {
    position: "absolute",
    left: 0,
    top: bleed.top,
    whiteSpace: "nowrap",
  };

  return (
    <span
      className={className}
      style={{
        position: "relative",
        display: "inline-block",
        overflow: "hidden",
        paddingTop: bleed.top,
        paddingBottom: bleed.bottom,
        marginTop: -bleed.top,
        marginBottom: -bleed.bottom,
        ...style,
      }}
    >
      {srText ? <span className="sr-only">{srText}</span> : null}
      {/* holds the box; never painted */}
      <span ref={sizerRef} aria-hidden style={{ visibility: "hidden", whiteSpace: "nowrap" }}>
        {text}
      </span>
      <AnimatePresence initial={false} mode="sync">
        <motion.span
          key={text}
          aria-hidden
          style={layer}
          initial={reduce ? false : { y: "40%", opacity: 0 }}
          animate={{ y: "0%", opacity: 1 }}
          exit={reduce ? { opacity: 0 } : { y: "-40%", opacity: 0 }}
          transition={reduce ? { duration: 0 } : { duration: duration.base, ease: ease.outQuart }}
        >
          {text}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
