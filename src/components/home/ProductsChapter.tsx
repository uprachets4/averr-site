import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useReducedMotion } from "motion/react";
import ServiceChapter, { type ChapterSpec } from "./ServiceChapter";
import { ProductStack, PRODUCTS } from "./chapterObjects";
import { caseStudies } from "../../data/caseStudies";

/**
 * Ch3 — Products.
 *
 * The chapter that had the least on screen. Two services is a short
 * list, and the masked-band "exploded" object was one capture cut into
 * five strips that read as muddy overlapping panels. It is three real
 * products now — the console, the job-search SaaS and the LinkedIn
 * system — and THE THREE TAKE TURNS AT THE FRONT: the stack reorders to
 * whichever product the reader is pointing at, and rotates on its own
 * until they point at something.
 *
 * NO UNVERIFIED FIGURES: a tile prints a number only where
 * `caseStudies.ts` has a `headlineFigure`. Of these three only SIFT
 * does, so only SIFT's tile carries one. The other two carry their
 * sector instead, which is a fact the data already holds.
 */

const SPEC: ChapterSpec = {
  id: "ch-products",
  word: "PRODUCTS",
  tint: "rgba(61,107,255,0.44)",
  line: "Software your customers actually enjoy using.",
  support: "Dashboards, portals and SaaS products, designed and built as one system.",
  services: [
    { pillar: "design", name: "Product & SaaS interfaces" },
    { pillar: "design", name: "Design systems" },
  ],
  fill: [
    "/work/capitalcommand/w/01-overview-1680.webp",
    "/work/sift/w/01-command-overview-1680.webp",
  ],
  lift: 0.8,
  proof: "capitalcommand",
};

/** How long a product holds the front before the stack turns itself. */
const ROTATE_MS = 3000;

export default function ProductsChapter() {
  const reduce = !!useReducedMotion();
  const [front, setFront] = useState(0);
  /* The rotation is an invitation, not a carousel: the first time the
     reader points at anything it stops, and it never starts again. */
  const [taken, setTaken] = useState(false);
  const takenRef = useRef(false);

  const pick = useCallback(function choose(i: number) {
    takenRef.current = true;
    setTaken(true);
    setFront(i);
  }, []);

  useEffect(
    function rotate() {
      if (reduce || taken) return;
      /* Only while the chapter is actually being read. ServiceChapter
         owns the DOM here, so the section is found by the id the spec
         already carries rather than by threading another ref through. */
      const section = document.getElementById(SPEC.id);
      if (!section) return;

      let timer = 0;
      function start() {
        if (timer || takenRef.current) return;
        timer = window.setInterval(function turn() {
          if (takenRef.current) return;
          setFront(function next(f) {
            return (f + 1) % PRODUCTS.length;
          });
        }, ROTATE_MS);
      }
      function stop() {
        if (!timer) return;
        window.clearInterval(timer);
        timer = 0;
      }

      /* "At dwell" is the section covering the MIDDLE of the viewport,
         not a ratio of itself: this chapter pins for 320vh, so in a
         900px viewport its intersection ratio tops out near 0.31 and a
         threshold of 0.4 could never be met — the rotation never ran. */
      const io = new IntersectionObserver(
        function seen(entries) {
          if (entries.some((e) => e.isIntersecting)) start();
          else stop();
        },
        { rootMargin: "-40% 0px -40% 0px", threshold: 0 }
      );
      io.observe(section);
      return function off() {
        io.disconnect();
        stop();
      };
    },
    [reduce, taken]
  );

  const below = <ProofTiles front={front} onPick={pick} />;

  return (
    <ServiceChapter
      spec={SPEC}
      object={function stack(p) {
        return <ProductStack {...p} front={front} reduce={reduce} />;
      }}
      below={below}
    />
  );
}

function ProofTiles({ front, onPick }: { front: number; onPick: (i: number) => void }) {
  /* The tile is a BUTTON that brings its product to the front, with the
     case-study link as its own control underneath.
     It was one Link doing both jobs, and a tap could not be made to
     swap without navigating: react-router runs the navigation in a
     transition ~240ms after the click, and preventDefault on the click
     — even in the capture phase — did not hold it. A button has no
     default to fight, so hover, focus, click and tap all mean the same
     thing on every input, and "read the case study" is explicit. */
  return (
    <ul className="pt-row">
      {PRODUCTS.map(function tile(product, i) {
        const cs = caseStudies[product.slug];
        if (!cs) return null;
        const fig = cs.headlineFigure;
        const on = i === front;
        return (
          <li key={product.slug} className={on ? "pt pt--on" : "pt"}>
            <button
              type="button"
              className="pt-swap"
              aria-pressed={on}
              onMouseEnter={function enter() {
                onPick(i);
              }}
              onFocus={function focus() {
                onPick(i);
              }}
              onClick={function click() {
                onPick(i);
              }}
            >
              <span className="pt-head">
                <span className="pt-name">{cs.client}</span>
                {fig ? (
                  <span className="pt-fig">{fig.value}</span>
                ) : (
                  <span className="pt-sector">{cs.sector}</span>
                )}
              </span>
              <span className="pt-line">{cs.hero.thesis}</span>
              {fig ? <span className="pt-cap">{fig.caption}</span> : null}
            </button>
            <Link
              to={`/work/${product.slug}`}
              className="pt-open"
              onFocus={function focus() {
                onPick(i);
              }}
            >
              Read the {cs.client} case study
              <span className="pt-arrow" aria-hidden>→</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
