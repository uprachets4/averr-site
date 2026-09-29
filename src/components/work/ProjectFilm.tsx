import { forwardRef, useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from "motion/react";
import { duration, ease, easing } from "../../lib/motion";
import { useScrollStyle } from "../../lib/useScrollStyle";
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


/**
 * Where the film is, as a continuous position (0 .. count).
 *
 * A float, not an index: every fade is derived from it, so what you see is
 * a function of scroll rather than of a CSS timer. On a fast scroll a
 * time-based crossfade eats the whole dwell — which is why CapitalCommand
 * looked skipped while the index had already moved on.
 *
 * `lead` is scroll spent on the doors before the first project starts; the
 * stage is pinned across it, so project 0 is already in place behind them.
 */
function useFilmPosition(count: number, enabled: boolean, lead: number) {
  const ref = useRef<HTMLDivElement | null>(null);
  const pos = useMotionValue(0);
  const [display, setDisplay] = useState(0);

  useEffect(
    function track() {
      if (!enabled) return;
      let frame = 0;

      function read() {
        frame = 0;
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        const pinned = Math.max(1, r.height - window.innerHeight);
        const leadPx = lead * window.innerHeight;
        const seg = Math.max(1, (pinned - leadPx) / count);
        const travelled = Math.min(Math.max(-r.top, 0), pinned - 1);
        const p = Math.min(count - 0.001, Math.max(0, (travelled - leadPx) / seg));
        pos.set(p);
        // the index follows the middle of the hand-over, so the highlight
        // and the visible project are never out of step
        setDisplay(Math.min(count - 1, Math.floor(p + 0.125)));
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
    [count, enabled, lead, pos]
  );

  return { ref, pos, display };
}

/**
 * The film: one pinned dark stage, one project at a time.
 *
 * The wrapper is (projects × 100vh) so each project owns a 100vh segment of
 * scroll; the stage itself stays pinned. Everything inside is driven by the
 * one rAF-throttled reader above — no per-project scroll listeners.
 */
export default function ProjectFilm({
  lead = 0,
  onOpen,
}: {
  /** Screens of scroll before project 0 starts (the doors sit over these). */
  lead?: number;
  onOpen?: (entry: VaultEntry, rect: DOMRect) => boolean;
}) {
  const reduce = useReducedMotion();
  const count = vault.length;
  const { ref, pos, display } = useFilmPosition(count, !reduce, lead);
  const active = reduce ? 0 : display;

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
      const pinned = Math.max(1, el.offsetHeight - window.innerHeight);
      const leadPx = lead * window.innerHeight;
      const seg = Math.max(1, (pinned - leadPx) / count);
      // land a little past the start so the project is in full dwell
      window.scrollTo({
        top: top + leadPx + i * seg + seg * 0.25,
        behavior: reduce ? "auto" : "smooth",
      });
    },
    [count, reduce, ref, lead]
  );

  // reduced motion drops the pin entirely: plain stacked sections
  if (reduce) {
    return (
      <div data-tone="dark" style={{ backgroundColor: "var(--color-dark)" }}>
        {vault.map(function still(entry) {
          return (
            <div key={entry.slug} style={{ padding: "96px 0", position: "relative" }}>
              <Segment entry={entry} index={0} active reduce reserve={0} onOpen={onOpen} />
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div
      ref={ref}
      style={{ position: "relative", height: `${(count + 1 + lead) * 100}vh` }}
    >
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
              index={i}
              pos={pos}
              active={i === active}
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

const NAME_TIERS = [
  "type-display-xl",
  "type-display-l",
  "type-h1",
  "type-h2",
  "type-h3",
] as const;

/**
 * The largest type tier at which a name actually fits its column.
 *
 * Measured, not guessed from length: "CadenceStack" is only 12 characters
 * but still ran past its column and sat on top of the screenshot. The test
 * that matters is the WIDEST SINGLE WORD — CharReveal lays words out as
 * inline-blocks and nothing breaks mid-word, so a word wider than the
 * column overflows silently while still reporting one line. Line count
 * alone misses it, which is how this shipped.
 *
 * The ladder runs past the three display tiers into h2 and h3. With the
 * screen at ~64% of the container the text column is ~27%, and a single
 * 14-character word like "CapitalCommand" fits none of the display tiers
 * there — the alternative is letting it sit on the screenshot, which is
 * the defect this replaces.
 */
function useFittedTier(name: string, columnRef: React.RefObject<HTMLElement | null>) {
  const [tier, setTier] = useState(NAME_TIERS.length - 1);

  useEffect(
    function fit() {
      let cancelled = false;

      function measure() {
        const col = columnRef.current;
        if (cancelled || !col) return;
        const width = col.clientWidth;
        if (!width) return;

        const box = document.createElement("div");
        box.style.cssText = `position:absolute;left:-9999px;top:0;visibility:hidden;pointer-events:none;width:${width}px`;
        const word = document.createElement("span");
        word.style.whiteSpace = "nowrap";
        document.body.appendChild(box);
        document.body.appendChild(word);

        const words = name.split(" ");
        let chosen = NAME_TIERS.length - 1;

        for (let t = 0; t < NAME_TIERS.length; t++) {
          box.className = NAME_TIERS[t];
          word.className = NAME_TIERS[t];

          let widest = 0;
          for (const w of words) {
            word.textContent = w;
            widest = Math.max(widest, word.getBoundingClientRect().width);
          }
          if (widest > width) continue;

          box.textContent = name;
          const cs = getComputedStyle(box);
          const lh = parseFloat(cs.lineHeight) || parseFloat(cs.fontSize) * 1.1;
          const lines = Math.round(box.getBoundingClientRect().height / lh);
          if (lines <= 2) {
            chosen = t;
            break;
          }
        }

        box.remove();
        word.remove();
        setTier(chosen);
      }

      measure();
      if (document.fonts) document.fonts.ready.then(measure);

      // the column narrows again once the index reserve lands, so watch the
      // element itself: measuring only on window resize picked a tier for a
      // column that no longer existed by the time it rendered
      const ro = new ResizeObserver(measure);
      if (columnRef.current) ro.observe(columnRef.current);
      window.addEventListener("resize", measure);
      return function cleanup() {
        cancelled = true;
        ro.disconnect();
        window.removeEventListener("resize", measure);
      };
    },
    [name, columnRef]
  );

  return NAME_TIERS[tier];
}

/* Hand-over timing, in fractions of one segment.
   Text leaves in the first part of the band and arrives in the last, with a
   gap between, so two projects' words are never on screen together. Images
   may overlap — only text may not. */
const TEXT_OUT = 0.75;
const TEXT_GONE = 0.85;
const TEXT_IN = 0.1; // before its own start

function Segment({
  entry,
  index,
  pos,
  active,
  reduce,
  reserve,
  onFocusIn,
  onOpen,
}: {
  entry: VaultEntry;
  index: number;
  pos?: MotionValue<number>;
  active: boolean;
  reduce: boolean;
  reserve: number;
  onFocusIn?: () => void;
  onOpen?: (entry: VaultEntry, rect: DOMRect) => boolean;
}) {
  const frameRef = useRef<HTMLDivElement | null>(null);
  const textColRef = useRef<HTMLDivElement | null>(null);
  const i = index;
  const nameClass = useFittedTier(entry.name, textColRef);
  // every fade is derived from scroll position, not a timer
  const zero = useMotionValue(0);
  const p = pos ?? zero;
  const textOpacity = useTransform(
    p,
    [i - TEXT_IN, i, i + TEXT_OUT, i + TEXT_GONE],
    [0, 1, 1, 0]
  );
  const imageOpacity = useTransform(p, [i - 0.25, i - 0.05, i + 0.8, i + 1], [0, 1, 1, 0]);
  const textRef = useScrollStyle<HTMLDivElement>(textOpacity);
  const imageRef = useScrollStyle<HTMLDivElement>(imageOpacity);
  // a slow drift across the segment; the frame never leaves the stage
  const scale = useTransform(p, [i - 0.25, i, i + 1], [0.94, 1, 1.03], {
    ease: [easing.inOut, easing.inOut],
  });
  const y = useTransform(p, [i - 0.25, i], [90, 0], { ease: [easing.inOut] });

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
        // the block now carries a full-width name and is tall enough to
        // centre into the nav's band, so reserve it
        paddingTop: reduce ? 0 : 88,
        pointerEvents: active ? "auto" : "none",
        zIndex: active ? 2 : 1,
      }}
    >
      <div
        ref={function keepText(node: HTMLDivElement | null) {
          textColRef.current = node;
          if (!reduce) textRef(node);
        }}
        style={{
          width: "100%",
          maxWidth: "var(--container-wide)",
          margin: "0 auto",
          paddingRight: reserve,
          opacity: reduce ? 1 : 0,
          position: "relative",
          zIndex: 2,
        }}
      >
        <div
          className="type-eyebrow"
          style={{
            fontFamily: "var(--font-mono)",
            color: "var(--color-muted-l)",
            marginBottom: 14,
          }}
        >
          {entry.sector}
          {entry.year ? ` · ${entry.year}` : ""}
        </div>

        {/* the name gets the full row: in a 27% column even a 14-character
            word had to shrink below its own status line to fit */}
        <h2
          className={nameClass}
          style={{
            color: entry.live ? "var(--color-parch)" : "rgba(237,233,226,0.45)",
            margin: "0 0 28px",
          }}
        >
          {active ? (
            <CharRevealInView text={entry.name} style={{ color: "inherit" }} />
          ) : (
            entry.name
          )}
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 30fr) minmax(0, 70fr)",
            alignItems: "center",
            gap: 48,
          }}
          className="film-grid"
        >
          <div>
            <Figure entry={entry} active={active} reduce={reduce} />

            <div
              className="type-eyebrow"
              style={{
                fontFamily: "var(--font-mono)",
                color: "var(--color-muted-l)",
                margin: "20px 0 28px",
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
          </div>

          <div>
            {entry.preview ? (
              <motion.div
                ref={function keep(node: HTMLDivElement | null) {
                  frameRef.current = node;
                  if (!reduce) imageRef(node);
                }}
                style={
                  reduce
                    ? { transformOrigin: "center" }
                    : { transformOrigin: "center", opacity: 0, scale, y }
                }
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
