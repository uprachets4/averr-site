import { motion, useReducedMotion } from "motion/react";
import { ease } from "../../lib/motion";
import type { ApproachLayout, Pillar } from "../../data/caseStudies";
import ImageFrame from "./ImageFrame";
import { CharRevealInView } from "../CharReveal";

type Entry = {
  pillar: Pillar;
  body: string;
  image?: string;
  layout?: ApproachLayout;
};

const pillarChipStyle: React.CSSProperties = {
  display: "inline-block",
  padding: "6px 14px",
  borderRadius: 999,
  border: "1px solid rgba(20,20,18,0.18)",
  background: "transparent",
  color: "var(--color-ink-soft)",
  fontFamily: "var(--font-mono)",
  fontSize: 11,
  letterSpacing: "0.14em",
  textTransform: "uppercase" as const,
  marginBottom: 20,
};

function GeometricAnchor({ pillar }: { pillar: Pillar }) {
  // Muted geometric fallback when no image is provided
  const rotate = pillar === "Design" ? 0 : pillar === "Automate" ? 30 : -30;
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 400 320"
      preserveAspectRatio="xMidYMid slice"
      fill="none"
      aria-hidden
      style={{ display: "block" }}
    >
      <defs>
        <linearGradient
          id={`geom-${pillar}`}
          x1="0"
          y1="0"
          x2="400"
          y2="320"
          gradientTransform={`rotate(${rotate} 200 160)`}
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#C9B896" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#A8916D" stopOpacity="0.2" />
        </linearGradient>
      </defs>
      <circle cx="200" cy="160" r="140" stroke={`url(#geom-${pillar})`} strokeWidth={1.5} />
      <circle cx="200" cy="160" r="100" stroke={`url(#geom-${pillar})`} strokeWidth={1.5} />
      <circle cx="200" cy="160" r="60" stroke={`url(#geom-${pillar})`} strokeWidth={1.5} />
    </svg>
  );
}

export default function Approach({ entries }: { entries: Entry[] }) {
  const reduce = useReducedMotion();
  return (
    <section
      style={{
        backgroundColor: "var(--color-bg-alt)",
        padding: "128px 40px",
        borderTop: "1px solid rgba(20,20,18,0.10)",
        position: "relative",
      }}
    >
      <div className="grain-light" aria-hidden="true" />
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          position: "relative",
          zIndex: 2,
        }}
      >
        <motion.div
          initial={{ opacity: reduce ? 1 : 0, y: reduce ? 0 : 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: reduce ? 0 : 0.5, ease: ease.outQuart }}
          className="type-eyebrow"
          style={{ color: "var(--color-muted)", marginBottom: 24 }}
        >
          //_02 · approach
        </motion.div>

        <h2
          className="type-h2"
          style={{
            color: "var(--color-ink)",
            marginBottom: 96,
            maxWidth: 900,
          }}
        >
          <CharRevealInView
            text="Three pillars, one plan."
            style={{ color: "var(--color-ink)" }}
          />
        </h2>

        <div className="approach-stack" style={{ display: "flex", flexDirection: "column", gap: 96 }}>
          {entries.map((entry, i) => {
            if (entry.layout === "text-forward") {
              return (
                <TextForwardRow
                  key={`${entry.pillar}-${i}`}
                  entry={entry}
                  index={i}
                  reduce={!!reduce}
                />
              );
            }
            if (entry.layout === "text-then-image-full") {
              return (
                <TextThenImageFullRow
                  key={`${entry.pillar}-${i}`}
                  entry={entry}
                  index={i}
                  reduce={!!reduce}
                />
              );
            }
            return (
              <ApproachRow
                key={`${entry.pillar}-${i}`}
                entry={entry}
                index={i}
                reduce={!!reduce}
              />
            );
          })}
        </div>
      </div>
      <style>{`
        @media (max-width: 900px) {
          .approach-stack { gap: 64px !important; }
        }
      `}</style>
    </section>
  );
}

