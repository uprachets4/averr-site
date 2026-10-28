import { useReducedMotion } from "motion/react";
import { motion } from "motion/react";
import { ease } from "../lib/motion";
import { CharRevealInView } from "./CharReveal";
import MagneticCTA from "./MagneticCTA";
import { FeaturedCard } from "./CaseStudies";

/**
 * Session 29, owner instruction: every figure is removed from the restored
 * September sections.
 *
 * This section used to carry a counting ledger of four rows — SIFT's 42%
 * read from `caseStudies.ts`, plus the three "Averr Studio" figures 40+,
 * 15x and 1.4s that §7.1 of the handoff had flagged as never audited. The
 * rows, their count-up `Figure`, the `LedgerRow` that drew them and the
 * `fromData` reader are all deleted rather than hidden, so nothing on home
 * prints a result claim.
 *
 * What stays is the chapter itself: the eyebrow, the headline, the featured
 * project and the route onward to the vault.
 */

export default function ProofLedger() {
  const reduce = useReducedMotion();

  return (
    <section
      id="work"
      style={{
        backgroundColor: "var(--color-dark)",
        color: "var(--color-parch)",
        padding: "120px 0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div className="grain-dark" aria-hidden="true" />

      <div
        style={{
          maxWidth: "var(--container-wide)",
          margin: "0 auto",
          position: "relative",
          zIndex: 2,
        }}
      >
        <motion.div
          initial={{ opacity: reduce ? 1 : 0, y: reduce ? 0 : 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: reduce ? 0 : 0.5, ease: ease.outQuart }}
          className="type-eyebrow"
          style={{ color: "var(--color-muted-l)", marginBottom: 20 }}
        >
          //_03 · selected work
        </motion.div>

        <h2
          className="type-h2 measure-wide"
          style={{ marginBottom: 48, color: "var(--color-parch)" }}
        >
          <CharRevealInView
            segments={[
              { text: "Recent projects. The rest live" },
              { text: "in the vault.", accent: true },
            ]}
            style={{ color: "var(--color-parch)" }}
          />
        </h2>

        <FeaturedCard reduce={!!reduce} />

        <div style={{ marginTop: 48 }}>
          <MagneticCTA to="/work" variant="text" size="md" tone="dark">
            All case studies
          </MagneticCTA>
        </div>
      </div>
    </section>
  );
}
