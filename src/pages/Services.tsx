import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { duration, ease, spring } from "../lib/motion";
import MagneticCTA from "../components/MagneticCTA";
import FinalCTA from "../components/FinalCTA";
import PillHl from "../components/PillHl";

/* ═══════════════════════════════════════════════════════════════
   Pillar data — names + descriptions preserved verbatim.
   Added: investment, timeline. Bullets rewritten as concrete
   short-form deliverables per Session 7a spec.
   ═══════════════════════════════════════════════════════════════ */

type ServiceChip = { label: string; tooltip: string };

type Pillar = {
  id: "design" | "automate" | "grow";
  serviceLabel: string; // "SERVICE 01"
  name: string;
  intro: string;
  included: string[];
  investment: string;
  timeline: string;
  chips: ServiceChip[];
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
    chips: [
      { label: "Marketing sites", tooltip: "Framer, Next.js, Astro" },
      {
        label: "SaaS product design",
        tooltip: "Dashboards, admin panels, onboarding flows",
      },
      {
        label: "Dashboards & UI",
        tooltip: "Data-dense interfaces, real-time views",
      },
      {
        label: "Design systems",
        tooltip: "Tokens, primitives, component libraries",
      },
    ],
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
    chips: [
      {
        label: "AI agents",
        tooltip: "Lead qualification, research, intake, sales enablement",
      },
      {
        label: "Workflow automation",
        tooltip: "Trigger.dev, n8n, Zapier, Make",
      },
      {
        label: "CRM & email integration",
        tooltip: "HubSpot, Salesforce, Notion, Attio, Airtable",
      },
      {
        label: "Handoff documentation",
        tooltip: "Loom + written runbook per system",
      },
    ],
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
    chips: [
      {
        label: "Social & organic content",
        tooltip: "LinkedIn, YouTube, X, long-form",
      },
      { label: "Paid ads", tooltip: "Google, Meta, LinkedIn, LSA" },
      {
        label: "Landing pages",
        tooltip: "Built for the ad, not repurposed",
      },
      {
        label: "Attribution & reporting",
        tooltip: "Monthly, source-attributed, honest",
      },
    ],
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
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  // Hooks must run unconditionally — mobile branch renders after all hooks.
  // Non-overlapping stage windows with hard gap buffers.
  const stage1Opacity = useTransform(
    scrollYProgress,
    [0, 0.28, 0.32, 1],
    [1, 1, 0, 0]
  );
  const stage2Opacity = useTransform(
    scrollYProgress,
    [0, 0.35, 0.4, 0.6, 0.65, 1],
    [0, 0, 1, 1, 0, 0]
  );
  const stage3Opacity = useTransform(
    scrollYProgress,
    [0, 0.68, 0.73, 1],
    [0, 0, 1, 1]
  );
  // Y ranges only advance while the stage is on-screen.
  const stage1Y = useTransform(scrollYProgress, [0, 0.28, 0.32], [0, 0, -20]);
  const stage2Y = useTransform(
    scrollYProgress,
    [0.35, 0.4, 0.6, 0.65],
    [20, 0, 0, -20]
  );
  const stage3Y = useTransform(scrollYProgress, [0.68, 0.73, 1], [20, 0, 0]);
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

  // Reserve left-column stage-stack min-height at the tallest stage.
  const stageRefs = useRef<Array<HTMLDivElement | null>>([null, null, null]);
  const [stageMinHeight, setStageMinHeight] = useState(0);
  useLayoutEffect(
    function measureStages() {
      if (!sticky) return;
      function measure() {
        let max = 0;
        stageRefs.current.forEach(function m(el) {
          if (el) max = Math.max(max, el.offsetHeight);
        });
        setStageMinHeight(max);
      }
      measure();
      const ros: ResizeObserver[] = [];
      stageRefs.current.forEach(function watch(el) {
        if (!el) return;
        const ro = new ResizeObserver(measure);
        ro.observe(el);
        ros.push(ro);
      });
      window.addEventListener("resize", measure);
      return function cleanup() {
        ros.forEach(function stop(r) {
          r.disconnect();
        });
        window.removeEventListener("resize", measure);
      };
    },
    [sticky]
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
            className="type-display-xl"
            style={{
              color: "var(--color-ink)",
              marginBottom: 32,
              y: headlineY,
            }}
          >
            {pillar.name}
          </motion.h2>

          <div style={{ marginBottom: 32 }}>
            <ServiceChips chips={pillar.chips} reduce={reduce ?? false} />
          </div>

          <div
            style={{
              position: "relative",
              minHeight: stageMinHeight || 320,
            }}
          >
            <StageBody
              opacity={stage1Opacity}
              y={stage1Y}
              elRef={function s(el) {
                stageRefs.current[0] = el;
              }}
            >
              <p
                className="type-body-lg"
                style={{ color: "var(--color-ink)", margin: 0 }}
              >
                {pillar.intro}
              </p>
            </StageBody>

            <StageBody
              opacity={stage2Opacity}
              y={stage2Y}
              elRef={function s(el) {
                stageRefs.current[1] = el;
              }}
            >
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
                      className="type-body-lg"
                      style={{
                        display: "grid",
                        gridTemplateColumns: "28px 1fr",
                        gap: 14,
                        padding: "14px 0",
                        borderTop:
                          i === 0
                            ? "none"
                            : "1px solid rgba(20,20,18,0.08)",
                        color: "var(--color-ink)",
                      }}
                    >
                      <span
                        className="type-eyebrow"
                        style={{
                          color: "#B18544",
                          paddingTop: 6,
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

            <StageBody
              opacity={stage3Opacity}
              y={stage3Y}
              elRef={function s(el) {
                stageRefs.current[2] = el;
              }}
            >
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
            height: "80vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <AmbientVisual
            pillar={pillar.id}
            scrollYProgress={scrollYProgress}
          />
        </div>
      </div>
    </section>
  );
}

/* ── service scope chips (persistent across all stages) ─────── */

function ServiceChips({
  chips,
  reduce,
}: {
  chips: ServiceChip[];
  reduce: boolean;
}) {
  const [hasFinePointer, setHasFinePointer] = useState(false);
  useEffect(function detectPointer() {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    setHasFinePointer(mq.matches);
    function onChange(e: MediaQueryListEvent) {
      setHasFinePointer(e.matches);
    }
    mq.addEventListener("change", onChange);
    return function cleanup() {
      mq.removeEventListener("change", onChange);
    };
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: 8,
      }}
    >
      {chips.map(function renderChip(c, i) {
        return (
          <ChipButton
            key={c.label}
            index={i}
            chip={c}
            reduce={reduce}
            enableTooltip={hasFinePointer}
          />
        );
      })}
    </div>
  );
}

function ChipButton({
  index,
  chip,
  reduce,
  enableTooltip,
}: {
  index: number;
  chip: ServiceChip;
  reduce: boolean;
  enableTooltip: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div
      initial={{ opacity: reduce ? 1 : 0, y: reduce ? 0 : 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30% 0px" }}
      transition={{
        duration: reduce ? 0.001 : 0.4,
        ease: ease.outQuart,
        delay: reduce ? 0 : 0.6 + index * 0.08,
      }}
      onHoverStart={function h() {
        setHovered(true);
      }}
      onHoverEnd={function h() {
        setHovered(false);
      }}
      className="type-eyebrow"
      style={{
        position: "relative",
        padding: "8px 14px",
        borderRadius: 100,
        border: hovered
          ? "1px solid var(--color-ink)"
          : "1px solid rgba(20,20,18,0.6)",
        background: hovered ? "var(--color-ink)" : "transparent",
        color: hovered ? "var(--color-parch)" : "var(--color-ink)",
        cursor: enableTooltip ? "help" : "default",
        transform: hovered && !reduce ? "translateY(-2px)" : "translateY(0)",
        transitionProperty: "background-color, border-color, color, transform",
        transitionDuration: `${duration.fast * 1000}ms`,
        transitionTimingFunction: `cubic-bezier(${ease.outQuart.join(",")})`,
      }}
    >
      {chip.label}
      {enableTooltip && hovered ? (
        <ChipTooltip text={chip.tooltip} />
      ) : null}
    </motion.div>
  );
}

function ChipTooltip({ text }: { text: string }) {
  return (
    <motion.div
      role="tooltip"
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: duration.fast, ease: ease.outQuart }}
      className="type-small"
      style={{
        position: "absolute",
        top: "calc(100% + 8px)",
        left: "50%",
        transform: "translateX(-50%)",
        background: "var(--color-bg)",
        color: "var(--color-ink)",
        border: "1px solid rgba(20,20,18,0.18)",
        borderRadius: 6,
        padding: "8px 12px",
        whiteSpace: "nowrap",
        boxShadow: "0 8px 24px rgba(20,20,18,0.10)",
        pointerEvents: "none",
        zIndex: 10,
      }}
    >
      <span
        aria-hidden
        style={{
          position: "absolute",
          top: -5,
          left: "50%",
          width: 8,
          height: 8,
          background: "var(--color-bg)",
          borderLeft: "1px solid rgba(20,20,18,0.18)",
          borderTop: "1px solid rgba(20,20,18,0.18)",
          transform: "translateX(-50%) rotate(45deg)",
        }}
      />
      {text}
    </motion.div>
  );
}

function StageBody({
  opacity,
  y,
  elRef,
  children,
}: {
  opacity: MotionValue<number>;
  y: MotionValue<number>;
  elRef: (el: HTMLDivElement | null) => void;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      ref={elRef}
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
          className="type-display-xl"
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
          style={{ color: "var(--color-ink)", marginBottom: 32 }}
        >
          {pillar.intro}
        </motion.p>

        <div style={{ marginBottom: 48 }}>
          <ServiceChips chips={pillar.chips} reduce={reduce ?? false} />
        </div>

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
                  className="type-body-lg"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "28px 1fr",
                    gap: 14,
                    padding: "16px 0",
                    borderTop:
                      i === 0
                        ? "none"
                        : "1px solid rgba(20,20,18,0.08)",
                    color: "var(--color-ink)",
                  }}
                >
                  <span
                    className="type-eyebrow"
                    style={{
                      color: "#B18544",
                      paddingTop: 6,
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
   Ambient visuals — rebuilt to reference tier.
   Cursor parallax + continuous drift under useReducedMotion guard.
   ═══════════════════════════════════════════════════════════════ */

function AmbientVisual({
  pillar,
  scrollYProgress,
}: {
  pillar: Pillar["id"];
  scrollYProgress: MotionValue<number>;
}) {
  const reduce = useReducedMotion();
  if (pillar === "design") {
    return (
      <DesignMoodBoard
        scrollYProgress={scrollYProgress}
        reduce={!!reduce}
      />
    );
  }
  if (pillar === "automate") {
    return (
      <AutomateWorkflow
        scrollYProgress={scrollYProgress}
        reduce={!!reduce}
      />
    );
  }
  return (
    <GrowDashboard
      scrollYProgress={scrollYProgress}
      reduce={!!reduce}
    />
  );
}

/* ── shared cursor parallax hook ────────────────────────────── */

function useCursorParallax(reduce: boolean, magnitude = 12) {
  const ref = useRef<HTMLDivElement | null>(null);
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const smoothX = useSpring(rawX, spring.soft);
  const smoothY = useSpring(rawY, spring.soft);

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    if (reduce || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    rawX.set(px * magnitude * 2);
    rawY.set(py * magnitude * 2);
  }

  function onLeave() {
    rawX.set(0);
    rawY.set(0);
  }

  return { ref, x: smoothX, y: smoothY, onMove, onLeave };
}

/* ── design mood board ──────────────────────────────────────── */

const MOOD_CARDS = [
  {
    src: "/work/cgwalls/hero.jpg",
    label: "CG Walls & Floors",
  },
  {
    src: "/work/capitalcommand/01-overview.jpg",
    label: "CapitalCommand",
  },
  {
    src: "/work/cadencestack/01-command-center.jpg",
    label: "CadenceStack",
  },
  {
    src: "/work/sift/01-command-overview.jpg",
    label: "SIFT",
  },
];

function DesignMoodBoard({
  scrollYProgress,
  reduce,
}: {
  scrollYProgress: MotionValue<number>;
  reduce: boolean;
}) {
  const parallax = useCursorParallax(reduce, 16);
  const scrollHintOpacity = useTransform(
    scrollYProgress,
    [0.25, 0.35],
    [1, 0]
  );

  return (
    <div
      ref={parallax.ref}
      onMouseMove={parallax.onMove}
      onMouseLeave={parallax.onLeave}
      style={{
        position: "relative",
        width: "100%",
        maxWidth: 720,
        aspectRatio: "1 / 1",
        overflow: "hidden",
      }}
    >
      {/* Warm sand radial wash — wider + brighter */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 110% 90% at 50% 50%, rgba(232,225,208,0.75), transparent 80%)",
          opacity: 0.85,
          pointerEvents: "none",
        }}
      />

      {/* Drifting Aa specimen */}
      <motion.div
        aria-hidden
        animate={
          reduce
            ? undefined
            : {
                x: [-24, 24, -24],
                y: [-18, 18, -18],
              }
        }
        transition={{
          duration: 90,
          repeat: Infinity,
          ease: ease.inOut,
        }}
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "var(--font-display)",
          fontSize: 320,
          fontWeight: 500,
          letterSpacing: "-0.05em",
          color: "var(--color-ink)",
          opacity: 0.08,
          pointerEvents: "none",
          userSelect: "none",
        }}
      >
        Aa
      </motion.div>

      {/* Cards */}
      {MOOD_CARDS.map(function renderCard(c, i) {
        return (
          <MoodCard
            key={c.src}
            index={i}
            src={c.src}
            label={c.label}
            scrollYProgress={scrollYProgress}
            parallaxX={parallax.x}
            parallaxY={parallax.y}
            reduce={reduce}
          />
        );
      })}

      {/* Grain overlay */}
      <div
        className="grain-light"
        aria-hidden
        style={{ opacity: 0.04, pointerEvents: "none" }}
      />

      <ScrollHint opacity={scrollHintOpacity} reduce={reduce} />
    </div>
  );
}

