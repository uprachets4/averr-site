import { useEffect, useId, useRef, useState } from "react";
import { useMotionValueEvent, type MotionValue } from "motion/react";
import { MARK_PATH_D } from "../../MonogramMark";

/**
 * The cinematic hand-off: you fly INTO the mark.
 *
 * Scrolling out of the hero, the monogram scales up until its inner
 * counter is bigger than the viewport, and the principle stage is seen
 * THROUGH the mark's own shape. Once the shape has cleared the screen
 * the mask releases and the stage is just the stage.
 *
 * An SVG <clipPath> with the real path, not a raster mask or a
 * blurred PNG — so the edge stays perfectly crisp at 20× where a
 * bitmap would turn to mush.
 *
 * The transform is written straight onto the path with setAttribute
 * from a scroll subscription. Driving it through React state would
 * re-render the whole stage every frame; driving it through motion's
 * `style` would need a transform STRING, which motion does not
 * interpolate. One attribute write per frame is the cheap, honest way.
 *
 * Reduced motion gets a plain crossfade: no mask at all.
 */

/** The mark's own viewBox, from MonogramMark. */
const VB_W = 327;
const VB_H = 454;
const CX = VB_W / 2;
const CY = VB_H / 2;

/** Where the fly-in starts and finishes within the approach. */
const FROM = 0.12;
const TO = 0.92;
/** Scale at the start — the mark at roughly its hero size. */
const S0 = 560 / VB_W;
/** Scale at the end — the shape is well clear of the viewport. */
const S1 = 26;

export default function FlyIntoMark({
  progress,
  reduce,
  children,
}: {
  /** The approach: 0 a viewport before the pin, 1 at the pin. */
  progress: MotionValue<number>;
  reduce: boolean;
  children: React.ReactNode;
}) {
  const uid = useId().replace(/:/g, "");
  const pathRef = useRef<SVGPathElement | null>(null);
  const hostRef = useRef<HTMLDivElement | null>(null);
  const [released, setReleased] = useState(reduce);

  // the sticky child is viewport-sized, so user space is the viewport
  const size = useRef({ w: 0, h: 0 });
  useEffect(function measure() {
    function read() {
      size.current = { w: window.innerWidth, h: window.innerHeight };
    }
    read();
    window.addEventListener("resize", read);
    return function off() {
      window.removeEventListener("resize", read);
    };
  }, []);

  useMotionValueEvent(progress, "change", function fly(p) {
    if (reduce) return;
    const t = Math.max(0, Math.min(1, (p - FROM) / (TO - FROM)));
    // exponential, so the last stretch accelerates the way flying into
    // something does rather than creeping to the edge
    const s = S0 * Math.pow(S1 / S0, t);
    const { w, h } = size.current;
    const el = pathRef.current;
    if (el && w) {
      el.setAttribute(
        "transform",
        `translate(${w / 2 - CX * s} ${h / 2 - CY * s}) scale(${s})`
      );
    }
    const done = t >= 1;
    setReleased((was) => (was === done ? was : done));
  });

  return (
    <div
      ref={hostRef}
      style={{
        // once the shape is bigger than the screen the mask is only
        // costing paint, so it comes off entirely
        clipPath: reduce || released ? "none" : `url(#${uid})`,
        WebkitClipPath: reduce || released ? "none" : `url(#${uid})`,
        height: "100%",
      }}
    >
      {reduce ? null : (
        <svg
          width="0"
          height="0"
          aria-hidden="true"
          style={{ position: "absolute", pointerEvents: "none" }}
        >
          <defs>
            <clipPath id={uid} clipPathUnits="userSpaceOnUse">
              <path ref={pathRef} d={MARK_PATH_D} fillRule="evenodd" />
            </clipPath>
          </defs>
        </svg>
      )}
      {children}
    </div>
  );
}
