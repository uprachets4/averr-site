import { useEffect, useMemo } from "react";
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
import ReadingRail from "../components/case-study/ReadingRail";
import Chapter from "../components/Chapter";
import { railSections } from "../data/caseSections";
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

  // a fresh array each render would restart the rail's scroll listener
  const sections = useMemo(
    function chapters() {
      return railSections({ hasSignatures: !!study && study.signatures.length > 0 });
    },
    [study]
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
      <ReadingRail
        sections={sections}
        tint={study.tint || "var(--color-ink)"}
      />
      <CaseHero
        hero={study.hero}
        client={study.client}
        pillars={study.pillars}
        sector={study.sector}
        year={study.year}
        heroImage={study.heroImage}
        heroImages={study.heroImages}
        heroCaption={study.heroCaption}
        tint={study.tint}
      />
      <Context paragraphs={study.context} tint={study.tint} />
      <Approach entries={study.approach} />
      <Inventory items={study.inventory} stack={study.stack} tint={study.tint} />

      {/* Signatures → Gallery → Outcome is one dark stretch: the Gallery goes
          dark so the run reveals once on entry instead of flickering between
          three separate boundaries. Studies without Signatures/Gallery (CG
          Walls) get the Chapter around Outcome alone. */}
      <Chapter tone="dark" from="cream">
        {study.signatures.length > 0 ? (
          <Signatures
            items={study.signatures}
            imageSrc={study.signatureImage}
            imageAlt={`${study.client} screen`}
            tint={study.tint}
          />
        ) : null}
        {study.gallery && study.gallery.length > 0 ? (
          <Gallery items={study.gallery} client={study.client} tone="dark" />
        ) : null}
        <Outcome text={study.outcome} />
      </Chapter>

      <Chapter tone="cream-alt" from="dark">
        <Next text={study.next} />
      </Chapter>
      <FinalCTA markerNumber="07" />
    </>
  );
}
