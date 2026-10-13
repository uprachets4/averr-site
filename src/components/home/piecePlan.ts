/**
 * The composition of the hero's room.
 *
 * Fifteen pieces, each exactly once. No captures: real project screens
 * appear in one place on home now, the work section.
 *
 * SAFE ZONE. The headline's ink box measured x 8–58%, y 6–55% at 1440
 * (25c), and its subline and CTAs carry the left column down to about
 * y 95% at 1280×720. So every piece lives at x ≥ 60% and the camera's
 * sweep is checked against the headline rather than eyeballed.
 *
 * DEPTH is an even ladder from +40 to −1880, about 134px a rung. The
 * 23b finding stands: clustered z values leave a stretch of the
 * fly-through with nothing at a visible distance and the frame empties.
 *
 * `s` stays close to 1. The perspective already shrinks a piece by its
 * own z, so a falling `s` shrank the back of the room TWICE and the far
 * pieces read as debris rather than as objects.
 *
 * `x`/`y` are WHERE THE PIECE LANDS ON SCREEN, in percentages of the
 * frame, measured to its centre — PieceField undoes the perspective
 * foreshortening for each piece's own z, so this file reads as the
 * composition you actually see. `s` scales the piece's base size.
 */

export type Placed = {
  /** A piece id from the library. */
  id: string;
  x: number;
  y: number;
  /** Scale on the piece's own base size. */
  s: number;
  z: number;
  /** Drift amplitude in px and period in seconds. */
  drift: [number, number];
  /** Its own yaw, so the room is not a flat deck. */
  yaw: number;
  /** The eight the phone keeps. */
  mobile?: boolean;
};

export const PLACED: Placed[] = [
  /* ── near: the three the eye lands on ───────────────────────────── */
  { id: "field", x: 78, y: 30, s: 1.15, z: 40, drift: [6, 19], yaw: -9, mobile: true },
  { id: "code", x: 84, y: 61, s: 1.1, z: -94, drift: [5, 23], yaw: 7, mobile: true },
  { id: "specimen", x: 64, y: 76, s: 1.05, z: -228, drift: [5, 21], yaw: -6, mobile: true },

  /* ── mid ─────────────────────────────────────────────────────────── */
  { id: "chart", x: 92, y: 20, s: 1.0, z: -362, drift: [4, 25], yaw: 10, mobile: true },
  { id: "chips", x: 68, y: 13, s: 1.0, z: -496, drift: [4, 18], yaw: -11, mobile: true },
  { id: "phone", x: 94, y: 47, s: 1.0, z: -630, drift: [4, 27], yaw: 8 },
  { id: "chat", x: 73, y: 41, s: 1.0, z: -764, drift: [3, 22], yaw: -5, mobile: true },
  { id: "toggle", x: 88, y: 86, s: 1.02, z: -898, drift: [3, 20], yaw: 6, mobile: true },

  /* ── far: small, and fading into the room ───────────────────────── */
  { id: "grid", x: 63, y: 33, s: 1.02, z: -1032, drift: [3, 26], yaw: -8 },
  { id: "calendar", x: 90, y: 69, s: 1.05, z: -1166, drift: [3, 24], yaw: 9, mobile: true },
  { id: "nodes", x: 76, y: 92, s: 1.05, z: -1300, drift: [2, 28], yaw: -4 },
  { id: "button", x: 86, y: 11, s: 1.08, z: -1434, drift: [2, 21], yaw: 5 },
  { id: "pin", x: 66, y: 58, s: 1.1, z: -1568, drift: [2, 23], yaw: -7 },
  { id: "stars", x: 85, y: 31, s: 1.12, z: -1702, drift: [2, 25], yaw: 4 },
  { id: "cursor", x: 70, y: 22, s: 1.15, z: -1880, drift: [2, 19], yaw: -6 },
];

/** Where each piece gathers as the camera pushes through — the swirl
 *  that carries the room into chapter two. A ring, tightening and
 *  rotating, rather than fifteen pieces flying off in fifteen
 *  directions: the next chapter picks these same nodes up. */
export function gatherSlot(i: number, n: number) {
  const a = (i / n) * Math.PI * 2;
  return { ax: Math.cos(a), ay: Math.sin(a) };
}
