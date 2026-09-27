import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
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

const LINKS = [
  { label: "Work", to: "/work" },
  { label: "Services", to: "/services" },
  { label: "About", to: "/about" },
];

const EMAIL = "prachets@averrstudios.com";
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

export default function Nav() {
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const { pathname } = useLocation();
  const isMobile = useIsMobile();

  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
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
    color: open ? "var(--color-parch)" : "var(--color-ink)",
    textDecoration: "none",
    transition: "color 200ms ease",
  };

  const linksWrapStyle: React.CSSProperties = {
    display: "flex",
    gap: "32px",
    listStyle: "none",
    margin: 0,
    padding: 0,
  };

  const linkStyle: React.CSSProperties = {
    fontFamily: "Inter, system-ui, sans-serif",
    fontSize: "13px",
    color: "var(--color-muted)",
    textDecoration: "none",
    transition: "color 300ms ease",
  };

  // While open the bar itself must read as part of the dark overlay.
  const barSurface = open
    ? {
        backgroundColor: "transparent",
        backdropFilter: "none",
        WebkitBackdropFilter: "none",
        borderBottomColor: "transparent",
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
          ...barSurface,
        }}
      >
        <Link to="/" style={brandStyle} aria-label="Averr Studios — home">
          <AverrMark variant="nav" />
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
              color: open ? "var(--color-parch)" : "var(--color-ink)",
              transition: "color 200ms ease",
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
                    <Link to={link.to} style={linkStyle}>
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
            <MagneticCTA to="/contact" variant="primary" size="sm" icon={null}>
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
              <div className="cta-on-dark" style={{ display: "flex" }}>
                <MagneticCTA to="/contact" variant="primary">
                  Book a call
                </MagneticCTA>
              </div>
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
