import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { ease, spring } from "../../lib/motion";
import PillHl from "../PillHl";
import type { CaseStudy } from "../../data/caseStudies";
import ImageFrame from "./ImageFrame";

type Props = Pick<
  CaseStudy,
  | "hero"
  | "client"
  | "pillars"
  | "sector"
  | "year"
  | "heroImage"
  | "heroImages"
  | "heroCaption"
>;

function splitOnPill(thesis: string, pill: string): [string, string, string] {
  const i = thesis.indexOf(pill);
  if (i < 0) return [thesis, "", ""];
  return [thesis.slice(0, i), pill, thesis.slice(i + pill.length)];
}

export default function CaseHero({
  hero,
  client,
  pillars,
  sector,
  year,
  heroImage,
  heroImages,
  heroCaption,
}: Props) {
  const reduce = useReducedMotion();
  const [before, pill, after] = splitOnPill(hero.thesis, hero.thesisPill);

  // Cluster takes precedence over single heroImage when 2-3 images provided.
  const clusterImages =
    heroImages && heroImages.length >= 2 && heroImages.length <= 3
      ? heroImages
      : null;
  const singleImage = !clusterImages && heroImage ? heroImage : null;

  return (
    <section
      style={{
        position: "relative",
        overflow: "hidden",
        backgroundColor: "var(--color-bg)",
        padding: "180px 40px 100px",
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
      <div
        className="grain-light"
        aria-hidden="true"
        style={{ opacity: 0.05 }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 2,
          maxWidth: 1200,
          margin: "0 auto",
        }}
      >
        <motion.div
          initial={{ opacity: reduce ? 1 : 0, y: reduce ? 0 : 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: reduce ? 0 : 0.5,
            ease: ease.outQuart,
            delay: reduce ? 0 : 0.2,
          }}
          className="type-eyebrow"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            color: "var(--color-muted)",
            marginBottom: 32,
          }}
        >
          <span style={{ height: 1, width: 20, background: "currentColor", opacity: 0.6 }} />
          {hero.eyebrow}
          <span style={{ height: 1, width: 20, background: "currentColor", opacity: 0.6 }} />
        </motion.div>

        <motion.div
          initial={{ opacity: reduce ? 1 : 0, y: reduce ? 0 : 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: reduce ? 0 : 0.5,
            ease: ease.outQuart,
            delay: reduce ? 0 : 0.3,
          }}
          className="type-eyebrow"
          style={{
            color: "var(--color-muted-2)",
            marginBottom: 24,
          }}
        >
          {client}
        </motion.div>

        <motion.h1
          initial={{ opacity: reduce ? 1 : 0, y: reduce ? 0 : 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: reduce ? 0 : 0.7,
            ease: ease.outQuart,
            delay: reduce ? 0 : 0.4,
          }}
          className="type-display-l"
          style={{
            color: "var(--color-ink)",
            marginBottom: 48,
            maxWidth: 1080,
          }}
        >
          {before}
          {pill ? (
            <motion.span
              initial={{ opacity: reduce ? 1 : 0, scale: reduce ? 1 : 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: reduce ? 0 : 0.5,
                ease: ease.bounce,
                delay: reduce ? 0 : 0.9,
              }}
              style={{ display: "inline-block" }}
            >
              <PillHl>{pill}</PillHl>
            </motion.span>
          ) : null}
          {after}
        </motion.h1>

        <motion.p
          initial={{ opacity: reduce ? 1 : 0, y: reduce ? 0 : 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: reduce ? 0 : 0.6,
            ease: ease.outQuart,
            delay: reduce ? 0 : 1.1,
          }}
          className="type-body-lg"
          style={{
            color: "var(--color-muted)",
            maxWidth: 720,
            marginBottom: 64,
          }}
        >
          {hero.kicker}
        </motion.p>

        <motion.div
          initial={{ opacity: reduce ? 1 : 0, y: reduce ? 0 : 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: reduce ? 0 : 0.6,
            ease: ease.outQuart,
            delay: reduce ? 0 : 1.3,
          }}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            gap: 40,
            paddingTop: 32,
            borderTop: "1px solid rgba(20,20,18,0.10)",
          }}
          className="case-meta-grid"
        >
          <Meta label="Pillars" value={pillars.join(" · ")} />
          <Meta label="Sector" value={sector} />
          <Meta label="Year" value={year} />
        </motion.div>

        {clusterImages ? (
          <HeroCluster
            images={clusterImages}
            client={client}
            caption={heroCaption}
            reduce={!!reduce}
          />
        ) : singleImage ? (
          <HeroImage src={singleImage} client={client} reduce={!!reduce} />
        ) : null}
      </div>

      <style>{`
        @media (max-width: 720px) {
          .case-meta-grid {
            grid-template-columns: 1fr !important;
            gap: 20px !important;
          }
        }
      `}</style>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Single-image hero (backwards compatibility)
   ═══════════════════════════════════════════════════════════════ */

