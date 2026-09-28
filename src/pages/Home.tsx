import Hero from "../components/Hero";
import ThreeScenes from "../components/ThreeScenes";
import ThreeDoors from "../components/ThreeDoors";
import ProofLedger from "../components/ProofLedger";
import Manifesto from "../components/Manifesto";
import FinalCTA from "../components/FinalCTA";
import Chapter from "../components/Chapter";

export default function Home() {
  return (
    <>
      <Hero />

      {/* The hero ends dark in every mode — pinned takeover on desktop, the
          static reel block otherwise — so the handoff back to cream uses the
          site's own transition signature. */}
      <Chapter tone="cream" from="dark">
        <ThreeScenes />
        <ThreeDoors />
      </Chapter>

      {/* One dark chapter: the ledger states the proof, the manifesto says why. */}
      <Chapter tone="dark" from="cream-alt">
        <ProofLedger />
        <Manifesto />
      </Chapter>

      <Chapter tone="cream" from="dark">
        <FinalCTA markerNumber="06" />
      </Chapter>
    </>
  );
}
