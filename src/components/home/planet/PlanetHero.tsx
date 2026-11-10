import { useEffect, useRef, type CSSProperties } from "react";
import MagneticCTA from "../../MagneticCTA";
import { SERVICE_COLOR } from "../../../data/serviceColors";
import type { PlanetHandle } from "./engine";
import "./planet.css";

/**
 * The Planet hero — Session 29, ported from
 * `docs/reference/hero/hero-v6-reference.html`.
 *
 * A pinned 780vh story. A planet of ~30,000 particles with four rings,
 * one per service, morphs through the four service objects and folds
 * back into itself; a light then opens out of its core into the rest of
 * the page.
 *
 * This file is the DOM only. Everything that moves lives in `engine.ts`,
 * which is imported AFTER first paint so the headline is never waiting on
 * three.js — the hero text here is plain markup and paints on frame one.
 *
 * Accessibility, per the spec:
 *   - one `h1` carries the whole sentence and is visually hidden;
 *   - the visible setup line and payoff are aria-hidden, because together
 *     they say the same thing in two pieces;
 *   - each chapter's big line is an `h2`;
 *   - both canvases are aria-hidden;
 *   - the rail is a real `nav` of real buttons with visible focus.
 */

type Beat = {
  /** mono label above */
  label: string;
  /** the service colour's dot, where the beat names one */
  dot?: string;
  /** the big line */
  big: string;
  /** the supporting line */
  sub: string;
};

/** Capitalisation matters: these are the owner's exact words. */
const BEATS: Beat[] = [
  {
    label: "01 · Websites",
    dot: SERVICE_COLOR.websites,
    big: "Sites that look like you meant it.",
    sub: "Designed from your world, built from scratch, fast on every phone.",
  },
  {
    label: "02 · Web Apps",
    dot: SERVICE_COLOR.webApps,
    big: "Software built around how you work.",
    sub: "Customer portals, booking and ordering systems, internal tools. They replace the spreadsheets and workarounds.",
  },
  {
    label: "03 · AI Automation",
    dot: SERVICE_COLOR.aiAutomation,
    big: "The busywork, handled.",
    sub: "Agents that qualify leads, answer intake and move data between your tools, with a person signing off.",
  },
  {
    label: "04 · Marketing",
    dot: SERVICE_COLOR.marketing,
    big: "Found first. Chosen more.",
    sub: "Local search, outreach, ads and content that compound month over month, reported in plain numbers.",
  },
  {
    label: "05 · One studio",
    big: "All of it, built by one team.",
    sub: "The person who designs it builds it, automates it and grows it. No hand-offs, no patchwork.",
  },
];

const RAIL: Array<{ name: string; color?: string }> = [
  { name: "Intro" },
  { name: "Websites", color: SERVICE_COLOR.websites },
  { name: "Web Apps", color: SERVICE_COLOR.webApps },
  { name: "AI Automation", color: SERVICE_COLOR.aiAutomation },
  { name: "Marketing", color: SERVICE_COLOR.marketing },
  { name: "One studio" },
];

const SETUP =
  "Websites, Web Apps, AI Automation and Marketing for businesses that want to be";

