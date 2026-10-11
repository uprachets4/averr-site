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
  const endTone = usePageEndTone();
  const from = endTone === "dark" ? "dark" : "cream-alt";

  return (
    <Chapter as="footer" tone="cream-alt" from={from} settle="end">
    <div
      style={{
        padding: "60px 40px 40px",
        borderTop: "1px solid rgba(20,20,18,0.10)",
        fontFamily: "var(--font-body)",
        fontSize: 14,
        color: "var(--color-muted)",
      }}
    >
      {/* ── the invitation, and what time it is here ── */}
      <div className="ft-top">
        <MagneticCTA to="/contact" variant="primary">
          Start a project
        </MagneticCTA>
        <div className="ft-now">
          <span>Currently answering: same-day, Toronto time.</span>
          <TorontoClock style={{ color: "var(--color-ink)" }} />
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
        <FooterColumn title="Studio" links={STUDIO_LINKS} />

        {/* Resources column */}
        <FooterColumn title="Resources" links={RESOURCE_LINKS} />

        {/* Contact column */}
        <FooterColumn title="Contact" links={CONTACT_LINKS} external />
      </div>

      {/* Bottom bar */}
      <div
        style={{
          maxWidth: 1200,
          margin: "60px auto 0",
          paddingTop: 24,
          borderTop: "1px solid rgba(20,20,18,0.10)",
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 16,
          fontSize: 13,
          color: "var(--color-muted)",
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
};

function FooterColumn(props: FooterColumnProps) {
  return (
    <div>
      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 11,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: "var(--color-muted-2)",
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
              color: "var(--color-ink-soft)",
              textDecoration: "none",
              transition: "color 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "var(--color-ink)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "var(--color-ink-soft)";
            }}
          >
            {link.label}
          </a>
        ))}
      </div>
    </div>
  );
}