function HeroImage({
  src,
  client,
  reduce,
}: {
  src: string;
  client: string;
  reduce: boolean;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "-20%"]);

  return (
    <motion.figure
      ref={ref}
      initial={{ opacity: reduce ? 1 : 0, scale: reduce ? 1 : 1.03 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{
        duration: reduce ? 0 : 1.2,
        ease: ease.outExpo,
      }}
      style={{
        marginTop: 64,
        y: reduce ? "0%" : imageY,
      }}
    >
      <ImageFrame variant="hero">
        <img
          src={src}
          alt={`${client} overview screen`}
          loading="eager"
          decoding="async"
        />
      </ImageFrame>
    </motion.figure>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Hero cluster — 2-3 rotated hanging cards + ambient marks
   ═══════════════════════════════════════════════════════════════ */

function HeroCluster({
  images,
  client,
  caption,
  reduce,
}: {
  images: string[];
  client: string;
  caption?: CaseStudy["heroCaption"];
  reduce: boolean;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
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

  // Cursor parallax — cluster-wide, per-card weighted below.
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const sX = useSpring(rawX, spring.soft);
  const sY = useSpring(rawY, spring.soft);

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    if (reduce || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    rawX.set(px * 32);
    rawY.set(py * 32);
  }
  function onLeave() {
    rawX.set(0);
    rawY.set(0);
  }

  // Mobile falls back to single centered middle-card image.
  if (!isDesktop) {
    return (
      <div style={{ position: "relative", marginTop: 64 }}>
        <AmbientMarks reduce={reduce} />
        <MobileCluster images={images} client={client} reduce={reduce} />
        {caption ? <ClusterCaption caption={caption} reduce={reduce} /> : null}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{
        position: "relative",
        marginTop: 72,
        minHeight: "min(70vh, 640px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Warm gradient wash */}
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
            "radial-gradient(circle at 50% 50%, rgba(237,233,226,0.55), transparent 60%)",
          opacity: 0.7,
          pointerEvents: "none",
        }}
        animate={reduce ? undefined : { rotate: 360 }}
        transition={{ duration: 90, repeat: Infinity, ease: "linear" }}
      />

      <AmbientMarks reduce={reduce} />

      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: 1200,
          height: "min(70vh, 640px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {images.map(function drawCard(src, index) {
          return (
            <ClusterCard
              key={src}
              src={src}
              index={index}
              total={images.length}
              client={client}
              parallaxX={sX}
              parallaxY={sY}
              reduce={reduce}
            />
          );
        })}
      </div>

      {caption ? <ClusterCaption caption={caption} reduce={reduce} /> : null}
    </div>
  );
}

