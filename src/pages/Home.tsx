import { useEffect } from "react";
import PlanetHero from "../components/home/planet/PlanetHero";
import HomeFilm from "../components/home/film/HomeFilm";

import { useSetNavDarkOverride } from "../lib/navTone";

/**
 * Home — Session 30, step 2.
 *
 * The Planet hero, then the film: five acts on one pinned stage. The
 * hero's takeover opens into the film's own background, so the two
 * stages meet with no seam.
 *
 * What went with them, each verified to have no importer outside this
 * page before it was deleted: ThreeScenes, ServiceDoors, ProofLedger,
 * Manifesto, FinalCTA, CaseStudies (only ProofLedger used FeaturedCard),
 * PillHl (only FinalCTA used it — the 404 dropped it in Session 20) and
 * the homeScenes data. `Chapter` stays: /work, /services, /about,
 * /contact and the case studies all use it, and `lib/pageTone` imports
 * its `Tone` type. So do CharReveal, MagneticCTA, LineReveal, Screenshot
 * and AverrMark.
 *
 * `src/data/serviceColors.ts` is deliberately left in place though
 * nothing imports it today: the film's service acts are built on it in
 * step 3.
 */

export default function Home() {
  /* Session 27, still true: the dark glass bar sits on every section of
     home — it is part of the system, not a reaction to what is under it. */
  const setNavDark = useSetNavDarkOverride();
  useEffect(
    function navAlwaysDark() {
      setNavDark(true);
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
      <PlanetHero />
      <HomeFilm />
    </>
  );
}