/* ── shared scroll hint (below ambient) ─────────────────────── */

function ScrollHint({
  opacity,
  reduce,
}: {
  opacity: MotionValue<number>;
  reduce: boolean;
}) {
  return (
    <motion.div
      aria-hidden
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 16,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 10,
        opacity,
        pointerEvents: "none",
      }}
    >
      <div
        className="type-eyebrow"
        style={{ color: "var(--color-ink-soft)" }}
      >
        Scroll to explore
      </div>
      <motion.div
        animate={reduce ? undefined : { y: [0, 4, 0] }}
        transition={{
          duration: 1.6,
          repeat: Infinity,
          ease: ease.inOut,
        }}
        style={{
          width: 1,
          height: 24,
          background: "var(--color-ink-soft)",
        }}
      />
    </motion.div>
  );
}

const MOOD_START_ROTS = [-7, -5, 5, 7];
const MOOD_END_ROTS = [-1.5, -0.5, 0.5, 1.5];
const MOOD_START_OFFSETS: Array<[number, number]> = [
  [-140, -100],
  [-60, -40],
  [60, 40],
  [140, 100],
];
const MOOD_END_OFFSETS: Array<[number, number]> = [
  [-40, -25],
  [-15, -10],
  [15, 10],
  [40, 25],
];
const MOOD_PARALLAX_WEIGHTS = [0.3, 0.6, 0.85, 1.0];

