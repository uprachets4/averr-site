import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion, useSpring } from "motion/react";
import { duration, ease, spring } from "../../lib/motion";
import MagneticCTA from "../MagneticCTA";
import {
  addDays,
  dayOfMonth,
  isWeekend,
  longLabel,
  nextBusinessDay,
  scheduleFrom,
  shortLabel,
  toISO,
  todayInToronto,
  weekdayLong,
  weekdayShort,
  type CivilDate,
} from "../../lib/businessDays";

/**
 * "Pick the day you call us."
 *
 * The 14-day calendar it replaces was accurate and inert: fourteen cells
 * filling as you scrolled past, which the reader had to decode before it
 * said anything. This asks one question and answers it with the reader's
 * own dates.
 *
 * Nothing here is a new promise. The three facts are the ones the old
 * section already printed — a 20-minute call, a scoped proposal within 3
 * business days, kickoff within 14 days — and the old headline survives
 * as the closing line of the result.
 *
 * All the date arithmetic lives in lib/businessDays.ts and is unit
 * tested (`npm run test:dates`), because "+3 business days" across a
 * weekend, a month and a year boundary is exactly the kind of thing that
 * looks right in one timezone in one month.
 */

const DAYS_SHOWN = 21;
/** The kickoff bound, in calendar days — also the length of the line. */
const KICKOFF_DAYS = 14;

/** /contact carries the Cal.com embed; the date rides along as a param. */
function bookingHref(d: CivilDate) {
  return `/contact?date=${toISO(d)}`;
}

