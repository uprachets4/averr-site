import { useState } from "react";
import { motion } from "motion/react";
import { duration, ease } from "../lib/motion";
import { caseStudies } from "../data/caseStudies";


const FEATURED = {
  client: "CG Walls & Floors · 2026",
  tags: ["Design", "Automate"],
  title: "Realtor outreach automation + website rebuild",
  desc:
    "Custom marketing site + AI agent scraping realtor listings to identify renovation-ready properties, generating personalized outreach at scale.",
  href: "/work/cg-walls-and-floors",
};

/** Single source: the study's own record. */
const FEATURED_FIGURE = caseStudies["cg-walls-and-floors"].headlineFigure;


export function FeaturedCard({ reduce }: { reduce: boolean }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.a
      href={FEATURED.href}
      initial={{ opacity: reduce ? 1 : 0, y: reduce ? 0 : 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: reduce ? 0 : 0.7, ease: ease.outQuart, delay: 0.3 }}
      className="featured-grid"
      style={{
        display: "grid",
        gridTemplateColumns: "1.2fr 1fr",
        minHeight: 400,
        background: "var(--color-dark-alt)",
        border: "1px solid rgba(237,231,218,0.10)",
        borderRadius: 20,
        overflow: "hidden",
        transition: "transform 0.4s cubic-bezier(0.25,0.1,0.25,1), border-color 0.4s ease",
        cursor: "pointer",
        textDecoration: "none",
        color: "inherit",
      }}
      onMouseEnter={(e) => {
        setHovered(true);
        if (reduce) return;
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.borderColor = "rgba(237,231,218,0.18)";
      }}
      onMouseLeave={(e) => {
        setHovered(false);
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.borderColor = "rgba(237,231,218,0.10)";
      }}
    >
      {/* Project visual */}
      <div
        style={{
          position: "relative",
          overflow: "hidden",
          background: "var(--color-dark-alt)",
        }}
      >
        <motion.img
          src="/work/cgwalls/gallery.jpg"
          alt="CG Walls & Floors renovation in progress — drywall and trim work mid-project"
          width={1400}
          height={775}
          loading="lazy"
          decoding="async"
          animate={{ scale: hovered && !reduce ? 1.04 : 1 }}
          transition={{ duration: reduce ? 0 : duration.slow, ease: ease.outQuart }}
          style={{
            display: "block",
            width: "100%",
            height: "100%",
            objectFit: "cover",
            aspectRatio: "1400 / 775",
          }}
        />
      </div>

      {/* Meta */}
      <div
        style={{
          padding: "48px 40px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div>
          {/* Tag row */}
          <div
            style={{
              display: "flex",
              gap: 8,
              marginBottom: 24,
              flexWrap: "wrap",
            }}
          >
            {FEATURED.tags.map((tag) => (
              <span
                key={tag}
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 10,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  padding: "4px 10px",
                  border: "1px solid rgba(237,231,218,0.18)",
                  color: "var(--color-muted-l)",
                  borderRadius: 4,
                }}
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Client name */}
          <div
            className="type-eyebrow"
            style={{
              color: "var(--color-muted-l)",
              marginBottom: 12,
            }}
          >
            {FEATURED.client}
          </div>

          {/* Title */}
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 500,
              fontSize: 32,
              letterSpacing: "-0.02em",
              lineHeight: 1.15,
              color: "var(--color-parch)",
              marginBottom: 20,
            }}
          >
            {FEATURED.title}
          </div>

          {/* Desc */}
          <div
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 15,
              lineHeight: 1.6,
              color: "var(--color-muted-l)",
              marginBottom: 32,
            }}
          >
            {FEATURED.desc}
          </div>
        </div>

        <div>
          {/* Result */}
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: 16,
              marginBottom: 24,
            }}
          >
            <div
              className="num-gradient-dark tnum"
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 500,
                fontSize: 72,
                lineHeight: 0.9,
                letterSpacing: "-0.04em",
              }}
            >
              {FEATURED_FIGURE?.value}
            </div>
            <div
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 14,
                lineHeight: 1.4,
                color: "var(--color-muted-l)",
              }}
            >
              {FEATURED_FIGURE?.caption}
            </div>
          </div>

          {/* Link */}
          <div
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 14,
              fontWeight: 500,
              color: "var(--color-parch)",
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            Read the full case study
            <span
              style={{
                display: "inline-block",
                transition: "transform 0.3s ease",
              }}
              className="group-hover:translate-x-1"
            >
              →
            </span>
          </div>
        </div>
      </div>
    </motion.a>
  );
}
