/**
 * THE START PASS SITS INSIDE THE FILM — owner ruling.
 *
 * Order: Signature → start pass (pick a day) → Finale (type your name).
 * The film is one pinned stage, so the pass can't simply be placed
 * between two acts. Instead the film's scroll track grows by the pass's
 * height plus one viewport, and the pass scrolls OVER the pinned stage
 * like a curtain, painted with the stage's own gradient (fixed to the
 * viewport, so the two are the same pixels):
 *
 *   entry   — the pass rises over Signature; the film holds at HOLD_A
 *   covered — the film jumps to HOLD_B underneath, where nobody sees the
 *             particles reform into the name
 *   exit    — the pass leaves upward and uncovers the Finale, held at
 *             HOLD_B, then the film carries on to its end.
 *
 * No act constant moves: this maps scroll pixels back into the film's
 * own raw progress, which `toActSpace` then maps as it always has.
 * Kept out of engine.ts so the page can lay the track out before the
 * lazy engine chunk arrives.
 */

/** Signature is fully on screen here (it starts leaving at .82). */
export const HOLD_A = 0.815;
/** The finale has arrived and the name has formed (morph ends .865). */
export const HOLD_B = 0.87;

/** Must match `PRT_EXTRA` in engine.ts. */
const PRT_EXTRA = 0.05;
/** Raw progress for an act-space value past the partners act. */
const rawOf = (p: number) => (p + PRT_EXTRA) / (1 + PRT_EXTRA);

/** `.hf-film` is 1570vh; one viewport of it is the pinned stage. */
const FILM_VH = 15.7;

export type HoldLayout = {
  ih: number;
  /** Film-only scroll length, px. */
  F: number;
  sA: number;
  sB: number;
  passH: number;
  /** Total height `.hf-film` must have, px. */
  filmH: number;
  /** The pass's top inside `.hf-film`, px. */
  passTop: number;
};

export function holdLayout(ih: number, passH: number): HoldLayout {
  const F = (FILM_VH - 1) * ih;
  const sA = rawOf(HOLD_A) * F;
  const sB = rawOf(HOLD_B) * F;
  const len = passH + ih;
  const total = F + len - (sB - sA);
  return { ih, F, sA, sB, passH, filmH: total + ih, passTop: sA + ih };
}

/** Pixels scrolled into the film → the film's raw progress, 0..1. */
export function holdRaw(s: number, L: HoldLayout): number {
  const { ih, sA, sB, passH, F } = L;
  let f: number;
  if (s <= sA) f = s;
  else if (s < sA + ih) f = sA; // entry: the pass rises over Signature
  else if (s < sA + passH + ih) f = sB; // covered, then exit over the Finale
  else f = sB + (s - sA - passH - ih);
  return Math.min(1, Math.max(0, f / F));
}
