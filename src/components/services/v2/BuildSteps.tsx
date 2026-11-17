import type { CSSProperties } from "react";
import { PROCESS } from "../../../data/aboutProcess";

/**
 * How it runs — the five steps /about already states, with the two
 * fields someone deciding between studios wants: when each one happens,
 * and what lands in their hands at the end of it.
 *
 * Each step keeps its own colour from `PROCESS`. On a page about one
 * service that would be wrong — the five colours are the four service
 * colours plus the bridge, and they would read as "this step is
 * Marketing". Here the page sells all four, the stage above has already
 * walked the visitor through every one of them in those same colours,
 * and the rail carries them too, so the steps joining in is the page
 * agreeing with itself rather than a fifth colour system.
 *
 * Set as a flex column in a stretched grid cell so the five "you
 * receive" chips sit on one baseline even when one wraps to two lines.
 */
export default function BuildSteps() {
  return (
    <section className="sec gut" aria-labelledby="runh" style={{ paddingTop: 0 }}>
      <div className="wrap">
        <span className="eyebrow reveal">How it runs</span>
        <h2 id="runh" className="reveal" style={{ marginTop: 18 }}>
          Five steps, and you see every one of them.
        </h2>

        <ol className="steps5">
          {PROCESS.map(function step(s) {
            return (
              <li className="step5" key={s.name} style={{ "--sc": s.color } as CSSProperties}>
                <h3>{s.name}</h3>
                <span className="when">{s.when}</span>
                <p>{s.line}</p>
                <span className="got">
                  <i aria-hidden="true" />
                  {s.receive}
                </span>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
