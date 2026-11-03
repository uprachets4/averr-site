import { Suspense, lazy, useCallback, useEffect, useMemo, useRef, useState } from "react";
import Chapter from "../components/Chapter";
import LazyBelowFold from "../components/LazyBelowFold";
import NoList from "../components/services/NoList";
import ServicesCloser from "../components/services/ServicesCloser";
import Hero from "../components/services/v2/Hero";
import Rail from "../components/services/v2/Rail";
import BeatCards from "../components/services/v2/BeatCard";
import BuildStage, { StageGlow } from "../components/services/v2/BuildStage";
import { useBuildScroll } from "../components/services/v2/useBuildScroll";
import { fieldsFor, type TradeId } from "../data/servicesBuild";
import { useSetNavDarkOverride } from "../lib/navTone";
import { useDeclarePageEndTone } from "../lib/pageTone";
import "../components/services/v2/services.css";

const KickoffPass = lazy(() => import("../components/services/KickoffPass"));

/**
 * /services — "Built around your business" (spec 32).
 *
 * The visitor names their business and picks a trade; one pinned stage
 * then builds twelve real deliverables for it, three per service, and
 * tiles four of them at the end.
 *
 * The name and trade live here, in the page, because the hero, the
 * twelve mocks and the start pass all read them. They never leave:
 * no request, no storage, and the field is capped at 28 characters.
 *
 * Step 2 of the spec. The refusals, the start pass and the questions
 * are still the old components below; they are replaced in step 3, and
 * keeping them here means the page is never missing its call to action
 * between two commits.
 */
export default function Services() {
  const [typed, setTyped] = useState("");
  const [trade, setTrade] = useState<TradeId>("reno");

  const buildRef = useRef<HTMLElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const railRef = useRef<HTMLDivElement | null>(null);

  const { beat, step, jump } = useBuildScroll(buildRef, stageRef, railRef);
  const f = useMemo(() => fieldsFor(typed, trade), [typed, trade]);

  /* Dark from the first pixel, as on home and /work. */
  const setNavDark = useSetNavDarkOverride();
  useEffect(
    function navAlwaysDark() {
      setNavDark(true);
      const root = document.documentElement;
      const body = document.body;
      const prevBg = body.style.backgroundColor;
      root.style.setProperty("--nav-dark-bar", "#13161E");
      body.style.backgroundColor = "#121C27";
      return function reset() {
        setNavDark(false);
        root.style.removeProperty("--nav-dark-bar");
        body.style.backgroundColor = prevBg;
      };
    },
    [setNavDark]
  );

  useDeclarePageEndTone("dark");

  useEffect(function title() {
    const prev = document.title;
    document.title = "Services — Averr Studios";
    return function restore() {
      document.title = prev;
    };
  }, []);

  const loadPass = useCallback(() => import("../components/services/KickoffPass"), []);

  return (
    <>
      <div className="sv">
        <div className="grain" aria-hidden="true" />

        <Hero
          typed={typed}
          onTyped={setTyped}
          trade={trade}
          onTrade={setTrade}
          onJump={jump}
        />

        <section
          className="build"
          id="build"
          ref={buildRef}
          aria-label="Twelve pieces, built for your business"
        >
          <div className="bstick gut">
            <div className="floor" aria-hidden="true" />
            <StageGlow beat={beat} />
            <Rail beat={beat} onJump={jump} railRef={railRef} />
            <div className="wrap bgrid">
              <BeatCards beat={beat} />
              <BuildStage f={f} beat={beat} step={step} stageRef={stageRef} />
            </div>
          </div>
        </section>
      </div>

      {/* Replaced in step 3. */}
      <Chapter tone="dark" from="dark">
        <NoList />
      </Chapter>
      <Chapter tone="cream-warm" from="dark">
        <LazyBelowFold load={loadPass} minHeight="1120px" background="var(--color-bg-warm)">
          <Suspense
            fallback={
              <div
                aria-hidden
                style={{ minHeight: "1120px", background: "var(--color-bg-warm)" }}
              />
            }
          >
            <KickoffPass />
          </Suspense>
        </LazyBelowFold>
      </Chapter>
      <Chapter tone="dark" from="cream-warm">
        <ServicesCloser />
      </Chapter>
    </>
  );
}
