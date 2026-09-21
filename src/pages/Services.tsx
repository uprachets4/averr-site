import { useEffect, useMemo, useRef, useState } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import { ease } from "../lib/motion";
import MagneticCTA from "../components/MagneticCTA";
import FinalCTA from "../components/FinalCTA";
import PillHl from "../components/PillHl";

/* ═══════════════════════════════════════════════════════════════
   Pillar data — names + descriptions preserved verbatim.
   Added: investment, timeline. Bullets rewritten as concrete
   short-form deliverables per Session 7a spec.
   ═══════════════════════════════════════════════════════════════ */

type Pillar = {
  id: "design" | "automate" | "grow";
  serviceLabel: string; // "SERVICE 01"
  name: string;
  intro: string;
  included: string[];
  investment: string;
  timeline: string;
};

const PILLARS: Pillar[] = [
  {
    id: "design",
    serviceLabel: "SERVICE 01",
    name: "Design",
    intro:
      "The websites, product interfaces, and design systems that make the rest of the work land. If it looks templated, it costs you deals before the first meeting.",
    included: [
      "Brand audit + design direction",
      "Custom site build (Next.js or Framer, up to 15 pages)",
      "SaaS product UI + component library",
      "Design tokens + motion primitives",
      "Iterative refinement post-launch",
    ],
    investment: "$3,500 – $5,000 CAD",
    timeline: "2 – 3 weeks",
  },
  {
    id: "automate",
    serviceLabel: "SERVICE 02",
    name: "Automate",
    intro:
      "The AI systems and workflow automations that take busywork off your team. If it's the same task every week, it should be running without you.",
    included: [
      "Workflow audit + system design",
      "AI agent build (lead qual, intake, research)",
      "CRM + email + calendar integration",
      "Human-review layer for LLM outputs",
      "Documentation for team handoff",
    ],
    investment: "$2,500 – $4,000 CAD",
    timeline: "1 – 2 weeks",
  },
  {
    id: "grow",
    serviceLabel: "SERVICE 03",
    name: "Grow",
    intro:
      "The paid acquisition and organic content that fills the funnel above the work in Design and Automate. Numbers are the point.",
    included: [
      "Paid campaigns (Google, Meta, LinkedIn, LSA)",
      "Landing pages built for the ads",
      "Long-form content + LinkedIn + YouTube",
      "Attribution + monthly reporting",
    ],
    investment: "Retainer from $1,500 CAD/month",
    timeline: "Ongoing",
  },
];

/* ═══════════════════════════════════════════════════════════════
   Header (unchanged from prior session)
   ═══════════════════════════════════════════════════════════════ */

function ServicesHeader() {
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

      <div style={{ position: "relative", zIndex: 2, maxWidth: 1000, margin: "0 auto" }}>
        <motion.div
          initial={{ opacity: 0, y: reduce ? 0 : 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduce ? 0.01 : 0.5, ease: ease.outQuart, delay: 0.2 }}
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
          <span style={{ height: 1, width: 20, background: "currentColor", opacity: 0.6 }} />
          Services
          <span style={{ height: 1, width: 20, background: "currentColor", opacity: 0.6 }} />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: reduce ? 0 : 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduce ? 0.01 : 0.7, ease: ease.outQuart, delay: 0.3 }}
          className="type-display-xl"
          style={{
            color: "var(--color-ink)",
            marginBottom: 32,
            maxWidth: 900,
            margin: "0 auto 32px",
          }}
        >
          Three services.{" "}
          <motion.span
            initial={{ opacity: 0, scale: reduce ? 1 : 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: reduce ? 0.01 : 0.5, ease: ease.bounce, delay: 0.8 }}
            style={{ display: "inline-block" }}
          >
            <PillHl>One studio</PillHl>
          </motion.span>{" "}
          behind them all.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: reduce ? 0 : 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduce ? 0.01 : 0.6, ease: ease.outQuart, delay: 1.1 }}
          className="type-body-lg"
          style={{
            color: "var(--color-muted)",
            maxWidth: 620,
            margin: "0 auto",
          }}
        >
          Averr Studios designs the websites, engineers the SaaS products and AI systems,
          and grows the audiences of businesses that refuse to look templated.
        </motion.p>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Sticky-scroll pillar sequence
   Container wraps all 3 pillars. Each pillar section is 250vh tall
   with 100vh sticky inner content. Progress within each section
   drives stage transitions (0-0.33 stage 1, 0.33-0.66 stage 2,
   0.66-1 stage 3).
   Fixed progress indicator on right edge tracks the active pillar
   via IntersectionObserver.
   Below 900px: sticky pattern disabled, stacked cards render all
   stages in sequence + indicator hides.
   ═══════════════════════════════════════════════════════════════ */

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(true);
  useEffect(function detect() {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(min-width: 901px)");
    setIsDesktop(mq.matches);
    function onChange(e: MediaQueryListEvent) {
      setIsDesktop(e.matches);
    }
    mq.addEventListener("change", onChange);
    return function cleanup() {
      mq.removeEventListener("change", onChange);
    };
  }, []);
  return isDesktop;
}

