import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { motion, useReducedMotion, useSpring } from "motion/react";
import { duration, ease, spring } from "../../lib/motion";
import MagneticCTA from "../MagneticCTA";
import AverrMark from "../AverrMark";
import {
  addDays,
  dayOfMonth,
  holidayName,
  isWeekend,
  longLabel,
  sameDay,
  scheduleFrom,
  shortLabel,
  toISO,
  todayInToronto,
  weekdayLong,
  weekdayShort,
  type CivilDate,
} from "../../lib/businessDays";

/**
 * "Your project start pass."
 *
 * Two questions — what the business is called, and when to talk — that
 * build one artefact: a boarding pass with the reader's own dates on it.
 * 17e's strip-and-row got the concept but not the presentation; this is
 * the centrepiece version.
 *
 * THE BUSINESS NAME NEVER LEAVES THE BROWSER except as the booking
 * prefill the reader is on their way to use. It is component state: no
 * localStorage, no analytics, no fetch. It rides to /contact as `notes`
 * only because Cal.com prefills its notes field from that param, and it
 * is never put in `name`, which is a person's.
 *
 * Every date comes from lib/businessDays.ts, which is unit tested
 * (`npm run test:dates`) — weekends are bookable, and the three-business
 * day proposal count skips weekends and Ontario statutory holidays.
 */

const DAYS_SHOWN = 28;
/** Width of one wheel cell. The wheel is centred by translating by this. */
const CELL = 150;
const CELL_MOBILE = 104;

