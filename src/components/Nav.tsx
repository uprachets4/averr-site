import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const LINKS = [
  { label: "Work", to: "/work" },
  { label: "Services", to: "/services" },
  { label: "About", to: "/about" },
  { label: "Writing", to: "/writing" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(function attachScroll() {
    function onScroll() {
      setScrolled(window.scrollY >= 12);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return function cleanup() {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const navStyle = {
    position: "fixed" as const,
    top: 0,
    left: 0,
    right: 0,
    zIndex: 50,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: scrolled ? "12px 40px" : "18px 40px",
    backdropFilter: "blur(24px) saturate(1.4)",
    WebkitBackdropFilter: "blur(24px) saturate(1.4)",
    backgroundColor: scrolled
      ? "rgba(244, 240, 230, 0.88)"
      : "rgba(244, 240, 230, 0.68)",
    borderBottom: scrolled
      ? "1px solid rgba(20, 20, 18, 0.10)"
      : "1px solid rgba(20, 20, 18, 0)",
    transition: "all 300ms ease",
  };

  const brandStyle = {
    fontFamily: "Geist, system-ui, sans-serif",
    fontWeight: 500,
    fontSize: "15px",
    letterSpacing: "-0.015em",
    color: "var(--color-ink)",
    textDecoration: "none",
  };

  const linksWrapStyle = {
    display: "flex",
    gap: "32px",
    listStyle: "none",
    margin: 0,
    padding: 0,
  };

  const linkStyle = {
    fontFamily: "Inter, system-ui, sans-serif",
    fontSize: "13px",
    color: "var(--color-muted)",
    textDecoration: "none",
    transition: "color 300ms ease",
  };

  const ctaStyle = {
    padding: "9px 16px",
    backgroundColor: "var(--color-ink)",
    color: "var(--color-bg)",
    borderRadius: "999px",
    fontFamily: "Inter, system-ui, sans-serif",
    fontSize: "13px",
    fontWeight: 500,
    textDecoration: "none",
    transition: "background 250ms ease",
  };

  return (
    <nav aria-label="Primary" style={navStyle}>
      <Link to="/" style={brandStyle}>Averr Studios</Link>
      <ul style={linksWrapStyle}>
        {LINKS.map(function renderLink(link) {
          return (
            <li key={link.to}>
              <Link to={link.to} style={linkStyle}>{link.label}</Link>
            </li>
          );
        })}
      </ul>
      <a href="https://cal.com/prachets/discoverycall" target="_blank" rel="noopener noreferrer" style={ctaStyle}>Book a call</a>
    </nav>
  );
}