function PillarSequence() {
  const reduce = useReducedMotion();
  const isDesktop = useIsDesktop();
  const sticky = isDesktop && !reduce;

  const containerRef = useRef<HTMLDivElement | null>(null);
  const sectionRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [indicatorVisible, setIndicatorVisible] = useState(false);

  useEffect(
    function trackActive() {
      if (!sticky) return;
      const observers: IntersectionObserver[] = [];
      const activeMap = new Map<number, boolean>();
      sectionRefs.current.forEach(function watch(el, idx) {
        if (!el) return;
        const io = new IntersectionObserver(
          function onEntries(entries) {
            for (const entry of entries) {
              activeMap.set(idx, entry.isIntersecting);
            }
            const anyVisible = Array.from(activeMap.values()).some(Boolean);
            setIndicatorVisible(anyVisible);
            // Pick the topmost visible pillar as active
            for (let i = 0; i < sectionRefs.current.length; i++) {
              if (activeMap.get(i)) {
                setActiveIndex(i);
                return;
              }
            }
          },
          { threshold: 0, rootMargin: "-40% 0px -40% 0px" }
        );
        io.observe(el);
        observers.push(io);
      });
      return function cleanup() {
        observers.forEach(function stop(io) {
          io.disconnect();
        });
      };
    },
    [sticky]
  );

  // Stable per-index callback refs so children can register their DOM node once.
  const registerRefs = useMemo(function build() {
    return PILLARS.map(function make(_, i) {
      return function assign(el: HTMLDivElement | null) {
        sectionRefs.current[i] = el;
      };
    });
  }, []);

  return (
    <div ref={containerRef} style={{ position: "relative" }}>
      {PILLARS.map(function renderPillar(pillar, index) {
        return (
          <PillarSection
            key={pillar.id}
            pillar={pillar}
            index={index}
            sticky={sticky}
            registerRef={registerRefs[index]}
          />
        );
      })}
      {sticky ? (
        <SequenceProgressIndicator
          activeIndex={activeIndex}
          visible={indicatorVisible}
        />
      ) : null}
    </div>
  );
}

