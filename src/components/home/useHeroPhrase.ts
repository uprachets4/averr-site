import { useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { CYCLE_MS, PHRASES } from "./heroPhrases";

/**
 * Who is driving the hero's phrase.
 *
 * It cycles by itself only while it is worth watching — the hero in
 * view, the tab visible, motion welcome — and it stops PERMANENTLY the
 * first time the reader touches it. Someone who has taken the wheel
 * should not have it moved under them a moment later.
 *
 * `announce` is non-empty only after a user-initiated change, so the
 * live region never reads out the auto-cycle.
 */
export function useHeroPhrase(
  hostRef: React.RefObject<HTMLElement | null>,
  /** Hold the current phrase without ending the cycle — the pinned
   *  takeover sets this, because the dark layer carries a copy of the
   *  active phrase and a hard swap under it would flick. */
  paused = false
) {
  const reduce = !!useReducedMotion();
  const [index, setIndex] = useState(0);
  const [engaged, setEngaged] = useState(false);
  const [announce, setAnnounce] = useState("");
  const [inView, setInView] = useState(false);
  const [visible, setVisible] = useState(true);
  const engagedRef = useRef(false);

  /* the reader takes over */
  const choose = useCallback(function choose(next: number, fromUser: boolean) {
    const i = ((next % PHRASES.length) + PHRASES.length) % PHRASES.length;
    setIndex(i);
    if (fromUser) {
      engagedRef.current = true;
      setEngaged(true);
      setAnnounce(PHRASES[i].text);
    }
  }, []);

  const next = useCallback(function next(fromUser: boolean) {
    setIndex((v) => {
      const i = (v + 1) % PHRASES.length;
      if (fromUser) setAnnounce(PHRASES[i].text);
      return i;
    });
    if (fromUser) {
      engagedRef.current = true;
      setEngaged(true);
    }
  }, []);

  /* only cycle while the hero is actually on screen */
  useEffect(
    function watchInView() {
      const el = hostRef.current;
      if (!el || typeof IntersectionObserver === "undefined") {
        setInView(true);
        return;
      }
      const io = new IntersectionObserver(
        (entries) => setInView(entries.some((e) => e.isIntersecting)),
        { threshold: 0.25 }
      );
      io.observe(el);
      return function off() {
        io.disconnect();
      };
    },
    [hostRef]
  );

  /* and only while the tab is */
  useEffect(function watchVisibility() {
    function on() {
      setVisible(!document.hidden);
    }
    on();
    document.addEventListener("visibilitychange", on);
    return function off() {
      document.removeEventListener("visibilitychange", on);
    };
  }, []);

  useEffect(
    function autoCycle() {
      if (reduce || engaged || paused || !inView || !visible) return;
      const t = window.setInterval(function tick() {
        if (engagedRef.current) return;
        setIndex((v) => (v + 1) % PHRASES.length);
      }, CYCLE_MS);
      return function stop() {
        window.clearInterval(t);
      };
    },
    [reduce, engaged, paused, inView, visible]
  );

  return { index, phrase: PHRASES[index], engaged, announce, choose, next, reduce };
}

export type HeroPhrase = ReturnType<typeof useHeroPhrase>;
