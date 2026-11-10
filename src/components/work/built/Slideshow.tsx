import { screen } from "../../../data/builtByAverr";

/**
 * The crossfading screens a project without a recording shows instead
 * of a video — CapitalCommand, which has no capture.
 *
 * Five screens on one 20s loop, each held for its own quarter and
 * offset four seconds from the last, exactly as the reference times it.
 * Under reduced motion the stylesheet stops the animation and leaves
 * the first screen visible, so the panel is never blank.
 */
export default function Slideshow({
  slides,
  name,
  className,
}: {
  slides: string[];
  name: string;
  className?: string;
}) {
  return (
    <div
      className={className ? `bb-slides ${className}` : "bb-slides"}
      role="img"
      aria-label={`Screens from ${name}`}
    >
      {slides.map(function slide(src, i) {
        return (
          <img
            key={src}
            src={screen(src).small}
            alt=""
            decoding="async"
            style={{
              animationDelay: `${i * 4 - 1}s`,
              animationDuration: `${slides.length * 4}s`,
            }}
          />
        );
      })}
    </div>
  );
}
