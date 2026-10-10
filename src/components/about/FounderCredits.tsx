import { useRef } from "react";
import { motion, useInView, useReducedMotion, useScroll, useTransform } from "motion/react";
import { duration, ease, easing } from "../../lib/motion";

/**
 * The founder, as credits.
 *
 * Every line below comes from a sentence already on the page — the bio
 * in FounderStatement and the role line. No new claims, and the source
 * of each is written next to it so the next session can check:
 *
 *   FOUNDER      ← "Started Averr Studios to build the kind of client
 *                   websites that actually earn their portfolio slot."
 *                   and the role line "Founder + Design Engineer"
 *   CO-FOUNDED   ← "Previously co-founded KlaasX Edutech (15-person
 *                   team, 150+ institutions)."
 *   SALES        ← "...B2B SaaS sales within Google's extended
 *                   workforce program..."
 *   CRAFT        ← "Toronto-based design engineer with a background
 *                   spanning ... frontend development, and AI workflow
 *                   automation."
 *   BASED        ← "Toronto-based design engineer..."
 *
 * Each line masks up as the scroll reaches it, one at a time.
 */

export const CREDITS: { label: string; line: string }[] = [
  { label: "Founder", line: "Averr Studios" },
  { label: "Co-founded", line: "KlaasX Edutech · 15-person team · 150+ institutions" },
  { label: "Sales", line: "B2B SaaS within Google's extended workforce program" },
  { label: "Craft", line: "Design engineering, frontend, AI workflow automation" },
  { label: "Based", line: "Toronto" },
];

export default function FounderCredits({ children }: { children?: React.ReactNode }) {
  const reduce = !!useReducedMotion();
  const ref = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 85%", "end 55%"],
  });
  // the slow push-in across the whole section
  const push = useTransform(scrollYProgress, [0, 1], [1, 1.06], {
    ease: easing.inOut,
    clamp: true,
  });

  return (
    <div ref={ref} className="fc">
      <div className="fc-mark">
        {/* No founder photograph exists in the repo, so the mark takes
            the slot at large size with the same push-in a photo would
            have had. No placeholder stands in for the photo. */}
        <motion.div className="fc-plate" style={{ scale: reduce ? 1 : push }}>
          <MarkPlate />
        </motion.div>
      </div>

      <div className="fc-credits">
        <h2 className="type-display-l fc-name">Prachets Upadhyay</h2>
        <ol className="fc-list">
          {CREDITS.map((c, i) => (
            <CreditLine key={c.label} credit={c} index={i} reduce={reduce} />
          ))}
        </ol>
        {children}
      </div>

      <style>{`
        .fc {
          display: grid;
          grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.2fr);
          gap: 72px;
          align-items: start;
          max-width: var(--container-wide);
          margin: 0 auto;
        }
        .fc-mark { position: sticky; top: 18vh; }
        .fc-plate {
          width: 100%;
          aspect-ratio: 4 / 5;
          border-radius: 16px;
          border: 1px solid rgba(20,20,18,0.10);
          background: var(--color-bg-alt);
          display: grid; place-items: center;
          padding: 12%;
          overflow: hidden;
        }
        .fc-name { color: var(--color-ink); margin: 0 0 36px; }
        .fc-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; }
        @media (max-width: 900px) {
          .fc { grid-template-columns: 1fr; gap: 34px; }
          .fc-mark { position: static; }
          .fc-plate { aspect-ratio: 5 / 4; padding: 9%; }
          .fc-name { margin-bottom: 24px; }
        }
      `}</style>
    </div>
  );
}

function CreditLine({
  credit,
  index,
  reduce,
}: {
  credit: { label: string; line: string };
  index: number;
  reduce: boolean;
}) {
  const ref = useRef<HTMLLIElement | null>(null);
  // one at a time: each line watches its own box
  const inView = useInView(ref, { once: true, margin: "-20% 0px -22% 0px" });
  const show = reduce || inView;

  return (
    <li ref={ref} className="fc-item">
      <span className="fc-label">{credit.label}</span>
      {/* the mask: the line rises out of its own box */}
      <span className="fc-mask">
        <motion.span
          className="fc-line"
          initial={false}
          animate={{ y: show ? "0%" : "108%", opacity: show ? 1 : 0 }}
          transition={{
            duration: reduce ? 0 : duration.slow,
            ease: ease.outQuart,
            delay: reduce ? 0 : index * 0.04,
          }}
        >
          {credit.line}
        </motion.span>
      </span>
      <motion.span
        className="fc-rule"
        aria-hidden="true"
        initial={false}
        animate={{ scaleX: show ? 1 : 0 }}
        transition={{ duration: reduce ? 0 : duration.slow, ease: ease.outQuart }}
      />

      <style>{`
        .fc-item {
          display: grid;
          grid-template-columns: 148px minmax(0, 1fr);
          gap: 20px;
          align-items: baseline;
          padding: 18px 0 16px;
          position: relative;
        }
        .fc-label {
          font-family: var(--font-mono); font-size: 13px; letter-spacing: 0.1em;
          text-transform: uppercase; color: var(--color-muted);
        }
        .fc-mask { display: block; overflow: hidden; }
        .fc-line {
          display: block;
          font-family: var(--font-display); font-weight: 500;
          font-size: clamp(19px, 1.7vw, 25px); line-height: 1.3;
          letter-spacing: -0.01em; color: var(--color-ink);
        }
        .fc-rule {
          position: absolute; left: 0; right: 0; bottom: 0; height: 1px;
          background: rgba(20,20,18,0.12);
          transform-origin: left center;
        }
        @media (max-width: 900px) {
          .fc-item { grid-template-columns: 1fr; gap: 6px; padding: 14px 0 13px; }
        }
      `}</style>
    </li>
  );
}

/** The mark, filled, at plate size. Imported lazily-free: it is tiny. */
function MarkPlate() {
  return (
    <svg
      viewBox="0 0 327 454"
      fill="none"
      role="img"
      aria-label="Prachets Upadhyay monogram"
      style={{ display: "block", width: "100%", height: "auto", color: "var(--color-ink)" }}
    >
      <path d={PLATE_D} fill="currentColor" fillRule="evenodd" />
    </svg>
  );
}

import { MARK_PATH_D as PLATE_D } from "../MonogramMark";