function PillarSection({
  pillar,
  index,
  sticky,
  registerRef,
}: {
  pillar: Pillar;
  index: number;
  sticky: boolean;
  registerRef: (el: HTMLDivElement | null) => void;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  // Hooks must run unconditionally — mobile branch renders after all hooks.
  const stage1Opacity = useTransform(scrollYProgress, [0, 0.28, 0.35], [1, 1, 0]);
  const stage2Opacity = useTransform(
    scrollYProgress,
    [0.28, 0.35, 0.62, 0.7],
    [0, 1, 1, 0]
  );
  const stage3Opacity = useTransform(scrollYProgress, [0.62, 0.7, 1], [0, 1, 1]);
  const stage1Y = useTransform(scrollYProgress, [0, 0.35], [0, -20]);
  const stage2Y = useTransform(scrollYProgress, [0.28, 0.4, 0.72], [20, 0, -20]);
  const stage3Y = useTransform(scrollYProgress, [0.65, 0.75], [20, 0]);
  const headlineY = useTransform(scrollYProgress, [0, 1], [0, -32]);

  useEffect(
    function forwardRef() {
      registerRef(ref.current);
      return function unforward() {
        registerRef(null);
      };
    },
    [registerRef]
  );

  if (!sticky) {
    return <StackedPillar pillar={pillar} index={index} />;
  }

  const bg =
    index % 2 === 1 ? "var(--color-bg-alt)" : "var(--color-bg)";

  return (
    <section
      ref={ref}
      id={pillar.id}
      style={{
        position: "relative",
        height: "250vh",
        backgroundColor: bg,
      }}
    >
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          display: "grid",
          gridTemplateColumns: "40% 60%",
          alignItems: "center",
          padding: "0 40px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            maxWidth: 520,
            paddingRight: 40,
            position: "relative",
          }}
        >
          <div
            className="type-eyebrow"
            style={{
              color: "var(--color-muted)",
              marginBottom: 24,
            }}
          >
            {pillar.serviceLabel}
          </div>
          <motion.h2
            className="type-display-l"
            style={{
              color: "var(--color-ink)",
              marginBottom: 40,
              y: headlineY,
            }}
          >
            {pillar.name}
          </motion.h2>

          <div style={{ position: "relative", minHeight: 320 }}>
            <StageBody
              opacity={stage1Opacity}
              y={stage1Y}
            >
              <p
                className="type-body-lg"
                style={{ color: "var(--color-ink)", margin: 0 }}
              >
                {pillar.intro}
              </p>
            </StageBody>

            <StageBody opacity={stage2Opacity} y={stage2Y}>
              <div
                className="type-eyebrow"
                style={{
                  color: "var(--color-muted-2)",
                  marginBottom: 20,
                }}
              >
                What's included
              </div>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {pillar.included.map(function bullet(item, i) {
                  return (
                    <li
                      key={item}
                      className="type-body"
                      style={{
                        display: "grid",
                        gridTemplateColumns: "24px 1fr",
                        gap: 12,
                        padding: "12px 0",
                        borderTop:
                          i === 0
                            ? "none"
                            : "1px solid rgba(20,20,18,0.08)",
                        color: "var(--color-ink)",
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: 11,
                          letterSpacing: "0.12em",
                          color: "var(--color-muted-2)",
                          paddingTop: 4,
                        }}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span>{item}</span>
                    </li>
                  );
                })}
              </ul>
            </StageBody>

            <StageBody opacity={stage3Opacity} y={stage3Y}>
              <StageThree
                investment={pillar.investment}
                timeline={pillar.timeline}
              />
            </StageBody>
          </div>
        </div>

        <div
          style={{
            position: "relative",
            height: "70vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <AmbientVisual
            pillar={pillar.id}
            stage1Opacity={stage1Opacity}
            stage2Opacity={stage2Opacity}
            stage3Opacity={stage3Opacity}
          />
        </div>
      </div>
    </section>
  );
}

function StageBody({
  opacity,
  y,
  children,
}: {
  opacity: MotionValue<number>;
  y: MotionValue<number>;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        opacity,
        y,
      }}
    >
      {children}
    </motion.div>
  );
}

