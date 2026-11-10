import { SPACING_SCALE, TYPE_SCALE } from "../../../data/aboutTokens";

/**
 * CRAFT's proof: a template's ragged defaults next to the studio's
 * real spacing and type scales.
 *
 * Both scales are READ from `aboutTokens`, which `tools/
 * about-tokens.test.ts` keeps matching `src/index.css`. Nothing here
 * types a number that the stylesheet also declares.
 *
 * The ragged column is deliberately arbitrary — it is the thing being
 * argued against — so its widths are literals, as in the reference.
 */

/** The ragged widths a theme might have shipped with. */
const RAG_WIDTHS = ["19%", "7%", "31%", "12%", "44%", "26%", "9%"];

/**
 * The biggest value on the scale sets 100% of the bar track, so every
 * bar is its step's real share of 128.
 *
 * The reference hand-wrote these widths and rounded four of them (4 →
 * "3%" rather than 3.125%, 8 → "6%", 12 → "9%", 24 → "19%"). Deriving
 * them from the scale is what the ruling asks for, so these are the
 * exact shares instead; the widest gap against the reference is 0.75px
 * on a ~600px track.
 */
const SCALE_MAX = SPACING_SCALE[SPACING_SCALE.length - 1];
const pct = (step: number) => `${Number(((step / SCALE_MAX) * 100).toFixed(3))}%`;

/**
 * The type specimens shrink to fit the card, so the proof shows the
 * RATIO between the sizes rather than 208px of type. The ratio is the
 * point; the number beside each one is the real token.
 */
const SPECIMEN_PX = [34, 26, 21, 16, 13, 11];

export default function ProofCraft() {
  return (
    <div className="proof pf-craft">
      <div className="pcol bad">
        <span className="ph">A template{String.fromCharCode(39)}s defaults</span>
        <div className="bars rag">
          {RAG_WIDTHS.map(function bar(w, i) {
            return <i key={i} style={{ "--w": w } as React.CSSProperties} />;
          })}
        </div>
        <div className="tyrag">
          <b style={{ fontSize: 23 }}>Heading</b>
          <b style={{ fontSize: 15, fontWeight: 600 }}>Subheading</b>
          <span style={{ fontSize: 13 }}>
            Body copy sits wherever the theme put it.
          </span>
        </div>
        <span className="pnote">Whatever the theme shipped with</span>
      </div>

      <div className="pcol good">
        <span className="ph">averrstudios.com · the real scale</span>
        <div className="bars">
          {SPACING_SCALE.map(function bar(step) {
            return (
              <i
                key={step}
                style={{ "--w": pct(step) } as React.CSSProperties}
              >
                <em>{step}</em>
              </i>
            );
          })}
        </div>
        <div className="tyscale">
          {TYPE_SCALE.map(function size(t, i) {
            return (
              <span key={t.token}>
                <b style={{ fontSize: SPECIMEN_PX[i] }}>
                  {t.label === "Eyebrow" ? "AA" : "Aa"}
                </b>
                <em>
                  {t.label} · {t.max}
                </em>
              </span>
            );
          })}
        </div>
        <span className="pnote">Every gap and size on one scale, in px</span>
      </div>
    </div>
  );
}
