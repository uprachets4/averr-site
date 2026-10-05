import { useCallback, useEffect, useRef, useState } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  type MotionValue,
} from "motion/react";
import { SECTIONS, eyebrowFor } from "../../data/caseSections";
import { duration, ease } from "../../lib/motion";
import type { ApproachLayout, Pillar } from "../../data/caseStudies";
import ImageFrame from "./ImageFrame";
import Screenshot from "../Screenshot";
import { CharRevealInView } from "../CharReveal";
import { ReadFill } from "./ReadFill";

type Entry = {
  pillar: Pillar;
  body: string;
  image?: string;
  layout?: ApproachLayout;
  emphasis?: string;
};

/** First sentence carries the point; the rest is the support. */
function split(body: string): [string, string] {
  const m = body.match(/^.*?[.!?](?=\s|$)/);
  if (!m) return [body, ""];
  return [m[0], body.slice(m[0].length).trim()];
}

/**
 * The pillar name as an outline that fills left to right.
 *
 * One scroll-written custom property per block (--fill, 0 → 1). Because it
 * is scroll-linked rather than a one-shot, walking back up drains it again
 * with no extra code. The underline rides the same variable.
 */
function PillarName({
  pillar,
  tint,
  fillRef,
}: {
  pillar: Pillar;
  tint: string;
  fillRef?: (node: HTMLElement | null) => void;
}) {
  return (
    <div ref={fillRef} className="pillar-name" style={{ marginBottom: 20 }}>
      <span
        className="type-display-xl pillar-name__outline"
        style={{ color: "var(--color-ink)" }}
        aria-hidden
      >
        {pillar}
      </span>
      <span
        className="type-display-xl pillar-name__fill"
        style={{ color: "var(--color-ink)" }}
      >
        {pillar}
      </span>
      <span
        aria-hidden
        className="pillar-name__rule"
        style={{ background: tint, marginTop: 10 }}
      />
    </div>
  );
}

/** Writes --fill on the block as it approaches and passes the reading line. */
function useFillProgress(progress: MotionValue<number>, reduce: boolean) {
  const node = useRef<HTMLElement | null>(null);
  const write = useCallback(
    function w(v: number) {
      if (node.current) node.current.style.setProperty("--fill", String(reduce ? 1 : v));
    },
    [reduce]
  );
  useEffect(
    function sub() {
      write(progress.get());
      return progress.on("change", write);
    },
    [progress, write]
  );
  return useCallback(
    function attach(el: HTMLElement | null) {
      node.current = el;
      write(progress.get());
    },
    [progress, write]
  );
}

const COUNT_WORD = ["No", "One", "Two", "Three", "Four", "Five", "Six"];

/** "Two pillars, one plan." — the count comes from the study's own data. */
function headline(n: number) {
  const word = COUNT_WORD[n] ?? String(n);
  return `${word} ${n === 1 ? "pillar" : "pillars"}, one plan.`;
}

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

