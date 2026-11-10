import { memo, type CSSProperties } from "react";
import {
  BEATS,
  ILLUSTRATIVE,
  QUAD,
  SERVICES,
  SERVICE_INDEX,
  type Fields,
} from "../../../data/servicesBuild";
import { ALL_FOUR_BEAT, stepsFor } from "./useBuildScroll";
import W1Brand from "./mocks/W1Brand";
import W2Site from "./mocks/W2Site";
import W3Booking from "./mocks/W3Booking";
import A1Dashboard from "./mocks/A1Dashboard";
import A2Portal from "./mocks/A2Portal";
import A3System from "./mocks/A3System";
import I1Audit from "./mocks/I1Audit";
import I2Agent from "./mocks/I2Agent";
import I3Review from "./mocks/I3Review";
import M1Local from "./mocks/M1Local";
import M2Campaigns from "./mocks/M2Campaigns";
import M3Report from "./mocks/M3Report";

/**
 * The pinned stage: twelve mocks, built once and never re-mounted.
 *
 * Every slot is in the DOM from the first render. Scrolling only
 * changes class names, so no mock is ever torn down and rebuilt — which
 * is what keeps a fast scroll off the main thread.
 *
 * The stage is `aria-hidden`: it is a picture of what the cards say,
 * and the cards beside it carry the meaning.
 */

/* The two slots that build with the step rather than all at once: the
   portal's timeline advances, and the agent's nodes light in order. */
const STEPPED = new Set(["a2", "i2"]);

function MockFor({ slot, f, steps }: { slot: string; f: Fields; steps: number }) {
  switch (slot) {
    case "w1": return <W1Brand f={f} />;
    case "w2": return <W2Site f={f} />;
    case "w3": return <W3Booking f={f} />;
    case "a1": return <A1Dashboard f={f} />;
    case "a2": return <A2Portal f={f} steps={steps} />;
    case "a3": return <A3System f={f} />;
    case "i1": return <I1Audit f={f} />;
    case "i2": return <I2Agent f={f} an={steps} />;
    case "i3": return <I3Review f={f} />;
    case "m1": return <M1Local f={f} />;
    case "m2": return <M2Campaigns f={f} />;
    case "m3": return <M3Report f={f} />;
    default: return null;
  }
}

/* Only the two step-driven mocks need to re-render as the beat builds;
   the other ten depend on `f` alone. */
const Mock = memo(MockFor);

function BuildStage({
  f,
  beat,
  step,
  stageRef,
}: {
  f: Fields;
  beat: number;
  step: number;
  stageRef: React.RefObject<HTMLDivElement | null>;
}) {
  const tiled = beat === ALL_FOUR_BEAT;
  const illustrative = tiled || ILLUSTRATIVE.has(BEATS[beat].slot);

  return (
    <div
      className={`stage${tiled ? " tg" : ""}${illustrative ? " ill" : ""}`}
      id="stage"
      ref={stageRef}
      aria-hidden="true"
    >
      {BEATS.map(function slot(b, i) {
        const quad = QUAD[b.slot];
        const n = stepsFor(i, beat, step, !!quad);
        /* the reference's own shape classes, by slot */
        const shape =
          b.slot === "m1" ? " phoneslot" : b.slot === "i1" ? " audslot" : b.slot === "i2" ? " flowslot" : "";
        const steps = [1, 2, 3, 4]
          .filter((k) => n >= k || (tiled && quad))
          .map((k) => ` s${k}`)
          .join("");
        return (
          <div
            className={`slot${shape}${quad ? ` tq ${quad}` : ""}${beat === i ? " on" : ""}${steps}`}
            key={b.slot}
          >
            <div className="dev">
              <Mock slot={b.slot} f={f} steps={STEPPED.has(b.slot) ? n : 0} />
            </div>
          </div>
        );
      })}
      <span className="illus">Illustrative</span>
    </div>
  );
}

export default memo(BuildStage);

/** The glow behind the stage, in the current service's colour. */
export function StageGlow({ beat }: { beat: number }) {
  const color =
    beat === ALL_FOUR_BEAT
      ? "#9874E8"
      : SERVICES[SERVICE_INDEX[BEATS[beat].service]].color;
  return (
    <div
      className="bglow"
      id="bglow"
      aria-hidden="true"
      style={
        { background: `radial-gradient(closest-side,${color},transparent)` } as CSSProperties
      }
    />
  );
}
