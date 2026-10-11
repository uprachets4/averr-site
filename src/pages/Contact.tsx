import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { duration, ease } from "../lib/motion";
import MonogramMark from "../components/MonogramMark";
import PathCards from "../components/contact/PathCards";
import BookingSection from "../components/contact/BookingSection";
import BriefSection from "../components/contact/BriefSection";
import DirectRow from "../components/contact/DirectRow";
import { CharReveal, CharRevealInView } from "../components/CharReveal";
import Chapter from "../components/Chapter";
import { useDeclarePageEndTone } from "../lib/pageTone";

/* ═══════════════════════════════════════════════════════════════
   Band 1 — Editorial hero
   ═══════════════════════════════════════════════════════════════ */

function EditorialHero() {
  const reduce = useReducedMotion();
  return (
    <section
      style={{
        position: "relative",
        overflow: "hidden",
        backgroundColor: "var(--color-bg)",
        minHeight: "100vh",
        padding: "160px 40px 100px",
        display: "flex",
        alignItems: "center",
      }}
      className="contact-hero"
    >
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: "-15%",
          right: "-10%",
          width: "70vmin",
          height: "70vmin",
          background:
            "radial-gradient(circle at 50% 50%, rgba(232,225,208,0.5), transparent 65%)",
          pointerEvents: "none",
        }}
      />
      <motion.div
        aria-hidden
        style={{
          position: "absolute",
          top: "18%",
          left: "8%",
          width: 28,
          height: 28,
          borderRadius: "50%",
          border: "1px solid var(--color-ink)",
          opacity: 0.22,
          pointerEvents: "none",
        }}
        animate={reduce ? undefined : { x: [0, 18, 0, -14, 0], y: [0, -12, 10, 0, 0] }}
        transition={{ duration: 42, repeat: Infinity, ease: ease.inOut }}
      />
      <div
        className="grain-light"
        aria-hidden="true"
        style={{ opacity: 0.05 }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 2,
          maxWidth: 1100,
          margin: "0 auto",
          width: "100%",
        }}
      >
        <motion.div
          initial={{ opacity: 1, y: reduce ? 0 : 12 }}
          animate={{ y: 0 }}
          transition={{ duration: reduce ? 0 : duration.base, ease: ease.outQuart, delay: reduce ? 0 : 0.15 }}
          className="type-eyebrow"
          style={{ color: "var(--color-ink-soft)", marginBottom: 40 }}
        >
          Start here
        </motion.div>

        <CharReveal
          text="Let's build something that earns its place."
          paint
          delay={reduce ? 0 : 0.4}
          className="type-display-l"
          style={{
            color: "var(--color-ink)",
            display: "block",
            maxWidth: "24ch",
            marginBottom: 40,
          }}
        />

        {/* LCP element on mobile. Painted from the first frame. */}
        <motion.p
          initial={{ opacity: 1, y: reduce ? 0 : 12 }}
          animate={{ y: 0 }}
          transition={{
            duration: reduce ? 0 : duration.base,
            ease: ease.outQuart,
            delay: reduce ? 0 : 1.6,
          }}
          className="type-body-lg"
          style={{
            color: "var(--color-ink)",
            maxWidth: 640,
            margin: 0,
          }}
        >
          Every good client project has started here — a first message, a first
          reply, a first call. Reach out with a brand new site, a redesign, or
          something we haven't figured out yet.
        </motion.p>

        <PathCards />

        <motion.div
          initial={{ opacity: reduce ? 1 : 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: reduce ? 0 : 0.6, delay: reduce ? 0 : 2.4 }}
          style={{
            position: "absolute",
            bottom: -40,
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
            pointerEvents: "none",
          }}
        >
          <div
            className="type-eyebrow"
            style={{ color: "var(--color-ink-soft)" }}
          >
            Scroll for the form ↓
          </div>
          <motion.div
            animate={reduce ? undefined : { y: [0, 4, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: ease.inOut }}
            style={{ width: 1, height: 20, background: "var(--color-ink-soft)" }}
          />
        </motion.div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .contact-hero { min-height: 90vh; padding: 128px 24px 100px; }
        }
      `}</style>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Band 2 — The 24-hour promise (dark)
   ═══════════════════════════════════════════════════════════════ */

function PromiseBand() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement | null>(null);
  const inView = useInView(ref, { margin: "-20% 0px", once: true });

  return (
    <section
      ref={ref}
      style={{
        position: "relative",
        overflow: "hidden",
        backgroundColor: "var(--color-dark)",
        color: "var(--color-parch)",
        minHeight: "100vh",
        padding: "160px 40px",
        display: "flex",
        alignItems: "center",
      }}
      className="promise-band"
    >
      <div className="grain-dark" aria-hidden style={{ opacity: 0.55 }} />

      {/* Warm ember drift */}
      <motion.div
        aria-hidden
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: "80vmin",
          height: "80vmin",
          marginTop: "-40vmin",
          marginLeft: "-40vmin",
          background:
            "radial-gradient(circle at 50% 50%, rgba(237,233,226,0.12), transparent 60%)",
          pointerEvents: "none",
        }}
        animate={
          reduce
            ? undefined
            : { x: [-24, 24, -24], y: [-16, 16, -16] }
        }
        transition={{ duration: 60, repeat: Infinity, ease: ease.inOut }}
      />

      {/* Clock tick indicator */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          bottom: 32,
          right: 32,
          display: "flex",
          alignItems: "center",
          gap: 8,
          color: "var(--color-parch)",
          opacity: 0.5,
        }}
      >
        <motion.span
          animate={reduce ? undefined : { opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1, repeat: Infinity, ease: ease.inOut }}
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: "var(--color-parch)",
            display: "inline-block",
          }}
        />
        <span
          className="type-eyebrow"
          style={{ color: "var(--color-parch)", opacity: 0.7 }}
        >
          Live
        </span>
      </div>

      <div style={{ position: "relative", zIndex: 2, maxWidth: 1100, margin: "0 auto", width: "100%" }}>
        <motion.div
          initial={{ opacity: reduce ? 1 : 0, y: reduce ? 0 : 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15% 0px" }}
          transition={{ duration: reduce ? 0 : 0.5, ease: ease.outQuart }}
          className="type-eyebrow"
          style={{ color: "var(--color-parch)", opacity: 0.7, marginBottom: 32 }}
        >
          The promise
        </motion.div>

        <h2
          className="type-display-xl"
          style={{
            color: "var(--color-parch)",
            margin: 0,
            marginBottom: 40,
            maxWidth: "18ch",
          }}
        >
          <HourCountUp inView={inView} reduce={!!reduce} />{" "}
          <CharRevealInView
            text="hours. Every message."
            style={{ color: "var(--color-parch)" }}
          />
        </h2>

        <motion.p
          initial={{ opacity: reduce ? 1 : 0, y: reduce ? 0 : 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15% 0px" }}
          transition={{ duration: reduce ? 0 : 0.6, ease: ease.outQuart, delay: reduce ? 0 : 1.4 }}
          className="type-body-lg"
          style={{
            color: "var(--color-muted-l)",
            maxWidth: 720,
            marginBottom: 32,
          }}
        >
          Not a bot. Not a form-fill queue. A real reply from Prachets — usually
          with a follow-up question or two, sometimes with a rough proposal. If
          more than 24 hours pass, assume something went wrong and email direct.
        </motion.p>

        <motion.div
          initial={{ opacity: reduce ? 1 : 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-15% 0px" }}
          transition={{ duration: reduce ? 0 : 0.5, delay: reduce ? 0 : 1.8 }}
          className="type-eyebrow"
          style={{ color: "var(--color-parch)", opacity: 0.7 }}
        >
          Currently answering: same-day, Toronto time.
        </motion.div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .promise-band { min-height: 90vh; padding: 128px 24px; }
        }
      `}</style>
    </section>
  );
}

