import { useEffect, useRef, useState } from "react";
import { useNavigationType } from "react-router-dom";
import { motion, useReducedMotion } from "motion/react";
import { ease } from "../lib/motion";
import Chapter from "../components/Chapter";
import MagneticCTA from "../components/MagneticCTA";
import { CharRevealInView } from "../components/CharReveal";
import SectionBoundary from "../components/case-study/SectionBoundary";
import VaultDoors from "../components/work/VaultDoors";
import ProjectFilm from "../components/work/ProjectFilm";
import WorkMobile from "../components/work/WorkMobile";
import { useOpenTransition } from "../components/work/OpenTransition";

const MOBILE_QUERY = "(max-width: 767px)";
const SCROLL_KEY = "averr:work-scroll";

function useMedia(query: string) {
  const [matches, setMatches] = useState(false);
  useEffect(
    function watch() {
      const mq = window.matchMedia(query);
      setMatches(mq.matches);
      function onChange(e: MediaQueryListEvent) {
        setMatches(e.matches);
      }
      mq.addEventListener("change", onChange);
      return function cleanup() {
        mq.removeEventListener("change", onChange);
      };
    },
    [query]
  );
  return matches;
}

function VaultCloser() {
  const reduce = useReducedMotion();
  return (
    <section
      style={{
        backgroundColor: "var(--color-bg)",
        padding: "128px 0 144px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div className="grain-light" aria-hidden="true" style={{ opacity: 0.05 }} />
      <div
        style={{
          maxWidth: "var(--container-wide)",
          margin: "0 auto",
          position: "relative",
          zIndex: 2,
        }}
      >
        <h2 className="type-h2 measure-wide" style={{ color: "var(--color-ink)" }}>
          <CharRevealInView
            segments={[
              { text: "Your project could be" },
              { text: "the next row.", accent: true },
            ]}
            style={{ color: "var(--color-ink)" }}
          />
        </h2>

        <motion.p
          initial={{ opacity: reduce ? 1 : 0, y: reduce ? 0 : 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: reduce ? 0 : 0.6, ease: ease.outQuart, delay: 0.2 }}
          className="type-body-lg measure-body"
          style={{ color: "var(--color-muted)", margin: "28px 0 40px" }}
        >
          A boutique design studio in Toronto. Building the websites, AI systems,
          and marketing engines for businesses that expect craft.
        </motion.p>

        <div style={{ display: "inline-flex", flexWrap: "wrap", gap: 12 }}>
          <MagneticCTA to="/contact" variant="primary">
            Book a discovery call
          </MagneticCTA>
          <MagneticCTA to="/services" variant="ghost">
            See services
          </MagneticCTA>
        </div>
      </div>
    </section>
  );
}

/* ── page ──────────────────────────────────────────────────────────── */

export default function Work() {
  const mobile = useMedia(MOBILE_QUERY);
  const navType = useNavigationType();
  const { open, overlay } = useOpenTransition();
  const restored = useRef(false);

  useEffect(function title() {
    const prev = document.title;
    document.title = "The vault — Averr Studios";
    return function restore() {
      document.title = prev;
    };
  }, []);

  /* Back from a case study should land on the project you opened, so the
     scroll position is remembered on the way out and restored on POP. */
  useEffect(
    function rememberScroll() {
      function store() {
        try {
          sessionStorage.setItem(SCROLL_KEY, String(window.scrollY));
        } catch {
          /* private mode: the restore simply won't happen */
        }
      }
      window.addEventListener("scroll", store, { passive: true });
      return function cleanup() {
        store();
        window.removeEventListener("scroll", store);
      };
    },
    []
  );

  useEffect(
    function restoreScroll() {
      if (restored.current) return;
      restored.current = true;
      if (navType !== "POP") {
        window.scrollTo(0, 0);
        return;
      }
      let y = 0;
      try {
        y = Number(sessionStorage.getItem(SCROLL_KEY) || 0);
      } catch {
        y = 0;
      }
      // after layout, so the tall film wrapper exists to scroll into
      requestAnimationFrame(function apply() {
        window.scrollTo(0, y);
      });
    },
    [navType]
  );

  return (
    <>
      {mobile ? (
        <SectionBoundary name="work-mobile">
          <WorkMobile />
        </SectionBoundary>
      ) : (
        <>
          <SectionBoundary name="vault-doors">
            <VaultDoors />
          </SectionBoundary>
          <SectionBoundary name="project-film">
            <ProjectFilm onOpen={open} />
          </SectionBoundary>
        </>
      )}

      <Chapter tone="cream" from="dark">
        <VaultCloser />
      </Chapter>

      {overlay}
    </>
  );
}
