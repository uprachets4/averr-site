import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { track } from "../../../lib/analytics";
import { SERVICES } from "../../../data/servicesBuild";
import {
  bookedLabel,
  bookedSpoken,
  embedRequested,
  onBooked,
  openModal,
  torontoISODate,
  warmEmbed,
} from "../passBooking";

/**
 * The project start pass: a name, what you need, a day — and a ticket
 * that writes its own timeline.
 *
 * Dates are calendar arithmetic on Toronto's civil date, not on UTC: a
 * visitor loading the page at 9pm Toronto on a Monday must be offered
 * Tuesday, and `new Date()` in a UTC runtime would already say Tuesday
 * and offer Wednesday.
 *
 * Booking goes through the existing `passBooking`, so Cal.com's embed
 * is still fetched on intent and never on load, and a successful
 * booking still hands back nothing but `startTime`.
 *
 * Once a booking lands, every date on the pass recomputes from the
 * booked day rather than the one that was picked — the booked day is
 * the one that is true.
 */

const isBiz = (d: Date) => d.getDay() !== 0 && d.getDay() !== 6;

function addBiz(d: Date, n: number) {
  const x = new Date(d);
  while (n > 0) {
    x.setDate(x.getDate() + 1);
    if (isBiz(x)) n--;
  }
  return x;
}

