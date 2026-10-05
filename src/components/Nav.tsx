import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { prefetchRoute } from "../lib/prefetchRoute";
import {
  AnimatePresence,
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "motion/react";
import { List, X } from "@phosphor-icons/react";
import { duration, ease } from "../lib/motion";
import Icon from "./icons/Icon";
import MagneticCTA from "./MagneticCTA";
import AverrMark from "./AverrMark";
import { caseStudies } from "../data/caseStudies";
import { useNavDarkOverride } from "../lib/navTone";

const LINKS = [
  { label: "Work", to: "/work" },
  { label: "Services", to: "/services" },
  { label: "About", to: "/about" },
];

const EMAIL = "prachets@averrstudios.com";

/** Live case studies, counted from the data rather than hardcoded. */
const WORK_COUNT = Object.values(caseStudies).filter(
  function isLive(study) {
    return study.status === "live";
  }
).length;
const MENU_ID = "mobile-nav";
const MOBILE_QUERY = "(max-width: 767px)";

const FOCUSABLE =
  'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

/** True below 768px. Drives which header controls render and force-closes the
 *  overlay when the viewport grows past the breakpoint. */
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(function readInitial() {
    return window.matchMedia(MOBILE_QUERY).matches;
  });

  useEffect(function watchBreakpoint() {
    const mq = window.matchMedia(MOBILE_QUERY);
    function onChange(e: MediaQueryListEvent) {
      setIsMobile(e.matches);
    }
    setIsMobile(mq.matches);
    mq.addEventListener("change", onChange);
    return function cleanup() {
      mq.removeEventListener("change", onChange);
    };
  }, []);

  return isMobile;
}

/**
 * True when a dark surface sits under the nav's bottom edge.
 *
 * Shrinks the observer root to a 1px band at that edge and watches every
 * [data-tone="dark"] surface against it — no scroll handler, and it re-reads
 * targets on route change so newly mounted chapters are picked up.
 */
function useDarkUnderNav(pathname: string) {
  const navRef = useRef<HTMLElement | null>(null);
  const [darkCount, setDarkCount] = useState(0);

  useEffect(
    function observeSurfaces() {
      const nav = navRef.current;
      if (!nav || typeof IntersectionObserver === "undefined") return;

      let observer: IntersectionObserver | null = null;
      const intersecting = new Set<Element>();

      function build() {
        observer?.disconnect();
        intersecting.clear();
        setDarkCount(0);

        const navH = nav!.getBoundingClientRect().height || 88;
        const below = Math.max(0, window.innerHeight - navH - 1);

        observer = new IntersectionObserver(
          function onCross(entries) {
            for (const entry of entries) {
              if (entry.isIntersecting) intersecting.add(entry.target);
              else intersecting.delete(entry.target);
            }
            setDarkCount(intersecting.size);
          },
          { rootMargin: `-${navH}px 0px -${below}px 0px`, threshold: 0 }
        );

        for (const el of document.querySelectorAll("[data-tone='dark']")) {
          observer.observe(el);
        }
      }

      // let the route's surfaces mount first
      const raf = requestAnimationFrame(build);
      window.addEventListener("resize", build);
      return function cleanup() {
        cancelAnimationFrame(raf);
        window.removeEventListener("resize", build);
        observer?.disconnect();
      };
    },
    [pathname]
  );

  return { navRef, darkUnderNav: darkCount > 0 };
}

/** Case-study routes (/work/:slug) mark Work as current. */
function isCurrent(pathname: string, to: string) {
  if (to === "/") return pathname === "/";
  return pathname === to || pathname.startsWith(to + "/");
}

