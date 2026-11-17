import { useState } from "react";
import { CONTACT_EMAIL } from "../../../data/servicesBuild";
import { WEBSITES_FAQ } from "../../../data/serviceWebsites";

/**
 * The questions people ask about a website specifically — this page's
 * own six, which deliberately do not repeat the six on /services. Two
 * pages answering the same question in FAQPage schema compete for one
 * rich result instead of winning two.
 *
 * Same disclosure pattern as /services (a button per question carrying
 * `aria-expanded` and `aria-controls`, a region per answer labelled by
 * its button, opening on `grid-template-rows: 0fr → 1fr`), with its own
 * id prefix so the two sets can never collide.
 */
export default function Questions() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="sec gut" aria-labelledby="wfh" style={{ paddingTop: 0 }}>
      <div className="wrap">
        <span className="eyebrow reveal">Questions</span>
        <h2 id="wfh" className="reveal" style={{ marginTop: 18 }}>
          What people ask about a website.
        </h2>

        <div className="faq">
          {WEBSITES_FAQ.map(function question(item, i) {
            const on = open === i;
            return (
              <div className={`qa${on ? " open" : ""}`} key={item.q}>
                <button
                  type="button"
                  aria-expanded={on}
                  aria-controls={`wa${i}`}
                  id={`wq${i}b`}
                  onClick={() => setOpen(on ? null : i)}
                >
                  {item.q}
                  <i aria-hidden="true" />
                </button>
                <div className="ans" id={`wa${i}`} role="region" aria-labelledby={`wq${i}b`}>
                  <div>
                    <p>{item.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <p className="faqfoot">
          Something not answered here?{" "}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
        </p>
      </div>
    </section>
  );
}
