import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import { ease, easing } from "../../lib/motion";
import {
  CALENDAR_DAYS,
  KICKOFF_STAMP,
  KICKOFF_STAMP_DAY,
  STEPS,
  WEEKDAY_HEADERS,
  WEEKEND_DAYS,
  type ProcessStep,
} from "../../data/servicesProcess";

/**
 * "Three steps. Two weeks to kickoff, max." — as a filling calendar.
 *
 * Fourteen cells fill one at a time as the section scrolls past, and each
 * step card arrives as its own first day fills. The section is in normal
 * flow, never pinned: the reader scrolls the calendar rather than being
 * held at it.
 *
 * Because nothing here is inside a `position: sticky` ancestor, motion's
 * ViewTimeline acceleration of scroll-linked opacity does not apply, so
 * these can be ordinary scroll-linked styles without `useScrollStyle`.
 * Cell fill is carried on backgroundColor/color, which motion never
 * hardware-accelerates in the first place.
 *
 * The day mapping is data, not layout — see servicesProcess.ts for why
 * day 01 is a Monday and what each range is allowed to claim.
 */

/** Progress at which the last cell finishes; the remainder holds the stamp. */
const FILL_END = 0.85;
const STEP = FILL_END / CALENDAR_DAYS;

/** The scroll window in which a given 1-indexed day fills. */
function windowFor(day: number): [number, number] {
  const i = day - 1;
  return [i * STEP, i * STEP + STEP];
}

const CELL_EMPTY_BG = "rgba(20,20,18,0.06)";
const CELL_FULL_BG = "var(--color-dark)";
/** Weekends fill too — they are part of the fourteen — but land quieter,
 *  because the proposal counts business days and nothing is owed on them. */
const CELL_WEEKEND_BG = "rgba(20,20,18,0.34)";

export default function KickoffCalendar() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "end 0.6"],
  });

  return (
    <section
      ref={ref}
      style={{
        backgroundColor: "var(--color-bg-warm)",
        padding: "140px 0",
        position: "relative",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "var(--container-wide)",
          margin: "0 auto",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: reduce ? 0 : 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: reduce ? 0.01 : 0.5, ease: ease.outQuart }}
          className="type-eyebrow"
          style={{ color: "var(--color-muted)", marginBottom: 24 }}
        >
          //_05 · how to start
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: reduce ? 0 : 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{
            duration: reduce ? 0.01 : 0.7,
            ease: ease.outQuart,
            delay: 0.1,
          }}
          className="type-h2"
          style={{
            color: "var(--color-ink)",
            marginBottom: 72,
            maxWidth: 900,
          }}
        >
          Three steps. Two weeks{" "}
          {/* NBSP binds the last two words so "max." can't orphan at 1440 */}
          <span className="fade-h">to kickoff,&nbsp;max.</span>
        </motion.h2>

        <div className="kickoff-desktop">
          <CalendarGrid
            progress={scrollYProgress}
            reduce={reduce ?? false}
          />
        </div>

        <div className="kickoff-mobile">
          <CalendarList reduce={reduce ?? false} />
        </div>

        <Stamp progress={scrollYProgress} reduce={reduce ?? false} />
      </div>

      <style>{`
        .kickoff-mobile { display: none; }
        @media (max-width: 900px) {
          .kickoff-desktop { display: none; }
          .kickoff-mobile { display: block; }
        }
      `}</style>
    </section>
  );
}

/* ── desktop: two weeks, seven columns ──────────────────────────── */

