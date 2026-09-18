import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { ease } from "../lib/motion";
import MagneticCTA from "../components/MagneticCTA";
import Cal, { getCalApi } from "@calcom/embed-react";
import PillHl from "../components/PillHl";


const EMAIL_ADDR = "prachets@averrstudios.com";
const CAL_LINK = "prachets/discoverycall";
const CAL_FULL_URL = `https://cal.com/${CAL_LINK}`;

/* ═══════════════════════════════════════════════════════════════
   Shared: Magnetic CTA (external anchor variant only used here)
   ═══════════════════════════════════════════════════════════════ */


/* ═══════════════════════════════════════════════════════════════
   //_01 · START HERE
   ═══════════════════════════════════════════════════════════════ */

function StartHere() {
  const reduce = useReducedMotion();

  return (
    <section
      style={{
        position: "relative",
        overflow: "hidden",
        backgroundColor: "var(--color-bg)",
        padding: "180px 40px 80px",
      }}
    >
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 1400px 900px at 30% 20%, rgba(232,225,208,0.55), transparent 60%), radial-gradient(ellipse 1000px 700px at 80% 80%, rgba(232,225,208,0.35), transparent 60%)",
          pointerEvents: "none",
        }}
      />
      <div className="grain-light" aria-hidden="true" />

      <div style={{ position: "relative", zIndex: 2, maxWidth: 1200, margin: "0 auto" }}>
        <motion.div
          initial={{ opacity: 0, y: reduce ? 0 : 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduce ? 0.01 : 0.5, ease: ease.outQuart, delay: 0.2 }}
          className="type-eyebrow"
          style={{
            color: "var(--color-muted)",
            marginBottom: 32,
          }}
        >
          //_01 · start here
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: reduce ? 0 : 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduce ? 0.01 : 0.7, ease: ease.outQuart, delay: 0.3 }}
          className="type-display-xl"
          style={{
            color: "var(--color-ink)",
            marginBottom: 40,
            maxWidth: 1080,
          }}
        >
          Two ways in. Both go{" "}
          <motion.span
            initial={{ opacity: 0, scale: reduce ? 1 : 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: reduce ? 0.01 : 0.5, ease: ease.bounce, delay: 0.8 }}
            style={{ display: "inline-block" }}
          >
            <PillHl>straight to me</PillHl>
          </motion.span>.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: reduce ? 0 : 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduce ? 0.01 : 0.6, ease: ease.outQuart, delay: 1.1 }}
          style={{
            fontSize: 20,
            lineHeight: 1.55,
            color: "var(--color-muted)",
            maxWidth: 760,
          }}
        >
          No forms routed to a sales queue. No "we'll get back to you within
          3–5 business days." You reach me directly — usually within a few hours
          during Toronto business hours.
        </motion.p>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   //_02 · BOOK A CALL — copy left, Cal.com embed right
   ═══════════════════════════════════════════════════════════════ */

const CALL_ROWS = [
  {
    label: "// what we cover",
    body:
      "Your project, what's blocking it, rough shape of what a fit would look like.",
  },
  {
    label: "// what we don't",
    body:
      "Deep technical scoping, pricing, proposals — those come after this call if we decide to move forward.",
  },
  {
    label: "// what happens next",
    body:
      "If it's a fit, scoped proposal in 3 business days. If it isn't, an intro to someone who can help.",
  },
];