export default function KickoffPicker() {
  const reduce = useReducedMotion();

  // One "today" for the life of the mount. Recomputing it per render
  // would let a midnight tick move every chip under the reader.
  const today = useMemo(() => todayInToronto(), []);
  const days = useMemo(
    () => Array.from({ length: DAYS_SHOWN }, (_, i) => addDays(today, i)),
    [today]
  );
  const firstSelectable = useMemo(
    () => days.findIndex((d) => !isWeekend(d)),
    [days]
  );
  const [index, setIndex] = useState(() =>
    Math.max(0, days.findIndex((d) => toISO(d) === toISO(nextBusinessDay(today))))
  );

  const selected = days[index] ?? days[firstSelectable] ?? today;
  const plan = useMemo(() => scheduleFrom(selected), [selected]);

  /* ── selection helpers ─────────────────────────────────────────── */

  const step = useCallback(
    function move(from: number, dir: 1 | -1) {
      let i = from + dir;
      while (i >= 0 && i < days.length && isWeekend(days[i])) i += dir;
      return i >= 0 && i < days.length ? i : from;
    },
    [days]
  );

  const lastSelectable = useMemo(() => {
    for (let i = days.length - 1; i >= 0; i--) if (!isWeekend(days[i])) return i;
    return 0;
  }, [days]);

  function onKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    let next: number | null = null;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") next = step(index, 1);
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = step(index, -1);
    else if (e.key === "Home") next = firstSelectable;
    else if (e.key === "End") next = lastSelectable;
    if (next === null) return;
    e.preventDefault();
    setIndex(next);
  }

  /* ── the lens ──────────────────────────────────────────────────── */

  const stripRef = useRef<HTMLDivElement | null>(null);
  const chipRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const [lens, setLens] = useState<{ x: number; w: number } | null>(null);
  const lensX = useSpring(0, reduce ? { duration: 0 } : spring.soft);
  const lensW = useSpring(0, reduce ? { duration: 0 } : spring.soft);

  useLayoutEffect(
    function placeLens() {
      function run() {
        const el = chipRefs.current[index];
        const host = stripRef.current;
        if (!el || !host) return;
        const x = el.offsetLeft;
        const w = el.offsetWidth;
        setLens({ x, w });
        if (lensW.get() === 0) {
          // first placement: no glide from the left edge
          lensX.jump(x);
          lensW.jump(w);
        } else {
          lensX.set(x);
          lensW.set(w);
        }
      }
      run();
      const ro = new ResizeObserver(run);
      if (stripRef.current) ro.observe(stripRef.current);
      return function cleanup() {
        ro.disconnect();
      };
    },
    [index, lensX, lensW, days.length]
  );

  /** Nearest selectable chip under a client x. */
  const pickAt = useCallback(function find(clientX: number) {
    let best = -1;
    let bestDist = Infinity;
    chipRefs.current.forEach((el, i) => {
      if (!el || el.disabled) return;
      const r = el.getBoundingClientRect();
      const d = Math.abs(clientX - (r.left + r.width / 2));
      if (d < bestDist) {
        bestDist = d;
        best = i;
      }
    });
    return best;
  }, []);

  const dragging = useRef(false);
  function onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    // let a touch scroll the strip; dragging is a pointer affordance
    if (e.pointerType === "touch") return;
    dragging.current = true;
    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
    const i = pickAt(e.clientX);
    if (i >= 0) setIndex(i);
  }
  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!dragging.current) return;
    const i = pickAt(e.clientX);
    if (i >= 0 && i !== index) setIndex(i);
  }
  function endDrag(e: React.PointerEvent<HTMLDivElement>) {
    dragging.current = false;
    (e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId);
  }

  /* ── the result ────────────────────────────────────────────────── */

  const proposalOffset = Math.round(
    (plan.proposal.getTime() - plan.call.getTime()) / 86400000
  );

  const sentence =
    `Call us ${longLabel(plan.call)}. Your proposal arrives by ${longLabel(plan.proposal)}. ` +
    `You're in kickoff by ${longLabel(plan.kickoff)}, with preview URLs from day one.`;

  return (
    <section
      style={{
        backgroundColor: "var(--color-bg-warm)",
        padding: "140px 0",
        position: "relative",
      }}
    >
      <div style={{ width: "100%", maxWidth: "var(--container-wide)", margin: "0 auto" }}>
        <motion.div
          initial={{ opacity: 1, y: reduce ? 0 : 12 }}
          whileInView={{ y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: reduce ? 0 : duration.base, ease: ease.outQuart }}
          className="type-eyebrow"
          style={{ color: "var(--color-muted)", marginBottom: 24 }}
        >
          //_05 · try it
        </motion.div>

        <h2 className="type-h2" style={{ color: "var(--color-ink)", margin: "0 0 14px", maxWidth: 900 }}>
          Pick the day <span className="type-accent">you</span> call us.
        </h2>
        <p
          className="type-body-lg"
          style={{ color: "var(--color-muted)", margin: "0 0 56px", maxWidth: 620 }}
        >
          We'll show you exactly when your project starts.
        </p>

        {/* ── the strip ─────────────────────────────────────────── */}
        <div
          ref={stripRef}
          role="radiogroup"
          aria-label="Choose the day you call us"
          tabIndex={0}
          onKeyDown={onKeyDown}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          className="kp-strip"
          style={{ position: "relative", touchAction: "pan-x" }}
        >
          {/* the lens glides; the chips never move */}
          {lens ? (
            <motion.span
              aria-hidden
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                height: "100%",
                x: lensX,
                width: lensW,
                borderRadius: 12,
                background: "var(--color-ink)",
                pointerEvents: "none",
                zIndex: 0,
              }}
            />
          ) : null}

          {days.map((d, i) => {
            const weekend = isWeekend(d);
            const active = i === index;
            return (
              <button
                key={toISO(d)}
                ref={function keep(el) {
                  chipRefs.current[i] = el;
                }}
                type="button"
                role="radio"
                aria-checked={active}
                aria-label={longLabel(d) + (weekend ? " — weekend, not available" : "")}
                disabled={weekend}
                tabIndex={-1}
                onClick={() => !weekend && setIndex(i)}
                className="kp-chip"
                style={{
                  position: "relative",
                  zIndex: 1,
                  background: "transparent",
                  border: "1px solid",
                  borderColor: active ? "transparent" : "rgba(20,20,18,0.12)",
                  color: active
                    ? "var(--color-bg)"
                    : weekend
                      ? "rgba(20,20,18,0.3)"
                      : "var(--color-ink)",
                  cursor: weekend ? "default" : "pointer",
                  transition: `color ${duration.base * 1000}ms ease, border-color ${duration.base * 1000}ms ease`,
                }}
              >
                <span className="type-eyebrow" style={{ display: "block", opacity: weekend ? 0.7 : 0.72 }}>
                  {weekdayShort(d)}
                </span>
                <span style={{ display: "block", fontSize: 18, fontWeight: 600, marginTop: 2 }}>
                  {dayOfMonth(d)}
                </span>
              </button>
            );
          })}
        </div>

        <p
          className="type-small"
          style={{ color: "var(--color-muted-2)", margin: "14px 0 0" }}
        >
          Drag, tap or use the arrow keys. Weekends are off — the call happens on a business day.
        </p>

        {/* ── the result ────────────────────────────────────────── */}
        <div aria-live="polite" className="sr-only">
          {sentence}
        </div>

        <div className="kp-result" style={{ marginTop: 64 }}>
          <Node
            label="Discovery call"
            date={plan.call}
            meta="20 minutes"
            reduce={!!reduce}
          />
          <Segment grow={proposalOffset} selectedKey={toISO(selected)} reduce={!!reduce} />
          <Node
            label="Proposal"
            date={plan.proposal}
            meta="by"
            prefix
            reduce={!!reduce}
          />
          <Segment
            grow={KICKOFF_DAYS - proposalOffset}
            selectedKey={toISO(selected)}
            reduce={!!reduce}
          />
          <Node
            label="Kickoff"
            date={plan.kickoff}
            meta="by"
            prefix
            accent
            align="end"
            reduce={!!reduce}
          />
        </div>

        <p
          className="type-body-lg"
          style={{ color: "var(--color-ink)", margin: "48px 0 0", maxWidth: 760 }}
        >
          {sentence}
        </p>
        <p
          className="type-body"
          style={{ color: "var(--color-muted)", margin: "12px 0 0", maxWidth: 760 }}
        >
          Three steps. Two weeks to kickoff,&nbsp;max.
        </p>

        <div style={{ marginTop: 40 }}>
          <MagneticCTA to={bookingHref(plan.call)} variant="primary">
            {`Book ${weekdayLong(plan.call)}'s call`}
          </MagneticCTA>
        </div>
      </div>

      <style>{`
        .kp-strip {
          display: flex;
          gap: 8px;
          overflow-x: auto;
          padding: 4px;
          scrollbar-width: none;
          scroll-snap-type: x proximity;
        }
        .kp-strip::-webkit-scrollbar { display: none; }
        .kp-strip:focus-visible {
          outline: 2px solid var(--color-ink);
          outline-offset: 4px;
          border-radius: 14px;
        }
        .kp-chip {
          flex: 0 0 auto;
          min-width: 54px;
          padding: 9px 8px 11px;
          border-radius: 12px;
          text-align: center;
          scroll-snap-align: center;
          font-family: inherit;
        }
        .kp-result {
          display: flex;
          align-items: flex-start;
          gap: 0;
        }
        @media (max-width: 900px) {
          .kp-result { flex-direction: column; align-items: stretch; gap: 18px; }
          .kp-chip { min-width: 56px; }
          /* stacked: the segment turns on its side so it still joins the
             nodes rather than sitting as a stray 1px line */
          .kp-seg {
            flex-grow: 0 !important;
            width: 1px;
            height: 22px !important;
            margin: 0 0 0 3px !important;
          }
        }
      `}</style>
    </section>
  );
}

