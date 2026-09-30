import { useEffect, useLayoutEffect, useRef, useState } from "react";
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
  ILLUSTRATIVE_LABEL,
  type PillarId,
  type Service,
} from "../../data/servicePillars";
import WindowChrome from "./build/WindowChrome";
import GhostCursor from "./build/GhostCursor";
import { useFocus } from "./build/camera";
import FocusSpotlight from "./build/FocusSpotlight";
import { DESIGN_SPECS } from "./build/BuildScreens";

/** Phase map inside one beat: caption in 0-0.15, canvas build 0.05-0.40,
 *  dwell 0.40-0.85 (29.25vh of a 65vh beat), caption out 0.85-1.00. */
const PHASE = { captionIn: 0.15, buildFrom: 0.05, buildTo: 0.4, dwellTo: 0.85 };

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
            gridTemplateColumns: "30% 66%",
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

          <div style={{ position: "relative", height: "84vh", maxHeight: 880 }}>
            {/* one label for the stage. Rendering it per layer meant two
                overlapping copies during every switch. */}
            <div
              className="type-eyebrow"
              style={{
                position: "absolute",
                top: -25,
                right: 2,
                fontFamily: "var(--font-mono)",
                color: "var(--color-muted-2)",
                pointerEvents: "none",
                zIndex: 30,
              }}
            >
              {ILLUSTRATIVE_LABEL}
            </div>
            <ScreenStack position={position} activeBeat={activeBeat} reduce={!!reduce} />
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

      <FittedName name={beat.service.name} />

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

/**
 * The service name, fitted to its column by MEASURING the widest word.
 *
 * CharReveal lays each word out as an inline-block, so a word wider than
 * the column overflows silently while still reporting one line (§5.5) —
 * which is exactly how "Post-launch" ended up 101px past its column and
 * inside the window at 1680. Line-count checks cannot see it; only
 * measuring the word can.
 */
function FittedName({ name }: { name: string }) {
  const hostRef = useRef<HTMLHeadingElement | null>(null);
  const [scale, setScale] = useState(1);

  useLayoutEffect(
    function fit() {
      function run() {
        const el = hostRef.current;
        if (!el) return;
        const col = el.clientWidth;
        if (!col) return;
        let widest = 0;
        el.querySelectorAll<HTMLElement>(":scope > span > span").forEach((w) => {
          if (w.querySelector("span")) {
            widest = Math.max(widest, w.getBoundingClientRect().width / scale);
          }
        });
        setScale(widest > col ? Math.max(0.62, col / widest) : 1);
      }
      run();
      window.addEventListener("resize", run);
      return function cleanup() {
        window.removeEventListener("resize", run);
      };
    },
    [name, scale]
  );

  return (
    <h2
      ref={hostRef}
      className="type-h1"
      style={{
        color: "var(--color-ink)",
        marginBottom: 20,
        fontSize: scale === 1 ? undefined : `calc(var(--type-h1-size) * ${scale})`,
      }}
    >
      <CharReveal text={name} />
    </h2>
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

/* ── the screen stack ───────────────────────────────────────────── */

/**
 * Only the active beat and its immediate neighbours are mounted. Five
 * dense product screens all live at once is a lot of DOM to keep
 * animating for no reason, and the ones two beats away are never visible
 * through the crossfade. Neighbours stay so a transition always has both
 * sides to draw.
 */
function ScreenStack({
  position,
  activeBeat,
  reduce,
}: {
  position: MotionValue<number>;
  activeBeat: number;
  reduce: boolean;
}) {
  return (
    <>
      {DESIGN_SPECS.map(function layer(spec, i) {
        if (Math.abs(i - activeBeat) > 1) return null;
        return (
          <ScreenLayer
            key={i}
            index={i}
            spec={spec}
            position={position}
            reduce={reduce}
          />
        );
      })}
    </>
  );
}

function ScreenLayer({
  index,
  spec,
  position,
  reduce,
}: {
  index: number;
  spec: (typeof DESIGN_SPECS)[number];
  position: MotionValue<number>;
  reduce: boolean;
}) {
  // local progress inside this beat
  const local = useTransform(position, (p) => {
    const t = p - index;
    return t < 0 ? 0 : t > 1 ? 1 : t;
  });

  // App-switch transition: the outgoing window slides and dissolves as
  // the next one comes up under it. Never a blank frame — both layers
  // are mounted through the whole hand-off.
  // App-switch, not a crossfade.
  //
  // Two windows both sitting at ~50% opacity over the cream page let the
  // page show through BOTH, which is what made the switch look grey and
  // disabled. Here the outgoing window never fades: the incoming one
  // slides in at full opacity ON TOP of it and occludes it, the way one
  // application window covers another. Nothing is ever semi-transparent
  // over the page, so there is no washed frame.
  // Near-hard cut, not a ramp. Sliding the incoming window in while it is
  // still semi-transparent let both windows read at once — the outgoing
  // one showed straight through it, offset, which is what made the switch
  // look like two broken frames. It now becomes opaque almost immediately
  // and slides in OVER the outgoing one, occluding it the way a real
  // window does.
  const opacity = useTransform(
    position,
    [index - 0.1, index - 0.088, index + 0.999, index + 1],
    [0, 1, 1, 0]
  );
  const x = useTransform(
    position,
    [index - 0.1, index, index + 0.9, index + 1],
    ["6%", "0%", "0%", "-6%"]
  );

  const focus = useFocus(local, reduce ? null : spec.camera);
  const ref = useScrollStyle<HTMLDivElement>(opacity);
  const Screen = spec.Screen;

  return (
    <div
      ref={ref}
      // later beats sit above earlier ones, so the incoming window covers
      // the outgoing one instead of blending with it
      style={{ position: "absolute", inset: 0, zIndex: index }}
    >
      <motion.div style={{ x, height: "100%" }}>
        <WindowChrome
          tone={spec.tone}
          url={spec.url}
          title={spec.title}
          showIllustrative={false}
        >
          {/* the focus move scales the CONTENT; the chrome never moves */}
          <motion.div
            style={{
              position: "absolute",
              inset: 0,
              scale: focus.scale,
              transformOrigin: focus.origin,
            }}
          >
            <Screen local={local} />
            {focus.rect ? (
              <FocusSpotlight rect={focus.rect} amount={focus.dim} />
            ) : null}
          </motion.div>
          <GhostCursor local={local} keys={spec.cursor} hidden={reduce} />
        </WindowChrome>
      </motion.div>
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

function ScreenForBeat({
  spec,
  local,
}: {
  spec: (typeof DESIGN_SPECS)[number];
  local: MotionValue<number>;
}) {
  const Screen = spec.Screen;
  return <Screen local={local} />;
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
  // The card plays its own beat once on entry and rests at the dwell —
  // the state the pinned stage holds. Under reduced motion it starts
  // there and never moves.
  const local = useTransform(scrollYProgress, function toLocal(t) {
    if (reduce) return PHASE.dwellTo;
    const c = t < 0 ? 0 : t > 1 ? 1 : t;
    return PHASE.buildFrom + c * (PHASE.dwellTo - PHASE.buildFrom);
  });
  const spec = DESIGN_SPECS[beat.index];

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

      <div style={{ marginTop: 26, height: 420 }}>
        <WindowChrome
          tone={spec.tone}
          url={spec.url}
          title={spec.title}
        >
          <ScreenForBeat spec={spec} local={local} />
        </WindowChrome>
      </div>
    </div>
  );
}