export default function KickoffPass() {
  const reduce = useReducedMotion();
  const today = useMemo(() => todayInToronto(), []);
  const days = useMemo(
    () => Array.from({ length: DAYS_SHOWN }, (_, i) => addDays(today, i)),
    [today]
  );
  const [index, setIndex] = useState(0);
  const [name, setName] = useState("");

  const selected = days[index] ?? today;
  const plan = useMemo(() => scheduleFrom(selected), [selected]);
  const trimmed = name.trim();

  const sentence =
    `Call us ${longLabel(plan.call)}. Your proposal arrives by ${longLabel(plan.proposal)}. ` +
    `You're in kickoff by ${longLabel(plan.kickoff)}, with preview URLs from day one.`;

  /* ── the wheel ─────────────────────────────────────────────────── */

  const [cell, setCell] = useState(CELL);
  useEffect(function watchWidth() {
    function run() {
      setCell(window.innerWidth < 1024 ? CELL_MOBILE : CELL);
    }
    run();
    window.addEventListener("resize", run);
    return function off() {
      window.removeEventListener("resize", run);
    };
  }, []);

  const x = useSpring(0, reduce ? { duration: 0 } : spring.soft);
  useEffect(
    function centre() {
      x.set(-index * cell);
    },
    [index, cell, x]
  );

  const clamp = useCallback(
    (i: number) => Math.max(0, Math.min(DAYS_SHOWN - 1, i)),
    []
  );

  const drag = useRef<{ startX: number; startIndex: number; last: number; v: number } | null>(null);
  function onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    drag.current = { startX: e.clientX, startIndex: index, last: e.clientX, v: 0 };
    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
  }
  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    const d = drag.current;
    if (!d) return;
    d.v = e.clientX - d.last;
    d.last = e.clientX;
    const moved = Math.round((d.startX - e.clientX) / cell);
    const next = clamp(d.startIndex + moved);
    if (next !== index) setIndex(next);
  }
  function onPointerUp(e: React.PointerEvent<HTMLDivElement>) {
    const d = drag.current;
    drag.current = null;
    (e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId);
    if (!d || reduce) return;
    // momentum: a fast flick carries on a little past where it was let go
    const carry = Math.max(-4, Math.min(4, Math.round(-d.v / 7)));
    if (carry) setIndex((i) => clamp(i + carry));
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    let next: number | null = null;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") next = clamp(index + 1);
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = clamp(index - 1);
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = DAYS_SHOWN - 1;
    if (next === null) return;
    e.preventDefault();
    setIndex(next);
  }

  /* ── the stamp: once per completion, not per keystroke ─────────── */

  const complete = trimmed.length > 0;
  const [stamped, setStamped] = useState(false);
  const wasComplete = useRef(false);
  useEffect(
    function fireOnce() {
      if (complete && !wasComplete.current) setStamped(true);
      if (!complete) setStamped(false);
      wasComplete.current = complete;
    },
    [complete]
  );

  /* ── cursor tilt (desktop, pointer-fine only) ──────────────────── */

  const cardRef = useRef<HTMLDivElement | null>(null);
  const tiltX = useSpring(0, reduce ? { duration: 0 } : spring.soft);
  const tiltY = useSpring(0, reduce ? { duration: 0 } : spring.soft);
  const [fine, setFine] = useState(false);
  useEffect(function watchPointer() {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine) and (min-width: 1024px)");
    setFine(mq.matches);
    function on(e: MediaQueryListEvent) {
      setFine(e.matches);
    }
    mq.addEventListener("change", on);
    return function off() {
      mq.removeEventListener("change", on);
    };
  }, []);
  function onCardMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!fine || reduce) return;
    const r = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    tiltY.set(px * 8); // ≤ 4deg each way
    tiltX.set(-py * 8);
  }
  function onCardLeave() {
    tiltY.set(0);
    tiltX.set(0);
  }

  /* ── change pulse: sheen + a ≤3deg settle ──────────────────────── */

  const changeKey = `${toISO(selected)}|${trimmed}`;

  return (
    <section
      style={{
        backgroundColor: "var(--color-bg-warm)",
        padding: "140px 0",
        position: "relative",
      }}
    >
      <div style={{ width: "100%", maxWidth: "var(--container-wide)", margin: "0 auto" }}>
        <div className="type-eyebrow" style={{ color: "var(--color-muted)", marginBottom: 24 }}>
          //_05 · try it
        </div>

        <div className="kp2-stage">
          {/* ── left: the conversation ─────────────────────────── */}
          <div className="kp2-talk">
            <label className="kp2-q" htmlFor="kp2-name">
              <span className="type-eyebrow" style={{ color: "var(--color-muted)" }}>
                01 — What's your business called?
              </span>
              <input
                id="kp2-name"
                className="type-h2 kp2-input"
                type="text"
                value={name}
                maxLength={40}
                autoComplete="organization"
                placeholder="e.g. Northgate Renovations"
                onChange={(e) => setName(e.target.value)}
              />
            </label>

            <div className="kp2-q" style={{ marginTop: 56 }}>
              <span className="type-eyebrow" style={{ color: "var(--color-muted)" }}>
                02 — Pick a day to talk.
              </span>

              <div
                role="listbox"
                aria-label="Pick a day to talk"
                aria-activedescendant={`kp2-day-${index}`}
                tabIndex={0}
                onKeyDown={onKeyDown}
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
                onPointerCancel={onPointerUp}
                className="kp2-wheel"
              >
                <motion.div className="kp2-track" style={{ x }}>
                  {days.map((d, i) => {
                    const dist = Math.abs(i - index);
                    const active = i === index;
                    const wknd = isWeekend(d);
                    const hol = holidayName(d);
                    return (
                      <button
                        key={toISO(d)}
                        id={`kp2-day-${i}`}
                        role="option"
                        aria-selected={active}
                        type="button"
                        tabIndex={-1}
                        onClick={() => setIndex(i)}
                        className="kp2-day"
                        style={{
                          width: cell,
                          // transform + opacity only
                          transform: `scale(${active ? 1 : Math.max(0.56, 1 - dist * 0.16)})`,
                          opacity: Math.max(0, 1 - dist * 0.3),
                          color: active ? "var(--color-ink)" : "var(--color-muted)",
                        }}
                      >
                        <span className="kp2-day__wd type-eyebrow">{weekdayShort(d)}</span>
                        <span className={active ? "type-display-l kp2-day__n" : "type-h1 kp2-day__n"}>
                          {dayOfMonth(d)}
                        </span>
                        <span className="kp2-day__tag type-eyebrow">
                          {sameDay(d, today) ? "Today" : hol ? hol : wknd ? "Weekend call" : shortLabel(d)}
                        </span>
                      </button>
                    );
                  })}
                </motion.div>
                <span aria-hidden className="kp2-wheel__edge kp2-wheel__edge--l" />
                <span aria-hidden className="kp2-wheel__edge kp2-wheel__edge--r" />
              </div>

              <p className="type-small" style={{ color: "var(--color-muted-2)", marginTop: 14 }}>
                Drag, tap or use the arrow keys. Weekends are bookable — plenty of owners
                are only free then.
              </p>
            </div>

            <div aria-live="polite" className="sr-only">
              {sentence}
            </div>
          </div>

          {/* ── right: the pass ────────────────────────────────── */}
          <div className="kp2-passcol">
            <motion.div
              ref={cardRef}
              className="kp2-pass"
              onMouseMove={onCardMove}
              onMouseLeave={onCardLeave}
              initial={{ opacity: 0, y: reduce ? 0 : 40, rotate: reduce ? 0 : -2.5 }}
              whileInView={{ opacity: 1, y: 0, rotate: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: reduce ? 0 : duration.hero, ease: ease.outQuart }}
              style={{ rotateX: tiltX, rotateY: tiltY, transformPerspective: 1200 }}
            >
              {/* a ≤3deg settle on every change */}
              <motion.div
                key={`settle-${changeKey}`}
                initial={reduce ? false : { rotate: -2.4 }}
                animate={{ rotate: 0 }}
                transition={reduce ? { duration: 0 } : spring.snappy}
                style={{ position: "relative" }}
              >
                <div className="kp2-pass__head">
                  <AverrMark variant="nav" tone="light" />
                  <span className="type-eyebrow" style={{ color: "var(--color-muted)" }}>
                    Project start pass
                  </span>
                </div>

                <div className="kp2-pass__name type-h1">
                  {trimmed ? (
                    trimmed
                  ) : (
                    <span style={{ color: "var(--color-muted-2)" }}>Your business</span>
                  )}
                </div>

                <Row label="Discovery call" date={plan.call} meta="20 min" reduce={!!reduce} />
                <Row label="Proposal by" date={plan.proposal} reduce={!!reduce} />
                <KickoffRow date={plan.kickoff} reduce={!!reduce} />

                <div aria-hidden className="kp2-perf" />

                <div className="kp2-stub">
                  <Barcode seed={`${trimmed}|${toISO(selected)}`} />
                  <span className="kp2-stub__no type-eyebrow">
                    {passNumber(trimmed, selected)}
                  </span>
                  {stamped ? (
                    <motion.span
                      className="kp2-stamp type-eyebrow"
                      initial={reduce ? false : { scale: 1.3, rotate: -14, opacity: 0 }}
                      animate={{ scale: 1, rotate: -8, opacity: 1 }}
                      transition={reduce ? { duration: 0 } : spring.snappy}
                    >
                      Ready to book
                    </motion.span>
                  ) : null}
                </div>

                {/* sheen sweeps on change */}
                {reduce ? null : (
                  <motion.span
                    aria-hidden
                    key={`sheen-${changeKey}`}
                    className="kp2-sheen"
                    initial={{ x: "-120%" }}
                    animate={{ x: "220%" }}
                    transition={{ duration: duration.slow, ease: ease.outQuart }}
                  />
                )}
              </motion.div>
            </motion.div>

            <div style={{ marginTop: 32 }}>
              <MagneticCTA to={bookingHref(plan.call, trimmed)} variant="primary">
                {trimmed
                  ? `Book ${trimmed}'s call on ${weekdayShort(plan.call)}, ${shortLabel(plan.call)}`
                  : `Book your call on ${weekdayShort(plan.call)}, ${shortLabel(plan.call)}`}
              </MagneticCTA>
            </div>
          </div>
        </div>

        <p className="type-body-lg" style={{ color: "var(--color-ink)", margin: "56px 0 0", maxWidth: 820 }}>
          {sentence}
        </p>
        <p className="type-body" style={{ color: "var(--color-muted)", margin: "12px 0 0" }}>
          Three steps. Two weeks to kickoff,&nbsp;max.
        </p>
      </div>

      <style>{`
        .kp2-stage {
          display: grid;
          grid-template-columns: minmax(0, 1fr) 560px;
          gap: 72px;
          align-items: start;
        }
        .kp2-q { display: block; }
        .kp2-input {
          display: block;
          width: 100%;
          margin-top: 14px;
          padding: 6px 0 12px;
          background: transparent;
          border: none;
          border-bottom: 2px solid rgba(20,20,18,0.18);
          color: var(--color-ink);
          font-family: var(--font-display);
          outline: none;
          transition: border-color ${duration.base * 1000}ms ease;
        }
        .kp2-input::placeholder { color: rgba(20,20,18,0.26); }
        .kp2-input:focus { border-bottom-color: var(--color-ink); }

        .kp2-wheel {
          position: relative;
          margin-top: 18px;
          overflow: hidden;
          cursor: grab;
          touch-action: pan-y;
          padding: 8px 0 4px;
        }
        .kp2-wheel:active { cursor: grabbing; }
        .kp2-wheel:focus-visible { outline: 2px solid var(--color-ink); outline-offset: 6px; border-radius: 10px; }
        .kp2-track { display: flex; align-items: flex-end; will-change: transform; }
        .kp2-day {
          flex: 0 0 auto;
          background: none;
          border: none;
          padding: 0 6px;
          text-align: left;
          cursor: pointer;
          font-family: inherit;
          transform-origin: left bottom;
          transition: color ${duration.base * 1000}ms ease;
        }
        .kp2-day__wd { display: block; opacity: 0.7; }
        .kp2-day__n { display: block; line-height: 0.95; }
        .kp2-day__tag { display: block; margin-top: 4px; opacity: 0.68; white-space: nowrap; }
        .kp2-wheel__edge {
          position: absolute; top: 0; bottom: 0; width: 90px; pointer-events: none;
        }
        .kp2-wheel__edge--l { left: 0; background: linear-gradient(90deg, var(--color-bg-warm), transparent); }
        .kp2-wheel__edge--r { right: 0; background: linear-gradient(270deg, var(--color-bg-warm), transparent); }

        .kp2-pass {
          position: relative;
          background: var(--surface-elevated);
          border-radius: 18px;
          padding: 30px 34px 0;
          overflow: hidden;
          box-shadow:
            0 2px 4px rgba(62,48,28,0.06),
            0 10px 24px rgba(62,48,28,0.10),
            0 32px 64px rgba(62,48,28,0.14);
        }
        .kp2-pass__head {
          display: flex; align-items: center; justify-content: space-between;
          gap: 16px; padding-bottom: 22px;
          border-bottom: 1px solid rgba(20,20,18,0.08);
        }
        .kp2-pass__name {
          margin: 22px 0 26px;
          color: var(--color-ink);
          overflow-wrap: anywhere;
        }
        .kp2-perf {
          height: 1px; margin: 26px -34px 0;
          background-image: radial-gradient(circle at 5px 50%, rgba(20,20,18,0.26) 0 1.6px, transparent 1.7px);
          background-size: 10px 100%;
        }
        .kp2-stub {
          position: relative;
          display: flex; align-items: center; gap: 18px;
          margin: 0 -34px; padding: 20px 34px 24px;
          background: rgba(20,20,18,0.03);
        }
        .kp2-stub__no { color: var(--color-muted); letter-spacing: 0.18em; }
        .kp2-stamp {
          margin-left: auto;
          border: 2px solid #B4452F;
          color: #B4452F;
          border-radius: 6px;
          padding: 6px 12px;
          letter-spacing: 0.16em;
          transform-origin: center;
        }
        .kp2-sheen {
          position: absolute; inset: -40% -10%;
          background: linear-gradient(100deg, transparent 38%, rgba(255,255,255,0.72) 50%, transparent 62%);
          pointer-events: none;
        }

        @media (max-width: 1023px) {
          .kp2-stage { grid-template-columns: minmax(0, 1fr); gap: 48px; }
          .kp2-pass { padding: 24px 22px 0; border-radius: 14px; }
          .kp2-perf { margin: 22px -22px 0; }
          .kp2-stub { margin: 0 -22px; padding: 18px 22px 20px; flex-wrap: wrap; }
          .kp2-wheel__edge { width: 48px; }
        }
      `}</style>
    </section>
  );
}