function DesktopLink({
  to,
  label,
  current,
  reduce,
  count,
  dark,
}: {
  to: string;
  label: string;
  current: boolean;
  reduce: boolean;
  dark: boolean;
  /** Superscript tally. aria-hidden, so the accessible name stays the label. */
  count?: number;
}) {
  const [active, setActive] = useState(false);
  const lit = current || active;

  return (
    <Link
      to={to}
      aria-current={current ? "page" : undefined}
      onMouseEnter={function enter() {
        setActive(true);
        prefetchRoute(to);
      }}
      onMouseLeave={function leave() {
        setActive(false);
      }}
      onFocus={function focus(e) {
        if (e.currentTarget.matches(":focus-visible")) setActive(true);
        prefetchRoute(to);
      }}
      onBlur={function blur() {
        setActive(false);
      }}
      className="type-body"
      style={{
        position: "relative",
        display: "inline-block",
        fontWeight: 500,
        color: dark ? "var(--color-parch)" : "var(--color-ink)",
        opacity: lit ? 1 : 0.72,
        textDecoration: "none",
        transition: `opacity ${duration.base * 1000}ms cubic-bezier(${ease.outQuart.join(",")}), color ${duration.base * 1000}ms cubic-bezier(${ease.inOut.join(",")})`,
      }}
    >
      {label}
      {typeof count === "number" ? (
        <span
          aria-hidden
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "var(--type-eyebrow-size)",
            letterSpacing: "var(--type-eyebrow-tracking)",
            verticalAlign: "super",
            lineHeight: 1,
            marginLeft: 3,
            opacity: 0.5,
          }}
        >
          {count}
        </span>
      ) : null}
      <span
        aria-hidden
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: -4,
          height: 1,
          background: "currentColor",
          transform: lit ? "scaleX(1)" : "scaleX(0)",
          transformOrigin: "left",
          transition: reduce
            ? "none"
            : `transform ${(lit ? duration.base : duration.fast) * 1000}ms cubic-bezier(${ease.outQuart.join(",")})`,
          pointerEvents: "none",
        }}
      />
    </Link>
  );
}

