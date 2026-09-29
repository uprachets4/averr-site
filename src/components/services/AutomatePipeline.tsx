import { useEffect, useRef } from "react";
import { PIPELINE_CHIPS } from "../../data/servicesProcess";

/**
 * The task chips that travel the Automate node path.
 *
 * Why a hand-written rAF loop rather than motion:
 *   - this layer lives inside the pillar's `position: sticky` frame, and
 *     motion hardware-accelerates opacity into a ViewTimeline bound to the
 *     element's progress through its scrollport. Inside a pin that progress
 *     never advances, WAAPI takes ownership of the property, and the chip
 *     freezes at whatever opacity it was handed (see §5.1 of the handoff).
 *     Writing `style.transform` and `style.opacity` by hand sidesteps the
 *     whole class of bug — nothing else ever owns these properties.
 *   - the motion is a continuous loop, not scroll-linked, so there is no
 *     MotionValue for `useScrollStyle` to subscribe to in the first place.
 *
 * Positions are written as pixel translations, never percentages: a CSS
 * transform percentage resolves against the element's OWN border box, so
 * `translate(55%)` on a chip moves it by 55% of the chip, not 55% of the
 * diagram. The host's measured size converts the path's 0–400 space to px.
 *
 * Only transform and opacity are written. The loop is suspended entirely
 * when the diagram leaves the viewport.
 */

/** The four quadratic segments of the node path, in the SVG's 0–400 space.
 *  Kept in sync with WORKFLOW_EDGES in Services.tsx — same control points. */
const SEGMENTS: Array<{
  p0: [number, number];
  c: [number, number];
  p1: [number, number];
}> = [
  { p0: [60, 90], c: [100, 60], p1: [145, 145] },
  { p0: [145, 145], c: [200, 220], p1: [220, 215] },
  { p0: [220, 215], c: [280, 170], p1: [300, 175] },
  { p0: [300, 175], c: [350, 240], p1: [360, 290] },
];

const VIEWBOX = 400;
/** One full traverse of all four segments. */
const CYCLE_MS = 6000;
/** Three chips in flight keeps 2–3 visible at any moment without crowding
 *  the 720px ambient. */
const CHIP_COUNT = 3;
/** Fraction of the cycle a chip spends fading in / out at the ends. */
const FADE = 0.07;
/**
 * Fraction of the cycle spent travelling; the remainder is a dwell at the
 * final node.
 *
 * Without it the last label is unreachable: the label is what the task is
 * called having cleared `floor(p)` nodes, so "Logged" only applies at
 * exactly p === 4 — the last instant of the cycle, by which point the chip
 * is already fading out. The dwell gives the chip time to sit at Measure
 * actually reading "Logged" before it goes.
 */
const TRAVEL = 0.85;
/** How close (in segments) a chip must be for a node to be lit at all. */
const PULSE_RANGE = 0.3;

function quadAt(seg: (typeof SEGMENTS)[number], t: number): [number, number] {
  const u = 1 - t;
  const x = u * u * seg.p0[0] + 2 * u * t * seg.c[0] + t * t * seg.p1[0];
  const y = u * u * seg.p0[1] + 2 * u * t * seg.c[1] + t * t * seg.p1[1];
  return [x, y];
}

/** Unit position (0–1 of the diagram) and label for a chip `p` segments
 *  into the path, where p runs 0 → 4. */
function sample(p: number): { u: number; v: number; label: string } {
  const clamped = Math.max(0, Math.min(SEGMENTS.length, p));
  const idx = Math.min(SEGMENTS.length - 1, Math.floor(clamped));
  const t = clamped - idx;
  const [x, y] = quadAt(SEGMENTS[idx], t);
  // The label is what the task is called having cleared `floor(p)` nodes,
  // so it flips exactly as the chip reaches each node.
  const label =
    PIPELINE_CHIPS[Math.min(PIPELINE_CHIPS.length - 1, Math.floor(clamped))];
  return { u: x / VIEWBOX, v: y / VIEWBOX, label };
}

/** Node n sits at p = n, so the same sampler places the halos. */
const NODE_POS = PIPELINE_CHIPS.map((_, i) => sample(i));

const LAYER_STYLE: React.CSSProperties = {
  position: "absolute",
  inset: 0,
  pointerEvents: "none",
};

const CHIP_STYLE: React.CSSProperties = {
  position: "absolute",
  left: 0,
  top: 0,
  willChange: "transform, opacity",
  padding: "5px 10px",
  borderRadius: 100,
  background: "var(--color-dark)",
  color: "var(--color-parch)",
  fontFamily: "var(--font-mono)",
  whiteSpace: "nowrap",
  pointerEvents: "none",
};

/**
 * Geometry that has to agree with the SVG underneath.
 *
 * The nodes are r=20 in a 0–400 viewBox, so they render at 0.1 × the host's
 * width — 72px across at the 720px ambient. The halo has to sit OUTSIDE
 * that or it reads as a second outline on the node rather than a pulse.
 */
const HOST_REF_W = 720;
const HALO_SIZE = 104;
/** Chips ride this far above the path. The node labels sit 32px below each
 *  node centre, so a chip centred on the path lands right on top of them. */
const CHIP_LIFT = -26;