function MobileCluster({
  images,
  client,
  reduce,
}: {
  images: string[];
  client: string;
  reduce: boolean;
}) {
  // Show the middle card (or the sole one for length-2, using index 1 which
  // reads as the "front" card in the 2-image layout).
  const idx = images.length === 3 ? 1 : Math.min(1, images.length - 1);
  const src = images[idx];
  return (
    <motion.figure
      initial={{ opacity: reduce ? 1 : 0, scale: reduce ? 1 : 1.03 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: reduce ? 0 : 1.0, ease: ease.outExpo }}
      style={{ margin: 0 }}
    >
      <ImageFrame variant="hero">
        <img
          src={src}
          alt={`${client} overview screen`}
          loading="eager"
          decoding="async"
        />
      </ImageFrame>
    </motion.figure>
  );
}

/* Per-card geometry, entrance state, and weighted parallax. */
function ClusterCard({
  src,
  index,
  total,
  client,
  parallaxX,
  parallaxY,
  reduce,
}: {
  src: string;
  index: number;
  total: number;
  client: string;
  parallaxX: MotionValue<number>;
  parallaxY: MotionValue<number>;
  reduce: boolean;
}) {
  // Geometry sets.
  // 3-card fan: back(0), middle(1), front(2).
  // 2-card fan: back(0), front(1).
  const restRotate =
    total === 3 ? [-8, 3, 6][index] : [-5, 5][index];
  const restX = total === 3 ? [-60, 0, 80][index] : [-40, 40][index];
  const restY = total === 3 ? [20, 0, -30][index] : [10, -10][index];
  const restScale = total === 3 ? [0.92, 1.0, 0.88][index] : [0.95, 1.0][index];
  const zIndex = total === 3 ? [1, 3, 2][index] : [1, 2][index];

  // Entrance rotate. Alternate direction for visual variety.
  const enterRotate = total === 3 ? [-20, 25, -25][index] : [-20, 20][index];
  const enterDelay = total === 3 ? [0.2, 0.4, 0.6][index] : [0.2, 0.5][index];

  // Depth weighting for cursor parallax.
  const parallaxWeight =
    total === 3 ? [0.4, 0.7, 1.0][index] : [0.5, 1.0][index];
  const weightedX = useTransform(parallaxX, function m(v) {
    return v * parallaxWeight * 0.5;
  });
  const weightedY = useTransform(parallaxY, function m(v) {
    return v * parallaxWeight * 0.5;
  });

  // Combine rest offset + parallax on desktop.
  const totalX = useTransform(
    [weightedX] as MotionValue<number>[],
    function combine([px]) {
      return restX + (px as number);
    }
  );
  const totalY = useTransform(
    [weightedY] as MotionValue<number>[],
    function combine([py]) {
      return restY + (py as number);
    }
  );

  // Shadow depth cue — front card heaviest.
  const shadow =
    index === 0
      ? "0 6px 20px rgba(20,20,18,0.10)"
      : index === total - 1
        ? "0 24px 60px rgba(20,20,18,0.22)"
        : "0 14px 40px rgba(20,20,18,0.15)";

  return (
    <motion.figure
      initial={{
        opacity: reduce ? 1 : 0,
        rotate: reduce ? restRotate : enterRotate,
        scale: reduce ? restScale : 0.6,
      }}
      animate={{
        opacity: 1,
        rotate: restRotate,
        scale: restScale,
      }}
      transition={{
        duration: reduce ? 0 : 0.9,
        ease: ease.outQuart,
        delay: reduce ? 0 : enterDelay,
      }}
      style={{
        position: "absolute",
        width: "clamp(320px, 32vw, 520px)",
        margin: 0,
        zIndex,
        x: reduce ? restX : totalX,
        y: reduce ? restY : totalY,
        transformOrigin: "center center",
        boxShadow: shadow,
        borderRadius: 12,
        overflow: "hidden",
      }}
    >
      <ImageFrame variant="hero">
        <img
          src={src}
          alt={`${client} — screen ${index + 1}`}
          loading="eager"
          decoding="async"
          draggable={false}
        />
      </ImageFrame>
    </motion.figure>
  );
}

