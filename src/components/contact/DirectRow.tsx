import { EMAIL_ADDR, LINKEDIN_LABEL, LINKEDIN_URL, RESPONSE_TIME, SERVICE_AREA } from "./briefCopy";

/**
 * "The other three ways." — the same items, plus the two facts a
 * visitor actually asks for next.
 *
 * Service area is surfaced by the 19 ruling; its source is the site's
 * meta description ("across the GTA"). The response time is the dark
 * band's own "24 hours". There is no phone number anywhere on the
 * site, so none is invented here.
 */
export default function DirectRow() {
  const items: { k: string; v: string; href?: string }[] = [
    { k: "Email", v: EMAIL_ADDR, href: `mailto:${EMAIL_ADDR}` },
    { k: "LinkedIn", v: LINKEDIN_LABEL, href: LINKEDIN_URL },
    { k: "Service area", v: SERVICE_AREA },
    { k: "Response time", v: `Within ${RESPONSE_TIME}` },
  ];

  return (
    <div className="dr">
      {items.map((it) => (
        <div key={it.k} className="dr-cell">
          <span className="dr-k">{it.k}</span>
          {it.href ? (
            <a
              className="dr-v dr-link"
              href={it.href}
              {...(it.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            >
              {it.v}
            </a>
          ) : (
            <span className="dr-v">{it.v}</span>
          )}
        </div>
      ))}
      <style>{`
        .dr {
          max-width: var(--container-wide); margin: 0 auto;
          display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 1px;
          background: rgba(20,20,18,0.12);
          border: 1px solid rgba(20,20,18,0.12); border-radius: 12px; overflow: hidden;
        }
        .dr-cell {
          background: var(--color-bg); padding: 22px 22px 24px;
          display: flex; flex-direction: column; gap: 9px; min-width: 0;
        }
        .dr-k {
          font-family: var(--font-mono); font-size: 13px; letter-spacing: 0.09em;
          text-transform: uppercase; color: var(--color-muted);
        }
        .dr-v { font-size: 15px; color: var(--color-ink); overflow-wrap: anywhere; }
        .dr-link { text-decoration: underline; text-underline-offset: 3px; min-height: 44px; display: flex; align-items: center; }
        .dr-link:hover { color: var(--color-ink); }
        @media (max-width: 1023px) {
          .dr { grid-template-columns: 1fr 1fr; }
        }
        @media (max-width: 560px) {
          .dr { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
