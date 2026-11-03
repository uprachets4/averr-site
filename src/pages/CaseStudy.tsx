import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { Navigate, useLocation, useNavigate, useParams } from "react-router-dom";
import { BUILT, BUILT_BY_SLUG, nextAfter } from "../data/builtByAverr";
import CaseHero from "../components/work/built/CaseHero";
import Problem from "../components/work/built/Problem";
import Approach from "../components/work/built/Approach";
import BuildCards from "../components/work/built/BuildCards";
import Signatures from "../components/work/built/Signatures";
import Gallery from "../components/work/built/Gallery";
import Outcome from "../components/work/built/Outcome";
import NextUp from "../components/work/built/NextUp";
import NextCase from "../components/work/built/NextCase";
import { useSetNavDarkOverride } from "../lib/navTone";
import { useDeclarePageEndTone } from "../lib/pageTone";
import NotFound from "./NotFound";
import "../components/work/built/built.css";

/**
 * A case file — spec 31, step 4.
 *
 * The reference draws this as a fixed overlay with its own scroll
 * container, and four things read that container: the reading rail,
 * both IntersectionObservers, the problem line's word light-up and the
 * signature zoom. Here it is a real page, so all four read the window
 * instead — `root: null`, `window.scrollY`, `innerHeight` — and the
 * overlay's body lock goes away with it.
 *
 * Everything scroll-linked runs in ONE rAF that writes straight to the
 * nodes. Three separate loops, or any of this through state, would
 * re-render the whole case file on every frame (handoff 5.1).
 */

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
/* the reference's own easing for the signature zoom */
const ease = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

