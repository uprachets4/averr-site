import { useState } from "react";
import { CONTACT_EMAIL, FAQ } from "../../../data/servicesBuild";

/**
 * The six questions, as a real disclosure list: a button per question
 * carrying `aria-expanded` and `aria-controls`, and a region per
 * answer labelled by its button.
 *
 * The answer opens on `grid-template-rows: 0fr → 1fr`, which animates
 * to the content's own height without anyone measuring it and without
 * animating a layout property that would reflow the page.
 */
export default function Questions() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="sec gut" aria-labelledby="fh" style={{ paddingTop: 0 }}>
      <div className="wrap">
        <span className="eyebrow reveal">Questions</span>
        <h2 id="fh" className="reveal" style={{ marginTop: 18 }}>
          What people ask before the call.
        </h2>

        <div className="faq">
          {FAQ.map(function question(item, i) {
            const on = open === i;
            return (
              <div className={`qa${on ? " open" : ""}`} key={item.q}>
                <button
                  type="button"
                  aria-expanded={on}
                  aria-controls={`a${i}`}
                  id={`q${i}b`}
                  onClick={() => setOpen(on ? null : i)}
                >
                  {item.q}
                  <i aria-hidden="true" />
                </button>
                <div className="ans" id={`a${i}`} role="region" aria-labelledby={`q${i}b`}>
                  <div>
                    <p>{item.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <p className="faqfoot">
          Still wondering about something?{" "}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
        </p>
      </div>
    </section>
  );
}
