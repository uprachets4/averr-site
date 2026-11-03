import type { CSSProperties } from "react";
import { screen, type BuiltSig } from "../../../data/builtByAverr";

/**
 * 04 — signature moments: each one pins for 170vh while the frame
 * zooms into the exact detail the card is describing.
 *
 * The zoom is driven by the page's scroll loop in `CaseStudy.tsx`,
 * which writes `--z` and `--v` onto the frame. Everything the section
 * needs for that is in the markup: the focal point as percentages on
 * the `.bb-sig` wrapper, which the transform-origin and the vignette's
 * centre both read.
 *
 * Below 900px nothing pins — the stylesheet shows the frame cropped at
 * 1.7x on the focal point with the card underneath, and the scroll
 * loop leaves the section alone.
 *
 * The heading repeats above every moment, as in the reference, but
 * only the first is a real `h2`: three identical section headings
 * would be three entries in the document outline for one section.
 */
export default function Signatures({
  sigs,
  accent,
  number,
}: {
  sigs: BuiltSig[];
  accent: string;
  number: string;
}) {
  return (
    <section className="bb-sigs" aria-label="Signature moments">
      {sigs.map(function moment(s, j) {
        return (
          <div
            className="bb-sig"
            key={s.image + j}
            style={
              {
                "--fx": `${s.fx * 100}%`,
                "--fy": `${s.fy * 100}%`,
              } as CSSProperties
            }
          >
            <div className="bb-sigstick">
              <div className="bb-sighead bb-gut">
                <div className="bb-wrap">
                  <div className="bb-label" style={{ margin: 0 }}>
                    {j === 0 ? (
                      <h2 className="bb-eyebrow">Signature moments</h2>
                    ) : (
                      <span className="bb-eyebrow" aria-hidden="true">
                        Signature moments
                      </span>
                    )}
                    <span className="bb-n">{number}</span>
                  </div>
                </div>
              </div>

              <div className="bb-gut bb-sigin">
                <div className="bb-wrap bb-sigin">
                  <div className="bb-siggrid">
                    <div className="bb-scard" style={{ "--c": accent } as CSSProperties}>
                      <span className="bb-k">
                        <i className="bb-dot" style={{ "--c": accent } as CSSProperties} />
                        Signature {j + 1} of {sigs.length}
                      </span>
                      <h3>{s.title}</h3>
                      <p>{s.text}</p>
                    </div>
                    <div className="bb-sframe">
                      <img src={screen(s.image).large} alt={s.title} loading="lazy" decoding="async" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </section>
  );
}
