import { Link } from "react-router-dom";
import { FIGURES } from "../../../data/builtByAverr";
import { Dots } from "./bits";

/**
 * Three real figures, each one a door into the case file it came from.
 *
 * These are the only numbers on /work, and all three are measured:
 * CG's 85%, SIFT's 42% and Express's 5.0 from 203 reviews. CadenceStack
 * and CapitalCommand have none, so they are not here — their case files
 * show a status chip instead.
 *
 * `data-no-wipe` keeps RouteWipe off these links: the case file has its
 * own clip-path reveal, and running both would play two transitions
 * over each other.
 */
export default function ProofStrip() {
  return (
    <section className="bb-proof bb-gut" aria-label="Results">
      <div className="bb-wrap">
        <div className="bb-figs">
          {FIGURES.map(function figure(p) {
            return (
              <Link
                className="bb-fig"
                to={`/work/${p.slug}`}
                key={p.slug}
                state={{ from: "work" }}
                data-no-wipe
              >
                <span className="bb-v bb-gt">{p.figure!.value}</span>
                <span className="bb-cap">{p.figure!.caption}</span>
                <span className="bb-who">
                  <Dots svc={p.svc} /> {p.name} →
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
