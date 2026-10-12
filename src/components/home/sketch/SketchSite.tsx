import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { duration, ease } from "../../../lib/motion";
import HeroArt from "./HeroArt";
import Monogram from "./Monogram";
import { MONO_FAMILY, PRESETS, type Preset, type PresetId } from "./presets";

/**
 * The site the sketch builds.
 *
 * A name and a preset go in; a whole small homepage comes out — nav,
 * hero, services, reviews, a booking bar. Changing the NAME swaps the
 * text tokens in place. Changing the PRESET re-composes: the palette
 * crossfades, the sections rise in sequence and the mark redraws.
 * It is never blank between states.
 *
 * It is decorative. The window that holds it is aria-hidden, and the
 * reviews are labelled as samples rather than passed off as real.
 */

/** A text token that swaps whole rather than re-typing. */
function Tok({ children, k, reduce }: { children: string; k: string; reduce: boolean }) {
  return (
    <AnimatePresence mode="popLayout" initial={false}>
      <motion.span
        key={k}
        style={{ display: "inline-block", whiteSpace: "pre-wrap" }}
        initial={reduce ? false : { y: "0.3em", opacity: 0 }}
        animate={{ y: "0em", opacity: 1 }}
        exit={reduce ? undefined : { y: "-0.3em", opacity: 0 }}
        transition={{ duration: reduce ? 0 : duration.base, ease: ease.outQuart }}
      >
        {children}
      </motion.span>
    </AnimatePresence>
  );
}

function Stars({ colour }: { colour: string }) {
  return (
    <span aria-hidden style={{ color: colour, letterSpacing: "0.08em", fontSize: "0.9em" }}>
      ★★★★★
    </span>
  );
}

/**
 * The offer, laid out the way its industry lays it out.
 *
 * Seven shapes, no two alike: a menu, a bookable list, a numbered
 * process, a lookbook grid, a week's schedule, ruled practice areas, and
 * a plain card row. The café's menu carries dish names and notes and NO
 * prices — the site has no currency on it anywhere.
 */
function OfferSection({ preset }: { preset: Preset }) {
  const items = preset.services;
  switch (preset.section.kind) {
    case "menu":
      return (
        <ul className="sk-menu">
          {items.map(function row(s) {
            return (
              <li key={s.name} className="sk-menu__row">
                <span className="sk-menu__name">{s.name}</span>
                <span className="sk-menu__dots" aria-hidden />
                <span className="sk-menu__note">{s.note}</span>
              </li>
            );
          })}
        </ul>
      );

    case "booklist":
      return (
        <ul className="sk-book-list">
          {items.map(function row(s) {
            return (
              <li key={s.name} className="sk-book-row">
                <span className="sk-book-row__text">
                  <span className="sk-book-row__name">{s.name}</span>
                  <span className="sk-book-row__note">{s.note}</span>
                </span>
                <span className="sk-chip">Book</span>
              </li>
            );
          })}
        </ul>
      );

    case "process":
      return (
        <ol className="sk-process">
          {items.map(function step(s, i) {
            return (
              <li key={s.name} className="sk-step">
                <span className="sk-step__n">{String(i + 1).padStart(2, "0")}</span>
                <span className="sk-step__body">
                  <span className="sk-step__name">{s.name}</span>
                  <span className="sk-step__note">{s.note}</span>
                </span>
              </li>
            );
          })}
        </ol>
      );

    case "lookbook":
      return (
        <ul className="sk-look">
          {items.map(function tile(s, i) {
            return (
              <li key={s.name} className="sk-look__tile">
                <span className={`sk-look__art sk-look__art--${i % 4}`} aria-hidden />
                <span className="sk-look__cap">{s.name}</span>
                <span className="sk-look__note">{s.note}</span>
              </li>
            );
          })}
        </ul>
      );

    case "schedule":
      return (
        <ul className="sk-sched">
          {items.map(function row(s) {
            return (
              <li key={s.name} className="sk-sched__row">
                <span className="sk-sched__when">{s.meta ?? s.note}</span>
                <span className="sk-sched__what">{s.name}</span>
                <span className="sk-sched__len">{s.note}</span>
                <span className="sk-chip sk-chip--solid">Join</span>
              </li>
            );
          })}
        </ul>
      );

    case "areas":
      return (
        <ul className="sk-areas">
          {items.map(function row(s) {
            return (
              <li key={s.name} className="sk-area">
                <span className="sk-area__name">{s.name}</span>
                <span className="sk-area__note">{s.note}</span>
              </li>
            );
          })}
        </ul>
      );

    default:
      return (
        <ul className="sk-cards">
          {items.map(function card(s) {
            return (
              <li key={s.name} className="sk-card">
                <span className="sk-card__rule" />
                <span className="sk-card__name">{s.name}</span>
                <span className="sk-card__note">{s.note}</span>
              </li>
            );
          })}
        </ul>
      );
  }
}