/* ── pass rows ────────────────────────────────────────────────────── */

function Row({
  label,
  date,
  meta,
  reduce,
}: {
  label: string;
  date: CivilDate;
  meta?: string;
  reduce: boolean;
}) {
  return (
    <div style={{ display: "flex", alignItems: "baseline", gap: 14, padding: "10px 0" }}>
      <span className="type-eyebrow" style={{ color: "var(--color-muted)", flex: "0 0 132px" }}>
        {label}
      </span>
      <span className="type-body-lg" style={{ color: "var(--color-ink)", flex: 1, minWidth: 0 }}>
        <span className="sr-only">{longLabel(date)}</span>
        <span aria-hidden>
          {weekdayLong(date)}, {shortLabel(date).split(" ")[0]}{" "}
          <Odometer value={dayOfMonth(date)} reduce={reduce} />
        </span>
      </span>
      {meta ? (
        <span className="type-eyebrow" style={{ color: "var(--color-muted)" }}>
          {meta}
        </span>
      ) : null}
    </div>
  );
}

/**
 * The kickoff row, at display size in the accent voice.
 *
 * MEASURED, not hoped for. 17e shipped this clipped at the right edge
 * ("Wed 4", "Fri 2") because a display-size italic inside a fixed card
 * is wider than it looks. The line is measured at its base size and the
 * font scaled down to fit — one pass, reset-measure-write, with no
 * dependency on its own output (the React #185 lesson in §5).
 */
