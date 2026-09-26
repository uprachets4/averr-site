import { Link } from "react-router-dom";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "motion/react";
import { ease } from "../lib/motion";
import MagneticCTA from "./MagneticCTA";
import AverrMark from "./AverrMark";

const LINKS = [
  { label: "Work", to: "/work" },
  { label: "Services", to: "/services" },
  { label: "About", to: "/about" },
];

export default function Nav() {
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();

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

  const navStyle: React.CSSProperties = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 50,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    paddingLeft: 40,
    paddingRight: 40,
    // motion values applied via motion.nav below
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

  return (
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
        backgroundColor: reduce ? "rgba(244, 240, 230, 0.88)" : bg,
        backdropFilter: reduce ? "blur(12px) saturate(1.4)" : blur,
        WebkitBackdropFilter: reduce ? "blur(12px) saturate(1.4)" : blur,
        borderBottom: "1px solid",
        borderBottomColor: reduce ? "rgba(20, 20, 18, 0.10)" : borderColor,
      }}
    >
      <Link to="/" style={brandStyle} aria-label="Averr Studios — home">
        <AverrMark variant="nav" />
      </Link>
      <ul style={linksWrapStyle}>
        {LINKS.map(function renderLink(link) {
          return (
            <li key={link.to}>
              <Link to={link.to} style={linkStyle}>{link.label}</Link>
            </li>
          );
        })}
      </ul>
      <MagneticCTA to="/contact" variant="primary" size="sm" icon={null}>
        Book a call
      </MagneticCTA>
    </motion.nav>
  );
}
