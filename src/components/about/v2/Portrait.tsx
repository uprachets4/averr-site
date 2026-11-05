/**
 * The founder's photo, as it appears once the mark opens.
 *
 * Two sizes: the 1000x1250 original and a 640w derivative, chosen by
 * `sizes` so a phone never downloads the large one. `decoding="async"`
 * and no `loading="lazy"` — it is in the hero, but it is deliberately
 * not the LCP element; the headline text is.
 *
 * `sizes` must describe the width the sheet ACTUALLY renders, or the
 * whole srcset is wasted. It said `92vw` on phones and
 * `min(420px, 30vw)` above them; neither was true, and the phone
 * figure was wide enough on paper that the browser fetched the 1000w
 * file at DPR 2 — the one case the 640w derivative exists to avoid.
 * It fetched BOTH, in fact. The real widths, from about.css:
 *
 *   ≤900px   `.portrait { width: min(340px, 82vw) }`
 *            → 82vw below 414px, 340px above it
 *   >900px   `.portrait { height: min(64vh, 600px); aspect-ratio: 4/5 }`
 *            → width = min(480px, 51.2vh), 51.2vh below 937px tall
 *
 * Written out as plain media conditions rather than `min()` inside
 * `sizes`, which is newer than the rest of what this sheet relies on.
 *
 * `src` stays the 1000w original: it is the fallback any browser that
 * ignores `srcset` will take, and it is the one file guaranteed to
 * exist at every width.
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
        sizes="(max-width: 414px) 82vw, (max-width: 900px) 340px, (max-height: 937px) 51.2vh, 480px"
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
