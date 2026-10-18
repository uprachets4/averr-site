import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useReducedMotion } from "motion/react";
import { Chip, TwoTone, Index, Guides, GradIcon, type GlyphId } from "./Bits";
import { caseStudies } from "../../data/caseStudies";
import { useTilt, useSpotlight, Magnetic } from "./Motion";

/**
 * The light sections of the Nolana home.
 *
 * PROBLEM     a centred statement that fills word by word with scroll.
 * WHAT WE BUILD  the four things, as cards into /services.
 * NUMBERS     honest figures on black, counting up on entry.
 *
 * Every figure in NUMBERS is traced to a source in the table below, and
 * nothing that is not traceable appears. Two come from
 * `caseStudies.ts`'s verified `headlineFigure`s; the rest are the
 * studio's own standing promises, which are commitments rather than
 * measurements and are labelled that way in the heading.
 */

/* ── 2 · the problem ───────────────────────────────────────────────── */

const STATEMENT =
  "Most businesses run on a patchwork: a dated website, a spreadsheet of leads, hours of manual follow-up. Customers notice. We fix the whole chain.";

function Problem() {
  const reduce = !!useReducedMotion();
  const ref = useRef<HTMLParagraphElement | null>(null);
  const words = STATEMENT.split(" ");

  useEffect(
    function fill() {
      const el = ref.current;
      if (!el || reduce) return;
      const spans = el.querySelectorAll<HTMLElement>(".np-w");
      let raf = 0;
      function read() {
        raf = 0;
        const r = el!.getBoundingClientRect();
        const vh = window.innerHeight;
        /* the statement fills across the middle of its own pass */
        const t = (vh * 0.86 - r.top) / (r.height + vh * 0.5);
        const k = Math.max(0, Math.min(1, t));
        const lit = k * spans.length * 1.18;
        spans.forEach(function one(s, i) {
          s.style.color = i < lit ? "var(--n-ink)" : "var(--ink-2)";
        });
      }
      function onScroll() {
        if (!raf) raf = requestAnimationFrame(read);
      }
      read();
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onScroll);
      return function off() {
        cancelAnimationFrame(raf);
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onScroll);
      };
    },
    [reduce]
  );

  const sec = useRef<HTMLElement | null>(null);
  useSpotlight(sec);

  return (
    <section className="np" id="how" ref={sec}>
      <Guides />
      <div className="np-inner">
        <p ref={ref} className={reduce ? "np-stmt np-stmt--all" : "np-stmt"}>
          {words.map(function w(word, i) {
            return (
              <span className="np-w" key={i}>
                {word}{" "}
              </span>
            );
          })}
        </p>
      </div>
    </section>
  );
}

/* ── 3 · what we build ─────────────────────────────────────────────── */

const CARDS: Array<{ icon: GlyphId; title: string; body: string; href: string }> = [
  {
    icon: "window",
    title: "Websites",
    body: "A palette, type and look that's yours, before a line of code. Custom-built on Next.js or Framer, up to 15 pages.",
    href: "/services#marketing-websites",
  },
  {
    icon: "layers",
    title: "Web apps & SaaS",
    body: "Dashboards and apps people can actually find their way around. One system, so the tenth screen looks like the first.",
    href: "/services#product-and-saas-interfaces",
  },
  {
    icon: "spark",
    title: "AI automation",
    body: "Agents and automations that qualify leads, answer intake and move data — with a human signing off.",
    href: "/services#ai-agents",
  },
  {
    icon: "rise",
    title: "Growth marketing",
    body: "Be the business people find first: local search, outreach, paid and content, reported plainly.",
    href: "/services#local-search",
  },
];