/* ── one node on the line ─────────────────────────────────────────── */

function Node({
  label,
  date,
  meta,
  prefix,
  accent,
  align,
  reduce,
}: {
  label: string;
  date: CivilDate;
  meta: string;
  prefix?: boolean;
  accent?: boolean;
  align?: "end";
  reduce: boolean;
}) {
  return (
    <div
      style={{
        flex: "0 0 auto",
        minWidth: 0,
        textAlign: align === "end" ? "right" : "left",
      }}
    >
      <div className="type-eyebrow" style={{ color: "var(--color-muted)", marginBottom: 10 }}>
        {label}
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          gap: 8,
          justifyContent: align === "end" ? "flex-end" : "flex-start",
        }}
      >
        {prefix ? (
          <span className="type-small" style={{ color: "var(--color-muted)" }}>
            {meta}
          </span>
        ) : null}
        <span className="type-h2" style={{ color: "var(--color-ink)", whiteSpace: "nowrap" }}>
          {/* The odometer is a column of all ten glyphs, so it is hidden
              from assistive tech and the real date is given here. */}
          <span className="sr-only">{longLabel(date)}</span>
          {/* type-accent must sit INSIDE type-h2, never beside it: its
              font-size is 1.12em, which resolves against the parent's
              size. On the same element it measured against the inherited
              body size and rendered the kickoff date at a third of the
              others. */}
          <span aria-hidden className={accent ? "type-accent" : undefined}>
            {weekdayShort(date)} <Odometer value={dayOfMonth(date)} reduce={reduce} />
          </span>
        </span>
      </div>
      <div className="type-small" style={{ color: "var(--color-muted)", marginTop: 6 }}>
        {prefix ? shortLabel(date) : `${shortLabel(date)} · ${meta}`}
      </div>
    </div>
  );
}

/**
 * A rolling digit.
 *
 * Transform only: a column of ten glyphs translated by -10% per unit, so
 * nothing re-renders text mid-animation and nothing animates height.
 */
function Odometer({ value, reduce }: { value: number; reduce: boolean }) {
  const digits = String(value).split("");
  return (
    // Tabular figures, so every column is one advance wide. Proportional
    // digits make each column as wide as the widest glyph in it, which
    // rendered "14" as "1 4".
    <span style={{ display: "inline-flex", fontVariantNumeric: "tabular-nums" }}>
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
        display: "inline-block",
        overflow: "hidden",
        width: "1ch",
        height: "1em",
        lineHeight: 1,
        verticalAlign: "baseline",
        textAlign: "center",
      }}
    >
      <motion.span
        style={{ display: "block" }}
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

/** The line between two nodes. Its length is the gap in calendar days. */
function Segment({
  grow,
  selectedKey,
  reduce,
}: {
  grow: number;
  selectedKey: string;
  reduce: boolean;
}) {
  const flex = useSpring(grow, reduce ? { duration: 0 } : spring.soft);
  useEffect(
    function follow() {
      flex.set(grow);
    },
    [grow, flex]
  );
  return (
    <motion.div
      aria-hidden
      className="kp-seg"
      style={{
        flexGrow: flex,
        flexBasis: 0,
        minWidth: 28,
        height: 1,
        marginTop: 44,
        marginLeft: 18,
        marginRight: 18,
        background: "rgba(20,20,18,0.14)",
        overflow: "hidden",
      }}
    >
      <motion.span
        key={selectedKey}
        style={{ display: "block", height: "100%", background: "var(--color-ink)", transformOrigin: "left" }}
        initial={{ scaleX: reduce ? 1 : 0 }}
        animate={{ scaleX: 1 }}
        transition={reduce ? { duration: 0 } : { duration: duration.slow, ease: ease.outQuart }}
      />
    </motion.div>
  );
}
