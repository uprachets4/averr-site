import type { ReactNode } from "react";

/**
 * The Nolana system's shared parts.
 *
 * Session 27 rebuilds home on a light ground with navy and black kept
 * for cinematic moments. These are the pieces every section is made
 * from, built once here so the system stays one system: the mono label
 * chip, the two-tone heading, the corner index, the hairline guides and
 * the gradient icon tile.
 *
 * The gradient is applied PER ELEMENT — `background-clip: text` for
 * words and numbers, `fill` for pills and glyphs — never as a wash over
 * a whole section.
 */

/** A small rounded chip: a 12px glyph + an uppercase mono label. */
export function Chip({
  icon,
  children,
  tone = "light",
}: {
  icon?: ReactNode;
  children: ReactNode;
  tone?: "light" | "dark";
}) {
  return (
    <span className={tone === "dark" ? "nl-chip nl-chip--dark" : "nl-chip"}>
      {icon ? (
        <span className="nl-chip__i" aria-hidden>
          {icon}
        </span>
      ) : null}
      {children}
    </span>
  );
}

/**
 * An ink lead with an --ink-2 continuation in the same sentence.
 * The continuation uses the DISPLAY grey, which is only AA at display
 * sizes — so this component is for headings and nothing else.
 */
export function TwoTone({
  lead,
  rest,
  as: As = "h2",
  className,
}: {
  lead: string;
  rest: string;
  as?: "h1" | "h2" | "h3";
  className?: string;
}) {
  return (
    <As className={className ? `nl-h ${className}` : "nl-h"}>
      {lead} <span className="nl-h__rest">{rest}</span>
    </As>
  );
}

/** The corner index on a card: 01, 02, … */
export function Index({ n }: { n: number }) {
  return (
    <span className="nl-idx" aria-hidden>
      {String(n).padStart(2, "0")}
    </span>
  );
}

/** The thin vertical guides down both sides of a light section. */
export function Guides() {
  return <span className="nl-guides" aria-hidden />;
}

/* ── the gradient icon glyphs ──────────────────────────────────────── */

/** One shared gradient def per page, referenced by every glyph. */
export function GradientDefs() {
  return (
    <svg width="0" height="0" aria-hidden style={{ position: "absolute" }}>
      <defs>
        <linearGradient id="nlgrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#F9AF97" />
          <stop offset="22%" stopColor="#D5818C" />
          <stop offset="52%" stopColor="#9874E8" />
          <stop offset="78%" stopColor="#708DF8" />
          <stop offset="100%" stopColor="#569AFA" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export type GlyphId = "window" | "layers" | "spark" | "rise";

/** Crafted glyphs, filled with the gradient, on a light tile. */
export function GradIcon({ id }: { id: GlyphId }) {
  return (
    <span className="nl-icon" aria-hidden>
      <svg viewBox="0 0 24 24" fill="url(#nlgrad)">
        {id === "window" ? (
          <path d="M3 5.5A2.5 2.5 0 0 1 5.5 3h13A2.5 2.5 0 0 1 21 5.5v13a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 18.5v-13Zm2 3.2v9.8c0 .3.2.5.5.5h13c.3 0 .5-.2.5-.5V8.7H5Zm1.6-2.9a.9.9 0 1 0 0 1.8.9.9 0 0 0 0-1.8Zm2.8 0a.9.9 0 1 0 0 1.8.9.9 0 0 0 0-1.8Z" />
        ) : null}
        {id === "layers" ? (
          <path d="M12 2.2 22 7.6l-10 5.4L2 7.6l10-5.4Zm0 2.3L6.2 7.6 12 10.7l5.8-3.1L12 4.5ZM3.4 11.2l1.9-1 6.7 3.6 6.7-3.6 1.9 1L12 16.3l-8.6-5.1Zm0 4.5 1.9-1 6.7 3.6 6.7-3.6 1.9 1L12 20.8l-8.6-5.1Z" />
        ) : null}
        {id === "spark" ? (
          <path d="M12 1.8c.4 0 .7.25.82.62l1.3 4.03a3.4 3.4 0 0 0 2.16 2.16l4.03 1.3a.86.86 0 0 1 0 1.64l-4.03 1.3a3.4 3.4 0 0 0-2.16 2.16l-1.3 4.03a.86.86 0 0 1-1.64 0l-1.3-4.03a3.4 3.4 0 0 0-2.16-2.16l-4.03-1.3a.86.86 0 0 1 0-1.64l4.03-1.3a3.4 3.4 0 0 0 2.16-2.16l1.3-4.03A.86.86 0 0 1 12 1.8Zm6.4 11.9.5 1.55c.1.3.33.53.63.63l1.55.5-1.55.5c-.3.1-.53.33-.63.63l-.5 1.55-.5-1.55a1.1 1.1 0 0 0-.63-.63l-1.55-.5 1.55-.5c.3-.1.53-.33.63-.63l.5-1.55Z" />
        ) : null}
        {id === "rise" ? (
          <path d="M3 20.2V13a1 1 0 0 1 1-1h2.6a1 1 0 0 1 1 1v7.2H3Zm6.7 0V8.4a1 1 0 0 1 1-1h2.6a1 1 0 0 1 1 1v11.8H9.7Zm6.7 0V4a1 1 0 0 1 1-1H20a1 1 0 0 1 1 1v16.2h-4.6Z" />
        ) : null}
      </svg>
    </span>
  );
}
