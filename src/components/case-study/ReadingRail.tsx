import { useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { duration, ease } from "../../lib/motion";
import type { CaseSection } from "../../data/caseSections";

const WIDE = "(min-width: 1700px)";

/**
 * The reading rail.
 *
 * Only at >= 1700px, where a 1440-capped container leaves a real margin,
 * does the fixed left rail appear: one label per chapter, a 1px
 * track beside them that fills in the study's tint as you read, and the
 * current chapter at full ink. Narrow screens get the same progress as a
 * 2px bar under the nav (everything below 1700) — this is the page's only
 * progress indicator, so case studies no longer render ScrollProgress.
 *
 * Everything here is driven by one rAF-throttled scroll handler writing
 * inline styles: no per-label MotionValues, no ViewTimeline.
 */
export default function ReadingRail({
  sections,
  tint,
}: {
  sections: CaseSection[];
  tint: string;
}) {
  const reduce = useReducedMotion();
  const [wide, setWide] = useState(false);
  const [active, setActive] = useState(0);
  const [visible, setVisible] = useState(false);

  const fillRef = useRef<HTMLDivElement | null>(null);
  const barRef = useRef<HTMLDivElement | null>(null);
  const barWrapRef = useRef<HTMLDivElement | null>(null);
  const [onDark, setOnDark] = useState(false);

  useEffect(function watchWidth() {
    const mq = window.matchMedia(WIDE);
    setWide(mq.matches);
    function onChange(e: MediaQueryListEvent) {
      setWide(e.matches);
    }
    mq.addEventListener("change", onChange);
    return function cleanup() {
      mq.removeEventListener("change", onChange);
    };
  }, []);

  /* progress + active chapter, one handler, rAF-throttled */
  useEffect(
    function track() {
      let frame = 0;

      function read() {
        frame = 0;
        const els = sections
          .map(function find(s) {
            return document.getElementById(s.id);
          })
          .filter(Boolean) as HTMLElement[];
        if (els.length === 0) return;

        const first = els[0];
        const last = els[els.length - 1];
        const start = first.offsetTop;
        const end = last.offsetTop + last.offsetHeight;
        const y = window.scrollY + window.innerHeight * 0.5;

        // the rail lives from the end of the hero to the end of Outcome
        const inRange = y > start && window.scrollY < end;
        setVisible(inRange);

        const p = Math.max(0, Math.min(1, (y - start) / Math.max(1, end - start)));
        if (fillRef.current) fillRef.current.style.transform = `scaleY(${p})`;
        if (barRef.current) barRef.current.style.transform = `scaleX(${p})`;

        // the nav shrinks its padding as you scroll, so the bar has to follow
        // its live bottom edge rather than a height measured once at mount
        const nav = document.querySelector('nav[aria-label="Primary"]');
        if (nav && barWrapRef.current) {
          barWrapRef.current.style.top = `${Math.round(
            nav.getBoundingClientRect().bottom
          )}px`;
        }

        // active = the last section whose top has crossed the reading line
        let next = 0;
        for (let i = 0; i < els.length; i++) {
          if (els[i].offsetTop <= y) next = i;
        }
        setActive(next);

        // tone: is the rail's own band sitting over a dark surface?
        const railY = window.innerHeight / 2;
        const probe = document.elementsFromPoint(24, railY);
        setOnDark(
          probe.some(function isDark(el) {
            return el instanceof HTMLElement && el.dataset.tone === "dark";
          })
        );
      }

      function onScroll() {
        if (frame) return;
        frame = requestAnimationFrame(read);
      }

      read();
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onScroll);
      return function cleanup() {
        if (frame) cancelAnimationFrame(frame);
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onScroll);
      };
    },
    [sections]
  );

  const go = useCallback(
    function jump(e: React.MouseEvent, section: CaseSection) {
      e.preventDefault();
      const el = document.getElementById(section.id);
      if (!el) return;
      el.scrollIntoView({
        behavior: reduce ? "auto" : "smooth",
        block: "start",
      });
      // focus the section's heading so the keyboard lands where the eye does
      const heading = el.querySelector<HTMLElement>("[data-section-heading]");
      if (heading) {
        heading.setAttribute("tabindex", "-1");
        heading.focus({ preventScroll: true });
      }
    },
    [reduce]
  );

  const ink = onDark ? "var(--color-parch)" : "var(--color-ink)";
  const fade = reduce
    ? "none"
    : `opacity ${duration.base * 1000}ms cubic-bezier(${ease.outQuart.join(",")})`;

  if (!wide) {
    return (
      <div
        ref={barWrapRef}
        aria-hidden
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: 2,
          zIndex: 90,
          pointerEvents: "none",
          opacity: visible ? 1 : 0,
          transition: fade,
        }}
      >
        <div
          ref={barRef}
          style={{
            height: "100%",
            background: tint,
            transformOrigin: "left",
            transform: "scaleX(0)",
          }}
        />
      </div>
    );
  }

  return (
    <nav
      aria-label="Case study chapters"
      style={{
        position: "fixed",
        top: "50%",
        // Only >= 1700 is the margin beside a 1440-capped container wide
        // enough for 24px of edge, the 31px rail and 48px of clearance.
        // The inner min() keeps the rail a quarter into the margin rather
        // than drifting toward the copy; the outer max() holds the edge.
        left:
          "max(24px, min(calc((100vw - var(--container-wide)) / 2 - 79px), calc((100vw - var(--container-wide)) / 4)))",
        transform: "translateY(-50%)",
        zIndex: 40,
        display: "flex",
        gap: 12,
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? "auto" : "none",
        transition: fade,
      }}
    >
      {/* the track fills as you read */}
      <div
        aria-hidden
        style={{
          position: "relative",
          width: 1,
          background: onDark ? "var(--hair-d)" : "var(--hair)",
          flexShrink: 0,
        }}
      >
        <div
          ref={fillRef}
          style={{
            position: "absolute",
            inset: 0,
            background: tint,
            transformOrigin: "top",
            transform: "scaleY(0)",
          }}
        />
      </div>

      <ol
        style={{
          listStyle: "none",
          margin: 0,
          padding: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 18,
        }}
      >
        {sections.map(function drawLabel(s, i) {
          return (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                onClick={function click(e) {
                  go(e, s);
                }}
                className="type-eyebrow"
                aria-current={i === active ? "true" : undefined}
                style={{
                  display: "block",
                  writingMode: "vertical-rl",
                  transform: "rotate(180deg)",
                  fontFamily: "var(--font-mono)",
                  color: ink,
                  opacity: i === active ? 1 : 0.45,
                  textDecoration: "none",
                  transition: reduce
                    ? "none"
                    : `opacity ${duration.base * 1000}ms cubic-bezier(${ease.outQuart.join(
                        ","
                      )}), color ${duration.base * 1000}ms cubic-bezier(${ease.inOut.join(
                        ","
                      )})`,
                }}
              >
                {s.label}
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