export default function Nav() {
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const { pathname } = useLocation();
  const isMobile = useIsMobile();

  const { navRef, darkUnderNav } = useDarkUnderNav(pathname);
  const heroDark = useNavDarkOverride();
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  // The mobile overlay paints its own dark ground and already styles the bar.
  const navDark = (darkUnderNav || heroDark) && !open;
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const hasOpened = useRef(false);

  const close = useCallback(function closeMenu() {
    setOpen(false);
  }, []);

  // At scroll 0 → transparent, at scroll 80 → cream 90%
  const bg = useTransform(
    scrollY,
    [0, 80],
    ["rgba(244, 240, 230, 0)", "rgba(244, 240, 230, 0.9)"]
  );
  const blur = useTransform(
    scrollY,
    [0, 80],
    ["blur(0px) saturate(1)", "blur(12px) saturate(1.4)"]
  );
  const borderColor = useTransform(
    scrollY,
    [80, 120],
    ["rgba(20, 20, 18, 0)", "rgba(20, 20, 18, 0.10)"]
  );
  const paddingY = useTransform(scrollY, [0, 80], [24, 16]);

  // Close on route change.
  useEffect(
    function closeOnNavigate() {
      setOpen(false);
    },
    [pathname]
  );

  // Close once the viewport reaches the desktop breakpoint.
  useEffect(
    function closeOnDesktop() {
      if (!isMobile) setOpen(false);
    },
    [isMobile]
  );

  // Lock body scroll while the overlay is up.
  useEffect(
    function lockBodyScroll() {
      if (!open) return;
      const previous = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return function restore() {
        document.body.style.overflow = previous;
      };
    },
    [open]
  );

  // Esc closes; Tab cycles inside the overlay (the toggle is part of the ring,
  // since when open it is the close control).
  useEffect(
    function trapFocus() {
      if (!open) return;

      function onKeyDown(e: KeyboardEvent) {
        if (e.key === "Escape") {
          e.preventDefault();
          close();
          return;
        }
        if (e.key !== "Tab") return;

        const node = overlayRef.current;
        if (!node) return;
        const ring: HTMLElement[] = [];
        if (buttonRef.current) ring.push(buttonRef.current);
        ring.push(...Array.from(node.querySelectorAll<HTMLElement>(FOCUSABLE)));
        if (ring.length === 0) return;

        const first = ring[0];
        const last = ring[ring.length - 1];
        const active = document.activeElement;
        const inside = ring.includes(active as HTMLElement);

        if (e.shiftKey && (active === first || !inside)) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && (active === last || !inside)) {
          e.preventDefault();
          first.focus();
        }
      }

      document.addEventListener("keydown", onKeyDown);
      return function cleanup() {
        document.removeEventListener("keydown", onKeyDown);
      };
    },
    [open, close]
  );

  // Move focus into the overlay on open, once the reveal has started.
  useEffect(
    function focusFirstItem() {
      if (!open) return;
      const id = window.setTimeout(
        function focusIn() {
          overlayRef.current?.querySelector<HTMLElement>("a[href]")?.focus();
        },
        reduce ? 0 : 160
      );
      return function cleanup() {
        window.clearTimeout(id);
      };
    },
    [open, reduce]
  );

  // Return focus to the toggle after the overlay closes.
  useEffect(
    function returnFocus() {
      if (open) {
        hasOpened.current = true;
        return;
      }
      if (!hasOpened.current) return;
      hasOpened.current = false;
      if (isMobile) buttonRef.current?.focus();
    },
    [open, isMobile]
  );

  const navStyle: React.CSSProperties = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    // Lifted above the overlay only while open, so the toggle stays reachable
    // and the ScrollProgress bar (z 100) keeps its normal stacking otherwise.
    zIndex: open ? 120 : 50,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    paddingLeft: isMobile ? 20 : 40,
    paddingRight: isMobile ? 20 : 40,
  };

  const brandStyle: React.CSSProperties = {
    fontFamily: "Geist, system-ui, sans-serif",
    fontWeight: 500,
    fontSize: "15px",
    letterSpacing: "-0.015em",
    color: open || navDark ? "var(--color-parch)" : "var(--color-ink)",
    textDecoration: "none",
    transition: `color ${duration.base * 1000}ms cubic-bezier(${ease.inOut.join(",")})`,
  };

  const linksWrapStyle: React.CSSProperties = {
    display: "flex",
    gap: "32px",
    listStyle: "none",
    margin: 0,
    padding: 0,
  };

  const barTransition = `background-color ${duration.base * 1000}ms cubic-bezier(${ease.inOut.join(",")}), border-color ${duration.base * 1000}ms cubic-bezier(${ease.inOut.join(",")})`;

  // While open the bar itself must read as part of the dark overlay.
  const barSurface = open
    ? {
        backgroundColor: "transparent",
        backdropFilter: "none",
        WebkitBackdropFilter: "none",
        borderBottomColor: "transparent",
      }
    : navDark
    ? {
        backgroundColor: "rgba(20, 20, 18, 0.72)",
        backdropFilter: "blur(12px) saturate(1.4)",
        WebkitBackdropFilter: "blur(12px) saturate(1.4)",
        borderBottomColor: "rgba(237, 233, 226, 0.08)",
      }
    : {
        backgroundColor: reduce ? "rgba(244, 240, 230, 0.88)" : bg,
        backdropFilter: reduce ? "blur(12px) saturate(1.4)" : blur,
        WebkitBackdropFilter: reduce ? "blur(12px) saturate(1.4)" : blur,
        borderBottomColor: reduce ? "rgba(20, 20, 18, 0.10)" : borderColor,
      };

  const overlayVariants = reduce
    ? {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0 } },
        exit: { opacity: 0, transition: { duration: 0 } },
      }
    : {
        hidden: { opacity: 0, clipPath: "inset(0% 0% 100% 0%)" },
        visible: {
          opacity: 1,
          clipPath: "inset(0% 0% 0% 0%)",
          transition: { duration: duration.base, ease: ease.outExpo },
        },
        exit: {
          opacity: 0,
          clipPath: "inset(0% 0% 100% 0%)",
          transition: { duration: duration.fast, ease: ease.outExpo },
        },
      };

  const listVariants = reduce
    ? { hidden: {}, visible: {} }
    : {
        hidden: {},
        visible: { transition: { delayChildren: 0.12, staggerChildren: 0.06 } },
      };

  const itemVariants = reduce
    ? { hidden: { opacity: 1, y: 0 }, visible: { opacity: 1, y: 0 } }
    : {
        hidden: { opacity: 0, y: 24 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: duration.base, ease: ease.outExpo },
        },
      };

  return (
    <>
      <motion.nav
        ref={navRef as React.Ref<HTMLElement>}
        aria-label="Primary"
        initial={{ opacity: reduce ? 1 : 0, y: reduce ? 0 : -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: reduce ? 0.01 : 0.4,
          ease: ease.outQuart,
          delay: reduce ? 0 : 0.1,
        }}
        style={{
          ...navStyle,
          paddingTop: reduce ? 16 : paddingY,
          paddingBottom: reduce ? 16 : paddingY,
          borderBottom: "1px solid",
          transition: reduce ? "none" : barTransition,
          ...barSurface,
        }}
      >
        <Link to="/" style={brandStyle} aria-label="Averr Studios — home">
          <AverrMark variant="nav" tone={open || navDark ? "dark" : "light"} />
        </Link>

        {isMobile ? (
          <button
            ref={buttonRef}
            type="button"
            onClick={function toggleMenu() {
              setOpen(function flip(v) {
                return !v;
              });
            }}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls={MENU_ID}
            style={{
              width: 44,
              height: 44,
              margin: -10,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              background: "transparent",
              border: "none",
              padding: 0,
              cursor: "pointer",
              color: open || navDark ? "var(--color-parch)" : "var(--color-ink)",
              transition: `color ${duration.base * 1000}ms cubic-bezier(${ease.inOut.join(",")})`,
            }}
          >
            <Icon glyph={open ? X : List} size="lg" />
          </button>
        ) : (
          <>
            <ul style={linksWrapStyle}>
              {LINKS.map(function renderLink(link) {
                return (
                  <li key={link.to}>
                    <DesktopLink
                      to={link.to}
                      label={link.label}
                      current={isCurrent(pathname, link.to)}
                      reduce={!!reduce}
                      dark={navDark}
                      count={link.to === "/work" ? WORK_COUNT : undefined}
                    />
                  </li>
                );
              })}
            </ul>
            <MagneticCTA
              to="/contact"
              variant="primary"
              size="sm"
              icon={null}
              tone={navDark ? "dark" : "light"}
            >
              Book a call
            </MagneticCTA>
          </>
        )}
      </motion.nav>

      <AnimatePresence>
        {open && isMobile ? (
          <motion.div
            id={MENU_ID}
            ref={overlayRef}
            key="mobile-nav"
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 110,
              backgroundColor: "var(--color-dark)",
              color: "var(--color-parch)",
              display: "flex",
              flexDirection: "column",
              paddingTop: "calc(env(safe-area-inset-top, 0px) + 104px)",
              paddingRight: "calc(env(safe-area-inset-right, 0px) + 20px)",
              paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 32px)",
              paddingLeft: "calc(env(safe-area-inset-left, 0px) + 20px)",
            }}
          >
            <motion.ul
              variants={listVariants}
              initial="hidden"
              animate="visible"
              style={{
                listStyle: "none",
                margin: 0,
                padding: 0,
                display: "flex",
                flexDirection: "column",
                gap: 8,
                textAlign: "left",
              }}
            >
              {LINKS.map(function renderMobileLink(link) {
                const current = pathname === link.to;
                return (
                  <motion.li key={link.to} variants={itemVariants}>
                    <Link
                      to={link.to}
                      aria-current={current ? "page" : undefined}
                      onFocus={function warm() {
                        prefetchRoute(link.to);
                      }}
                      onTouchStart={function warm() {
                        prefetchRoute(link.to);
                      }}
                      className="type-display-l"
                      style={{
                        display: "block",
                        color: "var(--color-parch)",
                        opacity: current ? 1 : 0.7,
                        textDecoration: "none",
                      }}
                    >
                      {link.label}
                    </Link>
                  </motion.li>
                );
              })}
            </motion.ul>

            <motion.div
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              transition={
                reduce
                  ? { duration: 0 }
                  : {
                      duration: duration.base,
                      ease: ease.outExpo,
                      delay: 0.12 + LINKS.length * 0.06,
                    }
              }
              style={{ marginTop: "auto", paddingTop: 48 }}
            >
              <MagneticCTA to="/contact" variant="primary" tone="dark">
                Book a call
              </MagneticCTA>
              <a
                href={`mailto:${EMAIL}`}
                className="type-small"
                style={{
                  display: "inline-block",
                  marginTop: 20,
                  color: "var(--color-muted-l)",
                  textDecoration: "none",
                }}
              >
                {EMAIL}
              </a>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
