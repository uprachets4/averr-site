import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import { ease } from "../lib/motion";
import { useScrollStyle } from "../lib/useScrollStyle";
import { CharRevealInView } from "./CharReveal";
import MagneticCTA from "./MagneticCTA";
import AverrMark from "./AverrMark";
import ImageFrame from "./case-study/ImageFrame";
import { SCENES, SCENE_TWO_SHOTS, SCENE_THREE_SHOT } from "../data/homeScenes";

const MOBILE_QUERY = "(max-width: 767px)";

function useIsMobile() {
  const [mobile, setMobile] = useState(false);
  useEffect(function watch() {
    const mq = window.matchMedia(MOBILE_QUERY);
    function onChange(e: MediaQueryListEvent) {
      setMobile(e.matches);
    }
    setMobile(mq.matches);
    mq.addEventListener("change", onChange);
    return function cleanup() {
      mq.removeEventListener("change", onChange);
    };
  }, []);
  return mobile;
}

/* ── shared bits ───────────────────────────────────────────────────── */

function SceneHeading({
  scene,
  style,
}: {
  scene: (typeof SCENES)[number];
  style?: React.CSSProperties;
}) {
  return (
    <div style={style}>
      <div
        className="type-eyebrow"
        style={{ color: "var(--color-ink-soft)", marginBottom: 20 }}
      >
        {scene.eyebrow}
      </div>
      <h2 className="type-h1" style={{ color: "var(--color-ink)", marginBottom: 24 }}>
        <CharRevealInView
          segments={scene.segments}
          style={{ color: "var(--color-ink)" }}
        />
      </h2>
      <p
        className="type-body-lg measure-body"
        style={{ color: "var(--color-ink)", margin: 0 }}
      >
        {scene.body}
      </p>
    </div>
  );
}

/** A template card, drawn in CSS. No images — that is the whole point. */
function SkeletonCard({ small }: { small?: boolean }) {
  return (
    <div
      aria-hidden
      style={{
        background: "var(--color-bg-alt)",
        border: "1px solid var(--hair)",
        borderRadius: 10,
        padding: small ? 12 : 18,
        display: "flex",
        flexDirection: "column",
        gap: small ? 8 : 12,
      }}
    >
      <div
        style={{
          height: small ? 48 : 86,
          borderRadius: 6,
          background: "var(--hair-hi)",
        }}
      />
      {[100, 88, 64].map(function drawLine(pct) {
        return (
          <div
            key={pct}
            style={{
              height: small ? 5 : 7,
              width: `${pct}%`,
              borderRadius: 999,
              background: "var(--hair)",
            }}
          />
        );
      })}
      <div
        style={{
          marginTop: "auto",
          height: small ? 16 : 22,
          width: small ? 52 : 72,
          borderRadius: 999,
          background: "var(--hair-hi)",
        }}
      />
    </div>
  );
}

/* ── scene 1 — six identical templates, moving in lockstep ─────────── */

function SceneOne() {
  const reduce = useReducedMotion();
  const mobile = useIsMobile();
  const ref = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  // one shared y for all six — identical motion, identical cards
  const lockstepY = useTransform(scrollYProgress, [0, 1], [40, -40]);

  return (
    <section
      ref={ref}
      style={{
        position: "relative",
        backgroundColor: "var(--color-bg)",
        padding: "112px 0",
      }}
    >
      <div
        style={{
          maxWidth: "var(--container-wide)",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: mobile ? "1fr" : "40% 1fr",
          gap: mobile ? 48 : 64,
          alignItems: "center",
        }}
      >
        <SceneHeading scene={SCENES[0]} />

        <motion.div
          style={{
            display: "grid",
            gridTemplateColumns: mobile ? "1fr 1fr" : "repeat(3, 1fr)",
            gap: mobile ? 12 : 20,
            y: reduce ? 0 : lockstepY,
          }}
        >
          {Array.from({ length: 6 }).map(function drawCard(_, i) {
            return <SkeletonCard key={i} small={mobile} />;
          })}
        </motion.div>
      </div>
    </section>
  );
}

/* ── scene 2 — lockstep breaks, templates become real work ─────────── */

const BREAK_Y = [-28, 18, -14, 26, -22, 12];
const BREAK_ROT = [-1.6, 1.2, -1, 1.8, -1.4, 1.1];

