import React from "react";
import { motion, useReducedMotion } from "motion/react";
import { ease } from "../../lib/motion";


type Item = { title: string; body: string };

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
          maxWidth: 1200,
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
            initial={{ opacity: 0, y: reduce ? 0 : 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: reduce ? 0.01 : 0.5, ease: ease.outQuart }}
            className="type-eyebrow"
            style={{
              color: "var(--color-muted-l)",
              paddingTop: 12,
            }}
          >
            //_04 · signature moments
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: reduce ? 0 : 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: reduce ? 0.01 : 0.7, ease: ease.outQuart, delay: 0.1 }}
            className="type-h2"
            style={{
              maxWidth: 900,
            }}
          >
            The moves <span className="fade-h-dark">that made it read premium.</span>
          </motion.h2>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          {items.map((item, i) => (
            <React.Fragment key={i}>
              <motion.article
                initial={{ opacity: 0, y: reduce ? 0 : 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{
                  duration: reduce ? 0.01 : 0.6,
                  ease: ease.outQuart,
                  delay: reduce ? 0 : 0.1 + i * 0.1,
                }}
                style={{
                  display: "grid",
                  gridTemplateColumns: "60px 1fr",
                  gap: 32,
                  alignItems: "start",
                  padding: "36px 0",
                  borderTop: "1px solid rgba(237,231,218,0.14)",
                }}
                className="signature-row"
              >
                <div
                  className="type-eyebrow"
                  style={{
                    color: "var(--color-muted-l)",
                    paddingTop: 8,
                    textTransform: "none",
                  }}
                >
                  0{i + 1}
                </div>
                <div>
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
                      maxWidth: 720,
                    }}
                  >
                    {item.body}
                  </p>
                </div>
              </motion.article>
              {imageSrc && i === 1 ? (
                <motion.figure
                  initial={{ opacity: 0, y: reduce ? 0 : 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: reduce ? 0.01 : 0.7, ease: ease.outQuart }}
                  style={{
                    margin: "36px 0",
                    maxWidth: 800,
                    aspectRatio: "4 / 3",
                    overflow: "hidden",
                    borderRadius: 6,
                    border: "1px solid rgba(237,231,218,0.14)",
                    background: "rgba(237,231,218,0.03)",
                  }}
                >
                  <img
                    src={imageSrc}
                    alt={imageAlt || "Case study screen"}
                    loading="lazy"
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
            </React.Fragment>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .signatures-header {
            grid-template-columns: 1fr !important;
            gap: 20px !important;
          }
        }
        @media (max-width: 720px) {
          .signature-row {
            grid-template-columns: 40px 1fr !important;
            gap: 20px !important;
          }
        }
      `}</style>
    </section>
  );
}
