import { Suspense, lazy, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useReducedMotion } from "motion/react";
import { Chip, TwoTone } from "./Bits";
import Atmos from "./Atmos";
import { MARK_PATH_D } from "../MonogramMark";

/**
 * The last three sections of home.
 *
 *   ONE STUDIO     the PU mark as a real extruded object, with the four
 *                  capabilities orbiting it on a tilted ring.
 *   WHO BUILDS IT  the founder card.
 *   THE ENDING     a word-filling statement over a rising mesh.
 */

const Mark3D = lazy(() => import("./Mark3D"));

/* ── 1 · one studio ────────────────────────────────────────────────── */

const RING = [
  { label: "Design", href: "/services#brand-and-design-direction" },
  { label: "Build", href: "/services#marketing-websites" },
  { label: "Automate", href: "/services#ai-agents" },
  { label: "Grow", href: "/services#local-search" },
];

export function OneStudio() {
  const reduce = !!useReducedMotion();
  const ref = useRef<HTMLDivElement | null>(null);
  const [on, setOn] = useState(false);

  /* the 3D mark is a lazy chunk; it mounts when the section is near */
  useEffect(function near() {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      function seen(es) {
        if (es.some((e) => e.isIntersecting)) {
          setOn(true);
          io.disconnect();
        }
      },
      { rootMargin: "400px 0px" }
    );
    io.observe(el);
    return function off() {
      io.disconnect();
    };
  }, []);

  return (
    <section className="os" ref={ref}>
      <Atmos
        name="04-one-studio-valley"
        portrait="10-mobile-one-studio"
        sizes="100vw"
        className="os-plate"
      />
      <div className="os-sky" aria-hidden />
      <div className="os-inner">
        <Chip tone="dark">One studio</Chip>
        <h2 className="os-h2">
          One studio. <em>Start to finish.</em>
        </h2>
        <p className="os-line">
          No hand-offs between agencies. The person who designs it builds it, automates it and
          grows it.
        </p>

        <div className="os-stage">
          {on && !reduce ? (
            <Suspense fallback={<MarkFlat />}>
              <Mark3D />
            </Suspense>
          ) : (
            <MarkFlat />
          )}
          <ul className="os-ring">
            {RING.map(function chip(r, i) {
              return (
                <li key={r.label} style={{ "--i": i } as React.CSSProperties}>
                  <Link to={r.href} className="os-chip">
                    {r.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}

/** The still the 3D mark replaces — and what reduced motion keeps. */
function MarkFlat() {
  return (
    <svg className="os-flat" viewBox="0 0 327 454" aria-hidden>
      <defs>
        <linearGradient id="osgrad" x1="0" y1="0" x2="1" y2="0.3">
          <stop offset="0%" stopColor="#F9AF97" />
          <stop offset="52%" stopColor="#9874E8" />
          <stop offset="100%" stopColor="#569AFA" />
        </linearGradient>
      </defs>
      <path d={MARK_PATH_D} fill="url(#osgrad)" fillRule="evenodd" />
    </svg>
  );
}

/* ── 2 · who builds it ─────────────────────────────────────────────── */

const CREDITS = [
  { k: "Co-founded", v: "KlaasX Edutech · 15-person team · 150+ institutions" },
  { k: "Sales", v: "B2B SaaS for Google" },
  { k: "Based", v: "Toronto" },
];

export function WhoBuildsIt() {
  return (
    <section className="wb">
      <div className="wb-inner">
        <Chip>Who builds it</Chip>
        <TwoTone
          className="wb-h2"
          lead="You work directly with"
          rest="the person who builds it."
        />
        <div className="wb-card">
          <div className="wb-card__mark">
            <MarkFlat />
          </div>
          <div className="wb-card__body">
            <p className="wb-stmt">
              Started Averr Studios to build the kind of client websites that actually{" "}
              <em>earn their portfolio slot.</em>
            </p>
            <dl className="wb-credits">
              {CREDITS.map(function c(x) {
                return (
                  <div key={x.k}>
                    <dt>{x.k}</dt>
                    <dd>{x.v}</dd>
                  </div>
                );
              })}
            </dl>
            <Link to="/about" className="wb-more">
              Meet the person who builds it <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── 3 · the ending ────────────────────────────────────────────────── */

const END = "Your business deserves to be chosen. Let's build what it runs on.";

export function Ending() {
  const reduce = !!useReducedMotion();
  const ref = useRef<HTMLParagraphElement | null>(null);
  const words = END.split(" ");

  useEffect(
    function fill() {
      const el = ref.current;
      if (!el || reduce) return;
      const spans = el.querySelectorAll<HTMLElement>(".en-w");
      let raf = 0;
      function read() {
        raf = 0;
        const r = el!.getBoundingClientRect();
        const t = (window.innerHeight * 0.88 - r.top) / (r.height + window.innerHeight * 0.45);
        const k = Math.max(0, Math.min(1, t));
        const lit = k * spans.length * 1.2;
        spans.forEach(function one(s, i) {
          s.style.color = i < lit ? "#fff" : "rgba(255,255,255,0.3)";
        });
        /* the mesh rises as the words fill */
        window.dispatchEvent(new CustomEvent("nl-amp", { detail: 1 + k * 0.9 }));
      }
      function on() {
        if (!raf) raf = requestAnimationFrame(read);
      }
      read();
      window.addEventListener("scroll", on, { passive: true });
      window.addEventListener("resize", on);
      return function off() {
        cancelAnimationFrame(raf);
        window.removeEventListener("scroll", on);
        window.removeEventListener("resize", on);
      };
    },
    [reduce]
  );

  return (
    <section className="en" id="ch-start">
      <Atmos
        name="05-ending-lake"
        portrait="06-mobile-ending"
        sizes="100vw"
        className="en-plate"
      />
      <div className="en-sky" aria-hidden />
      <div className="en-mesh-still" aria-hidden />
      <div className="en-inner">
        <Chip tone="dark">Your move</Chip>
        <p ref={ref} className={reduce ? "en-stmt en-stmt--all" : "en-stmt"}>
          {words.map(function w(word, i) {
            return (
              <span className="en-w" key={i}>
                {word}{" "}
              </span>
            );
          })}
        </p>
        <div className="en-ctas">
          <Link to="/contact" className="nh-cta">
            <span className="nh-cta__i" aria-hidden>
              <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8">
                <rect x="3" y="4.5" width="18" height="16" rx="3" />
                <path d="M3 9.5h18M8 2.6v3.4M16 2.6v3.4" />
              </svg>
            </span>
            Book a discovery call
          </Link>
          <Link to="/contact#brief" className="nh-ghost">
            Send a brief
          </Link>
        </div>
      </div>
    </section>
  );
}