function MoodCard({
  index,
  src,
  label,
  scrollYProgress,
  parallaxX,
  parallaxY,
  reduce,
}: {
  index: number;
  src: string;
  label: string;
  scrollYProgress: MotionValue<number>;
  parallaxX: MotionValue<number>;
  parallaxY: MotionValue<number>;
  reduce: boolean;
}) {
  const startRot = MOOD_START_ROTS[index];
  const endRot = MOOD_END_ROTS[index];
  const [startOffsetX, startOffsetY] = MOOD_START_OFFSETS[index];
  const [endOffsetX, endOffsetY] = MOOD_END_OFFSETS[index];

  const rot = useTransform(scrollYProgress, [0, 1], [startRot, endRot]);
  const scrollX = useTransform(
    scrollYProgress,
    [0, 1],
    [startOffsetX, endOffsetX]
  );
  const scrollY = useTransform(
    scrollYProgress,
    [0, 1],
    [startOffsetY, endOffsetY]
  );
  const parallaxWeight = MOOD_PARALLAX_WEIGHTS[index];
  const totalX = useTransform(
    [scrollX, parallaxX] as MotionValue<number>[],
    function combine([a, b]) {
      return (a as number) + (b as number) * parallaxWeight;
    }
  );
  const totalY = useTransform(
    [scrollY, parallaxY] as MotionValue<number>[],
    function combine([a, b]) {
      return (a as number) + (b as number) * parallaxWeight;
    }
  );

  // Higher index = more toward foreground
  const zIndex = index + 1;

  return (
    <motion.figure
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        width: 560,
        height: 400,
        margin: 0,
        marginTop: -200,
        marginLeft: -280,
        borderRadius: 10,
        overflow: "hidden",
        background: "var(--color-bg)",
        boxShadow: "0 18px 48px rgba(20,20,18,0.18)",
        border: "1px solid rgba(20,20,18,0.08)",
        rotate: reduce ? endRot : rot,
        x: totalX,
        y: totalY,
        zIndex,
      }}
    >
      <img
        src={src}
        alt=""
        loading="lazy"
        decoding="async"
        draggable={false}
        style={{
          display: "block",
          width: "100%",
          height: "100%",
          objectFit: "cover",
          pointerEvents: "none",
        }}
      />
      <figcaption
        className="type-eyebrow"
        style={{
          position: "absolute",
          left: 12,
          bottom: 10,
          background: "rgba(244,240,230,0.9)",
          color: "var(--color-ink)",
          padding: "4px 10px",
          borderRadius: 999,
          backdropFilter: "blur(6px)",
        }}
      >
        {label}
      </figcaption>
    </motion.figure>
  );
}

