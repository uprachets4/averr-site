/**
 * The section boundary inside the studio.
 *
 * Everywhere else on the site a `Chapter` paints a new surface over the
 * one above it and reveals it with a clip-path slab. On /about every
 * section stands on the same ground, so there is no surface to reveal
 * and a slab would be animating nothing. The sections are separated by
 * light instead: a soft blue horizon, brightest at the centre line,
 * falling off to nothing at both edges.
 *
 * Purely decorative and inert — it is a band of the same ground with a
 * glow in it, so it adds no stacking context and nothing can overlap
 * wrongly.
 */
export default function GlowHorizon({
  tint = "var(--about-glow)",
  height = 170,
}: {
  /** Which light the boundary is lit by. */
  tint?: string;
  height?: number;
}) {
  return (
    <div
      aria-hidden="true"
      className="ah"
      style={{ height, ["--ah-tint" as string]: tint }}
    >
      <span className="ah-glow" />
      <span className="ah-line" />
      <style>{`
        .ah {
          position: relative;
          width: 100%;
          overflow: hidden;
          pointer-events: none;
          background: var(--about-ground);
        }
        .ah-glow {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          width: min(1180px, 94vw);
          height: 100%;
          background: radial-gradient(
            ellipse at center,
            color-mix(in oklab, var(--ah-tint) 26%, transparent) 0%,
            color-mix(in oklab, var(--ah-tint) 9%, transparent) 42%,
            transparent 72%
          );
        }
        .ah-line {
          position: absolute;
          left: 0; right: 0; top: 50%;
          height: 1px;
          background: linear-gradient(
            90deg,
            transparent 0%,
            color-mix(in oklab, var(--ah-tint) 40%, transparent) 22%,
            color-mix(in oklab, var(--ah-tint) 85%, transparent) 50%,
            color-mix(in oklab, var(--ah-tint) 40%, transparent) 78%,
            transparent 100%
          );
        }
      `}</style>
    </div>
  );
}