/** Midnight on whatever day it currently is in Toronto. */
function torontoToday() {
  const iso = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Toronto",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

const fmt = (d: Date, o: Intl.DateTimeFormatOptions) => d.toLocaleDateString("en-CA", o);
const toISO = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;
const same = (a: Date, b: Date) => a.getTime() === b.getTime();

export default function StartPass({
  typed,
  onTyped,
}: {
  typed: string;
  onTyped: (v: string) => void;
}) {
  const today = useMemo(torontoToday, []);
  const firstDay = useMemo(() => addBiz(today, 1), [today]);
  const maxDay = useMemo(() => {
    const d = new Date(today);
    d.setDate(d.getDate() + 45);
    return d;
  }, [today]);

  const [day, setDay] = useState(firstDay);
  const [view, setView] = useState(() => new Date(firstDay.getFullYear(), firstDay.getMonth(), 1));
  const [picked, setPicked] = useState<Set<string>>(new Set());
  const [booked, setBooked] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const gridRef = useRef<HTMLDivElement | null>(null);
  const wantFocus = useRef<number | null>(null);

  const name = typed.trim();

  /* Once booked, the booked day is the basis for everything. */
  const basis = useMemo(() => {
    if (!booked) return day;
    const iso = torontoISODate(booked);
    if (!iso) return day;
    const [y, m, d] = iso.split("-").map(Number);
    return new Date(y, m - 1, d);
  }, [booked, day]);

  const proposal = useMemo(() => addBiz(basis, 3), [basis]);
  const kickoff = useMemo(() => addBiz(proposal, 7), [proposal]);

  const wd = fmt(basis, { weekday: "short" });
  const md = fmt(basis, { month: "short", day: "numeric" });
  const diff = Math.round((basis.getTime() - today.getTime()) / 864e5);

  const services = SERVICES.filter((_, i) => picked.has(String(i))).map((s) => s.name);
  const notes = [name, services.join(", ")].filter(Boolean).join(" · ");

  /* ── booking ────────────────────────────────────────────────── */

  const warm = useCallback(function intent() {
    if (!embedRequested()) warmEmbed().catch(() => undefined);
  }, []);

  async function book() {
    if (busy) return;
    track("pass_step", { step: "book_pressed", page: location.pathname });
    setBusy(true);
    try {
      await openModal({
        date: toISO(day),
        month: toISO(day).slice(0, 7),
        ...(notes ? { notes } : {}),
      });
      await onBooked((iso) => setBooked(iso));
    } catch {
      /* the embed could not load: the page stays as it is rather than
         claiming a booking that did not happen */
    } finally {
      setBusy(false);
    }
  }

  /**
   * The same harness the old pass carried, so the confirmed state can
   * be checked without putting a real booking on the owner's calendar.
   * Dev, localhost and the preview alias only — inert anywhere else.
   */
  useEffect(function harness() {
    const host = window.location.hostname;
    const allowed =
      import.meta.env.DEV ||
      host === "localhost" ||
      host === "127.0.0.1" ||
      host.endsWith(".vercel.app");
    if (!allowed) return;
    const q = new URLSearchParams(window.location.search).get("simulateBooking");
    if (q && !Number.isNaN(new Date(q).getTime())) setBooked(q);
  }, []);

  /* ── the calendar ───────────────────────────────────────────── */

  const offFor = useCallback(
    (d: Date) => !isBiz(d) || d < firstDay || d > maxDay,
    [firstDay, maxDay]
  );

  function pick(d: Date) {
    track("pass_step", { step: "day_picked", page: location.pathname });
    setDay(d);
    setBooked(null);
  }

  /** Arrow keys walk the grid, skipping anything unselectable. */
  function onGridKey(e: React.KeyboardEvent) {
    const stride =
      e.key === "ArrowLeft" ? -1 : e.key === "ArrowRight" ? 1 :
      e.key === "ArrowUp" ? -7 : e.key === "ArrowDown" ? 7 : 0;
    if (!stride) return;
    e.preventDefault();
    const dir = stride > 0 ? 1 : -1;
    const next = new Date(day);
    next.setDate(next.getDate() + stride);
    /* step past weekends and out-of-window days in the same direction */
    let guard = 0;
    while (offFor(next) && guard++ < 60) next.setDate(next.getDate() + dir);
    if (offFor(next)) return;
    pick(next);
    setView(new Date(next.getFullYear(), next.getMonth(), 1));
    wantFocus.current = next.getDate();
  }

  useEffect(
    function restoreFocus() {
      const want = wantFocus.current;
      if (want == null) return;
      wantFocus.current = null;
      gridRef.current
        ?.querySelector<HTMLButtonElement>(`button[data-d="${want}"]`)
        ?.focus();
    },
    [view, day]
  );

  const y = view.getFullYear();
  const m = view.getMonth();
  const lead = new Date(y, m, 1).getDay();
  const count = new Date(y, m + 1, 0).getDate();

  const label = bookedLabel(booked ?? "");

  return (
    <section className="sec gut" id="start" aria-labelledby="ph" style={{ paddingTop: 0 }}>
      <div className="wrap">
        <span className="eyebrow reveal">Your project start pass</span>
        <h2 id="ph" className="reveal" style={{ marginTop: 18 }}>
          Pick a day. Your timeline writes itself.
        </h2>

        <div className="pass">
          <div className="steps">
            <div className={`stepq${name ? " qok" : ""}`} id="q1">
              <span className="n">
                <i>1</i>Step 1 of 3
              </span>
              <h3>What's your business called?</h3>
              <div className="field">
                <input
                  id="biz2"
                  maxLength={28}
                  autoComplete="organization"
                  spellCheck={false}
                  placeholder="Northside Renovations"
                  aria-label="Your business name"
                  value={typed}
                  onChange={(e) => onTyped(e.target.value)}
                />
              </div>
            </div>

            <div className={`stepq${picked.size ? " qok" : ""}`} id="q2">
              <span className="n">
                <i>2</i>Step 2 of 3
              </span>
              <h3>What do you need?</h3>
              <div className="chipset svc" role="group" aria-label="Services you need">
                {SERVICES.map(function chip(s, i) {
                  const key = String(i);
                  return (
                    <button
                      type="button"
                      key={s.id}
                      style={{ "--c": s.color } as CSSProperties}
                      aria-pressed={picked.has(key)}
                      onClick={() => {
                        track("pass_step", { step: "service_toggled", service: s.name, page: location.pathname });
                        setPicked(function toggle(prev) {
                          const next = new Set(prev);
                          next.delete("x");
                          if (next.has(key)) next.delete(key);
                          else next.add(key);
                          return next;
                        });
                      }}
                    >
                      <i />
                      {s.name}
                    </button>
                  );
                })}
                <button
                  type="button"
                  aria-pressed={picked.has("x")}
                  onClick={() => setPicked(new Set(["x"]))}
                >
                  Not sure yet
                </button>
              </div>
            </div>

            <div className="stepq qok" id="q3">
              <span className="n">
                <i>3</i>Step 3 of 3
              </span>
              <h3>Pick a day to talk.</h3>

              <div className="cal">
                <div className="calh">
                  <button
                    type="button"
                    aria-label="Previous month"
                    disabled={y === today.getFullYear() && m <= today.getMonth()}
                    onClick={() => setView(new Date(y, m - 1, 1))}
                  >
                    ‹
                  </button>
                  <b aria-live="polite">
                    {view.toLocaleDateString("en-CA", { month: "long", year: "numeric" })}
                  </b>
                  <button
                    type="button"
                    aria-label="Next month"
                    disabled={new Date(y, m + 1, 1) > maxDay}
                    onClick={() => setView(new Date(y, m + 1, 1))}
                  >
                    ›
                  </button>
                </div>

                <div className="calw" aria-hidden="true">
                  <span>Sun</span>
                  <span>Mon</span>
                  <span>Tue</span>
                  <span>Wed</span>
                  <span>Thu</span>
                  <span>Fri</span>
                  <span>Sat</span>
                </div>

                <div className="calg" ref={gridRef} onKeyDown={onGridKey}>
                  {Array.from({ length: lead }, (_, i) => (
                    <i key={`lead${i}`} />
                  ))}
                  {Array.from({ length: count }, function cell(_, i) {
                    const d = new Date(y, m, i + 1);
                    const off = offFor(d);
                    return (
                      <button
                        type="button"
                        key={i}
                        data-d={i + 1}
                        disabled={off}
                        aria-pressed={same(d, day)}
                        className={same(d, today) ? "today" : undefined}
                        aria-label={`${d.toLocaleDateString("en-CA", {
                          weekday: "long",
                          month: "long",
                          day: "numeric",
                        })}${off ? ", unavailable" : ""}`}
                        onClick={() => pick(d)}
                      >
                        {i + 1}
                      </button>
                    );
                  })}
                </div>

                <div className="calsel">
                  <span aria-live="polite">
                    {fmt(basis, { weekday: "long", month: "long", day: "numeric" })}
                    {diff === 1 ? " · tomorrow" : ""}
                  </span>
                  <span className="mono">Weekdays · 30 min</span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className={`ticket${name ? " ready" : ""}${booked ? " booked" : ""}`}>
              <div className="tk">
                <div className="top">
                  <b>
                    <i />
                    Averr
                  </b>
                  <span>Project start pass</span>
                </div>
                <div className={`tname${name ? "" : " empty"}`}>{name || "Your business"}</div>
                <div className="tsvcs">
                  {[...picked].sort().map(function tag(key) {
                    if (key === "x")
                      return (
                        <span key="x" style={{ "--c": "var(--line)" } as CSSProperties}>
                          Not sure yet
                        </span>
                      );
                    const s = SERVICES[Number(key)];
                    return (
                      <span key={key} style={{ "--c": s.color } as CSSProperties}>
                        <i />
                        {s.name}
                      </span>
                    );
                  })}
                </div>
                <div className="trow">
                  <b>Discovery call</b>
                  <span>
                    {booked && label
                      ? `${label.date} · ${label.time} · 30 min`
                      : `${wd}, ${md} · 30 min`}
                  </span>
                </div>
                <div className="trow">
                  <b>Proposal by</b>
                  <span>{fmt(proposal, { weekday: "short", month: "short", day: "numeric" })}</span>
                </div>
                <div className="trow big">
                  <b>Kickoff by</b>
                  <span>
                    {fmt(kickoff, { weekday: "short" })} {kickoff.getDate()}
                  </span>
                </div>
              </div>
              <div className="perf" />
              <div className="tstub">
                <span className="barcode" />
                <span className="tcode">
                  {`AV-${String(basis.getMonth() + 1).padStart(2, "0")}${String(
                    basis.getDate()
                  ).padStart(2, "0")}${name ? `-${name[0].toUpperCase()}` : ""}`}
                </span>
                <span className="tstamp">{booked ? "Confirmed" : "Ready to book"}</span>
              </div>
            </div>

            <div className="passcta">
              <button
                className="book"
                type="button"
                onMouseEnter={warm}
                onFocus={warm}
                onPointerDown={warm}
                onClick={book}
                aria-busy={busy}
              >
                Book {name ? `${name}’s` : "your"} call on {wd}, {md} →
              </button>
              <p aria-live="polite">
                {booked
                  ? `${bookedSpoken(booked)} Your proposal arrives by ${fmt(proposal, {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                    })}. You're in kickoff by ${fmt(kickoff, {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                    })}, with preview links from day one.`
                  : `Your proposal arrives by ${fmt(proposal, {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                    })}. You're in kickoff by ${fmt(kickoff, {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                    })}, with preview links from day one.`}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
