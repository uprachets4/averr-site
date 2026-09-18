import { motion, useReducedMotion } from "motion/react";
import PillHl from "../PillHl";
import type { CaseStudy } from "../../data/caseStudies";

const EASE = [0.25, 0.1, 0.25, 1] as const;
const BOUNCE = [0.34, 1.56, 0.64, 1] as const;

type Props = Pick<
  CaseStudy,
  "hero" | "client" | "pillars" | "sector" | "year" | "heroImage"
>;

function splitOnPill(thesis: string, pill: string): [string, string, string] {
  const i = thesis.indexOf(pill);
  if (i < 0) return [thesis, "", ""];
  return [thesis.slice(0, i), pill, thesis.slice(i + pill.length)];
}

export default function CaseHero({
  hero,
  client,
  pillars,
  sector,
  year,
  heroImage,
}: Props) {
  const reduce = useReducedMotion();
  const [before, pill, after] = splitOnPill(hero.thesis, hero.thesisPill);

  return (
    <section
      style={{
        position: "relative",
        overflow: "hidden",
        backgroundColor: "var(--color-bg)",
        padding: "180px 40px 100px",
      }}
    >
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 1400px 900px at 30% 20%, rgba(232,225,208,0.55), transparent 60%), radial-gradient(ellipse 1000px 700px at 80% 80%, rgba(232,225,208,0.35), transparent 60%)",
          pointerEvents: "none",
        }}
      />
      <div className="grain-light" aria-hidden="true" />

      <div
        style={{
          position: "relative",
          zIndex: 2,
          maxWidth: 1200,
          margin: "0 auto",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: reduce ? 0 : 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduce ? 0.01 : 0.5, ease: EASE, delay: 0.2 }}
          className="type-eyebrow"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            color: "var(--color-muted)",
            marginBottom: 32,
          }}
        >
          <span style={{ height: 1, width: 20, background: "currentColor", opacity: 0.6 }} />
          {hero.eyebrow}
          <span style={{ height: 1, width: 20, background: "currentColor", opacity: 0.6 }} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: reduce ? 0 : 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduce ? 0.01 : 0.5, ease: EASE, delay: 0.3 }}
          className="type-eyebrow"
          style={{
            color: "var(--color-muted-2)",
            marginBottom: 24,
          }}
        >
          {client}
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: reduce ? 0 : 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduce ? 0.01 : 0.7, ease: EASE, delay: 0.4 }}
          className="type-display-l"
          style={{
            color: "var(--color-ink)",
            marginBottom: 40,
            maxWidth: 1080,
          }}
        >
          {before}
          {pill ? (
            <motion.span
              initial={{ opacity: 0, scale: reduce ? 1 : 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: reduce ? 0.01 : 0.5,
                ease: BOUNCE,
                delay: reduce ? 0 : 0.9,
              }}
              style={{ display: "inline-block" }}
            >
              <PillHl>{pill}</PillHl>
            </motion.span>
          ) : null}
          {after}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: reduce ? 0 : 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduce ? 0.01 : 0.6, ease: EASE, delay: 1.1 }}
          className="type-body-lg"
          style={{
            color: "var(--color-muted)",
            maxWidth: 720,
            marginBottom: 64,
          }}
        >
          {hero.kicker}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: reduce ? 0 : 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduce ? 0.01 : 0.6, ease: EASE, delay: 1.3 }}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            gap: 40,
            paddingTop: 32,
            borderTop: "1px solid rgba(20,20,18,0.10)",
          }}
          className="case-meta-grid"
        >
          <Meta label="Pillars" value={pillars.join(" · ")} />
          <Meta label="Sector" value={sector} />
          <Meta label="Year" value={year} />
        </motion.div>

        {heroImage ? (
          <motion.figure
            initial={{ opacity: 0, y: reduce ? 0 : 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduce ? 0.01 : 0.7, ease: EASE, delay: 1.5 }}
            style={{
              marginTop: 64,
              overflow: "hidden",
              borderRadius: 6,
              border: "1px solid rgba(20,20,18,0.10)",
              aspectRatio: "16 / 10",
              background: "var(--color-bg-alt)",
            }}
          >
            <img
              src={heroImage}
              alt={`${client} overview screen`}
              loading="eager"
              decoding="async"
              style={{
                display: "block",
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </motion.figure>
        ) : null}
      </div>

      <style>{`
        @media (max-width: 720px) {
          .case-meta-grid {
            grid-template-columns: 1fr !important;
            gap: 20px !important;
          }
        }
      `}</style>
    </section>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div
        className="type-eyebrow"
        style={{
          color: "var(--color-muted-2)",
          marginBottom: 10,
        }}
      >
        {label}
      </div>
      <div
        className="type-h3"
        style={{
          color: "var(--color-ink)",
        }}
      >
        {value}
      </div>
    </div>
  );
}
