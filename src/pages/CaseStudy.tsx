import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { caseStudies } from "../data/caseStudies";
import CaseHero from "../components/case-study/CaseHero";
import Context from "../components/case-study/Context";
import Approach from "../components/case-study/Approach";
import Inventory from "../components/case-study/Inventory";
import Signatures from "../components/case-study/Signatures";
import Outcome from "../components/case-study/Outcome";
import Next from "../components/case-study/Next";
import FinalCTA from "../components/FinalCTA";
import NotFound from "./NotFound";
import ComingSoon from "./ComingSoon";

export default function CaseStudy() {
  const { slug } = useParams();
  const study = slug ? caseStudies[slug] : undefined;
  const isPublishable = !!study && study.status === "live";

  useEffect(
    function updateTitle() {
      if (!isPublishable || !study) return;
      const prev = document.title;
      document.title = `${study.client} — Averr Studios`;
      return function restore() {
        document.title = prev;
      };
    },
    [study, isPublishable]
  );

  useEffect(
    function scrollTopOnSlug() {
      window.scrollTo(0, 0);
    },
    [slug]
  );

  if (!study) {
    return <NotFound />;
  }

  if (study.status === "draft") {
    return <ComingSoon />;
  }

  return (
    <>
      <CaseHero
        hero={study.hero}
        client={study.client}
        pillars={study.pillars}
        sector={study.sector}
        year={study.year}
      />
      <Context paragraphs={study.context} />
      <Approach entries={study.approach} />
      <Inventory items={study.inventory} stack={study.stack} />
      <Signatures items={study.signatures} />
      <Outcome text={study.outcome} />
      <Next text={study.next} />
      <FinalCTA markerNumber="07" />
    </>
  );
}
