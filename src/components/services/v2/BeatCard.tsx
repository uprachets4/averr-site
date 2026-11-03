import { Link } from "react-router-dom";
import type { CSSProperties } from "react";
import {
  ALL_FOUR,
  BEATS,
  PROOF,
  SERVICES,
  SERVICE_INDEX,
} from "../../../data/servicesBuild";
import { ALL_FOUR_BEAT } from "./useBuildScroll";

/**
 * One card per beat, beside the stage. Exactly one is on screen at a
 * time — the stage shows it, the card says it.
 *
 * All thirteen are rendered; only the current one is visible, and the
 * rest are `aria-hidden` so a screen reader is not read twelve cards
 * for one stage. The beat titles are the h2s the spec asks for.
 *
 * `data-no-wipe` on the proof links: /services → a case file would
 * otherwise play the route wipe over the case file's own reveal.
 */
export default function BeatCards({ beat }: { beat: number }) {
  return (
    <div className="cards" id="cards">
      {BEATS.map(function card(b, i) {
        const service = SERVICES[SERVICE_INDEX[b.service]];
        const n = (i % 3) + 1;
        const on = i === beat;
        return (
          <article
            className={`card${on ? " on" : ""}`}
            key={b.slot}
            style={{ "--cc": service.color } as CSSProperties}
            aria-hidden={!on}
          >
            <span className="k">
              <i />
              {service.name} · {n} of 3
            </span>
            <h2>{b.title}</h2>
            <p>{b.line}</p>
            <div className="meta">
              <span className="pill">
                <b>Timeline</b>
                {service.time}
              </span>
              {b.proof.map(function chip(key) {
                const p = PROOF[key];
                return (
                  <Link className="pill" to={`/work/${p.slug}`} key={key} data-no-wipe>
                    <b>See it in</b>
                    {p.name} →
                  </Link>
                );
              })}
            </div>
          </article>
        );
      })}

      <article
        className={`card${beat === ALL_FOUR_BEAT ? " on" : ""}`}
        style={{ "--cc": "#9874E8" } as CSSProperties}
        aria-hidden={beat !== ALL_FOUR_BEAT}
      >
        <span className="k">
          <i />
          {ALL_FOUR.kicker}
        </span>
        <h2>{ALL_FOUR.title}</h2>
        <p>{ALL_FOUR.line}</p>
        <a className="book" href="#start">
          {ALL_FOUR.cta}
        </a>
      </article>
    </div>
  );
}
