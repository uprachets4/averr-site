import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDeclarePageEndTone } from "../lib/pageTone";
import { useSetNavDarkOverride } from "../lib/navTone";
import { useDocumentMeta, META } from "../lib/documentMeta";
import { CAL_FULL_URL } from "../components/contact/calConfig";
import "../components/card/card.css";

/**
 * averrstudios.com/prachets — the page the printed business card's QR
 * opens. Phone-first: save the contact in one tap, or book a call.
 * Wallet buttons join "Save contact" once the Apple/Google pass
 * accounts exist; until then nothing here pretends to offer them.
 */
const ROWS = [
  { k: "Email", v: "prachets@averrstudios.com", href: "mailto:prachets@averrstudios.com" },
  { k: "Phone", v: "+1 (647) 643-2496", href: "tel:+16476432496" },
  { k: "LinkedIn", v: "in/prachetsupadhyay", href: "https://www.linkedin.com/in/prachetsupadhyay", ext: true },
];

const SERVICES: Array<[string, string]> = [
  ["Websites", "#F9AF97"],
  ["Web Apps", "#D5818C"],
  ["AI Automation", "#9874E8"],
  ["Marketing", "#569AFA"],
];

export default function Prachets() {
  useDocumentMeta(META.card.title, META.card.description);
  useDeclarePageEndTone("dark");

  const setNavDark = useSetNavDarkOverride();
  useEffect(
    function navAlwaysDark() {
      setNavDark(true);
      return () => setNavDark(false);
    },
    [setNavDark]
  );

  return (
    <section className="pc" aria-labelledby="pc-name">
      <div className="pc-card">
        <header className="pc-head">
          <div className="pc-ring">
            <img src="/about/avatar.webp" alt="Prachets Upadhyay" width={112} height={112} />
          </div>
          <h1 id="pc-name">Prachets Upadhyay</h1>
          <p className="pc-role">Founder, Averr Studios · Toronto</p>
          <p className="pc-line">
            Websites, web apps, AI automation and marketing for businesses that want to be taken
            seriously.
          </p>
        </header>

        <div className="pc-actions">
          <a className="pc-save" href="/prachets.vcf" download="Prachets-Upadhyay.vcf">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <path d="M12 5v14M5 12h14" />
            </svg>
            Save contact
          </a>
          <a className="pc-book" href={CAL_FULL_URL} target="_blank" rel="noreferrer noopener">
            Book a discovery call →
          </a>
        </div>

        <ul className="pc-rows">
          {ROWS.map((r) => (
            <li key={r.k}>
              <a href={r.href} {...(r.ext ? { target: "_blank", rel: "noreferrer noopener" } : {})}>
                <span className="pc-k">{r.k}</span>
                <span className="pc-v">{r.v}</span>
              </a>
            </li>
          ))}
          <li>
            <Link to="/">
              <span className="pc-k">Studio</span>
              <span className="pc-v">averrstudios.com</span>
            </Link>
          </li>
        </ul>

        <ul className="pc-svcs" aria-label="Services">
          {SERVICES.map(([n, c]) => (
            <li key={n}>
              <i style={{ background: c }} aria-hidden="true" />
              {n}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
