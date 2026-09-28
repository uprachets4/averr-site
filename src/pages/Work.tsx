import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion, useInView, useReducedMotion } from "motion/react";
import { duration, ease, spring } from "../lib/motion";
import MagneticCTA from "../components/MagneticCTA";
import LineReveal from "../components/LineReveal";
import Chapter from "../components/Chapter";
import ImageFrame from "../components/case-study/ImageFrame";
import { CharRevealInView } from "../components/CharReveal";
import CursorPreview, {
  ViewLabel,
  usePreloadPreviews,
  type PreviewTarget,
} from "../components/work/CursorPreview";
import { vault, liveCount, PILLARS, countFor } from "../data/workIndex";
import type { Pillar } from "../data/caseStudies";

const T = { eyebrow: 0.2, h1: 0.32, sub: 0.7, chips: 0.85 };
const MOBILE_QUERY = "(max-width: 767px)";
const FINE_POINTER = "(pointer: fine)";

function useMedia(query: string) {
  const [matches, setMatches] = useState(false);
  useEffect(
    function watch() {
      const mq = window.matchMedia(query);
      function onChange(e: MediaQueryListEvent) {
        setMatches(e.matches);
      }
      setMatches(mq.matches);
      mq.addEventListener("change", onChange);
      return function cleanup() {
        mq.removeEventListener("change", onChange);
      };
    },
    [query]
  );
  return matches;
}

/* ── hero ──────────────────────────────────────────────────────────── */