export default function PlanetHero() {
  const storyRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const copyRef = useRef<HTMLDivElement | null>(null);
  const railRef = useRef<HTMLElement | null>(null);
  const takeRef = useRef<HTMLDivElement | null>(null);
  const takeInRef = useRef<HTMLDivElement | null>(null);
  const sweepRef = useRef<HTMLSpanElement | null>(null);

  useEffect(function startEngine() {
    let handle: PlanetHandle | null = null;
    let cancelled = false;

    /* After first paint, and off the critical path. The spec's fallback
       is 300ms where requestIdleCallback does not exist. */
    const w = window as Window & {
      requestIdleCallback?: (cb: IdleRequestCallback, o?: { timeout: number }) => number;
      cancelIdleCallback?: (h: number) => void;
    };
    let cancelSchedule: () => void;
    const begin = () => {
      const story = storyRef.current;
      const stage = stageRef.current;
      const copy = copyRef.current;
      const rail = railRef.current;
      const take = takeRef.current;
      const takeIn = takeInRef.current;
      if (!story || !stage || !copy || !rail || !take || !takeIn) return;

      import("./engine")
        .then(function run(mod) {
          if (cancelled) return;
          handle = mod.mount(stage, {
            story,
            beats: Array.from(copy.children) as HTMLElement[],
            rail: Array.from(rail.querySelectorAll("button")) as HTMLElement[],
            take,
            takeIn,
            sweep: sweepRef.current,
          });
        })
        .catch(function noEngine(err) {
          /* No WebGL, a blocked chunk, a throw in the shader: the copy
             still reads on the stage's own gradient. Nothing is thrown
             onward and nothing is logged as an error the user can see. */
          if (import.meta.env.DEV) console.warn("planet hero: engine unavailable", err);
        });
    };

    if (typeof w.requestIdleCallback === "function") {
      const h = w.requestIdleCallback(begin, { timeout: 300 });
      cancelSchedule = () => w.cancelIdleCallback?.(h);
    } else {
      const h = window.setTimeout(begin, 300);
      cancelSchedule = () => window.clearTimeout(h);
    }

    return function stop() {
      cancelled = true;
      cancelSchedule();
      handle?.dispose();
    };
  }, []);

  return (
    <div className="ph-story" ref={storyRef}>
      <div className="ph-stage" ref={stageRef}>
        <canvas data-layer="back" aria-hidden="true" />

        <div className="ph-copy" ref={copyRef}>
          {/* beat 0 — the opening */}
          <div className="ph-beat ph-beat--hero">
            <div className="ph-top">
              <div className="ph-eyebrow">A boutique studio · Toronto</div>
              {/* The h1 is the whole sentence; the two visible halves are
                  hidden from the accessibility tree so it is not read twice. */}
              <h1 className="ph-sr">
                Websites, Web Apps, AI Automation and Marketing for businesses that want to
                be taken seriously.
              </h1>
              <p className="ph-setup" aria-hidden="true">
                {SETUP}
              </p>
            </div>
            <div className="ph-bot">
              <p className="ph-payoff" aria-hidden="true">
                taken{" "}
                <span className="ph-sw" ref={sweepRef}>
                  seriously.
                </span>
              </p>
              <p className="ph-sub">Four services, one team, start to finish.</p>
              <div className="ph-ctas">
                {/* The site's own discovery-call action, not a new link.
                    The spec writes these labels with a trailing arrow;
                    MagneticCTA draws that arrow itself, so putting one in
                    the label too rendered "Book a discovery call → →". */}
                <MagneticCTA to="/contact" variant="primary" tone="dark">
                  Book a discovery call
                </MagneticCTA>
                <MagneticCTA to="/work" variant="ghost" tone="dark">
                  See what we build
                </MagneticCTA>
              </div>
            </div>
          </div>

          {/* beats 1-5 — the four services, then the studio */}
          {BEATS.map(function drawBeat(b) {
            return (
              <div className="ph-beat" key={b.label}>
                <div className="ph-top">
                  <div className="ph-eyebrow">
                    {b.dot ? (
                      <i
                        className="ph-dot"
                        aria-hidden="true"
                        style={{ "--c": b.dot } as CSSProperties}
                      />
                    ) : null}
                    {b.label}
                  </div>
                </div>
                <div className="ph-bot">
                  <h2 className="ph-payoff ph-payoff--ch">{b.big}</h2>
                  <p className="ph-sub">{b.sub}</p>
                </div>
              </div>
            );
          })}
        </div>

        <canvas data-layer="front" aria-hidden="true" />

        <nav className="ph-rail" aria-label="Chapters" ref={railRef}>
          {RAIL.map(function drawRail(r, i) {
            return (
              <button
                key={r.name}
                type="button"
                aria-current={i === 0 ? "true" : "false"}
                style={r.color ? ({ "--c": r.color } as CSSProperties) : undefined}
              >
                <span>{r.name}</span>
                <i aria-hidden="true" />
              </button>
            );
          })}
        </nav>

        {/* The takeover carries no text (spec 30, step 1). The circle
            opens out of the planet's core into the film's own background
            and the film's first act sits directly beneath it, so there is
            no seam and nothing to read twice. `ph-take-in` stays as the
            engine's opacity target — the loop writes to it every frame —
            but it is empty and hidden from the accessibility tree. */}
        <div className="ph-take" ref={takeRef}>
          <div className="ph-take-in" ref={takeInRef} aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}
