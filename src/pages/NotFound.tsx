import { useEffect } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ease } from "../lib/motion";
import MagneticCTA from "../components/MagneticCTA";
import PillHl from "../components/PillHl";


const EMAIL_ADDR = "prachets@averrstudios.com";

const LINKS = [
  { label: "//_home", to: "/", text: "Averr Studios — front door" },
  { label: "//_work", to: "/work", text: "The work we've shipped" },
  { label: "//_contact", to: "/contact", text: "Book a call or send a note" },
];

export default function NotFound() {
  const reduce = useReducedMotion();

  useEffect(function updateTitle() {
    const prev = document.title;
    document.title = "404 — Averr Studios";
    return function restore() {
      document.title = prev;
    };
  }, []);

  return (
    <section
      style={{
        position: "relative",
        overflow: "hidden",
        backgroundColor: "var(--color-bg)",
        minHeight: "100vh",
        padding: "160px 40px 80px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 1400px 900px at 30% 30%, rgba(245,245,247,0.03), transparent 60%), radial-gradient(ellipse 1000px 700px at 80% 70%, rgba(245,245,247,0.03), transparent 60%)",
          pointerEvents: "none",
        }}
      />
      <div className="grain-light" aria-hidden="true" />

      <div
        style={{
          position: "relative",
          zIndex: 2,
          maxWidth: 1000,
          margin: "0 auto",
          width: "100%",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: reduce ? 0 : 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduce ? 0.01 : 0.5, ease: ease.outQuart, delay: 0.1 }}
          className="type-eyebrow"
          style={{
            color: "var(--color-muted)",
            marginBottom: 32,
          }}
        >
          //_404 · wrong door
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: reduce ? 0 : 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduce ? 0.01 : 0.7, ease: ease.outQuart, delay: 0.3 }}
          className="type-display-l"
          style={{
            color: "var(--color-ink)",
            marginBottom: 32,
            maxWidth: 900,
          }}
        >
          You've hit a page that{" "}
          <motion.span
            initial={{ opacity: 0, scale: reduce ? 1 : 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: reduce ? 0.01 : 0.5, ease: ease.bounce, delay: 0.9 }}
            style={{ display: "inline-block" }}
          >
            <PillHl>doesn't exist</PillHl>
          </motion.span>.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: reduce ? 0 : 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduce ? 0.01 : 0.6, ease: ease.outQuart, delay: 1.2 }}
          style={{
            fontSize: 19,
            lineHeight: 1.6,
            color: "var(--color-muted)",
            maxWidth: 640,
            marginBottom: 64,
          }}
        >
          Might be a mistyped URL. Might be a link that went stale. Either way,
          easiest path back is one of these:
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: reduce ? 0 : 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduce ? 0.01 : 0.6, ease: ease.outQuart, delay: 1.5 }}
          className="recovery-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 32,
            paddingTop: 32,
            paddingBottom: 40,
            borderTop: "1px solid rgba(245,245,247,0.10)",
            borderBottom: "1px solid rgba(245,245,247,0.10)",
          }}
        >
          {LINKS.map((link) => (
            <div key={link.to}>
              <div
                className="type-eyebrow"
                style={{
                  color: "var(--color-muted-2)",
                  marginBottom: 12,
                }}
              >
                {link.label}
              </div>
              <MagneticCTA to={link.to} variant="text" size="md" icon={null}>
                {link.text}
              </MagneticCTA>
            </div>
          ))}
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: reduce ? 0 : 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduce ? 0.01 : 0.6, ease: ease.outQuart, delay: 1.8 }}
          style={{
            marginTop: 32,
            fontSize: 14,
            lineHeight: 1.6,
            color: "var(--color-muted-2)",
            maxWidth: 720,
          }}
        >
          If a specific page sent you here that shouldn't have — email{" "}
          <a
            href={`mailto:${EMAIL_ADDR}`}
            style={{
              color: "var(--color-muted)",
              textDecoration: "underline",
              textUnderlineOffset: 3,
            }}
          >
            {EMAIL_ADDR}
          </a>{" "}
          and I'll fix the link.
        </motion.p>
      </div>

      <style>{`
        .recovery-link {
          position: relative;
          display: inline-block;
          font-family: var(--font-display);
          font-weight: 500;
          font-size: 18px;
          letter-spacing: -0.015em;
          color: var(--color-ink);
          text-decoration: none;
          line-height: 1.35;
        }
        .recovery-link::after {
          content: '';
          position: absolute;
          left: 0;
          right: 0;
          bottom: -4px;
          height: 1px;
          background: currentColor;
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.4s cubic-bezier(0.25, 0.1, 0.25, 1);
        }
        .recovery-link:hover::after,
        .recovery-link:focus-visible::after {
          transform: scaleX(1);
        }
        @media (max-width: 720px) {
          .recovery-grid {
            grid-template-columns: 1fr !important;
            gap: 24px !important;
          }
        }
      `}</style>
    </section>
  );
}

