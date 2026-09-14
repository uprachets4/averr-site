const STUDIO_LINKS = [
  { label: "Work", href: "/work" },
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
  { label: "Process", href: "/process" },
];

const RESOURCE_LINKS = [
  { label: "Writing", href: "/writing" },
  { label: "Book a call", href: "/contact" },
];

const CONTACT_LINKS = [
  { label: "prachets@averrstudios.com", href: "mailto:prachets@averrstudios.com" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/prachetsupadhyay" },
  { label: "Instagram", href: "https://www.instagram.com/averrstudios" },
];

const LEGAL_LINKS = [
  { label: "Privacy", href: "/privacy" },
  { label: "Cookies", href: "/cookies" },
  { label: "Terms", href: "/terms" },
];

const YEAR = new Date().getFullYear();

export default function Footer() {
  return (
    <footer
      style={{
        padding: "60px 40px 40px",
        borderTop: "1px solid rgba(20,20,18,0.10)",
        backgroundColor: "var(--color-bg-alt)",
        fontFamily: "var(--font-body)",
        fontSize: 13,
        color: "var(--color-muted)",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "2fr 1fr 1fr 1fr",
          gap: 40,
        }}
        className="footer-grid"
      >
        {/* Brand column */}
        <div>
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 18,
              fontWeight: 500,
              color: "var(--color-ink)",
              marginBottom: 12,
              letterSpacing: "-0.015em",
            }}
          >
            Averr Studios
          </div>
          <div
            style={{
              maxWidth: 320,
              lineHeight: 1.55,
              color: "var(--color-muted)",
            }}
          >
            A boutique design studio in Toronto. Building the websites,
            AI systems, and marketing engines for businesses that expect craft.
          </div>
        </div>

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
          fontSize: 12,
          color: "var(--color-muted-2)",
        }}
      >
        <div>© {YEAR} Averr Studios · Toronto</div>
        <div style={{ display: "flex", gap: 16 }}>
          {LEGAL_LINKS.map((link, i) => (
            <a
              key={link.label}
              href={link.href}
              style={{ color: "inherit", textDecoration: "none" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "var(--color-ink)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "var(--color-muted-2)";
              }}
            >
              {link.label}
              {i < LEGAL_LINKS.length - 1 && (
                <span style={{ marginLeft: 16, color: "var(--color-muted-2)" }}>·</span>
              )}
            </a>
          ))}
        </div>
      </div>

      {/* Responsive: collapse to 2 columns on mobile */}
      <style>{`
        @media (max-width: 700px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr !important;
          }
        }
      `}</style>
    </footer>
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
