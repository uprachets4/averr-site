import { useEffect, useRef, useState, type CSSProperties, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { CLIENTS, OUTCOMES, PARTNERS, PROJECTS, SERVICES } from "./content";
import type { FilmHandle } from "./engine";
import "./film.css";

/**
 * The home film — spec 30.
 *
 * One pinned 1500vh stage running five acts: partners, the four
 * services, a screening room of real recordings, the signature word with
 * work playing inside it, and the visitor's own business name in
 * particles. The hero's takeover opens straight into this stage's
 * background, so there is no seam between them.
 *
 * This file is the DOM only. Everything that moves is in `engine.ts`,
 * which is a lazy chunk fetched by an IntersectionObserver when the film
 * is within one viewport — the hero's LCP must not change.
 *
 * Accessibility: one `h2` per act, all copy is real DOM text, both
 * canvases are aria-hidden, the partner logos carry the company name as
 * `alt`, the decorative service rail is aria-hidden (the names are
 * already headings in the beats), and the name field has a real label.
 */

export default function HomeFilm() {
  const filmRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const lightRef = useRef<HTMLDivElement | null>(null);
  const partnersRef = useRef<HTMLElement | null>(null);
  const servicesRef = useRef<HTMLElement | null>(null);
  const workRef = useRef<HTMLElement | null>(null);
  const signatureRef = useRef<HTMLElement | null>(null);
  const finaleRef = useRef<HTMLElement | null>(null);
  const vIntroRef = useRef<HTMLDivElement | null>(null);
  const beatsRef = useRef<HTMLDivElement | null>(null);
  const railRef = useRef<HTMLDivElement | null>(null);
  const wTopRef = useRef<HTMLDivElement | null>(null);
  const creditsRef = useRef<HTMLDivElement | null>(null);
  const counterRef = useRef<HTMLDivElement | null>(null);
  const sigCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const sigSvgRef = useRef<SVGSVGElement | null>(null);
  const sigWordRef = useRef<SVGTextElement | null>(null);
  const outsRef = useRef<HTMLDivElement | null>(null);
  const tsRef = useRef<HTMLParagraphElement | null>(null);
  const marksRef = useRef<HTMLDivElement | null>(null);

  /* The typed name lives in React state and a ref, and nowhere else:
     no network call, no storage. It dies with the tab. */
  const [name, setName] = useState("");
  const nameRef = useRef("");
  nameRef.current = name;
  const handleRef = useRef<FilmHandle | null>(null);

  useEffect(function startEngine() {
    const film = filmRef.current;
    const stage = stageRef.current;
    if (!film || !stage) return;
    let cancelled = false;

    /* Within one viewport of the film, fetch the chunk. */
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting) || cancelled) return;
        io.disconnect();
        import("./engine")
          .then((mod) => {
            if (cancelled || !filmRef.current) return;
            handleRef.current = mod.mount(stage, {
              film,
              light: lightRef.current!,
              layers: {
                partners: partnersRef.current!,
                services: servicesRef.current!,
                work: workRef.current!,
                signature: signatureRef.current!,
                finale: finaleRef.current!,
              },
              marks: Array.from(marksRef.current!.querySelectorAll<HTMLElement>(".hf-mark")),
              vIntro: vIntroRef.current!,
              beats: Array.from(beatsRef.current!.children) as HTMLElement[],
              rail: Array.from(railRef.current!.children) as HTMLElement[],
              wTop: wTopRef.current!,
              credits: Array.from(creditsRef.current!.children) as HTMLElement[],
              counter: counterRef.current!,
              sigCanvas: sigCanvasRef.current!,
              sigSvg: sigSvgRef.current!,
              sigWord: sigWordRef.current!,
              outs: Array.from(outsRef.current!.children) as HTMLElement[],
              ts: tsRef.current!,
              getName: () => nameRef.current,
            });
          })
          .catch((err) => {
            /* No WebGL, a blocked chunk, a throw: every line of copy
               still reads on the stage's own gradient, in order. */
            if (import.meta.env.DEV) console.warn("home film: engine unavailable", err);
          });
      },
      { rootMargin: "100% 0px" },
    );
    io.observe(film);

    return function stop() {
      cancelled = true;
      io.disconnect();
      handleRef.current?.dispose();
      handleRef.current = null;
    };
  }, []);

  /* The name rebuilds 420ms after typing stops, as in the reference. */
  useEffect(
    function rebuildName() {
      if (!handleRef.current) return;
      const t = window.setTimeout(() => handleRef.current?.setName(), 420);
      return () => window.clearTimeout(t);
    },
    [name],
  );

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    handleRef.current?.setName();
    (document.activeElement as HTMLElement | null)?.blur();
  }

  return (
    <div className="hf-film" ref={filmRef}>
      <div className="hf-stage" ref={stageRef}>
        <div className="hf-light" ref={lightRef} aria-hidden="true" />
        <canvas data-layer="film" aria-hidden="true" />
        <div className="hf-grain" aria-hidden="true" />

        <div className="hf-ov">
          {/* ── 1 · partners ─────────────────────────────────────── */}
          <section className="hf-layer" ref={partnersRef} aria-label="Partners and clients">
            <div className="hf-center">
              <span className="hf-eyebrow">Partners and clients</span>
              <h2 className="hf-xl hf-glow" style={{ fontSize: "clamp(40px,6vw,108px)" }}>
                In good company.
              </h2>
              <div className="hf-marks" ref={marksRef}>
                <div className="hf-row hf-row--p">
                  {PARTNERS.map((p) => (
                    <div className="hf-mark" key={p.name}>
                      <span className="hf-plate">
                        <img src={p.logo} alt={p.name} />
                      </span>
                      <small>Partner</small>
                    </div>
                  ))}
                </div>
                <div className="hf-row hf-row--c">
                  {CLIENTS.map((c) => (
                    <div className="hf-mark" key={c}>
                      <b>{c}</b>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* ── 2 · services ─────────────────────────────────────── */}
          <section className="hf-layer" ref={servicesRef} aria-label="Services">
            <div className="hf-center hf-glow" ref={vIntroRef}>
              <span className="hf-eyebrow">What we do</span>
              <h2 className="hf-xl">
                Four services.
                <br />
                One team.
              </h2>
            </div>
            <div ref={beatsRef}>
              {SERVICES.map((s, i) => (
                <article
                  className="hf-beat hf-glow"
                  key={s.name}
                  style={{ "--c": s.color } as CSSProperties}
                >
                  <div className="hf-k">
                    <i />
                    {`0${i + 1} / 04 · What we do`}
                  </div>
                  <h3>{s.name}</h3>
                  <p>{s.line}</p>
                  <div className="hf-inc">
                    {s.inc.map((x) => (
                      <span key={x}>{x}</span>
                    ))}
                  </div>
                </article>
              ))}
            </div>
            {/* decorative: every name is already a heading above */}
            <div className="hf-rail" ref={railRef} aria-hidden="true">
              {SERVICES.map((s) => (
                <span key={s.name} style={{ "--c": s.color } as CSSProperties}>
                  {s.name}
                  <i />
                </span>
              ))}
            </div>
          </section>

          {/* ── 3 · work ─────────────────────────────────────────── */}
          <section className="hf-layer" ref={workRef} aria-label="Our work">
            <div className="hf-wtop hf-glow" ref={wTopRef}>
              <span className="hf-eyebrow">The work</span>
              <h2 className="hf-xl" style={{ fontSize: "clamp(40px,6vw,108px)" }}>
                Here's what that looks like.
              </h2>
            </div>
            <div ref={creditsRef}>
              {PROJECTS.map((p, i) => (
                <div
                  className="hf-credit hf-glow"
                  key={p.name}
                  style={{ display: i === 0 ? undefined : "none", opacity: 0 }}
                >
                  <div className="hf-chips">
                    {p.chips.map(([n, c]) => (
                      <span className="hf-chip" key={n} style={{ "--c": c } as CSSProperties}>
                        <i />
                        {n}
                      </span>
                    ))}
                  </div>
                  <h3>{p.name}</h3>
                  <p>{p.line}</p>
                  <Link to={p.href} style={{ "--c": p.color } as CSSProperties}>
                    View case study →
                  </Link>
                </div>
              ))}
            </div>
            <div className="hf-counter" ref={counterRef} aria-hidden="true">
              <b>01</b> / 03
            </div>
          </section>

          {/* ── 4 · signature ────────────────────────────────────── */}
          <section className="hf-layer hf-layer--sig" ref={signatureRef} aria-label="Signature">
            <canvas ref={sigCanvasRef} aria-hidden="true" />
            <svg ref={sigSvgRef} aria-hidden="true">
              <defs>
                <mask id="hf-sig-mask">
                  <rect width="100%" height="100%" fill="#fff" />
                  <text
                    ref={sigWordRef}
                    x="50%"
                    y="52%"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontFamily="Geist, ui-sans-serif, system-ui, sans-serif"
                    fontWeight="600"
                    letterSpacing="-0.05em"
                    fill="#000"
                  >
                    signature
                  </text>
                </mask>
              </defs>
              <rect width="100%" height="100%" fill="#080A0A" mask="url(#hf-sig-mask)" />
            </svg>
            {/* Owner ruling: the act's h2 is the whole sentence, laid out
                exactly as the reference drew it — the eyebrow above the
                line — so nothing changes visually. */}
            <div className="hf-cap hf-cap--t">
              <h2>
                <span className="hf-eyebrow">Every site we build</span>
                <span className="hf-sigline">gets one thing nobody else has.</span>
              </h2>
            </div>
            <div className="hf-cap hf-cap--b">
              <p>A signature moment, designed from your world.</p>
              <span className="hf-hint">Move your cursor through the letters</span>
            </div>
          </section>

          {/* ── 5 · yours next ───────────────────────────────────── */}
          <section className="hf-layer" ref={finaleRef} aria-label="Yours next">
            <div className="hf-ftop hf-glow">
              <span className="hf-eyebrow">Yours next</span>
              <h2>What would it look like for you?</h2>
              <form className="hf-field" autoComplete="off" onSubmit={onSubmit}>
                <label className="hf-sr" htmlFor="hf-biz">
                  Your business name
                </label>
                <input
                  id="hf-biz"
                  maxLength={28}
                  placeholder="Type your business name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <button type="submit">Build it</button>
              </form>
              <span className="hf-hint">Stays in your browser · nothing is sent</span>
            </div>
            <div ref={outsRef}>
              {OUTCOMES.map(([n, c, txt]) => (
                <div className="hf-out" key={n} style={{ "--c": c } as CSSProperties}>
                  <i />
                  <div>
                    <small>{n}</small>
                    {txt}
                  </div>
                </div>
              ))}
            </div>
            <div className="hf-fbot hf-glow">
              <p className="hf-ts" ref={tsRef}>
                Taken seriously.
              </p>
              {/* the site's own booking action, not a new link */}
              <Link className="hf-cta" to="/contact">
                Book a discovery call →
              </Link>
              <span className="hf-prev">Preview · what your business could look like with us</span>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
