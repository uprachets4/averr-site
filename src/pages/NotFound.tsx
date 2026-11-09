import { useCallback, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { MARK_PATH_D } from "../components/MonogramMark";
import { useDocumentMeta, META } from "../lib/documentMeta";
import { useDeclarePageEndTone } from "../lib/pageTone";
import { useSetNavDarkOverride } from "../lib/navTone";
import { embedRequested, openModal, warmEmbed } from "../components/services/passBooking";
import { prefersReducedMotion, easeInOut } from "../components/about/v2/useSectionProgress";
import "../components/contact/v2/contact.css";

/**
 * 404, spec 34 part B.
 *
 * Rebuilt in the navy world out of the Contact page's own parts: it
 * reuses `.ct`, its tokens, its `.ways`-style rows and its buttons,
 * so there is no second sheet to keep in step. There is no reference
 * file for this page; the pieces are.
 *
 * What it replaces: the original cream design, whose serif italic
 * "Yet." and light-on-cream palette carried 17 contrast failures.
 * No italics anywhere now.
 *
 * `CaseStudy` renders this for an unknown slug too, so a wrong case
 * file link lands in the same navy 404 rather than the old cream one.
 */

const ROUTES: { to: string; label: string; line: string }[] = [
  { to: "/work", label: "Work", line: "Five projects, start to finish." },
  {
    to: "/services",
    label: "Services",
    line: "Websites, Web Apps, AI Automation and Marketing.",
  },
  { to: "/about", label: "About", line: "The person who builds it." },
  { to: "/contact", label: "Contact", line: "Write to me, or book a call." },
];

export default function NotFound() {
  useDocumentMeta(META.notFound.title, META.notFound.description);
  useDeclarePageEndTone("dark");

  const markRef = useRef<SVGSVGElement | null>(null);
  const strokeRef = useRef<SVGPathElement | null>(null);

  const setNavDark = useSetNavDarkOverride();
  useEffect(
    function navAlwaysDark() {
      setNavDark(true);
      const root = document.documentElement;
      root.style.setProperty("--nav-dark-bar", "#13161E");
      return function reset() {
        setNavDark(false);
        root.style.removeProperty("--nav-dark-bar");
      };
    },
    [setNavDark]
  );

  /* The mini mark signs once, on load. */
  useEffect(function sign() {
    const svg = markRef.current;
    const path = strokeRef.current;
    if (!svg || !path) return;

    const L = path.getTotalLength();
    path.style.strokeDasharray = String(L);
    path.style.strokeDashoffset = String(L);

    if (prefersReducedMotion()) {
      path.style.strokeDashoffset = "0";
      svg.classList.add("signed");
      return;
    }

    let raf = 0;
    const t0 = performance.now();
    (function frame(now: number) {
      const k = Math.min(1, (now - t0) / 1800);
      path.style.strokeDashoffset = String(L * (1 - easeInOut(k)));
      if (k < 1) raf = requestAnimationFrame(frame);
      else svg.classList.add("signed");
    })(t0);

    return function stop() {
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const warm = useCallback(function intent() {
    if (!embedRequested()) warmEmbed().catch(() => undefined);
  }, []);
  const book = useCallback(function book() {
    /* No date, as ruled: this CTA has no picked day. */
    openModal({ notes: "404 page" }).catch(() => undefined);
  }, []);

  return (
    <div className="ct">
      <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
        <defs>
          <linearGradient id="ctgrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#F9AF97" />
            <stop offset=".33" stopColor="#D5818C" />
            <stop offset=".66" stopColor="#9874E8" />
            <stop offset="1" stopColor="#569AFA" />
          </linearGradient>
          <linearGradient id="ctfill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#FFFFFF" />
            <stop offset="1" stopColor="#E6E3F2" />
          </linearGradient>
        </defs>
      </svg>
      <div className="grain" aria-hidden="true" />

      <section className="nf404 gut" aria-labelledby="nf-h1">
        <div className="orb a" aria-hidden="true" />
        <div className="wrap nf404in">
          <svg className="nf404mark" viewBox="0 0 327 454" aria-hidden="true" ref={markRef}>
            <path className="mfill" d={MARK_PATH_D} fillRule="evenodd" />
            <path className="mstroke" d={MARK_PATH_D} fillRule="evenodd" ref={strokeRef} />
          </svg>

          <span className="eyebrow">404</span>
          <h1 id="nf-h1">This page doesn't exist.</h1>
          <p className="lede">
            The link may be old, or mistyped. Here's where everything lives.
          </p>

          <nav className="nf404rows" aria-label="Where everything lives">
            {ROUTES.map(function row(r) {
              return (
                <Link to={r.to} key={r.to}>
                  <span>
                    <b>{r.label}</b>
                    <em>{r.line}</em>
                  </span>
                  <i aria-hidden="true">→</i>
                </Link>
              );
            })}
          </nav>

          <button
            className="btn nf404cta"
            type="button"
            onMouseEnter={warm}
            onFocus={warm}
            onPointerDown={warm}
            onClick={book}
          >
            Book a call →
          </button>
        </div>
      </section>
    </div>
  );
}
