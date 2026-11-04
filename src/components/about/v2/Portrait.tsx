/**
 * The founder's photo, as it appears once the mark opens.
 *
 * Two sizes: the 1000x1250 original and a 640w derivative, chosen by
 * `sizes` so a phone never downloads the large one. `decoding="async"`
 * and no `loading="lazy"` — it is in the hero, but it is deliberately
 * not the LCP element; the headline text is.
 *
 * The opening itself is CSS: `clip-path: inset()` with `round`, the
 * figure scaling .86 → 1 and the image 1.12 → 1, all driven by `--r`
 * from the hero's scroll loop.
 */
export default function Portrait() {
  return (
    <figure className="portrait">
      <img
        src="/about/portrait.webp"
        srcSet="/about/portrait-640.webp 640w, /about/portrait.webp 1000w"
        sizes="(max-width: 900px) 92vw, min(420px, 30vw)"
        alt="Prachets Upadhyay, founder of Averr Studios"
        width={1000}
        height={1250}
        decoding="async"
      />
      <figcaption>
        <b>Prachets Upadhyay</b>
        <span>
          Founder · Averr Studios
          <br />
          Toronto
        </span>
      </figcaption>
    </figure>
  );
}
