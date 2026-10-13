import MagneticCTA from "./MagneticCTA";
import TorontoClock from "./TorontoClock";

const STUDIO_LINKS = [
  { label: "Work", href: "/work" },
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const CONTACT_LINKS = [
  { label: "prachets@averrstudios.com", href: "mailto:prachets@averrstudios.com" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/prachetsupadhyay" },
  { label: "Instagram", href: "https://www.instagram.com/averrstudios" },
];

const YEAR = new Date().getFullYear();

export default function Footer() {
  /* Session 27c: the navy footer, site-wide. It replaces the
     giant-wordmark footer and the per-route tone switch — the Nolana
     system has one footer and it is dark everywhere. */
  return (
    <footer className="nf">
      <div className="nf-inner">
        <div className="nf-top">
          <div className="nf-brand">
            <span className="nf-mark">Averr</span>
            <p className="nf-say">
              Websites, software and AI for businesses across the GTA.
            </p>
            <p className="nf-mail">
              <a href="mailto:prachets@averrstudios.com">prachets@averrstudios.com</a>
            </p>
          </div>

          <nav className="nf-cols" aria-label="Footer">
            <div>
              <h2 className="nf-ct">Studio</h2>
              <ul>
                {STUDIO_LINKS.map(function l(x) {
                  return (
                    <li key={x.label}>
                      <a href={x.href}>{x.label}</a>
                    </li>
                  );
                })}
              </ul>
            </div>
            <div>
              <h2 className="nf-ct">Contact</h2>
              <ul>
                {CONTACT_LINKS.map(function l(x) {
                  return (
                    <li key={x.label}>
                      <a
                        href={x.href}
                        target={x.href.startsWith("http") ? "_blank" : undefined}
                        rel={x.href.startsWith("http") ? "noopener noreferrer" : undefined}
                      >
                        {x.label}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
            <div className="nf-act">
              <MagneticCTA to="/contact" variant="primary" tone="dark">
                Start a project
              </MagneticCTA>
              <div className="nf-now">
                <span>Currently answering: same-day.</span>
                <TorontoClock style={{ color: "rgba(255,255,255,0.82)" }} />
              </div>
            </div>
          </nav>
        </div>

        <div className="nf-bottom">
          <span>© {YEAR} Averr Studios · Toronto</span>
          <span>Toronto &amp; the GTA</span>
        </div>
      </div>
    </footer>
  );
}
