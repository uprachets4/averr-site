import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import { ease } from "../../lib/motion";
import { useScrollStyle } from "../../lib/useScrollStyle";
import { CharReveal } from "../CharReveal";
import { caseStudies } from "../../data/caseStudies";
import {
  PILLAR_NAME,
  PILLAR_ORDER,
  PILLAR_SERVICES,
  PILLAR_TIMELINE,
  type PillarId,
  type Service,
} from "../../data/servicePillars";
import { BrowserFrame, PHASE, SceneStack } from "./BuildCanvas";

/**
 * "Watch us build your business" — the pinned stage.
 *
 * One continuous scene. A generic business's site is built on the canvas
 * as you scroll, and each of the studio's services is the caption of the
 * step happening on screen. The story is the list: no service is named
 * twice on the page.
 *
 * 17c-1 builds the framework plus the Design chapter (beats 1–5).
 * Automate and Grow appear in the rail as upcoming and are built in
 * 17c-2.
 */

/** Beats currently rendered on the canvas. The rail still shows all 16. */
const LIVE_PILLARS: PillarId[] = ["design"];

export type Beat = { pillar: PillarId; service: Service; index: number };

function buildBeats(pillars: PillarId[]): Beat[] {
  const out: Beat[] = [];
  pillars.forEach(function pillar(p) {
    PILLAR_SERVICES[p].forEach(function service(s) {
      out.push({ pillar: p, service: s, index: out.length });
    });
  });
  return out;
}

export const LIVE_BEATS = buildBeats(LIVE_PILLARS);
const ALL_BEATS = buildBeats(PILLAR_ORDER);

/* Pin math (§5.4). A 100vh sticky child in a wrapper of height H pins for
 * H − 100vh, so the wrapper carries one extra viewport or the last beat
 * never gets pinned time.
 *
 *   beat            = 65vh
 *   travel          = beats × 65vh          (325vh for the five Design beats)
 *   wrapper         = travel + 100vh        (425vh)
 *
 * 17c-2/3 target, with the two chapter transitions at 80vh:
 *   travel  = 16 × 65 + 2 × 80 = 1200vh
 *   wrapper = 1300vh
 */
const BEAT_VH = 65;

function resolveProof(slug: string) {
  const study = caseStudies[slug];
  if (!study || study.status !== "live") {
    if (import.meta.env.DEV) {
      throw new Error(`[ServicesBuild] proof slug "${slug}" missing or not live`);
    }
    return null;
  }
  return study;
}