function SceneTwoSlot({
  index,
  progress,
  mobile,
  reduce,
}: {
  index: number;
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
  mobile: boolean;
  reduce: boolean;
}) {
  // each slot swaps at its own moment — one by one, not together
  const start = 0.3 + index * 0.07;
  const shotOpacity = useTransform(progress, [start, start + 0.1], [0, 1]);
  const skeletonOpacity = useTransform(progress, [start, start + 0.1], [1, 0]);
  const y = useTransform(progress, [0, 1], [0, BREAK_Y[index]]);

  const shotRef = useScrollStyle<HTMLDivElement>(shotOpacity);
  const skelRef = useScrollStyle<HTMLDivElement>(skeletonOpacity);

  const shot = SCENE_TWO_SHOTS[index];
  const isStudioSlot = index >= SCENE_TWO_SHOTS.length;

  // On mobile and under reduced motion the slots settle on entry rather than
  // scrubbing with scroll.
  const settled = mobile || reduce;

  return (
    <motion.div
      style={{
        position: "relative",
        y: settled ? 0 : y,
        rotate: settled ? 0 : BREAK_ROT[index],
      }}
      initial={settled ? undefined : false}
      whileInView={settled ? { opacity: 1 } : undefined}
      viewport={settled ? { once: true, amount: 0.3 } : undefined}
    >
      {/* the template it used to be */}
      {!settled ? (
        <div ref={skelRef} style={{ position: "absolute", inset: 0 }}>
          <SkeletonCard small={mobile} />
        </div>
      ) : null}

      {/* what it became */}
      <div ref={settled ? undefined : shotRef} style={{ opacity: settled ? 1 : 0 }}>
        {isStudioSlot ? (
          <div
            style={{
              border: "1px solid var(--hair)",
              borderRadius: 10,
              background: "var(--color-bg-alt)",
              aspectRatio: "16 / 10",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
              color: "var(--color-ink)",
            }}
          >
            {index === 4 ? (
              <AverrMark variant="nav" />
            ) : (
              <span
                className="type-eyebrow"
                style={{ fontFamily: "var(--font-mono)", color: "var(--color-muted)" }}
              >
                YOURS NEXT
              </span>
            )}
          </div>
        ) : (
          <>
            <div style={{ aspectRatio: "16 / 10", overflow: "hidden", borderRadius: 10 }}>
              <ImageFrame variant="gallery">
                <img
                  src={shot.src}
                  alt={shot.alt}
                  width={1680}
                  height={1050}
                  loading="lazy"
                  decoding="async"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </ImageFrame>
            </div>
            <div
              className="type-eyebrow"
              style={{
                fontFamily: "var(--font-mono)",
                color: "var(--color-muted)",
                marginTop: 10,
              }}
            >
              {shot.client}
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
}

function SceneTwo() {
  const reduce = useReducedMotion();
  const mobile = useIsMobile();
  const ref = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  return (
    <section
      ref={ref}
      style={{
        position: "relative",
        backgroundColor: "var(--color-bg)",
        padding: "112px 0",
      }}
    >
      <div style={{ maxWidth: "var(--container-wide)", margin: "0 auto" }}>
        {/* headline full-width on top — deliberately not a mirror of scene 1 */}
        <SceneHeading scene={SCENES[1]} style={{ marginBottom: 64 }} />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: mobile ? "1fr 1fr" : "repeat(3, 1fr)",
            gap: mobile ? 12 : 24,
          }}
        >
          {Array.from({ length: 6 }).map(function drawSlot(_, i) {
            return (
              <SceneTwoSlot
                key={i}
                index={i}
                progress={scrollYProgress}
                mobile={mobile}
                reduce={!!reduce}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ── scene 3 — the result, opening to full bleed ───────────────────── */

function SceneThree() {
  const reduce = useReducedMotion();
  const mobile = useIsMobile();
  const ref = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"],
  });

  const still = mobile || reduce;
  const width = useTransform(scrollYProgress, [0, 1], ["72%", "100%"]);
  const radius = useTransform(scrollYProgress, [0, 1], [24, 8]);

  return (
    <section
      ref={ref}
      style={{
        position: "relative",
        backgroundColor: "var(--color-bg)",
        padding: "112px 0 128px",
      }}
    >
      <div style={{ maxWidth: "var(--container-wide)", margin: "0 auto" }}>
        <SceneHeading scene={SCENES[2]} style={{ marginBottom: 32 }} />

        <div style={{ marginBottom: 56 }}>
          <MagneticCTA to="/work" variant="text" size="md">
            See the work
          </MagneticCTA>
        </div>

        <motion.div
          style={{
            width: still ? "100%" : width,
            borderRadius: still ? 8 : radius,
            overflow: "hidden",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          <img
            src={SCENE_THREE_SHOT.src}
            alt={SCENE_THREE_SHOT.alt}
            width={1680}
            height={931}
            loading="lazy"
            decoding="async"
            style={{ width: "100%", height: "auto", display: "block" }}
          />
        </motion.div>
      </div>
    </section>
  );
}

export default function ThreeScenes() {
  return (
    <>
      <SceneOne />
      <SceneTwo />
      <SceneThree />
    </>
  );
}

export { ease };
