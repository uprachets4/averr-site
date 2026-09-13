import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from "motion/react";
import PillHl from "./PillHl";

const EASE = [0.25, 0.1, 0.25, 1] as const;
const BOUNCE = [0.34, 1.56, 0.64, 1] as const;

const TRUST = ["CG Walls & Floors", "CareerClarity AI", "SIFT", "CadenceStack"];
const HEADLINE_WORDS = "The studio for businesses that want to look".split(" ");

const WORD_STAGGER = 0.09;
const WORD_START = 0.5;
const PILL_DELAY = WORD_START + HEADLINE_WORDS.length * WORD_STAGGER + 0.05;
const SUBHEAD_DELAY = PILL_DELAY + 0.35;
const CTA_DELAY = SUBHEAD_DELAY + 0.2;
const TRUST_DELAY = CTA_DELAY + 0.2;

function MagneticCTA({
  href,
  variant,
  children,
}: {
  href: string;
  variant: "primary" | "ghost";
  children: React.ReactNode;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 150, damping: 15, mass: 0.3 });
  const springY = useSpring(y, { stiffness: 150, damping: 15, mass: 0.3 });

  function handleMove(e: React.MouseEvent<HTMLAnchorElement>) {
    if (reduce || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - (rect.left + rect.width / 2)) * 0.15);
    y.set((e.clientY - (rect.top + rect.height / 2)) * 0.15);
  }

  function handleLeave() {
    x.set(0);
    y.set(0);
  }

  const baseStyle: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    borderRadius: 999,
    padding: "14px 24px",
    fontFamily: "var(--font-body)",
    fontSize: 14,
    fontWeight: 500,
    textDecoration: "none",
    cursor: "pointer",
    transition: "background-color 0.3s ease, border-color 0.3s ease",
  };

  const primaryStyle: React.CSSProperties = {
    ...baseStyle,
    backgroundColor: "var(--color-ink)",
    color: "var(--color-bg)",
    border: "1px solid var(--color-ink)",
  };

  const ghostStyle: React.CSSProperties = {
    ...baseStyle,
    backgroundColor: "transparent",
    color: "var(--color-ink)",
    border: "1px solid rgba(20,20,18,0.18)",
  };

  const finalStyle = variant === "primary" ? primaryStyle : ghostStyle;

  return (
    <motion.a
      ref={ref}
      href={href}
      style={{ x: springX, y: springY, ...finalStyle }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      onMouseEnter={(e) => {
        if (variant === "primary") {
          e.currentTarget.style.backgroundColor = "var(--color-ink-soft)";
        } else {
          e.currentTarget.style.backgroundColor = "rgba(20,20,18,0.04)";
          e.currentTarget.style.borderColor = "rgba(20,20,18,0.32)";
        }
      }}
      onMouseOut={(e) => {
        if (variant === "primary") {
          e.currentTarget.style.backgroundColor = "var(--color-ink)";
        } else {
          e.currentTarget.style.backgroundColor = "transparent";
          e.currentTarget.style.borderColor = "rgba(20,20,18,0.18)";
        }
      }}
      whileHover={{ scale: variant === "primary" ? 1.03 : 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="group"
    >
      {children}
      <span
        style={{
          display: "inline-block",
          transition: "transform 0.3s ease",
        }}
        className="group-hover:translate-x-1"
      >
        →
      </span>
    </motion.a>
  );
}

export default function Hero() {
  const reduce = useReducedMotion();

  const wordVariants = {
    hidden: { opacity: 0, y: reduce ? 0 : 14 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: reduce ? 0.01 : 0.55,
        ease: EASE,
        delay: reduce ? 0 : WORD_START + i * WORD_STAGGER,
      },
    }),
  };

  return (
    <section
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 pb-24 pt-36 text-center sm:px-10 sm:pt-40"
      style={{ backgroundColor: "var(--color-bg)" }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 1400px 900px at 30% 20%, rgba(232,225,208,0.55), transparent 60%), radial-gradient(ellipse 1000px 700px at 80% 80%, rgba(232,225,208,0.35), transparent 60%)",
        }}
      />
      <div className="grain-light" aria-hidden="true" />

      <div className="relative z-10 max-w-[1100px]">
        <motion.div
          initial={{ opacity: 0, y: reduce ? 0 : 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduce ? 0.01 : 0.5, ease: EASE, delay: reduce ? 0 : 0.4 }}
          className="mb-10 inline-flex items-center gap-2.5 font-mono uppercase"
          style={{
            fontSize: 11,
            letterSpacing: "0.14em",
            color: "var(--color-muted)",
          }}
        >
          <span
            className="h-px w-5"
            style={{ backgroundColor: "currentColor", opacity: 0.6 }}
          />
          A boutique studio · Toronto
          <span
            className="h-px w-5"
            style={{ backgroundColor: "currentColor", opacity: 0.6 }}
          />
        </motion.div>

        <h1
          className="mx-auto mb-8 max-w-[1000px] font-display font-medium"
          style={{
            fontSize: "clamp(40px, 6vw, 80px)",
            lineHeight: 1.05,
            letterSpacing: "-0.028em",
            color: "var(--color-ink)",
          }}
        >
          {HEADLINE_WORDS.map((w, i) => (
            <motion.span
              key={w + i}
              custom={i}
              initial="hidden"
              animate="visible"
              variants={wordVariants}
              className="inline-block whitespace-pre"
            >
              {w + " "}
            </motion.span>
          ))}
          <motion.span
            initial={{ opacity: 0, scale: reduce ? 1 : 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: reduce ? 0.01 : 0.5,
              ease: BOUNCE,
              delay: reduce ? 0 : PILL_DELAY,
            }}
            className="inline-block"
          >
            <PillHl>serious</PillHl>
          </motion.span>
          .
        </h1>

        <motion.p
          initial={{ opacity: 0, y: reduce ? 0 : 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduce ? 0.01 : 0.6, ease: EASE, delay: reduce ? 0 : SUBHEAD_DELAY }}
          className="mx-auto mb-11 max-w-[620px]"
          style={{
            fontSize: 18,
            lineHeight: 1.55,
            color: "var(--color-muted)",
          }}
        >
          Averr Studios designs premium websites, builds AI automations, and runs
          the marketing engines for small and mid-market businesses across the GTA.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: reduce ? 0 : 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduce ? 0.01 : 0.6, ease: EASE, delay: reduce ? 0 : CTA_DELAY }}
          className="inline-flex flex-wrap justify-center gap-3"
        >
          <MagneticCTA href="https://cal.com/prachets/discoverycall" variant="primary">
            Book a discovery call
          </MagneticCTA>
          <MagneticCTA href="/work" variant="ghost">
            See our work
          </MagneticCTA>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: reduce ? 0.01 : 0.6, ease: EASE, delay: reduce ? 0 : TRUST_DELAY }}
          className="relative z-10 mt-24 flex max-w-[800px] flex-wrap items-center justify-center gap-10 pt-10"
          style={{ borderTop: "1px solid rgba(20,20,18,0.10)" }}
        >
          <span
            className="font-mono uppercase"
            style={{
              fontSize: 11,
              letterSpacing: "0.14em",
              color: "var(--color-muted)",
            }}
          >
            Recent work
          </span>
          {TRUST.map((name) => (
            <span
              key={name}
              className="font-display font-medium transition-opacity duration-300 hover:opacity-100"
              style={{
                fontSize: 15,
                letterSpacing: "-0.01em",
                color: "var(--color-ink-soft)",
                opacity: 0.6,
              }}
            >
              {name}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
