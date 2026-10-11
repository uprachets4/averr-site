import { useEffect } from "react";
import { motion, useReducedMotion } from "motion/react";
import { duration, ease } from "../lib/motion";
import MagneticCTA from "../components/MagneticCTA";
import MonogramMark from "../components/MonogramMark";
import { CharReveal } from "../components/CharReveal";

/**
 * 404.
 *
 * PillHl is HOME ONLY from Session 20 — the hero and FinalCTA, nowhere
 * else — so the slab that used to sit on "doesn't exist" is gone and
 * the Cormorant accent carries "Yet." instead.
 *
 * The mark draws, the headline paints at the first frame per the hero
 * LCP rule, and the four routes are offered as rows rather than a grid
 * of cards: this page's whole job is to be left quickly.
 */

const ROUTES = [
  { to: "/work", label: "Work", line: "Four projects, start to finish." },
  { to: "/services", label: "Services", line: "Design, Automate, Grow." },
  { to: "/about", label: "About", line: "The studio, and who runs it." },
  { to: "/contact", label: "Contact", line: "Book a call or send a brief." },
];

export default function NotFound() {
  const reduce = useReducedMotion();

  useEffect(function title() {
    const prev = document.title;
    document.title = "Not found — Averr Studios";
    return function restore() {
      document.title = prev;
    };
  }, []);

  return (
    <section className="nf">
      <div className="grain-light" aria-hidden="true" style={{ opacity: 0.05 }} />

      <div className="nf-in">
        <div className="nf-mark" aria-hidden="true">
          <MonogramMark variant="hero" />
        </div>

        {/* painted at the first frame; the entrance is transform-only */}
        <h1 className="type-display-l nf-h">
          <CharReveal
            paint
            delay={reduce ? 0 : 1.1}
            segments={[{ text: "This page doesn't exist. " }, { text: "Yet.", accent: true }]}
          />
        </h1>

        <motion.p
          className="nf-sub"
          initial={{ opacity: 1, y: reduce ? 0 : 10 }}
          animate={{ y: 0 }}
          transition={{ duration: reduce ? 0 : duration.base, ease: ease.outQuart, delay: reduce ? 0 : 1.4 }}
        >
          Here's where the good stuff is:
        </motion.p>

        <motion.ul
          className="nf-list"
          initial={{ opacity: 1, y: reduce ? 0 : 10 }}
          animate={{ y: 0 }}
          transition={{ duration: reduce ? 0 : duration.base, ease: ease.outQuart, delay: reduce ? 0 : 1.6 }}
        >
          {ROUTES.map((r) => (
            <li key={r.to} className="nf-row">
              <MagneticCTA to={r.to} variant="text" size="lg" ariaLabel={`${r.label} — ${r.line}`}>
                {r.label}
              </MagneticCTA>
              <span className="nf-line">{r.line}</span>
            </li>
          ))}
        </motion.ul>
      </div>

      <style>{`
        .nf {
          position: relative; overflow: hidden;
          background: var(--color-bg);
          min-height: 100vh;
          padding: clamp(104px, 14vh, 168px) 0 clamp(72px, 10vh, 120px);
          display: flex; align-items: center;
        }
        .nf-in {
          position: relative; z-index: 2;
          max-width: var(--container-wide); margin: 0 auto; width: 100%;
        }
        .nf-mark { width: clamp(90px, 13vh, 150px); margin-bottom: clamp(22px, 3vh, 38px); }
        .nf-mark > div { width: 100% !important; }
        .nf-h { color: var(--color-ink); margin: 0; max-width: 20ch; }
        .nf-sub {
          margin: clamp(18px, 2.4vh, 28px) 0 clamp(28px, 4vh, 44px);
          font-size: 18px; line-height: 1.6; color: var(--color-muted);
        }
        .nf-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; }
        .nf-row {
          display: flex; align-items: baseline; gap: 20px; flex-wrap: wrap;
          padding: 16px 0; border-top: 1px solid rgba(20,20,18,0.12);
        }
        .nf-row:last-child { border-bottom: 1px solid rgba(20,20,18,0.12); }
        .nf-line { font-size: 15px; color: var(--color-muted); }
        @media (max-width: 760px) {
          .nf-row { gap: 4px; flex-direction: column; align-items: flex-start; }
        }
      `}</style>
    </section>
  );
}
