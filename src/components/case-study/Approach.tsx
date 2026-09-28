import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { SECTIONS, eyebrowFor } from "../../data/caseSections";
import { duration, ease } from "../../lib/motion";
import type { ApproachLayout, Pillar } from "../../data/caseStudies";
import ImageFrame from "./ImageFrame";
import { CharRevealInView } from "../CharReveal";

type Entry = {
  pillar: Pillar;
  body: string;
  image?: string;
  layout?: ApproachLayout;
};

const COUNT_WORD = ["No", "One", "Two", "Three", "Four", "Five", "Six"];

/** "Two pillars, one plan." — the count comes from the study's own data. */
function headline(n: number) {
  const word = COUNT_WORD[n] ?? String(n);
  return `${word} ${n === 1 ? "pillar" : "pillars"}, one plan.`;
}

const pillarChipStyle: React.CSSProperties = {
  display: "inline-block",
  padding: "6px 14px",
  borderRadius: 999,
  border: "1px solid var(--hair-hi)",
  background: "transparent",
  color: "var(--color-ink-soft)",
  fontFamily: "var(--font-mono)",
  fontSize: 11,
  letterSpacing: "0.14em",
  textTransform: "uppercase" as const,
  marginBottom: 20,
};

function GeometricAnchor({ pillar }: { pillar: Pillar }) {
  // Muted geometric fallback when no image is provided
  const rotate = pillar === "Design" ? 0 : pillar === "Automate" ? 30 : -30;
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 400 320"
      preserveAspectRatio="xMidYMid slice"
      fill="none"
      aria-hidden
      style={{ display: "block" }}
    >
      <defs>
        <linearGradient
          id={`geom-${pillar}`}
          x1="0"
          y1="0"
          x2="400"
          y2="320"
          gradientTransform={`rotate(${rotate} 200 160)`}
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#C9B896" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#A8916D" stopOpacity="0.2" />
        </linearGradient>
      </defs>
      <circle cx="200" cy="160" r="140" stroke={`url(#geom-${pillar})`} strokeWidth={1.5} />
      <circle cx="200" cy="160" r="100" stroke={`url(#geom-${pillar})`} strokeWidth={1.5} />
      <circle cx="200" cy="160" r="60" stroke={`url(#geom-${pillar})`} strokeWidth={1.5} />
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Approach — pinned split

   Desktop: the pillar blocks scroll normally on the left while a
   sticky frame on the right shows the active pillar's image. When
   the next block crosses the viewport centre the new image wipes
   in from the bottom over the old one.

   All four studies render this way. CadenceStack's three entries
   carry layout: "text-then-image-full" from an earlier session;
   that variant is no longer rendered (its images sit in the sticky
   frame like everyone else's), but it stays in the data and in the
   ApproachLayout union rather than being deleted.
   ═══════════════════════════════════════════════════════════════ */

export default function Approach({ entries }: { entries: Entry[] }) {
  const reduce = useReducedMotion();
  const [desktop, setDesktop] = useState(false);
  const [active, setActive] = useState(0);
  // React keeps this component (and its state) across a /work/:slug change,
  // so `active` can outlive a study with more pillars than the next one.
  // Clamping in render, not just in the scroll handler, because render runs
  // first: entries[2] on a two-pillar study is undefined.
  const idx = Math.min(active, Math.max(0, entries.length - 1));
  const blockRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(function watch() {
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

  /* which block owns the viewport centre — one rAF-throttled handler */
  useEffect(
    function trackActive() {
      if (!desktop) return;
      let frame = 0;

      function read() {
        frame = 0;
        const mid = window.innerHeight / 2;
        let next = 0;
        blockRefs.current.forEach(function check(el, i) {
          if (!el) return;
          if (el.getBoundingClientRect().top <= mid) next = i;
        });
        setActive(next);
      }

      function onScroll() {
        if (frame) return;
        frame = requestAnimationFrame(read);
      }

      read();
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onScroll);
      return function cleanup() {
        if (frame) cancelAnimationFrame(frame);
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onScroll);
      };
    },
    [desktop, entries.length]
  );

  return (
    <section
      id={SECTIONS.approach.id}
      style={{
        backgroundColor: "var(--color-bg-alt)",
        padding: "128px 0",
        borderTop: "1px solid var(--hair)",
        position: "relative",
      }}
    >
      <div className="grain-light" aria-hidden="true" />
      <div
        style={{
          maxWidth: "var(--container-wide)",
          margin: "0 auto",
          position: "relative",
          zIndex: 2,
        }}
      >
        <motion.div
          initial={{ opacity: reduce ? 1 : 0, y: reduce ? 0 : 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: reduce ? 0 : 0.5, ease: ease.outQuart }}
          className="type-eyebrow"
          data-section-heading
          style={{ color: "var(--color-muted)", marginBottom: 24 }}
        >
          {eyebrowFor(SECTIONS.approach)}
        </motion.div>

        <h2 className="type-h2" style={{ color: "var(--color-ink)", marginBottom: 96 }}>
          <CharRevealInView
            text={headline(entries.length)}
            style={{ color: "var(--color-ink)" }}
          />
        </h2>

        {desktop && !reduce ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(0, 45fr) minmax(0, 55fr)",
              gap: 72,
              alignItems: "start",
            }}
          >
            {/* left: the blocks scroll */}
            <div>
              {entries.map(function block(entry, i) {
                return (
                  <div
                    key={`${entry.pillar}-${i}`}
                    ref={function keep(node) {
                      blockRefs.current[i] = node;
                    }}
                    style={{
                      minHeight: "80vh",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                    }}
                  >
                    <BlockText entry={entry} active={i === idx} />
                  </div>
                );
              })}
            </div>

            {/* right: one sticky frame, images wipe over one another */}
            <div
              style={{
                position: "sticky",
                top: 0,
                height: "100vh",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                gap: 16,
              }}
            >
              <StickyFrame entries={entries} active={idx} reduce={!!reduce} />
              <div
                className="type-eyebrow"
                aria-hidden
                style={{ fontFamily: "var(--font-mono)", color: "var(--color-muted)" }}
              >
                {entries[idx]?.pillar.toUpperCase()} · {idx + 1} / {entries.length}
              </div>
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 72 }}>
            {entries.map(function stacked(entry, i) {
              return (
                <StackedBlock
                  key={`${entry.pillar}-${i}`}
                  entry={entry}
                  reduce={!!reduce}
                />
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

/* ── the copy ───────────────────────────────────────────────────── */

function BlockText({ entry, active }: { entry: Entry; active: boolean }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      animate={{ opacity: active || reduce ? 1 : 0.45 }}
      transition={{ duration: reduce ? 0 : duration.base, ease: ease.outQuart }}
    >
      <span style={pillarChipStyle}>{entry.pillar}</span>
      <p
        className="type-body-lg"
        style={{ color: "var(--color-ink)", maxWidth: 560, margin: 0 }}
      >
        {entry.body}
      </p>
    </motion.div>
  );
}

/* ── the sticky frame ───────────────────────────────────────────── */

/**
 * Every Approach image at its own natural aspect.
 *
 * The frame used to force 5/4 with object-fit: cover, which cropped these
 * ~1.8-2.0 screenshots top and bottom. It now takes the loaded image's
 * intrinsic ratio and contains it, capped at the natural width so nothing
 * is upscaled. All of a study's images are preloaded on mount, so a wipe
 * never reveals an empty frame.
 */
function useImageSizes(srcs: string[]) {
  const [sizes, setSizes] = useState<Record<string, { w: number; h: number }>>({});

  useEffect(
    function preload() {
      let alive = true;
      for (const src of srcs) {
        const img = new Image();
        img.decoding = "async";
        img.src = src;
        function record() {
          if (!alive || !img.naturalWidth) return;
          setSizes(function add(prev) {
            if (prev[src]) return prev;
            return { ...prev, [src]: { w: img.naturalWidth, h: img.naturalHeight } };
          });
        }
        if (img.complete) record();
        else img.addEventListener("load", record, { once: true });
      }
      return function cleanup() {
        alive = false;
      };
    },
    [srcs.join("|")] // eslint-disable-line react-hooks/exhaustive-deps
  );

  return sizes;
}

function StickyFrame({
  entries,
  active,
  reduce,
}: {
  entries: Entry[];
  active: number;
  reduce: boolean;
}) {
  const srcs = entries
    .map(function pick(e) {
      return e.image;
    })
    .filter(Boolean) as string[];
  const sizes = useImageSizes(srcs);

  const entry = entries[active];
  if (!entry) return null;

  const size = entry.image ? sizes[entry.image] : undefined;
  const aspect = size ? size.w / size.h : 16 / 10;

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        maxWidth: size ? size.w : undefined,
        marginInline: "auto",
      }}
    >
      <ImageFrame variant="gallery">
        <div style={{ position: "relative", width: "100%", aspectRatio: String(aspect) }}>
          <AnimatePresence initial={false}>
            <motion.div
              key={active}
              initial={
                reduce
                  ? { clipPath: "inset(0% 0 0% 0)" }
                  : { clipPath: "inset(100% 0 0% 0)" }
              }
              animate={{ clipPath: "inset(0% 0 0% 0)" }}
              transition={
                reduce
                  ? { duration: 0 }
                  : { duration: duration.slow, ease: ease.inOut }
              }
              style={{ position: "absolute", inset: 0 }}
            >
              {entry.image ? (
                <img
                  src={entry.image}
                  alt={`${entry.pillar} approach visual`}
                  decoding="async"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                    display: "block",
                  }}
                />
              ) : (
                <GeometricAnchor pillar={entry.pillar} />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </ImageFrame>
    </div>
  );
}

/* ── mobile / reduced motion ────────────────────────────────────── */

function StackedBlock({ entry, reduce }: { entry: Entry; reduce: boolean }) {
  return (
    <motion.div
      initial={{ opacity: reduce ? 1 : 0, y: reduce ? 0 : 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: reduce ? 0 : 0.7, ease: ease.outQuart }}
    >
      <div style={{ marginBottom: 24 }}>
        <ImageFrame variant="gallery">
          <div style={{ position: "relative", width: "100%" }}>
            {entry.image ? (
              <img
                src={entry.image}
                alt={`${entry.pillar} approach visual`}
                loading="lazy"
                decoding="async"
                style={{ width: "100%", height: "auto", display: "block" }}
              />
            ) : (
              <GeometricAnchor pillar={entry.pillar} />
            )}
          </div>
        </ImageFrame>
      </div>
      <span style={pillarChipStyle}>{entry.pillar}</span>
      <p className="type-body-lg" style={{ color: "var(--color-ink)", margin: 0 }}>
        {entry.body}
      </p>
    </motion.div>
  );
}
