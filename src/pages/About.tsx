import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ease } from "../lib/motion";
import MagneticCTA from "../components/MagneticCTA";
import { CharRevealInView } from "../components/CharReveal";
import Chapter from "../components/Chapter";
import { useDeclarePageEndTone } from "../lib/pageTone";
import { useSetNavDarkOverride } from "../lib/navTone";
import SignatureHero from "../components/about/v2/SignatureHero";
import Principles from "../components/about/v2/Principles";
import { useSectionProgress } from "../components/about/v2/useSectionProgress";
import "../components/about/v2/about.css";

/* ═══════════════════════════════════════════════════════════════
   /about, spec 33.

   Step 2 ships the signature hero. Steps 3 to 5 add "How we think",
   "How we work" and the close, in that order, between the hero and
   the closing CTA below.

   The old page's four sections — SignatureMark, FounderCredits,
   PrincipleDesk and ProcessScene — were removed here rather than in
   step 5, because each one injects GLOBAL rules from a component
   <style> block and three of those blocks reach the new hero:

     - SignatureMark declares `.sig { display: grid; place-items:
       center }`, and `.sig` is the new hero section's own class. The
       `display` was overridden; `place-items` never was, and an
       `align-items`/`justify-items` centre stops the sticky stage
       from stretching, which leaves a zero-width box that
       `overflow: hidden` then clips the whole hero away.

   Scoping a sheet under `.ab` protects it from CONFLICTING
   declarations, not from EXTRA ones. The files stay on disk; step 5
   deletes them, along with ReadFill, which only these two import.
   ═══════════════════════════════════════════════════════════════ */

/* ═══════════════════════════════════════════════════════════════
   Closing CTA — replaced in step 5
   ═══════════════════════════════════════════════════════════════ */

function ClosingCTA() {
  const reduce = useReducedMotion();
  return (
    <section
      style={{
        position: "relative",
        overflow: "hidden",
        backgroundColor: "var(--color-dark)",
        color: "var(--color-parch)",
        minHeight: "85vh",
        padding: "160px 40px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div className="grain-dark" aria-hidden="true" style={{ opacity: 0.5 }} />

      {/* Warm accent glow */}
      <motion.div
        aria-hidden
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: "80vmin",
          height: "80vmin",
          marginTop: "-40vmin",
          marginLeft: "-40vmin",
          background:
            "radial-gradient(circle at 50% 50%, rgba(237,233,226,0.15), transparent 60%)",
          pointerEvents: "none",
        }}
        animate={
          reduce
            ? undefined
            : {
                x: [-30, 30, -30],
                y: [-20, 20, -20],
              }
        }
        transition={{
          duration: 60,
          repeat: Infinity,
          ease: ease.inOut,
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 2,
          maxWidth: 900,
          margin: "0 auto",
          textAlign: "center",
        }}
      >
        <motion.div
          initial={{ opacity: reduce ? 1 : 0, y: reduce ? 0 : 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-20% 0px" }}
          transition={{ duration: reduce ? 0 : 0.5, ease: ease.outQuart }}
          className="type-eyebrow"
          style={{
            color: "var(--color-parch)",
            opacity: 0.6,
            marginBottom: 32,
          }}
        >
          Start here
        </motion.div>

        <div
          className="type-display-l"
          style={{ color: "var(--color-parch)", marginBottom: 48 }}
        >
          <CharRevealInView
            text="Ready to build a site that earns its place?"
            style={{ color: "var(--color-parch)" }}
          />
        </div>

        <motion.div
          initial={{ opacity: reduce ? 1 : 0, y: reduce ? 0 : 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15% 0px" }}
          transition={{
            duration: reduce ? 0 : 0.6,
            ease: ease.outQuart,
            delay: reduce ? 0 : 1.6,
          }}
          style={{
            display: "flex",
            gap: 16,
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <MagneticCTA to="/contact" variant="primary" tone="dark">
            Book a call
          </MagneticCTA>
          <MagneticCTA to="/work" variant="ghost" tone="dark">
            See the work
          </MagneticCTA>
        </motion.div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Page
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
      </div>

      {/* Step 4 lands between the words and this. Everything above is
          dark, so the close reveals over dark rather than over the
          cream founder band that used to sit above it. */}
      <Chapter tone="dark" from="dark">
        <ClosingCTA />
      </Chapter>
    </>
  );
}
