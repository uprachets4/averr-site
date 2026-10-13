import type { ReactNode } from "react";

/**
 * The pieces.
 *
 * Fifteen crafted primitives — the building blocks everything we make is
 * assembled from. They are the home page's whole visual vocabulary now:
 * the hero is a room of them, and each service chapter assembles them
 * into the thing that service produces. Real project captures appear in
 * exactly one place on home, the work section.
 *
 * TWO SHELLS, and nothing else:
 *   glass  layered translucent fills + an inner highlight + an accent
 *          rim. NO backdrop-filter — it forces a readback of everything
 *          behind the element, and there are up to eighteen of these in
 *          a moving 3D field.
 *   paper  a parch surface with a soft contact shadow.
 *
 * EVERY TOY IS CSS. Each piece has an idle micro-motion and a
 * hover/focus interaction, and both are declarative: keyframes and
 * transitions driven by `:hover`/`:focus-visible` on the shell, with the
 * typing effects done by `steps()` width animations rather than by
 * per-character state. The hero's pieces are in the initial bundle, so
 * the whole library costs no runtime loop and almost no JavaScript.
 *
 * Nothing here pretends to be a real product: no client names, no
 * invented figures, no fake website copy. Northgate is the one fictional
 * demo brand the site already uses.
 */

export type Shell = "glass" | "paper";

export type PieceDef = {
  id: string;
  /** The accessible name when a piece is focusable (the hero). */
  label: string;
  shell: Shell;
  /** Base size in px; the field scales from this. */
  w: number;
  h: number;
  body: ReactNode;
};

/* ── the fifteen ───────────────────────────────────────────────────── */

