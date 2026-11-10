import { MARK_PATH_D } from "../../MonogramMark";
import { DIRECTION_SWATCHES } from "../../../data/aboutTokens";

/**
 * DIRECTION's proof: the five colours with their services, the type,
 * the signed mark, and the navy the whole site stands on.
 *
 * The swatches come from `serviceColors.ts` by way of `aboutTokens`,
 * in the owner's fixed order — Websites, Web Apps, AI Automation,
 * Marketing — with the gradient's bridge stop between AI Automation
 * and Marketing, where `STUDIO_GRADIENT` puts it. The test asserts
 * both the order and that the bridge really is in that gradient.
 *
 * The mark reuses `MARK_PATH_D` and the page's shared `#mgrad`, so
 * there is still exactly one copy of the path on the page.
 */

export default function ProofDirection() {
  return (
    <div className="proof pf-dir">
      <div className="dsw">
        {DIRECTION_SWATCHES.map(function swatch(s) {
          return (
            <div key={s.hex + s.name}>
              <i style={{ "--s": s.hex } as React.CSSProperties} />
              <b>{s.name}</b>
              <span>{s.hex}</span>
            </div>
          );
        })}
      </div>

      <div className="dcard">
        <span className="ph">Type</span>
        <b className="g1">Geist</b>
        <span className="g2">Geist Mono · labels</span>
      </div>

      <div className="dcard">
        <span className="ph">Signature</span>
        <svg viewBox="0 0 327 454" className="dmark" aria-hidden="true">
          <path className="pmk" d={MARK_PATH_D} />
        </svg>
        <span className="g2">The monogram, signed</span>
      </div>

      <div className="dcard navy">
        <span className="ph">The world</span>
        <i />
        <span className="g2">Navy #121C27</span>
      </div>
    </div>
  );
}
