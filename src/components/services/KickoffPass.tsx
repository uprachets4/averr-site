import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { motion, useInView, useReducedMotion, useSpring } from "motion/react";
import { duration, ease, spring } from "../../lib/motion";
import MagneticCTA from "../MagneticCTA";
import AverrMark from "../AverrMark";
import {
  addDays,
  civil,
  dayOfMonth,
  fromISO,
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
import {
  bookedLabel,
  bookedSpoken,
  embedRequested,
  onBooked,
  openModal,
  torontoISODate,
  warmEmbed,
} from "./passBooking";

/**
 * "Your project start pass."
 *
 * Two questions that build one artefact. 17f got the pass right and the
 * conversation wrong: the name question read as a caption rather than an
 * action, and the date wheel was drag-only with no affordance. 17g makes
 * both unmissable — a real field with a live typing hint, and a date
 * control with arrows, clickable neighbours and a month popover.
 *
 * PRIVACY. The business name is component state: no storage, no
 * analytics, no fetch. It reaches Cal.com only as the `notes` prefill
 * the reader is on their way to use. From a completed booking the ONLY
 * field read is the start time — never an attendee's name or email.
 *
 * Every date comes from lib/businessDays.ts, which is unit tested:
 * weekends are bookable, and the three-business-day proposal count
 * skips weekends and Ontario statutory holidays.
 */

const RANGE_DAYS = 60;
const EXAMPLES = ["Northgate Renovations", "Maple & Pine Café", "Harbour Dental"];
const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export default function KickoffPass() {
  const reduce = useReducedMotion();
  const today = useMemo(() => todayInToronto(), []);
  const [offset, setOffset] = useState(0);
  const [name, setName] = useState("");
  const [booked, setBooked] = useState<string | null>(null);

  const sectionRef = useRef<HTMLElement | null>(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.2 });

  const selected = useMemo(() => addDays(today, offset), [today, offset]);
  const trimmed = name.trim();
  const named = trimmed.length >= 2;

  /** Once booked, every date on the pass recomputes from the BOOKED day. */
  const bookedCivil = useMemo(() => {
    if (!booked) return null;
    const iso = torontoISODate(booked);
    return iso ? fromISO(iso) : null;
  }, [booked]);
  const basis = bookedCivil ?? selected;
  const plan = useMemo(() => scheduleFrom(basis), [basis]);

  const sentence = booked
    ? `${bookedSpoken(booked)} Your proposal arrives by ${longLabel(plan.proposal)}. ` +
      `You're in kickoff by ${longLabel(plan.kickoff)}, with preview URLs from day one.`
    : `Call us ${longLabel(plan.call)}. Your proposal arrives by ${longLabel(plan.proposal)}. ` +
      `You're in kickoff by ${longLabel(plan.kickoff)}, with preview URLs from day one.`;

  /* ── booking ───────────────────────────────────────────────────── */

  const [busy, setBusy] = useState(false);
  const warm = useCallback(function intent() {
    if (!embedRequested()) warmEmbed().catch(() => undefined);
  }, []);

  /**
   * A harness for the confirmed state, so the flip can be verified
   * without putting a real booking on the owner's calendar. It only
   * sets component state. Reachable in dev via an event, and on a
   * deployment only when the query param is typed by hand.
   */
  useEffect(function harness() {
    const q = new URLSearchParams(window.location.search).get("simulateBooking");
    if (q && !Number.isNaN(new Date(q).getTime())) setBooked(q);
    if (!import.meta.env.DEV) return;
    function on(e: Event) {
      const iso = (e as CustomEvent<string>).detail;
      if (typeof iso === "string") setBooked(iso);
    }
    window.addEventListener("averr:booking-simulated", on);
    return function off() {
      window.removeEventListener("averr:booking-simulated", on);
    };
  }, []);

  async function book() {
    if (busy) return;
    setBusy(true);
    try {
      await openModal({
        date: toISO(selected),
        month: toISO(selected).slice(0, 7),
        ...(trimmed ? { notes: trimmed } : {}),
      });
      await onBooked((iso) => setBooked(iso));
    } catch {
      // the embed failed to load: fall back to the page that hosts it
      window.location.href = fallbackHref(selected, trimmed);
    } finally {
      setBusy(false);
    }
  }

  /* ── the animated placeholder ──────────────────────────────────── */

  const [hint, setHint] = useState("");
  const [animating, setAnimating] = useState(true);
  useEffect(
    function runHint() {
      if (!inView || reduce || !animating) return;
      let i = 0;
      let c = 0;
      let deleting = false;
      let timer = 0;
      function tick() {
        const word = EXAMPLES[i % EXAMPLES.length];
        if (!deleting) {
          c++;
          setHint(word.slice(0, c));
          if (c === word.length) {
            deleting = true;
            timer = window.setTimeout(tick, 1400);
            return;
          }
        } else {
          c--;
          setHint(word.slice(0, c));
          if (c === 0) {
            deleting = false;
            i++;
          }
        }
        timer = window.setTimeout(tick, deleting ? 34 : 60);
      }
      timer = window.setTimeout(tick, 420);
      return function stop() {
        window.clearTimeout(timer);
      };
    },
    [inView, reduce, animating]
  );

  /* ── the date control ──────────────────────────────────────────── */

  const move = useCallback(
    (d: number) => setOffset((o) => Math.max(0, Math.min(RANGE_DAYS, o + d))),
    []
  );
  const [popover, setPopover] = useState(false);
  const pickBtnRef = useRef<HTMLButtonElement | null>(null);

  function onDateKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (booked) return;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") move(1);
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp") move(-1);
    else if (e.key === "Home") setOffset(0);
    else if (e.key === "End") setOffset(RANGE_DAYS);
    else return;
    e.preventDefault();
  }

  const swipe = useRef<number | null>(null);
  function onTouchStart(e: React.TouchEvent) {
    swipe.current = e.touches[0].clientX;
  }
  function onTouchEnd(e: React.TouchEvent) {
    if (swipe.current === null || booked) return;
    const dx = e.changedTouches[0].clientX - swipe.current;
    swipe.current = null;
    if (Math.abs(dx) > 36) move(dx < 0 ? 1 : -1);
  }

  /* ── pass motion ───────────────────────────────────────────────── */

  const tiltX = useSpring(0, reduce ? { duration: 0 } : spring.soft);
  const tiltY = useSpring(0, reduce ? { duration: 0 } : spring.soft);
  const [fine, setFine] = useState(false);
  useEffect(function watchPointer() {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine) and (min-width: 1024px)");
    setFine(mq.matches);
    const on = (e: MediaQueryListEvent) => setFine(e.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  function onCardMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!fine || reduce || booked) return;
    const r = e.currentTarget.getBoundingClientRect();
    tiltY.set(((e.clientX - r.left) / r.width - 0.5) * 8);
    tiltX.set(-((e.clientY - r.top) / r.height - 0.5) * 8);
  }
  function onCardLeave() {
    tiltY.set(0);
    tiltX.set(0);
  }

  const changeKey = `${toISO(basis)}|${trimmed}|${booked ?? ""}`;
  const nameId = useId();

  return (
    <section
      ref={sectionRef}
      style={{ backgroundColor: "var(--color-bg-warm)", padding: "140px 0", position: "relative" }}
    >
      <div style={{ width: "100%", maxWidth: "var(--container-wide)", margin: "0 auto" }}>
        <div className="type-eyebrow" style={{ color: "var(--color-muted)", marginBottom: 24 }}>
          //_05 · try it
        </div>

        <div className="kp2-stage">
          {/* ══ left: the conversation ══════════════════════════ */}
          <div className="kp2-talk">
            <div className={named ? "kp2-step kp2-step--done" : "kp2-step"}>
              <div className="kp2-step__head">
                <span className="type-eyebrow kp2-step__n">Step 1 of 2</span>
                {named ? (
                  <motion.span
                    aria-hidden
                    className="kp2-tick"
                    initial={reduce ? false : { scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={reduce ? { duration: 0 } : spring.snappy}
                  >
                    ✓
                  </motion.span>
                ) : null}
              </div>
              <label className="type-h3 kp2-step__q" htmlFor={nameId}>
                What's your business called?
              </label>

              <div className="kp2-field">
                <input
                  id={nameId}
                  className="type-h2 kp2-field__input"
                  type="text"
                  value={name}
                  maxLength={40}
                  autoComplete="organization"
                  placeholder={reduce || !animating ? "e.g. Northgate Renovations" : " "}
                  onFocus={() => setAnimating(false)}
                  onChange={(e) => setName(e.target.value)}
                />
                {!reduce && animating && !name ? (
                  <span aria-hidden className="type-h2 kp2-field__hint">
                    {hint}
                    <span className="kp2-caret" />
                  </span>
                ) : null}
              </div>
            </div>

            <div className={named ? "kp2-step kp2-step--active" : "kp2-step kp2-step--waiting"}>
              <div className="kp2-step__head">
                <span className="type-eyebrow kp2-step__n">Step 2 of 2</span>
              </div>
              <div className="type-h3 kp2-step__q" id="kp2-dateq">
                Pick a day to talk.
              </div>

              <div
                className="kp2-date"
                role="group"
                aria-labelledby="kp2-dateq"
                tabIndex={booked ? -1 : 0}
                onKeyDown={onDateKeyDown}
                onTouchStart={onTouchStart}
                onTouchEnd={onTouchEnd}
                aria-disabled={booked ? true : undefined}
              >
                <button
                  type="button"
                  className="kp2-arrow"
                  aria-label="Previous day"
                  disabled={!!booked || offset === 0}
                  onClick={() => move(-1)}
                >
                  ‹
                </button>

                <div className="kp2-date__reel">
                  {[-1, 0, 1].map((d) => {
                    const o = offset + d;
                    if (o < 0 || o > RANGE_DAYS) return <span key={d} className="kp2-date__slot" />;
                    const day = addDays(today, o);
                    return d === 0 ? (
                      <span key={d} className="kp2-date__slot kp2-date__slot--main">
                        <span className="type-eyebrow kp2-date__wd">{weekdayLong(day)}</span>
                        <span className="type-display-l kp2-date__n">
                          <span className="sr-only">{longLabel(day)}</span>
                          <span aria-hidden>
                            {shortLabel(day).split(" ")[0]}{" "}
                            <Odometer value={dayOfMonth(day)} reduce={!!reduce} />
                          </span>
                        </span>
                        <span className="type-eyebrow kp2-date__tag">{dayTag(day, today)}</span>
                      </span>
                    ) : (
                      <button
                        key={d}
                        type="button"
                        className="kp2-date__slot kp2-date__slot--near"
                        disabled={!!booked}
                        onClick={() => move(d)}
                        aria-label={`Choose ${longLabel(day)}`}
                      >
                        <span className="type-eyebrow">{weekdayShort(day)}</span>
                        <span className="type-h1 kp2-date__near-n">{dayOfMonth(day)}</span>
                      </button>
                    );
                  })}
                </div>

                <button
                  type="button"
                  className="kp2-arrow"
                  aria-label="Next day"
                  disabled={!!booked || offset === RANGE_DAYS}
                  onClick={() => move(1)}
                >
                  ›
                </button>
              </div>

              <div className="kp2-date__foot">
                <button
                  ref={pickBtnRef}
                  type="button"
                  className="type-small kp2-pick"
                  disabled={!!booked}
                  aria-expanded={popover}
                  onClick={() => setPopover((v) => !v)}
                >
                  Pick another date
                </button>
                <span className="type-small" style={{ color: "var(--color-muted)" }}>
                  {booked
                    ? `Booked: ${bookedLabel(booked)?.date ?? ""}`
                    : "Any day works, weekends too."}
                </span>
              </div>

              {popover ? (
                <MonthPopover
                  today={today}
                  selected={selected}
                  reduce={!!reduce}
                  onPick={(d) => {
                    const diff = Math.round((d.getTime() - today.getTime()) / 86400000);
                    setOffset(Math.max(0, Math.min(RANGE_DAYS, diff)));
                    setPopover(false);
                    pickBtnRef.current?.focus();
                  }}
                  onClose={() => {
                    setPopover(false);
                    pickBtnRef.current?.focus();
                  }}
                />
              ) : null}
            </div>

            <div aria-live="polite" className="sr-only">
              {sentence}
            </div>
          </div>

          {/* ══ right: the pass ════════════════════════════════ */}
          <div className="kp2-passcol">
            <div className="kp2-flip" style={{ perspective: 1400 }}>
              <motion.div
                className="kp2-flip__inner"
                animate={reduce ? { rotateY: 0 } : { rotateY: booked ? 180 : 0 }}
                transition={reduce ? { duration: 0 } : spring.soft}
              >
                {/* front */}
                <motion.div
                  className="kp2-pass kp2-face"
                  onMouseMove={onCardMove}
                  onMouseLeave={onCardLeave}
                  initial={{ opacity: 0, y: reduce ? 0 : 40, rotate: reduce ? 0 : -2.5 }}
                  whileInView={{ opacity: 1, y: 0, rotate: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: reduce ? 0 : duration.hero, ease: ease.outQuart }}
                  style={{
                    rotateX: tiltX,
                    rotateY: tiltY,
                    transformPerspective: 1200,
                    pointerEvents: booked ? "none" : undefined,
                    visibility: reduce && booked ? "hidden" : undefined,
                  }}
                >
                  <motion.div
                    key={`settle-${changeKey}`}
                    initial={reduce ? false : { rotate: -2.4 }}
                    animate={{ rotate: 0 }}
                    transition={reduce ? { duration: 0 } : spring.snappy}
                    style={{ position: "relative" }}
                  >
                    <PassHead />
                    <PassName name={trimmed} />
                    <Row label="Discovery call" date={plan.call} meta="30 min" reduce={!!reduce} />
                    <Row label="Proposal by" date={plan.proposal} reduce={!!reduce} />
                    <KickoffRow date={plan.kickoff} reduce={!!reduce} />
                    <div aria-hidden className="kp2-perf" />
                    <div className="kp2-stub">
                      <Barcode seed={`${trimmed}|${toISO(basis)}`} />
                      <span className="kp2-stub__no type-eyebrow">{passNumber(trimmed, basis)}</span>
                      {named ? (
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

                {/* back */}
                <div
                  className="kp2-pass kp2-face kp2-face--back"
                  aria-hidden={!booked}
                  style={
                    reduce
                      ? { transform: "none", visibility: booked ? "visible" : "hidden" }
                      : undefined
                  }
                >
                  <PassHead confirmed />
                  <PassName name={trimmed} />
                  <div className="kp2-booked">
                    <span className="type-eyebrow" style={{ color: "var(--color-muted)" }}>
                      Discovery call
                    </span>
                    <span className="type-h2 kp2-booked__when">
                      {booked
                        ? `${bookedLabel(booked)?.date} · ${bookedLabel(booked)?.time} · 30 MIN`
                        : ""}
                    </span>
                  </div>
                  <Row label="Proposal by" date={plan.proposal} reduce={!!reduce} />
                  <KickoffRow date={plan.kickoff} reduce={!!reduce} />
                  <p className="type-small kp2-inbox">Check your inbox for the calendar invite.</p>
                  <div aria-hidden className="kp2-perf" />
                  <div className="kp2-stub">
                    <Barcode seed={`${trimmed}|${booked ?? ""}`} />
                    <span className="kp2-stub__no type-eyebrow">{passNumber(trimmed, basis)}</span>
                    <span className="kp2-stamp kp2-stamp--ok type-eyebrow">Confirmed</span>
                  </div>
                </div>
              </motion.div>
            </div>

            <div style={{ marginTop: 32 }}>
              {booked ? (
                <button type="button" className="type-small kp2-again" onClick={() => setBooked(null)}>
                  Book another call
                </button>
              ) : (
                <span onMouseEnter={warm} onFocus={warm} style={{ display: "inline-flex" }}>
                  <MagneticCTA onClick={book} variant="primary" ariaLabel={ctaLabel(trimmed, plan.call)}>
                    {busy ? "Opening…" : ctaLabel(trimmed, plan.call)}
                  </MagneticCTA>
                </span>
              )}
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
        .kp2-stage { display: grid; grid-template-columns: minmax(0,1fr) 560px; gap: 72px; align-items: start; }

        .kp2-step { position: relative; transition: opacity ${duration.slow * 1000}ms ease; }
        .kp2-step + .kp2-step { margin-top: 56px; }
        .kp2-step--done { opacity: 0.62; }
        .kp2-step--waiting { opacity: 0.74; }
        .kp2-step--active { opacity: 1; }
        .kp2-step__head { display: flex; align-items: center; gap: 12px; }
        .kp2-step__n { color: var(--color-muted); }
        .kp2-tick {
          display: inline-flex; align-items: center; justify-content: center;
          width: 20px; height: 20px; border-radius: 50%;
          background: var(--color-ink); color: var(--color-bg); font-size: 11px; line-height: 1;
        }
        .kp2-step__q { display: block; color: var(--color-ink); margin: 10px 0 18px; }

        .kp2-field { position: relative; }
        .kp2-field__input {
          display: block; width: 100%; min-height: 44px;
          padding: 16px 20px;
          background: var(--surface-elevated);
          /* NOT --hair-hi. Composited over the fill that is 1.47:1, which
             fails WCAG 1.4.11's 3:1 for a control boundary. At 0.55 it is
             4.02:1 against the fill and 3.25:1 against the warm ground
             outside it, so the field reads as a field from either side. */
          border: 1px solid rgba(20,20,18,0.55);
          border-radius: 12px;
          color: var(--color-ink);
          font-family: var(--font-display);
          outline: none;
          transition: border-color ${duration.base * 1000}ms ease, box-shadow ${duration.base * 1000}ms ease;
        }
        .kp2-field__input::placeholder { color: var(--color-muted-2); }
        .kp2-field__input:hover { border-color: var(--color-ink); }
        .kp2-field__input:focus-visible {
          border-color: var(--color-ink);
          box-shadow: 0 0 0 2px var(--color-bg-warm), 0 0 0 4px var(--color-ink);
        }
        .kp2-field__hint {
          position: absolute; left: 21px; top: 50%; transform: translateY(-50%);
          color: var(--color-muted-2); pointer-events: none; white-space: nowrap;
          max-width: calc(100% - 42px); overflow: hidden;
        }
        .kp2-caret {
          display: inline-block; width: 2px; height: 0.86em; margin-left: 3px;
          background: var(--color-muted-2); vertical-align: -0.08em;
          animation: kp2blink 1s steps(1) infinite;
        }
        @keyframes kp2blink { 0%,50% { opacity: 1 } 50.01%,100% { opacity: 0 } }

        .kp2-date { display: flex; align-items: center; gap: 10px; margin-top: 4px; border-radius: 14px; }
        .kp2-date:focus-visible { outline: 2px solid var(--color-ink); outline-offset: 8px; }
        .kp2-arrow {
          flex: 0 0 auto; width: 52px; height: 52px; border-radius: 50%;
          background: var(--surface-elevated); border: 1px solid rgba(20,20,18,0.55);
          color: var(--color-ink); font-size: 26px; line-height: 1; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: border-color ${duration.base * 1000}ms ease;
        }
        .kp2-arrow:hover:not(:disabled) { border-color: var(--color-ink); }
        .kp2-arrow:disabled { opacity: 0.32; cursor: default; }
        .kp2-date__reel { flex: 1; min-width: 0; display: flex; align-items: center; justify-content: space-between; gap: 12px; }
        .kp2-date__slot { flex: 0 0 auto; display: block; text-align: center; }
        .kp2-date__slot--near {
          background: none; border: none; cursor: pointer; opacity: 0.42;
          color: var(--color-muted); font-family: inherit; padding: 8px;
          min-width: 56px; min-height: 44px;
          transition: opacity ${duration.base * 1000}ms ease;
        }
        .kp2-date__slot--near:hover:not(:disabled) { opacity: 0.8; }
        .kp2-date__near-n { display: block; line-height: 1; }
        .kp2-date__slot--main { flex: 1; min-width: 0; }
        .kp2-date__wd { display: block; color: var(--color-muted); }
        .kp2-date__n { display: block; line-height: 1; color: var(--color-ink); white-space: nowrap; }
        .kp2-date__tag { display: block; margin-top: 6px; color: var(--color-muted); }
        .kp2-date__foot { display: flex; align-items: center; gap: 16px; margin-top: 18px; flex-wrap: wrap; position: relative; }
        .kp2-pick {
          background: none; border: none; border-bottom: 1px solid rgba(20,20,18,0.55);
          color: var(--color-ink); cursor: pointer; padding: 6px 2px; min-height: 44px; font-family: inherit;
        }
        .kp2-pick:hover:not(:disabled) { border-bottom-color: var(--color-ink); }
        .kp2-pick:disabled { opacity: 0.4; cursor: default; }

        .kp2-flip { position: relative; }
        .kp2-flip__inner { position: relative; transform-style: preserve-3d; }
        .kp2-face { backface-visibility: hidden; -webkit-backface-visibility: hidden; }
        .kp2-face--back { position: absolute; inset: 0; transform: rotateY(180deg); }

        .kp2-pass {
          position: relative; background: var(--surface-elevated); border-radius: 18px;
          padding: 30px 34px 0; overflow: hidden;
          box-shadow: 0 2px 4px rgba(62,48,28,0.06), 0 10px 24px rgba(62,48,28,0.10), 0 32px 64px rgba(62,48,28,0.14);
        }
        .kp2-pass__head { display: flex; align-items: center; justify-content: space-between; gap: 16px; padding-bottom: 22px; border-bottom: 1px solid var(--hair); }
        .kp2-pass__name { margin: 22px 0 26px; color: var(--color-ink); overflow-wrap: anywhere; }
        .kp2-pass__slot {
          display: inline-block; padding: 4px 14px; border-radius: 10px;
          border: 2px dashed var(--color-muted-2); color: var(--color-muted-2);
          animation: kp2pulse 2s ease-in-out infinite;
        }
        @keyframes kp2pulse { 0%,100% { opacity: 0.4 } 50% { opacity: 0.8 } }
        @media (prefers-reduced-motion: reduce) {
          .kp2-pass__slot { animation: none; opacity: 0.7; }
          .kp2-caret { animation: none; }
        }
        .kp2-booked { padding: 6px 0 14px; }
        .kp2-booked__when { display: block; color: var(--color-ink); margin-top: 6px; }
        .kp2-inbox { color: var(--color-muted); margin: 10px 0 0; }
        .kp2-perf { height: 1px; margin: 26px -34px 0; background-image: radial-gradient(circle at 5px 50%, rgba(20,20,18,0.26) 0 1.6px, transparent 1.7px); background-size: 10px 100%; }
        .kp2-stub { position: relative; display: flex; align-items: center; gap: 18px; margin: 0 -34px; padding: 20px 34px 24px; background: rgba(20,20,18,0.03); }
        .kp2-stub__no { color: var(--color-muted); letter-spacing: 0.18em; }
        .kp2-stamp { margin-left: auto; border: 2px solid #B4452F; color: #B4452F; border-radius: 6px; padding: 6px 12px; letter-spacing: 0.16em; transform: rotate(-8deg); }
        .kp2-stamp--ok { border-color: #1F5D4C; color: #1F5D4C; }
        .kp2-sheen { position: absolute; inset: -40% -10%; background: linear-gradient(100deg, transparent 38%, rgba(255,255,255,0.72) 50%, transparent 62%); pointer-events: none; }
        .kp2-again { background: none; border: none; border-bottom: 1px solid var(--hair-hi); color: var(--color-ink); cursor: pointer; padding: 8px 2px; min-height: 44px; font-family: inherit; }

        .kp2-row { display: flex; align-items: baseline; gap: 14px; padding: 10px 0; }
        .kp2-row__label { flex: 0 0 132px; }
        .kp2-row__val { flex: 1; }

        @media (max-width: 1023px) {
          .kp2-stage { grid-template-columns: minmax(0,1fr); gap: 48px; }
          .kp2-pass { padding: 24px 22px 0; border-radius: 14px; }
          .kp2-perf { margin: 22px -22px 0; }
          .kp2-stub { margin: 0 -22px; padding: 18px 22px 20px; flex-wrap: wrap; }
          .kp2-row { display: grid; grid-template-columns: 1fr auto; gap: 2px 12px; padding: 12px 0; }
          .kp2-row__label { grid-column: 1 / -1; flex: none; }
          .kp2-row__val { grid-column: 1; flex: none; }
          .kp2-row__meta { grid-column: 2; grid-row: 2; align-self: baseline; }
          .kp2-arrow { width: 46px; height: 46px; font-size: 22px; }
          .kp2-date__slot--near { min-width: 44px; padding: 6px; }
        }
      `}</style>
    </section>
  );
}

/* ── pass pieces ──────────────────────────────────────────────────── */

function PassHead({ confirmed }: { confirmed?: boolean }) {
  return (
    <div className="kp2-pass__head">
      <AverrMark variant="nav" tone="light" />
      <span className="type-eyebrow" style={{ color: "var(--color-muted)" }}>
        {confirmed ? "Project start pass · confirmed" : "Project start pass"}
      </span>
    </div>
  );
}

function PassName({ name }: { name: string }) {
  return (
    <div className="kp2-pass__name type-h1">
      {name ? name : <span className="kp2-pass__slot">Your business</span>}
    </div>
  );
}

function dayTag(d: CivilDate, today: CivilDate) {
  if (sameDay(d, today)) return "Today";
  const h = holidayName(d);
  if (h) return h;
  if (isWeekend(d)) return "Weekend call";
  return shortLabel(d);
}

function ctaLabel(name: string, call: CivilDate) {
  const when = `${weekdayShort(call)}, ${shortLabel(call)}`;
  return name ? `Book ${name}'s call on ${when}` : `Book your call on ${when}`;
}

function fallbackHref(d: CivilDate, business: string) {
  const q = new URLSearchParams({ date: toISO(d) });
  if (business) q.set("notes", business);
  return `/contact?${q.toString()}`;
}

/* ── month popover ────────────────────────────────────────────────── */

function MonthPopover({
  today,
  selected,
  reduce,
  onPick,
  onClose,
}: {
  today: CivilDate;
  selected: CivilDate;
  reduce: boolean;
  onPick: (d: CivilDate) => void;
  onClose: () => void;
}) {
  const [monthOffset, setMonthOffset] = useState(0);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(
    function closeOnEscapeOrOutside() {
      function onKey(e: KeyboardEvent) {
        if (e.key === "Escape") {
          e.stopPropagation();
          onClose();
        }
      }
      function onDown(e: MouseEvent) {
        if (ref.current && !ref.current.contains(e.target as Node)) onClose();
      }
      document.addEventListener("keydown", onKey);
      document.addEventListener("mousedown", onDown);
      ref.current?.querySelector<HTMLElement>(".kp2-pop__day:not(:disabled)")?.focus();
      return function off() {
        document.removeEventListener("keydown", onKey);
        document.removeEventListener("mousedown", onDown);
      };
    },
    [onClose]
  );

  const base = useMemo(() => {
    const m = today.getUTCMonth() + monthOffset;
    return civil(today.getUTCFullYear() + Math.floor(m / 12), (((m % 12) + 12) % 12) + 1, 1);
  }, [today, monthOffset]);

  const grid = useMemo(() => {
    const lead = base.getUTCDay();
    const daysIn = new Date(Date.UTC(base.getUTCFullYear(), base.getUTCMonth() + 1, 0)).getUTCDate();
    const cells: Array<CivilDate | null> = Array.from({ length: lead }, () => null);
    for (let i = 1; i <= daysIn; i++) {
      cells.push(civil(base.getUTCFullYear(), base.getUTCMonth() + 1, i));
    }
    return cells;
  }, [base]);

  const last = addDays(today, RANGE_DAYS);

  return (
    <motion.div
      ref={ref}
      role="dialog"
      aria-label="Pick another date"
      className="kp2-pop"
      initial={reduce ? false : { opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={reduce ? { duration: 0 } : { duration: duration.base, ease: ease.outQuart }}
    >
      <div className="kp2-pop__head">
        <button
          type="button"
          className="kp2-pop__nav"
          aria-label="Previous month"
          disabled={monthOffset === 0}
          onClick={() => setMonthOffset((m) => Math.max(0, m - 1))}
        >
          ‹
        </button>
        <span className="type-small" style={{ fontWeight: 600 }}>
          {MONTH_NAMES[base.getUTCMonth()]} {base.getUTCFullYear()}
        </span>
        <button
          type="button"
          className="kp2-pop__nav"
          aria-label="Next month"
          disabled={monthOffset >= 1}
          onClick={() => setMonthOffset((m) => Math.min(1, m + 1))}
        >
          ›
        </button>
      </div>
      <div className="kp2-pop__wd" aria-hidden>
        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
          <span key={i} className="type-eyebrow">{d}</span>
        ))}
      </div>
      <div className="kp2-pop__grid">
        {grid.map((d, i) =>
          d === null ? (
            <span key={`x${i}`} />
          ) : (
            <button
              key={toISO(d)}
              type="button"
              disabled={d.getTime() < today.getTime() || d.getTime() > last.getTime()}
              aria-label={longLabel(d)}
              aria-current={sameDay(d, selected) ? "date" : undefined}
              className={
                sameDay(d, selected)
                  ? "kp2-pop__day kp2-pop__day--sel"
                  : sameDay(d, today)
                    ? "kp2-pop__day kp2-pop__day--today"
                    : "kp2-pop__day"
              }
              onClick={() => onPick(d)}
            >
              {dayOfMonth(d)}
            </button>
          )
        )}
      </div>
      <style>{`
        .kp2-pop {
          position: absolute; top: 100%; left: 0; z-index: 20; margin-top: 10px;
          background: var(--surface-elevated); border: 1px solid var(--hair-hi);
          border-radius: 14px; padding: 14px; width: 288px;
          box-shadow: 0 18px 40px rgba(62,48,28,0.18);
        }
        .kp2-pop__head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; }
        .kp2-pop__nav {
          width: 36px; height: 36px; border-radius: 50%; border: 1px solid var(--hair-hi);
          background: none; color: var(--color-ink); cursor: pointer; font-size: 18px; line-height: 1;
        }
        .kp2-pop__nav:disabled { opacity: 0.3; cursor: default; }
        .kp2-pop__wd, .kp2-pop__grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 2px; }
        .kp2-pop__wd span { text-align: center; color: var(--color-muted-2); padding-bottom: 4px; }
        .kp2-pop__day {
          aspect-ratio: 1; border: none; background: none; border-radius: 8px;
          color: var(--color-ink); cursor: pointer; font-family: inherit; font-size: 13px;
        }
        .kp2-pop__day:hover:not(:disabled) { background: rgba(20,20,18,0.07); }
        .kp2-pop__day:disabled { opacity: 0.26; cursor: default; }
        .kp2-pop__day--today { box-shadow: inset 0 0 0 1px var(--hair-hi); }
        .kp2-pop__day--sel { background: var(--color-ink); color: var(--color-bg); }
      `}</style>
    </motion.div>
  );
}

/* ── rows, odometer, stub ─────────────────────────────────────────── */

function Row({ label, date, meta, reduce }: { label: string; date: CivilDate; meta?: string; reduce: boolean }) {
  return (
    <div className="kp2-row">
      <span className="type-eyebrow kp2-row__label" style={{ color: "var(--color-muted)" }}>{label}</span>
      <span className="type-body-lg kp2-row__val" style={{ color: "var(--color-ink)", minWidth: 0 }}>
        <span className="sr-only">{longLabel(date)}</span>
        <span aria-hidden>
          {weekdayLong(date)}, {shortLabel(date).split(" ")[0]}{" "}
          <Odometer value={dayOfMonth(date)} reduce={reduce} />
        </span>
      </span>
      {meta ? (
        <span className="type-eyebrow kp2-row__meta" style={{ color: "var(--color-muted)" }}>{meta}</span>
      ) : null}
    </div>
  );
}

/** Measured, so a display-size italic can never clip the card (17e). */
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
        {/* type-accent nests INSIDE the size class (§5.33) */}
        <span ref={lineRef} aria-hidden className="type-accent" style={{ display: "inline-block", whiteSpace: "nowrap", color: "var(--color-ink)" }}>
          {weekdayShort(date)} <Odometer value={dayOfMonth(date)} reduce={reduce} />
        </span>
      </span>
    </div>
  );
}

/** Window taller than 1em: Cormorant's italic figures overflow it (§5.36). */
const LEAD = 1.35;

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
        position: "relative", display: "inline-block", overflow: "hidden",
        height: `${LEAD}em`, lineHeight: 1, verticalAlign: "baseline",
      }}
    >
      <span style={{ visibility: "hidden" }}>{d}</span>
      <motion.span
        style={{ display: "block", position: "absolute", left: 0, top: `${-(LEAD - 1) / 2}em` }}
        animate={{ y: `${-d * 10}%` }}
        transition={reduce ? { duration: 0 } : { duration: duration.base, ease: ease.outQuart }}
      >
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
          <span key={n} style={{ display: "block", height: `${LEAD}em`, lineHeight: LEAD }}>{n}</span>
        ))}
      </motion.span>
    </span>
  );
}

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

function passNumber(name: string, date: CivilDate) {
  const initials =
    name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]?.toUpperCase() ?? "").join("") || "AV";
  const mm = String(date.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(date.getUTCDate()).padStart(2, "0");
  return `AV-${mm}${dd}-${initials}`;
}