const HALO_STYLE: React.CSSProperties = {
  position: "absolute",
  left: 0,
  top: 0,
  width: HALO_SIZE,
  height: HALO_SIZE,
  borderRadius: "50%",
  border: "1px solid var(--color-ink)",
  opacity: 0,
  willChange: "transform, opacity",
  pointerEvents: "none",
};

export default function AutomatePipeline({ reduce }: { reduce: boolean }) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const chipRefs = useRef<Array<HTMLDivElement | null>>([]);
  const haloRefs = useRef<Array<HTMLDivElement | null>>([]);
  const labelCache = useRef<string[]>([]);

  useEffect(
    function runLoop() {
      if (reduce) return;
      const host = hostRef.current;
      if (!host) return;

      let raf = 0;
      let running = false;
      let start = 0;
      let w = host.clientWidth;
      let h = host.clientHeight;

      const ro = new ResizeObserver(function onResize() {
        w = host.clientWidth;
        h = host.clientHeight;
      });
      ro.observe(host);

      function frame(now: number) {
        if (!start) start = now;
        const base = ((now - start) % CYCLE_MS) / CYCLE_MS;

        // Where every chip is this frame, in segment space (0 → 4).
        const positions: number[] = [];

        for (let i = 0; i < CHIP_COUNT; i++) {
          // Stagger the chips evenly around the cycle.
          const phase = (base + i / CHIP_COUNT) % 1;
          // Travel over the first TRAVEL of the cycle, then dwell at the
          // final node so the last label is readable.
          const p = Math.min(1, phase / TRAVEL) * SEGMENTS.length;
          positions.push(p);

          const el = chipRefs.current[i];
          if (!el) continue;
          const { u, v, label } = sample(p);

          // Fade at both ends so a chip never pops at the trigger node.
          let opacity = 1;
          if (phase < FADE) opacity = phase / FADE;
          else if (phase > 1 - FADE) opacity = (1 - phase) / FADE;

          const lift = CHIP_LIFT * (w / HOST_REF_W);
          el.style.transform = `translate(${u * w}px, ${v * h + lift}px) translate(-50%, -50%)`;
          el.style.opacity = String(opacity);

          if (labelCache.current[i] !== label) {
            labelCache.current[i] = label;
            el.textContent = label;
          }
        }

        // A node lights as the nearest chip reaches it and falls away again.
        for (let n = 0; n < NODE_POS.length; n++) {
          const halo = haloRefs.current[n];
          if (!halo) continue;
          let nearest = Infinity;
          for (const p of positions) {
            nearest = Math.min(nearest, Math.abs(p - n));
          }
          const lit = nearest < PULSE_RANGE ? 1 - nearest / PULSE_RANGE : 0;
          const { u, v } = NODE_POS[n];
          // The halo is authored at HOST_REF_W and scaled to the real host,
          // so it keeps its ring-outside-the-node relationship at any width.
          const s = (w / HOST_REF_W) * (1 + lit * 0.18);
          halo.style.opacity = String(lit * 0.42);
          halo.style.transform = `translate(${u * w}px, ${v * h}px) translate(-50%, -50%) scale(${s})`;
        }

        raf = requestAnimationFrame(frame);
      }

      // The chips are ambient: off-screen they are pure wasted work, and a
      // paused loop also means the page is not animating behind the reader
      // while they are three sections further down.
      const io = new IntersectionObserver(
        function onVisible(entries) {
          const visible = entries.some((e) => e.isIntersecting);
          if (visible && !running) {
            running = true;
            start = 0;
            raf = requestAnimationFrame(frame);
          } else if (!visible && running) {
            running = false;
            cancelAnimationFrame(raf);
          }
        },
        { threshold: 0 }
      );
      io.observe(host);

      return function cleanup() {
        io.disconnect();
        ro.disconnect();
        cancelAnimationFrame(raf);
      };
    },
    [reduce]
  );

  // Reduced motion: one chip resting at each node, every label legible at
  // once — a real final state, not a frozen frame of the animation.
  if (reduce) {
    return (
      <div ref={hostRef} aria-hidden style={LAYER_STYLE}>
        {PIPELINE_CHIPS.map(function restingChip(label, i) {
          const { u, v } = NODE_POS[i];
          return (
            <div
              key={label}
              className="type-eyebrow"
              style={{
                ...CHIP_STYLE,
                left: `${u * 100}%`,
                top: `${v * 100}%`,
                // same lift as the moving chips, clearing the node labels
                transform: `translate(-50%, calc(-50% + ${CHIP_LIFT}px))`,
              }}
            >
              {label}
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div ref={hostRef} aria-hidden style={LAYER_STYLE}>
      {NODE_POS.map(function halo(_, i) {
        return (
          <div
            key={`halo-${i}`}
            ref={function set(el) {
              haloRefs.current[i] = el;
            }}
            style={HALO_STYLE}
          />
        );
      })}
      {Array.from({ length: CHIP_COUNT }).map(function chip(_, i) {
        return (
          <div
            key={`chip-${i}`}
            ref={function set(el) {
              chipRefs.current[i] = el;
            }}
            className="type-eyebrow"
            style={{ ...CHIP_STYLE, opacity: 0 }}
          />
        );
      })}
    </div>
  );
}
