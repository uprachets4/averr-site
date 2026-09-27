import { useCallback, useLayoutEffect, useRef } from "react";
import { useMotionValueEvent, type MotionValue } from "motion/react";

/**
 * Scroll-linked opacity, written straight to the node.
 *
 * Why not `style={{ opacity: someMotionValue }}`:
 * motion 12.43.0 hardware-accelerates scroll-linked `opacity` by compiling it
 * into a native Web Animations API animation — and attaches that animation to a
 * **ViewTimeline**, i.e. the element's own progress through its scrollport,
 * rather than the useScroll() progress it was derived from. For anything inside
 * a `position: sticky` frame that timeline is meaningless: the element is
 * pinned, so it never moves through the scrollport.
 *
 * Confirmed via el.getAnimations(): a running Animation with timeline
 * "ViewTimeline" carrying the component's own keyframes on the wrong clock.
 * Once WAAPI owns a property framer stops writing inline style, and a WAAPI
 * animation outranks inline style in the cascade — so the element ignores the
 * MotionValue entirely. Transforms are unaffected; they are not accelerated
 * this way and stay on the JS path.
 *
 * Subscribing and assigning style.opacity keeps the property off the
 * accelerated path, so it tracks the real scroll progress.
 *
 * Usage: attach the returned ref to the element and drop `opacity` from its
 * style prop. Transform values (x/y/scale/rotate) can stay on motion as normal.
 */
export function useScrollStyle<T extends HTMLElement = HTMLElement>(
  opacity: MotionValue<number>
) {
  const ref = useRef<T | null>(null);

  const write = useCallback(function writeOpacity(v: number) {
    if (ref.current) ref.current.style.opacity = String(v);
  }, []);

  useMotionValueEvent(opacity, "change", write);

  useLayoutEffect(
    function setInitial() {
      write(opacity.get());
    },
    [opacity, write]
  );

  return ref;
}

export default useScrollStyle;