function ClusterCaption({
  caption,
  reduce,
}: {
  caption: NonNullable<CaseStudy["heroCaption"]>;
  reduce: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: reduce ? 1 : 0, y: reduce ? 0 : 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: reduce ? 0 : 0.6, ease: ease.outQuart, delay: reduce ? 0 : 1.0 }}
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 8,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 10,
        pointerEvents: "none",
      }}
      className="cluster-caption"
    >
      <div
        className="type-eyebrow"
        style={{ color: "var(--color-muted-2)" }}
      >
        {caption.eyebrow}
      </div>
      <div
        className="type-eyebrow"
        style={{ color: "var(--color-ink-soft)" }}
      >
        {caption.labels.join(" · ")}
      </div>
      <style>{`
        @media (max-width: 900px) {
          .cluster-caption {
            position: static !important;
            margin-top: 32px;
          }
        }
      `}</style>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Ambient marks (behind + around the cluster)
   ═══════════════════════════════════════════════════════════════ */

function AmbientMarks({ reduce }: { reduce: boolean }) {
  return (
    <>
      <motion.div
        aria-hidden
        className="cluster-ambient cluster-ambient--keep"
        style={{
          position: "absolute",
          top: "10%",
          left: "6%",
          width: 32,
          height: 32,
          borderRadius: "50%",
          border: "1px solid var(--color-ink)",
          opacity: 0.2,
          pointerEvents: "none",
        }}
        animate={
          reduce
            ? undefined
            : { x: [0, 18, 0, -16, 0], y: [0, -12, 12, 0, 0] }
        }
        transition={{ duration: 45, repeat: Infinity, ease: ease.inOut }}
      />
      <motion.div
        aria-hidden
        className="cluster-ambient cluster-ambient--keep"
        style={{
          position: "absolute",
          bottom: "12%",
          right: "6%",
          width: 24,
          height: 24,
          border: "1px solid var(--color-parch)",
          opacity: 0.4,
          pointerEvents: "none",
        }}
        animate={
          reduce
            ? undefined
            : { x: [0, -22, 0, 18, 0], y: [0, 16, -12, 0, 0] }
        }
        transition={{ duration: 55, repeat: Infinity, ease: ease.inOut }}
      />
      <motion.div
        aria-hidden
        className="cluster-ambient"
        style={{
          position: "absolute",
          top: "48%",
          left: "3%",
          width: 48,
          height: 2,
          background: "var(--color-parch)",
          opacity: 0.4,
          pointerEvents: "none",
        }}
        animate={
          reduce
            ? undefined
            : { x: [0, 18, 0, -12, 0], y: [0, -6, 6, 0, 0] }
        }
        transition={{ duration: 60, repeat: Infinity, ease: ease.inOut }}
      />
      <motion.div
        aria-hidden
        className="cluster-ambient"
        style={{
          position: "absolute",
          top: "46%",
          right: "3%",
          width: 10,
          height: 10,
          borderRadius: "50%",
          background: "var(--color-ink)",
          opacity: 0.25,
          pointerEvents: "none",
        }}
        animate={
          reduce
            ? undefined
            : { x: [0, -14, 0, 10, 0], y: [0, 10, -10, 0, 0] }
        }
        transition={{ duration: 50, repeat: Infinity, ease: ease.inOut }}
      />
      <style>{`
        @media (max-width: 900px) {
          .cluster-ambient { display: none !important; }
          .cluster-ambient--keep { display: block !important; }
        }
      `}</style>
    </>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div
        className="type-eyebrow"
        style={{
          color: "var(--color-muted-2)",
          marginBottom: 10,
        }}
      >
        {label}
      </div>
      <div
        className="type-h3"
        style={{
          color: "var(--color-ink)",
        }}
      >
        {value}
      </div>
    </div>
  );
}
