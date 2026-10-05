import { SCREENSHOTS } from "../data/screenshots";

/**
 * The one way a product screenshot is rendered.
 *
 * Every capture under `public/work/` has committed WebP derivatives at
 * 640/960/1280 and its own natural width (never upscaled — see
 * `tools/derive-screenshots.mjs`). This emits a `<picture>` so the
 * browser picks one, with the original JPEG as the fallback `<img>` for
 * anything that does not take WebP.
 *
 * The intrinsic `width`/`height` always go on the `<img>`, so the box is
 * reserved before a byte arrives. That alone is what took /work's CLS
 * from 0.054 to 0.016 in 19-pre; doing it everywhere keeps the rest of
 * the site from earning the same problem.
 *
 * A `src` with no entry in the manifest (a non-work image, or one added
 * without re-running the script) degrades to a plain `<img>` rather than
 * rendering nothing.
 */
/**
 * The `<source>` for a screenshot, for the few places that animate the
 * `<img>` itself and so cannot use the component below. Returns null for
 * anything outside the manifest.
 */
export function WebpSource({ src, sizes = "100vw" }: { src: string; sizes?: string }) {
  const meta = SCREENSHOTS[src];
  if (!meta) return null;
  const base = src.replace(/\.(jpe?g|png)$/i, "");
  const dir = base.slice(0, base.lastIndexOf("/"));
  const name = base.slice(base.lastIndexOf("/") + 1);
  return (
    <source
      type="image/webp"
      srcSet={meta.widths.map((w) => `${dir}/w/${name}-${w}.webp ${w}w`).join(", ")}
      sizes={sizes}
    />
  );
}

/** Intrinsic size, for callers that set their own `<img>`. */
export function screenshotSize(src: string) {
  return SCREENSHOTS[src];
}

export default function Screenshot({
  src,
  alt,
  sizes = "100vw",
  loading = "lazy",
  fetchPriority,
  decoding = "async",
  className,
  style,
  imgRef,
}: {
  src: string;
  alt: string;
  /** What the image measures at each breakpoint. Default assumes full-bleed. */
  sizes?: string;
  loading?: "lazy" | "eager";
  fetchPriority?: "high" | "low" | "auto";
  decoding?: "sync" | "async" | "auto";
  className?: string;
  style?: React.CSSProperties;
  imgRef?: React.Ref<HTMLImageElement>;
}) {
  const meta = SCREENSHOTS[src];
  const base = src.replace(/\.(jpe?g|png)$/i, "");
  const dir = base.slice(0, base.lastIndexOf("/"));
  const name = base.slice(base.lastIndexOf("/") + 1);

  const img = (
    <img
      ref={imgRef}
      src={src}
      alt={alt}
      width={meta?.w}
      height={meta?.h}
      loading={loading}
      fetchPriority={fetchPriority}
      decoding={decoding}
      className={className}
      style={{ display: "block", width: "100%", height: "auto", ...style }}
    />
  );

  if (!meta) return img;

  const srcSet = meta.widths
    .map((w) => `${dir}/w/${name}-${w}.webp ${w}w`)
    .join(", ");

  return (
    <picture>
      <source type="image/webp" srcSet={srcSet} sizes={sizes} />
      {img}
    </picture>
  );
}