/* ── automate workflow diagram ──────────────────────────────── */

const WORKFLOW_NODES: Array<{
  id: string;
  label: string;
  x: number;
  y: number;
}> = [
  { id: "trigger", label: "Trigger", x: 60, y: 90 },
  { id: "ai", label: "AI process", x: 145, y: 145 },
  { id: "review", label: "Human review", x: 220, y: 215 },
  { id: "publish", label: "Publish", x: 300, y: 175 },
  { id: "measure", label: "Measure", x: 360, y: 290 },
];

const WORKFLOW_EDGES: Array<{ from: number; to: number; path: string }> = [
  { from: 0, to: 1, path: "M 60 90 Q 100 60 145 145" },
  { from: 1, to: 2, path: "M 145 145 Q 200 220 220 215" },
  { from: 2, to: 3, path: "M 220 215 Q 280 170 300 175" },
  { from: 3, to: 4, path: "M 300 175 Q 350 240 360 290" },
];

function AutomateWorkflow({
  scrollYProgress,
  reduce,
}: {
  scrollYProgress: MotionValue<number>;
  reduce: boolean;
}) {
  const parallax = useCursorParallax(reduce, 16);
  // Fade in caption at stage 3
  const captionOpacity = useTransform(
    scrollYProgress,
    [0.68, 0.78],
    [0, 1]
  );
  const scrollHintOpacity = useTransform(
    scrollYProgress,
    [0.25, 0.35],
    [1, 0]
  );

  return (
    <div
      ref={parallax.ref}
      onMouseMove={parallax.onMove}
      onMouseLeave={parallax.onLeave}
      style={{
        position: "relative",
        width: "100%",
        maxWidth: 720,
        aspectRatio: "1 / 1",
        overflow: "hidden",
      }}
    >
      {/* Cool radial wash */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 50% 50%, rgba(20,20,18,0.10), transparent 70%)",
          opacity: 0.85,
          pointerEvents: "none",
        }}
      />

      <motion.svg
        viewBox="0 0 400 400"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          x: parallax.x,
          y: parallax.y,
        }}
        aria-hidden
      >
        {/* Edge paths (definitions for pulses) + node glow filter */}
        <defs>
          {WORKFLOW_EDGES.map(function definePath(e, i) {
            return <path key={i} id={`edge-${i}`} d={e.path} fill="none" />;
          })}
          <filter id="node-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feFlood floodColor="var(--color-parch)" floodOpacity="0.3" />
            <feComposite in2="blur" operator="in" result="glow" />
            <feMerge>
              <feMergeNode in="glow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Rendered edge strokes — thicker + higher opacity */}
        {WORKFLOW_EDGES.map(function drawEdge(e, i) {
          return (
            <path
              key={`s-${i}`}
              d={e.path}
              stroke="var(--color-ink-soft)"
              strokeOpacity="0.55"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
            />
          );
        })}

        {/* Data pulses along edges — 6px, staggered */}
        {!reduce
          ? WORKFLOW_EDGES.map(function pulseFor(_e, i) {
              return (
                <circle
                  key={`p-${i}`}
                  r="6"
                  fill="var(--color-ink)"
                >
                  <animateMotion
                    dur="3s"
                    repeatCount="indefinite"
                    begin={`${i * 0.7}s`}
                  >
                    <mpath xlinkHref={`#edge-${i}`} />
                  </animateMotion>
                </circle>
              );
            })
          : null}

        {/* Nodes with scroll-driven activation — larger + glow */}
        {WORKFLOW_NODES.map(function drawNode(n, i) {
          return (
            <WorkflowNode
              key={n.id}
              index={i}
              node={n}
              scrollYProgress={scrollYProgress}
            />
          );
        })}
      </motion.svg>

      {/* Node labels — HTML overlay for typography control */}
      {WORKFLOW_NODES.map(function drawLabel(n, i) {
        return (
          <WorkflowLabel
            key={n.id}
            index={i}
            node={n}
            scrollYProgress={scrollYProgress}
            parallaxX={parallax.x}
            parallaxY={parallax.y}
          />
        );
      })}

      {/* Stage 3 caption */}
      <motion.div
        className="type-small"
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 60,
          textAlign: "center",
          color: "var(--color-ink-soft)",
          opacity: captionOpacity,
          pointerEvents: "none",
        }}
      >
        System average: 12h/week returned
      </motion.div>

      <ScrollHint opacity={scrollHintOpacity} reduce={reduce} />
    </div>
  );
}