function ApproachRow({
  entry,
  index,
  reduce,
}: {
  entry: Entry;
  index: number;
  reduce: boolean;
}) {
  const isReversed = index % 2 === 1;
  return (
    <motion.div
      className="approach-row"
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1.4fr",
        gap: 64,
        alignItems: "center",
        direction: isReversed ? "rtl" : "ltr",
      }}
    >
      <motion.div
        initial={{ opacity: reduce ? 1 : 0, y: reduce ? 0 : 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{
          duration: reduce ? 0 : 0.7,
          ease: ease.outQuart,
          delay: reduce ? 0 : 0.15,
        }}
        style={{ direction: "ltr" }}
      >
        <div style={pillarChipStyle}>{entry.pillar}</div>
        <p
          className="type-body"
          style={{ color: "var(--color-ink)", maxWidth: 480 }}
        >
          {entry.body}
        </p>
      </motion.div>

      <motion.figure
        initial={{ opacity: reduce ? 1 : 0, scale: reduce ? 1 : 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{
          duration: reduce ? 0 : 0.9,
          ease: ease.outExpo,
        }}
        style={{
          direction: "ltr",
          position: "relative",
          overflow: entry.image ? "visible" : "hidden",
          aspectRatio: entry.image ? "auto" : "5 / 3.5",
          borderRadius: entry.image ? 0 : 6,
          border: entry.image ? "none" : "1px solid rgba(20,20,18,0.10)",
          background: entry.image ? "transparent" : "var(--color-bg)",
          margin: 0,
        }}
      >
        {entry.image ? (
          <ImageFrame variant="inline">
            <img
              src={entry.image}
              alt={`${entry.pillar} approach visual`}
              loading="lazy"
              decoding="async"
            />
          </ImageFrame>
        ) : (
          <GeometricAnchor pillar={entry.pillar} />
        )}
      </motion.figure>

      <style>{`
        @media (max-width: 900px) {
          .approach-row {
            grid-template-columns: 1fr !important;
            direction: ltr !important;
            gap: 32px !important;
          }
        }
      `}</style>
    </motion.div>
  );
}

function TextForwardRow({
  entry,
  index,
  reduce,
}: {
  entry: Entry;
  index: number;
  reduce: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: reduce ? 1 : 0, y: reduce ? 0 : 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{
        duration: reduce ? 0 : 0.7,
        ease: ease.outQuart,
        delay: reduce ? 0 : 0.15 + index * 0.08,
      }}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
      }}
    >
      <div style={{ ...pillarChipStyle, marginBottom: 24 }}>{entry.pillar}</div>
      <p
        className="type-body-lg"
        style={{
          color: "var(--color-ink)",
          maxWidth: "72ch",
          margin: 0,
        }}
      >
        {entry.body}
      </p>
    </motion.div>
  );
}

function TextThenImageFullRow({
  entry,
  index,
  reduce,
}: {
  entry: Entry;
  index: number;
  reduce: boolean;
}) {
  return (
    <motion.div
      className="approach-tif"
      initial={{ opacity: reduce ? 1 : 0, y: reduce ? 0 : 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{
        duration: reduce ? 0 : 0.7,
        ease: ease.outQuart,
        delay: reduce ? 0 : 0.15 + index * 0.08,
      }}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
      }}
    >
      <div className="approach-tif__text">
        <div style={{ ...pillarChipStyle, marginBottom: 20 }}>{entry.pillar}</div>
        <p
          className="type-body-lg"
          style={{
            color: "var(--color-ink)",
            maxWidth: "72ch",
            margin: 0,
          }}
        >
          {entry.body}
        </p>
      </div>

      {entry.image ? (
        <motion.figure
          initial={{ opacity: reduce ? 1 : 0, scale: reduce ? 1 : 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: reduce ? 0 : 0.9, ease: ease.outExpo }}
          style={{ margin: 0, marginTop: 48 }}
        >
          <ImageFrame variant="inline">
            <img
              src={entry.image}
              alt={`${entry.pillar} approach visual`}
              loading="lazy"
              decoding="async"
            />
          </ImageFrame>
        </motion.figure>
      ) : null}

      <style>{`
        .approach-tif__text {
          max-width: 72ch;
          margin: 0 auto;
          text-align: center;
        }
        @media (max-width: 720px) {
          .approach-tif__text {
            text-align: left;
          }
        }
      `}</style>
    </motion.div>
  );
}
