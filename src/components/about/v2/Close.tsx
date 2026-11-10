import { useCallback, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { MARK_PATH_D } from "../../MonogramMark";
import { embedRequested, openModal, warmEmbed } from "../../services/passBooking";
import { easeInOut, prefersReducedMotion } from "./useSectionProgress";

/**
 * The close: the mark signs one last time, then the ask.
 *
 * The page opened on the pen writing the monogram and it ends the same
 * way, smaller. It signs ONCE, when 60% of it is in view — an
 * IntersectionObserver rather than the page's scroll loop, because
 * this fires a single time and has nothing to track per frame. The
 * observer disconnects itself the moment it has fired.
 *
 * No React state, like the three pinned sections above it: the
 * `signed` class is written straight onto the node.
 */
export default function Close() {
  const rootRef = useRef<SVGSVGElement | null>(null);
  const strokeRef = useRef<SVGPathElement | null>(null);

  useEffect(function signOnce() {
    const svg = rootRef.current;
    const path = strokeRef.current;
    if (!svg || !path) return;

    const L = path.getTotalLength();
    path.style.strokeDasharray = String(L);
    path.style.strokeDashoffset = String(L);

    /* Reduced motion: it is simply already signed. */
    if (prefersReducedMotion()) {
      path.style.strokeDashoffset = "0";
      svg.classList.add("signed");
      return;
    }

    let raf = 0;
    let fired = false;
    const io = new IntersectionObserver(
      function onView(entries) {
        for (const e of entries) {
          if (!e.isIntersecting || fired) continue;
          fired = true;
          io.disconnect();
          const t0 = performance.now();
          (function frame(now: number) {
            const k = Math.min(1, (now - t0) / 2000);
            path.style.strokeDashoffset = String(L * (1 - easeInOut(k)));
            if (k < 1) raf = requestAnimationFrame(frame);
            else svg.classList.add("signed");
          })(t0);
        }
      },
      { threshold: 0.6 }
    );
    io.observe(svg);

    return function stop() {
      io.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  /* Booking, the same flow /services and the hero use. */
  const warm = useCallback(function intent() {
    if (!embedRequested()) warmEmbed().catch(() => undefined);
  }, []);
  const book = useCallback(function book() {
    /* No date: this CTA has no picked day, so Cal opens on its own
       next available slot rather than an empty one. */
    openModal({ notes: "About page" }).catch(() => undefined);
  }, []);

  return (
    <section className="close gut" aria-labelledby="ab-ch">
      <div className="wrap">
        <svg
          className="minimark"
          viewBox="0 0 327 454"
          aria-hidden="true"
          ref={rootRef}
        >
          <path
            className="mfill"
            d={MARK_PATH_D}
            fill="url(#mfillg)"
            fillRule="evenodd"
          />
          <path
            className="mstroke"
            d={MARK_PATH_D}
            fillRule="evenodd"
            ref={strokeRef}
          />
        </svg>

        <span className="eyebrow">Start here</span>

        <h2 id="ab-ch">
          Ready to build a site that{" "}
          <span className="gt">earns its place</span>?
        </h2>

        <p className="who">
          <img
            src="/about/avatar.webp"
            alt="Prachets Upadhyay"
            width={44}
            height={44}
            loading="lazy"
            decoding="async"
          />
          30 minutes with the person who builds it. No slide deck.
        </p>

        <div className="ctas">
          <button
            className="btn"
            type="button"
            onMouseEnter={warm}
            onFocus={warm}
            onPointerDown={warm}
            onClick={book}
          >
            Book a call →
          </button>
          <Link className="ghost" to="/work">
            See the work →
          </Link>
        </div>
      </div>
    </section>
  );
}
