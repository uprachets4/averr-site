import FooterMark from "./FooterMark";
import MagneticCTA from "./MagneticCTA";
import TorontoClock from "./TorontoClock";
import Chapter from "./Chapter";
import { usePageEndTone } from "../lib/pageTone";

const STUDIO_LINKS = [
  { label: "Work", href: "/work" },
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
  { label: "Process", href: "/about#process" },
];

const RESOURCE_LINKS = [
  { label: "Book a call", href: "/contact" },
];

const CONTACT_LINKS = [
  { label: "prachets@averrstudios.com", href: "mailto:prachets@averrstudios.com" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/prachetsupadhyay" },
  { label: "Instagram", href: "https://www.instagram.com/averrstudios" },
];

const YEAR = new Date().getFullYear();

export default function Footer() {
  // Only a dark closing band is a boundary worth revealing. Every other route
  // ends on a cream surface, and cream→cream-alt is not a tone change — so we
  // collapse it to the footer's own tone and Chapter renders flat, with no
  // scroll listener at all.
  //
  // Session 25: the footer takes the tone of the page it closes. Home is one
  // continuous dark colour flow, and a cream-alt footer ended it with a
  // full-viewport cream slab — measured mean luminance 204.6 against the
  // page's own 29-71. A page that already ends dark now keeps its ground all
  // the way down; the cream routes are untouched and still get the cream
  // footer, so this carries no half-migrated look.
  const endTone = usePageEndTone();
  const onDark = endTone === "dark";
  const tone = onDark ? "dark" : "cream-alt";

  return (
    <Chapter as="footer" tone={tone} from={tone} settle="end">
    <div
      data-ftone={onDark ? "dark" : undefined}
      style={{
        padding: "60px 40px 40px",
        borderTop: `1px solid ${onDark ? "rgba(237,233,226,0.14)" : "rgba(20,20,18,0.10)"}`,
        fontFamily: "var(--font-body)",
        fontSize: 14,
        color: onDark ? "var(--color-muted-l)" : "var(--color-muted)",
      }}
    >
      {/* ── the invitation, and what time it is here ── */}
      <div className="ft-top">
        <MagneticCTA to="/contact" variant="primary" tone={onDark ? "dark" : "light"}>
          Start a project
        </MagneticCTA>
        <div className="ft-now">
          <span>Currently answering: same-day, Toronto time.</span>
          <TorontoClock style={{ color: onDark ? "var(--color-parch)" : "var(--color-ink)" }} />
        </div>
      </div>

      {/* ── the wordmark the page rises into ── */}
      <div className="ft-wrap">
        <FooterMark />
      </div>

      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: 40,
        }}
        className="footer-grid"
      >
        {/* Studio column */}
        <FooterColumn title="Studio" links={STUDIO_LINKS} onDark={onDark} />

        {/* Resources column */}
        <FooterColumn title="Resources" links={RESOURCE_LINKS} onDark={onDark} />

        {/* Contact column */}
        <FooterColumn title="Contact" links={CONTACT_LINKS} external onDark={onDark} />
      </div>

      {/* Bottom bar */}
      <div
        style={{
          maxWidth: 1200,
          margin: "60px auto 0",
          paddingTop: 24,
          borderTop: `1px solid ${onDark ? "rgba(237,233,226,0.14)" : "rgba(20,20,18,0.10)"}`,
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 16,
          fontSize: 13,
          color: onDark ? "var(--color-muted-l)" : "var(--color-muted)",
        }}
      >
        <div>© {YEAR} Averr Studios · Toronto</div>
        <div>Toronto & the GTA</div>
      
      </div>

      {/* Responsive: collapse to 2 columns on mobile */}
      <style>{`
        @media (max-width: 700px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr !important;
          }
        }
      `}</style>
    </div>
      <style>{`
        .ft-top {
          max-width: 1200px; margin: 0 auto;
          display: flex; align-items: center; justify-content: space-between;
          gap: 24px; flex-wrap: wrap;
        }
        .ft-now {
          display: flex; align-items: baseline; gap: 14px; flex-wrap: wrap;
          font-size: 14px; color: var(--color-muted);
        }
        /* the wordmark fills with currentColor, so the tone flip is a colour */
        [data-ftone="dark"] .ft-now { color: var(--color-muted-l); }
        [data-ftone="dark"] .fm-word,
        [data-ftone="dark"] .fm-sig { color: var(--color-parch); }
        .ft-wrap { max-width: 1200px; margin: 0 auto; }
        @media (max-width: 760px) {
          .ft-top { flex-direction: column; align-items: flex-start; gap: 16px; }
        }
      `}</style>
    </Chapter>
  );
}

type FooterColumnProps = {
  title: string;
  links: { label: string; href: string }[];
  external?: boolean;
  onDark?: boolean;
};

function FooterColumn(props: FooterColumnProps) {
  const rest = props.onDark ? "rgba(237,233,226,0.78)" : "var(--color-ink-soft)";
  const hot = props.onDark ? "var(--color-parch)" : "var(--color-ink)";
  return (
    <div>
      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 12,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: props.onDark ? "rgba(237,233,226,0.6)" : "var(--color-muted-2)",
          marginBottom: 16,
        }}
      >
        {props.title}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {props.links.map((link) => (
          <a
            key={link.label}
            href={link.href}
            target={props.external ? "_blank" : undefined}
            rel={props.external ? "noopener noreferrer" : undefined}
            style={{
              color: rest,
              textDecoration: "none",
              transition: "color 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = hot;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = rest;
            }}
          >
            {link.label}
          </a>
        ))}
      </div>
    </div>
  );
}
