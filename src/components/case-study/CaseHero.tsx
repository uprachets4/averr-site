import { useEffect, useRef, useState } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import { duration, ease, easing } from "../../lib/motion";
import { useScrollStyle } from "../../lib/useScrollStyle";
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
  | "tint"
>;

const FALLBACK_TINT = "#A8916D";

/** Split the thesis around its accent phrase, preserving whole words. */
function splitOnAccent(thesis: string, phrase: string): [string, string, string] {
  const i = phrase ? thesis.indexOf(phrase) : -1;
  if (i < 0) return [thesis, "", ""];
  return [thesis.slice(0, i), phrase, thesis.slice(i + phrase.length)];
}

function rgba(hex: string, alpha: number) {
  const h = hex.replace("#", "");
  const n = parseInt(h.length === 3 ? h.replace(/./g, (c) => c + c) : h, 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
}

/* ═══════════════════════════════════════════════════════════════
   Zoom-into-the-work hero

   The wrapper is ~160vh and NOT sticky: the cluster simply travels
   up the viewport while the front screen scales and flattens out of
   its fan, so by the time its top reaches ~15% of the screen it is
   a flat, full-width shot of the work.
   ═══════════════════════════════════════════════════════════════ */

export default function CaseHero({
  hero,
  client,
  pillars,
  sector,
  year,
  heroImage,
  heroImages,
  heroCaption,
  tint,
}: Props) {
  const reduce = useReducedMotion();
  const [before, accent, after] = splitOnAccent(hero.thesis, hero.thesisPill);
  const glow = tint || FALLBACK_TINT;

  const wrapRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ["start start", "end start"],
  });

  // One screenshot, not three. The cluster's depth used to come from two
  // other screens, which meant every study showed the same shot twice —
  // once here, once in Approach or the Gallery. The depth is now blurred
  // copies of this same image, so the hero borrows nothing.
  // heroImages[0] is this image on every study; the rest are unused.
  const front = heroImage || heroImages?.[0] || null;

  return (
    <section
      style={{
        position: "relative",
        backgroundColor: "var(--color-bg)",
        paddingTop: 180,
      }}
    >
      <div className="grain-light" aria-hidden="true" style={{ opacity: 0.05 }} />

      {/* headline block */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          maxWidth: "var(--container-wide)",
          margin: "0 auto",
        }}
      >
        <motion.div
          initial={{ opacity: reduce ? 1 : 0, y: reduce ? 0 : 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: reduce ? 0 : 0.5,
            ease: ease.outQuart,
            delay: reduce ? 0 : 0.15,
          }}
          className="type-eyebrow"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            color: "var(--color-muted)",
            marginBottom: 28,
          }}
        >
          <span style={{ height: 1, width: 20, background: "currentColor", opacity: 0.6 }} />
          {hero.eyebrow}
          <span style={{ height: 1, width: 20, background: "currentColor", opacity: 0.6 }} />
        </motion.div>

        <motion.div
          initial={{ opacity: reduce ? 1 : 0, y: reduce ? 0 : 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: reduce ? 0 : 0.5,
            ease: ease.outQuart,
            delay: reduce ? 0 : 0.25,
          }}
          className="type-eyebrow"
          style={{ color: "var(--color-muted-2)", marginBottom: 24 }}
        >
          {client}
        </motion.div>

        {/* the line masks up out of its own box, one element, exact sentence */}
        <h1
          className="type-display-l"
          style={{ color: "var(--color-ink)", marginBottom: 40, maxWidth: 1080 }}
        >
          <span style={{ display: "block", overflow: "hidden", paddingBottom: "0.08em" }}>
            <motion.span
              style={{ display: "block" }}
              initial={{ y: reduce ? 0 : "110%" }}
              animate={{ y: 0 }}
              transition={{
                duration: reduce ? 0 : duration.slow,
                ease: ease.outExpo,
                delay: reduce ? 0 : 0.35,
              }}
            >
              {before}
              {accent ? <span className="type-accent">{accent}</span> : null}
              {after}
            </motion.span>
          </span>
        </h1>

        <motion.p
          initial={{ opacity: reduce ? 1 : 0, y: reduce ? 0 : 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: reduce ? 0 : 0.6,
            ease: ease.outQuart,
            delay: reduce ? 0 : 0.75,
          }}
          className="type-body-lg"
          style={{ color: "var(--color-muted)", maxWidth: 720, marginBottom: 56 }}
        >
          {hero.kicker}
        </motion.p>

        <motion.div
          initial={{ opacity: reduce ? 1 : 0, y: reduce ? 0 : 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: reduce ? 0 : 0.6,
            ease: ease.outQuart,
            delay: reduce ? 0 : 0.9,
          }}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            gap: 40,
            paddingTop: 32,
            borderTop: "1px solid var(--hair)",
          }}
          className="case-meta-grid"
        >
          <Meta label="Pillars" value={pillars.join(" · ")} />
          <Meta label="Sector" value={sector} />
          <Meta label="Year" value={year} />
        </motion.div>
      </div>

      {/* the zoom */}
      {front ? (
        <div
          ref={wrapRef}
          style={{ position: "relative", height: "160vh", marginTop: 72 }}
          className="case-zoom-wrap"
        >
          <TintGlow progress={scrollYProgress} tint={glow} reduce={!!reduce} />
          <ZoomCluster
            src={front}
            tint={glow}
            client={client}
            caption={heroCaption}
            progress={scrollYProgress}
            reduce={!!reduce}
          />
        </div>
      ) : null}

      <style>{`
        @media (max-width: 720px) {
          .case-meta-grid { grid-template-columns: 1fr !important; gap: 20px !important; }
        }
        @media (max-width: 900px) {
          /* no room to fan or travel: the front shot just rises into place */
          .case-zoom-wrap { height: auto !important; }
        }
      `}</style>
    </section>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div
        className="type-eyebrow"
        style={{ color: "var(--color-muted-2)", marginBottom: 8 }}
      >
        {label}
      </div>
      <div className="type-body" style={{ color: "var(--color-ink)" }}>
        {value}
      </div>
    </div>
  );
}

