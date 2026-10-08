import { type ReactNode } from "react";
import { motion, type MotionValue } from "motion/react";
import { duration, ease } from "../../../lib/motion";

/**
 * The monitor on the desk.
 *
 * One screen, four things shown on it. The bezel is a real object — a
 * lit edge along the top, a darker lip at the bottom, a reflection
 * falling across the glass — because the whole point of the rebuild is
 * that the work is shown at full size on something, not floated on an
 * empty page as a small pale card.
 *
 * The room is lit BY the screen: `spill` is a large soft radial behind
 * the bezel in the active screen's own dominant colour, crossfaded when
 * the screen changes, so walking down the page visibly changes the
 * colour of the room.
 *
 * `dolly` and `tilt` are scroll-linked and come from the caller — they
 * are transforms only, so nothing here reflows.
 */
export default function Monitor({
  dolly,
  tilt,
  spill,
  scanKey,
  reduce,
  children,
}: {
  /** scale, scroll-linked: 0.88 → 1 as the desk arrives. */
  dolly: MotionValue<number> | number;
  /** rotateX in degrees, settling to flat. */
  tilt: MotionValue<number> | number;
  /** The active screen's dominant colour. */
  spill: string;
  /** Changes on every hand-off; replays the scanline. */
  scanKey: number;
  reduce: boolean;
  children: ReactNode;
}) {
  return (
    <div className="mon" style={{ ["--spill" as string]: spill }}>
      {/* the room, lit by whatever is on the screen */}
      <span className="mon-spill" aria-hidden="true" />

      <motion.div className="mon-body" style={{ scale: dolly, rotateX: tilt }}>
        <div className="mon-bezel">
          <div className="mon-screen">
            {children}

            {/* the glass */}
            <span className="mon-reflect" aria-hidden="true" />

            {/* the hand-off: one bright line down the glass as the new
                screen powers on. The screens underneath are opaque, so
                the monitor is never blank during a change. */}
            {/* TRANSFORM, not `top`. Animating `top` made every frame of
                this sweep a layout shift and put 0.13 CLS on the page on
                its own. `y` is a percentage of the element's OWN height
                (16% of the screen), so crossing the screen plus its own
                height takes 775%. */}
            {reduce ? null : (
              <motion.span
                key={scanKey}
                aria-hidden="true"
                className="mon-scan"
                initial={{ y: "0%", opacity: 0 }}
                animate={{ y: "775%", opacity: [0, 1, 1, 0] }}
                transition={{ duration: 0.5, ease: ease.outQuart, times: [0, 0.12, 0.8, 1] }}
              />
            )}
          </div>
        </div>
      </motion.div>

      <style>{`
        .mon {
          position: relative;
          width: 100%;
          display: grid;
          place-items: center;
          perspective: 1500px;
        }
        /* the wide halo: the room itself taking the screen's colour */
        .mon-spill {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          width: 168%;
          height: 165%;
          pointer-events: none;
          z-index: 0;
          background: radial-gradient(
            ellipse at 50% 46%,
            color-mix(in oklab, var(--spill) 42%, transparent) 0%,
            color-mix(in oklab, var(--spill) 20%, transparent) 26%,
            color-mix(in oklab, var(--spill) 7%, transparent) 48%,
            transparent 70%
          );
          transition: background ${duration.slow}s ease;
        }
        .mon-body {
          position: relative;
          z-index: 1;
          width: 100%;
          transform-style: preserve-3d;
          will-change: transform;
        }
        .mon-bezel {
          position: relative;
          border-radius: 20px;
          padding: 14px;
          background: linear-gradient(
            168deg,
            var(--about-surface-2) 0%,
            var(--about-surface) 62%,
            #0D1220 100%
          );
          border: 1px solid var(--about-hair-hi);
          /* the lit top edge, the weight underneath, and the bloom the
             screen throws onto the wall right behind it */
          box-shadow:
            inset 0 1px 0 rgba(197, 214, 255, 0.16),
            inset 0 -1px 0 rgba(0, 0, 0, 0.5),
            0 0 90px -10px color-mix(in oklab, var(--spill) 55%, transparent),
            0 0 190px 10px color-mix(in oklab, var(--spill) 24%, transparent),
            0 40px 90px -30px rgba(0, 0, 0, 0.8);
          transition: box-shadow ${duration.slow}s ease;
        }
        .mon-screen {
          position: relative;
          overflow: hidden;
          border-radius: 11px;
          background: var(--about-surface);
          height: min(72vh, 660px);
          box-shadow: inset 0 0 0 1px rgba(10, 13, 20, 0.9);
        }
        .mon-reflect {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 6;
          background: linear-gradient(
            148deg,
            rgba(160, 186, 255, 0.10) 0%,
            rgba(160, 186, 255, 0.03) 26%,
            transparent 48%
          );
        }
        .mon-scan {
          position: absolute;
          left: 0;
          right: 0;
          top: -12%;
          height: 16%;
          will-change: transform;
          pointer-events: none;
          z-index: 7;
          background: linear-gradient(
            180deg,
            transparent 0%,
            rgba(61, 107, 255, 0.18) 42%,
            rgba(197, 214, 255, 0.55) 50%,
            rgba(61, 107, 255, 0.18) 58%,
            transparent 100%
          );
        }
        @media (max-width: 900px) {
          .mon-bezel { padding: 9px; border-radius: 14px; }
          .mon-screen { border-radius: 8px; height: 420px; }
          }
      `}</style>
    </div>
  );
}