function KickoffRow({ date, reduce }: { date: CivilDate; reduce: boolean }) {
  const hostRef = useRef<HTMLSpanElement | null>(null);
  const lineRef = useRef<HTMLSpanElement | null>(null);
  const label = `${weekdayLong(date)}, ${shortLabel(date)}`;

  useLayoutEffect(
    function fit() {
      function run() {
        const host = hostRef.current;
        const line = lineRef.current;
        if (!host || !line) return;
        line.style.fontSize = "";
        const avail = host.clientWidth;
        if (!avail) return;
        const natural = line.scrollWidth;
        if (natural <= avail) return;
        const base = parseFloat(getComputedStyle(line).fontSize);
        line.style.fontSize = `${Math.max(18, Math.floor(base * (avail / natural)))}px`;
      }
      run();
      const ro = new ResizeObserver(run);
      if (hostRef.current) ro.observe(hostRef.current);
      window.addEventListener("resize", run);
      return function off() {
        ro.disconnect();
        window.removeEventListener("resize", run);
      };
    },
    [label]
  );

  return (
    <div style={{ padding: "16px 0 4px" }}>
      <span className="type-eyebrow" style={{ color: "var(--color-muted)", display: "block", marginBottom: 6 }}>
        Kickoff by
      </span>
      <span ref={hostRef} className="type-display-l" style={{ display: "block", minWidth: 0 }}>
        <span className="sr-only">{longLabel(date)}</span>
        {/* type-accent must NEST inside the size class: its 1.12em
            resolves against the parent's computed size (§5.33). */}
        <span
          ref={lineRef}
          aria-hidden
          className="type-accent"
          style={{ display: "inline-block", whiteSpace: "nowrap", color: "var(--color-ink)" }}
        >
          {weekdayShort(date)} <Odometer value={dayOfMonth(date)} reduce={reduce} />
        </span>
      </span>
    </div>
  );
}

