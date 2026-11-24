import MagneticCTA from "./MagneticCTA";
import { analyticsOn, openConsent } from "../lib/analytics";
import TorontoClock from "./TorontoClock";

/* Guides sits between Services and About: the order is roughly what a
   visitor wants in the order they want it, and the section would
   otherwise be reachable only by typing the URL. The primary nav
   cannot take a fifth item — at 360px it has about 47px of room and
   this needs 65 — and turning that nav into a hamburger to fit one
   link is a worse trade than putting it here, where content hubs
   conventionally live anyway. */
const STUDIO_LINKS = [
  { label: "Work", href: "/work" },
  { label: "Services", href: "/services" },
  { label: "Guides", href: "/guides" },
  /* The free tool goes in the footer rather than the nav: it belongs to
     the same family as the guides, and a site-wide link is what stops it
     shipping orphaned the way /industries/contractors did. */
  { label: "Findability check", href: "/tools/findable" },
  { label: "About", href: "/about" },
  { label: "How we work", href: "/how-we-work" },
  { label: "Contact", href: "/contact" },
];

const CONTACT_LINKS = [
  { label: "prachets@averrstudios.com", href: "mailto:prachets@averrstudios.com" },
  { label: "+1 647-643-2496", href: "tel:+16476432496" },
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
            <span className="nf-mark" aria-label="Averr Studios">averr<i className="nf-dot" aria-hidden="true" /></span>
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
