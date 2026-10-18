import { ATMOS } from "../../data/atmosphere";

/**
 * An atmosphere plate.
 *
 * The sources are owner-generated (Midjourney, paid plan) and already
 * sit in the palette, so `tools/derive-atmosphere.mjs` only lifts the
 * black point to the site navy, takes a little saturation out and lays
 * the site grain over — no duotone, which would flatten the mist these
 * exist for.
 *
 * Widths come from the generated manifest, so the srcset never offers a
 * size the source cannot fill and nothing is ever upscaled.
 *
 * `portrait` names a second plate used below 860px, where a landscape
 * crop has nothing left in it.
 */
export default function Atmos({
  name,
  portrait,
  sizes = "100vw",
  eager = false,
  className,
}: {
  name: string;
  portrait?: string;
  sizes?: string;
  eager?: boolean;
  className?: string;
}) {
  const land = ATMOS[name];
  if (!land) return null;
  const port = portrait ? ATMOS[portrait] : null;

  const set = (n: string, e: typeof land) =>
    e.widths.map((w) => `/atmos/${n}-${w}.webp ${w}w`).join(", ");

  return (
    <picture className={className ? `atmos ${className}` : "atmos"} aria-hidden>
      {port ? (
        <source media="(max-width: 860px)" srcSet={set(portrait!, port)} sizes={sizes} />
      ) : null}
      <source srcSet={set(name, land)} sizes={sizes} />
      <img
        src={`/atmos/${name}-${land.widths[0]}.webp`}
        alt=""
        width={land.w}
        height={land.h}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        fetchPriority={eager ? "high" : "low"}
      />
    </picture>
  );
}
