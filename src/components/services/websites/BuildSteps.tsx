import { WEBSITES_PROCESS } from "../../../data/serviceWebsites";

/**
 * How the build runs — the five steps /about already states, with the
 * two fields a buyer deciding on a website wants: when it happens, and
 * what lands in their hands at the end of it.
 *
 * The steps carry their own colour in `PROCESS`, and it is deliberately
 * not used here. Those five colours are the four service colours plus
 * the bridge; painted on a page about one service they would read as
 * "this step is Marketing". The colour rules in `serviceColors` give a
 * surface that shows ONE service that service's colour, so every dot on
 * this page is the Websites accent, set once as `--wc` on the page root.
 */
export default function BuildSteps() {
  return (
    <section className="sec gut" aria-labelledby="wproc" style={{ paddingTop: 0 }}>
      <div className="wrap">
        <span className="eyebrow reveal">How it runs</span>
        <h2 id="wproc" className="reveal" style={{ marginTop: 18 }}>
          Five steps, and you see every one of them.
        </h2>

        <ol className="wsteps">
          {WEBSITES_PROCESS.map(function step(s) {
            return (
              <li className="wstep" key={s.name}>
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