function CalendarGrid({
  progress,
  reduce,
}: {
  progress: MotionValue<number>;
  reduce: boolean;
}) {
  const weekOne = Array.from({ length: 7 }, (_, i) => i + 1);
  const weekTwo = Array.from({ length: 7 }, (_, i) => i + 8);
  const [stepOne, stepTwo, stepThree] = STEPS;

  // Every band is placed on an explicit row. Auto-placement will happily
  // flow week two's first cells into the columns left empty beside the
  // week-one cards — which splits week two across two visual rows.
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(7, minmax(0, 1fr))",
        gridTemplateRows: "auto auto auto auto auto",
        gap: 12,
      }}
    >
      {WEEKDAY_HEADERS.map(function header(d, i) {
        return (
          <div
            key={d}
            className="type-eyebrow"
            style={{
              gridRow: 1,
              gridColumn: i + 1,
              fontFamily: "var(--font-mono)",
              color: "var(--color-muted)",
              paddingBottom: 4,
            }}
          >
            {d}
          </div>
        );
      })}

      {weekOne.map(function cell(day) {
        return (
          <DayCell
            key={day}
            day={day}
            progress={progress}
            reduce={reduce}
            row={2}
            column={day}
          />
        );
      })}

      {/* Week-one cards. Each spans exactly its own day range, so the width
          of a card is the length of the step: one column for the call,
          three for the proposal window. */}
      <StepCard
        step={stepOne}
        progress={progress}
        reduce={reduce}
        row={3}
        firstColumn={stepOne.dayStart}
      />
      <StepCard
        step={stepTwo}
        progress={progress}
        reduce={reduce}
        row={3}
        firstColumn={stepTwo.dayStart}
      />

      {weekTwo.map(function cell(day) {
        return (
          <DayCell
            key={day}
            day={day}
            progress={progress}
            reduce={reduce}
            row={4}
            column={day - 7}
          />
        );
      })}

      {/* Week two: day 08 is column 1, so the card starts there. */}
      <StepCard
        step={stepThree}
        progress={progress}
        reduce={reduce}
        row={5}
        firstColumn={stepThree.dayStart - 7}
      />
    </div>
  );
}

function DayCell({
  day,
  progress,
  reduce,
  row,
  column,
}: {
  day: number;
  progress: MotionValue<number>;
  reduce: boolean;
  row: number;
  column: number;
}) {
  const [from, to] = windowFor(day);
  const weekend = WEEKEND_DAYS.includes(day);
  const fullBg = weekend ? CELL_WEEKEND_BG : CELL_FULL_BG;
  const fullFg = weekend ? "rgba(237,231,218,0.72)" : "var(--color-parch)";

  // `easing.*` (cubicBezier callables), never the `ease.*` tuples —
  // useTransform CALLS what it is handed and a tuple throws at runtime.
  const backgroundColor = useTransform(progress, [from, to], [CELL_EMPTY_BG, fullBg], {
    ease: [easing.outQuart],
  });
  const color = useTransform(progress, [from, to], ["var(--color-muted)", fullFg], {
    ease: [easing.outQuart],
  });

  return (
    <motion.div
      style={{
        gridRow: row,
        gridColumn: column,
        aspectRatio: "1 / 1",
        borderRadius: 8,
        display: "flex",
        alignItems: "flex-start",
        padding: 12,
        backgroundColor: reduce ? fullBg : backgroundColor,
        color: reduce ? fullFg : color,
      }}
    >
      <span
        className="type-eyebrow"
        style={{ fontFamily: "var(--font-mono)", color: "inherit" }}
      >
        {String(day).padStart(2, "0")}
      </span>
    </motion.div>
  );
}

