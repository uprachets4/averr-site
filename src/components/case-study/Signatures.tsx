import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ease } from "../../lib/motion";

type Item = { title: string; body: string; image?: string };

export default function Signatures({
  items,
  imageSrc,
  imageAlt,
}: {
  items: Item[];
  imageSrc?: string;
  imageAlt?: string;
}) {
  const reduce = useReducedMotion();
  // Merge legacy single signatureImage into first item if item has no image of its own
  const merged: Item[] = items.map((it, i) =>
    i === 0 && !it.image && imageSrc
      ? { ...it, image: imageSrc }
      : it
  );

  return (
    <section
      style={{
        backgroundColor: "var(--color-dark)",
        color: "var(--color-parch)",
        padding: "140px 40px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div className="grain-dark" aria-hidden="true" />
      <div
        style={{
          maxWidth: 1240,
          margin: "0 auto",
          position: "relative",
          zIndex: 2,
        }}
      >
        <div
          className="signatures-header"
          style={{
            display: "grid",
            gridTemplateColumns: "140px 1fr",
            gap: 40,
            alignItems: "start",
            marginBottom: 72,
          }}
        >
          <motion.div
            initial={{ opacity: reduce ? 1 : 0, y: reduce ? 0 : 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: reduce ? 0 : 0.5, ease: ease.outQuart }}
            className="type-eyebrow"
            style={{ color: "var(--color-muted-l)", paddingTop: 12 }}
          >
            //_04 · signature moments
          </motion.div>

          <motion.h2
            initial={{ opacity: reduce ? 1 : 0, y: reduce ? 0 : 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{
              duration: reduce ? 0 : 0.7,
              ease: ease.outQuart,
              delay: reduce ? 0 : 0.1,
            }}
            className="type-h2"
            style={{ maxWidth: 900 }}
          >
            The moves <span className="fade-h-dark">that made it read premium.</span>
          </motion.h2>
        </div>

        <div
          className="signatures-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 16,
          }}
        >
          {merged.map((item, i) => (
            <SignatureCard
              key={i}
              item={item}
              index={i}
              alt={imageAlt}
              reduce={!!reduce}
            />
          ))}
        </div>
      </div>
      <style>{`
        @media (max-width: 900px) {
          .signatures-grid { grid-template-columns: 1fr !important; }
          .signatures-header {
            grid-template-columns: 1fr !important;
            gap: 20px !important;
          }
        }
      `}</style>
    </section>
  );
}

function SignatureCard({
  item,
  index,
  alt,
  reduce,
}: {
  item: Item;
  index: number;
  alt?: string;
  reduce: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.article
      initial={{ opacity: reduce ? 1 : 0, y: reduce ? 0 : 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{
        duration: reduce ? 0 : 0.7,
        ease: ease.outQuart,
        delay: reduce ? 0 : 0.1 + index * 0.12,
      }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      style={{
        display: "flex",
        flexDirection: "column",
        borderRadius: 6,
        overflow: "hidden",
        border: `1px solid ${
          hovered && !reduce
            ? "rgba(237,231,218,0.24)"
            : "rgba(237,231,218,0.12)"
        }`,
        background: "rgba(237,231,218,0.02)",
        transform:
          hovered && !reduce ? "translateY(-6px)" : "translateY(0)",
        boxShadow:
          hovered && !reduce
            ? "0 12px 32px rgba(0,0,0,0.35)"
            : "0 0 0 rgba(0,0,0,0)",
        transition:
          "border-color 300ms ease, transform 300ms ease, box-shadow 300ms ease",
      }}
    >
      {item.image ? (
        <div
          style={{
            position: "relative",
            overflow: "hidden",
            aspectRatio: "16 / 10",
            background: "rgba(237,231,218,0.04)",
          }}
        >
          <motion.img
            src={item.image}
            alt={alt || `${item.title} screen`}
            loading="lazy"
            decoding="async"
            animate={{ scale: hovered && !reduce ? 1.03 : 1 }}
            transition={{ duration: reduce ? 0 : 0.4, ease: ease.outQuart }}
            style={{
              display: "block",
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </div>
      ) : null}
      <div style={{ padding: "28px 28px 32px" }}>
        <h3
          className="type-h3"
          style={{
            color: "var(--color-parch)",
            marginBottom: 14,
          }}
        >
          {item.title}
        </h3>
        <p
          className="type-body"
          style={{
            color: "var(--color-muted-l)",
          }}
        >
          {item.body}
        </p>
      </div>
    </motion.article>
  );
}