export default function ServicesBuild() {
  const reduce = useReducedMotion();
  const [isDesktop, setIsDesktop] = useState(true);
  useEffect(function detect() {
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

  const pinned = isDesktop && !reduce;

  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ["start start", "end end"],
  });

  const count = LIVE_BEATS.length;
  // Continuous float across the beats — never an index that flips on its
  // own timer (§5.13). Everything downstream derives from this one value.
  const position = useTransform(scrollYProgress, [0, 1], [0, count]);

  const [activeBeat, setActiveBeat] = useState(0);
  useMotionValueEvent(position, "change", function track(p) {
    const i = Math.min(count - 1, Math.max(0, Math.floor(p)));
    setActiveBeat(i);
  });

  function jumpToBeat(i: number) {
    const el = wrapperRef.current;
    if (!el) return;
    // Land in the beat's dwell, not on its boundary.
    const top =
      el.offsetTop + ((i + (PHASE.buildTo + PHASE.dwellTo) / 2) / count) *
        (el.offsetHeight - window.innerHeight);
    window.scrollTo({ top, behavior: reduce ? "auto" : "smooth" });
  }

  if (!pinned) {
    return <BuildStacked reduce={!!reduce} />;
  }

  return (
    <div
      ref={wrapperRef}
      style={{
        position: "relative",
        height: `${count * BEAT_VH + 100}vh`,
        backgroundColor: "var(--color-bg)",
      }}
    >
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <BuildRail
          activeBeat={activeBeat}
          onJump={jumpToBeat}
          liveCount={count}
        />

        <div
          style={{
            flex: 1,
            width: "100%",
            maxWidth: "var(--container-wide)",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "38% 58%",
            gap: "4%",
            alignItems: "center",
            paddingBottom: 40,
          }}
        >
          {/* caption — remounted per beat so CharReveal plays on arrival.
              The outgoing caption has already faded to 0 by the time the
              index changes, so they never overlap (the /work film rule). */}
          <BuildCaption
            key={activeBeat}
            beat={LIVE_BEATS[activeBeat]}
            position={position}
          />

          <div style={{ position: "relative" }}>
            <BrowserFrame>
              <SceneStack position={position} beatCount={count} />
            </BrowserFrame>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── caption ────────────────────────────────────────────────────── */

function BuildCaption({
  beat,
  position,
}: {
  beat: Beat;
  position: MotionValue<number>;
}) {
  const i = beat.index;
  // Fades out across the beat's last 15%; the next caption mounts after.
  const opacity = useTransform(
    position,
    [i + PHASE.dwellTo, i + 1],
    [1, 0]
  );
  const ref = useScrollStyle<HTMLDivElement>(opacity);
  const proofs = beat.service.proof
    .map(resolveProof)
    .filter(function present(s): s is NonNullable<typeof s> {
      return !!s;
    });

  return (
    <div ref={ref}>
      <div
        className="type-eyebrow"
        style={{
          fontFamily: "var(--font-mono)",
          color: "var(--color-muted)",
          display: "flex",
          gap: 12,
          marginBottom: 22,
        }}
      >
        <span style={{ color: "var(--color-ink)" }}>
          {PILLAR_NAME[beat.pillar]}
        </span>
        <span>{PILLAR_TIMELINE[beat.pillar]}</span>
      </div>

      <h2
        className="type-display-l"
        style={{ color: "var(--color-ink)", marginBottom: 20 }}
      >
        <CharReveal text={beat.service.name} />
      </h2>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: ease.outQuart, delay: 0.25 }}
        className="type-body-lg"
        style={{ color: "var(--color-muted)", margin: 0, maxWidth: 440 }}
      >
        {beat.service.outcome}
      </motion.p>

      {proofs.length ? (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: ease.outQuart, delay: 0.4 }}
          style={{ display: "flex", flexWrap: "wrap", gap: 14, marginTop: 20 }}
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
        </motion.div>
      ) : null}
    </div>
  );
}

/* ── the rail, which is also the page's index ───────────────────── */

