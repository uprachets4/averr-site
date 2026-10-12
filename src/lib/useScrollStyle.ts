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

  // A callback ref, not a RefObject: elements that mount conditionally (the
  // hero's floating "serious." clone remounts whenever the pill is
  // re-measured) otherwise keep the browser default until the next scroll
  // event, which leaves them fully opaque if the reader is already parked
  // past the fade. Writing on attach makes the first paint correct.
  const setRef = useCallback(
    function attach(node: T | null) {
      ref.current = node;
      if (node) node.style.opacity = String(opacity.get());
    },
    [opacity]
  );

  useLayoutEffect(
    function setInitial() {
      write(opacity.get());
    },
    [opacity, write]
  );

  return setRef;
}

export default useScrollStyle;

/**
 * The same escape hatch for any other property.
 *
 * `clip-path` goes down the accelerated path too: the hero's landing wipe
 * was handed to motion as a scroll-linked `clipPath` and never opened —
 * it still read `inset(8% 2% 78% 74%)` at the end of the pin, because the
 * WAAPI animation motion compiled it into was running on the sticky
 * element's own ViewTimeline, which never advances.
 */
export function useScrollProp<T extends HTMLElement = HTMLElement>(
  value: MotionValue<string>,
  prop: "clipPath" | "filter" | "backgroundPosition"
) {
  const ref = useRef<T | null>(null);

  const write = useCallback(
    function writeProp(v: string) {
      if (ref.current) ref.current.style[prop] = v;
    },
    [prop]
  );

  useMotionValueEvent(value, "change", write);

  const setRef = useCallback(
    function attach(node: T | null) {
      ref.current = node;
      if (node) node.style[prop] = value.get();
    },
    [value, prop]
  );

  useLayoutEffect(
    function syncOnMount() {
      if (ref.current) ref.current.style[prop] = value.get();
    },
    [value, prop]
  );

  return setRef;
}
