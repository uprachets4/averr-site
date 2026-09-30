import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "motion/react";
import { ease } from "../../lib/motion";
import ImageFrame from "../case-study/ImageFrame";
import { caseStudies } from "../../data/caseStudies";
import {
  PILLAR_NAME,
  PILLAR_ORDER,
  PILLAR_SERVICES,
  PILLAR_TIMELINE,
  type PillarId,
  type Service,
} from "../../data/servicePillars";

/**
 * The Service Index — what /services leads with.
 *
 * The page used to open on three enormous pillar words with the actual
 * services reduced to chips, which told a visitor almost nothing about
 * what they could buy. This inverts it: the services are the page, and
 * the pillars are the labels they group under.
 *
 * Proof chips appear only where a case study's own copy shows that
 * service was delivered (`Service.proof`, verified in 17b). A row with no
 * verified pair renders no chip and reserves no space for one — an honest
 * absence reads better than a placeholder.
 */

/** Resolve a proof slug to the study it names, loudly in development if
 *  the data has drifted — a dead proof link would otherwise ship as a
 *  silently missing chip. */
function resolveProof(slug: string) {
  const study = caseStudies[slug];
  if (!study || study.status !== "live") {
    if (import.meta.env.DEV) {
      throw new Error(
        `[ServiceIndex] proof slug "${slug}" is missing or not live`
      );
    }
    return null;
  }
  return study;
}

