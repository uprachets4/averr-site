import type { CSSProperties } from "react";
import { BEATS, SERVICES, SERVICE_INDEX } from "../../../data/servicesBuild";
import { ALL_FOUR_BEAT } from "./useBuildScroll";

/**
 * The rail above the stage: four services, three ticks each, each with
 * its own timeline. Clicking one jumps to its first beat.
 *
 * The ticks' fill is continuous in the scroll position, so the loop
 * writes `--f` onto the `<i>` elements directly; this component only
 * decides which group is current and which are behind.
 */
export default function Rail({
  beat,
  onJump,
  railRef,
}: {
  beat: number;
  onJump: (g: number) => void;
  railRef: React.RefObject<HTMLDivElement | null>;
}) {
  const current = beat < BEATS.length ? SERVICE_INDEX[BEATS[beat].service] : -1;

  return (
    <div className="wrap rail" id="rail" ref={railRef}>
      {SERVICES.map(function group(s, g) {
        const past = beat === ALL_FOUR_BEAT || g < current;
        return (
          <button
            className={`rg${g === current ? " on" : ""}${past ? " past" : ""}`}
            type="button"
            key={s.id}
            style={{ "--rc": s.color } as CSSProperties}
            aria-label={`Jump to ${s.name}`}
            onClick={() => onJump(g)}
          >
            <span className="rl">
              <span>{s.name}</span>
              <em>{s.time}</em>
            </span>
            <span className="ticks">
              <b>
                <i />
              </b>
              <b>
                <i />
              </b>
              <b>
                <i />
              </b>
            </span>
          </button>
        );
      })}
    </div>
  );
}
