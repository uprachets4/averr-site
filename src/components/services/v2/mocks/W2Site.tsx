import type { Fields } from "../../../../data/servicesBuild";
import Chrome from "./Chrome";

/** Websites 2 of 3 — the site assembling itself. */
export default function W2Site({ f }: { f: Fields }) {
  const t = f.trade;
  return (
    <>
      <Chrome url={f.domain} live />
      <div className="vp lt site">
        <div className="snav">
          <span className="slogo">
            <em />
            <span className="bar">{f.name}</span>
          </span>
          <span className="slinks">
            <span className="bar">{t.s[0]}</span>
            <span className="bar">{t.s[1]}</span>
            <span className="bar">{t.s[2]}</span>
          </span>
          <span className="scta wf">
            <span className="bar">Contact</span>
          </span>
        </div>

        <div className="shero">
          <div className="stext">
            <span className="seyb">
              <span className="bar">{t.area}</span>
            </span>
            <h5 className="sh">
              <span className="bar">{t.head}</span>
            </h5>
            <p className="sp">
              <span className="bar">{t.sub}</span>
            </p>
            <span className="sbtn wf">
              <span className="bar">{t.cta}</span>
              <span className="rip" />
              <svg className="ptr" viewBox="0 0 24 24">
                <path
                  d="M4 2l15 9-7 1.5L9 20z"
                  fill="#0F1117"
                  stroke="#fff"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </div>
          <div className="sart wf">
            <i className="shape a" />
            <i className="shape b" />
            <i className="shape c" />
          </div>
        </div>

        <div className="scards">
          {t.s.map(function card(label) {
            return (
              <div className="scard wf" key={label}>
                <i />
                <b className="bar">{label}</b>
              </div>
            );
          })}
        </div>

        <div className="toast">
          <i>✓</i>
          <span>{t.toast}</span>
        </div>
      </div>
    </>
  );
}
