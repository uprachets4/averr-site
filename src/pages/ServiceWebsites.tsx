import { useEffect, useRef, type CSSProperties } from "react";
import Hero from "../components/services/websites/Hero";
import Included from "../components/services/websites/Included";
import BuildSteps from "../components/services/websites/BuildSteps";
import Proof from "../components/services/websites/Proof";
import Questions from "../components/services/websites/Questions";
import Close from "../components/services/websites/Close";
import { WEBSITES_ACCENT } from "../data/serviceWebsites";
import { useSvReveal } from "../components/services/v2/useSvReveal";
import { useSetNavDarkOverride } from "../lib/navTone";
import { useDeclarePageEndTone } from "../lib/pageTone";
import { useDocumentMeta, META } from "../lib/documentMeta";
import "../components/services/v2/services.css";
import "../components/services/websites/websites.css";

/**
 * /services/websites — the first of the four service pages.
 *
 * One page, one search: "web design Toronto". /services sells all four
 * services together and ranks for the set; this page answers the person
 * who searched for a website and nothing else, which is the search the
 * site could not rank for while twelve URLs covered four services.
 *
 * It carries `.sv` as well as `.wsp` so the tokens, reset and shared
 * blocks in `services.css` apply — the page sits in the same atmosphere
 * as /services instead of inventing a second one, which is the thing
 * the owner notices first ("the gradient is not the same").
 *
 * `--wc` is the Websites accent, set once here: every dot and rule on
 * the page takes it, because the page shows one service and the colour
 * rules reserve a single service colour for exactly that.
 *
 * `useSvReveal` is not optional. The stylesheet hides every `.sv
 * .reveal` until it has `.in`, and a `.reveal` system shipped once
 * without its observer left the services headings invisible for weeks
 * (playbook 05, pitfall 5).
 */
export default function ServiceWebsites() {
  const svRef = useRef<HTMLDivElement | null>(null);
  useSvReveal(svRef);

  /* Dark from the first pixel, as on home, /work and /services. */
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

  useDocumentMeta(META.servicesWebsites.title, META.servicesWebsites.description);

  return (
    <div className="sv wsp" ref={svRef} style={{ "--wc": WEBSITES_ACCENT } as CSSProperties}>
      <div className="grain" aria-hidden="true" />

      <Hero />
      <Included />
      <BuildSteps />
      <Proof />
      <Questions />
      <Close />
    </div>
  );
}
