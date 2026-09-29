import { forwardRef, useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { animate, motion, useReducedMotion } from "motion/react";
import { duration, ease } from "../../lib/motion";
import ImageFrame from "../case-study/ImageFrame";
import MagneticCTA from "../MagneticCTA";
import { CharRevealInView } from "../CharReveal";
import { vault, type VaultEntry } from "../../data/workIndex";

function rgba(hex: string | undefined, a: number) {
  if (!hex || !hex.startsWith("#")) return `rgba(237,233,226,${a})`;
  const h = hex.slice(1);
  const n = parseInt(h.length === 3 ? h.replace(/./g, (c) => c + c) : h, 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
}

function useMedia(query: string) {
  const [matches, setMatches] = useState(false);
  useEffect(
    function watch() {
      const mq = window.matchMedia(query);
      setMatches(mq.matches);
      function onChange(e: MediaQueryListEvent) {
        setMatches(e.matches);
      }
      mq.addEventListener("change", onChange);
      return function cleanup() {
        mq.removeEventListener("change", onChange);
      };
    },
    [query]
  );
  return matches;
}

/** Segment index under the middle of the viewport, plus travel within it. */
function useSegment(count: number, enabled: boolean) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [state, setState] = useState({ index: 0, within: 0 });

  useEffect(
    function track() {
      if (!enabled) return;
      let frame = 0;

      function read() {
        frame = 0;
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        // the stage is pinned for (wrapper - one viewport); dividing the
        // wrapper itself would end the pin exactly as the last segment
        // began, so the final project only ever showed on the way out
        const pinned = Math.max(1, r.height - window.innerHeight);
        const seg = pinned / count;
        const travelled = Math.min(Math.max(-r.top, 0), pinned - 1);
        const index = Math.min(count - 1, Math.floor(travelled / seg));
        setState({ index, within: (travelled - index * seg) / seg });
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
    [count, enabled]
  );

  return { ref, ...state };
}

/**
 * The film: one pinned dark stage, one project at a time.
 *
 * The wrapper is (projects × 100vh) so each project owns a 100vh segment of
 * scroll; the stage itself stays pinned. Everything inside is driven by the
 * one rAF-throttled reader above — no per-project scroll listeners.
 */
export default function ProjectFilm({
  onOpen,
}: {
  onOpen?: (entry: VaultEntry, rect: DOMRect) => boolean;
}) {
  const reduce = useReducedMotion();
  const count = vault.length;
  const { ref, index, within } = useSegment(count, !reduce);
  const active = reduce ? 0 : index;

  // The index sits over the stage, so the content leaves it a lane — but
  // only as much as it actually intrudes. Past ~1700 the 1440-capped
  // container ends before the index starts and nothing is given up, so the
  // screen keeps its full share.
  const indexRef = useRef<HTMLElement | null>(null);
  const [reserve, setReserve] = useState(0);
  useEffect(function measureIndex() {
    function read() {
      const el = indexRef.current;
      if (!el) return;
      // a normal block, not absolute: margin:0 auto only centres in flow
      const probe = document.createElement("div");
      probe.style.cssText =
        "max-width:var(--container-wide);margin:0 auto;height:0;visibility:hidden";
      document.body.appendChild(probe);
      const containerRight = probe.getBoundingClientRect().right;
      probe.remove();
      const indexLeft = el.getBoundingClientRect().left;
      setReserve(Math.max(0, Math.round(containerRight - (indexLeft - 32))));
    }
    read();
    const t = window.setTimeout(read, 400);
    window.addEventListener("resize", read);
    return function cleanup() {
      window.clearTimeout(t);
      window.removeEventListener("resize", read);
    };
  }, []);

  const goTo = useCallback(
    function jump(i: number) {
      const el = ref.current;
      if (!el) return;
      const top = el.getBoundingClientRect().top + window.scrollY;
      const seg = Math.max(1, el.offsetHeight - window.innerHeight) / count;
      window.scrollTo({
        top: top + i * seg + 8,
        behavior: reduce ? "auto" : "smooth",
      });
    },
    [count, reduce, ref]
  );

  // reduced motion drops the pin entirely: plain stacked sections
  if (reduce) {
    return (
      <div data-tone="dark" style={{ backgroundColor: "var(--color-dark)" }}>
        {vault.map(function still(entry) {
          return (
            <div key={entry.slug} style={{ padding: "96px 0", position: "relative" }}>
              <Segment entry={entry} active reduce within={0} reserve={0} onOpen={onOpen} />
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div ref={ref} style={{ position: "relative", height: `${(count + 1) * 100}vh` }}>
      <div
        data-tone="dark"
        className="film-stage"
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          overflow: "hidden",
          backgroundColor: "var(--color-dark)",
        }}
      >
        <div className="grain-dark" aria-hidden="true" />

        {/* the room, lit in the client's colour */}
        {vault.map(function light(entry, i) {
          return (
            <div
              key={entry.slug}
              aria-hidden
              style={{
                position: "absolute",
                inset: 0,
                background: `radial-gradient(ellipse 60% 55% at 62% 45%, ${rgba(
                  entry.live ? entry.tint : "#8A8377",
                  0.18
                )}, transparent 70%)`,
                opacity: i === active ? 1 : 0,
                transition: `opacity ${duration.slow * 1000}ms cubic-bezier(${ease.inOut.join(",")})`,
                pointerEvents: "none",
              }}
            />
          );
        })}

        {vault.map(function segment(entry, i) {
          return (
            <Segment
              key={entry.slug}
              entry={entry}
              active={i === active}
              within={i === active ? within : 0}
              reduce={false}
              reserve={reserve}
              onFocusIn={function focus() {
                if (i !== active) goTo(i);
              }}
              onOpen={onOpen}
            />
          );
        })}

        <FilmIndex ref={indexRef} entries={vault} active={active} onPick={goTo} />
      </div>
    </div>
  );
}

/* ── one project ────────────────────────────────────────────────────── */

function Segment({
  entry,
  active,
  within,
  reduce,
  reserve,
  onFocusIn,
  onOpen,
}: {
  entry: VaultEntry;
  active: boolean;
  within: number;
  reduce: boolean;
  reserve: number;
  onFocusIn?: () => void;
  onOpen?: (entry: VaultEntry, rect: DOMRect) => boolean;
}) {
  const frameRef = useRef<HTMLDivElement | null>(null);
  // The screen takes ~64% of the container, so the name column is narrow.
  // CharReveal lays words out as inline-blocks, so a name too wide for the
  // column puts one word per line: "CG Walls & Floors" ran to four lines and
  // overflowed the stage. Long names step down a tier (or two) to fit.
  const bigName = useMedia("(min-width: 1500px)");
  const nameClass =
    entry.name.length > 14
      ? "type-h1"
      : bigName
        ? "type-display-xl"
        : "type-display-l";
  // a slow drift across the segment; the frame never leaves the stage
  const drift = reduce ? 1 : 1 + within * 0.03;

  // MagneticCTA's onClick hands the event as optional, so guard it: with no
  // event there is nothing to preventDefault and the Link should just run.
  function open(e?: React.MouseEvent | React.FormEvent) {
    const el = frameRef.current;
    if (!onOpen || !el || !entry.live || !e) return;
    if (onOpen(entry, el.getBoundingClientRect())) e.preventDefault();
  }

  return (
    <div
      className="film-segment"
      // tabbing to an off-stage project brings its segment on stage, so the
      // keyboard order and what you can see never disagree
      onFocus={onFocusIn}
      style={{
        position: reduce ? "relative" : "absolute",
        inset: reduce ? undefined : 0,
        display: "flex",
        alignItems: "center",
        opacity: active ? 1 : 0,
        pointerEvents: active ? "auto" : "none",
        transition: reduce
          ? "none"
          : `opacity ${duration.base * 1000}ms cubic-bezier(${ease.inOut.join(",")})`,
        zIndex: active ? 2 : 1,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "var(--container-wide)",
          margin: "0 auto",
          paddingRight: reserve,
          display: "grid",
          gridTemplateColumns: "minmax(0, 27fr) minmax(0, 73fr)",
          alignItems: "center",
          gap: 48,
        }}
        className="film-grid"
      >
        {/* left: the facts */}
        <motion.div
          initial={false}
          animate={{
            opacity: active ? 1 : 0,
            y: active ? 0 : reduce ? 0 : 18,
          }}
          transition={{
            duration: reduce ? 0 : duration.slow,
            ease: ease.inOut,
          }}
        >
          <div
            className="type-eyebrow"
            style={{
              fontFamily: "var(--font-mono)",
              color: "var(--color-muted-l)",
              marginBottom: 20,
            }}
          >
            {entry.sector}
            {entry.year ? ` · ${entry.year}` : ""}
          </div>

          <h2
            className={nameClass}
            style={{
              color: entry.live ? "var(--color-parch)" : "rgba(237,233,226,0.45)",
              margin: "0 0 24px",
            }}
          >
            {active ? (
              <CharRevealInView
                text={entry.name}
                style={{ color: "inherit" }}
              />
            ) : (
              entry.name
            )}
          </h2>

          <Figure entry={entry} active={active} reduce={reduce} />

          <div
            className="type-eyebrow"
            style={{
              fontFamily: "var(--font-mono)",
              color: "var(--color-muted-l)",
              margin: "24px 0 32px",
            }}
          >
            {entry.live ? entry.pillars.join(" · ") : "IN PROGRESS"}
          </div>

          {entry.live ? (
            <MagneticCTA
              to={`/work/${entry.slug}`}
              variant="primary"
              tone="dark"
              onClick={open}
            >
              Open case study
            </MagneticCTA>
          ) : null}
        </motion.div>

        {/* right: the screen */}
        <div>
          {entry.preview ? (
            <motion.div
              ref={frameRef}
              initial={false}
              animate={{
                opacity: active ? 1 : 0,
                scale: active ? drift : 0.94,
                y: active ? 0 : reduce ? 0 : "10vh",
              }}
              transition={{
                duration: reduce ? 0 : duration.slow,
                ease: ease.inOut,
              }}
              style={{ transformOrigin: "center" }}
            >
              {entry.live ? (
                <Link
                  to={`/work/${entry.slug}`}
                  aria-hidden="true"
                  tabIndex={-1}
                  onClick={open}
                  style={{ display: "block" }}
                >
                  <FilmImage entry={entry} />
                </Link>
              ) : (
                <FilmImage entry={entry} />
              )}
            </motion.div>
          ) : null}
        </div>
      </div>

      <style>{`
        @media (max-width: 1100px) {
          .film-grid { gap: 32px !important; }
        }
      `}</style>
    </div>
  );
}

/** Natural aspect, contained, never upscaled past the frame. */
function FilmImage({ entry }: { entry: VaultEntry }) {
  return (
    <ImageFrame variant="gallery" tone="dark">
      <img
        src={entry.preview!.src}
        alt={entry.preview!.alt}
        decoding="async"
        style={{ display: "block", width: "100%", height: "auto" }}
      />
    </ImageFrame>
  );
}

/** The measured figure, counted once when its segment arrives. */
function Figure({
  entry,
  active,
  reduce,
}: {
  entry: VaultEntry;
  active: boolean;
  reduce: boolean;
}) {
  const [value, setValue] = useState(0);
  const done = useRef(false);

  const m = entry.figure ? entry.figure.value.match(/^([\d.]+)(.*)$/) : null;
  const target = m ? parseFloat(m[1]) : 0;
  const decimals = m && m[1].includes(".") ? 1 : 0;
  const suffix = m ? m[2] : "";

  useEffect(
    function countUp() {
      if (!entry.figure || !active || done.current) return;
      if (reduce) {
        done.current = true;
        setValue(target);
        return;
      }
      const controls = animate(0, target, {
        duration: 1.5,
        ease: ease.outQuart,
        onUpdate: function tick(v) {
          setValue(v);
        },
        // `done` is only set on completion: a run cancelled by leaving the
        // segment mid-count must be allowed to start again, or the figure
        // is stranded at whatever it had reached
        onComplete: function finish() {
          done.current = true;
          setValue(target);
        },
      });
      return function cleanup() {
        controls.stop();
      };
    },
    [active, entry.figure, target, reduce]
  );

  if (entry.figure) {
    return (
      <div>
        <div
          className="type-display-l tnum"
          style={{ color: "var(--color-parch)", lineHeight: 1 }}
        >
          {decimals === 0 ? Math.round(value) : value.toFixed(decimals)}
          {suffix}
        </div>
        <div
          className="type-body"
          style={{ color: "var(--color-muted-l)", maxWidth: 420, marginTop: 10 }}
        >
          {entry.figure.caption}
        </div>
      </div>
    );
  }

  if (entry.status) {
    return (
      <div className="type-h3" style={{ color: "var(--color-muted-l)" }}>
        {entry.status}
      </div>
    );
  }

  return null;
}

/* ── the side index ─────────────────────────────────────────────────── */

const FilmIndex = forwardRef<HTMLElement, {
  entries: VaultEntry[];
  active: number;
  onPick: (i: number) => void;
}>(function FilmIndex({ entries, active, onPick }, ref) {
  const reduce = useReducedMotion();
  const [expanded, setExpanded] = useState(false);
  const activeEntry = entries[active];
  const tint = activeEntry?.live ? activeEntry.tint : "#8A8377";
  const p = entries.length > 1 ? active / (entries.length - 1) : 1;
  const open = expanded || !!reduce;

  const ease_ = `cubic-bezier(${ease.outQuart.join(",")})`;
  const t = reduce ? "none" : `all ${duration.base * 1000}ms ${ease_}`;

  return (
    <nav
      ref={ref}
      aria-label="Projects"
      className="film-index"
      onMouseEnter={function enter() {
        setExpanded(true);
      }}
      onMouseLeave={function leave() {
        setExpanded(false);
      }}
      onFocusCapture={function focus() {
        setExpanded(true);
      }}
      onBlurCapture={function blur(e: React.FocusEvent) {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setExpanded(false);
      }}
      style={{
        position: "absolute",
        top: "50%",
        right: "var(--gutter)",
        transform: "translateY(-50%)",
        zIndex: 5,
        display: "flex",
        gap: 12,
        alignItems: "stretch",
      }}
    >
      {/* The names sit OUT of flow, to the left of the dots: in flow they
          would keep the collapsed column as wide as the longest name, and
          the lane they cost is exactly what this change is freeing. A soft
          scrim keeps them readable where they cross the screenshot. */}
      <ol
        style={{
          listStyle: "none",
          margin: 0,
          padding: 0,
          position: "absolute",
          right: "100%",
          top: "50%",
          transform: "translateY(-50%)",
          display: "flex",
          flexDirection: "column",
          gap: 14,
          alignItems: "flex-end",
          justifyContent: "center",
          transition: t,
          pointerEvents: "none",
        }}
      >
        {entries.map(function row(e, i) {
          const on = i === active;
          const shown = open || on;
          return (
            <li key={e.slug} style={{ display: "flex", alignItems: "center" }}>
              <span
                aria-hidden={!shown}
                className="type-eyebrow"
                style={{
                  fontFamily: "var(--font-mono)",
                  color: "var(--color-parch)",
                  opacity: shown ? (on ? 1 : 0.55) : 0,
                  transform: shown ? "translateX(0)" : "translateX(10px)",
                  transition: t,
                  whiteSpace: "nowrap",
                  pointerEvents: "none",
                  // the names cross the screenshot, so they carry their own
                  // ground — our chrome should never read as the client's UI
                  background: "rgba(20,20,18,0.72)",
                  padding: "3px 10px",
                  borderRadius: 4,
                }}
              >
                {e.name}
              </span>
            </li>
          );
        })}
      </ol>

      {/* the dots are the controls */}
      <ol
        className="film-index__dots"
        style={{
          listStyle: "none",
          margin: 0,
          padding: 0,
          display: "flex",
          flexDirection: "column",
          gap: 14,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {entries.map(function dot(e, i) {
          const on = i === active;
          return (
            <li key={e.slug} style={{ display: "flex", alignItems: "center", height: 19 }}>
              <button
                type="button"
                aria-label={e.name}
                aria-current={on ? "true" : undefined}
                onClick={function pick() {
                  onPick(i);
                }}
                style={{
                  width: 9,
                  height: 9,
                  padding: 0,
                  borderRadius: "50%",
                  background: on ? rgba(e.live ? e.tint : "#8A8377", 1) : "transparent",
                  border: on ? "none" : "1px solid var(--hair-d-hi)",
                  transition: t,
                  cursor: "pointer",
                }}
              />
            </li>
          );
        })}
      </ol>

      {/* the progress line, filling in the active tint */}
      <div
        aria-hidden
        style={{ width: 1, background: "var(--hair-d)", position: "relative" }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: rgba(tint, 1),
            transformOrigin: "top",
            transform: `scaleY(${p})`,
            transition: reduce
              ? "none"
              : `transform ${duration.slow * 1000}ms cubic-bezier(${ease.inOut.join(
                  ","
                )}), background-color ${duration.slow * 1000}ms ease`,
          }}
        />
      </div>
    </nav>
  );
});