function StageThree({
  investment,
  timeline,
}: {
  investment: string;
  timeline: string;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
        <div>
          <div
            className="type-eyebrow"
            style={{ color: "var(--color-muted-2)", marginBottom: 10 }}
          >
            Investment
          </div>
          <div
            className="type-h3"
            style={{ color: "var(--color-ink)" }}
          >
            {investment}
          </div>
        </div>
        <div>
          <div
            className="type-eyebrow"
            style={{ color: "var(--color-muted-2)", marginBottom: 10 }}
          >
            Timeline
          </div>
          <div
            className="type-h3"
            style={{ color: "var(--color-ink)" }}
          >
            {timeline}
          </div>
        </div>
      </div>
      <div>
        <MagneticCTA to="/contact" variant="primary">
          Book a call
        </MagneticCTA>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Stacked (mobile / reduced-motion) fallback
   ═══════════════════════════════════════════════════════════════ */

function StackedPillar({ pillar, index }: { pillar: Pillar; index: number }) {
  const reduce = useReducedMotion();
  const bg = index % 2 === 1 ? "var(--color-bg-alt)" : "var(--color-bg)";
  return (
    <section
      id={pillar.id}
      style={{
        backgroundColor: bg,
        padding: "112px 24px",
        borderTop: "1px solid rgba(20,20,18,0.08)",
      }}
    >
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <motion.div
          initial={{ opacity: 0, y: reduce ? 0 : 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: reduce ? 0.01 : 0.5, ease: ease.outQuart }}
          className="type-eyebrow"
          style={{ color: "var(--color-muted)", marginBottom: 24 }}
        >
          {pillar.serviceLabel}
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: reduce ? 0 : 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{
            duration: reduce ? 0.01 : 0.7,
            ease: ease.outQuart,
            delay: reduce ? 0 : 0.05,
          }}
          className="type-display-l"
          style={{ color: "var(--color-ink)", marginBottom: 32 }}
        >
          {pillar.name}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: reduce ? 0 : 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{
            duration: reduce ? 0.01 : 0.6,
            ease: ease.outQuart,
            delay: reduce ? 0 : 0.1,
          }}
          className="type-body-lg"
          style={{ color: "var(--color-ink)", marginBottom: 48 }}
        >
          {pillar.intro}
        </motion.p>

        <div style={{ marginBottom: 48 }}>
          <div
            className="type-eyebrow"
            style={{
              color: "var(--color-muted-2)",
              marginBottom: 20,
            }}
          >
            What's included
          </div>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {pillar.included.map(function bullet(item, i) {
              return (
                <li
                  key={item}
                  className="type-body"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "24px 1fr",
                    gap: 12,
                    padding: "14px 0",
                    borderTop:
                      i === 0
                        ? "none"
                        : "1px solid rgba(20,20,18,0.08)",
                    color: "var(--color-ink)",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 11,
                      letterSpacing: "0.12em",
                      color: "var(--color-muted-2)",
                      paddingTop: 4,
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span>{item}</span>
                </li>
              );
            })}
          </ul>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 24,
            marginBottom: 40,
          }}
        >
          <div>
            <div
              className="type-eyebrow"
              style={{ color: "var(--color-muted-2)", marginBottom: 10 }}
            >
              Investment
            </div>
            <div
              className="type-h3"
              style={{ color: "var(--color-ink)" }}
            >
              {pillar.investment}
            </div>
          </div>
          <div>
            <div
              className="type-eyebrow"
              style={{ color: "var(--color-muted-2)", marginBottom: 10 }}
            >
              Timeline
            </div>
            <div
              className="type-h3"
              style={{ color: "var(--color-ink)" }}
            >
              {pillar.timeline}
            </div>
          </div>
        </div>

        <div>
          <MagneticCTA to="/contact" variant="primary">
            Book a call
          </MagneticCTA>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Progress indicator — fixed right edge, active pillar highlighted
   ═══════════════════════════════════════════════════════════════ */

function SequenceProgressIndicator({
  activeIndex,
  visible,
}: {
  activeIndex: number;
  visible: boolean;
}) {
  return (
    <motion.aside
      aria-hidden
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.3, ease: ease.outQuart }}
      style={{
        position: "fixed",
        top: "50%",
        right: 32,
        transform: "translateY(-50%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        gap: 20,
        zIndex: 20,
        pointerEvents: "none",
      }}
      className="services-progress"
    >
      {PILLARS.map(function renderMark(p, i) {
        const isActive = i === activeIndex;
        const isCompleted = i < activeIndex;
        return (
          <div
            key={p.id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <div
              className="type-eyebrow"
              style={{
                color: "var(--color-ink)",
                opacity: isActive ? 1 : 0,
                transition: "opacity 300ms ease",
              }}
            >
              {String(i + 1).padStart(2, "0")} / {p.name.toUpperCase()}
            </div>
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                border: "1px solid var(--color-ink)",
                background: isActive
                  ? "var(--color-ink)"
                  : isCompleted
                  ? "rgba(20,20,18,0.5)"
                  : "transparent",
                transition: "background 300ms ease",
              }}
            />
          </div>
        );
      })}
      <style>{`
        @media (max-width: 900px) {
          .services-progress { display: none !important; }
        }
      `}</style>
    </motion.aside>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Ambient visuals — one per pillar, three stages each.
   Palette-only, no images. Motion respects useReducedMotion via
   parent guard (visuals only render in sticky mode).
   ═══════════════════════════════════════════════════════════════ */

