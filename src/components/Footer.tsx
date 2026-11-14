import MagneticCTA from "./MagneticCTA";
import { analyticsOn, openConsent } from "../lib/analytics";
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
                {/* "same-day" contradicted the promise Contact and About
                    both make; the footer now says the same thing they do. */}
                <span>Replies within 24 hours.</span>
                <TorontoClock style={{ color: "rgba(255,255,255,0.82)" }} />
              </div>
            </div>
          </nav>
        </div>

        <div className="nf-bottom">
          <span>© {YEAR} Averr Studios · Toronto</span>
          {/* a plain anchor, like every other internal link in this
              footer — not a router <Link>, so the one odd one out does
              not become the pattern someone copies next. */}
          <span className="nf-small">
            <a href="/privacy">Privacy</a>
            {analyticsOn() && (
              <>
                <span aria-hidden="true">·</span>
                <button type="button" className="nf-ck" onClick={openConsent}>
                  Cookie settings
                </button>
              </>
            )}
            <span aria-hidden="true">·</span>
            <span>Toronto &amp; the GTA</span>
          </span>
        </div>
      </div>
    </footer>
  );
}
