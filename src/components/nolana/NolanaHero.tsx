import { Suspense, lazy, useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useReducedMotion } from "motion/react";
import TorontoClock from "../TorontoClock";
import { Chip } from "./Bits";

/**
 * The hero.
 *
 * Navy, full viewport, with a WebGL particle wave across its lower
 * half. Everything above the mesh is plain DOM text that paints at
 * frame one — the mesh is lazy and mounts after, so it can never be on
 * the LCP path.
 *
 * THE PILL cycles the four things a business runs on. Its width springs
 * to each token's MEASURED width rather than a guess: the words are
 * rendered once into a hidden ruler carrying the pill's own typography,
 * because a width animated to the wrong target is the thing that makes
 * a swap like this look cheap.
 */

const TOKENS = ["a website", "software", "automation", "customers"];
const CYCLE_MS = 2800;

const LEAD = "Every business runs on";
const LINE2 = "We build what yours runs on.";
const SUBLINE =
  "Websites, web apps and SaaS products, AI automation and growth marketing for businesses across the GTA.";
/** One sentence, every token, so the headline reads once and completely. */
const A11Y = `Every business runs on a website, software, automation and customers. ${LINE2}`;

const CLIENTS = [
  "CG Walls & Floors",
  "SIFT",
  "CapitalCommand",
  "CadenceStack",
  "CareerClarity AI",
];

const Mesh = lazy(() => import("./WaveMesh"));

function Pill({
  index,
  onPoke,
  paused,
}: {
  index: number;
  onPoke: () => void;
  paused: boolean;
}) {
  const rulerRef = useRef<HTMLSpanElement | null>(null);
  const [w, setW] = useState<number | null>(null);

  useEffect(
    function measure() {
      const r = rulerRef.current;
      if (!r) return;
      const kid = r.children[index] as HTMLElement | undefined;
      if (kid) setW(Math.ceil(kid.getBoundingClientRect().width));
    },
    [index]
  );

  useEffect(function remeasure() {
    function on() {
      const r = rulerRef.current;
      if (!r) return;
      const kid = r.children[index] as HTMLElement | undefined;
      if (kid) setW(Math.ceil(kid.getBoundingClientRect().width));
    }
    window.addEventListener("resize", on);
    return function off() {
      window.removeEventListener("resize", on);
    };
  });

  return (
    <button
      type="button"
      className="nh-pill"
      style={w ? { width: w } : undefined}
      onMouseEnter={onPoke}
      onFocus={onPoke}
      onClick={onPoke}
      aria-label={
        paused
          ? `Showing "${TOKENS[index]}". Activate to show the next one.`
          : "Pause the cycling word"
      }
    >
      <span className="nh-pill__stack" aria-hidden>
        {TOKENS.map(function t(tok, i) {
          return (
            <span key={tok} className={i === index ? "nh-pill__w nh-pill__w--on" : "nh-pill__w"}>
              {tok}
            </span>
          );
        })}
      </span>
      {/* the ruler: the same type, measured, never shown */}
      <span className="nh-pill__ruler" ref={rulerRef} aria-hidden>
        {TOKENS.map(function t(tok) {
          return <span key={tok}>{tok}</span>;
        })}
      </span>
    </button>
  );
}