function BookACall() {
  const reduce = useReducedMotion();
  const [embedFailed, setEmbedFailed] = useState(false);

  useEffect(function initCal() {
    let cancelled = false;
    (async () => {
      try {
        const cal = await getCalApi();
        if (cancelled) return;
        cal("ui", {
          theme: "light",
          cssVarsPerTheme: {
            light: { "cal-brand": "#141412" },
            dark: { "cal-brand": "#F4F0E6" },
          },
          hideEventTypeDetails: false,
          layout: "month_view",
        });
      } catch {
        if (!cancelled) setEmbedFailed(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section
      style={{
        backgroundColor: "var(--color-bg-alt)",
        padding: "128px 40px",
        borderTop: "1px solid rgba(20,20,18,0.10)",
        position: "relative",
      }}
    >
      <div className="grain-light" aria-hidden="true" />
      <div
        style={{
          maxWidth: 1240,
          margin: "0 auto",
          position: "relative",
          zIndex: 2,
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: reduce ? 0 : 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: reduce ? 0.01 : 0.5, ease: ease.outQuart }}
          className="type-eyebrow"
          style={{
            color: "var(--color-muted)",
            marginBottom: 40,
          }}
        >
          //_02 · book a call
        </motion.div>

        <div
          className="book-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 56,
            alignItems: "start",
          }}
        >
          <div>
            <motion.h2
              initial={{ opacity: 0, y: reduce ? 0 : 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: reduce ? 0.01 : 0.7, ease: ease.outQuart }}
              className="type-h2"
              style={{
                color: "var(--color-ink)",
                marginBottom: 20,
              }}
            >
              20 minutes. <span className="fade-h">No slide deck.</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: reduce ? 0 : 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: reduce ? 0.01 : 0.6, ease: ease.outQuart, delay: 0.1 }}
              style={{
                fontSize: 17,
                lineHeight: 1.6,
                color: "var(--color-muted)",
                maxWidth: 520,
                marginBottom: 40,
              }}
            >
              We ask questions, you ask questions, both sides decide whether
              this is a fit. If it isn't, I'll tell you and refer you to someone
              who is.
            </motion.p>

            <div style={{ display: "flex", flexDirection: "column" }}>
              {CALL_ROWS.map((row, i) => (
                <motion.div
                  key={row.label}
                  initial={{ opacity: 0, y: reduce ? 0 : 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{
                    duration: reduce ? 0.01 : 0.55,
                    ease: ease.outQuart,
                    delay: reduce ? 0 : 0.15 + i * 0.08,
                  }}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "180px 1fr",
                    gap: 24,
                    alignItems: "start",
                    padding: "18px 0",
                    borderTop: "1px solid rgba(20,20,18,0.10)",
                    borderBottom:
                      i === CALL_ROWS.length - 1
                        ? "1px solid rgba(20,20,18,0.10)"
                        : "none",
                  }}
                  className="call-row"
                >
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 11,
                      letterSpacing: "0.14em",
                      color: "var(--color-muted-2)",
                      textTransform: "lowercase",
                      paddingTop: 4,
                    }}
                  >
                    {row.label}
                  </span>
                  <span
                    style={{
                      fontSize: 15,
                      lineHeight: 1.6,
                      color: "var(--color-ink-soft)",
                    }}
                  >
                    {row.body}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: reduce ? 0 : 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: reduce ? 0.01 : 0.7, ease: ease.outQuart, delay: 0.2 }}
            style={{
              background: "var(--color-bg)",
              border: "1px solid rgba(20,20,18,0.10)",
              borderRadius: 6,
              overflow: "hidden",
              minHeight: 640,
              display: "flex",
              flexDirection: "column",
            }}
          >
            {embedFailed ? (
              <div
                style={{
                  padding: "56px 40px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 20,
                  alignItems: "flex-start",
                }}
              >
                <div
                  className="type-eyebrow"
                  style={{
                    color: "var(--color-muted-2)",
                  }}
                >
                  Booking calendar
                </div>
                <h3
                  className="type-h3"
                  style={{
                    color: "var(--color-ink)",
                  }}
                >
                  Cal.com widget failed to load.
                </h3>
                <p style={{ fontSize: 15, color: "var(--color-muted)" }}>
                  Open the calendar in a new tab to book.
                </p>
                <MagneticCTA to={CAL_FULL_URL} variant="primary">
                  Open booking calendar
                </MagneticCTA>
              </div>
            ) : (
              <div style={{ width: "100%", flex: 1, minHeight: 640 }}>
                <Cal
                  calLink={CAL_LINK}
                  style={{
                    width: "100%",
                    height: "100%",
                    minHeight: 640,
                    overflow: "scroll",
                  }}
                  config={{ layout: "month_view" }}
                />
              </div>
            )}
          </motion.div>
        </div>
      </div>

      <style>{`
        @media (max-width: 960px) {
          .book-grid {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
        }
        @media (max-width: 560px) {
          .call-row {
            grid-template-columns: 1fr !important;
            gap: 8px !important;
          }
        }
      `}</style>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   //_03 · OR SEND A MESSAGE — copy left, form right
   ═══════════════════════════════════════════════════════════════ */

type FormState = "idle" | "sending" | "sent" | "error";

function SendMessage() {
  const reduce = useReducedMotion();
  const [state, setState] = useState<FormState>("idle");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg("");
    if (!name.trim()) {
      setState("error");
      setErrorMsg("Add your name so I know who I'm replying to.");
      return;
    }
    if (!EMAIL_RE.test(email.trim())) {
      setState("error");
      setErrorMsg("Double-check the email address.");
      return;
    }
    if (!message.trim()) {
      setState("error");
      setErrorMsg("Add a sentence or two so I have something to work with.");
      return;
    }

    setState("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          message: message.trim(),
        }),
      });
      if (!res.ok) {
        let providerMsg = "";
        try {
          const body = (await res.json()) as { error?: string };
          providerMsg = body?.error ?? "";
        } catch {
          /* ignore */
        }
        setState("error");
        setErrorMsg(providerMsg || `Something broke (${res.status}).`);
        return;
      }
      setState("sent");
    } catch {
      setState("error");
      setErrorMsg("Something broke on our end.");
    }
  }

  return (
    <section
      style={{
        backgroundColor: "var(--color-bg)",
        padding: "128px 40px",
        borderTop: "1px solid rgba(20,20,18,0.10)",
        position: "relative",
      }}
    >
      <div className="grain-light" aria-hidden="true" />
      <div
        style={{
          maxWidth: 1240,
          margin: "0 auto",
          position: "relative",
          zIndex: 2,
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: reduce ? 0 : 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: reduce ? 0.01 : 0.5, ease: ease.outQuart }}
          className="type-eyebrow"
          style={{
            color: "var(--color-muted)",
            marginBottom: 40,
          }}
        >
          //_03 · or send a message
        </motion.div>

        <div
          className="msg-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1.5fr",
            gap: 56,
            alignItems: "start",
          }}
        >
          <div>
            <motion.h2
              initial={{ opacity: 0, y: reduce ? 0 : 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: reduce ? 0.01 : 0.7, ease: ease.outQuart }}
              className="type-h2"
              style={{
                color: "var(--color-ink)",
                marginBottom: 20,
              }}
            >
              If a call feels <span className="fade-h">premature.</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: reduce ? 0 : 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: reduce ? 0.01 : 0.6, ease: ease.outQuart, delay: 0.1 }}
              style={{
                fontSize: 17,
                lineHeight: 1.6,
                color: "var(--color-muted)",
                maxWidth: 460,
                marginBottom: 48,
              }}
            >
              Send a note. If there's enough here for me to give you a useful
              answer, I'll write back. If it needs a call, I'll tell you that
              too.
            </motion.p>

            <motion.a
              initial={{ opacity: 0, y: reduce ? 0 : 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: reduce ? 0.01 : 0.6, ease: ease.outQuart, delay: 0.2 }}
              href={`mailto:${EMAIL_ADDR}`}
              className="type-eyebrow"
              style={{
                color: "var(--color-ink)",
                textDecoration: "none",
                borderBottom: "1px solid rgba(20,20,18,0.18)",
                paddingBottom: 2,
              }}
            >
              {EMAIL_ADDR}
            </motion.a>
          </div>

          <motion.div
            initial={{ opacity: 0, y: reduce ? 0 : 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: reduce ? 0.01 : 0.7, ease: ease.outQuart, delay: 0.2 }}
            style={{
              background: "var(--color-bg-alt)",
              border: "1px solid rgba(20,20,18,0.10)",
              borderRadius: 6,
              padding: "44px 40px",
              minHeight: 480,
            }}
          >
            {state === "sent" ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 16,
                  alignItems: "flex-start",
                  padding: "40px 0",
                }}
              >
                <div
                  className="type-eyebrow"
                  style={{
                    color: "var(--color-muted-2)",
                  }}
                >
                  //_sent
                </div>
                <h3
                  className="type-h3"
                  style={{
                    color: "var(--color-ink)",
                  }}
                >
                  Got it.
                </h3>
                <p
                  style={{
                    fontSize: 16,
                    lineHeight: 1.6,
                    color: "var(--color-muted)",
                    maxWidth: 520,
                  }}
                >
                  I'll reply within a few hours during Toronto business hours
                  (weekdays, 9am–6pm ET).
                </p>
              </div>
            ) : (
              <form
                onSubmit={onSubmit}
                noValidate
                style={{ display: "flex", flexDirection: "column", gap: 24 }}
              >
                <Field
                  id="contact-name"
                  label="Name"
                  value={name}
                  onChange={setName}
                  required
                />
                <Field
                  id="contact-email"
                  label="Email"
                  type="email"
                  value={email}
                  onChange={setEmail}
                  required
                />
                <div>
                  <label
                    htmlFor="contact-message"
                    style={{
                      display: "block",
                      fontFamily: "var(--font-mono)",
                      fontSize: 11,
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                      color: "var(--color-muted)",
                      marginBottom: 10,
                    }}
                  >
                    What are you thinking about?
                  </label>
                  <textarea
                    id="contact-message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    rows={5}
                    placeholder="A rough sentence or two is fine. Even bullet points."
                    style={inputStyle}
                  />
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                    flexWrap: "wrap",
                  }}
                >
                  <MagneticCTA
                    type="submit"
                    variant="primary"
                  >
                    {state === "sending" ? "Sending" : "Send it"}
                  </MagneticCTA>
                  {state === "error" && errorMsg ? (
                    <span
                      role="alert"
                      style={{
                        fontSize: 14,
                        color: "#8A2A1F",
                        lineHeight: 1.5,
                      }}
                    >
                      {errorMsg} Try email direct: {EMAIL_ADDR}
                    </span>
                  ) : null}
                </div>
              </form>
            )}
          </motion.div>
        </div>
      </div>

      <style>{`
        @media (max-width: 960px) {
          .msg-grid {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
        }
      `}</style>
    </section>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "14px 16px",
  fontFamily: "var(--font-body)",
  fontSize: 16,
  lineHeight: 1.5,
  color: "var(--color-ink)",
  background: "var(--color-bg)",
  border: "1px solid rgba(20,20,18,0.14)",
  borderRadius: 4,
  outline: "none",
  resize: "vertical",
  transition: "border-color 0.2s ease",
};

