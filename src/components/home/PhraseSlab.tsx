import { useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { duration, ease, spring } from "../../lib/motion";
import { PHRASES } from "./heroPhrases";

/**
 * The slab, holding whichever outcome is active.
 *
 * It is PillHl's slab variant, not a copy of it: the same `.pill-hl--bare`
 * box, the same `.pill-hl__slab` surface and the same `.pill-hl__word`
 * gradient, so the signature pill still has exactly one owner in the CSS.
 * What this adds is the measuring and the swap.
 *
 * THE WIDTH IS MEASURED, and it is never animated as layout. All three
 * phrases are laid out once in a hidden ruler — in the type they will
 * actually be rendered in, `.pill-hl__word` included, because that class
 * re-tracks the text and measuring without it was 8% short — re-measured
 * after the webfont lands and on resize. The box is fixed at the widest, and
 * the surface behind the words is a layer whose scaleX is driven to the
 * measured ratio. Because the box never changes size, the headline above and
 * the selectors below cannot reflow while the slab moves; because the padding
 * is read off the live element, it is inside the ratio rather than fighting
 * it.
 *
 * The words paint at the first frame in INK, so the first phrase is legible
 * on cream before anything animates, and a second copy in parch is revealed
 * by a clip that tracks the surface — so the words turn parch exactly as the
 * slab passes under them. That is what PillHl's slab entrance always said it
 * did; it used to fade the word up from nothing instead, which on this
 * headline would have meant a second of near-invisible parch on cream.
 *
 * Phrase swaps are whole-token: the old words leave upward, the new arrive
 * from below, on transform and opacity only. No per-letter odometer.
 */

/**
 * One layer of the words. Whole-token: out upward, in from below.
 *
 * `popLayout`, not `wait`: waiting runs the exit to completion before the
 * entrance starts, which left the slab standing empty for 300ms — a dead
 * beat in the middle of the headline. Popping the outgoing token out of
 * flow lets the two cross, which is what a token swap should look like.
 */
function Swap({
  index,
  reduce,
  className,
}: {
  index: number;
  reduce: boolean;
  className: string;
}) {
  return (
    <AnimatePresence mode="popLayout" initial={false}>
      <motion.span
        key={index}
        className={`ps-word ${className}`}
        initial={reduce ? false : { y: "0.4em", opacity: 0 }}
        animate={{ y: "0em", opacity: 1 }}
        exit={reduce ? undefined : { y: "-0.4em", opacity: 0 }}
        transition={{ duration: reduce ? 0 : duration.base, ease: ease.outQuart }}
      >
        {PHRASES[index].text}
      </motion.span>
    </AnimatePresence>
  );
}

export default function PhraseSlab({
  index,
  reduce,
  delay = 0,
  speed = 1,
  skip = false,
  surface = true,
  onClick,
}: {
  index: number;
  reduce: boolean;
  /** Seconds from mount for the surface's entrance — PillHl's `delay`. */
  delay?: number;
  /** Multiplier on the entrance duration — the mobile film runs at 0.5. */
  speed?: number;
  /** Play the entrance instantly (the reader scrolled before the film ended). */
  skip?: boolean;
  /** False draws the words with no surface of their own — during the hero's
   *  takeover a separate dark layer IS the pill, and a second one doubles up.
   *  PillHl's `surface` prop, for the same reason. */
  surface?: boolean;
  onClick: () => void;
}) {
  const hostRef = useRef<HTMLSpanElement | null>(null);
  const rulerRef = useRef<HTMLSpanElement | null>(null);
  const [box, setBox] = useState<{ widest: number; ratios: number[] } | null>(null);
  /** The entrance happens once; every swap after it is a spring. */
  const [entered, setEntered] = useState(false);

  const instant = reduce || skip;

  useLayoutEffect(function measure() {
    function run() {
      const host = hostRef.current;
      const ruler = rulerRef.current;
      if (!host || !ruler) return;
      const cs = getComputedStyle(host);
      const pad =
        (parseFloat(cs.paddingLeft) || 0) + (parseFloat(cs.paddingRight) || 0);
      const words = [...ruler.children].map(
        (c) => (c as HTMLElement).getBoundingClientRect().width
      );
      if (words.length !== PHRASES.length || words.some((x) => !(x > 0))) return;
      const full = words.map((x) => x + pad);
      const widest = Math.max(...full);
      setBox({ widest, ratios: full.map((x) => x / widest) });
    }
    run();
    // the fallback's metrics are not Geist's
    document.fonts?.ready.then(run).catch(function ignore() {});
    window.addEventListener("resize", run);
    return function off() {
      window.removeEventListener("resize", run);
    };
  }, []);

  /* Unmeasured, it is today's pill exactly: natural width, surface full. */
  const ratio = box ? box.ratios[index] : 1;
  /** The surface's right edge, as a clip for the parch copy. Vertically the
   *  clip is pushed outside the box, because glyphs are taller than it. */
  const clipAt = (r: number) => `inset(-0.4em ${(1 - r) * 100}% -0.4em 0)`;
  const entrance = { delay, duration: duration.slow * speed, ease: ease.outExpo };
  const transition = instant ? { duration: 0 } : entered ? spring.snappy : entrance;

  return (
    <span
      ref={hostRef}
      className="pill-hl pill-hl--bare ps"
      onClick={onClick}
      style={box ? { width: box.widest } : undefined}
    >
      {/* the ruler: the type the words will render in, laid out once, out of
          flow and invisible, so it cannot affect the box it measures for */}
      <span className="ps-ruler" ref={rulerRef} aria-hidden="true">
        {PHRASES.map(function one(p) {
          return (
            <span key={p.text} className="pill-hl__word">
              {p.text}
            </span>
          );
        })}
      </span>

      {/* the surface — a transform on a layer, never a layout width */}
      {surface ? (
        <motion.span
          aria-hidden="true"
          className="pill-hl__slab"
          initial={{ scaleX: instant ? ratio : 0 }}
          animate={{ scaleX: ratio }}
          transition={transition}
          onAnimationComplete={function settled() {
            setEntered(true);
          }}
        />
      ) : null}

      <span className="ps-words">
        {surface ? (
          <>
            {/* painted at the first frame, in ink, on cream */}
            <Swap index={index} reduce={reduce} className="pill-hl__word ps-ink" />
            {/* The parch copy, revealed exactly as far as the surface has
                come. The clip lives on this wrapper rather than on the word,
                because the word is inside an AnimatePresence with
                `initial={false}` — which suppresses the mount animation of
                everything nested under it, the reveal included. This wrapper
                is never remounted, so its entrance survives, and on a swap it
                simply springs with the surface. */}
            <motion.span
              aria-hidden="true"
              className="ps-reveal"
              initial={{ clipPath: clipAt(instant ? ratio : 0) }}
              animate={{ clipPath: clipAt(ratio) }}
              transition={transition}
            >
              <Swap index={index} reduce={reduce} className="pill-hl__word" />
            </motion.span>
          </>
        ) : (
          /* the takeover: a dark layer IS the pill, so the words are parch
             from the first frame and there is nothing to reveal */
          <Swap index={index} reduce={reduce} className="pill-hl__word" />
        )}
      </span>
    </span>
  );
}