function AmbientVisual({
  pillar,
  stage1Opacity,
  stage2Opacity,
  stage3Opacity,
}: {
  pillar: Pillar["id"];
  stage1Opacity: MotionValue<number>;
  stage2Opacity: MotionValue<number>;
  stage3Opacity: MotionValue<number>;
}) {
  const stages = [stage1Opacity, stage2Opacity, stage3Opacity];
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        maxWidth: 640,
        aspectRatio: "1 / 1",
      }}
    >
      {[1, 2, 3].map(function slot(n, i) {
        return (
          <motion.div
            key={n}
            style={{
              position: "absolute",
              inset: 0,
              opacity: stages[i],
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {pillar === "design" ? (
              <DesignAmbient stage={n as 1 | 2 | 3} />
            ) : pillar === "automate" ? (
              <AutomateAmbient stage={n as 1 | 2 | 3} />
            ) : (
              <GrowAmbient stage={n as 1 | 2 | 3} />
            )}
          </motion.div>
        );
      })}
    </div>
  );
}

function DesignAmbient({ stage }: { stage: 1 | 2 | 3 }) {
  // Grid overlay + type sample fragment
  const cols = stage === 1 ? 6 : stage === 2 ? 10 : 14;
  return (
    <svg
      viewBox="0 0 400 400"
      style={{ width: "100%", height: "100%" }}
      aria-hidden
    >
      <defs>
        <linearGradient id="d-grad" x1="0" y1="0" x2="400" y2="400" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#C9B896" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#A8916D" stopOpacity="0.15" />
        </linearGradient>
      </defs>
      {/* Grid */}
      {Array.from({ length: cols }).map(function line(_, i) {
        const x = (i / cols) * 400;
        return (
          <line
            key={`v-${i}`}
            x1={x}
            y1="0"
            x2={x}
            y2="400"
            stroke="rgba(20,20,18,0.08)"
            strokeWidth="1"
          />
        );
      })}
      {Array.from({ length: cols }).map(function line(_, i) {
        const y = (i / cols) * 400;
        return (
          <line
            key={`h-${i}`}
            x1="0"
            y1={y}
            x2="400"
            y2={y}
            stroke="rgba(20,20,18,0.08)"
            strokeWidth="1"
          />
        );
      })}
      {/* Type sample fragment — appears from stage 2 */}
      {stage >= 2 ? (
        <text
          x="200"
          y="220"
          textAnchor="middle"
          fontFamily="Geist, sans-serif"
          fontSize="140"
          fontWeight="500"
          fill="url(#d-grad)"
          letterSpacing="-6"
        >
          Aa
        </text>
      ) : null}
      {stage >= 3 ? (
        <text
          x="200"
          y="290"
          textAnchor="middle"
          fontFamily="Geist Mono, monospace"
          fontSize="12"
          letterSpacing="4"
          fill="rgba(20,20,18,0.5)"
        >
          GRID · SYSTEM · MOTION
        </text>
      ) : null}
    </svg>
  );
}