function VaultHeader({
  pillar,
  setPillar,
  shown,
  mobile,
}: {
  pillar: Pillar | null;
  setPillar: (p: Pillar | null) => void;
  shown: number;
  mobile: boolean;
}) {
  const reduce = useReducedMotion();
  const d = (v: number) => (reduce ? 0 : v);

  const chips: Array<{ label: string; value: Pillar | null }> = [
    { label: "All", value: null },
    ...PILLARS.map(function toChip(p) {
      return { label: p, value: p as Pillar | null };
    }),
  ];

  return (
    <section
      style={{
        backgroundColor: "var(--color-bg)",
        padding: "168px 0 96px",
        position: "relative",
        overflow: "hidden",
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
          initial={{ opacity: reduce ? 1 : 0, y: reduce ? 0 : 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: d(0.5), ease: ease.outQuart, delay: d(T.eyebrow) }}
          className="type-eyebrow"
          style={{ color: "var(--color-muted)", marginBottom: 28 }}
        >
          Selected work · {shown} {pillar ? "shown" : "live"}
        </motion.div>

        <h1
          className="type-display-2xl"
          style={{ color: "var(--color-ink)", marginBottom: 32 }}
        >
          <LineReveal delay={d(T.h1)} duration={reduce ? 0 : duration.slow}>
            The vault.
          </LineReveal>
        </h1>

        <motion.p
          initial={{ opacity: reduce ? 1 : 0, y: reduce ? 0 : 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: d(0.6), ease: ease.outQuart, delay: d(T.sub) }}
          className="type-body-lg measure-body"
          style={{ color: "var(--color-muted)", margin: "0 0 48px" }}
        >
          Every project below is real. Numbers are measured, not marketing.
          Descriptions are what happened, not what we wish we had.
        </motion.p>

        <div
          style={{
            display: "flex",
            gap: 10,
            overflowX: mobile ? "auto" : "visible",
            scrollSnapType: mobile ? "x proximity" : "none",
            scrollbarWidth: "none",
            paddingBottom: mobile ? 4 : 0,
          }}
          className="vault-chips"
          role="group"
          aria-label="Filter by service"
        >
          {chips.map(function drawChip(chip, i) {
            const selected = pillar === chip.value;
            return (
              <motion.button
                key={chip.label}
                type="button"
                onClick={function pick() {
                  setPillar(chip.value);
                }}
                aria-pressed={selected}
                initial={{ opacity: reduce ? 1 : 0, y: reduce ? 0 : 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: d(0.4),
                  ease: ease.outQuart,
                  delay: d(T.chips + i * 0.06),
                }}
                className="type-small"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "10px 18px",
                  borderRadius: 999,
                  whiteSpace: "nowrap",
                  scrollSnapAlign: "start",
                  cursor: "pointer",
                  background: selected ? "var(--color-ink)" : "transparent",
                  color: selected ? "var(--color-parch)" : "var(--color-ink)",
                  border: `1px solid ${selected ? "var(--color-ink)" : "var(--hair-hi)"}`,
                  transition: reduce
                    ? "none"
                    : `background-color ${duration.base * 1000}ms ease, color ${duration.base * 1000}ms ease, border-color ${duration.base * 1000}ms ease`,
                }}
              >
                {chip.label}
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "var(--type-eyebrow-size)",
                    opacity: 0.6,
                  }}
                >
                  {countFor(chip.value)}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>

      <style>{`.vault-chips::-webkit-scrollbar { display: none; }`}</style>
    </section>
  );
}

/* ── one row ───────────────────────────────────────────────────────── */

function VaultRow({
  entry,
  index,
  active,
  anyActive,
  onEnter,
  onLeave,
  onFocusRow,
  mobile,
}: {
  entry: (typeof vault)[number];
  index: number;
  active: boolean;
  anyActive: boolean;
  onEnter: (nameRight?: number) => void;
  onLeave: () => void;
  onFocusRow: (rect: DOMRect) => void;
  mobile: boolean;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-12% 0px" });
  const delay = index * 0.08;
  const dim = anyActive && !active && !mobile && !reduce;

  const nameRef = useRef<HTMLDivElement | null>(null);

  function reportEnter() {
    const el = nameRef.current;
    onEnter(el ? el.getBoundingClientRect().right : undefined);
  }

  const meta = (
    <>
      <div
        className="type-eyebrow"
        style={{ fontFamily: "var(--font-mono)", color: "var(--color-muted-l)" }}
      >
        {entry.sector}
        {entry.year ? ` · ${entry.year}` : ""}
      </div>
      <div
        className="type-eyebrow"
        style={{
          fontFamily: "var(--font-mono)",
          color: "var(--color-muted-l)",
          marginTop: 8,
        }}
      >
        {entry.live ? entry.pillars.join(" · ") : "IN PROGRESS"}
      </div>
    </>
  );

  const figure = entry.figure ? (
    <>
      <div className="type-h1 tnum" style={{ color: "var(--color-parch)" }}>
        {entry.figure.value}
      </div>
      <div
        className="type-body"
        style={{ color: "var(--color-muted-l)", marginTop: 6 }}
      >
        {entry.figure.caption}
      </div>
    </>
  ) : null;

  const inner = (
    <motion.div
      className="vault-row"
      initial={{ opacity: reduce ? 1 : 0, y: reduce ? 0 : 14 }}
      animate={inView ? { opacity: 1, y: 0 } : undefined}
      transition={{
        duration: reduce ? 0 : 0.6,
        ease: ease.outQuart,
        delay: delay + (reduce ? 0 : 0.22),
      }}
      style={{
        display: "grid",
        gridTemplateColumns: mobile ? "1fr" : "max-content minmax(0, 1fr) minmax(0, 0.5fr) 20px",
        alignItems: mobile ? undefined : "center",
        gap: mobile ? 14 : 32,
        minHeight: mobile ? undefined : 168,
        padding: mobile ? "28px 0" : 0,
      }}
    >
      {/* mobile leads with the image */}
      {mobile && entry.preview ? (
        <div style={{ aspectRatio: "16 / 10", overflow: "hidden", borderRadius: 10 }}>
          <ImageFrame variant="gallery" tone="dark">
            <img
              src={entry.preview.src}
              alt={entry.preview.alt}
              width={1680}
              height={1050}
              loading="lazy"
              decoding="async"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </ImageFrame>
        </div>
      ) : null}

      <motion.div
        ref={nameRef}
        className="type-display-l"
        style={{ color: "var(--color-parch)", x: reduce || mobile ? 0 : active ? 12 : 0 }}
        transition={spring.soft}
      >
        <LineReveal delay={reduce ? 0 : delay + 0.1}>{entry.name}</LineReveal>
      </motion.div>

      <div>{meta}</div>

      <div style={{ textAlign: mobile ? "left" : "right" }}>{figure}</div>

      {!mobile ? (
        <motion.div
          aria-hidden
          style={{ width: 20, height: 20, color: "var(--color-parch)", justifySelf: "end" }}
          animate={{ rotate: active && !reduce ? -45 : 0 }}
          transition={{ duration: reduce ? 0 : duration.base, ease: ease.outQuart }}
        >
          {entry.live ? (
            <svg viewBox="0 0 20 20" fill="none" style={{ display: "block" }}>
              <path d="M4 10h12M11 5l5 5-5 5" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          ) : null}
        </motion.div>
      ) : null}
    </motion.div>
  );

  return (
    <motion.div
      ref={ref}
      layout={reduce ? false : "position"}
      transition={{ duration: reduce ? 0 : duration.base, ease: ease.inOut }}
      style={{
        position: "relative",
        // the dim lives here, not on the inner row: that one animates opacity
        // on entrance and framer's animate target would overwrite it
        opacity: dim ? 0.35 : entry.live ? 1 : 0.4,
        transition: reduce
          ? "none"
          : `opacity ${duration.base * 1000}ms cubic-bezier(${ease.outQuart.join(",")})`,
      }}
    >
      <motion.div
        aria-hidden
        style={{ height: 1, background: "var(--hair-d)", transformOrigin: "left" }}
        initial={{ scaleX: reduce ? 1 : 0 }}
        animate={inView ? { scaleX: 1 } : undefined}
        transition={{ duration: reduce ? 0 : duration.slow, ease: ease.outQuart, delay }}
      />
      {entry.live ? (
        <Link
          to={`/work/${entry.slug}`}
          onMouseEnter={reportEnter}
          onMouseLeave={onLeave}
          onFocus={function focus(e) {
            if (e.currentTarget.matches(":focus-visible")) {
              reportEnter();
              onFocusRow(e.currentTarget.getBoundingClientRect());
            }
          }}
          onBlur={onLeave}
          style={{ display: "block", textDecoration: "none", color: "inherit" }}
        >
          {inner}
        </Link>
      ) : (
        inner
      )}
    </motion.div>
  );
}

/* ── the index ─────────────────────────────────────────────────────── */

function VaultIndex({
  pillar,
  onClear,
  mobile,
}: {
  pillar: Pillar | null;
  onClear: () => void;
  mobile: boolean;
}) {
  const reduce = useReducedMotion();
  const fine = useMedia(FINE_POINTER);
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { margin: "-10% 0px" });
  usePreloadPreviews(inView);

  const [hovered, setHovered] = useState<string | null>(null);
  const [target, setTarget] = useState<PreviewTarget>({ kind: "cursor" });
  const [nameRight, setNameRight] = useState(0);

  const rows = vault.filter(function matches(e) {
    if (!pillar) return true;
    return e.pillars.includes(pillar);
  });

  const usePreview = fine && !mobile && !reduce;

  return (
    <section
      id="vault"
      ref={ref}
      style={{
        backgroundColor: "var(--color-dark)",
        color: "var(--color-parch)",
        padding: "96px 0 112px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div className="grain-dark" aria-hidden="true" />

      <div
        style={{
          maxWidth: "var(--container-wide)",
          margin: "0 auto",
          position: "relative",
          zIndex: 2,
        }}
      >
        {rows.length === 0 ? (
          <p className="type-body-lg" style={{ color: "var(--color-muted-l)" }}>
            Nothing here yet —{" "}
            <button
              type="button"
              onClick={onClear}
              style={{
                color: "var(--color-parch)",
                textDecoration: "underline",
                background: "none",
                border: "none",
                padding: 0,
                font: "inherit",
                cursor: "pointer",
              }}
            >
              see all work
            </button>
          </p>
        ) : (
          rows.map(function drawRow(entry, i) {
            return (
              <VaultRow
                key={entry.slug}
                entry={entry}
                index={i}
                mobile={mobile}
                active={hovered === entry.slug}
                anyActive={hovered !== null}
                onEnter={function on(nameEdge) {
                  setHovered(entry.slug);
                  if (nameEdge) setNameRight(nameEdge + 24);
                }}
                onLeave={function off() {
                  setHovered(null);
                  setTarget({ kind: "cursor" });
                }}
                onFocusRow={function anchor(rect) {
                  setTarget({
                    kind: "anchored",
                    rect: {
                      top: rect.top,
                      left: rect.left,
                      width: rect.width,
                      height: rect.height,
                    },
                  });
                }}
              />
            );
          })
        )}
        <div style={{ height: 1, background: "var(--hair-d)" }} />
      </div>

      {usePreview ? (
        <>
          <CursorPreview slug={hovered} target={target} minX={nameRight} />
          <ViewLabel visible={hovered !== null && target.kind === "cursor"} />
        </>
      ) : null}

      <style>{`
        @media (max-width: 767px) {
          .vault-row { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

/* ── the vault's own closer ────────────────────────────────────────── */

function VaultCloser() {
  const reduce = useReducedMotion();
  return (
    <section
      style={{
        backgroundColor: "var(--color-bg)",
        padding: "128px 0 144px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div className="grain-light" aria-hidden="true" style={{ opacity: 0.05 }} />
      <div
        style={{
          maxWidth: "var(--container-wide)",
          margin: "0 auto",
          position: "relative",
          zIndex: 2,
        }}
      >
        <h2 className="type-h2 measure-wide" style={{ color: "var(--color-ink)" }}>
          <CharRevealInView
            segments={[
              { text: "Your project could be" },
              { text: "the next row.", accent: true },
            ]}
            style={{ color: "var(--color-ink)" }}
          />
        </h2>

        <motion.p
          initial={{ opacity: reduce ? 1 : 0, y: reduce ? 0 : 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: reduce ? 0 : 0.6, ease: ease.outQuart, delay: 0.2 }}
          className="type-body-lg measure-body"
          style={{ color: "var(--color-muted)", margin: "28px 0 40px" }}
        >
          A boutique design studio in Toronto. Building the websites, AI systems,
          and marketing engines for businesses that expect craft.
        </motion.p>

        <div style={{ display: "inline-flex", flexWrap: "wrap", gap: 12 }}>
          <MagneticCTA to="/contact" variant="primary">
            Book a discovery call
          </MagneticCTA>
          <MagneticCTA to="/services" variant="ghost">
            See services
          </MagneticCTA>
        </div>
      </div>
    </section>
  );
}

/* ── page ──────────────────────────────────────────────────────────── */

export default function Work() {
  const mobile = useMedia(MOBILE_QUERY);
  const [params, setParams] = useSearchParams();

  const raw = params.get("pillar");
  const pillar =
    raw && PILLARS.some((p) => p.toLowerCase() === raw.toLowerCase())
      ? (PILLARS.find((p) => p.toLowerCase() === raw.toLowerCase()) as Pillar)
      : null;

  useEffect(function scrollTopAndTitle() {
    window.scrollTo(0, 0);
    const prev = document.title;
    document.title = "The vault — Averr Studios";
    return function restore() {
      document.title = prev;
    };
  }, []);

  function setPillar(next: Pillar | null) {
    // the URL is the state, so a filtered view is shareable and back/forward works
    const p = new URLSearchParams(params);
    if (next) p.set("pillar", next.toLowerCase());
    else p.delete("pillar");
    setParams(p);
  }

  const shown = pillar ? countFor(pillar) : liveCount;

  return (
    <>
      <VaultHeader
        pillar={pillar}
        setPillar={setPillar}
        shown={shown}
        mobile={mobile}
      />

      <Chapter tone="dark" from="cream">
        <VaultIndex
          pillar={pillar}
          onClear={function clear() {
            setPillar(null);
          }}
          mobile={mobile}
        />
      </Chapter>

      <Chapter tone="cream" from="dark">
        <VaultCloser />
      </Chapter>
    </>
  );
}
