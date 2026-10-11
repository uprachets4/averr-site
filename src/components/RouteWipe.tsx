import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, useReducedMotion } from "motion/react";
import { ease } from "../lib/motion";
import { prefetchRoute } from "../lib/prefetchRoute";
import { vault } from "../data/workIndex";

/**
 * The site's page transition: an ink panel sweeps up, says where you
 * are going, and sweeps off the top.
 *
 * It listens for clicks at the document, in the capture phase, rather
 * than wrapping every Link — MagneticCTA, the nav, the footer and the
 * cards all go through plain anchors, and intercepting here means no
 * call site has to know the transition exists.
 *
 * It deliberately does NOT run for:
 *   · the /work → case-study clone-expand, which has its own transition
 *     (opted out with data-no-wipe)
 *   · back/forward, because browser history never fires a click
 *   · hash links, external links, downloads, new tabs, modified clicks
 *   · reduced motion, which navigates instantly
 *
 * The route chunk is prefetched the moment the click is intercepted, so
 * by the time the panel is covering, the destination is parsed and its
 * hero paints behind the panel rather than after it lifts.
 */

/* 700ms nominal measured 876-971ms click→painted hero, over the 800ms
   gate: AnimatePresence's mount costs ~60ms before the cover even
   starts, and the destination still has to render. Trimmed to 540ms
   nominal, which leaves real headroom for the route's own paint. */
const COVER = 0.22;
const HOLD = 0.05;
const REVEAL = 0.22;

const NAMES: Record<string, string> = {
  "/": "Home",
  "/work": "Work",
  "/services": "Services",
  "/about": "About",
  "/contact": "Contact",
};

function labelFor(path: string): string {
  if (NAMES[path]) return NAMES[path];
  const m = path.match(/^\/work\/(.+)$/);
  if (m) {
    const entry = vault.find((v) => v.slug === m[1]);
    if (entry) return entry.name;
  }
  return "Averr";
}

export default function RouteWipe() {
  const navigate = useNavigate();
  const location = useLocation();
  const reduce = useReducedMotion();
  const [covering, setCovering] = useState(false);
  const [idle, setIdle] = useState(true);
  const [label, setLabel] = useState("");
  const [announce, setAnnounce] = useState("");
  const pending = useRef<string | null>(null);
  const armed = useRef(false);

  /* ── intercept in-site navigation ──────────────────────────────── */
  useEffect(
    function listen() {
      function onClick(e: MouseEvent) {
        if (reduce) return;
        if (e.defaultPrevented || e.button !== 0) return;
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

        const a = (e.target as HTMLElement | null)?.closest?.("a");
        if (!a) return;
        if (a.hasAttribute("data-no-wipe")) return;
        if (a.target && a.target !== "_self") return;
        if (a.hasAttribute("download")) return;

        const href = a.getAttribute("href") || "";
        if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) return;

        let url: URL;
        try {
          url = new URL(a.href, window.location.href);
        } catch {
          return;
        }
        if (url.origin !== window.location.origin) return;

        // /work → a case study keeps its own clone-expand transition
        // (components/work/OpenTransition.tsx). That one is triggered
        // from the link's own onClick, and a capture-phase listener
        // here would preempt it.
        if (window.location.pathname === "/work" && /^\/work\/.+/.test(url.pathname)) return;
        // a hash on the page we are already on is not a navigation
        if (url.pathname === window.location.pathname && url.hash) return;
        if (url.pathname === window.location.pathname && url.search === window.location.search) return;

        e.preventDefault();
        const to = url.pathname + url.search + url.hash;
        prefetchRoute(url.pathname);
        pending.current = to;
        setLabel(labelFor(url.pathname));
        armed.current = true;
        setIdle(false);
        setCovering(true);
      }

      document.addEventListener("click", onClick, true);
      return function off() {
        document.removeEventListener("click", onClick, true);
      };
    },
    [reduce]
  );

  /* ── navigate once the panel is covering ───────────────────────── */
  const onCovered = useCallback(
    function covered() {
      // fires at the end of both legs; only the cover leg navigates
      const to = pending.current;
      if (!to) return;
      pending.current = null;
      navigate(to);
    },
    [navigate]
  );

  /* ── after the route changes, lift and hand over ───────────────── */
  useEffect(
    function lift() {
      if (!armed.current) return;
      armed.current = false;
      setCovering(false);
      setAnnounce(labelFor(location.pathname));
      // back to inert once the reveal has run
      const hide = window.setTimeout(() => setIdle(true), (HOLD + REVEAL + 0.02) * 1000);

      // focus the new page's heading, so a keyboard reader lands on the
      // page rather than back at the top of the document
      const t = window.setTimeout(function moveFocus() {
        const h =
          document.querySelector<HTMLElement>("main h1") ||
          document.querySelector<HTMLElement>("main h2");
        if (h) {
          h.setAttribute("tabindex", "-1");
          h.focus({ preventScroll: true });
        }
      }, (REVEAL + 0.05) * 1000);
      return function clear() {
        window.clearTimeout(t);
        window.clearTimeout(hide);
      };
    },
    [location.pathname, location.search]
  );

  return (
    <>
      {/* what a screen reader is told, whatever the panel is doing */}
      <div aria-live="polite" className="sr-only">
        {announce ? `${announce} — page loaded` : ""}
      </div>

      {/* ALWAYS MOUNTED. Mounting it on click cost ~60ms before the
          cover could even start, which the 800ms click-to-hero budget
          could not absorb. It sits inert at inset(100%) instead. */}
      <motion.div
        className="rw"
        aria-hidden="true"
        initial={false}
        animate={{
          clipPath: covering ? "inset(0% 0 0 0)" : "inset(100% 0 0 0)",
        }}
        transition={
          covering
            ? { duration: COVER, ease: ease.inOut }
            : { duration: REVEAL, ease: ease.inOut, delay: HOLD }
        }
        onAnimationComplete={onCovered}
        style={{ pointerEvents: "none", visibility: idle ? "hidden" : "visible" }}
      >
        <motion.span
          className="rw-name type-display-l"
          initial={false}
          animate={{ opacity: covering ? 1 : 0, y: covering ? 0 : 8 }}
          transition={{ duration: 0.18, ease: ease.outQuart, delay: covering ? 0.08 : 0 }}
        >
          {label}
        </motion.span>
      </motion.div>

      <style>{`
        .rw {
          position: fixed; inset: 0; z-index: 90;
          background: var(--color-dark);
          display: grid; place-items: center;
          pointer-events: none;
        }
        .rw-name { color: var(--color-parch); }
      `}</style>
    </>
  );
}