export default function CaseStudy() {
  const { slug } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const rootRef = useRef<HTMLDivElement | null>(null);
  const railRef = useRef<HTMLDivElement | null>(null);

  /* Set once, on the first frame: it drives the hero's 1.8s settle and
     retracts the reveal covers. On case file → case file the element
     is new and the class is already on, so the settle does not replay
     — which is what the reference does when it rewrites the overlay. */
  const [open, setOpen] = useState(false);

  /* Only an arrival from the index gets the reveal. A direct visit, a
     refresh, and the next-case link all render straight away. */
  const fromIndex = (location.state as { from?: string } | null)?.from === "work";
  const [covering, setCovering] = useState(fromIndex);

  const project = slug ? BUILT_BY_SLUG[slug] : undefined;

  const setNavDark = useSetNavDarkOverride();
  useEffect(
    function navAlwaysDark() {
      if (!project) return;
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
    [setNavDark, project]
  );

  useDeclarePageEndTone("dark");

  useEffect(function openOnFirstFrame() {
    const frame = requestAnimationFrame(function paint() {
      setOpen(true);
    });
    return function stop() {
      cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(
    function dropCovers() {
      if (!covering) return;
      const t = window.setTimeout(() => setCovering(false), 950);
      return function stop() {
        window.clearTimeout(t);
      };
    },
    [covering]
  );

  useEffect(
    function titleAndDescription() {
      if (!project) return;
      const prev = document.title;
      document.title = `${project.name} — Averr Studios`;
      const meta = document.querySelector('meta[name="description"]');
      const prevDesc = meta?.getAttribute("content") ?? null;
      meta?.setAttribute("content", `${project.name}: ${project.thesis} ${project.sector}.`);
      return function restore() {
        document.title = prev;
        if (prevDesc !== null) meta?.setAttribute("content", prevDesc);
      };
    },
    [project]
  );

  useEffect(
    function topOnSlugChange() {
      window.scrollTo(0, 0);
    },
    [slug]
  );

  /* The in-view fade, one observer for the whole page. */
  useEffect(
    function revealOnEntry() {
      const root = rootRef.current;
      if (!root) return;
      const io = new IntersectionObserver(
        function onSeen(entries) {
          entries.forEach(function each(e) {
            if (!e.isIntersecting) return;
            e.target.classList.add("bb-in");
            io.unobserve(e.target);
          });
        },
        { threshold: 0.15 }
      );
      root.querySelectorAll(".bb-reveal").forEach((el) => io.observe(el));
      return function stop() {
        io.disconnect();
      };
    },
    [slug]
  );

  /* The reading rail, the problem line and the signature zoom, in one
     frame, written straight to the nodes. */
  useEffect(
    function scrollLoop() {
      const root = rootRef.current;
      if (!root) return;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      const lines = Array.from(root.querySelectorAll<HTMLElement>(".bb-prob")).map(
        (p) => [p, Array.from(p.querySelectorAll<HTMLElement>(".bb-w"))] as const
      );
      const sigs = Array.from(root.querySelectorAll<HTMLElement>(".bb-sig")).map((s) => {
        const frame = s.querySelector<HTMLElement>(".bb-sframe");
        return [s, frame?.querySelector("img") ?? null, frame] as const;
      });

      let raf = 0;

      function tick() {
        raf = 0;
        const vh = window.innerHeight;
        const narrow = window.innerWidth <= 900;

        const max = Math.max(1, document.documentElement.scrollHeight - vh);
        railRef.current?.style.setProperty("--r", (window.scrollY / max).toFixed(4));

        lines.forEach(function light([line, words]) {
          const r = line.getBoundingClientRect();
          const progress = reduce ? 1 : clamp((vh * 0.9 - r.top) / (vh * 0.4));
          const lit = Math.round(progress * words.length);
          words.forEach((w, k) => w.classList.toggle("bb-on", k < lit));
        });

        /* Below 900px nothing is pinned, so there is nothing to zoom. */
        if (narrow || reduce) return;
        sigs.forEach(function zoom([section, img, frame]) {
          if (!img || !frame) return;
          const r = section.getBoundingClientRect();
          const p = clamp(-r.top / (r.height - vh));
          const e = ease(clamp((p - 0.05) / 0.6));
          img.style.setProperty("--z", (1 + 1.1 * e).toFixed(3));
          frame.style.setProperty("--v", e.toFixed(3));
        });
      }

      function onScroll() {
        if (!raf) raf = requestAnimationFrame(tick);
      }

      tick();
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onScroll, { passive: true });
      return function stop() {
        if (raf) cancelAnimationFrame(raf);
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onScroll);
      };
    },
    [slug]
  );

  /* Back to the index. Coming from it, go back through history so
     /work restores the row you opened; otherwise push it. */
  const leave = useCallback(
    function leave() {
      if (fromIndex) navigate(-1);
      else navigate("/work");
    },
    [fromIndex, navigate]
  );

  useEffect(
    function escapeLeaves() {
      function onKey(e: KeyboardEvent) {
        if (e.key === "Escape") leave();
      }
      document.addEventListener("keydown", onKey);
      return function stop() {
        document.removeEventListener("keydown", onKey);
      };
    },
    [leave]
  );

  /* A draft with no case file of its own: send it to the index rather
     than to a 404, and replace so Back does not bounce into it. */
  if (slug === "careerclarity-ai") return <Navigate to="/work" replace />;
  if (!project) return <NotFound />;

  const index = BUILT.indexOf(project);
  let n = 0;
  const sn = () => String(++n).padStart(2, "0");
  const nProblem = sn();
  const nApproach = sn();
  const nBuilt = sn();
  const nSigs = project.sigs.length ? sn() : "";
  const nOutcome = sn();
  const nNext = sn();

  return (
    <div
      className={`bb-page bb-case${open ? " bb-case--open" : ""}`}
      ref={rootRef}
      style={{ "--c": project.c } as CSSProperties}
    >
      {covering ? (
        <>
          <div className="bb-reveal-cover bb-reveal-cover--t" aria-hidden="true" />
          <div className="bb-reveal-cover bb-reveal-cover--b" aria-hidden="true" />
        </>
      ) : null}

      <div className="bb-rail" ref={railRef} aria-hidden="true">
        <i />
      </div>
      <button className="bb-close" type="button" onClick={leave}>
        Close ✕
      </button>
      <div className="bb-grain" aria-hidden="true" />

      <CaseHero project={project} index={index} />
      <Problem problem={project.problem} points={project.points} number={nProblem} />
      <Approach steps={project.approach} name={project.name} number={nApproach} />
      <BuildCards items={project.inventory} number={nBuilt} />
      {project.sigs.length ? (
        <Signatures sigs={project.sigs} accent={project.c} number={nSigs} />
      ) : null}
      <Gallery items={project.gallery} name={project.name} />
      <Outcome project={project} number={nOutcome} />
      <NextUp next={project.next} stack={project.stack} number={nNext} />
      <NextCase next={nextAfter(project.slug)} />
    </div>
  );
}