export const PIECES: PieceDef[] = [
  {
    id: "button",
    label: "A button. Press it.",
    shell: "glass",
    w: 148,
    h: 56,
    body: (
      <span className="pc-btn">
        <span className="pc-btn__label">Get a quote</span>
        <span className="pc-btn__ripple" />
      </span>
    ),
  },
  {
    id: "toggle",
    label: "A switch. Flip it.",
    shell: "glass",
    w: 112,
    h: 60,
    body: (
      <span className="pc-toggle">
        <span className="pc-toggle__track">
          <span className="pc-toggle__knob" />
        </span>
      </span>
    ),
  },
  {
    id: "field",
    label: "A text field. It types a name.",
    shell: "glass",
    w: 232,
    h: 64,
    body: (
      <span className="pc-field">
        <span className="pc-field__label">Business name</span>
        <span className="pc-field__row">
          <span className="pc-field__typed">Northgate</span>
          <span className="pc-field__caret" />
        </span>
      </span>
    ),
  },
  {
    id: "specimen",
    label: "A type specimen. It changes voice.",
    shell: "paper",
    w: 132,
    h: 132,
    body: (
      <span className="pc-spec">
        <span className="pc-spec__a">Aa</span>
        <span className="pc-spec__b">Aa</span>
        <span className="pc-spec__meta">Geist · Cormorant</span>
      </span>
    ),
  },
  {
    id: "chips",
    label: "Colour chips. They fan out.",
    shell: "paper",
    w: 150,
    h: 96,
    body: (
      <span className="pc-chips">
        <i style={{ "--c": "#141412" } as React.CSSProperties} />
        <i style={{ "--c": "#C8763C" } as React.CSSProperties} />
        <i style={{ "--c": "#EDE9E2" } as React.CSSProperties} />
        <i style={{ "--c": "#6B665C" } as React.CSSProperties} />
      </span>
    ),
  },
  {
    id: "code",
    label: "A code card. It writes itself.",
    shell: "glass",
    w: 236,
    h: 124,
    body: (
      <span className="pc-code">
        <b className="pc-code__l1">
          <em>const</em> site = build(
        </b>
        <b className="pc-code__l2">
          &nbsp;&nbsp;<em>pieces</em>
        </b>
        <b className="pc-code__l3">)</b>
      </span>
    ),
  },
  {
    id: "chart",
    label: "A chart. The line draws.",
    shell: "glass",
    w: 212,
    h: 124,
    body: (
      <svg className="pc-chart" viewBox="0 0 200 110" aria-hidden>
        <path className="pc-chart__grid" d="M8 92 H192 M8 62 H192 M8 32 H192" />
        <path
          className="pc-chart__line"
          d="M12 86 L46 72 L80 78 L114 48 L148 40 L186 18"
          fill="none"
        />
        <circle className="pc-chart__dot" cx="186" cy="18" r="4" />
      </svg>
    ),
  },
  {
    id: "chat",
    label: "An assistant. It replies.",
    shell: "glass",
    w: 214,
    h: 104,
    body: (
      <span className="pc-chat">
        <span className="pc-chat__dots">
          <i /><i /><i />
        </span>
        <span className="pc-chat__msg">Draft ready ✓</span>
      </span>
    ),
  },
  {
    id: "nodes",
    label: "A network. Signals travel it.",
    shell: "glass",
    w: 176,
    h: 132,
    body: (
      <svg className="pc-nodes" viewBox="0 0 160 120" aria-hidden>
        <path className="pc-nodes__p1" d="M22 60 L78 26" />
        <path className="pc-nodes__p2" d="M22 60 L78 94" />
        <path className="pc-nodes__p3" d="M78 26 L136 60" />
        <path className="pc-nodes__p4" d="M78 94 L136 60" />
        <circle cx="22" cy="60" r="7" />
        <circle cx="78" cy="26" r="6" />
        <circle cx="78" cy="94" r="6" />
        <circle cx="136" cy="60" r="7" />
      </svg>
    ),
  },
  {
    id: "pin",
    label: "A map pin. It lands.",
    shell: "glass",
    w: 120,
    h: 128,
    body: (
      <span className="pc-pin">
        <span className="pc-pin__ring" />
        <svg viewBox="0 0 32 40" className="pc-pin__glyph" aria-hidden>
          <path d="M16 1c7 0 13 5.6 13 12.6C29 23 16 39 16 39S3 23 3 13.6C3 6.6 9 1 16 1z" />
          <circle cx="16" cy="13.4" r="4.6" />
        </svg>
      </span>
    ),
  },
  {
    id: "phone",
    label: "A phone. The screen wakes.",
    shell: "glass",
    w: 92,
    h: 164,
    body: (
      <span className="pc-phone">
        <span className="pc-phone__notch" />
        <span className="pc-phone__screen">
          <i /><i /><i />
        </span>
      </span>
    ),
  },
  {
    id: "calendar",
    label: "A booking. It confirms.",
    shell: "paper",
    w: 160,
    h: 92,
    body: (
      <span className="pc-cal">
        <span className="pc-cal__day">Thu</span>
        <span className="pc-cal__time">2:00</span>
        <span className="pc-cal__tick">✓</span>
      </span>
    ),
  },
  {
    id: "cursor",
    label: "A cursor. It clicks.",
    shell: "glass",
    w: 92,
    h: 92,
    body: (
      <span className="pc-cursor">
        <span className="pc-cursor__ring" />
        <svg viewBox="0 0 24 24" className="pc-cursor__arrow" aria-hidden>
          <path d="M5 2 L19 13 L12.4 13.4 L15.6 20.2 L12.6 21.6 L9.4 14.8 L5 19 Z" />
        </svg>
      </span>
    ),
  },
  {
    id: "grid",
    label: "A layout. It snaps together.",
    shell: "glass",
    w: 150,
    h: 118,
    body: (
      <span className="pc-grid">
        <i className="pc-grid__a" />
        <i className="pc-grid__b" />
        <i className="pc-grid__c" />
        <i className="pc-grid__d" />
      </span>
    ),
  },
  {
    id: "stars",
    label: "A rating. It fills.",
    shell: "paper",
    w: 158,
    h: 60,
    body: (
      <span className="pc-stars" aria-hidden>
        {[0, 1, 2, 3, 4].map(function star(i) {
          return (
            <svg key={i} viewBox="0 0 24 24" style={{ "--i": i } as React.CSSProperties}>
              <path d="M12 2.6l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.5 6.1 20.6l1.2-6.5L2.5 9.5l6.6-.9z" />
            </svg>
          );
        })}
      </span>
    ),
  },
];

export const PIECE_BY_ID: Record<string, PieceDef> = PIECES.reduce(
  function index(acc, p) {
    acc[p.id] = p;
    return acc;
  },
  {} as Record<string, PieceDef>
);

/**
 * One piece.
 *
 * `interactive` makes it a real button with an accessible name — that is
 * the hero, where the pieces are the thing the reader plays with. In the
 * chapter scenes the same piece is decorative scenery and is hidden from
 * assistive tech, because there the SCENE carries the meaning and
 * fifteen more tab stops per chapter would be noise.
 */
export function Piece({
  def,
  interactive = false,
  className,
  style,
}: {
  def: PieceDef;
  interactive?: boolean;
  className?: string;
  style?: React.CSSProperties;
}) {
  const cls = [
    "pc",
    `pc--${def.shell}`,
    `pc--${def.id}`,
    interactive ? "pc--live" : null,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const box = {
    width: def.w,
    height: def.h,
    ...style,
  } as React.CSSProperties;

  if (!interactive) {
    return (
      <span className={cls} style={box} aria-hidden>
        {def.body}
      </span>
    );
  }
  return (
    <button type="button" className={cls} style={box} aria-label={def.label}>
      {def.body}
    </button>
  );
}
