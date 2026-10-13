import { Link } from "react-router-dom";
import ServiceChapter, { type ChapterSpec } from "./ServiceChapter";
import { ProductStack } from "./chapterObjects";
import { caseStudies } from "../../data/caseStudies";

/**
 * Ch3 — Products.
 *
 * The chapter that had the least on screen. Two services is a short
 * list, and the masked-band "exploded" object was one capture cut into
 * five strips that read as muddy overlapping panels. It is three real
 * products now — the console, the job-search SaaS and the LinkedIn
 * system — stacked in depth and sliding apart as the chapter is read,
 * and the lower third carries a proof tile for each of them.
 *
 * NO UNVERIFIED FIGURES: a tile prints a number only where
 * `caseStudies.ts` has a `headlineFigure`. Of these three only SIFT
 * does, so only SIFT's tile carries one. The other two carry their
 * sector instead, which is a fact the data already holds.
 */

const SPEC: ChapterSpec = {
  id: "ch-products",
  word: "PRODUCTS",
  tint: "rgba(61,107,255,0.44)",
  line: "Software your customers actually enjoy using.",
  support: "Dashboards, portals and SaaS products, designed and built as one system.",
  services: [
    { pillar: "design", name: "Product & SaaS interfaces" },
    { pillar: "design", name: "Design systems" },
  ],
  fill: [
    "/work/capitalcommand/w/01-overview-1680.webp",
    "/work/sift/w/01-command-overview-1680.webp",
  ],
  lift: 0.8,
  proof: "capitalcommand",
};

/** The three products, in the stack's own order. The line under each
 *  name is that study's own thesis, verbatim from `caseStudies.ts`. */
const TILES = ["capitalcommand", "sift", "cadencestack"];

function ProofTiles() {
  return (
    <ul className="pt-row">
      {TILES.map(function tile(slug) {
        const cs = caseStudies[slug];
        if (!cs) return null;
        const fig = cs.headlineFigure;
        return (
          <li key={slug} className="pt">
            <Link to={`/work/${slug}`} className="pt-link">
              <span className="pt-head">
                <span className="pt-name">{cs.client}</span>
                {fig ? (
                  <span className="pt-fig">{fig.value}</span>
                ) : (
                  <span className="pt-sector">{cs.sector}</span>
                )}
              </span>
              <span className="pt-line">{cs.hero.thesis}</span>
              <span className="pt-go">
                {fig ? fig.caption : "Read the case study"}
                <span className="pt-arrow" aria-hidden>→</span>
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

export default function ProductsChapter() {
  return <ServiceChapter spec={SPEC} object={ProductStack} below={<ProofTiles />} />;
}