function HourCountUp({ inView, reduce }: { inView: boolean; reduce: boolean }) {
  const [n, setN] = useState(reduce ? 24 : 0);
  useEffect(
    function count() {
      if (reduce) {
        setN(24);
        return;
      }
      if (!inView) return;
      const start = performance.now();
      const dur = 1400;
      let raf = 0;
      function tick(t: number) {
        const p = Math.min(1, (t - start) / dur);
        const eased = 1 - Math.pow(1 - p, 4); // outQuart-ish
        setN(Math.round(eased * 24));
        if (p < 1) raf = requestAnimationFrame(tick);
      }
      raf = requestAnimationFrame(tick);
      return function cleanup() {
        cancelAnimationFrame(raf);
      };
    },
    [inView, reduce]
  );
  return (
    <span
      style={{
        display: "inline-block",
        fontVariantNumeric: "tabular-nums",
        color: "var(--color-parch)",
      }}
    >
      {n}
    </span>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Band 3 — What helps us reply well (4 cards, distinct numeral choreo)
   ═══════════════════════════════════════════════════════════════ */

/* ═══════════════════════════════════════════════════════════════
   Band 4 — The designed form
   ═══════════════════════════════════════════════════════════════ */

/* ═══════════════════════════════════════════════════════════════
   Band 5 — Or reach directly (3 cards)
   ═══════════════════════════════════════════════════════════════ */

/* ═══════════════════════════════════════════════════════════════
   Band 6 — Book a call (Cal.com)
   ═══════════════════════════════════════════════════════════════ */

/* ═══════════════════════════════════════════════════════════════
   Band 7 — Closing warmth (dark)
   ═══════════════════════════════════════════════════════════════ */

function ClosingBand() {
  const reduce = useReducedMotion();

  return (
    <section
      style={{
        position: "relative",
        overflow: "hidden",
        backgroundColor: "var(--color-dark)",
        color: "var(--color-parch)",
        minHeight: "100vh",
        padding: "160px 40px",
        display: "flex",
        alignItems: "center",
      }}
      className="closing-band"
    >
      <div className="grain-dark" aria-hidden style={{ opacity: 0.55 }} />

      <motion.div
        aria-hidden
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: "80vmin",
          height: "80vmin",
          marginTop: "-40vmin",
          marginLeft: "-40vmin",
          background:
            "radial-gradient(circle at 50% 50%, rgba(237,233,226,0.14), transparent 60%)",
          pointerEvents: "none",
        }}
        animate={reduce ? undefined : { x: [-24, 24, -24], y: [-16, 16, -16] }}
        transition={{ duration: 60, repeat: Infinity, ease: ease.inOut }}
      />

      <div style={{ position: "relative", zIndex: 2, maxWidth: 1100, margin: "0 auto", width: "100%" }}>
        <motion.div
          initial={{ opacity: reduce ? 1 : 0, y: reduce ? 0 : 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15% 0px" }}
          transition={{ duration: reduce ? 0 : 0.5, ease: ease.outQuart }}
          className="type-eyebrow"
          style={{ color: "var(--color-parch)", opacity: 0.7, marginBottom: 32 }}
        >
          Looking forward
        </motion.div>

        <div
          className="type-display-xl"
          style={{ color: "var(--color-parch)", marginBottom: 32 }}
        >
          <CharRevealInView
            text="Talk soon."
            style={{ color: "var(--color-parch)" }}
          />
        </div>

        <motion.div
          initial={{ opacity: reduce ? 1 : 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-15% 0px" }}
          transition={{ duration: reduce ? 0 : 0.5, delay: reduce ? 0 : 1.2 }}
          className="type-eyebrow"
          style={{ color: "var(--color-parch)", opacity: 0.7 }}
        >
          — Prachets Upadhyay, Founder, Averr Studios
        </motion.div>
      </div>

      {/* PU mark — bottom-right, cream-tinted via container color */}
      <motion.div
        aria-hidden
        initial={{
          opacity: reduce ? 1 : 0,
          clipPath: reduce ? "inset(0%)" : "inset(100% 0 0 0)",
        }}
        whileInView={{ opacity: 1, clipPath: "inset(0%)" }}
        viewport={{ once: true, margin: "-10% 0px" }}
        transition={{ duration: reduce ? 0 : 1.4, ease: ease.outQuart }}
        className="closing-mark"
        style={{
          position: "absolute",
          bottom: 40,
          right: 40,
          width: 120,
          color: "var(--color-parch)",
          zIndex: 3,
        }}
      >
        <MonogramMark variant="signature" />
      </motion.div>

      <style>{`
        .closing-mark { color: var(--color-parch); }
        .closing-mark > div { color: inherit; }
        @media (max-width: 900px) {
          .closing-band { min-height: 90vh; padding: 128px 24px; }
          .closing-mark { width: 100px !important; bottom: 24px !important; right: 24px !important; }
        }
      `}</style>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Page
   ═══════════════════════════════════════════════════════════════ */

export default function Contact() {
  // The closing band is dark, so the footer reveals over dark on this route.
  useDeclarePageEndTone("dark");

  useEffect(function scrollTopAndTitle() {
    window.scrollTo(0, 0);
    const prev = document.title;
    document.title = "Contact — Averr Studios";
    return function restore() {
      document.title = prev;
    };
  }, []);

  return (
    <>
      {/* the hero now carries the two paths */}
      <EditorialHero />

      {/* "24 hours. Every message." — kept verbatim, now the statement
          between choosing a path and taking one */}
      <Chapter tone="dark" from="cream">
        <PromiseBand />
      </Chapter>

      <Chapter tone="cream" from="dark">
        <section id="book" className="ct-band" aria-labelledby="book-h">
          <div className="ct-head">
            <span className="type-eyebrow ct-eyebrow">Skip the back and forth</span>
            <h2 id="book-h" className="type-display-l ct-h">Book a 30-minute intro call.</h2>
            <p className="ct-sub">
              No sales script. We'll ask what you're building and figure out if
              we're the right fit — same call.
            </p>
          </div>
          <BookingSection />
        </section>
      </Chapter>

      <section id="brief" className="ct-band ct-band--alt" aria-labelledby="brief-h">
        <div className="ct-head">
          <span className="type-eyebrow ct-eyebrow">The brief</span>
          <h2 id="brief-h" className="type-display-l ct-h">Tell us what you're building.</h2>
          <p className="ct-sub">Two minutes. No captcha. We read every one.</p>
        </div>
        <BriefSection />
      </section>

      <section className="ct-band" aria-labelledby="direct-h">
        <div className="ct-head">
          <span className="type-eyebrow ct-eyebrow">Or reach directly</span>
          <h2 id="direct-h" className="type-display-l ct-h">The other three ways.</h2>
        </div>
        <DirectRow />
      </section>

      <Chapter tone="dark" from="cream">
        <ClosingBand />
      </Chapter>

      <style>{`
        .ct-band {
          position: relative;
          background: var(--color-bg);
          padding: clamp(96px, 12vh, 150px) 0;
        }
        .ct-band--alt { background: var(--color-bg-alt); }
        .ct-head {
          max-width: var(--container-wide); margin: 0 auto;
          padding-bottom: clamp(32px, 5vh, 56px);
        }
        .ct-eyebrow { color: var(--color-muted); display: block; margin-bottom: 18px; }
        .ct-h { color: var(--color-ink); margin: 0; max-width: 20ch; }
        .ct-sub {
          margin: 18px 0 0; font-size: 16px; line-height: 1.6;
          color: var(--color-muted); max-width: 52ch;
        }
      `}</style>
    </>
  );
}
