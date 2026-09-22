import { Fragment, useEffect, useRef, useState } from "react";
import {
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import Cal, { getCalApi } from "@calcom/embed-react";
import { ease } from "../lib/motion";
import MagneticCTA from "../components/MagneticCTA";
import MonogramMark from "../components/MonogramMark";
import ContactForm from "../components/ContactForm";

const EMAIL_ADDR = "prachets@averrstudios.com";
const CAL_LINK = "prachets/discoverycall";
const CAL_FULL_URL = `https://cal.com/${CAL_LINK}`;
const LINKEDIN_URL = "https://www.linkedin.com/in/prachetsupadhyay";
const LINKEDIN_LABEL = "linkedin.com/in/prachetsupadhyay";
const INSTAGRAM_URL = "https://instagram.com/averrstudios";
const INSTAGRAM_LABEL = "@averrstudios";

/* ═══════════════════════════════════════════════════════════════
   Word-preserving character reveal helper (shared shape with /about)
   ═══════════════════════════════════════════════════════════════ */

const REVEAL_STAGGER = 0.02;
const REVEAL_PER_CHAR_DURATION = 0.35;

function splitForReveal(text: string): string[][] {
  return text.split(" ").map(function toChars(w) {
    return Array.from(w);
  });
}

function CharReveal({
  text,
  delay = 0,
  className,
  style,
}: {
  text: string;
  delay?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  const reduce = useReducedMotion();
  const words = splitForReveal(text);
  let gi = -1;
  return (
    <span className={className} style={style}>
      {words.map(function drawWord(chars, wi) {
        return (
          <Fragment key={wi}>
            <span style={{ display: "inline-block", whiteSpace: "nowrap" }}>
              {chars.map(function drawChar(ch, ci) {
                gi++;
                const idx = gi;
                return (
                  <motion.span
                    key={ci}
                    initial={{
                      opacity: reduce ? 1 : 0,
                      y: reduce ? 0 : 20,
                    }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: reduce ? 0 : REVEAL_PER_CHAR_DURATION,
                      ease: ease.outQuart,
                      delay: reduce ? 0 : delay + idx * REVEAL_STAGGER,
                    }}
                    style={{ display: "inline-block" }}
                  >
                    {ch}
                  </motion.span>
                );
              })}
            </span>
            {wi < words.length - 1 ? " " : null}
          </Fragment>
        );
      })}
    </span>
  );
}

function CharRevealInView({
  text,
  className,
  style,
}: {
  text: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  const reduce = useReducedMotion();
  const words = splitForReveal(text);
  let gi = -1;
  return (
    <span className={className} style={style}>
      {words.map(function drawWord(chars, wi) {
        return (
          <Fragment key={wi}>
            <span style={{ display: "inline-block", whiteSpace: "nowrap" }}>
              {chars.map(function drawChar(ch, ci) {
                gi++;
                const idx = gi;
                return (
                  <motion.span
                    key={ci}
                    initial={{
                      opacity: reduce ? 1 : 0,
                      y: reduce ? 0 : 20,
                    }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-15% 0px" }}
                    transition={{
                      duration: reduce ? 0 : REVEAL_PER_CHAR_DURATION,
                      ease: ease.outQuart,
                      delay: reduce ? 0 : idx * REVEAL_STAGGER,
                    }}
                    style={{ display: "inline-block" }}
                  >
                    {ch}
                  </motion.span>
                );
              })}
            </span>
            {wi < words.length - 1 ? " " : null}
          </Fragment>
        );
      })}
    </span>
  );
}

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
          initial={{ opacity: reduce ? 1 : 0, y: reduce ? 0 : 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduce ? 0 : 0.5, ease: ease.outQuart, delay: reduce ? 0 : 0.15 }}
          className="type-eyebrow"
          style={{ color: "var(--color-ink-soft)", marginBottom: 40 }}
        >
          Start here
        </motion.div>

        <CharReveal
          text="Let's build something that earns its place."
          delay={0.4}
          className="type-display-l"
          style={{
            color: "var(--color-ink)",
            display: "block",
            maxWidth: "24ch",
            marginBottom: 40,
          }}
        />

        <motion.p
          initial={{ opacity: reduce ? 1 : 0, y: reduce ? 0 : 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: reduce ? 0 : 0.6,
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

type Helper = {
  n: string;
  title: string;
  body: string;
  variant: "stroke-fill" | "scale-up" | "skew-straighten" | "slow-rotate";
};

const HELPERS: Helper[] = [
  {
    n: "01",
    title: "What you're building.",
    body: "A sentence. A paragraph. A rough sketch. Anywhere in that range works.",
    variant: "stroke-fill",
  },
  {
    n: "02",
    title: "Rough timeline.",
    body: "Soft launch. Hard deadline. “Figuring it out.” Any of these tells us how to prioritize.",
    variant: "scale-up",
  },
  {
    n: "03",
    title: "Budget shape.",
    body: "A range, not an exact number. Helps us match scope to what's realistic — and tell you honestly if we're not the right fit.",
    variant: "skew-straighten",
  },
  {
    n: "04",
    title: "Links to anything.",
    body: "Inspiration, your current site, a notes doc, a Figma. Anything visual saves us 20 questions.",
    variant: "slow-rotate",
  },
];

function HelpersBand() {
  const reduce = useReducedMotion();
  return (
    <section
      style={{
        position: "relative",
        backgroundColor: "var(--color-bg-alt)",
        minHeight: "100vh",
        padding: "160px 40px",
        display: "flex",
        alignItems: "center",
      }}
      className="helpers-band"
    >
      <div className="grain-light" aria-hidden style={{ opacity: 0.04 }} />
      <div style={{ position: "relative", zIndex: 2, maxWidth: 1200, margin: "0 auto", width: "100%" }}>
        <motion.div
          initial={{ opacity: reduce ? 1 : 0, y: reduce ? 0 : 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15% 0px" }}
          transition={{ duration: reduce ? 0 : 0.5, ease: ease.outQuart }}
          className="type-eyebrow"
          style={{ color: "var(--color-ink-soft)", marginBottom: 32 }}
        >
          Helps us help you
        </motion.div>

        <div
          className="type-display-l"
          style={{ color: "var(--color-ink)", marginBottom: 24, maxWidth: "24ch" }}
        >
          <CharRevealInView
            text="A few things that speed up the first reply."
            style={{ color: "var(--color-ink)" }}
          />
        </div>

        <motion.p
          initial={{ opacity: reduce ? 1 : 0, y: reduce ? 0 : 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15% 0px" }}
          transition={{ duration: reduce ? 0 : 0.6, ease: ease.outQuart, delay: reduce ? 0 : 1.4 }}
          className="type-body-lg"
          style={{ color: "var(--color-ink)", maxWidth: 640, marginBottom: 80 }}
        >
          You don't need to have all of these figured out. Whatever you can
          share, share.
        </motion.p>

        <div
          className="helpers-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 20,
          }}
        >
          {HELPERS.map(function drawCard(h, i) {
            return <HelperCard key={h.n} helper={h} index={i} />;
          })}
        </div>
      </div>
      <style>{`
        @media (max-width: 900px) {
          .helpers-band { min-height: 90vh; padding: 128px 24px; }
          .helpers-grid { grid-template-columns: 1fr !important; gap: 16px !important; }
        }
      `}</style>
    </section>
  );
}

function HelperCard({ helper, index }: { helper: Helper; index: number }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: reduce ? 1 : 0, y: reduce ? 0 : 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{
        duration: reduce ? 0 : 0.6,
        ease: ease.outQuart,
        delay: reduce ? 0 : index * 0.12,
      }}
      style={{
        position: "relative",
        background: "var(--color-bg)",
        border: "1px solid rgba(20,20,18,0.08)",
        borderRadius: 12,
        padding: "32px 28px",
        overflow: "hidden",
        minHeight: 240,
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
      }}
    >
      <HelperNumeral
        helper={helper}
        scrollYProgress={scrollYProgress}
        reduce={!!reduce}
      />
      <div style={{ position: "relative", zIndex: 2 }}>
        <div
          className="type-eyebrow"
          style={{ color: "var(--color-ink-soft)", marginBottom: 12 }}
        >
          {helper.n}
        </div>
        <h3
          className="type-h3"
          style={{ color: "var(--color-ink)", marginBottom: 12 }}
        >
          {helper.title}
        </h3>
        <p
          className="type-body"
          style={{ color: "var(--color-ink)", margin: 0 }}
        >
          {helper.body}
        </p>
      </div>
    </motion.div>
  );
}

function HelperNumeral({
  helper,
  scrollYProgress,
  reduce,
}: {
  helper: Helper;
  scrollYProgress: MotionValue<number>;
  reduce: boolean;
}) {
  const strokeFillOpacity = useTransform(scrollYProgress, [0.4, 0.7], [0, 0.18]);
  const strokeOnlyOpacity = useTransform(
    scrollYProgress,
    [0.2, 0.4, 0.7],
    [0, 0.35, 0]
  );
  const scale = useTransform(scrollYProgress, [0.15, 0.55], [0.6, 1]);
  const skew = useTransform(scrollYProgress, [0.2, 0.8], [8, 0]);
  const skewTransform = useTransform(skew, function map(v) {
    return `skewY(${v}deg)`;
  });

  const base: React.CSSProperties = {
    position: "absolute",
    top: 12,
    right: 20,
    fontFamily: "var(--font-display), Georgia, serif",
    fontSize: 120,
    fontWeight: 700,
    lineHeight: 1,
    color: "var(--color-ink)",
    pointerEvents: "none",
    zIndex: 1,
    userSelect: "none",
  };

  switch (helper.variant) {
    case "stroke-fill":
      return (
        <svg
          viewBox="0 0 200 140"
          aria-hidden
          style={{
            position: "absolute",
            top: 12,
            right: 20,
            width: 140,
            height: 100,
            overflow: "visible",
          }}
        >
          <motion.text
            x="100"
            y="120"
            textAnchor="middle"
            fontFamily="var(--font-display), Georgia, serif"
            fontSize={140}
            fontWeight={700}
            fill="var(--color-ink)"
            style={{ opacity: reduce ? 0.18 : strokeFillOpacity }}
          >
            {helper.n}
          </motion.text>
          <motion.text
            x="100"
            y="120"
            textAnchor="middle"
            fontFamily="var(--font-display), Georgia, serif"
            fontSize={140}
            fontWeight={700}
            fill="transparent"
            stroke="var(--color-ink)"
            strokeWidth={1.5}
            style={{ opacity: reduce ? 0 : strokeOnlyOpacity }}
          >
            {helper.n}
          </motion.text>
        </svg>
      );
    case "scale-up":
      return (
        <motion.div
          aria-hidden
          style={{
            ...base,
            opacity: 0.18,
            scale: reduce ? 1 : scale,
            transformOrigin: "top right",
          }}
        >
          {helper.n}
        </motion.div>
      );
    case "skew-straighten":
      return (
        <motion.div
          aria-hidden
          style={{
            ...base,
            opacity: 0.18,
            transform: reduce ? "none" : (skewTransform as unknown as string),
          }}
        >
          {helper.n}
        </motion.div>
      );
    case "slow-rotate":
      return (
        <motion.div
          aria-hidden
          animate={reduce ? undefined : { rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          style={{ ...base, opacity: 0.18 }}
        >
          {helper.n}
        </motion.div>
      );
  }
}

/* ═══════════════════════════════════════════════════════════════
   Band 4 — The designed form
   ═══════════════════════════════════════════════════════════════ */

function FormBand() {
  const reduce = useReducedMotion();
  return (
    <section
      style={{
        position: "relative",
        backgroundColor: "var(--color-bg-alt)",
        borderTop: "1px solid rgba(20,20,18,0.08)",
        minHeight: "100vh",
        padding: "160px 40px",
      }}
      className="form-band"
    >
      <div className="grain-light" aria-hidden style={{ opacity: 0.04 }} />
      <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative", zIndex: 2 }}>
        <div
          className="form-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "0.9fr 1.1fr",
            gap: 80,
            alignItems: "start",
          }}
        >
          <div>
            <motion.div
              initial={{ opacity: reduce ? 1 : 0, y: reduce ? 0 : 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-15% 0px" }}
              transition={{ duration: reduce ? 0 : 0.5, ease: ease.outQuart }}
              className="type-eyebrow"
              style={{ color: "var(--color-ink-soft)", marginBottom: 32 }}
            >
              The form
            </motion.div>

            <div
              className="type-display-l"
              style={{ color: "var(--color-ink)", marginBottom: 32, maxWidth: "16ch" }}
            >
              <CharRevealInView
                text="Tell us what you're building."
                style={{ color: "var(--color-ink)" }}
              />
            </div>

            <motion.p
              initial={{ opacity: reduce ? 1 : 0, y: reduce ? 0 : 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-15% 0px" }}
              transition={{ duration: reduce ? 0 : 0.6, ease: ease.outQuart, delay: reduce ? 0 : 1.2 }}
              className="type-body-lg"
              style={{ color: "var(--color-ink)", marginBottom: 40 }}
            >
              Two minutes. No captcha. We read every one.
            </motion.p>

            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                "We never share your email",
                "We never send marketing",
                "We only reply to what you actually ask",
              ].map(function draw(text, i) {
                return (
                  <motion.li
                    key={text}
                    initial={{ opacity: reduce ? 1 : 0, x: reduce ? 0 : -8 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-10% 0px" }}
                    transition={{
                      duration: reduce ? 0 : 0.5,
                      ease: ease.outQuart,
                      delay: reduce ? 0 : 1.5 + i * 0.08,
                    }}
                    className="type-small"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      color: "var(--color-ink-soft)",
                    }}
                  >
                    <CheckGlyph />
                    {text}
                  </motion.li>
                );
              })}
            </ul>
          </div>

          <div>
            <ContactForm />
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .form-band { min-height: 90vh; padding: 128px 24px; }
          .form-grid { grid-template-columns: 1fr !important; gap: 48px !important; }
        }
      `}</style>
    </section>
  );
}

function CheckGlyph() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden
      style={{ flexShrink: 0 }}
    >
      <path
        d="M3 8.5 L6.5 12 L13 4.5"
        stroke="var(--color-ink)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Band 5 — Or reach directly (3 cards)
   ═══════════════════════════════════════════════════════════════ */

type DirectCard = {
  key: string;
  label: string;
  detail: string;
  glyph: "email" | "linkedin" | "instagram";
  action: () => void;
};

function DirectBand() {
  const reduce = useReducedMotion();
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const cards: DirectCard[] = [
    {
      key: "email",
      label: "Email",
      detail: EMAIL_ADDR,
      glyph: "email",
      action: function copy() {
        void navigator.clipboard?.writeText(EMAIL_ADDR).catch(function fallback() {
          window.location.href = `mailto:${EMAIL_ADDR}`;
        });
      },
    },
    {
      key: "linkedin",
      label: "LinkedIn",
      detail: LINKEDIN_LABEL,
      glyph: "linkedin",
      action: function openTab() {
        window.open(LINKEDIN_URL, "_blank", "noopener,noreferrer");
      },
    },
    {
      key: "instagram",
      label: "Instagram",
      detail: INSTAGRAM_LABEL,
      glyph: "instagram",
      action: function openTab() {
        window.open(INSTAGRAM_URL, "_blank", "noopener,noreferrer");
      },
    },
  ];

  return (
    <section
      style={{
        position: "relative",
        backgroundColor: "var(--color-bg)",
        minHeight: "100vh",
        padding: "160px 40px",
        display: "flex",
        alignItems: "center",
        borderTop: "1px solid rgba(20,20,18,0.08)",
      }}
      className="direct-band"
    >
      <div className="grain-light" aria-hidden style={{ opacity: 0.04 }} />
      <div style={{ maxWidth: 1200, margin: "0 auto", width: "100%", position: "relative", zIndex: 2 }}>
        <motion.div
          initial={{ opacity: reduce ? 1 : 0, y: reduce ? 0 : 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15% 0px" }}
          transition={{ duration: reduce ? 0 : 0.5, ease: ease.outQuart }}
          className="type-eyebrow"
          style={{ color: "var(--color-ink-soft)", marginBottom: 32 }}
        >
          Or reach directly
        </motion.div>

        <div
          className="type-display-l"
          style={{ color: "var(--color-ink)", marginBottom: 64, maxWidth: "16ch" }}
        >
          <CharRevealInView
            text="The other three ways."
            style={{ color: "var(--color-ink)" }}
          />
        </div>

        <div
          className="direct-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 20,
          }}
        >
          {cards.map(function drawCard(c, i) {
            return (
              <DirectCardTile
                key={c.key}
                card={c}
                index={i}
                showCopied={copiedIdx === i}
                onClick={function h() {
                  c.action();
                  if (c.glyph === "email") {
                    setCopiedIdx(i);
                    window.setTimeout(function clear() {
                      setCopiedIdx(null);
                    }, 1500);
                  }
                }}
              />
            );
          })}
        </div>
      </div>
      <style>{`
        @media (max-width: 900px) {
          .direct-band { min-height: 90vh; padding: 128px 24px; }
          .direct-grid { grid-template-columns: 1fr !important; gap: 16px !important; }
        }
      `}</style>
    </section>
  );
}

function DirectCardTile({
  card,
  index,
  showCopied,
  onClick,
}: {
  card: DirectCard;
  index: number;
  showCopied: boolean;
  onClick: () => void;
}) {
  const reduce = useReducedMotion();
  const [hovered, setHovered] = useState(false);
  return (
    <motion.button
      type="button"
      onClick={onClick}
      onMouseEnter={function h() {
        setHovered(true);
      }}
      onMouseLeave={function h() {
        setHovered(false);
      }}
      initial={{ opacity: reduce ? 1 : 0, y: reduce ? 0 : 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{
        duration: reduce ? 0 : 0.6,
        ease: ease.outQuart,
        delay: reduce ? 0 : index * 0.1,
      }}
      style={{
        appearance: "none",
        textAlign: "left",
        background: "var(--color-bg-alt)",
        border: "1px solid rgba(20,20,18,0.10)",
        borderRadius: 12,
        padding: "32px 28px",
        display: "flex",
        flexDirection: "column",
        gap: 20,
        cursor: "pointer",
        color: "var(--color-ink)",
        transform: hovered && !reduce ? "translateY(-4px)" : "translateY(0)",
        boxShadow: hovered
          ? "0 12px 32px rgba(20,20,18,0.10)"
          : "0 0 0 rgba(20,20,18,0)",
        transition: `transform 300ms cubic-bezier(${ease.outQuart.join(",")}), box-shadow 300ms cubic-bezier(${ease.outQuart.join(",")})`,
        position: "relative",
      }}
    >
      <DirectGlyph type={card.glyph} />
      <div
        className="type-eyebrow"
        style={{ color: "var(--color-ink-soft)" }}
      >
        {card.label}
      </div>
      <div
        className="type-h3"
        style={{ color: "var(--color-ink)", wordBreak: "break-all" }}
      >
        {card.detail}
      </div>
      {showCopied ? (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="type-small"
          style={{
            position: "absolute",
            top: 12,
            right: 12,
            background: "var(--color-ink)",
            color: "var(--color-parch)",
            padding: "4px 10px",
            borderRadius: 999,
          }}
        >
          Copied ✓
        </motion.div>
      ) : null}
    </motion.button>
  );
}

function DirectGlyph({ type }: { type: DirectCard["glyph"] }) {
  const common = {
    width: 32,
    height: 32,
    viewBox: "0 0 32 32",
    fill: "none",
    stroke: "var(--color-ink)",
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  if (type === "email") {
    return (
      <svg {...common}>
        <rect x="4" y="7" width="24" height="18" rx="2" />
        <path d="M4 9 L16 18 L28 9" />
      </svg>
    );
  }
  if (type === "linkedin") {
    return (
      <svg {...common}>
        <rect x="4" y="4" width="24" height="24" rx="4" />
        <circle cx="10.5" cy="11" r="1.5" fill="var(--color-ink)" stroke="none" />
        <line x1="10.5" y1="14" x2="10.5" y2="23" />
        <path d="M15.5 14 L15.5 23 M15.5 17 C15.5 15 17.5 14 19 14 C21 14 22 15.5 22 18 L22 23" />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <rect x="6" y="4" width="20" height="24" rx="4" />
      <circle cx="16" cy="17" r="5" />
      <circle cx="22" cy="10" r="1" fill="var(--color-ink)" stroke="none" />
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Band 6 — Book a call (Cal.com)
   ═══════════════════════════════════════════════════════════════ */

function BookingBand() {
  const reduce = useReducedMotion();
  const [calReady, setCalReady] = useState(false);

  useEffect(function initCal() {
    let cancelled = false;
    (async function boot() {
      try {
        const cal = await getCalApi({});
        if (cancelled) return;
        cal("ui", {
          hideEventTypeDetails: false,
          theme: "light",
        });
        setCalReady(true);
      } catch (err) {
        if (typeof console !== "undefined") {
          console.warn("Cal.com not embedded — using external link fallback", err);
        }
      }
    })();
    return function cleanup() {
      cancelled = true;
    };
  }, []);

  return (
    <section
      style={{
        position: "relative",
        backgroundColor: "var(--color-bg-alt)",
        minHeight: "100vh",
        padding: "160px 40px",
      }}
      className="booking-band"
    >
      <div className="grain-light" aria-hidden style={{ opacity: 0.04 }} />
      {/* Ambient dot pattern behind embed */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "radial-gradient(circle, rgba(20,20,18,0.08) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
          opacity: 0.5,
          pointerEvents: "none",
        }}
      />

      <div style={{ position: "relative", zIndex: 2, maxWidth: 1000, margin: "0 auto", textAlign: "center" }}>
        <motion.div
          initial={{ opacity: reduce ? 1 : 0, y: reduce ? 0 : 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15% 0px" }}
          transition={{ duration: reduce ? 0 : 0.5, ease: ease.outQuart }}
          className="type-eyebrow"
          style={{ color: "var(--color-ink-soft)", marginBottom: 32 }}
        >
          Skip the back and forth
        </motion.div>

        <div
          className="type-display-l"
          style={{ color: "var(--color-ink)", marginBottom: 24, maxWidth: "20ch", marginInline: "auto" }}
        >
          <CharRevealInView
            text="Book a 20-minute intro call."
            style={{ color: "var(--color-ink)" }}
          />
        </div>

        <motion.p
          initial={{ opacity: reduce ? 1 : 0, y: reduce ? 0 : 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15% 0px" }}
          transition={{ duration: reduce ? 0 : 0.6, ease: ease.outQuart, delay: reduce ? 0 : 1.2 }}
          className="type-body-lg"
          style={{
            color: "var(--color-ink)",
            marginTop: 24,
            marginBottom: 56,
            maxWidth: 640,
            marginInline: "auto",
          }}
        >
          No sales script. We'll ask what you're building and figure out if
          we're the right fit — same call.
        </motion.p>

        <motion.div
          initial={{ opacity: reduce ? 1 : 0, scale: reduce ? 1 : 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: reduce ? 0 : 0.7, ease: ease.outQuart }}
          style={{
            maxWidth: 900,
            margin: "0 auto",
            background: "var(--color-bg)",
            border: "1px solid rgba(20,20,18,0.15)",
            borderRadius: 16,
            padding: 32,
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            className="grain-light"
            aria-hidden
            style={{ opacity: 0.04, borderRadius: 16 }}
          />
          {calReady ? (
            <Cal
              calLink={CAL_LINK}
              style={{
                width: "100%",
                minHeight: 640,
                border: "none",
              }}
              config={{ layout: "month_view" }}
            />
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 20,
                padding: "48px 0",
              }}
            >
              <p className="type-body" style={{ color: "var(--color-ink)" }}>
                Open the calendar in a new tab to book.
              </p>
              <MagneticCTA to={CAL_FULL_URL} variant="primary">
                Book on Cal.com ↗
              </MagneticCTA>
            </div>
          )}
        </motion.div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .booking-band { min-height: 90vh; padding: 128px 24px; }
        }
      `}</style>
    </section>
  );
}

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
        <MonogramMark variant="mini" />
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
      <EditorialHero />
      <PromiseBand />
      <HelpersBand />
      <FormBand />
      <DirectBand />
      <BookingBand />
      <ClosingBand />
    </>
  );
}
