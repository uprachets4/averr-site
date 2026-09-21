import { useCallback, useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useSpring,
  type PanInfo,
} from "motion/react";
import { duration, ease, spring } from "../../lib/motion";
import ImageFrame from "./ImageFrame";

type Item = { src: string; caption: string };

const PEEK_PCT = 12;
const DRAG_DISTANCE_THRESHOLD = 0.25;
const DRAG_VELOCITY_THRESHOLD = 500;

export default function Gallery({
  items,
  client,
}: {
  items: Item[];
  client: string;
}) {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const frameRef = useRef<HTMLDivElement | null>(null);
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const inView = useInView(frameRef, { margin: "-25% 0px -25% 0px" });

  const clampedActive = Math.min(active, items.length - 1);

  const goTo = useCallback(
    (next: number) => {
      if (next < 0 || next > items.length - 1) return;
      setActive(next);
    },
    [items.length]
  );

  const prev = useCallback(() => goTo(clampedActive - 1), [clampedActive, goTo]);
  const next = useCallback(() => goTo(clampedActive + 1), [clampedActive, goTo]);

  useEffect(
    function keyboardNav() {
      if (!inView) return;
      function onKey(e: KeyboardEvent) {
        if (e.key === "ArrowLeft") prev();
        else if (e.key === "ArrowRight") next();
      }
      window.addEventListener("keydown", onKey);
      return function cleanup() {
        window.removeEventListener("keydown", onKey);
      };
    },
    [inView, prev, next]
  );

  function handleDragEnd(_: unknown, info: PanInfo) {
    const width = viewportRef.current?.offsetWidth ?? 0;
    if (width === 0) return;
    const distanceRatio = Math.abs(info.offset.x) / width;
    const passesDistance = distanceRatio > DRAG_DISTANCE_THRESHOLD;
    const passesVelocity = Math.abs(info.velocity.x) > DRAG_VELOCITY_THRESHOLD;
    if (!passesDistance && !passesVelocity) return;
    if (info.offset.x < 0) next();
    else prev();
  }

  if (!items || items.length === 0) return null;

  const item = items[clampedActive];
  const peekItem = items[clampedActive + 1];
  const isFirst = clampedActive === 0;
  const isLast = clampedActive === items.length - 1;

  return (
    <section
      style={{
        backgroundColor: "var(--color-bg)",
        padding: "64px 0 112px",
        position: "relative",
        borderTop: "1px solid rgba(20,20,18,0.10)",
        borderBottom: "1px solid rgba(20,20,18,0.10)",
      }}
    >
      <div
        ref={frameRef}
        className="gallery-frame"
        style={{
          position: "relative",
          maxWidth: 1400,
          margin: "0 auto",
          padding: "0 40px",
        }}
      >
        <div
          ref={viewportRef}
          className="gallery-viewport"
          style={{
            position: "relative",
            display: "grid",
            gridTemplateColumns: `1fr ${PEEK_PCT}%`,
            gap: 0,
            overflow: "hidden",
            borderRadius: 12,
          }}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.figure
              key={clampedActive}
              drag={reduce ? false : "x"}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={handleDragEnd}
              initial={{
                opacity: 0,
                x: reduce ? 0 : 40,
              }}
              animate={{ opacity: 1, x: 0 }}
              exit={{
                opacity: 0,
                x: reduce ? 0 : -40,
              }}
              transition={{ duration: duration.base, ease: ease.outQuart }}
              style={{
                position: "relative",
                margin: 0,
                cursor: reduce ? "default" : "grab",
              }}
            >
              <GalleryImage item={item} client={client} reduce={!!reduce} />
            </motion.figure>
          </AnimatePresence>

          {peekItem ? (
            <div
              aria-hidden
              className="gallery-peek"
              style={{
                position: "relative",
                overflow: "hidden",
                borderRadius: 12,
                opacity: 0.35,
                marginLeft: 8,
              }}
            >
              <PeekImage src={peekItem.src} />
            </div>
          ) : null}
        </div>

        <MagneticNavButton
          direction="prev"
          onClick={prev}
          disabled={isFirst}
          reduce={!!reduce}
        />
        <MagneticNavButton
          direction="next"
          onClick={next}
          disabled={isLast}
          reduce={!!reduce}
        />

        <div
          className="gallery-indicator type-eyebrow"
          style={{
            position: "absolute",
            right: 40,
            bottom: -32,
            display: "inline-flex",
            gap: 6,
            color: "var(--color-ink)",
          }}
        >
          <span>{String(clampedActive + 1).padStart(2, "0")}</span>
          <span style={{ color: "var(--color-ink-soft)" }}>/</span>
          <span>{String(items.length).padStart(2, "0")}</span>
        </div>
      </div>

      <style>{`
        .gallery-peek img {
          display: block;
          width: ${(100 / PEEK_PCT) * 100}%;
          height: 100%;
          object-fit: cover;
        }
        @media (max-width: 900px) {
          .gallery-viewport {
            grid-template-columns: 1fr !important;
          }
          .gallery-peek {
            display: none !important;
          }
          .gallery-indicator {
            right: 20px !important;
          }
        }
      `}</style>
    </section>
  );
}

