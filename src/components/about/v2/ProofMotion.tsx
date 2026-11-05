import { useCallback, useEffect, useImperativeHandle, useRef } from "react";
import {
  DURATIONS,
  EASE_OUT_QUART,
  MOTION_LOOP_MS,
  MOTION_STAGGER_MS,
} from "../../../data/aboutTokens";
import { MOTION_ORDER, MOTION_REDUCED } from "../../../data/aboutPrinciples";
import { prefersReducedMotion } from "./useSectionProgress";

/**
 * MOTION's proof: the studio's real motion rules, and a demo that
 * plays by them.
 *
 * Durations and easing are read from `aboutTokens`, which the token
 * test keeps matching `index.css` — the row reads "150 · 300 · 600 ·
 * 800 ms" because those are `--duration-fast/base/slow/hero`, not
 * because anyone typed them.
 *
 * The demo plays with a 100ms stagger and 600ms steps, loops every
 * 3.2s while MOTION is calm and on screen, and has a real Replay
 * button. It is hidden below 900px by the sheet. Under reduced
 * motion it does not play: the bars are shown in their final state.
 */

export type MotionDemoHandle = {
  /** Start the demo, and keep it looping while MOTION stays calm. */
  play: () => void;
  /** Stop the loop — MOTION is no longer the active word. */
  stop: () => void;
};

/** The six bars, with the step each one arrives on. */
const BARS: { cls: string; o: number }[] = [
  { cls: "dsb-e", o: 0 },
  { cls: "dsb-h", o: 1 },
  { cls: "dsb-h2", o: 1 },
  { cls: "dsb-b", o: 2 },
  { cls: "dsb-b2", o: 2 },
  { cls: "dsb-c", o: 3 },
];

const TICKS = ["0", "100", "200", "300 ms"];

export default function ProofMotion({
  handleRef,
}: {
  handleRef: React.RefObject<MotionDemoHandle | null>;
}) {
  const demoRef = useRef<HTMLDivElement | null>(null);
  const loop = useRef(0);
  const alive = useRef(false);

  const play = useCallback(function play() {
    const el = demoRef.current;
    if (!el || prefersReducedMotion()) return;
    alive.current = true;
    el.classList.remove("play");
    /* force a reflow so the animation restarts rather than continuing */
    void el.offsetWidth;
    el.classList.add("play");
    window.clearTimeout(loop.current);
    loop.current = window.setTimeout(function again() {
      if (alive.current) play();
    }, MOTION_LOOP_MS);
  }, []);

  const stop = useCallback(function stop() {
    alive.current = false;
    window.clearTimeout(loop.current);
  }, []);

  useImperativeHandle(handleRef, () => ({ play, stop }), [play, stop]);

  useEffect(function cleanup() {
    return function stopOnUnmount() {
      alive.current = false;
      window.clearTimeout(loop.current);
    };
  }, []);

  const ms = DURATIONS.map((d) => d.ms).join(" · ");
  /* The demo's step length IS --duration-slow; it is not a number of
     its own. Looked up by token rather than by position in the list. */
  const SLOW_MS = DURATIONS.find((d) => d.token === "--duration-slow")!.ms;

  return (
    <div className="proof pf-mot">
      <div className="rules">
        <span className="ph">The rules on averrstudios.com</span>
        <div className="rrow">
          <b>Durations</b>
          <span>{ms} ms</span>
        </div>
        <div className="rrow">
          <b>Easing</b>
          <span>ease-out-quart · {EASE_OUT_QUART}</span>
        </div>
        <div className="rrow">
          <b>Order</b>
          <span>{MOTION_ORDER}</span>
        </div>
        <div className="rrow">
          <b>Reduced motion</b>
          <span>{MOTION_REDUCED}</span>
        </div>
      </div>

      {/* The demo is driven by the same tokens the rules quote, so the
          thing it shows and the thing it does cannot drift apart.
          These three names are unique to the demo — nothing else in
          the page or the repo declares them, and no `@property`
          registers any custom property at all. */}
      <div
        className="demo"
        ref={demoRef}
        style={
          {
            "--demo-dur": `${SLOW_MS}ms`,
            "--demo-ease": EASE_OUT_QUART,
            "--demo-stag": `${MOTION_STAGGER_MS}ms`,
          } as React.CSSProperties
        }
      >
        <span className="ph">
          Played by those rules
          <button type="button" onClick={play}>
            Replay ↺
          </button>
        </span>
        <div className="dstage">
          {BARS.map(function bar(b) {
            return (
              <i
                key={b.cls}
                className={b.cls}
                style={{ "--o": b.o } as React.CSSProperties}
              />
            );
          })}
        </div>
        <div className="dtl">
          {TICKS.map(function tick(t, i) {
            return (
              <span key={t} style={{ "--o": i } as React.CSSProperties}>
                {t}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}
