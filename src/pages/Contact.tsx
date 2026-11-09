import { useCallback, useEffect } from "react";
import { useDeclarePageEndTone } from "../lib/pageTone";
import { useSetNavDarkOverride } from "../lib/navTone";
import { useDocumentMeta, META } from "../lib/documentMeta";
import { prefersReducedMotion } from "../components/about/v2/useSectionProgress";
import Opening from "../components/contact/v2/Opening";
import Brief from "../components/contact/v2/Brief";
import { useBrief } from "../components/contact/v2/briefState";
import TalkSection from "../components/contact/v2/TalkSection";
import OtherWays from "../components/contact/v2/OtherWays";
import "../components/contact/v2/contact.css";

/* ═══════════════════════════════════════════════════════════════
   /contact, spec 34.

   Four sections under one `.ct` root: the opening with its two
   doors, Write (the brief, the letter that composes itself from it,
   and the send), Talk with the real Cal.com embed, and Other ways.

   The brief's state lives here, in `useBrief`, because three things
   read it: the letter, the Send button, and (in step 4) the Talk
   section's carry-over note. One object, so they cannot disagree.

   The old page's six sections went in this step rather than at the
   end, for the reason spec 33 learned the hard way: every one of
   them injects GLOBAL rules from a component <style> block, and this
   port's class names are the reference's own — `.open`, `.write`,
   `.talk`, `.f`, `.tile`, `.chip`. Leaving the old components
   mounted underneath would invite exactly the collision that cost a
   session on /about. The files stay on disk until the step that
   replaces each one.
   ═══════════════════════════════════════════════════════════════ */

export default function Contact() {
  useDeclarePageEndTone("dark");
  useDocumentMeta(META.contact.title, META.contact.description);

  useEffect(function scrollTop() {
    window.scrollTo(0, 0);
  }, []);

  /* Dark from the first pixel, as on home, /work, /services and
     /about. The ground is the navy step 1 put on the document; this
     only pins the nav bar's own tone. */
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

  const brief = useBrief();

  /** A door jumps to its section; reduced motion jumps outright. */
  const go = useCallback(function go(id: string) {
    document.getElementById(id)?.scrollIntoView({
      behavior: prefersReducedMotion() ? "auto" : "smooth",
    });
  }, []);

  return (
    <div className="ct">
      {/* The gradients the sent mark and the flight trail paint with.
          Named `ct*` rather than the reference's `mgrad`/`mfillg`/`tg`
          because /about already owns two of those ids. */}
      <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
        <defs>
          <linearGradient id="ctgrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#F9AF97" />
            <stop offset=".33" stopColor="#D5818C" />
            <stop offset=".66" stopColor="#9874E8" />
            <stop offset="1" stopColor="#569AFA" />
          </linearGradient>
          <linearGradient id="ctfill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#FFFFFF" />
            <stop offset="1" stopColor="#E6E3F2" />
          </linearGradient>
          <linearGradient id="cttrail" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0" stopColor="#F9AF97" stopOpacity="0" />
            <stop offset=".4" stopColor="#D5818C" />
            <stop offset=".75" stopColor="#9874E8" />
            <stop offset="1" stopColor="#569AFA" />
          </linearGradient>
        </defs>
      </svg>
      <div className="grain" aria-hidden="true" />

      <Opening onGo={go} />

      <section className="write gut" id="write" aria-labelledby="ct-wh">
        <div className="orb c" aria-hidden="true" />
        <div className="wrap">
          <div className="whead rv in">
            <div>
              <span className="eyebrow">Write</span>
              <h2 id="ct-wh">Tell me what you're building.</h2>
            </div>
            <p>
              Pick what you need and add a few details. Your letter writes
              itself on the right.
            </p>
          </div>
          <Brief brief={brief} onBook={() => go("talk")} />
        </div>
      </section>

      <TalkSection brief={brief} />
      <OtherWays />
    </div>
  );
}