/* ── odometer (carried over from 17e) ─────────────────────────────── */

function Odometer({ value, reduce }: { value: number; reduce: boolean }) {
  const digits = String(value).split("");
  return (
    <span style={{ display: "inline-flex" }}>
      {digits.map((d, i) => (
        <Digit key={`${digits.length}-${i}`} d={+d} reduce={reduce} />
      ))}
    </span>
  );
}

function Digit({ d, reduce }: { d: number; reduce: boolean }) {
  return (
    <span
      aria-hidden
      style={{
        position: "relative",
        display: "inline-block",
        overflow: "hidden",
        height: "1em",
        lineHeight: 1,
        verticalAlign: "baseline",
      }}
    >
      <span style={{ visibility: "hidden" }}>{d}</span>
      <motion.span
        style={{ display: "block", position: "absolute", left: 0, top: 0 }}
        animate={{ y: `${-d * 10}%` }}
        transition={reduce ? { duration: 0 } : { duration: duration.base, ease: ease.outQuart }}
      >
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
          <span key={n} style={{ display: "block", height: "1em", lineHeight: 1 }}>
            {n}
          </span>
        ))}
      </motion.span>
    </span>
  );
}

/* ── stub furniture ───────────────────────────────────────────────── */

/** A small, stable hash. Same name + same day, same bars. */
function hash(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function Barcode({ seed }: { seed: string }) {
  const bars = useMemo(
    function draw() {
      let h = hash(seed) || 1;
      const out: Array<[number, number]> = [];
      let x = 0;
      for (let i = 0; i < 34; i++) {
        h = (h * 1664525 + 1013904223) >>> 0;
        const w = 1 + (h % 3);
        out.push([x, w]);
        x += w + 1 + ((h >>> 8) % 2);
      }
      return { out, total: x };
    },
    [seed]
  );
  return (
    <svg aria-hidden width="150" height="34" viewBox={`0 0 ${bars.total} 34`} preserveAspectRatio="none">
      {bars.out.map(([bx, bw], i) => (
        <rect key={i} x={bx} y="0" width={bw} height="34" fill="rgba(20,20,18,0.72)" />
      ))}
    </svg>
  );
}

/** Decorative: initials + the chosen day. */
function passNumber(name: string, date: CivilDate) {
  const initials =
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase() ?? "")
      .join("") || "AV";
  const mm = String(date.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(date.getUTCDate()).padStart(2, "0");
  return `AV-${mm}${dd}-${initials}`;
}

/**
 * /contact carries the Cal.com embed. The day rides as `date`; the
 * business name rides as `notes`, which is the field Cal prefills from
 * that param — never as `name`, which belongs to a person.
 */
function bookingHref(d: CivilDate, business: string) {
  const q = new URLSearchParams({ date: toISO(d) });
  if (business) q.set("notes", business);
  return `/contact?${q.toString()}`;
}
