import { useEffect, useRef, type CSSProperties, type RefObject } from "react";
import { useReducedMotion } from "motion/react";

/**
 * Session 28b — the cursor system and the section blends.
 *
 * Everything here writes CSS CUSTOM PROPERTIES and never `transform`
 * itself. Two hard-won rules from earlier sessions are the reason:
 *
 *   1. A stylesheet transform and a motion transform cannot share a
 *      node — motion replaces the CSS `transform` silently. Custom
 *      properties compose with whatever the stylesheet already does.
 *   2. Per-frame `left`/`top` writes are layout changes and get scored
 *      as layout shift. These values only ever reach `transform` and
 *      `background-position` in the stylesheet.
 *
 * All listeners are on `window`, not React's synthetic handlers: a
 * synthetic `onMouseMove` fired once and then stopped updating when
 * WorkCards tried it, leaving the orb where the pointer entered.
 *
 * Every effect is off under reduced motion.
 */

type El = RefObject<HTMLElement | null>;

/** rAF-coalesced pointer tracking shared by the hooks below. */
function track(
  on: boolean,
  read: (e: PointerEvent) => void
) {
  if (!on) return;
  let raf = 0;
  let last: PointerEvent | null = null;
  function flush() {
    raf = 0;
    if (last) read(last);
  }
  function move(e: PointerEvent) {
    last = e;
    if (!raf) raf = requestAnimationFrame(flush);
  }
  window.addEventListener("pointermove", move, { passive: true });
  return function off() {
    cancelAnimationFrame(raf);
    window.removeEventListener("pointermove", move);
  };
}

/**
 * Tilt a card toward the cursor, and carry the cursor's position on the
 * card as `--mx`/`--my` so a sheen can follow it.
 *
 * `max` is the half-range in degrees — 4 gives the ±4° the brief asks
 * for. The tilt eases back to flat when the pointer leaves.
 */
export function useTilt(ref: El, max = 4) {
  const reduce = !!useReducedMotion();
  useEffect(
    function tilt() {
      const el = ref.current;
      if (!el || reduce) return;
      return track(true, function read(e) {
        const r = el.getBoundingClientRect();
        if (r.bottom < 0 || r.top > window.innerHeight) return;
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        const inside = px >= 0 && px <= 1 && py >= 0 && py <= 1;
        if (inside) {
          /* y drives rotateX, x drives rotateY — a card leaning INTO
             the cursor, so the near edge comes toward the reader. */
          el.style.setProperty("--tilt-x", `${((0.5 - py) * 2 * max).toFixed(2)}deg`);
          el.style.setProperty("--tilt-y", `${((px - 0.5) * 2 * max).toFixed(2)}deg`);
          el.style.setProperty("--mx", `${(px * 100).toFixed(1)}%`);
          el.style.setProperty("--my", `${(py * 100).toFixed(1)}%`);
          el.style.setProperty("--sheen", "1");
        } else {
          el.style.setProperty("--tilt-x", "0deg");
          el.style.setProperty("--tilt-y", "0deg");
          el.style.setProperty("--sheen", "0");
        }
      });
    },
    [ref, reduce, max]
  );
}

/**
 * A magnetic control: within `range` px the element drifts toward the
 * cursor by up to `pull` px, and snaps back outside it.
 *
 * The movement is a transform written through `--tx`/`--ty`, so the
 * button's own hover transform in the stylesheet still composes.
 */
export function useMagnetic(ref: El, pull = 7, range = 90) {
  const reduce = !!useReducedMotion();
  useEffect(
    function magnet() {
      const el = ref.current;
      if (!el || reduce) return;
      if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
      return track(true, function read(e) {
        const r = el.getBoundingClientRect();
        if (r.bottom < -range || r.top > window.innerHeight + range) return;
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        const dx = e.clientX - cx;
        const dy = e.clientY - cy;
        const d = Math.hypot(dx, dy);
        const reach = Math.max(r.width, r.height) / 2 + range;
        if (d > reach) {
          el.style.setProperty("--tx", "0px");
          el.style.setProperty("--ty", "0px");
          return;
        }
        /* falls off with distance, so the pull is strongest up close */
        const k = (1 - d / reach) * pull;
        el.style.setProperty("--tx", `${((dx / (d || 1)) * k).toFixed(2)}px`);
        el.style.setProperty("--ty", `${((dy / (d || 1)) * k).toFixed(2)}px`);
      });
    },
    [ref, reduce, pull, range]
  );
}

/**
 * The cursor spotlight for a LIGHT section.
 *
 * Capped at 6% opacity by the brief — on `#F5F4F9` anything stronger
 * reads as a smudge rather than light in the room. It is painted by the
 * section's own `::after` from `--sx`/`--sy`, so it adds no node to the
 * paint tree beyond the one pseudo.
 */
export function useSpotlight(ref: El) {
  const reduce = !!useReducedMotion();
  useEffect(
    function light() {
      const el = ref.current;
      if (!el || reduce) return;
      if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
      el.classList.add("has-spot");
      return track(true, function read(e) {
        const r = el.getBoundingClientRect();
        if (r.bottom < 0 || r.top > window.innerHeight) return;
        const inside =
          e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
        el.style.setProperty("--spot", inside ? "1" : "0");
        if (!inside) return;
        el.style.setProperty("--sx", `${(((e.clientX - r.left) / r.width) * 100).toFixed(1)}%`);
        el.style.setProperty("--sy", `${(((e.clientY - r.top) / r.height) * 100).toFixed(1)}%`);
      });
    },
    [ref, reduce]
  );
}

/** A button that leans toward the cursor. */
export function Magnetic({
  as: As = "span",
  className,
  children,
  ...rest
}: {
  as?: React.ElementType;
  className?: string;
  children: React.ReactNode;
  [k: string]: unknown;
}) {
  const ref = useRef<HTMLElement | null>(null);
  useMagnetic(ref);
  return (
    <As ref={ref} className={className ? `mag ${className}` : "mag"} {...rest}>
      {children}
    </As>
  );
}

/* ── the section blend ─────────────────────────────────────────────── */

/**
 * A tall band that carries one ground into the next.
 *
 * The brief asks for ≥30vh blending `#F5F4F9` → navy and back, with the
 * atmosphere fading through. This is 34vh tall and pulled 17vh into
 * each neighbour with negative margins, so it costs the page NO height
 * — it occupies padding that was already empty.
 *
 * Overlaying its neighbours is only safe because of how the gradient is
 * shaped: the outer 34% at each end is held FLAT at that neighbour's
 * exact ground colour, so for the first ~11.5vh the band is the same
 * colour as what it covers and is literally invisible. The whole colour
 * change happens in the middle third, which straddles the section
 * boundary where no section has content — every section here carries at
 * least 12vh of padding at its edges.
 *
 * `mist` fades a soft atmospheric glow through the middle of the band,
 * so the transition reads as air rather than as a gradient swatch.
 */
export function Blend({
  from,
  to,
  mist = true,
}: {
  from: string;
  to: string;
  mist?: boolean;
}) {
  return (
    <div
      aria-hidden
      className={mist ? "nl-blend nl-blend--mist" : "nl-blend"}
      style={{ "--from": from, "--to": to } as CSSProperties}
    />
  );
}