function Field({
  id,
  label,
  value,
  onChange,
  type = "text",
  required,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        style={{
          display: "block",
          fontFamily: "var(--font-mono)",
          fontSize: 11,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: "var(--color-muted)",
          marginBottom: 10,
        }}
      >
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        style={inputStyle}
      />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   //_04 · A FEW COMMON QUESTIONS
   ═══════════════════════════════════════════════════════════════ */

const FAQS = [
  {
    q: "What does an engagement typically cost?",
    a: "Marketing site: mid-to-high four figures. Product UI or design system: five figures. Automation systems: depends on scope. Exact number lives in the proposal, not the website — priced on the specific project.",
  },
  {
    q: "How long does it take?",
    a: "Marketing site: 3–6 weeks. Product UI or design system: 6–12 weeks. Automation systems: 3–8 weeks depending on integrations. Fixed scope, fixed timeline, weekly review call.",
  },
  {
    q: "Do you work outside Toronto?",
    a: "Yes. I'm based in Toronto but most projects are async — you get preview URLs from day one, we do one review call a week, the work ships regardless of your timezone. Currently working with clients across Canada, the US, and Europe.",
  },
  {
    q: "What if we're not sure what we need?",
    a: "That's what the discovery call is for. Bring the problem, we figure out the shape together. If it turns out you need something I don't do, I'll tell you and refer you to someone who does.",
  },
];

function Faq() {
  const reduce = useReducedMotion();
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section
      style={{
        backgroundColor: "var(--color-bg-alt)",
        padding: "128px 40px",
        borderTop: "1px solid rgba(20,20,18,0.10)",
        position: "relative",
      }}
    >
      <div className="grain-light" aria-hidden="true" />
      <div style={{ maxWidth: 1000, margin: "0 auto", position: "relative", zIndex: 2 }}>
        <motion.div
          initial={{ opacity: 0, y: reduce ? 0 : 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: reduce ? 0.01 : 0.5, ease: ease.outQuart }}
          className="type-eyebrow"
          style={{
            color: "var(--color-muted)",
            marginBottom: 24,
          }}
        >
          //_04 · a few common questions
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: reduce ? 0 : 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: reduce ? 0.01 : 0.7, ease: ease.outQuart, delay: 0.1 }}
          className="type-h2"
          style={{
            color: "var(--color-ink)",
            marginBottom: 48,
            maxWidth: 720,
          }}
        >
          Before you <span className="fade-h">reach out.</span>
        </motion.h2>

        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {FAQS.map((f, i) => {
            const isOpen = open === i;
            return (
              <motion.li
                key={f.q}
                initial={{ opacity: 0, y: reduce ? 0 : 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: reduce ? 0.01 : 0.55,
                  ease: ease.outQuart,
                  delay: reduce ? 0 : 0.05 + i * 0.06,
                }}
                style={{
                  borderTop: "1px solid rgba(20,20,18,0.10)",
                  borderBottom:
                    i === FAQS.length - 1
                      ? "1px solid rgba(20,20,18,0.10)"
                      : "none",
                }}
              >
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={`faq-panel-${i}`}
                  onClick={() => setOpen(isOpen ? null : i)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "100%",
                    padding: "28px 0",
                    background: "transparent",
                    border: "none",
                    color: "var(--color-ink)",
                    fontFamily: "var(--font-display)",
                    fontWeight: 500,
                    fontSize: "clamp(18px, 2vw, 24px)",
                    letterSpacing: "-0.018em",
                    lineHeight: 1.25,
                    textAlign: "left",
                    cursor: "pointer",
                    gap: 24,
                  }}
                >
                  <span>{f.q}</span>
                  <motion.span
                    aria-hidden
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ duration: reduce ? 0.01 : 0.35, ease: ease.outQuart }}
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 22,
                      color: "var(--color-muted)",
                      display: "inline-block",
                      lineHeight: 1,
                      width: 22,
                      textAlign: "center",
                    }}
                  >
                    +
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen ? (
                    <motion.div
                      id={`faq-panel-${i}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: reduce ? 0.01 : 0.35, ease: ease.outQuart }}
                      style={{ overflow: "hidden" }}
                    >
                      <p
                        style={{
                          padding: "0 0 28px",
                          fontSize: 16,
                          lineHeight: 1.65,
                          color: "var(--color-muted)",
                          maxWidth: 780,
                        }}
                      >
                        {f.a}
                      </p>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </motion.li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   //_05 · STILL HERE — quiet fallback, not a FinalCTA
   ═══════════════════════════════════════════════════════════════ */

function StillHere() {
  const reduce = useReducedMotion();

  return (
    <section
      style={{
        backgroundColor: "var(--color-bg)",
        padding: "128px 40px",
        borderTop: "1px solid rgba(20,20,18,0.10)",
        position: "relative",
        textAlign: "center",
      }}
    >
      <div className="grain-light" aria-hidden="true" />
      <div style={{ maxWidth: 720, margin: "0 auto", position: "relative", zIndex: 2 }}>
        <motion.div
          initial={{ opacity: 0, y: reduce ? 0 : 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: reduce ? 0.01 : 0.5, ease: ease.outQuart }}
          className="type-eyebrow"
          style={{
            color: "var(--color-muted)",
            marginBottom: 32,
          }}
        >
          //_05 · still here?
        </motion.div>
        <motion.p
          initial={{ opacity: 0, y: reduce ? 0 : 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: reduce ? 0.01 : 0.6, ease: ease.outQuart, delay: 0.1 }}
          style={{
            fontSize: 17,
            lineHeight: 1.65,
            color: "var(--color-muted)",
          }}
        >
          If you scrolled this far and neither path above felt right — email{" "}
          <a
            href={`mailto:${EMAIL_ADDR}`}
            style={{
              color: "var(--color-ink)",
              textDecoration: "underline",
              textUnderlineOffset: 3,
            }}
          >
            {EMAIL_ADDR}
          </a>{" "}
          directly. No form, no calendar, just an inbox.
        </motion.p>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Page
   ═══════════════════════════════════════════════════════════════ */

export default function Contact() {
  useEffect(function updateTitle() {
    const prev = document.title;
    document.title = "Contact — Averr Studios";
    return function restore() {
      document.title = prev;
    };
  }, []);

  useEffect(function scrollTop() {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <StartHere />
      <BookACall />
      <SendMessage />
      <Faq />
      <StillHere />
    </>
  );
}