export default function Approach({
  entries,
  tint,
}: {
  entries: Entry[];
  tint?: string;
}) {
  const accent = tint || "var(--color-ink)";
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
                    <BlockText entry={entry} active={i === idx} tint={accent} />
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
                  tint={accent}
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

function BlockText({
  entry,
  active,
  tint,
}: {
  entry: Entry;
  active: boolean;
  tint: string;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement | null>(null);
  const [statement, support] = split(entry.body);

  // fills as the block comes up to the reading line, drains as it leaves
  const { scrollYProgress: fill } = useScroll({
    target: ref,
    offset: ["start 0.85", "center 0.45"],
  });
  const { scrollYProgress: read } = useScroll({
    target: ref,
    offset: ["start 0.8", "end 0.5"],
  });
  const attachFill = useFillProgress(fill, !!reduce);

  return (
    <div ref={ref}>
      <PillarName pillar={entry.pillar} tint={tint} fillRef={attachFill} />

      <motion.div
        animate={{ opacity: active || reduce ? 1 : 0.45 }}
        transition={{ duration: reduce ? 0 : duration.base, ease: ease.outQuart }}
      >
        <ReadFill
          as="div"
          text={statement}
          progress={read}
          reduce={!!reduce}
          tint={tint}
          emphasis={entry.emphasis}
          className="type-h3"
          style={{ color: "var(--color-ink)", maxWidth: 560 }}
        />
        {support ? (
          <ReadFill
            text={support}
            progress={read}
            reduce={!!reduce}
            tint={tint}
            emphasis={entry.emphasis}
            className="type-body"
            style={{ color: "var(--color-muted)", maxWidth: 560, marginTop: 16 }}
          />
        ) : null}
      </motion.div>
    </div>
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

  // The outgoing image stays mounted underneath until the incoming one has
  // finished wiping over it. AnimatePresence used to drop it the moment
  // `active` changed — with no exit animation that is immediate — while the
  // incoming layer mounted at inset(100%), i.e. fully clipped. For the
  // length of the wipe there was nothing to draw. Preloading never helped
  // because the gap was structural, not a decode delay.
  const [base, setBase] = useState(active);
  useEffect(
    function settleWhenIdle() {
      if (reduce) setBase(active);
    },
    [active, reduce]
  );

  const entry = entries[active];
  const under = entries[Math.min(base, entries.length - 1)] ?? entry;
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
          {/* What you were looking at, still there. It stays mounted even
              once the wipe has settled: dropping it at rest reintroduced a
              blank first paint. At rest it holds the same image as the top
              layer, so an image-usage audit must exclude [data-frame-base]
              rather than counting it as a second use. */}
          <div
            data-frame-base
            aria-hidden
            style={{ position: "absolute", inset: 0, zIndex: 1 }}
          >
            <Shot entry={under} />
          </div>

          {/* what is arriving, wiping up over it */}
          <motion.div
            key={active}
            initial={{ clipPath: reduce ? "inset(0% 0 0% 0)" : "inset(100% 0 0% 0)" }}
            animate={{ clipPath: "inset(0% 0 0% 0)" }}
            transition={
              reduce ? { duration: 0 } : { duration: duration.slow, ease: ease.inOut }
            }
            onAnimationComplete={function done() {
              setBase(active);
            }}
            style={{ position: "absolute", inset: 0, zIndex: 2 }}
          >
            <Shot entry={entry} />
          </motion.div>
        </div>
      </ImageFrame>
    </div>
  );
}

function Shot({ entry }: { entry: Entry }) {
  if (!entry.image) return <GeometricAnchor pillar={entry.pillar} />;
  return (
    <Screenshot
      src={entry.image}
      alt={`${entry.pillar} approach visual`}
      sizes="(min-width: 1100px) 1100px, 100vw"
      style={{ height: "100%", objectFit: "contain" }}
    />
  );
}

/* ── mobile / reduced motion ────────────────────────────────────── */

function StackedBlock({
  entry,
  reduce,
  tint,
}: {
  entry: Entry;
  reduce: boolean;
  tint: string;
}) {
  const [statement, support] = split(entry.body);
  const ref = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress: read } = useScroll({
    target: ref,
    offset: ["start 0.9", "end 0.6"],
  });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: reduce ? 1 : 0, y: reduce ? 0 : 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: reduce ? 0 : 0.7, ease: ease.outQuart }}
    >
      <div style={{ marginBottom: 24 }}>
        <ImageFrame variant="gallery">
          <div style={{ position: "relative", width: "100%" }}>
            {entry.image ? (
              <Screenshot
                src={entry.image}
                alt={`${entry.pillar} approach visual`}
                sizes="(min-width: 1100px) 1100px, 100vw"
              />
            ) : (
              <GeometricAnchor pillar={entry.pillar} />
            )}
          </div>
        </ImageFrame>
      </div>
      {/* mobile fills the name once, on entry */}
      <motion.div
        className="pillar-name"
        initial={{ opacity: 1 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-25%" }}
        ref={function mark(node: HTMLDivElement | null) {
          if (node) node.style.setProperty("--fill", "1");
        }}
        style={{ marginBottom: 16 }}
      >
        <span className="type-display-l pillar-name__outline" aria-hidden style={{ color: "var(--color-ink)" }}>
          {entry.pillar}
        </span>
        <span className="type-display-l pillar-name__fill" style={{ color: "var(--color-ink)" }}>
          {entry.pillar}
        </span>
        <span aria-hidden className="pillar-name__rule" style={{ background: tint, marginTop: 8 }} />
      </motion.div>

      <ReadFill
        as="div"
        text={statement}
        progress={read}
        reduce={reduce}
        tint={tint}
        emphasis={entry.emphasis}
        className="type-h3"
        style={{ color: "var(--color-ink)" }}
      />
      {support ? (
        <ReadFill
          text={support}
          progress={read}
          reduce={reduce}
          tint={tint}
          emphasis={entry.emphasis}
          className="type-body"
          style={{ color: "var(--color-muted)", marginTop: 12 }}
        />
      ) : null}
    </motion.div>
  );
}