function WorkflowNode({
  index,
  node,
  scrollYProgress,
}: {
  index: number;
  node: (typeof WORKFLOW_NODES)[number];
  scrollYProgress: MotionValue<number>;
}) {
  const activateAt = 0.05 + index * 0.18;
  const opacity = useTransform(
    scrollYProgress,
    [activateAt - 0.05, activateAt + 0.05],
    [0.3, 1]
  );
  const strokeWidth = useTransform(
    scrollYProgress,
    [activateAt - 0.05, activateAt + 0.05],
    [1.5, 3]
  );
  const filterActive = useTransform(
    scrollYProgress,
    [activateAt - 0.05, activateAt + 0.05, 0.99, 1],
    [0, 1, 1, 1]
  );
  return (
    <>
      {/* Glow ring (visible once activated) */}
      <motion.circle
        cx={node.x}
        cy={node.y}
        r={20}
        fill="var(--color-parch)"
        style={{ opacity: filterActive, mixBlendMode: "screen" }}
        filter="url(#node-glow)"
      />
      <motion.circle
        cx={node.x}
        cy={node.y}
        r={20}
        fill="var(--color-bg)"
        stroke="var(--color-ink)"
        style={{ opacity, strokeWidth }}
      />
    </>
  );
}

function WorkflowLabel({
  index,
  node,
  scrollYProgress,
  parallaxX,
  parallaxY,
}: {
  index: number;
  node: (typeof WORKFLOW_NODES)[number];
  scrollYProgress: MotionValue<number>;
  parallaxX: MotionValue<number>;
  parallaxY: MotionValue<number>;
}) {
  const activateAt = 0.05 + index * 0.18;
  const opacity = useTransform(
    scrollYProgress,
    [activateAt - 0.05, activateAt + 0.05],
    [0.4, 1]
  );
  // Position in percentage of container (viewBox 0-400)
  const leftPct = (node.x / 400) * 100;
  const topPct = (node.y / 400) * 100;
  return (
    <motion.div
      style={{
        position: "absolute",
        left: `${leftPct}%`,
        top: `${topPct}%`,
        transform: "translate(-50%, 32px)",
        fontFamily: "var(--font-mono)",
        fontSize: 14,
        fontWeight: 500,
        letterSpacing: "0.16em",
        textTransform: "uppercase",
        color: "var(--color-ink)",
        opacity,
        x: parallaxX,
        y: parallaxY,
        pointerEvents: "none",
        whiteSpace: "nowrap",
      }}
    >
      {node.label}
    </motion.div>
  );
}