export default function NolanaHero() {
  const reduce = !!useReducedMotion();
  const [i, setI] = useState(0);
  const [taken, setTaken] = useState(false);
  const [meshOn, setMeshOn] = useState(false);
  const takenRef = useRef(false);

  /* The mesh mounts only after the first paint has had its moment, so
     the hero's text is never behind a shader compile. */
  useEffect(function afterPaint() {
    if (typeof window === "undefined") return;
    let id = 0;
    const go = function start() {
      id = window.setTimeout(() => setMeshOn(true), 60);
    };
    if ("requestIdleCallback" in window) {
      const rid = (window as unknown as {
        requestIdleCallback: (cb: () => void, o?: { timeout: number }) => number;
      }).requestIdleCallback(go, { timeout: 1200 });
      return function off() {
        (window as unknown as { cancelIdleCallback: (h: number) => void }).cancelIdleCallback(rid);
        window.clearTimeout(id);
      };
    }
    go();
    return function off() {
      window.clearTimeout(id);
    };
  }, []);

  useEffect(
    function cycle() {
      if (reduce || taken) return;
      const t = window.setInterval(function next() {
        if (takenRef.current) return;
        setI((v) => (v + 1) % TOKENS.length);
      }, CYCLE_MS);
      return function off() {
        window.clearInterval(t);
      };
    },
    [reduce, taken]
  );

  /* The first interaction stops the carousel for good and hands the
     reader the control: from then on the pill steps on click/focus. */
  const poke = useCallback(function poked() {
    if (!takenRef.current) {
      takenRef.current = true;
      setTaken(true);
      return;
    }
    setI((v) => (v + 1) % TOKENS.length);
  }, []);

  /* The mesh is the headline's subject, not its wallpaper: every pill
     phrase reshapes the wave field. Broadcast rather than prop-drilled,
     because the mesh is lazy and may not be mounted yet. */
  useEffect(
    function tellMesh() {
      window.dispatchEvent(new CustomEvent("nl-form", { detail: i }));
    },
    [i, meshOn]
  );

  /* THE FOCAL ROW. The item nearest the middle of the frame is full
     strength and larger; the flanks fall away. It is read per frame
     because the row is a marquee — there is no scroll event to hang it
     on — but only while the hero is on screen. */
  const rowRef = useRef<HTMLDivElement | null>(null);
  useEffect(
    function focal() {
      const row: HTMLDivElement | null = rowRef.current;
      if (!row || reduce) return;
      const node: HTMLDivElement = row;
      let raf = 0;
      let on = true;
      const io = new IntersectionObserver(
        function seen(es) {
          on = es.some((e) => e.isIntersecting);
          if (on && !raf) raf = requestAnimationFrame(tick);
        },
        { threshold: 0 }
      );
      io.observe(node);
      function tick() {
        raf = 0;
        if (!on || document.hidden) return;
        const mid = window.innerWidth / 2;
        const kids = node.querySelectorAll<HTMLElement>(".nh-client");
        kids.forEach(function one(el) {
          const r = el.getBoundingClientRect();
          const d = Math.abs(r.left + r.width / 2 - mid) / (window.innerWidth * 0.42);
          const k = Math.max(0, 1 - d);
          el.style.opacity = String(0.52 + k * 0.48);
          el.style.transform = `scale(${1 + k * 0.22})`;
        });
        raf = requestAnimationFrame(tick);
      }
      raf = requestAnimationFrame(tick);
      return function off() {
        cancelAnimationFrame(raf);
        io.disconnect();
      };
    },
    [reduce]
  );

  return (
    <section className="nh" id="ch-build" data-tone="dark">
      <div className="nh-sky" aria-hidden />
      {meshOn && !reduce ? (
        <Suspense fallback={null}>
          <Mesh />
        </Suspense>
      ) : (
        <div className="nh-mesh-still" aria-hidden />
      )}

      <div className="nh-inner">
        <div className="nh-top">
          <Chip tone="dark">A boutique studio · Toronto</Chip>
          <TorontoClock style={{ color: "rgba(255,255,255,0.68)" }} />
        </div>

        <h1 className="nh-h1">
          <span className="sr-only">{A11Y}</span>
          <span aria-hidden="true">
            <span className="nh-line">
              {LEAD} <Pill index={i} onPoke={poke} paused={taken} />
              <span className="nh-dot">.</span>
            </span>
            <span className="nh-line nh-line--2">{LINE2}</span>
          </span>
        </h1>

        <p className="nh-sub">{SUBLINE}</p>

        <div className="nh-ctas">
          <Link to="/contact" className="nh-cta">
            <span className="nh-cta__i" aria-hidden>
              <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8">
                <rect x="3" y="4.5" width="18" height="16" rx="3" />
                <path d="M3 9.5h18M8 2.6v3.4M16 2.6v3.4" />
              </svg>
            </span>
            Book a discovery call
          </Link>
          <a className="nh-ghost" href="#how">
            See how it works <span aria-hidden>↓</span>
          </a>
        </div>
      </div>

      <div className="nh-clients" aria-label="Selected clients">
        <p className="nh-clients__label">Trusted by businesses across the GTA</p>
        <div ref={rowRef} className={reduce ? "nh-clients__row nh-clients__row--still" : "nh-clients__row"}>
          {[0, 1].map(function pass(k) {
            return (
              <div className="nh-clients__set" key={k} aria-hidden={k === 1}>
                {CLIENTS.map(function c(name) {
                  return (
                    <span className="nh-client" key={name}>
                      {name}
                    </span>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
