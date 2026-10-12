import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "motion/react";
import { duration, ease } from "../../lib/motion";
import { useBusinessName } from "../../lib/businessName";
import PillHl from "../PillHl";

/**
 * Chapter 5 — start.
 *
 * The bookend. The hero asked for a name and put it on a slab; the
 * closer asks the question back with the same slab and the same name,
 * so the page ends where it began with the reader's own business in it.
 * Falls back to "your business" when nothing was typed.
 *
 * PillHl's inventory is unchanged by this chapter: two on home — the
 * hero's field and this one — and none anywhere else.
 */
export default function StartChapter() {
  const reduce = !!useReducedMotion();
  const { name } = useBusinessName();
  const shown = name.trim() || "your business";

  const paths = [
    {
      to: "/contact#booking",
      kicker: "//_THE FASTEST WAY",
      label: "Book a 30-minute call",
      note: "A real conversation about the work, not a sales script.",
    },
    {
      to: "/contact#brief",
      kicker: "//_IF YOU'D RATHER WRITE",
      label: "Send a brief",
      note: "Tell us what you need and see the reply before you send it.",
    },
  ];

  return (
    <section className="st">
      <div className="st-inner">
        <div className="type-eyebrow st-eyebrow">//_START</div>

        <h2 className="type-display-l st-h2">
          Ready to make{" "}
          <span className="st-slab">
            <PillHl>{shown}</PillHl>
          </span>{" "}
          the one they choose?
        </h2>

        <ul className="st-paths">
          {paths.map(function card(p, i) {
            return (
              <motion.li
                key={p.to}
                initial={reduce ? false : { opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: reduce ? 0 : duration.slow, ease: ease.outQuart, delay: reduce ? 0 : i * 0.09 }}
              >
                <Link to={p.to} className="st-path">
                  <span className="st-path__kicker">{p.kicker}</span>
                  <span className="st-path__label">
                    {p.label}
                    <span className="st-path__arrow" aria-hidden>→</span>
                  </span>
                  <span className="st-path__note">{p.note}</span>
                </Link>
              </motion.li>
            );
          })}
        </ul>

        <p className="st-promise">24 hours. Every message.</p>
      </div>
    </section>
  );
}