function AutomateAmbient({ stage }: { stage: 1 | 2 | 3 }) {
  // Flow nodes connected by lines. More nodes as stage advances.
  const nodes =
    stage === 1
      ? [
          { x: 120, y: 200 },
          { x: 280, y: 200 },
        ]
      : stage === 2
      ? [
          { x: 100, y: 140 },
          { x: 200, y: 200 },
          { x: 300, y: 140 },
          { x: 200, y: 300 },
        ]
      : [
          { x: 80, y: 120 },
          { x: 200, y: 80 },
          { x: 320, y: 140 },
          { x: 140, y: 220 },
          { x: 260, y: 250 },
          { x: 200, y: 340 },
        ];
  const edges: Array<[number, number]> =
    stage === 1
      ? [[0, 1]]
      : stage === 2
      ? [
          [0, 1],
          [1, 2],
          [1, 3],
        ]
      : [
          [0, 1],
          [1, 2],
          [0, 3],
          [3, 4],
          [4, 5],
          [2, 4],
          [1, 3],
        ];
  return (
    <svg
      viewBox="0 0 400 400"
      style={{ width: "100%", height: "100%" }}
      aria-hidden
    >
      <defs>
        <linearGradient id="a-grad" x1="0" y1="0" x2="400" y2="400" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#C9B896" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#A8916D" stopOpacity="0.35" />
        </linearGradient>
      </defs>
      {edges.map(function edge([a, b], i) {
        const na = nodes[a];
        const nb = nodes[b];
        return (
          <line
            key={i}
            x1={na.x}
            y1={na.y}
            x2={nb.x}
            y2={nb.y}
            stroke="url(#a-grad)"
            strokeWidth="1.25"
          />
        );
      })}
      {nodes.map(function node(n, i) {
        return (
          <motion.circle
            key={i}
            cx={n.x}
            cy={n.y}
            r={6}
            fill="var(--color-ink)"
            animate={{ scale: [1, 1.15, 1] }}
            transition={{
              duration: 2.4,
              repeat: Infinity,
              delay: i * 0.25,
              ease: ease.inOut,
            }}
            style={{ transformOrigin: `${n.x}px ${n.y}px` }}
          />
        );
      })}
    </svg>
  );
}

function GrowAmbient({ stage }: { stage: 1 | 2 | 3 }) {
  // Chart-shape gradient sweep — line rises across stages, bars appear at stage 3
  const path =
    stage === 1
      ? "M 40 260 L 360 260"
      : stage === 2
      ? "M 40 280 Q 200 240 360 180"
      : "M 40 300 Q 140 260 220 180 T 360 100";
  return (
    <svg
      viewBox="0 0 400 400"
      style={{ width: "100%", height: "100%" }}
      aria-hidden
    >
      <defs>
        <linearGradient id="g-fill" x1="0" y1="0" x2="0" y2="400" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#C9B896" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#C9B896" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="g-line" x1="0" y1="0" x2="400" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="var(--color-ink)" stopOpacity="0.5" />
          <stop offset="100%" stopColor="var(--color-ink)" stopOpacity="1" />
        </linearGradient>
      </defs>
      {/* Baseline axis */}
      <line x1="40" y1="340" x2="360" y2="340" stroke="rgba(20,20,18,0.15)" strokeWidth="1" />
      {/* Bars at stage 3 */}
      {stage === 3
        ? [80, 140, 200, 260, 320].map(function bar(x, i) {
            const heights = [40, 80, 130, 90, 160];
            const h = heights[i];
            return (
              <rect
                key={i}
                x={x - 12}
                y={340 - h}
                width={24}
                height={h}
                fill="url(#g-fill)"
              />
            );
          })
        : null}
      {/* Trend line */}
      <path d={path} stroke="url(#g-line)" strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* End dot */}
      <circle
        cx={stage === 1 ? 360 : stage === 2 ? 360 : 360}
        cy={stage === 1 ? 260 : stage === 2 ? 180 : 100}
        r="6"
        fill="var(--color-ink)"
      />
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════════
   What we don't do (unchanged)
   ═══════════════════════════════════════════════════════════════ */

const NOT_DOING = [
  "We don't do retainers with 12-month minimums.",
  "We don't white-label for agencies.",
  "We don't take projects we can't ship in 90 days.",
];

function WhatWeDontDo() {
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

      <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative", zIndex: 2 }}>
        <motion.div
          initial={{ opacity: 0, y: reduce ? 0 : 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: reduce ? 0.01 : 0.5, ease: ease.outQuart }}
          className="type-eyebrow"
          style={{
            color: "var(--color-muted-l)",
            marginBottom: 24,
          }}
        >
          //_04 · what we don't do
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: reduce ? 0 : 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: reduce ? 0.01 : 0.7, ease: ease.outQuart, delay: 0.1 }}
          className="type-h2"
          style={{
            marginBottom: 64,
            maxWidth: 900,
          }}
        >
          Some <span className="fade-h-dark">things we say no to.</span>
        </motion.h2>

        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {NOT_DOING.map(function line(text, i) {
            return (
              <motion.li
                key={text}
                initial={{ opacity: 0, y: reduce ? 0 : 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{
                  duration: reduce ? 0.01 : 0.6,
                  ease: ease.outQuart,
                  delay: reduce ? 0 : 0.1 + i * 0.1,
                }}
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(24px, 2.6vw, 36px)",
                  fontWeight: 500,
                  letterSpacing: "-0.018em",
                  lineHeight: 1.25,
                  padding: "28px 0",
                  borderTop: "1px solid rgba(237,231,218,0.14)",
                  color: "var(--color-parch)",
                }}
              >
                {text}
              </motion.li>
            );
          })}
        </ul>

        <motion.p
          initial={{ opacity: 0, y: reduce ? 0 : 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: reduce ? 0.01 : 0.6, ease: ease.outQuart, delay: 0.5 }}
          className="type-body"
          style={{
            marginTop: 48,
            color: "var(--color-muted-l)",
            maxWidth: 560,
          }}
        >
          Averr is a boutique studio. We take a small number of projects each
          quarter and finish them.
        </motion.p>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   How to start (unchanged)
   ═══════════════════════════════════════════════════════════════ */

