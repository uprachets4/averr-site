import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";

/**
 * The journey layer.
 *
 * Five labels down the left edge with a progress fill, tracking which
 * chapter the reader is in and jumping to one on click. It stays out of
 * the way of the hero's first frame — nothing competes with the fold —
 * and appears once the hero's scroll-fill starts.
 *
 * The tone flips on dark chapters, read from the section itself rather
 * than from a hard-coded scroll position, so a chapter that moves does
 * not take the rail's contrast with it.
 *
 * Desktop only: on a phone a fixed rail is a thumb-sized obstruction
 * over content that is already one column.
 */

export type RailChapter = { id: string; label: string };

export const CHAPTERS: RailChapter[] = [
  { id: "ch-customer", label: "Your customer" },
  { id: "ch-seen", label: "Seen it before" },
  { id: "ch-work", label: "The work" },
  { id: "ch-services", label: "How we do it" },
  { id: "ch-founder", label: "Who you'll work with" },
  { id: "ch-start", label: "Your move" },
];

export default function ChapterRail() {
  const reduce = !!useReducedMotion();
  const [active, setActive] = useState(0);
  const [shown, setShown] = useState(false);
  const [dark, setDark] = useState(false);
  const [progress, setProgress] = useState(0);
  const raf = useRef(0);

  useEffect(function track() {
    if (window.matchMedia("(max-width: 1023px)").matches) return;

    function read() {
      raf.current = 0;
      const mid = window.innerHeight * 0.45;
      /* Fall back to the LAST chapter the reader has passed, not to the
         first: at the very bottom of the page no chapter contains the
         midpoint any more and the rail jumped back to chapter one. */
      let found = 0;
      let isDark = false;
      CHAPTERS.forEach(function each(c, i) {
        const el = document.getElementById(c.id);
        if (!el) return;
        const r = el.getBoundingClientRect();
        if (r.top <= mid) {
          found = i;
          isDark = el.dataset.tone === "dark";
        }
      });
      setActive(found);
      setDark(isDark);
      // the rail arrives once the hero's fill has begun
      const hero = document.getElementById(CHAPTERS[0].id);
      const heroTop = hero ? hero.getBoundingClientRect().top : 0;
      setShown(heroTop < -window.innerHeight * 0.25);
      const doc = document.documentElement;
      const span = doc.scrollHeight - window.innerHeight;
      setProgress(span > 0 ? Math.min(1, Math.max(0, window.scrollY / span)) : 0);
    }

    function onScroll() {
      if (raf.current) return;
      raf.current = requestAnimationFrame(read);
    }
    read();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return function off() {
      cancelAnimationFrame(raf.current);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  function jump(i: number) {
    const el = document.getElementById(CHAPTERS[i].id);
    if (!el) return;
    window.scrollTo({
      top: el.offsetTop + 2,
      behavior: reduce ? "auto" : "smooth",
    });
  }

  return (
    <motion.nav
      className={dark ? "rail rail--dark" : "rail"}
      aria-label="Page chapters"
      initial={false}
      animate={{ opacity: shown ? 1 : 0, x: shown ? 0 : -10 }}
      transition={{ duration: reduce ? 0 : 0.35 }}
      style={{ pointerEvents: shown ? "auto" : "none" }}
      // hidden from assistive tech while it is hidden from everyone else
      aria-hidden={!shown}
      inert={!shown}
    >
      <span className="rail-track" aria-hidden>
        <span className="rail-fill" style={{ transform: `scaleY(${progress})` }} />
      </span>
      <ol className="rail-list">
        {CHAPTERS.map(function item(c, i) {
          return (
            <li key={c.id}>
              <button
                type="button"
                className={i === active ? "rail-item rail-item--on" : "rail-item"}
                aria-current={i === active ? "true" : undefined}
                onClick={function go() {
                  jump(i);
                }}
              >
                <span className="rail-dot" aria-hidden />
                <span className="rail-label">{c.label}</span>
              </button>
            </li>
          );
        })}
      </ol>
    </motion.nav>
  );
}