/* ── the glow ───────────────────────────────────────────────────── */

/** Radial wash in the client's tint: 10% at rest, 16% as the shot lands. */
function TintGlow({
  progress,
  tint,
  reduce,
}: {
  progress: MotionValue<number>;
  tint: string;
  reduce: boolean;
}) {
  const alpha = useTransform(progress, [0, 0.34], [0.1, 0.16]);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(
    function paint() {
      function write(a: number) {
        const el = ref.current;
        if (!el) return;
        el.style.background = `radial-gradient(ellipse 70% 55% at 50% 45%, ${rgba(
          tint,
          a
        )}, transparent 70%)`;
      }
      write(reduce ? 0.1 : progress.get());
      if (reduce) return;
      write(alpha.get());
      return alpha.on("change", write);
    },
    [alpha, progress, tint, reduce]
  );

  return (
    <div
      ref={ref}
      aria-hidden
      style={{
        position: "sticky",
        top: 0,
        height: "100vh",
        marginBottom: "-100vh",
        pointerEvents: "none",
        zIndex: 1,
      }}
    />
  );
}

/* ── the cluster ────────────────────────────────────────────────── */

function ZoomCluster({
  src,
  tint,
  client,
  caption,
  progress,
  reduce,
}: {
  src: string;
  tint: string;
  client: string;
  caption?: CaseStudy["heroCaption"];
  progress: MotionValue<number>;
  reduce: boolean;
}) {
  const [desktop, setDesktop] = useState(true);
  useEffect(function detect() {
    const mq = window.matchMedia("(min-width: 901px)");
    setDesktop(mq.matches);
    function onChange(e: MediaQueryListEvent) {
      setDesktop(e.matches);
    }
    mq.addEventListener("change", onChange);
    return function cleanup() {
      mq.removeEventListener("change", onChange);
    };
  }, []);

  if (!desktop || reduce) {
    return (
      <div style={{ maxWidth: "var(--container-wide)", margin: "0 auto" }}>
        <motion.figure
          initial={{ opacity: reduce ? 1 : 0, y: reduce ? 0 : 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: reduce ? 0 : duration.slow, ease: ease.outExpo }}
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
        {caption ? <ClusterCaption caption={caption} /> : null}
      </div>
    );
  }

  return (
    <div
      style={{
        position: "sticky",
        top: 0,
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 2,
      }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "var(--container-wide)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <DepthScreen src={src} tint={tint} side={-1} progress={progress} />
        <DepthScreen src={src} tint={tint} side={1} progress={progress} />
        <FrontScreen src={src} client={client} progress={progress} />
        {caption ? (
          <CaptionFade caption={caption} progress={progress} />
        ) : null}
      </div>
    </div>
  );
}

/** The shot the reader zooms into: 0.62 → 1, tilted → flat, radius 12 → 8. */
function FrontScreen({
  src,
  client,
  progress,
}: {
  src: string;
  client: string;
  progress: MotionValue<number>;
}) {
  const scale = useTransform(progress, [0, 0.34], [0.62, 1], { ease: [easing.inOut] });
  const rotateX = useTransform(progress, [0, 0.34], [12, 0], { ease: [easing.inOut] });
  const rotateZ = useTransform(progress, [0, 0.34], [3, 0], { ease: [easing.inOut] });
  const radius = useTransform(progress, [0, 0.34], [12, 8], { ease: [easing.inOut] });

  return (
    <motion.figure
      style={{
        position: "relative",
        zIndex: 3,
        width: "100%",
        margin: 0,
        transformPerspective: 1400,
        scale,
        rotateX,
        rotateZ,
        borderRadius: radius,
        overflow: "hidden",
        boxShadow: "0 24px 60px rgba(20,20,18,0.22)",
      }}
    >
      <img
        src={src}
        alt={`${client} overview screen`}
        loading="eager"
        decoding="async"
        style={{ display: "block", width: "100%", height: "auto" }}
      />
    </motion.figure>
  );
}

/**
 * Depth, not content: a blurred, tinted copy of the front image fanning
 * outward behind it. Same src, so the hero introduces no second screenshot.
 */
function DepthScreen({
  src,
  tint,
  side,
  progress,
}: {
  src: string;
  tint: string;
  side: 1 | -1;
  progress: MotionValue<number>;
}) {
  const x = useTransform(progress, [0, 0.34], [side * 12, side * 64], {
    ease: [easing.inOut],
  });
  const rotate = useTransform(progress, [0, 0.34], [side * 5, side * 6], {
    ease: [easing.inOut],
  });
  const opacity = useTransform(progress, [0, 0.25], [0.35, 0]);
  const ref = useScrollStyle<HTMLDivElement>(opacity);

  return (
    <motion.div
      ref={ref}
      aria-hidden
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        width: "62%",
        marginLeft: "-31%",
        zIndex: 2,
        x,
        rotate,
        y: "-50%",
        borderRadius: 10,
        overflow: "hidden",
        filter: "blur(8px)",
        boxShadow: "0 14px 40px rgba(20,20,18,0.15)",
      }}
    >
      <img
        src={src}
        alt=""
        loading="lazy"
        decoding="async"
        style={{ display: "block", width: "100%", height: "auto" }}
      />
      {/* the study's own colour, so the depth reads as atmosphere */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: rgba(tint, 0.2),
          pointerEvents: "none",
        }}
      />
    </motion.div>
  );
}

/* ── caption ────────────────────────────────────────────────────── */

function CaptionFade({
  caption,
  progress,
}: {
  caption: NonNullable<CaseStudy["heroCaption"]>;
  progress: MotionValue<number>;
}) {
  // the caption names all three screens, so it leaves with the back two
  const opacity = useTransform(progress, [0, 0.22], [1, 0]);
  const ref = useScrollStyle<HTMLDivElement>(opacity);
  return (
    <div
      ref={ref}
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: -56,
        zIndex: 4,
        pointerEvents: "none",
      }}
    >
      <ClusterCaption caption={caption} />
    </div>
  );
}

function ClusterCaption({
  caption,
}: {
  caption: NonNullable<CaseStudy["heroCaption"]>;
}) {
  return (
    <div style={{ marginTop: 24, textAlign: "center" }}>
      <div
        className="type-eyebrow"
        style={{ color: "var(--color-muted-2)", marginBottom: 8 }}
      >
        {caption.eyebrow}
      </div>
      <div
        className="type-eyebrow"
        style={{ fontFamily: "var(--font-mono)", color: "var(--color-muted)" }}
      >
        {caption.labels.join(" · ")}
      </div>
    </div>
  );
}