function GalleryImage({
  item,
  client,
  reduce,
}: {
  item: Item;
  client: string;
  reduce: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ position: "relative" }}
    >
      <ImageFrame variant="gallery">
        <img
          src={item.src}
          alt={`${client} — ${item.caption}`}
          loading="lazy"
          decoding="async"
          draggable={false}
        />
      </ImageFrame>
      <motion.figcaption
        className="type-small"
        animate={{ opacity: hovered && !reduce ? 1 : 0.6 }}
        transition={{ duration: duration.fast, ease: ease.outQuart }}
        style={{
          position: "absolute",
          left: 24,
          bottom: 20,
          color: "var(--color-parch)",
          background: "rgba(20,20,18,0.6)",
          backdropFilter: "blur(8px)",
          padding: "6px 12px",
          borderRadius: 999,
          fontFamily: "var(--font-mono)",
          fontSize: 12,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          pointerEvents: "none",
        }}
      >
        {item.caption}
      </motion.figcaption>
    </div>
  );
}

function PeekImage({ src }: { src: string }) {
  return (
    <ImageFrame variant="gallery">
      <img src={src} alt="" loading="lazy" decoding="async" draggable={false} />
    </ImageFrame>
  );
}

const NAV_MAGNET_RADIUS = 60;
const NAV_MAGNET_STRENGTH = 0.12;

function MagneticNavButton({
  direction,
  onClick,
  disabled,
  reduce,
}: {
  direction: "prev" | "next";
  onClick: () => void;
  disabled: boolean;
  reduce: boolean;
}) {
  const ref = useRef<HTMLButtonElement | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, spring.soft);
  const springY = useSpring(y, spring.soft);

  function handleMove(e: React.MouseEvent<HTMLButtonElement>) {
    if (reduce || disabled || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    const dist = Math.hypot(dx, dy);
    if (dist > NAV_MAGNET_RADIUS) {
      x.set(0);
      y.set(0);
      return;
    }
    x.set(dx * NAV_MAGNET_STRENGTH);
    y.set(dy * NAV_MAGNET_STRENGTH);
  }

  function handleLeave() {
    x.set(0);
    y.set(0);
  }

  const isPrev = direction === "prev";
  return (
    <motion.button
      ref={ref}
      type="button"
      onClick={onClick}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      disabled={disabled}
      aria-label={isPrev ? "Previous image" : "Next image"}
      style={{
        position: "absolute",
        top: "50%",
        [isPrev ? "left" : "right"]: 8,
        transform: "translateY(-50%)",
        x: springX,
        y: springY,
        width: 44,
        height: 44,
        borderRadius: 999,
        border: "1px solid rgba(20,20,18,0.18)",
        background: "rgba(244,240,230,0.85)",
        backdropFilter: "blur(6px)",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        color: "var(--color-ink)",
        cursor: disabled ? "default" : "pointer",
        opacity: disabled ? 0.3 : 1,
        pointerEvents: disabled ? "none" : "auto",
        transitionProperty: "background-color, border-color, opacity",
        transitionDuration: `${duration.base * 1000}ms`,
        transitionTimingFunction: `cubic-bezier(${ease.outQuart.join(",")})`,
        zIndex: 3,
      }}
      whileHover={
        reduce || disabled
          ? undefined
          : { scale: 1.05, transition: spring.snappy }
      }
      whileTap={reduce || disabled ? undefined : { scale: 0.94 }}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        aria-hidden
        style={{
          transform: isPrev ? "rotate(180deg)" : "none",
        }}
      >
        <path
          d="M6 3l5 5-5 5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </motion.button>
  );
}
