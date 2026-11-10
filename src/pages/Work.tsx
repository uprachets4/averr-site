import { useEffect, useRef } from "react";
import { useNavigationType } from "react-router-dom";
import ScreenWall from "../components/work/built/ScreenWall";
import ProofStrip from "../components/work/built/ProofStrip";
import ProjectRows from "../components/work/built/ProjectRows";
import { useSetNavDarkOverride } from "../lib/navTone";
import { useDeclarePageEndTone } from "../lib/pageTone";
import "../components/work/built/built.css";
import { useDocumentMeta, META } from "../lib/documentMeta";

/**
 * Built by Averr — the index, spec 31.
 *
 * A title in front of a drifting wall of real product screens, the
 * three measured figures, then one full-width row per project that
 * opens into a live preview.
 *
 * No WebGL on this route. Everything that moves is a transform, an
 * opacity or a clip-path, and the only images above the fold are the
 * wall's middle columns.
 *
 * What it replaced, each checked for importers outside /work first:
 * VaultDoors, ProjectFilm, WorkMobile, OpenTransition and the
 * workIndex data. `Chapter` and `MagneticCTA` are no longer used here
 * but stay — four other routes render them. `CharReveal` turned out to
 * be rendered by no route at all and went in the spec-34 cleanup.
 */

const SCROLL_KEY = "averr:work-scroll";

export default function Work() {
  const navType = useNavigationType();
  const introRef = useRef<HTMLElement | null>(null);
  const glowRef = useRef<HTMLDivElement | null>(null);
  const restored = useRef(false);

  /* The dark glass bar belongs on this page the way it belongs on
     home: the ground is navy from the first pixel to the footer.
     The body ground goes with it — it is cream site-wide, and at
     narrow widths a band of it showed above the wall before the nav
     bar had anything to sit on. */
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

  /* The last row sits on navy, so the footer reveals over dark. */
  useDeclarePageEndTone("dark");

  useDocumentMeta(META.work.title, META.work.description);

  /* Closing a case file should land you on the row you opened, so the
     position is kept on the way out and put back on a POP. */
  useEffect(function rememberScroll() {
    function store() {
      try {
        sessionStorage.setItem(SCROLL_KEY, String(window.scrollY));
      } catch {
        /* private mode: the restore simply will not happen */
      }
    }
    window.addEventListener("scroll", store, { passive: true });
    return function cleanup() {
      store();
      window.removeEventListener("scroll", store);
    };
  }, []);

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
      requestAnimationFrame(function apply() {
        window.scrollTo(0, y);
      });
    },
    [navType]
  );

  return (
    <div className="bb-page">
      <div className="bb-glow" ref={glowRef} aria-hidden="true" />
      <div className="bb-grain" aria-hidden="true" />

      <section className="bb-intro bb-gut" ref={introRef}>
        <ScreenWall introRef={introRef} />
        <div className="bb-wrap">
          <span className="bb-eyebrow">The work</span>
          <h1>Built by Averr.</h1>
          <p className="bb-sub">
            Every screen behind this title is a real product we built. Open any one to see
            how.
          </p>
          <div className="bb-cue" aria-hidden="true">
            <i />
            Scroll to the work
          </div>
        </div>
      </section>

      <ProofStrip />
      <ProjectRows glowRef={glowRef} />
    </div>
  );
}
