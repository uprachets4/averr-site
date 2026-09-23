import Hero from "../components/Hero";
import StorySoFar from "../components/StorySoFar";
import Pillars from "../components/Pillars";
import Numbers from "../components/Numbers";
import CaseStudies from "../components/CaseStudies";
import Manifesto from "../components/Manifesto";
import FinalCTA from "../components/FinalCTA";

export default function Home() {
  return (
    <>
      <Hero />
      <StorySoFar />
      <Pillars />
      <Numbers />
      <CaseStudies />
      <Manifesto />
      <FinalCTA markerNumber="06" />
    </>
  );
}
