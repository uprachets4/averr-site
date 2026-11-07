import { useEffect, useRef } from "react";
import { useDeclarePageEndTone } from "../lib/pageTone";
import { useSetNavDarkOverride } from "../lib/navTone";
import SignatureHero from "../components/about/v2/SignatureHero";
import Principles from "../components/about/v2/Principles";
import OneLine from "../components/about/v2/OneLine";
import Close from "../components/about/v2/Close";
import { useSectionProgress } from "../components/about/v2/useSectionProgress";
import "../components/about/v2/about.css";

/* ═══════════════════════════════════════════════════════════════
   /about, spec 33 — complete.

   Four sections, all under one `.ab` root and all fed by one rAF:
   the signature hero (step 2), "How we think" (step 3), "How we work"
   (step 4) and the close (step 5).

   The old page's components are gone as of step 5. Four of them
   injected GLOBAL rules from component <style> blocks, and one of
   those cost a session: SignatureMark declared
   `.sig { display: grid; place-items: center }`, and `.sig` is the
   hero section's own class. `display` was overridden; `place-items`
   never was, and a container that centres rather than stretches its
   items leaves the sticky stage zero-width, which `overflow: hidden`
   then clips away entirely.

   Scoping a sheet under `.ab` protects it from CONFLICTING
   declarations, not from EXTRA ones — in either direction. See the
   notes on `.sig` and on `.ab`'s font-size in about.css.
   ═══════════════════════════════════════════════════════════════ */

export default function About() {
  // Every section on this route stands on the studio's ground, so the
  // page still ends dark and the footer still reveals over dark.
  useDeclarePageEndTone("dark");

  useEffect(function scrollTopAndTitle() {
    window.scrollTo(0, 0);
    const prev = document.title;
    document.title = "About — Averr Studios";
    return function restore() {
      document.title = prev;
    };
  }, []);

  /* Dark from the first pixel, as on home, /work and /services. */
  const setNavDark = useSetNavDarkOverride();
  useEffect(
    function navAlwaysDark() {
      setNavDark(true);
      const root = document.documentElement;
      const body = document.body;
      const prevBg = body.style.backgroundColor;
      root.style.setProperty("--nav-dark-bar", "#13161E");
      body.style.backgroundColor = "#121C27";
      return function reset() {
        setNavDark(false);
        root.style.removeProperty("--nav-dark-bar");
        body.style.backgroundColor = prevBg;
      };
    },
    [setNavDark]
  );

  /* The page's one rAF. `heroRef` is handed over as the ref OBJECT, not
     as `.current`: the element does not exist during the render that
     registers the section, so passing the current value would register
     a permanent null and the hero would never receive a frame. */
  const heroRef = useRef<HTMLElement | null>(null);
  const heroProgress = useRef<(p: number) => void>(function noop() {});
  const wordsRef = useRef<HTMLElement | null>(null);
  const wordsProgress = useRef<(p: number) => void>(function noop() {});
  const lineRef = useRef<HTMLElement | null>(null);
  const lineProgress = useRef<(p: number) => void>(function noop() {});
  useSectionProgress([
    {
      ref: heroRef,
      onProgress: function toHero(p) {
        heroProgress.current(p);
      },
    },
    {
      ref: wordsRef,
      onProgress: function toWords(p) {
        wordsProgress.current(p);
      },
    },
    {
      ref: lineRef,
      onProgress: function toLine(p) {
        lineProgress.current(p);
      },
    },
  ]);

  return (
    <>
      <div className="ab">
        {/* The gradients the mark, its fill and its sheen paint with.
            Hidden, shared, and referenced by id from the hero's SVG. */}
        <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
          <defs>
            <linearGradient id="mgrad" x1="60" y1="60" x2="240" y2="394" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#F9AF97" />
              <stop offset=".3" stopColor="#D5818C" />
              <stop offset=".6" stopColor="#9874E8" />
              <stop offset="1" stopColor="#569AFA" />
            </linearGradient>
            <linearGradient id="mfillg" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#FFFFFF" />
              <stop offset="1" stopColor="#E4E1F0" />
            </linearGradient>
            <linearGradient id="sheeng" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#fff" stopOpacity="0" />
              <stop offset=".5" stopColor="#9874E8" stopOpacity=".55" />
              <stop offset="1" stopColor="#fff" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
        <div className="grain" aria-hidden="true" />

        <SignatureHero sectionRef={heroRef} progressRef={heroProgress} />
        <Principles sectionRef={wordsRef} progressRef={wordsProgress} />
        <OneLine sectionRef={lineRef} progressRef={lineProgress} />
        <Close />
      </div>
    </>
  );
}