/** One build card: it leans toward the cursor and carries the sheen. */
function BuildCard({ c, i }: { c: (typeof CARDS)[number]; i: number }) {
  const ref = useRef<HTMLAnchorElement | null>(null);
  useTilt(ref, 4);
  return (
    <Link ref={ref} to={c.href} className="nw-card">
      <span className="nw-card__top">
        <GradIcon id={c.icon} />
        <Index n={i + 1} />
      </span>
      <span className="nw-card__t">{c.title}</span>
      <span className="nw-card__b">{c.body}</span>
    </Link>
  );
}

function WhatWeBuild() {
  const sec = useRef<HTMLElement | null>(null);
  useSpotlight(sec);
  return (
    <section className="nw" ref={sec}>
      <Guides />
      <div className="nw-inner">
        <div className="nw-head">
          <div>
            <Chip>What we build</Chip>
            <TwoTone
              className="nw-h2"
              lead="We build the four things your business runs on"
              rest="— from first search to booked job."
            />
          </div>
          <Magnetic as={Link} to="/contact" className="nw-cta">
            Book a call
          </Magnetic>
        </div>

        <ul className="nw-grid">
          {CARDS.map(function card(c, i) {
            return (
              <li key={c.title}>
                <BuildCard c={c} i={i} />
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

/* ── 4 · the numbers ───────────────────────────────────────────────── */

const cg = caseStudies["cg-walls-and-floors"]?.headlineFigure;
const sift = caseStudies["sift"]?.headlineFigure;

/** value, label, and where the figure comes from. */
const FIGURES: Array<{ v: string; label: string }> = [
  { v: cg?.value ?? "", label: cg ? `${cg.caption} — CG Walls & Floors` : "" },
  { v: sift?.value ?? "", label: sift ? `${sift.caption} — SIFT` : "" },
  { v: "16", label: "Services across the four pillars" },
  { v: "14 days", label: "To kickoff, at the most" },
  { v: "30 min", label: "The first call" },
  { v: "24 hrs", label: "Reply time, every message" },
].filter((f) => f.v);

function Figure({ v, label }: { v: string; label: string }) {
  const reduce = !!useReducedMotion();
  const ref = useRef<HTMLDivElement | null>(null);
  const [shown, setShown] = useState(reduce ? v : null);

  useEffect(
    function count() {
      const el = ref.current;
      if (!el) return;
      if (reduce) {
        setShown(v);
        return;
      }
      const m = v.match(/^(\d+)(.*)$/);
      if (!m) {
        setShown(v);
        return;
      }
      const target = parseInt(m[1], 10);
      const suffix = m[2];
      let raf = 0;
      let done = false;
      const io = new IntersectionObserver(
        function seen(es) {
          if (done || !es.some((e) => e.isIntersecting)) return;
          done = true;
          io.disconnect();
          const t0 = performance.now();
          const dur = 900;
          function step() {
            const k = Math.min(1, (performance.now() - t0) / dur);
            const eased = 1 - Math.pow(1 - k, 3);
            setShown(String(Math.round(target * eased)) + suffix);
            if (k < 1) raf = requestAnimationFrame(step);
          }
          raf = requestAnimationFrame(step);
        },
        { threshold: 0.4 }
      );
      io.observe(el);
      return function off() {
        cancelAnimationFrame(raf);
        io.disconnect();
      };
    },
    [v, reduce]
  );

  return (
    <div ref={ref} className="nn-cell">
      <div className="nn-v">{shown ?? "0" + (v.match(/^\d+(.*)$/)?.[1] ?? "")}</div>
      <div className="nn-l">{label}</div>
    </div>
  );
}

function Numbers() {
  return (
    <section className="nn">
      <div className="nn-inner">
        <Chip tone="dark">The numbers</Chip>
        <TwoTone
          className="nn-h2"
          lead="The numbers, honestly."
          rest="Measured, or promised in writing."
        />
        <div className="nn-grid">
          {FIGURES.map(function f(x) {
            return <Figure key={x.label} v={x.v} label={x.label} />;
          })}
        </div>
      </div>
    </section>
  );
}

export { Problem, WhatWeBuild, Numbers };
