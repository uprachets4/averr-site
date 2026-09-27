import Hero from "../components/Hero";
import StorySoFar from "../components/StorySoFar";
import Pillars from "../components/Pillars";
import Numbers from "../components/Numbers";
import CaseStudies from "../components/CaseStudies";
import Manifesto from "../components/Manifesto";
import FinalCTA from "../components/FinalCTA";
import Chapter from "../components/Chapter";

export default function Home() {
  return (
    <>
      <Hero />
      <StorySoFar />
      <Pillars />
      <Numbers />

      {/* CaseStudies and Manifesto are one continuous dark stretch — one
          reveal in, one out, rather than a boundary between them. */}
      <Chapter tone="dark" from="cream-alt">
        <CaseStudies />
        <Manifesto />
      </Chapter>

      <Chapter tone="cream" from="dark">
        <FinalCTA markerNumber="06" />
      </Chapter>
    </>
  );
}
