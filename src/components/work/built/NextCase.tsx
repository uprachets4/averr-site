import { Link } from "react-router-dom";
import { screen, type BuiltProject } from "../../../data/builtByAverr";
import { Chips, ThesisPill } from "./bits";

/**
 * The last screen: the next case file, wrapping from the final project
 * back to the first.
 *
 * `data-no-wipe` matters here more than anywhere else on the route.
 * RouteWipe skips `/work` → `/work/:slug` by a hard-coded path check,
 * but this link goes case file → case file, which that check does not
 * catch — without the attribute the ink panel would sweep over the
 * reveal.
 *
 * The backdrop is the next project's second gallery screen, as in the
 * reference, held at 18% so the name carries the panel.
 */
export default function NextCase({ next }: { next: BuiltProject }) {
  return (
    <Link className="bb-nextcase" to={`/work/${next.slug}`} data-no-wipe>
      <img src={screen(next.gallery[1].image).small} alt="" loading="lazy" decoding="async" />
      <div className="bb-in bb-gut">
        <h2 className="bb-eyebrow">Next case file</h2>
        <h3>{next.name}</h3>
        <p className="bb-th">
          <ThesisPill thesis={next.thesis} pill={next.pill} />
        </p>
        <span className="bb-chips" style={{ justifyContent: "center" }}>
          <Chips svc={next.svc} />
        </span>
      </div>
    </Link>
  );
}
