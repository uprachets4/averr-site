import { useCallback, useEffect, useRef } from "react";
import { prefersReducedMotion } from "../../about/v2/useSectionProgress";

/**
 * The two doors, each with a living vignette.
 *
 * Both loops are driven by timers that write classes straight onto
 * the nodes — never through React state. A re-render would reconcile
 * `className` back to the JSX and wipe whatever the loop had set,
 * which is the bug spec 33 hit; this component renders once.
 *
 * Both loops stop when the doors scroll off screen and when the tab
 * is hidden, and under reduced motion neither animates: each shows
 * its finished state instead.
 */

/** The tiny letter that types itself. `n` is its character count. */
const MINI_LINES: { text: string; n: number }[] = [
  { text: "Hi Prachets,", n: 13 },
  { text: "I'm Maya, from Lakeshore Physio.", n: 27 },
  { text: "We're looking for", n: 15 },
  { text: "a second clinic site by spring.", n: 24 },
];

const MINI_TAGS: { label: string; color: string }[] = [
  { label: "Websites", color: "#F9AF97" },
  { label: "Marketing", color: "#569AFA" },
];

const DAY_LETTERS = ["M", "T", "W", "T", "F"];
const SLOT_TIMES = ["9:30 AM", "10:30 AM", "1:00 PM"];

/** Monday of the strip, counted forward from today. */
function weekdayNumbers(): number[] {
  const base = new Date();
  while (base.getDay() !== 1) base.setDate(base.getDate() + 1);
  return DAY_LETTERS.map((_, i) => {
    const d = new Date(base);
    d.setDate(base.getDate() + i);
    return d.getDate();
  });
}

