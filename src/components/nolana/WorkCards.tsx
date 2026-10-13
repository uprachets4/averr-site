import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useReducedMotion } from "motion/react";
import { Chip, TwoTone } from "./Bits";
import { Atmosphere } from "./DeviceStory";
import Screenshot from "../Screenshot";
import { caseStudies } from "../../data/caseStudies";

/**
 * The work.
 *
 * Two cinematic case cards, then the rest of the roster as a slim row.
 * This is the ONLY place a real project capture appears on home — the
 * rule from Session 26 still stands.
 *
 * KEPT FROM NOLANA (frames 09 and 11): a real screen held in a glass
 * device frame over the misty atmosphere, with a glowing ring beside
 * it, and a title plus one grey continuation line under the card.
 *
 * WHAT OURS DOES BETTER: Nolana's orb is fixed to the centre of its
 * card. Ours FOLLOWS THE CURSOR across the card while the whole frame
 * pushes in, so the light behaves like a light in the room rather than
 * a decal — and ours carries a verified figure, traced to the case
 * study, where Nolana's cards carry none.
 */

const FEATURED = ["capitalcommand", "sift"] as const;

const SHOT: Record<string, string> = {
  capitalcommand: "/work/capitalcommand/01-overview.jpg",
  sift: "/work/sift/01-command-overview.jpg",
};

const ALSO = [
  { slug: "cg-walls-and-floors", label: "CG Walls & Floors" },
  { slug: "cadencestack", label: "CadenceStack" },
  { slug: "careerclarity-ai", label: "CareerClarity AI", note: "in progress" },
];

function Card({ slug, i }: { slug: string; i: number }) {
  const reduce = !!useReducedMotion();
  const ref = useRef<HTMLAnchorElement | null>(null);

  /* A window listener, not React's onMouseMove: the same pattern the
     device tilt uses. The synthetic handler fired once and then stopped
     updating, and the orb sat where the pointer first entered. */
  useEffect(
    function orb() {
      const el = ref.current;
      if (!el || reduce) return;
      function move(e: PointerEvent) {
        const r = el!.getBoundingClientRect();
        if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) return;
        el!.style.setProperty("--ox", `${(((e.clientX - r.left) / r.width) * 100).toFixed(2)}%`);
        el!.style.setProperty("--oy", `${(((e.clientY - r.top) / r.height) * 100).toFixed(2)}%`);
      }
      window.addEventListener("pointermove", move, { passive: true });
      return function off() {
        window.removeEventListener("pointermove", move);
      };
    },
    [reduce]
  );

  const cs = caseStudies[slug];
  if (!cs) return null;
  const fig = cs.headlineFigure;

  return (
    <Link ref={ref} to={`/work/${slug}`} className="wc-card">
      <span className="wc-card__stage">
        <Atmosphere id={`wc${i}`} />
        <span className="wc-orb" aria-hidden />
        <span className="wc-frame">
          <span className="wc-frame__bar" aria-hidden>
            <i /><i /><i />
          </span>
          <Screenshot
            src={SHOT[slug]}
            alt={`${cs.client} — product screen`}
            sizes="(min-width: 1024px) 44vw, 90vw"
            loading="lazy"
          />
        </span>
      </span>
      <span className="wc-card__foot">
        <span className="wc-card__row">
          <span className="wc-card__t">{cs.client}</span>
          {fig ? <span className="wc-card__fig">{fig.value}</span> : null}
        </span>
        <span className="wc-card__l">{cs.hero.thesis}</span>
      </span>
    </Link>
  );
}

export default function WorkCards() {
  return (
    <section className="wc" id="ch-work">
      <div className="wc-inner">
        <div className="wc-head">
          <div>
            <Chip>The work</Chip>
            <TwoTone className="wc-h2" lead="Real projects," rest="real numbers." />
          </div>
          <Link to="/work" className="wc-all">
            See all work
          </Link>
        </div>

        <div className="wc-grid">
          {FEATURED.map(function one(slug, i) {
            return <Card key={slug} slug={slug} i={i} />;
          })}
        </div>

        <p className="wc-also">
          Also:{" "}
          {ALSO.map(function a(x, i) {
            return (
              <span key={x.slug}>
                {i > 0 ? <span aria-hidden> · </span> : null}
                <Link to={`/work/${x.slug}`}>{x.label}</Link>
                {x.note ? <em> ({x.note})</em> : null}
              </span>
            );
          })}
          <Link className="wc-vault" to="/work">
            Open the vault <span aria-hidden>→</span>
          </Link>
        </p>
      </div>
    </section>
  );
}