const STEPS = [
  {
    n: "01",
    title: "Book a discovery call.",
    body: "20 minutes. No slide deck. We ask questions, you ask questions, both sides decide whether this is a fit.",
  },
  {
    n: "02",
    title: "Scoped proposal in 3 business days.",
    body: "Fixed scope, fixed timeline, fixed price. If we can't quote it, we tell you why and refer you to someone who can.",
  },
  {
    n: "03",
    title: "Kickoff week.",
    body: "Async by default, one review call a week. You get preview URLs from day one, not deliverables at the end.",
  },
];

function HowToStart() {
  const reduce = useReducedMotion();

  return (
    <section
      style={{
        backgroundColor: "var(--color-bg-warm)",
        padding: "140px 40px",
        position: "relative",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <motion.div
          initial={{ opacity: 0, y: reduce ? 0 : 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: reduce ? 0.01 : 0.5, ease: ease.outQuart }}
          className="type-eyebrow"
          style={{
            color: "var(--color-muted)",
            marginBottom: 24,
          }}
        >
          //_05 · how to start
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: reduce ? 0 : 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: reduce ? 0.01 : 0.7, ease: ease.outQuart, delay: 0.1 }}
          className="type-h2"
          style={{
            color: "var(--color-ink)",
            marginBottom: 72,
            maxWidth: 900,
          }}
        >
          Three steps. Two weeks{" "}
          <span className="fade-h">to kickoff, max.</span>
        </motion.h2>

        <div
          className="steps-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 24,
          }}
        >
          {STEPS.map(function stepCard(step, i) {
            return (
              <motion.div
                key={step.n}
                initial={{ opacity: 0, y: reduce ? 0 : 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{
                  duration: reduce ? 0.01 : 0.6,
                  ease: ease.outQuart,
                  delay: reduce ? 0 : 0.15 + i * 0.1,
                }}
                style={{
                  padding: "40px 32px",
                  borderTop: "1px solid rgba(20,20,18,0.15)",
                  display: "flex",
                  flexDirection: "column",
                  gap: 20,
                }}
              >
                <div
                  className="type-eyebrow"
                  style={{ color: "var(--color-muted)" }}
                >
                  <span style={{ color: "var(--color-ink)", fontWeight: 500 }}>
                    {step.n}
                  </span>
                  {"  ·  step"}
                </div>
                <div
                  className="type-h3"
                  style={{ color: "var(--color-ink)" }}
                >
                  {step.title}
                </div>
                <p
                  className="type-body"
                  style={{ color: "var(--color-muted)" }}
                >
                  {step.body}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .steps-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Page
   ═══════════════════════════════════════════════════════════════ */

export default function Services() {
  useEffect(function scrollTopOnMount() {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <ServicesHeader />
      <PillarSequence />
      <WhatWeDontDo />
      <HowToStart />
      <FinalCTA markerNumber="06" />
    </>
  );
}
