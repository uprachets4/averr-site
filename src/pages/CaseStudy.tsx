import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { caseStudies } from "../data/caseStudies";
import CaseHero from "../components/case-study/CaseHero";
import Context from "../components/case-study/Context";
import Approach from "../components/case-study/Approach";
import Inventory from "../components/case-study/Inventory";
import Signatures from "../components/case-study/Signatures";
import Gallery from "../components/case-study/Gallery";
import Outcome from "../components/case-study/Outcome";
import Next from "../components/case-study/Next";
import ScrollProgress from "../components/case-study/ScrollProgress";
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
      <ScrollProgress />
      <CaseHero
        hero={study.hero}
        client={study.client}
        pillars={study.pillars}
        sector={study.sector}
        year={study.year}
        heroImage={study.heroImage}
        heroImages={study.heroImages}
        heroCaption={study.heroCaption}
      />
      <Context paragraphs={study.context} />
      <Approach entries={study.approach} />
      <Inventory items={study.inventory} stack={study.stack} />
      {study.signatures.length > 0 ? (
        <Signatures
          items={study.signatures}
          imageSrc={study.signatureImage}
          imageAlt={`${study.client} screen`}
        />
      ) : null}
      {study.gallery && study.gallery.length > 0 ? (
        <Gallery items={study.gallery} client={study.client} />
      ) : null}
      <Outcome text={study.outcome} />
      <Next text={study.next} />
      <FinalCTA markerNumber="07" />
    </>
  );
}
