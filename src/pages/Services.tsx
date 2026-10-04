import { useEffect } from "react";
import { motion, useReducedMotion } from "motion/react";
import { duration, ease } from "../lib/motion";
import { CharReveal } from "../components/CharReveal";
import ServicesBuild from "../components/services/ServicesBuild";
import Chapter from "../components/Chapter";
import KickoffCalendar from "../components/services/KickoffCalendar";
import NoList from "../components/services/NoList";
import ServicesCloser from "../components/services/ServicesCloser";
import { useDeclarePageEndTone } from "../lib/pageTone";
import { SERVICE_COUNT } from "../data/servicePillars";

/**
 * /services — "Watch us build your business".
 *
 * One continuous pinned scene: a generic GTA home-services business is
 * built as you scroll, and each of the sixteen services is the caption
 * of the step happening on screen. The story is the list — no service is
 * named twice on the page.
 *
 * Built across 17c-1 … 17c-4 on a hidden /services/next route and
 * swapped in here in 17c-5, replacing the flat service index.
 */
function BuildHero() {
  const reduce = useReducedMotion();

  return (
    <section
      style={{
        position: "relative",
        overflow: "hidden",
        backgroundColor: "var(--color-bg)",
        padding: "180px 40px 100px",
        textAlign: "center",
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
        style={{ position: "relative", zIndex: 2, maxWidth: 1000, margin: "0 auto" }}
      >
        <motion.div
          initial={{ opacity: 0, y: reduce ? 0 : 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: reduce ? 0.01 : 0.5,
            ease: ease.outQuart,
            delay: 0.2,
          }}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "var(--color-muted)",
            marginBottom: 40,
          }}
        >
          <span
            style={{ height: 1, width: 20, background: "currentColor", opacity: 0.6 }}
          />
          {`Services · ${SERVICE_COUNT} ways we help`}
          <span
            style={{ height: 1, width: 20, background: "currentColor", opacity: 0.6 }}
          />
        </motion.div>

        <h1
          className="type-display-l"
          style={{
            color: "var(--color-ink)",
            maxWidth: 900,
            margin: "0 auto 32px",
          }}
        >
          <CharReveal
            delay={0.3}
            segments={[
              { text: "Watch us build " },
              { text: "your", accent: true },
              { text: " business." },
            ]}
          />
        </h1>

        {/* LCP element on mobile — painted at first render, transform only */}
        <motion.p
          initial={{ opacity: 1, y: reduce ? 0 : 8 }}
          animate={{ y: 0 }}
          transition={{ duration: reduce ? 0 : duration.base, ease: ease.outQuart }}
          className="type-body-lg"
          style={{ color: "var(--color-muted)", maxWidth: 620, margin: "0 auto" }}
        >
          Websites, AI automation and growth marketing for small and mid-sized
          businesses across the GTA.
        </motion.p>
      </div>

      <BuildScrollCue reduce={reduce ?? false} />
    </section>
  );
}

/** The same cue the other page heroes use. */
function BuildScrollCue({ reduce }: { reduce: boolean }) {
  return (
    <motion.div
      aria-hidden
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: reduce ? 0 : duration.base, delay: reduce ? 0 : 1.6 }}
      style={{
        position: "absolute",
        left: "var(--gutter)",
        bottom: 28,
        display: "flex",
        alignItems: "center",
        gap: 12,
        pointerEvents: "none",
        zIndex: 2,
      }}
    >
      <span className="type-eyebrow" style={{ color: "var(--color-muted)" }}>
        SCROLL
      </span>
      <span
        style={{
          display: "block",
          width: 1,
          height: 40,
          overflow: "hidden",
          background: "rgba(20,20,18,0.12)",
        }}
      >
        <motion.span
          style={{
            display: "block",
            width: 1,
            height: "100%",
            background: "var(--color-ink)",
            transformOrigin: "top",
          }}
          initial={{ scaleY: 0 }}
          animate={reduce ? { scaleY: 1 } : { scaleY: [0, 1, 1, 0] }}
          transition={
            reduce
              ? { duration: 0 }
              : {
                  duration: 2.4,
                  times: [0, 0.4, 0.75, 1],
                  repeat: Infinity,
                  ease: ease.inOut,
                  delay: 1.6,
                }
          }
        />
      </span>
    </motion.div>
  );
}

export default function Services() {
  useEffect(function title() {
    const prev = document.title;
    document.title = "Services — Averr Studios";
    const desc = document.querySelector('meta[name="description"]');
    const prevDesc = desc ? desc.getAttribute("content") : null;
    if (desc) {
      desc.setAttribute(
        "content",
        "Websites, AI automation and growth marketing for small and mid-sized businesses across the GTA — sixteen services, shown as one build."
      );
    }
    return function restore() {
      document.title = prev;
      if (desc && prevDesc) desc.setAttribute("content", prevDesc);
    };
  }, []);

  useEffect(function scrollTopOnMount() {
    // a chapter anchor is handled inside ServicesBuild
    if (window.location.hash) return;
    window.scrollTo(0, 0);
  }, []);

  // The closer is dark, so the footer reveals over dark.
  useDeclarePageEndTone("dark");

  return (
    <>
      <BuildHero />
      <ServicesBuild />
      {/* The pin releases straight into these — no dead space. */}
      <Chapter tone="dark" from="cream">
        <NoList />
      </Chapter>
      <Chapter tone="cream-warm" from="dark">
        <KickoffCalendar />
      </Chapter>
      <Chapter tone="dark" from="cream-warm">
        <ServicesCloser />
      </Chapter>
    </>
  );
}