export default function SketchSite({
  name,
  presetId,
  compact = false,
}: {
  name: string;
  presetId: PresetId;
  compact?: boolean;
}) {
  const reduce = !!useReducedMotion();
  const preset = PRESETS[presetId];
  const p = preset.palette;
  const t = preset.type;
  const shown = name.trim() || "your business";
  const headline = preset.headline.replace("{name}", shown);

  /* the whole composition is keyed on the preset, so a preset change
     remounts it and the stagger below plays from the top */
  const rise = function rise(i: number) {
    return reduce
      ? {}
      : {
          initial: { opacity: 0, y: 22 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.5, ease: ease.outQuart, delay: 0.05 + i * 0.07 },
        };
  };

  const navCase =
    t.navCase === "upper" ? "uppercase" : t.navCase === "lower" ? "lowercase" : "none";

  const Hero = (
    <section className={`sk-hero sk-hero--${preset.variant}`}>
      <div className="sk-hero__art">
        <HeroArt preset={preset} />
      </div>
      <div className="sk-hero__copy">
        <p className="sk-eyebrow">{preset.kind}</p>
        <h1 className="sk-h1">
          <Tok k={headline} reduce={reduce}>
            {headline}
          </Tok>
        </h1>
        <p className="sk-sub">{preset.sub}</p>
        <div className="sk-hero__cta">
          <span className="sk-btn sk-btn--solid">{preset.cta}</span>
          <span className="sk-btn sk-btn--ghost">See prices</span>
        </div>
      </div>
    </section>
  );

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={presetId}
        className={compact ? "sk sk--compact" : "sk"}
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={reduce ? undefined : { opacity: 0 }}
        transition={{ duration: reduce ? 0 : 0.35, ease: ease.outQuart }}
        style={
          {
            "--sk-bg": p.bg,
            "--sk-surface": p.surface,
            "--sk-ink": p.ink,
            "--sk-muted": p.muted,
            "--sk-accent": p.accent,
            "--sk-on-accent": p.onAccent,
            "--sk-display": t.display,
            "--sk-body": t.body,
            "--sk-display-weight": String(t.displayWeight),
            "--sk-display-style": t.displayItalic ? "italic" : "normal",
            "--sk-display-tracking": `${t.displayTracking}em`,
            "--sk-nav-case": navCase,
            "--sk-nav-tracking": `${t.navTracking}em`,
            "--sk-nav-weight": String(t.navWeight),
          } as React.CSSProperties
        }
      >
        {/* nav */}
        <motion.header className="sk-nav" {...rise(0)}>
          <div className="sk-brand">
            <Monogram name={shown} preset={preset} size={compact ? 26 : 34} />
            <span className="sk-brand__name">
              <Tok k={shown} reduce={reduce}>
                {shown}
              </Tok>
            </span>
          </div>
          <nav className="sk-nav__links">
            {preset.nav.map(function link(l) {
              return <span key={l}>{l}</span>;
            })}
          </nav>
          <span className="sk-btn sk-btn--solid sk-btn--sm sk-nav__cta">{preset.cta}</span>
        </motion.header>

        <motion.div {...rise(1)}>{Hero}</motion.div>

        {/* the offer — a different SHAPE per industry, never a recolour */}
        <motion.section className="sk-services" {...rise(2)}>
          <h2 className="sk-h2">{preset.section.title}</h2>
          <OfferSection preset={preset} />
        </motion.section>

        {/* reviews — labelled as samples, with invented first names */}
        <motion.section className="sk-reviews" {...rise(3)}>
          <div className="sk-reviews__head">
            <h2 className="sk-h2">What people say</h2>
            <span className="sk-sample">sample</span>
          </div>
          <ul className="sk-quotes">
            {preset.reviews.map(function q(text, i) {
              return (
                <li key={text} className="sk-quote">
                  <Stars colour={p.accent} />
                  <span className="sk-quote__text">“{text}”</span>
                  <span className="sk-quote__who">{preset.reviewers[i]}</span>
                </li>
              );
            })}
          </ul>
        </motion.section>

        {/* booking bar */}
        <motion.section className="sk-book" {...rise(4)}>
          <span className="sk-book__text">
            <Tok k={`b-${shown}`} reduce={reduce}>
              {shown}
            </Tok>
            {" — Toronto & the GTA"}
          </span>
          <span className="sk-btn sk-btn--solid" data-sk-book>
            {preset.cta}
          </span>
        </motion.section>

        <footer className="sk-foot">
          <span>© {shown}</span>
          <span>Mon–Sat · Toronto</span>
        </footer>

        <style>{`
          .sk {
            background: var(--sk-bg);
            color: var(--sk-ink);
            font-family: var(--sk-body);
            min-height: 100%;
          }
          .sk * { box-sizing: border-box; }

          .sk-nav {
            display: flex; align-items: center; gap: 28px;
            padding: 18px 34px;
            background: var(--sk-surface);
            border-bottom: 1px solid color-mix(in srgb, var(--sk-ink) 10%, transparent);
          }
          .sk-brand { display: flex; align-items: center; gap: 12px; min-width: 0; }
          .sk-brand__name {
            font-family: var(--sk-display);
            font-weight: var(--sk-display-weight);
            font-style: var(--sk-display-style);
            letter-spacing: var(--sk-display-tracking);
            font-size: 22px; white-space: nowrap;
            overflow: hidden; text-overflow: ellipsis; max-width: 320px;
          }
          .sk-nav__links { display: flex; gap: 22px; margin-left: auto; }
          .sk-nav__links span {
            font-size: 14px; color: var(--sk-muted);
            text-transform: var(--sk-nav-case);
            letter-spacing: var(--sk-nav-tracking);
            font-weight: var(--sk-nav-weight);
            white-space: nowrap;
          }

          .sk-btn {
            display: inline-flex; align-items: center; justify-content: center;
            padding: 13px 22px; border-radius: 999px;
            font-size: 15px; font-weight: 500; white-space: nowrap;
          }
          .sk-btn--sm { padding: 9px 16px; font-size: 13px; }
          .sk-btn--solid { background: var(--sk-accent); color: var(--sk-on-accent); }
          .sk-btn--ghost {
            border: 1px solid color-mix(in srgb, var(--sk-ink) 24%, transparent);
            color: var(--sk-ink);
          }

          .sk-eyebrow {
            margin: 0 0 14px; font-family: ${MONO_FAMILY};
            font-size: 12px; letter-spacing: 0.14em; text-transform: uppercase;
            color: var(--sk-muted);
          }
          .sk-h1 {
            margin: 0 0 16px;
            font-family: var(--sk-display);
            font-weight: var(--sk-display-weight);
            font-style: var(--sk-display-style);
            letter-spacing: var(--sk-display-tracking);
            font-size: 50px; line-height: 1.04;
          }
          .sk-sub {
            margin: 0 0 26px; font-size: 16px; line-height: 1.55;
            color: var(--sk-muted); max-width: 46ch;
          }
          .sk-hero__cta { display: flex; gap: 12px; flex-wrap: wrap; }

          /* ── hero variants: genuinely different arrangements ── */
          .sk-hero { position: relative; }
          .sk-hero__art { overflow: hidden; }

          .sk-hero--stacked .sk-hero__art { height: 230px; }
          .sk-hero--stacked .sk-hero__copy { padding: 36px 34px 44px; }

          .sk-hero--split { display: grid; grid-template-columns: 1.05fr 0.95fr; align-items: center; }
          .sk-hero--split .sk-hero__copy { padding: 54px 30px 54px 34px; order: 0; }
          .sk-hero--split .sk-hero__art { height: 360px; order: 1; }

          .sk-hero--split-reverse { display: grid; grid-template-columns: 0.95fr 1.05fr; align-items: center; }
          .sk-hero--split-reverse .sk-hero__art { height: 380px; order: 0; }
          .sk-hero--split-reverse .sk-hero__copy { padding: 54px 34px 54px 30px; order: 1; }

          .sk-hero--centered { display: grid; }
          .sk-hero--centered .sk-hero__art { grid-area: 1 / 1; height: 420px; opacity: 0.9; }
          .sk-hero--centered .sk-hero__copy {
            grid-area: 1 / 1; place-self: center; text-align: center;
            padding: 0 34px; max-width: 640px;
          }
          .sk-hero--centered .sk-sub { margin-left: auto; margin-right: auto; }
          .sk-hero--centered .sk-hero__cta { justify-content: center; }
          .sk-hero--centered .sk-h1 { font-size: 46px; }

          .sk-hero--editorial { display: grid; grid-template-columns: 0.82fr 1.18fr; }
          .sk-hero--editorial .sk-hero__copy { padding: 58px 24px 58px 34px; }
          .sk-hero--editorial .sk-hero__art { height: 100%; min-height: 330px; }
          .sk-hero--editorial .sk-h1 { font-size: 52px; text-transform: uppercase; line-height: 0.96; }
          .sk-hero--editorial .sk-eyebrow { color: var(--sk-accent); }

          /* ── services ── */
          .sk-services { padding: 46px 34px; }
          .sk-h2 {
            margin: 0 0 22px;
            font-family: var(--sk-display);
            font-weight: var(--sk-display-weight);
            font-style: var(--sk-display-style);
            letter-spacing: var(--sk-display-tracking);
            font-size: 28px;
          }
          .sk-cards {
            list-style: none; margin: 0; padding: 0;
            display: grid; grid-template-columns: repeat(auto-fit, minmax(190px, 1fr)); gap: 14px;
          }
          .sk-card {
            background: var(--sk-surface);
            border: 1px solid color-mix(in srgb, var(--sk-ink) 9%, transparent);
            border-radius: 12px; padding: 20px 18px 18px;
            display: flex; flex-direction: column; gap: 8px;
          }
          .sk-card__rule { width: 28px; height: 3px; border-radius: 2px; background: var(--sk-accent); }
          .sk-card__name { font-size: 16px; font-weight: 500; }
          .sk-card__note { font-size: 13px; color: var(--sk-muted); }

          /* ── the offer, seven shapes ── */
          .sk-chip {
            display: inline-flex; align-items: center; justify-content: center;
            padding: 7px 14px; border-radius: 999px; font-size: 13px; font-weight: 500;
            border: 1px solid color-mix(in srgb, var(--sk-ink) 22%, transparent);
            color: var(--sk-ink); white-space: nowrap;
          }
          .sk-chip--solid { background: var(--sk-accent); color: var(--sk-on-accent); border-color: transparent; }

          /* food — a menu, dish and note, no prices anywhere */
          .sk-menu { list-style: none; margin: 0; padding: 0; max-width: 620px; }
          .sk-menu__row {
            display: flex; align-items: baseline; gap: 10px;
            padding: 11px 0;
            border-bottom: 1px dashed color-mix(in srgb, var(--sk-ink) 16%, transparent);
          }
          .sk-menu__name {
            font-family: var(--sk-display); font-style: var(--sk-display-style);
            font-weight: var(--sk-display-weight); font-size: 21px; white-space: nowrap;
          }
          .sk-menu__dots { flex: 1; border-bottom: 1px dotted color-mix(in srgb, var(--sk-ink) 28%, transparent); }
          .sk-menu__note { font-size: 14px; color: var(--sk-muted); white-space: nowrap; }

          /* health — a bookable list */
          .sk-book-list { list-style: none; margin: 0; padding: 0; }
          .sk-book-row {
            display: flex; align-items: center; justify-content: space-between; gap: 18px;
            padding: 15px 18px; margin-bottom: 10px;
            background: var(--sk-surface); border-radius: 12px;
            border: 1px solid color-mix(in srgb, var(--sk-ink) 8%, transparent);
          }
          .sk-book-row__text { display: flex; flex-direction: column; gap: 4px; min-width: 0; }
          .sk-book-row__name { font-size: 16px; font-weight: 500; }
          .sk-book-row__note { font-size: 13px; color: var(--sk-muted); }

          /* trades — a numbered process on a rule */
          .sk-process {
            list-style: none; margin: 0; padding: 0 0 0 22px;
            border-left: 2px solid color-mix(in srgb, var(--sk-accent) 45%, transparent);
            display: flex; flex-direction: column; gap: 20px;
          }
          .sk-step { display: flex; gap: 16px; align-items: baseline; }
          .sk-step__n {
            font-family: ${MONO_FAMILY}; font-size: 13px; letter-spacing: 0.1em;
            color: var(--sk-accent); min-width: 26px;
          }
          .sk-step__body { display: flex; flex-direction: column; gap: 3px; }
          .sk-step__name { font-size: 17px; font-weight: 500; }
          .sk-step__note { font-size: 13px; color: var(--sk-muted); }

          /* beauty — a lookbook grid of drawn tiles */
          .sk-look {
            list-style: none; margin: 0; padding: 0;
            display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 16px;
          }
          .sk-look__tile { display: flex; flex-direction: column; gap: 8px; }
          .sk-look__art {
            display: block; height: 150px; border-radius: 10px;
            background: color-mix(in srgb, var(--sk-accent) 16%, var(--sk-surface));
            position: relative; overflow: hidden;
          }
          .sk-look__art::after {
            content: ""; position: absolute; inset: 0;
            background:
              radial-gradient(60% 50% at 30% 28%, color-mix(in srgb, var(--sk-accent) 42%, transparent), transparent 70%),
              linear-gradient(130deg, transparent 46%, color-mix(in srgb, var(--sk-accent) 30%, transparent) 50%, transparent 54%);
          }
          .sk-look__art--1::after { transform: scaleX(-1); }
          .sk-look__art--2::after { transform: rotate(180deg); }
          .sk-look__art--3::after { transform: scaleY(-1); }
          .sk-look__cap {
            font-family: var(--sk-display); font-size: 17px;
            letter-spacing: var(--sk-display-tracking);
          }
          .sk-look__note { font-size: 13px; color: var(--sk-muted); }

          /* fitness — a week's schedule */
          .sk-sched { list-style: none; margin: 0; padding: 0; }
          .sk-sched__row {
            display: grid; grid-template-columns: 110px 1fr auto auto; gap: 16px; align-items: center;
            padding: 13px 0;
            border-top: 1px solid color-mix(in srgb, var(--sk-ink) 14%, transparent);
          }
          .sk-sched__row:last-child { border-bottom: 1px solid color-mix(in srgb, var(--sk-ink) 14%, transparent); }
          .sk-sched__when {
            font-family: ${MONO_FAMILY}; font-size: 13px; letter-spacing: 0.06em;
            color: var(--sk-accent); text-transform: uppercase;
          }
          .sk-sched__what { font-size: 17px; font-weight: 500; text-transform: uppercase; letter-spacing: -0.01em; }
          .sk-sched__len { font-size: 13px; color: var(--sk-muted); }

          /* professional — ruled practice areas */
          .sk-areas {
            list-style: none; margin: 0; padding: 0;
            display: grid; grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
            border-top: 2px solid color-mix(in srgb, var(--sk-accent) 70%, transparent);
          }
          .sk-area {
            padding: 18px 20px 20px 0;
            border-bottom: 1px solid color-mix(in srgb, var(--sk-ink) 14%, transparent);
            display: flex; flex-direction: column; gap: 6px;
          }
          .sk-area__name {
            font-family: var(--sk-display); font-size: 19px;
            letter-spacing: var(--sk-display-tracking);
          }
          .sk-area__note { font-size: 13px; color: var(--sk-muted); }

          /* ── reviews ── */
          .sk-reviews { padding: 10px 34px 46px; }
          .sk-reviews__head { display: flex; align-items: baseline; gap: 12px; }
          .sk-sample {
            font-family: ${MONO_FAMILY}; font-size: 12px; letter-spacing: 0.12em;
            text-transform: uppercase; color: var(--sk-muted);
            border: 1px solid color-mix(in srgb, var(--sk-ink) 18%, transparent);
            border-radius: 4px; padding: 2px 6px;
          }
          .sk-quotes {
            list-style: none; margin: 0; padding: 0;
            display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 14px;
          }
          .sk-quote { display: flex; flex-direction: column; gap: 7px; }
          .sk-quote__text { font-size: 15px; line-height: 1.45; }
          .sk-quote__who { font-size: 13px; color: var(--sk-muted); }

          /* ── booking bar ── */
          .sk-book {
            display: flex; align-items: center; justify-content: space-between; gap: 20px;
            padding: 22px 34px;
            background: var(--sk-surface);
            border-top: 1px solid color-mix(in srgb, var(--sk-ink) 10%, transparent);
            border-bottom: 1px solid color-mix(in srgb, var(--sk-ink) 10%, transparent);
          }
          .sk-book__text {
            font-family: var(--sk-display);
            font-weight: var(--sk-display-weight);
            font-style: var(--sk-display-style);
            font-size: 20px; min-width: 0;
            overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
          }
          .sk-foot {
            display: flex; justify-content: space-between;
            padding: 18px 34px 26px; font-size: 13px; color: var(--sk-muted);
          }

          /* ── the phone-proportioned window ── */
          .sk--compact .sk-nav { padding: 12px 16px; gap: 12px; }
          .sk--compact .sk-nav__links { display: none; }
          .sk--compact .sk-nav__cta { margin-left: auto; }
          .sk--compact .sk-brand__name { font-size: 16px; max-width: 150px; }
          .sk--compact .sk-h1,
          .sk--compact .sk-hero--centered .sk-h1,
          .sk--compact .sk-hero--editorial .sk-h1 { font-size: 26px; }
          .sk--compact .sk-sub { font-size: 13px; margin-bottom: 18px; }
          .sk--compact .sk-eyebrow { font-size: 13px; margin-bottom: 10px; }
          .sk--compact .sk-btn { padding: 10px 14px; font-size: 13px; }
          .sk--compact .sk-hero { display: block; }
          .sk--compact .sk-hero__art { height: 130px; }
          .sk--compact .sk-hero--centered .sk-hero__art,
          .sk--compact .sk-hero--editorial .sk-hero__art { height: 130px; min-height: 0; }
          .sk--compact .sk-hero__copy { padding: 18px 16px 22px; text-align: left; max-width: none; }
          .sk--compact .sk-hero--centered .sk-hero__cta { justify-content: flex-start; }
          .sk--compact .sk-services,
          .sk--compact .sk-reviews { padding: 22px 16px; }
          .sk--compact .sk-h2 { font-size: 19px; margin-bottom: 14px; }
          .sk--compact .sk-cards { grid-template-columns: 1fr 1fr; gap: 10px; }
          .sk--compact .sk-menu__name { font-size: 16px; }
          .sk--compact .sk-menu__note,
          .sk--compact .sk-book-row__note,
          .sk--compact .sk-step__note,
          .sk--compact .sk-look__note,
          .sk--compact .sk-sched__len,
          .sk--compact .sk-area__note { font-size: 13px; }
          .sk--compact .sk-book-row { padding: 11px 12px; }
          .sk--compact .sk-book-row__name,
          .sk--compact .sk-step__name,
          .sk--compact .sk-sched__what { font-size: 14px; }
          .sk--compact .sk-look { grid-template-columns: 1fr 1fr; gap: 10px; }
          .sk--compact .sk-look__art { height: 92px; }
          .sk--compact .sk-look__cap, .sk--compact .sk-area__name { font-size: 15px; }
          .sk--compact .sk-areas { grid-template-columns: 1fr; }
          .sk--compact .sk-sched__row { grid-template-columns: 84px 1fr auto; gap: 10px; }
          .sk--compact .sk-sched__len { display: none; }
          .sk--compact .sk-chip { padding: 6px 11px; font-size: 13px; }
          .sk--compact .sk-process { padding-left: 14px; gap: 14px; }
          .sk--compact .sk-card { padding: 14px 12px; }
          .sk--compact .sk-card__name { font-size: 14px; }
          .sk--compact .sk-sample { font-size: 13px; }
          .sk--compact .sk-card__note,
          .sk--compact .sk-quote__who,
          .sk--compact .sk-foot { font-size: 13px; }
          .sk--compact .sk-quotes { grid-template-columns: 1fr; gap: 10px; }
          .sk--compact .sk-quote__text { font-size: 14px; }
          .sk--compact .sk-book { padding: 14px 16px; }
          .sk--compact .sk-book__text { font-size: 15px; }
          .sk--compact .sk-foot { padding: 14px 16px 20px; }

          @media (prefers-reduced-motion: reduce) {
            .sk * { animation: none !important; }
          }
        `}</style>
      </motion.div>
    </AnimatePresence>
  );
}