export default function Doors({
  onGo,
}: {
  /** Smooth-scrolls to a section id. */
  onGo: (id: string) => void;
}) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const lineRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const tagsRef = useRef<HTMLSpanElement | null>(null);
  const dayRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const slotRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const bookedRef = useRef<HTMLDivElement | null>(null);

  const days = useRef(weekdayNumbers()).current;

  useEffect(function vignettes() {
    const root = rootRef.current;
    if (!root) return;
    const reduce = prefersReducedMotion();

    const timers: number[] = [];
    const clear = () => {
      for (const t of timers) window.clearTimeout(t);
      timers.length = 0;
    };
    const after = (ms: number, fn: () => void) => {
      timers.push(window.setTimeout(fn, ms));
    };

    /* Reduced motion: both vignettes simply show their end state. */
    if (reduce) {
      lineRefs.current.forEach((l) => {
        if (l) l.style.width = l.style.getPropertyValue("--w");
      });
      tagsRef.current?.classList.add("on");
      dayRefs.current[1]?.classList.add("on");
      slotRefs.current[1]?.classList.add("on");
      bookedRef.current?.classList.add("on");
      return;
    }

    function miniLoop() {
      const lines = lineRefs.current.filter(Boolean) as HTMLSpanElement[];
      lines.forEach((l) => {
        l.classList.remove("on", "cur");
        l.style.width = "0";
      });
      tagsRef.current?.classList.remove("on");
      let t = 300;
      lines.forEach((l, i) => {
        after(t, function typeLine() {
          lines.forEach((x) => x.classList.remove("cur"));
          /* Back to the stylesheet's width so the keyframes can run. */
          l.style.width = "";
          l.classList.add("on", "cur");
        });
        t += MINI_LINES[i].n * 45 + 250;
        if (i === 2) {
          after(t, () => tagsRef.current?.classList.add("on"));
          t += 600;
        }
      });
      after(t + 2600, miniLoop);
    }

    let turn = 0;
    function talkLoop() {
      dayRefs.current.forEach((x) => x?.classList.remove("on"));
      slotRefs.current.forEach((x) => x?.classList.remove("on"));
      bookedRef.current?.classList.remove("on");
      const d = (turn * 2 + 1) % 5;
      const s = turn % 3;
      turn++;
      after(500, () => dayRefs.current[d]?.classList.add("on"));
      after(1300, () => slotRefs.current[s]?.classList.add("on"));
      after(2000, () => bookedRef.current?.classList.add("on"));
      after(4600, talkLoop);
    }

    let running = false;
    function start() {
      if (running) return;
      running = true;
      miniLoop();
      talkLoop();
    }
    function stop() {
      if (!running) return;
      running = false;
      clear();
    }

    /* Off screen or hidden tab: nothing animates. */
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting && !document.hidden) start();
          else stop();
        }
      },
      { threshold: 0.1 }
    );
    io.observe(root);

    function onVisibility() {
      if (document.hidden) stop();
      else if (root && root.getBoundingClientRect().bottom > 0) start();
    }
    document.addEventListener("visibilitychange", onVisibility);

    return function cleanup() {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      stop();
    };
  }, []);

  const track = useCallback(function track(e: React.PointerEvent<HTMLAnchorElement>) {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${(((e.clientX - r.left) / r.width) * 100).toFixed(1)}%`);
    el.style.setProperty("--my", `${(((e.clientY - r.top) / r.height) * 100).toFixed(1)}%`);
  }, []);

  const go = useCallback(
    function go(id: string) {
      return function handle(e: React.MouseEvent) {
        e.preventDefault();
        onGo(id);
      };
    },
    [onGo]
  );

  return (
    <div className="doors" ref={rootRef}>
      <a
        className="door"
        href="#write"
        style={{ "--dc": "#F9AF97" } as React.CSSProperties}
        onClick={go("write")}
        onPointerMove={track}
      >
        <div className="vign mini" aria-hidden="true">
          <span className="mh">TO · PRACHETS</span>
          {MINI_LINES.map(function line(l, i) {
            const tagsHere = i === 3;
            return (
              <span key={l.text}>
                {tagsHere ? (
                  <span
                    className="tags"
                    ref={(el) => {
                      tagsRef.current = el;
                    }}
                  >
                    {MINI_TAGS.map((t) => (
                      <span key={t.label} style={{ "--c": t.color } as React.CSSProperties}>
                        {t.label}
                      </span>
                    ))}
                  </span>
                ) : null}
                <span
                  className="tl"
                  style={{ "--n": l.n, "--w": `${l.n}ch` } as React.CSSProperties}
                  ref={(el) => {
                    lineRefs.current[i] = el;
                  }}
                >
                  {l.text}
                </span>
              </span>
            );
          })}
        </div>
        <div className="t">
          <span className="mono">Write · two minutes</span>
          <h2>
            Write to me <i aria-hidden="true">→</i>
          </h2>
          <p>Tell me what you need. I reply within 24 hours.</p>
        </div>
      </a>

      <a
        className="door"
        href="#talk"
        style={{ "--dc": "#9874E8" } as React.CSSProperties}
        onClick={go("talk")}
        onPointerMove={track}
      >
        <div className="vign" aria-hidden="true">
          <div className="wk">
            {DAY_LETTERS.map((d, i) => (
              <b key={`h${i}`}>{d}</b>
            ))}
            {days.map((n, i) => (
              <span
                key={`d${i}`}
                ref={(el) => {
                  dayRefs.current[i] = el;
                }}
              >
                {n}
              </span>
            ))}
          </div>
          <div className="slots">
            {SLOT_TIMES.map((t, i) => (
              <span
                key={t}
                ref={(el) => {
                  slotRefs.current[i] = el;
                }}
              >
                {t}
              </span>
            ))}
          </div>
          <div
            className="booked"
            ref={(el) => {
              bookedRef.current = el;
            }}
          >
            Booked · 30 min · Google Meet
          </div>
        </div>
        <div className="t">
          <span className="mono">Talk · 30 minutes</span>
          <h2>
            Book a call <i aria-hidden="true">→</i>
          </h2>
          <p>Pick a time that suits you. No slide deck.</p>
        </div>
      </a>
    </div>
  );
}
