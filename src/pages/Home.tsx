import { Suspense, lazy, useCallback, useEffect, type CSSProperties } from "react";
import NolanaHero from "../components/nolana/NolanaHero";
import LazyBelowFold from "../components/LazyBelowFold";
import { GradientDefs } from "../components/nolana/Bits";
import { Problem, WhatWeBuild, Numbers } from "../components/nolana/Sections";
import DeviceStory from "../components/nolana/DeviceStory";
import { useDeclarePageEndTone } from "../lib/pageTone";
import { useSetNavDarkOverride } from "../lib/navTone";

/**
 * Home, on the Nolana system.
 *
 * There is a single dark ground from the first pixel to the last. The
 * story is told with LIGHT — a fixed layer whose colour interpolates
 * with scroll — rather than with the cream/ink chapter grounds the site
 * used until Session 25. Every chapter sits on the same ground and is
 * coloured by where the reader is in the page.
 *
 * Chapter order: what we build (the hero) → websites → products →
 * automation → marketing → the work → who builds it → your move.
 *
 * Everything below the hero loads below the fold; the hero is the LCP
 * surface and carries nothing it does not need.
 */

const WorkWall = lazy(() => import("../components/home/WorkWall"));
const FounderChapter = lazy(() => import("../components/home/FounderChapter"));
const StartChapter = lazy(() => import("../components/home/StartChapter"));

/** The reserve a chapter holds while its chunk is in flight.
 *  There are TWO of these per chapter -- LazyBelowFold's placeholder and
 *  the Suspense fallback behind it -- and they have to agree. A 320vh
 *  fallback left on the Suspense boundary was still collapsing the page
 *  by ~1,843px on a phone after the placeholder itself was fixed. */
function Reserve({ h, sm }: { h: string; sm: string }) {
  return (
    <div
      aria-hidden
      className="lbf-reserve"
      style={{ "--lbf-h": h, "--lbf-h-sm": sm } as CSSProperties}
    />
  );
}

export default function Home() {
  /* Home ends dark, so the global footer closes on the same ground instead
     of ending the colour flow with a cream slab. Declared here rather than
     in StartChapter because that chapter is lazy and the footer would
     otherwise paint cream until it mounted. */
  /* home now ENDS on the light ground, so the footer follows it back */
  useDeclarePageEndTone("cream");

  /* Session 27: the dark glass bar sits on EVERY section of home, light
     ones included — it is part of the system, not a reaction to what is
     under it. */
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

  const loadWork = useCallback(() => import("../components/home/WorkWall"), []);
  const loadFounder = useCallback(() => import("../components/home/FounderChapter"), []);
  const loadStart = useCallback(() => import("../components/home/StartChapter"), []);

  return (
    <div className="home-nolana">

      <GradientDefs />
      <NolanaHero />
      <Problem />
      <WhatWeBuild />
      <DeviceStory />
      <Numbers />





      <section id="ch-work" data-tone="dark">
        <LazyBelowFold load={loadWork} minHeight="320vh" minHeightSm="254vh" background="transparent">
          <Suspense fallback={<Reserve h="320vh" sm="254vh" />}>
            <WorkWall />
          </Suspense>
        </LazyBelowFold>
      </section>

      <section id="ch-founder" data-tone="dark">
        <LazyBelowFold load={loadFounder} minHeight="72vh" minHeightSm="118vh" background="transparent">
          <Suspense fallback={<Reserve h="72vh" sm="118vh" />}>
            <FounderChapter />
          </Suspense>
        </LazyBelowFold>
      </section>

      <section id="ch-start" data-tone="dark">
        <LazyBelowFold load={loadStart} minHeight="93vh" minHeightSm="107vh" background="transparent">
          <Suspense fallback={<Reserve h="93vh" sm="107vh" />}>
            <StartChapter />
          </Suspense>
        </LazyBelowFold>
      </section>
    </div>
  );
}
