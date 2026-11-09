import { EMAIL_ADDR } from "../../../data/contactBrief";
import { useReveal } from "./useReveal";

/** The last row: email, LinkedIn, where, and how fast. */
export default function OtherWays() {
  const reveal = useReveal<HTMLDivElement>();

  return (
    <section className="ways gut" aria-label="Other ways to reach me">
      <div className={`wrap waysrow ${reveal.cls}`} ref={reveal.ref}>
        <a href={`mailto:${EMAIL_ADDR}`}>
          <span>Email</span>
          <b>{EMAIL_ADDR}</b>
        </a>
        <a
          href="https://www.linkedin.com/in/prachetsupadhyay"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn, opens in a new tab"
        >
          <span>LinkedIn</span>
          <b>in/prachetsupadhyay ↗</b>
        </a>
        <div>
          <span>Based</span>
          <b>Toronto &amp; the GTA</b>
        </div>
        <div>
          <span>Replies</span>
          <b>Within 24 hours</b>
        </div>
      </div>
    </section>
  );
}
