import { motion, useReducedMotion } from "motion/react";
import { duration, ease } from "../../lib/motion";
import MagneticCTA from "../MagneticCTA";
import { RESPONSE_TIME } from "./briefCopy";

/**
 * Two paths, stated plainly.
 *
 * /contact used to open onto one long scroll with the form two
 * screens down. The reader has exactly two things they might want, so
 * the hero says so and each card takes them straight there.
 *
 * Typographic — no icon grid — and each promise is a line the site
 * already makes: the call is the 30-minute discovery call /services
 * books, and the brief is answered in the 24 hours the dark band
 * promises.
 */

function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function PathCards() {
  const reduce = !!useReducedMotion();
  const paths = [
    {
      n: "01",
      title: "Book a 30-minute call",
      promise: "Pick a time now — no sales script.",
      cta: "See times",
      id: "book",
    },
    {
      n: "02",
      title: "Send a brief",
      promise: `Write it here and we reply within ${RESPONSE_TIME}.`,
      cta: "Write the brief",
      id: "brief",
    },
  ];

  return (
    <div className="pc">
      {paths.map((p, i) => (
        <motion.div
          key={p.id}
          className="pc-card"
          initial={{ opacity: reduce ? 1 : 0, y: reduce ? 0 : 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: reduce ? 0 : duration.slow,
            delay: reduce ? 0 : 1.9 + i * 0.1,
            ease: ease.outQuart,
          }}
        >
          <span className="pc-n">{p.n}</span>
          <h2 className="pc-t">{p.title}</h2>
          <p className="pc-p">{p.promise}</p>
          <MagneticCTA
            variant={i === 0 ? "primary" : "ghost"}
            onClick={() => scrollToId(p.id)}
            ariaLabel={`${p.cta} — ${p.title}`}
          >
            {p.cta}
          </MagneticCTA>
        </motion.div>
      ))}

      <style>{`
        .pc {
          display: grid; grid-template-columns: 1fr 1fr; gap: 24px;
          margin-top: clamp(28px, 4vh, 48px);
        }
        .pc-card {
          display: flex; flex-direction: column; align-items: flex-start; gap: 12px;
          padding: 28px 28px 30px;
          border: 1px solid rgba(20,20,18,0.14);
          border-radius: 14px;
          background: var(--color-bg);
        }
        .pc-n {
          font-family: var(--font-mono); font-size: 13px; letter-spacing: 0.1em;
          color: var(--color-muted-2);
        }
        .pc-t {
          font-family: var(--font-display); font-weight: 500;
          font-size: clamp(22px, 2.1vw, 30px); line-height: 1.12;
          letter-spacing: -0.01em; color: var(--color-ink); margin: 0;
        }
        .pc-p { margin: 0 0 6px; font-size: 15px; line-height: 1.55; color: var(--color-muted); }
        @media (max-width: 1023px) {
          .pc { grid-template-columns: 1fr; gap: 16px; }
          .pc-card { padding: 22px; }
        }
      `}</style>
    </div>
  );
}
