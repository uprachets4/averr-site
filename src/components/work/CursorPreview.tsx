import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring, useReducedMotion } from "motion/react";
import { duration, ease, spring } from "../../lib/motion";
import ImageFrame from "../case-study/ImageFrame";
import { vault } from "../../data/workIndex";

const W = 400;
const H = 250;
const EDGE = 16;
/** Kept clear of the row's name, which sits on the left. */
const OFFSET_X = 40;
const OFFSET_Y = -H / 2;
const MAX_TILT = 4;

export type PreviewTarget =
  | { kind: "cursor" }
  | { kind: "anchored"; rect: { top: number; left: number; width: number; height: number } };

/**
 * One floating preview shared by every row. The frame itself never unmounts
 * while moving between rows — only the image inside crossfades — so there is
 * no remount flash. position: fixed, so it contributes nothing to layout.
 */
export default function CursorPreview({
  slug,
  target,
  minX = 0,
}: {
  slug: string | null;
  target: PreviewTarget;
  /** Left bound — the hovered row's name ends here, and the preview must
   *  never sit on top of it. */
  minX?: number;
}) {
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const tilt = useMotionValue(0);
  const sx = useSpring(x, spring.soft);
  const sy = useSpring(y, spring.soft);
  const stilt = useSpring(tilt, spring.soft);

  const lastX = useRef(0);
  const lastMove = useRef(0);
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    function trackPointer() {
      if (target.kind !== "cursor" || reduce) return;

      function clampX(v: number) {
        const lo = Math.max(EDGE, minX);
        // if the name is so wide that the frame cannot clear it, fall back to
        // the right edge rather than overlapping the name
        const hi = window.innerWidth - W - EDGE;
        return Math.max(Math.min(lo, hi), Math.min(hi, v));
      }
      function clampY(v: number) {
        return Math.max(EDGE, Math.min(window.innerHeight - H - EDGE, v));
      }

      function onMove(e: MouseEvent) {
        x.set(clampX(e.clientX + OFFSET_X));
        y.set(clampY(e.clientY + OFFSET_Y));

        // horizontal velocity → tilt, easing back to 0 once the cursor stills
        const now = performance.now();
        const dt = now - lastMove.current;
        if (dt > 0) {
          const vx = (e.clientX - lastX.current) / dt;
          const next = Math.max(-MAX_TILT, Math.min(MAX_TILT, vx * 14));
          tilt.set(next);
        }
        lastX.current = e.clientX;
        lastMove.current = now;

        if (idleTimer.current) clearTimeout(idleTimer.current);
        idleTimer.current = setTimeout(function settle() {
          tilt.set(0);
        }, 90);
      }

      window.addEventListener("mousemove", onMove, { passive: true });
      return function cleanup() {
        window.removeEventListener("mousemove", onMove);
        if (idleTimer.current) clearTimeout(idleTimer.current);
      };
    },
    [target.kind, reduce, x, y, tilt, minX]
  );

  // keyboard focus: park the frame in the row's right third, no cursor to follow
  useEffect(
    function anchorToRow() {
      if (target.kind !== "anchored") return;
      const r = target.rect;
      x.set(Math.max(EDGE, Math.min(window.innerWidth - W - EDGE, r.left + r.width * 0.66)));
      y.set(Math.max(EDGE, Math.min(window.innerHeight - H - EDGE, r.top + r.height / 2 + OFFSET_Y)));
      tilt.set(0);
    },
    [target, x, y, tilt]
  );

  const entry = slug ? vault.find(function match(e) {
    return e.slug === slug;
  }) : null;
  const preview = entry?.preview;
  const open = !!preview;

  return (
    <motion.div
      aria-hidden
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: W,
        height: H,
        x: reduce ? x : sx,
        y: reduce ? y : sy,
        rotate: reduce ? 0 : stilt,
        zIndex: 40,
        pointerEvents: "none",
      }}
      initial={false}
      animate={{
        opacity: open ? 1 : 0,
        scale: open ? 1 : 0.9,
      }}
      transition={
        reduce
          ? { duration: 0 }
          : { duration: duration.base, ease: ease.outQuart }
      }
    >
      <div style={{ width: "100%", height: "100%", position: "relative" }}>
        <ImageFrame variant="gallery" tone="dark">
          <div style={{ position: "relative", width: "100%", aspectRatio: "16 / 10" }}>
            <AnimatePresence initial={false}>
              {preview ? (
                <motion.img
                  key={preview.src}
                  src={preview.src}
                  alt=""
                  width={1680}
                  height={1050}
                  decoding="async"
                  initial={{ opacity: reduce ? 1 : 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={reduce ? { duration: 0 } : { duration: duration.fast }}
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              ) : null}
            </AnimatePresence>
          </div>
        </ImageFrame>
      </div>
    </motion.div>
  );
}

/** The "View" pill that rides at the cursor. The native cursor stays visible. */
export function ViewLabel({ visible }: { visible: boolean }) {
  const reduce = useReducedMotion();
  const x = useMotionValue(-999);
  const y = useMotionValue(-999);
  const sx = useSpring(x, spring.snappy);
  const sy = useSpring(y, spring.snappy);

  useEffect(
    function follow() {
      function onMove(e: MouseEvent) {
        x.set(e.clientX + 14);
        y.set(e.clientY + 14);
      }
      window.addEventListener("mousemove", onMove, { passive: true });
      return function cleanup() {
        window.removeEventListener("mousemove", onMove);
      };
    },
    [x, y]
  );

  return (
    <motion.span
      aria-hidden
      className="type-eyebrow"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        x: reduce ? x : sx,
        y: reduce ? y : sy,
        zIndex: 41,
        pointerEvents: "none",
        fontFamily: "var(--font-mono)",
        background: "var(--color-parch)",
        color: "var(--color-dark)",
        padding: "4px 10px",
        borderRadius: 999,
      }}
      initial={false}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={reduce ? { duration: 0 } : { duration: duration.fast }}
    >
      VIEW
    </motion.span>
  );
}

/** Warm the preview images once the index is in view. */
export function usePreloadPreviews(active: boolean) {
  const [done, setDone] = useState(false);
  useEffect(
    function preload() {
      if (!active || done) return;
      for (const entry of vault) {
        if (!entry.preview) continue;
        const img = new Image();
        img.decoding = "async";
        img.loading = "eager";
        img.src = entry.preview.src;
      }
      setDone(true);
    },
    [active, done]
  );
}
