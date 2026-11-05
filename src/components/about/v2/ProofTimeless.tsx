import { useEffect, useRef } from "react";
import {
  TIMELESS_HEADLINE_PLAIN,
  TREND_LABEL,
  TREND_STYLES,
  type TrendStyle,
} from "../../../data/aboutPrinciples";

/**
 * TIMELESS's proof: the site's own headline set in this year's trend,
 * marked "Dated" once the flipping stops, beside the clean version,
 * marked "Still holds".
 *
 * The trend card's lettering follows the word's own `data-style`, so
 * the card and the giant word are always in the same trend — the
 * sheet selects it as `.tim[data-style="…"] .trendcard b`, which is
 * why nothing here needs to know which style is showing.
 *
 * The trend colours (neon pink, chrome greys, bubble lime) are
 * illustrative content, not palette: they live only inside this card
 * and the TIMELESS word, as the palette rules require.
 */

export default function ProofTimeless({
  chipsRef,
}: {
  /**
   * Registers the five chips so `Principles` can mark them past/current
   * as the word flips.
   *
   * They are driven by hand rather than from React state on purpose.
   * The word's classes (`on`, `done`, `proofon`) and its letters are
   * all written straight onto the DOM, and a React re-render would
   * reconcile `className` back to what the JSX says and wipe them. The
   * whole section therefore renders once and is never re-rendered.
   */
  chipsRef: (els: HTMLSpanElement[]) => void;
}) {
  const chips = useRef<HTMLSpanElement[]>([]);

  useEffect(
    function publish() {
      chipsRef(chips.current.filter(Boolean));
    },
    [chipsRef]
  );

  return (
    <div className="proof pf-tim">
      <div className="tcard trendcard">
        <span className="ph">
          The same headline, this year{String.fromCharCode(39)}s trend
          <em>Dated</em>
        </span>
        <b>{TIMELESS_HEADLINE_PLAIN}</b>
      </div>

      <div className="tcard cleancard">
        <span className="ph">
          averrstudios.com <em className="ok">Still holds</em>
        </span>
        <b>
          You work directly with the person who{" "}
          <span className="gt">builds it</span>.
        </b>
      </div>

      <div className="trends">
        {TREND_STYLES.map(function trend(s: TrendStyle, i) {
          return (
            <span
              key={s}
              data-s={s}
              /* Chrome is current at rest; the rest are set by hand. */
              className={
                (s === "clean" ? "keep" : "") + (i === 0 ? " cur" : "")
              }
              ref={(el) => {
                if (el) chips.current[i] = el;
              }}
            >
              {TREND_LABEL[s]}
            </span>
          );
        })}
      </div>
    </div>
  );
}