/* ── grow dashboard ─────────────────────────────────────────── */

const METRICS: Array<{
  label: string;
  end: number;
  format: (n: number) => string;
  delta: string;
}> = [
  {
    label: "Impressions",
    end: 48.2,
    format: (n) => `${n.toFixed(1)}K`,
    delta: "+42%",
  },
  {
    label: "Engagement",
    end: 6.8,
    format: (n) => `${n.toFixed(1)}%`,
    delta: "+18%",
  },
  {
    label: "CTR",
    end: 3.4,
    format: (n) => `${n.toFixed(1)}%`,
    delta: "+24%",
  },
  {
    label: "Sessions",
    end: 12.1,
    format: (n) => `${n.toFixed(1)}K`,
    delta: "+36%",
  },
];

function GrowDashboard({
  scrollYProgress,
  reduce,
}: {
  scrollYProgress: MotionValue<number>;
  reduce: boolean;
}) {
  const parallax = useCursorParallax(reduce, 12);
  const captionOpacity = useTransform(
    scrollYProgress,
    [0.68, 0.78],
    [0, 1]
  );
  const trendDraw = useTransform(scrollYProgress, [0.2, 0.9], [0, 1]);
  const trendStrokeDashoffset = useTransform(trendDraw, (v) => 1 - v);
  const scrollHintOpacity = useTransform(
    scrollYProgress,
    [0.25, 0.35],
    [1, 0]
  );

  return (
    <div
      ref={parallax.ref}
      onMouseMove={parallax.onMove}
      onMouseLeave={parallax.onLeave}
      style={{
        position: "relative",
        width: "100%",
        maxWidth: 720,
        aspectRatio: "1 / 1",
        overflow: "hidden",
      }}
    >
      {/* Warm ember radial wash */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 90% 80% at 50% 40%, rgba(200,175,120,0.24), transparent 75%)",
          pointerEvents: "none",
        }}
      />

      <motion.div
        style={{
          position: "relative",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 18,
          padding: 32,
          x: parallax.x,
          y: parallax.y,
        }}
      >
        {METRICS.map(function drawMetric(m, i) {
          return (
            <MetricCard
              key={m.label}
              metric={m}
              index={i}
              scrollYProgress={scrollYProgress}
            />
          );
        })}

        {/* Trend line under the grid */}
        <div style={{ gridColumn: "1 / -1", position: "relative", height: 110 }}>
          <svg
            viewBox="0 0 400 110"
            preserveAspectRatio="none"
            style={{ width: "100%", height: "100%", display: "block" }}
            aria-hidden
          >
            <defs>
              <linearGradient id="trend-fill" x1="0" y1="0" x2="0" y2="110">
                <stop offset="0%" stopColor="rgba(200,175,120,0.55)" />
                <stop offset="100%" stopColor="rgba(200,175,120,0)" />
              </linearGradient>
            </defs>
            <motion.path
              d="M 0 78 Q 80 68 140 48 T 260 26 T 400 8"
              fill="none"
              stroke="var(--color-ink)"
              strokeWidth="2.5"
              strokeLinecap="round"
              pathLength={1}
              strokeDasharray={1}
              style={{
                strokeDashoffset: reduce ? 0 : trendStrokeDashoffset,
              }}
            />
            <motion.path
              d="M 0 78 Q 80 68 140 48 T 260 26 T 400 8 L 400 110 L 0 110 Z"
              fill="url(#trend-fill)"
              style={{ opacity: trendDraw }}
            />
          </svg>
        </div>
      </motion.div>

      {/* Stage 3 caption */}
      <motion.div
        className="type-small"
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 60,
          textAlign: "center",
          color: "var(--color-ink-soft)",
          opacity: captionOpacity,
          pointerEvents: "none",
        }}
      >
        3 months in — compounding
      </motion.div>

      <ScrollHint opacity={scrollHintOpacity} reduce={reduce} />
    </div>
  );
}

