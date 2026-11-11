import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Link } from "react-router-dom";
import MagneticCTA from "../../MagneticCTA";
import { SERVICE_COLOR } from "../../../data/serviceColors";
import type { PlanetHandle } from "./engine";
import "./planet.css";
import "./services-frame.css";

/**
 * PLANET HERO — two beats, then the takeover into the film.
 *   beat 0 · the hero: the whole sentence in one block under the planet
 *   beat 1 · the four services in one frame: the planet re-forms as four
 *            particle icons, one per column; hover a column and its icon
 *            lights while the others dim
 * The film (partners onward) is untouched and still opens out of the
 * takeover exactly as before.
 */

const SERVICES = [
  {
    name: "Websites",
    color: SERVICE_COLOR.websites,
    line: "Sites that look like you meant it.",
    inc: ["Brand direction", "Marketing sites", "Landing pages"],
  },
  {
    name: "Web Apps",
    color: SERVICE_COLOR.webApps,
    line: "Software built around how you work.",
    inc: ["Customer portals", "Booking & ordering", "Internal tools"],
  },
  {
    name: "AI Automation",
    color: SERVICE_COLOR.aiAutomation,
    line: "The busywork, handled.",
    inc: ["AI agents", "Integrations", "Human sign-off"],
  },
  {
    name: "Marketing",
    color: SERVICE_COLOR.marketing,
    line: "Found first. Chosen more.",
    inc: ["Local search", "Outreach", "Paid ads"],
  },
];

/** offsetLeft/Top up to the stage: layout position, untouched by transforms. */
function stageBox(el: HTMLElement, stage: HTMLElement) {
  let x = 0;
  let y = 0;
  let n: HTMLElement | null = el;
  while (n && n !== stage) {
    x += n.offsetLeft;
    y += n.offsetTop;
    n = n.offsetParent as HTMLElement | null;
  }
  return { x, y, w: el.offsetWidth, h: el.offsetHeight };
}

export default function PlanetHero() {
  const storyRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const copyRef = useRef<HTMLDivElement | null>(null);
  const takeRef = useRef<HTMLDivElement | null>(null);
  const takeInRef = useRef<HTMLDivElement | null>(null);
  const sweepRef = useRef<HTMLSpanElement | null>(null);
  const handleRef = useRef<PlanetHandle | null>(null);
  const artRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [focus, setFocus] = useState(0);

  useEffect(function startEngine() {
    let cancelled = false;
    /* After first paint, off the critical path; 300ms fallback where
       requestIdleCallback does not exist. */
    const w = window as Window & {
      requestIdleCallback?: (cb: IdleRequestCallback, o?: { timeout: number }) => number;
      cancelIdleCallback?: (h: number) => void;
    };
    const begin = () => {
      const story = storyRef.current;
      const stage = stageRef.current;
      const copy = copyRef.current;
      const take = takeRef.current;
      const takeIn = takeInRef.current;
      if (!story || !stage || !copy || !take || !takeIn) return;
      import("./engine")
        .then(function run(mod) {
          if (cancelled) return;
          handleRef.current = mod.mount(stage, {
            story,
            beats: Array.from(copy.children) as HTMLElement[],
            rail: [],
            take,
            takeIn,
            sweep: sweepRef.current,
            holdEnd: 0.45,
            storyEnd: 0.7,
            slots: () => artRefs.current.map((el) => stageBox(el!, stage)),
          });
        })
        .catch(function noEngine(err) {
          /* No WebGL or a blocked chunk: the copy still reads on the
             stage's own gradient. */
          if (import.meta.env.DEV) console.warn("planet hero: engine unavailable", err);
        });
    };
    let cancelSchedule: () => void;
    if (typeof w.requestIdleCallback === "function") {
      const h = w.requestIdleCallback(begin, { timeout: 300 });
      cancelSchedule = () => w.cancelIdleCallback?.(h);
    } else {
      const t = window.setTimeout(begin, 300);
      cancelSchedule = () => window.clearTimeout(t);
    }
    return function stop() {
      cancelled = true;
      cancelSchedule();
      handleRef.current?.dispose();
      handleRef.current = null;
    };
  }, []);

  useEffect(
    function lightOne() {
      handleRef.current?.setFocus(focus);
    },
    [focus],
  );

  return (
    <div className="ph-story lp-story" ref={storyRef}>
      <div className="ph-stage" ref={stageRef}>
        <canvas data-layer="back" aria-hidden="true" />

        <div className="ph-copy" ref={copyRef}>
          {/* ── 0 · hero ─────────────────────────────────────── */}
          <div className="ph-beat ph-beat--hero">
            <div className="ph-top">
              <div className="ph-eyebrow">A full-service studio · Toronto</div>
            </div>
            <div className="ph-bot lp-herobot">
              <h1 className="ph-sr">
                Websites, Web Apps, AI Automation and Marketing for businesses that want to
                be taken seriously.
              </h1>
              <ul className="lp-svcrow" aria-hidden="true">
                {SERVICES.map((s) => (
                  <li key={s.name} style={{ "--c": s.color } as CSSProperties}>
                    <i />
                    {s.name}
                  </li>
                ))}
              </ul>
              <p className="lp-setup" aria-hidden="true">
                For businesses that want to be
              </p>
              <p className="ph-payoff" aria-hidden="true">
                Taken{" "}
                <span className="ph-sw" ref={sweepRef}>
                  Seriously.
                </span>
              </p>
              <div className="ph-ctas">
                <MagneticCTA to="/contact" variant="primary" tone="dark">
                  Book a discovery call
                </MagneticCTA>
                <MagneticCTA to="/work" variant="ghost" tone="dark">
                  See what we build
                </MagneticCTA>
              </div>
            </div>
          </div>

          {/* ── 1 · the four services, one frame ─────────────── */}
          <div className="ph-beat lp-beat lp-svc">
            <div className="lp-svctop">
              <span className="lp-eyebrow">What we do</span>
              <h2 className="lp-h2">All of it, built by one team.</h2>
              <p className="lp-svcsub">
                The person who designs it builds it, automates it and grows it. No
                hand-offs, no patchwork.
              </p>
            </div>
            <div className="lp-grid" onMouseLeave={() => setFocus(0)}>
              {SERVICES.map((s, i) => (
                <Link
                  to="/services"
                  className={`lp-col${focus === i + 1 ? " on" : ""}${
                    focus && focus !== i + 1 ? " off" : ""
                  }`}
                  key={s.name}
                  style={{ "--c": s.color } as CSSProperties}
                  onMouseEnter={() => setFocus(i + 1)}
                  onFocus={() => setFocus(i + 1)}
                  onBlur={() => setFocus(0)}
                >
                  <div
                    className="lp-art"
                    aria-hidden="true"
                    ref={(el) => void (artRefs.current[i] = el)}
                  />
                  <div className="lp-name">
                    <i aria-hidden="true" />
                    {s.name}
                  </div>
                  <h3 className="lp-line">{s.line}</h3>
                  <ul className="lp-inc">
                    {s.inc.map((x) => (
                      <li key={x}>{x}</li>
                    ))}
                  </ul>
                </Link>
              ))}
            </div>
          </div>
        </div>

        <canvas data-layer="front" aria-hidden="true" />
        <div className="ph-take" ref={takeRef}>
          <div className="ph-take-in" ref={takeInRef} aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}
