import { useRef } from "react";
import { Link } from "react-router-dom";
import { Chip, TwoTone } from "./Bits";
import { Atmosphere } from "./DeviceStory";
import Atmos from "./Atmos";
import { useTilt, useSpotlight, Magnetic } from "./Motion";
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
  const ref = useRef<HTMLAnchorElement | null>(null);
  /* 28b: one hook now does the tilt, the sheen and the orb. It
     publishes --mx/--my, which the orb reads as a transform — it used
     to drive left/top per frame, which is a layout write. */
  useTilt(ref, 4);

  const cs = caseStudies[slug];
  if (!cs) return null;
  const fig = cs.headlineFigure;

  return (
    <Link ref={ref} to={`/work/${slug}`} className="wc-card">
      <span className="wc-card__stage">
        <Atmos
          name={i === 0 ? "02-work-card-warm" : "03-work-card-cool"}
          sizes="(min-width: 1024px) 46vw, 92vw"
          className="wc-plate"
        />
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
          <span className="wc-frame__rim" aria-hidden />
        </span>
        {/* G3 — two details lifted OUT of the same capture, so the
            screen is composed into the scene rather than sitting in
            front of it. Each is a crop of the very same file, scaled
            and offset, not a second asset. */}
        <span className="wc-crop wc-crop--a" aria-hidden>
          <Screenshot src={SHOT[slug]} alt="" sizes="220px" loading="lazy" />
        </span>
        <span className="wc-crop wc-crop--b" aria-hidden>
          <Screenshot src={SHOT[slug]} alt="" sizes="180px" loading="lazy" />
        </span>
        <span className="wc-haze" aria-hidden />
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
  const sec = useRef<HTMLElement | null>(null);
  useSpotlight(sec);
  return (
    <section className="wc" id="ch-work" ref={sec}>
      <div className="wc-inner">
        <div className="wc-head">
          <div>
            <Chip>The work</Chip>
            <TwoTone className="wc-h2" lead="Real projects," rest="real numbers." />
          </div>
          <Magnetic as={Link} to="/work" className="wc-all">
            See all work
          </Magnetic>
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
