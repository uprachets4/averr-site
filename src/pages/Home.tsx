import Hero from "../components/Hero";
import Pillars from "../components/Pillars";
import Numbers from "../components/Numbers";
import CaseStudies from "../components/CaseStudies";
import Manifesto from "../components/Manifesto";
import FinalCTA from "../components/FinalCTA";

export default function Home() {
  return (
    <>
      <Hero />
      <Pillars />
      <Numbers />
      <CaseStudies />
      <Manifesto />
      <FinalCTA markerNumber="05" />
    </>
  );
}
