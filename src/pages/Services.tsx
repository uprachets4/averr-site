import { useEffect, useMemo, useRef, useState } from "react";
import Hero from "../components/services/v2/Hero";
import Refusals from "../components/services/v2/Refusals";
import StartPass from "../components/services/v2/StartPass";
import Questions from "../components/services/v2/Questions";
import Rail from "../components/services/v2/Rail";
import BeatCards from "../components/services/v2/BeatCard";
import BuildStage, { StageGlow } from "../components/services/v2/BuildStage";
import { useBuildScroll } from "../components/services/v2/useBuildScroll";
import { fieldsFor, type TradeId } from "../data/servicesBuild";
import { useSetNavDarkOverride } from "../lib/navTone";
import { useDeclarePageEndTone } from "../lib/pageTone";
import "../components/services/v2/services.css";
import { useSvReveal } from "../components/services/v2/useSvReveal";
import { useDocumentMeta, META } from "../lib/documentMeta";

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
 * Then the three refusals, the start pass — where the same name picks
 * a day and the ticket writes its own timeline — and the questions.
 *
 * What it replaced, each confirmed to have no importer outside this
 * route first: ServicesBuild and its seven `build/*` screens, NoList,
 * ServicesCloser, KickoffPass, DateToken and data/servicesProcess.
 * `passBooking` stays and the new pass books through it; `servicePillars`
 * stays because /contact reads it.
 */
export default function Services() {
  const [typed, setTyped] = useState("");
  const [trade, setTrade] = useState<TradeId>("reno");

  const buildRef = useRef<HTMLElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const railRef = useRef<HTMLDivElement | null>(null);
  const svRef = useRef<HTMLDivElement | null>(null);
  useSvReveal(svRef);

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

  useDocumentMeta(META.services.title, META.services.description);

  return (
    <div className="sv" ref={svRef}>
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

        <Refusals />
        <StartPass typed={typed} onTyped={setTyped} />
        <Questions />
      </div>
  );
}
