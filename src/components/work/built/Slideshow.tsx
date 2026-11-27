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
  slides: { image: string; caption: string }[];
  name: string;
  className?: string;
}) {
  return (
    <div
      className={className ? `bb-slides ${className}` : "bb-slides"}
      role="img"
      aria-label={`Screens from ${name}`}
    >
      {slides.map(function slide(s, i) {
        return (
          <img
            key={s.image}
            src={screen(s.image).small}
            /* The group above is one `role="img"` with its own label,
               so a screen reader announces that and never reaches
               these. The alt is here for everything that does read
               it — image search above all, since prerender lists all
               five in the image sitemap. Same `name: caption` form
               the gallery and the signatures use. */
            alt={`${name}: ${s.caption}`}
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
