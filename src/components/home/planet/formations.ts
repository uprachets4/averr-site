/**
 * The hero's own formations — the planet and the four service objects,
 * ported from `docs/reference/hero/hero-v6-reference.html`.
 *
 * The particle TOOLKIT these are drawn with is not here: spec 30 requires
 * one shared copy, so it lives in `../particles/toolkit.ts` and the film
 * imports the same module. Only the shapes below are the hero's.
 *
 * Every coordinate, count and share is the reference's.
 */
import {
  createToolkit,
  gauss,
  pick,
  R,
  rnd,
  rotX,
  type Filler,
  type Formation,
  type Pt,
  type RingRange,
} from "../particles/toolkit";

export type { Formation, RingRange } from "../particles/toolkit";

/** The four rings: [radius, tilt, share of the non-dust budget]. */
export const RING_DEF: ReadonlyArray<readonly [number, number, number]> = [
  [4.0, 0.42, 0.11],
  [4.7, -0.28, 0.09],
  [3.4, 1.2, 0.06],
  [5.0, -0.7, 0.07],
];

/**
 * Builds the hero's formations for one particle count (30,000 desktop /
 * 14,000 below 820px).
 */
export function createHeroFormations(N: number) {
  const { DUST, makeBuf, filler, dust, topUp, inRect } = createToolkit(N);

  /** Ring ranges, filled in by the first `fHero` call, read by `withAccent`. */
  let RINGS: RingRange[] = [];

  /* ── the planet: shell + four rings, one per service ─────────────── */

  function fHero(loose: boolean): Formation {
    const b = makeBuf();
    const f = filler(b);
    dust(f);
    const n = N - DUST;
    const shell = Math.floor(n * 0.6);
    f.c = 0;
    for (let k = 0; k < shell; k++) {
      const y = 1 - (2 * (k + 0.5)) / shell;
      const r = Math.sqrt(1 - y * y);
      const a = k * 2.39996;
      f.put(Math.cos(a) * r * 2.7, y * 2.7, Math.sin(a) * r * 2.7);
    }
    const rs: RingRange[] = [];
    RING_DEF.forEach(([rad, tilt, share], idx) => {
      f.c = idx + 1;
      const a0 = f.i;
      for (let k = 0; k < n * share; k++) {
        const a = R() * Math.PI * 2;
        let rr = rad;
        let tl = tilt;
        if (loose) { rr = rad * rnd(0.55, 1.9); tl = tilt + rnd(-1.4, 1.4); }
        const x = Math.cos(a) * rr;
        const z = Math.sin(a) * rr;
        const c = Math.cos(tl);
        const si = Math.sin(tl);
        f.put(x + gauss() * 0.02, -z * si + gauss() * 0.02, z * c);
      }
      rs.push([a0, f.i]);
    });
    RINGS = rs;
    f.c = 0;
    topUp(f, () => f.sphere(0, 0, 0, 0.9 + R() * 0.6, 1));
    return b;
  }

  /**
   * In each chapter the matching ring's particles land on the part of the
   * object that does the work — so the service's own colour is always on
   * the thing that service builds.
   */
  function withAccent(
    ring: number,
    body: (f: Filler) => void,
    haze: (f: Filler) => void,
    sample: () => Pt,
  ): Formation {
    const b = makeBuf();
    const r = RINGS[ring - 1];
    const f = filler(b, r);
    dust(f);
    body(f);
    topUp(f, () => haze(f));
    for (let i = r[0]; i < r[1]; i++) {
      const p = sample();
      b.pos[i * 3] = p[0];
      b.pos[i * 3 + 1] = p[1];
      b.pos[i * 3 + 2] = p[2];
      b.tint[i] = ring;
    }
    return b;
  }

  /* 01 Websites: a page builds in the browser and the same page sits on
     the phone in front */
  function fWeb(): Formation {
    const W = 8.2, H = 5.4, x0 = -W / 2 - 0.9, y0 = -H / 2 + 0.3;
    const px = x0 + W - 0.6, py = y0 - 0.55, pz = 0.9;
    const heads = [
      [x0 + 0.5, y0 + H - 1.4, 3.6, 0.28],
      [x0 + 0.5, y0 + H - 1.86, 2.7, 0.28],
    ];
    return withAccent(
      1,
      (f) => {
        const n = N - DUST;
        f.c = 0;
        f.edgeRect(x0, y0, W, H, 0, n * 0.09);
        f.line(x0, y0 + H - 0.55, 0, x0 + W, y0 + H - 0.55, 0, n * 0.025);
        [0, 1, 2].forEach((i) => f.circle(x0 + 0.35 + i * 0.3, y0 + H - 0.28, 0, 0.07, n * 0.005));
        for (let i = 0; i < 4; i++) f.fillRect(x0 + W - 3.2 + i * 0.62, y0 + H - 0.32, 0.42, 0.06, 0, n * 0.004);
        f.fillRect(x0 + 0.5, y0 + H - 2.32, 2.8, 0.07, 0.04, n * 0.01);
        f.fillRect(x0 + 0.5, y0 + H - 2.52, 2.1, 0.07, 0.04, n * 0.008);
        for (let c = 0; c < 3; c++) {
          const cx = x0 + 0.5 + c * 2.45;
          f.edgeRect(cx, y0 + 0.35, 2.15, 1.45, 0.02, n * 0.026);
          f.fillRect(cx + 0.95, y0 + 1.35, 1.0, 0.08, 0.03, n * 0.005);
          f.fillRect(cx + 0.95, y0 + 1.12, 0.8, 0.06, 0.03, n * 0.004);
        }
        f.c = 1;
        f.box(x0 + 4.55, y0 + H - 3.1, 0, 3.15, 2.3, 0.3, n * 0.07);
        for (let c = 0; c < 3; c++) f.fillRect(x0 + 0.7 + c * 2.45, y0 + 0.55, 0.6, 0.6, 0.1, n * 0.008);
        f.c = 5;
        f.fillRect(x0 + 0.5, y0 + H - 3.08, 1.3, 0.34, 0.1, n * 0.022);
        // phone
        f.c = 0;
        f.edgeRect(px, py, 1.9, 3.7, pz, n * 0.035);
        f.line(px + 0.7, py + 3.55, pz, px + 1.2, py + 3.55, pz, n * 0.003);
        f.fillRect(px + 0.2, py + 0.75, 1.3, 0.06, pz + 0.02, n * 0.004);
        f.fillRect(px + 0.2, py + 0.55, 1.0, 0.06, pz + 0.02, n * 0.003);
        f.c = 1;
        f.fillRect(px + 0.2, py + 2.95, 1.4, 0.18, pz + 0.03, n * 0.01);
        f.fillRect(px + 0.2, py + 2.7, 1.0, 0.14, pz + 0.03, n * 0.006);
        f.fillRect(px + 0.2, py + 1.3, 1.5, 1.15, pz + 0.05, n * 0.03);
        f.c = 5;
        f.fillRect(px + 0.2, py + 0.95, 0.8, 0.22, pz + 0.06, n * 0.008);
      },
      (f) => {
        const c = R();
        if (c < 0.55) { f.c = 0; f.fillRect(x0, y0, W, H, -0.05, 1, 0.05); }
        else if (c < 0.8) { f.c = 1; f.box(x0 + 4.55, y0 + H - 3.1, 0, 3.15, 2.3, 0.3, 1); }
        else { f.c = 0; f.put(rnd(-8, 8), rnd(-4.5, 4.5), rnd(-4, 2)); }
      },
      () => {
        const h = heads[R() < 0.57 ? 0 : 1];
        return inRect(h[0], h[1], h[2], h[3], 0.07)();
      },
    );
  }

  /* 02 Web Apps: a booking calendar filling up, with an order card
     arriving beside it */
  function fApps(): Formation {
    const W = 8.2, H = 5.3, x0 = -W / 2 - 0.6, y0 = -H / 2 + 0.2;
    const sb = 1.5, gx0 = x0 + sb + 0.15, gw = W - sb - 0.3, cw = gw / 7;
    const gy0 = y0 + 0.25, gh = H - 1.15 - 0.25, rows = 8, rh = gh / rows;
    const cell = (c: number, r: number, len: number) =>
      [gx0 + c * cw + 0.06, gy0 + gh - (r + len) * rh + 0.04, cw - 0.12, len * rh - 0.08] as const;
    const booked: Array<[number, number, number]> = [
      [0, 1, 2], [1, 4, 1], [2, 0, 2], [2, 5, 1], [3, 2, 3], [4, 0, 1],
      [5, 3, 2], [6, 1, 1], [6, 5, 2], [0, 6, 1], [1, 1, 2],
    ];
    const fresh: [number, number, number] = [4, 4, 2];
    const ox = x0 + W - 1.1, oy = y0 - 0.35, oz = 1.0, ow = 2.7, oh = 2.3;
    return withAccent(
      2,
      (f) => {
        const n = N - DUST;
        f.c = 0;
        f.edgeRect(x0, y0, W, H, 0, n * 0.08);
        f.line(x0, y0 + H - 0.55, 0, x0 + W, y0 + H - 0.55, 0, n * 0.022);
        f.line(x0 + sb, y0, 0, x0 + sb, y0 + H - 0.55, 0, n * 0.016);
        for (let i = 0; i < 6; i++) f.fillRect(x0 + 0.25, y0 + H - 1.0 - i * 0.48, i ? 0.85 : 1.0, 0.08, 0.02, n * 0.004);
        for (let c = 0; c < 7; c++) f.fillRect(gx0 + c * cw + cw * 0.25, y0 + H - 0.82, cw * 0.5, 0.07, 0.02, n * 0.003);
        for (let c = 0; c <= 7; c++) f.line(gx0 + c * cw, gy0, 0, gx0 + c * cw, gy0 + gh, 0, n * 0.0035, 0.006);
        for (let r = 0; r <= rows; r++) f.line(gx0, gy0 + r * rh, 0, gx0 + gw, gy0 + r * rh, 0, n * 0.003, 0.006);
        f.c = 5;
        {
          const q = cell(...fresh);
          f.edgeRect(q[0], q[1], q[2], q[3], 0.12, n * 0.02, 0.008);
          f.fillRect(q[0], q[1], q[2], q[3], 0.1, n * 0.025);
        }
        // order card
        f.c = 0;
        f.edgeRect(ox, oy, ow, oh, oz, n * 0.03);
        f.fillRect(ox + 0.25, oy + oh - 0.55, 1.5, 0.12, oz + 0.02, n * 0.006);
        for (let i = 0; i < 3; i++) f.fillRect(ox + 0.25, oy + oh - 1.0 - i * 0.32, ow - 0.9 + (i % 2) * 0.3, 0.06, oz + 0.02, n * 0.004);
        f.c = 2;
        f.fillRect(ox + 0.25, oy + 0.25, 1.1, 0.28, oz + 0.05, n * 0.012);
        f.c = 5;
        f.circle(ox + ow - 0.45, oy + oh - 0.5, oz + 0.04, 0.2, n * 0.006, "xy", 0.006);
        f.poly(
          [[ox + ow - 0.55, oy + oh - 0.5], [ox + ow - 0.47, oy + oh - 0.6], [ox + ow - 0.33, oy + oh - 0.38]],
          oz + 0.05, n * 0.003,
        );
      },
      (f) => {
        const c = R();
        if (c < 0.45) {
          f.c = 2;
          const q = cell(...booked[(R() * booked.length) | 0]);
          f.put(q[0] + R() * q[2], q[1] + R() * q[3], 0.06 + gauss() * 0.02);
        } else if (c < 0.8) {
          f.c = 0;
          f.put(x0 + R() * W, y0 + R() * H, -0.05 + gauss() * 0.05);
        } else {
          f.c = 0;
          f.put(rnd(-8, 8), rnd(-4.5, 4.5), rnd(-4, 2));
        }
      },
      () => {
        const q = cell(...booked[(R() * booked.length) | 0]);
        const e = R() < 0.3;
        if (e) {
          const s = R() * 2 * (q[2] + q[3]);
          let x: number, y: number;
          if (s < q[2]) { x = s; y = 0; }
          else if (s < q[2] + q[3]) { x = q[2]; y = s - q[2]; }
          else if (s < 2 * q[2] + q[3]) { x = q[2] - (s - q[2] - q[3]); y = q[3]; }
          else { x = 0; y = q[3] - (s - 2 * q[2] - q[3]); }
          return [q[0] + x, q[1] + y, 0.08];
        }
        return [q[0] + R() * q[2], q[1] + R() * q[3], 0.07 + gauss() * 0.02];
      },
    );
  }

  /* 03 AI Automation: emails, chats, forms and missed calls go in;
     bookings, CRM cards and replies come out, after a person signs off */
  function fFlow(): Formation {
    const core: Pt = [-0.3, 0.1, 0];
    const gate: Pt = [1.8, 0.1, 0];
    const ins: Array<[number, number, number, string]> = [
      [-6.3, 1.6, -0.4, "mail"], [-4.9, 2.2, 0.3, "chat"], [-6.0, 0.2, 0.5, "form"],
      [-4.6, 0.7, -0.6, "call"], [-6.4, -1.3, 0.2, "chat"], [-4.8, -0.9, 0.4, "mail"],
      [-5.6, -2.4, -0.3, "call"], [-4.1, -2.0, 0.1, "form"],
    ];
    const lanes = [1.25, 0, -1.25].map((d) => core[1] + d);

    const icon = (f: Filler, [x, y, z, k]: [number, number, number, string], n: number) => {
      if (k === "mail") {
        f.edgeRect(x, y, 0.85, 0.58, z, n * 0.7, 0.008);
        f.poly([[x, y + 0.58], [x + 0.425, y + 0.25], [x + 0.85, y + 0.58]], z, n * 0.3);
      } else if (k === "chat") {
        f.edgeRect(x, y + 0.18, 0.9, 0.55, z, n * 0.7, 0.008);
        f.poly([[x + 0.18, y + 0.18], [x + 0.08, y - 0.06], [x + 0.36, y + 0.18]], z, n * 0.12);
        [0, 1, 2].forEach((i) => f.circle(x + 0.27 + i * 0.18, y + 0.455, z, 0.035, n * 0.06, "xy", 0.004));
      } else if (k === "form") {
        f.edgeRect(x, y, 0.66, 0.86, z, n * 0.6, 0.008);
        for (let i = 0; i < 3; i++) f.fillRect(x + 0.12, y + 0.62 - i * 0.2, 0.42, 0.04, z, n * 0.13);
      } else {
        f.edgeRect(x + 0.12, y, 0.42, 0.8, z, n * 0.6, 0.008);
        f.circle(x + 0.33, y + 0.08, z, 0.035, n * 0.05, "xy", 0.004);
        f.circle(x + 0.62, y + 0.62, z, 0.22, n * 0.15, "xy", 0.006, -0.9, 0.9);
        f.circle(x + 0.62, y + 0.62, z, 0.36, n * 0.2, "xy", 0.006, -0.9, 0.9);
      }
    };

    const outs = (f: Filler, n: number) => {
      const x = 3.6;
      // booked slot
      {
        const y = lanes[0] - 0.42;
        f.edgeRect(x, y, 1.7, 0.9, 0, n * 0.3, 0.008);
        for (let i = 1; i < 3; i++) f.line(x + (i * 1.7) / 3, y, 0, x + (i * 1.7) / 3, y + 0.9, 0, n * 0.04, 0.005);
        f.line(x, y + 0.45, 0, x + 1.7, y + 0.45, 0, n * 0.05, 0.005);
        f.fillRect(x + 1.7 / 3 + 0.04, y + 0.04, 1.7 / 3 - 0.08, 0.37, 0.04, n * 0.14);
      }
      // CRM card
      {
        const y = lanes[1] - 0.4;
        f.edgeRect(x, y, 1.7, 0.8, 0, n * 0.28, 0.008);
        f.circle(x + 0.35, y + 0.4, 0, 0.18, n * 0.08, "xy", 0.006);
        f.fillRect(x + 0.65, y + 0.48, 0.85, 0.07, 0, n * 0.05);
        f.fillRect(x + 0.65, y + 0.28, 0.6, 0.05, 0, n * 0.04);
      }
      // reply
      {
        const y = lanes[2] - 0.3;
        f.edgeRect(x, y, 1.7, 0.6, 0, n * 0.28, 0.008);
        f.poly([[x + 1.4, y], [x + 1.6, y - 0.22], [x + 1.6, y]], 0, n * 0.05);
        f.fillRect(x + 0.18, y + 0.36, 1.2, 0.05, 0, n * 0.05);
        f.fillRect(x + 0.18, y + 0.2, 0.9, 0.05, 0, n * 0.04);
      }
    };

    const stream = (f: Filler) => {
      const [x, y, z] = ins[(R() * ins.length) | 0];
      const ax = x + 0.42, ay = y + 0.4, t = R();
      const mx = (ax + core[0]) / 2, my = ay * 0.3, u = 1 - t;
      f.put(
        u * u * ax + 2 * u * t * mx + t * t * core[0] + gauss() * 0.014,
        u * u * ay + 2 * u * t * my + t * t * core[1] + gauss() * 0.014,
        u * u * z,
      );
    };

    return withAccent(
      3,
      (f) => {
        const n = N - DUST;
        f.c = 0;
        ins.forEach((p) => icon(f, p, n * 0.014));
        for (let k = 0; k < n * 0.05; k++) stream(f);
        f.edgeRect(gate[0] - 0.3, gate[1] - 0.75, 0.6, 1.5, 0, n * 0.02, 0.008);
        lanes.forEach((y) => {
          f.line(core[0] + 1.1, core[1] + (y - core[1]) * 0.25, 0, gate[0] - 0.3, y * 0.35 + gate[1] * 0.65, 0, n * 0.006, 0.008);
          f.line(gate[0] + 0.3, y * 0.35 + gate[1] * 0.65, 0, 3.55, y, 0, n * 0.01, 0.008);
        });
        f.c = 5;
        f.poly([[gate[0] - 0.17, gate[1] + 1.0], [gate[0] - 0.04, gate[1] + 0.86], [gate[0] + 0.24, gate[1] + 1.2]], 0, n * 0.01, 0.008);
        f.c = 3;
        outs(f, n * 0.1);
      },
      (f) => {
        const c = R();
        if (c < 0.45) { f.c = 0; stream(f); }
        else if (c < 0.65) { f.c = 0; const y = lanes[(R() * 3) | 0]; f.put(rnd(gate[0] + 0.3, 3.55), y + gauss() * 0.015, 0); }
        else if (c < 0.82) {
          f.c = 3;
          const u = R() * 2 - 1, a = R() * Math.PI * 2, q = Math.sqrt(1 - u * u), r = 0.95 * Math.cbrt(R());
          f.put(core[0] + q * Math.cos(a) * r, core[1] + u * r, core[2] + q * Math.sin(a) * r);
        } else { f.c = 0; f.put(rnd(-8, 8), rnd(-4.5, 4.5), rnd(-4, 2)); }
      },
      () =>
        pick([
          [0.62, () => {
            const u = R() * 2 - 1, a = R() * Math.PI * 2, q = Math.sqrt(1 - u * u);
            return [core[0] + q * Math.cos(a) * 1.0, core[1] + u * 1.0, core[2] + q * Math.sin(a) * 1.0] as Pt;
          }],
          [0.38, () => {
            const a = R() * Math.PI * 2;
            const p = rotX(Math.cos(a) * 1.6, 0, Math.sin(a) * 1.6, 1.2);
            return [core[0] + p[0], core[1] + p[1], core[2] + p[2]] as Pt;
          }],
        ]),
    );
  }

  /* 04 Marketing: a search, a map full of competitors, one pin rises with
     its listing and stars, reach ripples out */
  function fMap(): Formation {
    const TL = 0.62, yP = -1.6;
    const pins: Array<[number, number]> = [];
    while (pins.length < 44) {
      const x = rnd(-5.8, 5.8), z = rnd(-3.0, 3.0);
      if (Math.hypot(x, z) > 1.3) pins.push([x, z]);
    }
    const P = (f: Filler, x: number, y: number, z: number) => f.put(...rotX(x, y, z, TL));
    const hc = rotX(0, yP + 2.9, 0, TL);
    const lx = hc[0] + 1.15, ly = hc[1] - 0.55, lz = hc[2] + 0.2;
    const sb = [-3.2, 3.05, 6.4, 0.72];
    return withAccent(
      4,
      (f) => {
        const n = N - DUST;
        f.c = 0;
        for (let g = -5; g <= 5; g++) for (let k = 0; k < n * 0.0035; k++) P(f, g * 1.2 + gauss() * 0.006, yP, -3.3 + 6.6 * R());
        for (let g = -3; g <= 3; g++) for (let k = 0; k < n * 0.0045; k++) P(f, -6.2 + 12.4 * R(), yP, g * 1.1 + gauss() * 0.006);
        pins.forEach(([x, z]) => {
          for (let k = 0; k < n * 0.0012; k++) P(f, x, yP + R() * 0.3, z);
          for (let k = 0; k < n * 0.0022; k++) {
            const u = R() * 2 - 1, a = R() * Math.PI * 2, q = Math.sqrt(1 - u * u);
            P(f, x + q * Math.cos(a) * 0.09, yP + 0.37 + u * 0.09, z + q * Math.sin(a) * 0.09);
          }
        });
        // search bar
        f.edgeRect(sb[0], sb[1], sb[2], sb[3], 0.4, n * 0.04, 0.008);
        f.circle(sb[0] + 0.42, sb[1] + 0.4, 0.4, 0.15, n * 0.006, "xy", 0.005);
        f.line(sb[0] + 0.53, sb[1] + 0.29, 0.4, sb[0] + 0.68, sb[1] + 0.14, 0.4, n * 0.002, 0.005);
        f.fillRect(sb[0] + 0.95, sb[1] + 0.32, 2.6, 0.08, 0.4, n * 0.008);
        // listing card
        f.edgeRect(lx, ly, 2.3, 1.15, lz, n * 0.025, 0.008);
        f.fillRect(lx + 0.2, ly + 0.25, 1.4, 0.06, lz + 0.02, n * 0.004);
        f.c = 4;
        f.fillRect(lx + 0.2, ly + 0.82, 1.5, 0.13, lz + 0.02, n * 0.012);
        f.c = 5;
        for (let s = 0; s < 5; s++) f.star(lx + 0.32 + s * 0.36, ly + 0.55, lz + 0.03, 0.13, n * 0.005);
      },
      (f) => {
        const c = R();
        f.c = 0;
        if (c < 0.3) { const g = ((R() * 11) | 0) - 5; P(f, g * 1.2 + gauss() * 0.006, yP, -3.3 + 6.6 * R()); }
        else if (c < 0.5) { const g = ((R() * 7) | 0) - 3; P(f, -6.2 + 12.4 * R(), yP, g * 1.1 + gauss() * 0.006); }
        else if (c < 0.72) {
          const [x, z] = pins[(R() * pins.length) | 0];
          const u = R() * 2 - 1, a = R() * Math.PI * 2, q = Math.sqrt(1 - u * u);
          P(f, x + q * Math.cos(a) * 0.1, yP + 0.38 + u * 0.1, z + q * Math.sin(a) * 0.1);
        } else if (c < 0.86) {
          f.c = 4;
          const r = [1, 2, 3.1, 4.3][(R() * 4) | 0], a = R() * Math.PI * 2;
          P(f, Math.cos(a) * r, yP + 0.01, Math.sin(a) * r);
        } else f.put(rnd(-8, 8), rnd(-4.5, 4.5), rnd(-4, 2));
      },
      () =>
        pick([
          [0.3, () => {
            const r = [1, 2, 3.1, 4.3][(R() * 4) | 0], a = R() * Math.PI * 2;
            return rotX(Math.cos(a) * r, yP + 0.01, Math.sin(a) * r, TL);
          }],
          [0.34, () => {
            const a = R() * Math.PI * 2, r = 0.72 + gauss() * 0.02;
            return [hc[0] + Math.cos(a) * r, hc[1] + Math.sin(a) * r, hc[2]] as Pt;
          }],
          [0.18, () => {
            const a = R() * Math.PI * 2, r = 0.28 * Math.sqrt(R());
            return [hc[0] + Math.cos(a) * r, hc[1] + Math.sin(a) * r, hc[2]] as Pt;
          }],
          [0.18, () => {
            const t = R();
            const b = rotX(0, yP, 0, TL);
            return [b[0] + gauss() * 0.01, b[1] + (hc[1] - 0.72 - b[1]) * t, b[2] + (hc[2] - b[2]) * t] as Pt;
          }],
        ]),
    );
  }

  return {
    DUST,
    fHero,
    fWeb,
    fApps,
    fFlow,
    fMap,
    /** Valid only after the first `fHero` call, which is what defines them. */
    rings: () => RINGS,
  };
}