function BuildRail({
  activeBeat,
  onJump,
  liveCount,
}: {
  activeBeat: number;
  onJump: (i: number) => void;
  liveCount: number;
}) {
  const activePillar = ALL_BEATS[activeBeat]?.pillar ?? "design";

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "var(--container-wide)",
        margin: "0 auto",
        paddingTop: 96,
        paddingBottom: 18,
      }}
    >
      <div style={{ display: "flex", gap: 28, alignItems: "flex-end" }}>
        {PILLAR_ORDER.map(function chapter(p) {
          const beats = ALL_BEATS.filter((b) => b.pillar === p);
          const on = p === activePillar;
          const upcoming = !LIVE_PILLARS.includes(p);
          return (
            <div key={p} style={{ flex: beats.length }}>
              <div
                className="type-eyebrow"
                style={{
                  fontFamily: "var(--font-mono)",
                  color: on ? "var(--color-ink)" : "var(--color-muted-2)",
                  marginBottom: 8,
                  opacity: upcoming ? 0.55 : 1,
                  transition: "color 300ms ease",
                }}
              >
                {PILLAR_NAME[p]}
                {upcoming ? " · soon" : ""}
              </div>
              <div style={{ display: "flex", gap: 4 }}>
                {beats.map(function tick(b) {
                  const live = b.index < liveCount;
                  const isActive = b.index === activeBeat;
                  const isDone = b.index < activeBeat;
                  return (
                    <button
                      key={b.service.name}
                      type="button"
                      className="build-tick"
                      disabled={!live}
                      aria-label={b.service.name}
                      onClick={function jump() {
                        if (live) onJump(b.index);
                      }}
                      style={{
                        flex: 1,
                        height: 3,
                        minWidth: 0,
                        border: 0,
                        padding: 0,
                        borderRadius: 2,
                        cursor: live ? "pointer" : "default",
                        background: isActive
                          ? "var(--color-ink)"
                          : isDone
                          ? "rgba(20,20,18,0.45)"
                          : live
                          ? "rgba(20,20,18,0.16)"
                          : "rgba(20,20,18,0.08)",
                        transition: "background 300ms ease",
                      }}
                    >
                      <span className="build-tick__name">{b.service.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <style>{`
        .build-tick { position: relative; }
        .build-tick__name {
          position: absolute;
          left: 50%;
          top: 10px;
          transform: translateX(-50%);
          white-space: nowrap;
          font-family: var(--font-mono);
          font-size: 10px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--color-ink);
          background: var(--color-bg);
          border: 1px solid rgba(20,20,18,0.12);
          border-radius: 4px;
          padding: 3px 7px;
          opacity: 0;
          pointer-events: none;
          transition: opacity 180ms ease;
          z-index: 4;
        }
        .build-tick:hover .build-tick__name,
        .build-tick:focus-visible .build-tick__name { opacity: 1; }
      `}</style>
    </div>
  );
}

/* ── mobile / reduced motion ────────────────────────────────────── */

function BuildStacked({ reduce }: { reduce: boolean }) {
  return (
    <div style={{ backgroundColor: "var(--color-bg)", padding: "40px 24px 96px" }}>
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <div
          className="type-eyebrow"
          style={{
            fontFamily: "var(--font-mono)",
            color: "var(--color-muted-2)",
            display: "flex",
            gap: 10,
            flexWrap: "wrap",
            marginBottom: 32,
          }}
        >
          {PILLAR_ORDER.map(function chip(p) {
            const upcoming = !LIVE_PILLARS.includes(p);
            return (
              <span
                key={p}
                style={{
                  padding: "6px 12px",
                  borderRadius: 999,
                  border: "1px solid rgba(20,20,18,0.12)",
                  opacity: upcoming ? 0.5 : 1,
                }}
              >
                {PILLAR_NAME[p]}
              </span>
            );
          })}
        </div>

        {LIVE_BEATS.map(function card(beat) {
          return <StackedBeat key={beat.service.name} beat={beat} reduce={reduce} />;
        })}
      </div>
    </div>
  );
}

function StackedBeat({ beat, reduce }: { beat: Beat; reduce: boolean }) {
  const ref = useRef<HTMLDivElement | null>(null);
  // Each card plays its own beat once on entry. The canvas reads the same
  // position scale as the pinned stage, so a card shows exactly the state
  // that beat ends on.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "start 0.35"],
  });
  const local = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const position = useTransform(local, function toPosition(t) {
    if (reduce) return beat.index + PHASE.dwellTo;
    return beat.index + PHASE.buildFrom + t * (PHASE.dwellTo - PHASE.buildFrom);
  });

  const proofs = beat.service.proof
    .map(resolveProof)
    .filter(function present(s): s is NonNullable<typeof s> {
      return !!s;
    });

  return (
    <div ref={ref} style={{ marginBottom: 72 }}>
      <div
        className="type-eyebrow"
        style={{
          fontFamily: "var(--font-mono)",
          color: "var(--color-muted)",
          display: "flex",
          gap: 12,
          marginBottom: 14,
        }}
      >
        <span style={{ color: "var(--color-ink)" }}>
          {PILLAR_NAME[beat.pillar]}
        </span>
        <span>{PILLAR_TIMELINE[beat.pillar]}</span>
      </div>

      <h2 className="type-h2" style={{ color: "var(--color-ink)", marginBottom: 12 }}>
        {beat.service.name}
      </h2>
      <p
        className="type-body-lg"
        style={{ color: "var(--color-muted)", margin: "0 0 14px" }}
      >
        {beat.service.outcome}
      </p>
      {proofs.length ? (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 14, marginBottom: 20 }}>
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

      <div style={{ marginTop: 26 }}>
        <BrowserFrame>
          <SceneStack position={position} beatCount={LIVE_BEATS.length} />
        </BrowserFrame>
      </div>
    </div>
  );
}
