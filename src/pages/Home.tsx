import { Suspense, lazy, useCallback, type CSSProperties } from "react";
import Hero from "../components/Hero";
import LazyBelowFold from "../components/LazyBelowFold";
import ChapterRail from "../components/home/ChapterRail";
import ChapterLightLayer from "../components/home/ChapterLight";
import { useDeclarePageEndTone } from "../lib/pageTone";

/**
 * Home, as one storytelling film on ONE colour flow.
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

const WebsitesChapter = lazy(() => import("../components/home/WebsitesChapter"));
const ProductsChapter = lazy(() => import("../components/home/ProductsChapter"));
const AutomationChapter = lazy(() => import("../components/home/AutomationChapter"));
const MarketingChapter = lazy(() => import("../components/home/MarketingChapter"));
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
  useDeclarePageEndTone("dark");

  const loadWebsites = useCallback(() => import("../components/home/WebsitesChapter"), []);
  const loadProducts = useCallback(() => import("../components/home/ProductsChapter"), []);
  const loadAI = useCallback(() => import("../components/home/AutomationChapter"), []);
  const loadMarketing = useCallback(() => import("../components/home/MarketingChapter"), []);
  const loadWork = useCallback(() => import("../components/home/WorkWall"), []);
  const loadFounder = useCallback(() => import("../components/home/FounderChapter"), []);
  const loadStart = useCallback(() => import("../components/home/StartChapter"), []);

  return (
    <div className="home-dark">
      <ChapterLightLayer />
      <ChapterRail />

      <section id="ch-build" data-tone="dark">
        <Hero />
      </section>

      <section id="ch-websites" data-tone="dark">
        <LazyBelowFold load={loadWebsites} minHeight="320vh" minHeightSm="107vh" background="transparent">
          <Suspense fallback={<Reserve h="320vh" sm="107vh" />}>
            <WebsitesChapter />
          </Suspense>
        </LazyBelowFold>
      </section>

      <section id="ch-products" data-tone="dark">
        <LazyBelowFold load={loadProducts} minHeight="320vh" minHeightSm="93vh" background="transparent">
          <Suspense fallback={<Reserve h="320vh" sm="93vh" />}>
            <ProductsChapter />
          </Suspense>
        </LazyBelowFold>
      </section>

      <section id="ch-ai" data-tone="dark">
        <LazyBelowFold load={loadAI} minHeight="320vh" minHeightSm="113vh" background="transparent">
          <Suspense fallback={<Reserve h="320vh" sm="113vh" />}>
            <AutomationChapter />
          </Suspense>
        </LazyBelowFold>
      </section>

      <section id="ch-marketing" data-tone="dark">
        <LazyBelowFold load={loadMarketing} minHeight="320vh" minHeightSm="106vh" background="transparent">
          <Suspense fallback={<Reserve h="320vh" sm="106vh" />}>
            <MarketingChapter />
          </Suspense>
        </LazyBelowFold>
      </section>

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