function StepCard({
  step,
  progress,
  reduce,
  row,
  firstColumn,
}: {
  step: ProcessStep;
  progress: MotionValue<number>;
  reduce: boolean;
  row: number;
  firstColumn: number;
}) {
  // The card arrives as its FIRST day fills, so the reader sees the day
  // light and the explanation land together.
  const [from] = windowFor(step.dayStart);
  const opacity = useTransform(progress, [from, from + STEP], [0, 1]);
  const y = useTransform(progress, [from, from + STEP], [16, 0], {
    ease: [easing.outQuart],
  });
  const span = step.dayEnd - step.dayStart + 1;

  return (
    <motion.div
      style={{
        gridRow: row,
        gridColumn: `${firstColumn} / span ${span}`,
        paddingTop: 20,
        paddingBottom: 32,
        display: "flex",
        flexDirection: "column",
        gap: 12,
        opacity: reduce ? 1 : opacity,
        y: reduce ? 0 : y,
      }}
    >
      <div className="type-eyebrow" style={{ color: "var(--color-muted)" }}>
        <span style={{ color: "var(--color-ink)", fontWeight: 500 }}>
          {step.n}
        </span>
        {"  ·  step"}
      </div>
      <div className="type-h3" style={{ color: "var(--color-ink)" }}>
        {step.title}
      </div>
      <p className="type-body" style={{ color: "var(--color-muted)", margin: 0 }}>
        {step.body}
      </p>
    </motion.div>
  );
}

function Stamp({
  progress,
  reduce,
}: {
  progress: MotionValue<number>;
  reduce: boolean;
}) {
  // Shows once the last step day has filled — the outer bound the headline
  // promises, not a meeting date.
  const [, filled] = windowFor(KICKOFF_STAMP_DAY);
  const opacity = useTransform(progress, [filled, filled + STEP], [0, 1]);

  return (
    <motion.div
      className="type-eyebrow"
      style={{
        fontFamily: "var(--font-mono)",
        color: "var(--color-ink)",
        marginTop: 48,
        opacity: reduce ? 1 : opacity,
      }}
    >
      {KICKOFF_STAMP}
    </motion.div>
  );
}

/* ── mobile: fourteen rows, cards inline ────────────────────────── */

function CalendarList({ reduce }: { reduce: boolean }) {
  const days = Array.from({ length: CALENDAR_DAYS }, (_, i) => i + 1);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {days.map(function row(day) {
        const weekend = WEEKEND_DAYS.includes(day);
        const step = STEPS.find((s) => s.dayStart === day);
        return (
          <div key={day}>
            <motion.div
              initial={{
                backgroundColor: reduce
                  ? weekend
                    ? CELL_WEEKEND_BG
                    : CELL_FULL_BG
                  : CELL_EMPTY_BG,
              }}
              whileInView={{
                backgroundColor: weekend ? CELL_WEEKEND_BG : CELL_FULL_BG,
              }}
              viewport={{ once: true, amount: 0.8 }}
              transition={{
                duration: reduce ? 0.01 : 0.45,
                ease: ease.outQuart,
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                padding: "14px 16px",
                borderRadius: 8,
                color: weekend
                  ? "rgba(237,231,218,0.72)"
                  : "var(--color-parch)",
              }}
            >
              <span
                className="type-eyebrow"
                style={{ fontFamily: "var(--font-mono)", color: "inherit" }}
              >
                {String(day).padStart(2, "0")}
              </span>
              <span
                className="type-eyebrow"
                style={{
                  fontFamily: "var(--font-mono)",
                  color: "inherit",
                  opacity: 0.7,
                }}
              >
                {WEEKDAY_HEADERS[(day - 1) % 7]}
              </span>
            </motion.div>

            {step ? (
              <motion.div
                initial={{ opacity: reduce ? 1 : 0, y: reduce ? 0 : 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{
                  duration: reduce ? 0.01 : 0.5,
                  ease: ease.outQuart,
                }}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                  padding: "20px 4px 28px",
                }}
              >
                <div
                  className="type-eyebrow"
                  style={{ color: "var(--color-muted)" }}
                >
                  <span
                    style={{ color: "var(--color-ink)", fontWeight: 500 }}
                  >
                    {step.n}
                  </span>
                  {"  ·  step"}
                </div>
                <div className="type-h3" style={{ color: "var(--color-ink)" }}>
                  {step.title}
                </div>
                <p
                  className="type-body"
                  style={{ color: "var(--color-muted)", margin: 0 }}
                >
                  {step.body}
                </p>
              </motion.div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