export default function ServiceIndex() {
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLElement | null>(null);
  const groupRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [active, setActive] = useState<PillarId>("design");
  const [switcherOn, setSwitcherOn] = useState(false);

  // Which group the reader is in, and whether the switcher belongs on
  // screen at all. Both come from one observer pass over the groups plus
  // one over the section, so the bar can disappear after the index ends.
  useEffect(
    function trackGroups() {
      const io = new IntersectionObserver(
        function onEntries(entries) {
          const visible = entries
            .filter((e) => e.isIntersecting)
            .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
          if (visible.length) {
            const id = visible[0].target.getAttribute("data-pillar");
            if (id) setActive(id as PillarId);
          }
        },
        { rootMargin: "-140px 0px -55% 0px", threshold: 0 }
      );
      PILLAR_ORDER.forEach(function watch(p) {
        const el = groupRefs.current[p];
        if (el) io.observe(el);
      });
      return function cleanup() {
        io.disconnect();
      };
    },
    []
  );

  useEffect(function trackSection() {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      function onEntry(entries) {
        setSwitcherOn(entries.some((e) => e.isIntersecting));
      },
      { rootMargin: "-120px 0px -40% 0px", threshold: 0 }
    );
    io.observe(el);
    return function cleanup() {
      io.disconnect();
    };
  }, []);

  function jumpTo(p: PillarId) {
    const el = groupRefs.current[p];
    if (!el) return;
    el.scrollIntoView({
      behavior: reduce ? "auto" : "smooth",
      block: "start",
    });
  }

  return (
    <section
      ref={sectionRef}
      style={{
        backgroundColor: "var(--color-bg)",
        padding: "40px 0 120px",
        position: "relative",
      }}
    >
      <PillarSwitcher
        active={active}
        visible={switcherOn}
        onJump={jumpTo}
        reduce={reduce ?? false}
      />

      <div
        style={{
          width: "100%",
          maxWidth: "var(--container-wide)",
          margin: "0 auto",
        }}
      >
        {PILLAR_ORDER.map(function group(pillar) {
          return (
            <div
              key={pillar}
              data-pillar={pillar}
              ref={function set(el) {
                groupRefs.current[pillar] = el;
              }}
              style={{ scrollMarginTop: 130, paddingTop: 56 }}
            >
              <motion.div
                initial={{ opacity: reduce ? 1 : 0, y: reduce ? 0 : 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{
                  duration: reduce ? 0.01 : 0.5,
                  ease: ease.outQuart,
                }}
                className="type-eyebrow"
                style={{
                  fontFamily: "var(--font-mono)",
                  color: "var(--color-muted)",
                  display: "flex",
                  gap: 14,
                  alignItems: "baseline",
                  marginBottom: 20,
                }}
              >
                <span style={{ color: "var(--color-ink)" }}>
                  {PILLAR_NAME[pillar]}
                </span>
                <span>{PILLAR_TIMELINE[pillar]}</span>
              </motion.div>

              {PILLAR_SERVICES[pillar].map(function row(service, i) {
                return (
                  <ServiceRow
                    key={service.name}
                    service={service}
                    index={i}
                    reduce={reduce ?? false}
                  />
                );
              })}
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* ── one service ────────────────────────────────────────────────── */

function ServiceRow({
  service,
  index,
  reduce,
}: {
  service: Service;
  index: number;
  reduce: boolean;
}) {
  const [lit, setLit] = useState(false);
  const proofs = service.proof
    .map(resolveProof)
    .filter(function present(s): s is NonNullable<typeof s> {
      return !!s;
    });
  const hasProof = proofs.length > 0;
  const thumb = proofs[0];

  return (
    <motion.div
      className="svc-row"
      initial={reduce ? undefined : "rest"}
      whileInView={reduce ? undefined : "in"}
      viewport={{ once: true, amount: 0.5 }}
      variants={
        reduce
          ? undefined
          : {
              rest: {},
              in: { transition: { delay: index * 0.06 } },
            }
      }
      onHoverStart={function on() {
        setLit(true);
      }}
      onHoverEnd={function off() {
        setLit(false);
      }}
      onFocusCapture={function onF() {
        setLit(true);
      }}
      onBlurCapture={function offF() {
        setLit(false);
      }}
      style={{
        position: "relative",
        borderTop: "1px solid rgba(20,20,18,0.12)",
        padding: "26px 0",
      }}
    >
      <div className="svc-row__grid">
        {/* name */}
        <div style={{ overflow: "hidden" }}>
          <motion.div
            variants={
              reduce
                ? undefined
                : {
                    rest: { y: "105%" },
                    in: {
                      y: "0%",
                      transition: { duration: 0.6, ease: ease.outQuart },
                    },
                  }
            }
          >
            <motion.div
              className="type-h2"
              animate={{ x: lit && !reduce ? 8 : 0 }}
              transition={{ duration: 0.35, ease: ease.outQuart }}
              style={{ color: "var(--color-ink)" }}
            >
              {service.name}
            </motion.div>
          </motion.div>
        </div>

        {/* outcome + proof */}
        <motion.div
          variants={
            reduce
              ? undefined
              : {
                  rest: { opacity: 0, y: 10 },
                  in: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.6, ease: ease.outQuart },
                  },
                }
          }
        >
          <motion.p
            className="type-body-lg"
            animate={{
              color:
                lit && !reduce ? "var(--color-ink)" : "var(--color-muted)",
            }}
            transition={{ duration: 0.3, ease: ease.outQuart }}
            style={{ margin: 0 }}
          >
            {service.outcome}
          </motion.p>

          {hasProof ? (
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 14,
                marginTop: 14,
              }}
            >
              {proofs.map(function chip(study) {
                return (
                  <Link
                    key={study.slug}
                    to={`/work/${study.slug}`}
                    className="type-eyebrow"
                    style={{
                      fontFamily: "var(--font-mono)",
                      color: "var(--color-muted-2)",
                      textDecoration: "none",
                      borderBottom: "1px solid rgba(20,20,18,0.2)",
                      paddingBottom: 2,
                    }}
                  >
                    {`Seen in: ${study.client} →`}
                  </Link>
                );
              })}
            </div>
          ) : null}
        </motion.div>
      </div>

      {/* Proof thumbnail — desktop only, and only in the third track, so it
          can never reach the name or the outcome copy. */}
      {thumb && thumb.heroImage ? (
        <motion.div
          aria-hidden
          className="svc-row__thumb"
          animate={{
            opacity: lit && !reduce ? 1 : 0,
            y: lit && !reduce ? 0 : 8,
          }}
          transition={{ duration: 0.35, ease: ease.outQuart }}
          style={{ pointerEvents: "none" }}
        >
          <ImageFrame variant="card">
            <img
              src={thumb.heroImage}
              alt=""
              loading="lazy"
              decoding="async"
              style={{
                display: "block",
                width: "100%",
                height: "auto",
                objectFit: "contain",
              }}
            />
          </ImageFrame>
        </motion.div>
      ) : null}

      <style>{`
        .svc-row__grid {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) 260px;
          gap: 40px;
          align-items: start;
        }
        .svc-row__thumb {
          position: absolute;
          right: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 240px;
        }
        @media (max-width: 1100px) {
          .svc-row__grid {
            grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
          }
          .svc-row__thumb { display: none; }
        }
        @media (max-width: 760px) {
          .svc-row__grid {
            grid-template-columns: minmax(0, 1fr);
            gap: 12px;
          }
        }
      `}</style>
    </motion.div>
  );
}

/* ── the sticky pillar switcher ─────────────────────────────────── */

function PillarSwitcher({
  active,
  visible,
  onJump,
  reduce,
}: {
  active: PillarId;
  visible: boolean;
  onJump: (p: PillarId) => void;
  reduce: boolean;
}) {
  return (
    <motion.div
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: reduce ? 0 : 0.3, ease: ease.outQuart }}
      style={{
        position: "sticky",
        top: 78,
        zIndex: 20,
        pointerEvents: visible ? "auto" : "none",
      }}
    >
      <div
        className="svc-switch"
        style={{
          width: "100%",
          maxWidth: "var(--container-wide)",
          margin: "0 auto",
        }}
      >
        <div className="svc-switch__inner">
          {PILLAR_ORDER.map(function tab(p) {
            const on = p === active;
            return (
              <button
                key={p}
                type="button"
                onClick={function jump() {
                  onJump(p);
                }}
                className="type-eyebrow svc-switch__tab"
                style={{
                  fontFamily: "var(--font-mono)",
                  color: on ? "var(--color-parch)" : "var(--color-muted)",
                  background: on ? "var(--color-dark)" : "transparent",
                }}
              >
                {PILLAR_NAME[p]}
              </button>
            );
          })}
        </div>
      </div>

      <style>{`
        .svc-switch__inner {
          display: inline-flex;
          gap: 4px;
          padding: 5px;
          border-radius: 999px;
          background: rgba(244,240,230,0.82);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(20,20,18,0.1);
        }
        .svc-switch__tab {
          border: 0;
          cursor: pointer;
          padding: 8px 16px;
          border-radius: 999px;
          transition: background 260ms ease, color 260ms ease;
        }
        @media (max-width: 760px) {
          .svc-switch__inner {
            display: flex;
            width: 100%;
            overflow-x: auto;
            scroll-snap-type: x mandatory;
            -webkit-overflow-scrolling: touch;
            border-radius: 999px;
          }
          .svc-switch__tab {
            scroll-snap-align: start;
            flex: 0 0 auto;
          }
        }
      `}</style>
    </motion.div>
  );
}