function useMotionText<T>(
  mv: MotionValue<T>,
  format: (v: T) => string
): string {
  const [text, setText] = useState(function initial() {
    return format(mv.get());
  });
  useMotionValueEvent(mv, "change", function onChange(v) {
    setText(format(v as T));
  });
  return text;
}

function MetricCard({
  metric,
  index,
  scrollYProgress,
}: {
  metric: (typeof METRICS)[number];
  index: number;
  scrollYProgress: MotionValue<number>;
}) {
  const startAt = 0.15 + index * 0.06;
  const endAt = startAt + 0.4;
  const count = useTransform(
    scrollYProgress,
    [startAt, endAt],
    [0, metric.end]
  );
  const number = useMotionText(count, metric.format);

  const opacity = useTransform(
    scrollYProgress,
    [startAt, startAt + 0.08],
    [0.3, 1]
  );
  // Warm ember active tint as trend line passes underneath — activates while
  // this card's count is still climbing, then dims once the trend has swept past.
  const borderTint = useTransform(
    scrollYProgress,
    [startAt, startAt + 0.08, endAt, endAt + 0.05],
    [
      "1px solid rgba(20,20,18,0.08)",
      "1px solid rgba(200,175,120,0.7)",
      "1px solid rgba(200,175,120,0.7)",
      "1px solid rgba(20,20,18,0.14)",
    ]
  );

  return (
    <motion.div
      style={{
        background: "var(--color-bg)",
        border: borderTint,
        borderRadius: 10,
        padding: "26px 28px",
        opacity,
        boxShadow: "0 6px 18px rgba(20,20,18,0.05)",
      }}
    >
      <div
        className="type-eyebrow"
        style={{ color: "var(--color-muted)", marginBottom: 14 }}
      >
        {metric.label}
      </div>
      <div
        className="type-display-xl"
        style={{
          color: "var(--color-ink)",
          fontVariantNumeric: "tabular-nums",
          lineHeight: 1,
        }}
      >
        {number}
      </div>
      <div
        className="type-small"
        style={{
          color: "#B18544",
          marginTop: 12,
          fontFamily: "var(--font-mono)",
        }}
      >
        {metric.delta}
      </div>
    </motion.div>
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
