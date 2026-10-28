import { useEffect } from "react";
import NolanaHero from "../components/nolana/NolanaHero";
import { GradientDefs } from "../components/nolana/Bits";

import ThreeScenes from "../components/ThreeScenes";
import ThreeDoors from "../components/ThreeDoors";
import ProofLedger from "../components/ProofLedger";
import Manifesto from "../components/Manifesto";
import FinalCTA from "../components/FinalCTA";
import Chapter from "../components/Chapter";

import { useSetNavDarkOverride } from "../lib/navTone";

/**
 * Home — Session 29.
 *
 * Everything below the hero is the September home restored verbatim from
 * `54c6285` ("20-2 fix: the wordmark actually spans the container"), the
 * last commit whose hero read "businesses that want to look serious."
 * Same components, same copy, same order; the sections themselves are
 * untouched.
 *
 * The hero slot still holds `NolanaHero`. Step 2 of the spec replaces it
 * with the Planet hero, and this import goes with it. Both grounds end
 * dark, so the handoff into the first cream chapter is the same
 * `Chapter tone="cream" from="dark"` September used.
 */

export default function Home() {
  /* Session 27, reaffirmed for 29: the dark glass bar sits on EVERY
     section of home, light ones included — it is part of the system, not
     a reaction to what is under it. */
  const setNavDark = useSetNavDarkOverride();
  useEffect(
    function navAlwaysDark() {
      setNavDark(true);
      /* Over a LIGHT section the default translucent bar washes out to
         grey. On home it is the solid dark bar the system calls for. */
      const root = document.documentElement;
      root.style.setProperty("--nav-dark-bar", "#13161E");
      return function reset() {
        setNavDark(false);
        root.style.removeProperty("--nav-dark-bar");
      };
    },
    [setNavDark]
  );

  return (
    <>
      <GradientDefs />
      <NolanaHero />

      {/* The hero ends dark in every mode, so the handoff back to cream
          uses the site's own transition signature. */}
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
