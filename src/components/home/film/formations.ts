/**
 * The film's formations, ported from `docs/reference/home-film/index.html`.
 *
 * Every coordinate, count and share here is the reference's. The toolkit
 * these are drawn with is the shared one in `../particles/toolkit.ts`.
 *
 * NOT ported, deliberately: the reference also carries the hero's
 * `fHero`/`fWeb`/`fApps`/`fFlow`/`fMap` and three unused shapes
 * (`fDoor`, `fBlocks`, `fBeacon`, with `cubeEdges`). None of them is
 * reachable — `build()` uses calm / fBrowser / fTiles / fLoop /
 * fMegaphone / fScreens only, and the lone `fHero(false)` call exists to
 * set `RINGS`, which none of the film's shapes read. The hero's shapes
 * live in `../planet/formations.ts`.
 *
 * Tint ids: 0 white · 1 Websites · 2 Web Apps · 3 AI Automation ·
 * 4 Marketing · 5 the studio gradient.
 */
import {
  createToolkit,
  gauss,
  lerp,
  R,
  rnd,
  type Filler,
  type Formation,
} from "../particles/toolkit";

/* ── the screening room ───────────────────────────────────────────── */
export const SW = 7.2;
export const SH = 4.5;
export const WZ = -34;

/** The three screens, spread across the room and turned toward the aisle. */
export const SCR = [-1, 0, 1].map((i) => ({
  x: i * 9.4,
  y: 0,
  z: WZ - Math.abs(i) * 1.6,
  ry: -i * 0.22,
}));

export const isSmall = () => innerWidth < 820;

/** Where a service symbol sits: [scale, x, y, z]. */
export function svcPlace(): [number, number, number, number] {
  return isSmall() ? [0.4, 0, 2.0, 0] : [0.62, 4.6, 0.1, 0];
}

type Place = [number, number, number, number];

export type FilmFormations = {
  calm: Formation;
  web: Formation;
  app: Formation;
  flow: Formation;
  map: Formation;
  scr: Formation;
};

export function createFilmFormations(N: number) {
  const { DUST, makeBuf, filler, dust, topUp } = createToolkit(N);

  /** Scale and translate everything but the dust. */
  function shift(b: Formation, s: number, tx: number, ty: number, tz: number): Formation {
    for (let i = DUST; i < N; i++) {
      b.pos[i * 3] = b.pos[i * 3] * s + tx;
      b.pos[i * 3 + 1] = b.pos[i * 3 + 1] * s + ty;
      b.pos[i * 3 + 2] = b.pos[i * 3 + 2] * s + tz;
    }
    return b;
  }

  /** A rounded rectangle's outline, walked by arc length. */
  function rrect(
    f: Filler, cx: number, cy: number, w: number, h: number,
    r: number, z: number, n: number, j = 0.01,
  ) {
    const L = 2 * (w - 2 * r) + 2 * (h - 2 * r) + 2 * Math.PI * r;
    for (let k = 0; k < n; k++) {
      let t = R() * L;
      let x: number, y: number;
      const a = w - 2 * r, b = h - 2 * r, q = (Math.PI * r) / 2;
      if (t < a) { x = -w / 2 + r + t; y = -h / 2; }
      else if ((t -= a) < q) { const g = -Math.PI / 2 + t / r; x = w / 2 - r + Math.cos(g) * r; y = -h / 2 + r + Math.sin(g) * r; }
      else if ((t -= q) < b) { x = w / 2; y = -h / 2 + r + t; }
      else if ((t -= b) < q) { const g = t / r; x = w / 2 - r + Math.cos(g) * r; y = h / 2 - r + Math.sin(g) * r; }
      else if ((t -= q) < a) { x = w / 2 - r - t; y = h / 2; }
      else if ((t -= a) < q) { const g = Math.PI / 2 + t / r; x = -w / 2 + r + Math.cos(g) * r; y = h / 2 - r + Math.sin(g) * r; }
      else if ((t -= q) < b) { x = -w / 2; y = h / 2 - r - t; }
      else { t -= b; const g = Math.PI + t / r; x = -w / 2 + r + Math.cos(g) * r; y = -h / 2 + r + Math.sin(g) * r; }
      f.put(cx + x + gauss() * j, cy + y + gauss() * j, z + gauss() * j);
    }
  }

  /* Websites — a browser window with a cursor clicking, and a ripple. */
  function fBrowser(): Formation {
    const b = makeBuf(), f = filler(b);
    dust(f);
    const n = N - DUST, W = 6.6, H = 4.4, cy = 0.2;
    f.c = 0;
    rrect(f, 0, cy, W, H, 0.35, 0, n * 0.16);
    f.line(-W / 2, cy + H / 2 - 0.7, 0, W / 2, cy + H / 2 - 0.7, 0, n * 0.04, 0.008);
    [0, 1, 2].forEach((i) => f.circle(-W / 2 + 0.45 + i * 0.33, cy + H / 2 - 0.35, 0, 0.09, n * 0.006, "xy", 0.006));
    f.c = 1;
    rrect(f, 0.6, cy + H / 2 - 0.35, 3.0, 0.32, 0.16, 0, n * 0.02, 0.006);
    // page inside: a headline bar and a button, quiet
    f.c = 1;
    f.fillRect(-W / 2 + 0.6, cy + 0.5, 3.2, 0.32, 0.02, n * 0.06);
    f.fillRect(-W / 2 + 0.6, cy - 0.05, 2.2, 0.32, 0.02, n * 0.04);
    f.c = 0;
    f.fillRect(-W / 2 + 0.6, cy - 0.55, 2.8, 0.08, 0.02, n * 0.012);
    f.fillRect(-W / 2 + 0.6, cy - 0.8, 2.2, 0.08, 0.02, n * 0.01);
    f.c = 5;
    rrect(f, -W / 2 + 1.3, cy - 1.45, 1.4, 0.42, 0.21, 0.03, n * 0.03, 0.006);
    // the cursor, clicking: arrow plus ripple
    const tx = 1.55, ty = cy - 1.2;
    const A = [[0, 0], [0, -1.3], [0.33, -1.0], [0.58, -1.55], [0.82, -1.45], [0.56, -0.92], [1.0, -0.92], [0, 0]];
    f.c = 0;
    f.poly(A.map(([x, y]) => [tx + x, ty + y]), 0.3, n * 0.06, 0.006);
    for (let k = 0; k < n * 0.05; k++) {
      const u = R(), v = R();
      if (v > u * 1.25) continue;
      f.put(tx + u * 0.75, ty - v * 1.15 - u * 0.1, 0.3);
    }
    f.c = 1;
    [0.38, 0.7, 1.02].forEach((r, i) => f.circle(tx, ty, 0.25, r, n * (0.03 - i * 0.006), "xy", 0.01));
    topUp(f, () => {
      f.c = R() < 0.5 ? 1 : 0;
      f.put(rnd(-W / 2, W / 2), cy + rnd(-H / 2, H / 2), -0.05 + gauss() * 0.05);
    });
    return b;
  }

  /* Web Apps — a 3x3 grid of app tiles; one lifts forward, lit. */
  function fTiles(): Formation {
    const b = makeBuf(), f = filler(b);
    dust(f);
    const n = N - DUST, t = 1.25, g = 0.38, P = t + g;
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if (i === 1 && j === 1) continue;
        const cx = i * P, cy = j * P;
        f.c = 0;
        rrect(f, cx, cy, t, t, 0.3, 0, n * 0.045, 0.008);
        if ((i + j) % 2 === 0) {
          f.c = 2;
          for (let k = 0; k < n * 0.03; k++) {
            const x = rnd(-t / 2 + 0.12, t / 2 - 0.12), y = rnd(-t / 2 + 0.12, t / 2 - 0.12);
            f.put(cx + x, cy + y, 0);
          }
        }
      }
    }
    // the app being built: lifted forward, lit
    const cx = P, cy = P, z = 1.4;
    f.c = 5;
    rrect(f, cx + 0.35, cy + 0.35, t * 1.15, t * 1.15, 0.34, z, n * 0.07, 0.008);
    f.c = 2;
    for (let k = 0; k < n * 0.07; k++) f.put(cx + 0.35 + rnd(-t * 0.5, t * 0.5), cy + 0.35 + rnd(-t * 0.5, t * 0.5), z);
    f.c = 2;
    for (let k = 0; k < n * 0.02; k++) { const u = R(); f.put(cx + u * 0.35, cy + u * 0.35, u * z); }
    topUp(f, () => {
      const i = ((R() * 3) | 0) - 1, j = ((R() * 3) | 0) - 1;
      f.c = R() < 0.5 ? 2 : 0;
      f.put(i * P + rnd(-t / 2, t / 2), j * P + rnd(-t / 2, t / 2), gauss() * 0.04);
    });
    return b;
  }

  /* AI Automation — an infinity loop; tasks fall in left, sorted out right. */
  function fLoop(): Formation {
    const b = makeBuf(), f = filler(b);
    dust(f);
    const n = N - DUST, A = 3.0;
    const L = (t: number): [number, number, number] => {
      const d = 1 + Math.sin(t) ** 2;
      return [(A * Math.cos(t)) / d, ((A * Math.sin(t) * Math.cos(t)) / d) * 1.25, Math.sin(t) * 0.6];
    };
    for (let k = 0; k < n * 0.42; k++) {
      const t = R() * Math.PI * 2;
      const p = L(t);
      const r = 0.12 * Math.sqrt(R()), a = R() * Math.PI * 2;
      f.c = R() < 0.7 ? 3 : 0;
      f.put(p[0], p[1] + Math.cos(a) * r, p[2] + Math.sin(a) * r);
    }
    // scattered tasks falling in from the left
    f.c = 0;
    for (let q = 0; q < 9; q++) {
      const x = rnd(-6.6, -4.4), y = rnd(-2.6, 2.6), w = 0.42, h = 0.3;
      f.edgeRect(x, y, w, h, rnd(-0.6, 0.6), n * 0.009, 0.006);
    }
    for (let k = 0; k < n * 0.05; k++) {
      const t = R(), sx = rnd(-6.2, -4.2), sy = rnd(-2.4, 2.4);
      f.put(sx + (-A - sx) * t, sy * (1 - t), 0);
    }
    // handled: neat, aligned output on the right
    f.c = 3;
    for (let q = 0; q < 4; q++) f.edgeRect(4.3, 1.1 - q * 0.72, 1.5, 0.46, 0, n * 0.016, 0.006);
    f.c = 5;
    for (let k = 0; k < n * 0.03; k++) {
      const a = R() * Math.PI * 2, r = 0.32 * Math.sqrt(R());
      f.put(Math.cos(a) * r, Math.sin(a) * r, 0);
    }
    topUp(f, () => {
      const p = L(R() * Math.PI * 2);
      f.c = 3;
      f.put(p[0] + gauss() * 0.25, p[1] + gauss() * 0.25, p[2] + gauss() * 0.25);
    });
    return b;
  }

  /* Marketing — a megaphone with three sound waves. */
  function fMegaphone(): Formation {
    const b = makeBuf(), f = filler(b);
    dust(f);
    const n = N - DUST, x0 = -2.6, x1 = 0.9, r0 = 0.42, r1 = 1.75, tilt = 0.18;
    const P = (x: number, y: number, z: number): [number, number, number] => {
      const c = Math.cos(tilt), s2 = Math.sin(tilt);
      return [x * c - y * s2, x * s2 + y * c, z];
    };
    // cone surface
    f.c = 0;
    for (let k = 0; k < n * 0.22; k++) {
      const u = Math.pow(R(), 0.8), a = R() * Math.PI * 2, r = lerp(r0, r1, u);
      f.put(...P(lerp(x0, x1, u), Math.cos(a) * r, Math.sin(a) * r));
    }
    f.c = 4;
    for (let k = 0; k < n * 0.07; k++) {
      const a = R() * Math.PI * 2;
      f.put(...P(x1, Math.cos(a) * r1, Math.sin(a) * r1));
    }
    // mouthpiece and handle
    f.c = 0;
    for (let k = 0; k < n * 0.03; k++) {
      const a = R() * Math.PI * 2;
      f.put(...P(x0 - R() * 0.5, Math.cos(a) * r0 * 0.9, Math.sin(a) * r0 * 0.9));
    }
    for (let k = 0; k < n * 0.03; k++) { const u = R(); f.put(...P(-1.4 + u * 0.2, -0.75 - u * 1.0, 0)); }
    // sound going out
    f.c = 4;
    [1.3, 2.2, 3.1].forEach((d, i) => {
      for (let k = 0; k < n * (0.07 - i * 0.012); k++) {
        const a = rnd(-0.75, 0.75);
        f.put(...P(x1 + 0.2 + Math.cos(a) * d, Math.sin(a) * d, gauss() * 0.05));
      }
    });
    f.c = 5;
    for (let k = 0; k < n * 0.03; k++) {
      const a = rnd(-0.4, 0.4);
      f.put(...P(x1 + 0.2 + Math.cos(a) * 1.3, Math.sin(a) * 1.3, 0));
    }
    topUp(f, () => {
      f.c = R() < 0.5 ? 4 : 0;
      const a = rnd(-0.8, 0.8), d = rnd(1, 4);
      f.put(...P(x1 + Math.cos(a) * d, Math.sin(a) * d, gauss() * 0.3));
    });
    return b;
  }

  /* The resting world: one wide horizon ring of light, a deep sparse field. */
  function fCalm(): Formation {
    const b = makeBuf(), f = filler(b);
    dust(f);
    const n = N - DUST;
    f.c = 5;
    for (let k = 0; k < n * 0.16; k++) {
      const a = Math.PI + R() * Math.PI, r = 26 + gauss() * 0.15;
      f.put(Math.cos(a) * r, -6.4 + Math.sin(a) * 1.6 + gauss() * 0.04, -14 - Math.sin(a) * 6);
    }
    f.c = 0;
    topUp(f, () => f.put(rnd(-30, 30), rnd(-16, 16), rnd(-60, -8)));
    return b;
  }

  /** The screening room: a lit edge and a pool of light under each screen. */
  function fScreens(tints: number[]): Formation {
    const b = makeBuf(), f = filler(b);
    dust(f);
    const n = N - DUST;
    SCR.forEach((s, i) => {
      const c = Math.cos(s.ry), si = Math.sin(s.ry);
      const L = (x: number, y: number, z: number): [number, number, number] =>
        [s.x + x * c + z * si, s.y + y, s.z - x * si + z * c];
      f.c = tints[i];
      for (let k = 0; k < n * 0.05; k++) {
        const w = SW + 0.3, h = SH + 0.3, per = 2 * (w + h), t = R() * per;
        let x: number, y: number;
        if (t < w) { x = -w / 2 + t; y = -h / 2; }
        else if (t < w + h) { x = w / 2; y = -h / 2 + (t - w); }
        else if (t < 2 * w + h) { x = w / 2 - (t - w - h); y = h / 2; }
        else { x = -w / 2; y = h / 2 - (t - 2 * w - h); }
        f.put(...L(x + gauss() * 0.01, y + gauss() * 0.01, 0.02));
      }
      f.c = tints[i];
      for (let k = 0; k < n * 0.04; k++) {
        const a = R() * Math.PI * 2, r = Math.sqrt(R());
        f.put(...L(Math.cos(a) * r * 4.6, -SH / 2 - 1.6, Math.sin(a) * r * 1.6 + 0.8));
      }
    });
    f.c = 0;
    topUp(f, () => f.put(rnd(-34, 34), rnd(-16, 16), rnd(-80, -20)));
    return b;
  }

  /**
   * Samples opaque pixels of a word rendered offscreen, so the visitor's
   * own business name can be drawn in particles.
   */
  function textPts(str: string, W: number, H: number): () => [number, number] {
    const cv = document.createElement("canvas");
    const cw = 1600, ch = 360;
    cv.width = cw;
    cv.height = ch;
    const x = cv.getContext("2d");
    if (!x) return () => [0, 0];
    let fs = 280;
    const face = "Geist, ui-sans-serif, system-ui, sans-serif";
    x.font = `600 ${fs}px ${face}`;
    let m = x.measureText(str).width;
    if (m > cw * 0.95) {
      fs *= (cw * 0.95) / m;
      x.font = `600 ${fs}px ${face}`;
      m = x.measureText(str).width;
    }
    x.textAlign = "center";
    x.textBaseline = "middle";
    x.fillStyle = "#fff";
    x.fillText(str, cw / 2, ch / 2);
    const d = x.getImageData(0, 0, cw, ch).data;
    const sc = Math.min(W / m, H / (fs * 1.05));
    return () => {
      for (let g = 0; g < 80; g++) {
        const px = (R() * cw) | 0, py = (R() * ch) | 0;
        if (d[(py * cw + px) * 4 + 3] > 140) return [(px - cw / 2) * sc, -(py - ch / 2) * sc];
      }
      return [0, 0];
    };
  }

  const nameY = () => (isSmall() ? 0.35 : -0.55);

  function fName(str: string): Formation {
    const b = makeBuf(), f = filler(b);
    dust(f);
    const S = textPts(str, isSmall() ? 4.3 : 11.2, isSmall() ? 1.4 : 2.4);
    const y = nameY();
    f.c = 0;
    topUp(f, () => {
      const [x, yy] = S();
      f.c = R() < 0.12 ? 5 : 0;
      f.put(x, y + yy, gauss() * 0.05);
    });
    return b;
  }

  /**
   * The six world formations as SEPARATE steps, one per idle callback.
   *
   * The spec asks for one formation per callback; building all six in
   * one task cost a measured 352ms, against a target of none over 100ms.
   * `calm` is first because the loop can start on it alone.
   */
  type Step = [keyof FilmFormations, () => Formation];
  function worldSteps(screenTints: number[]): Step[] {
    const pl = svcPlace();
    const wide: Place = isSmall() ? [0.27, 0.6, 2.0, 0] : pl;
    const appPlace: Place = isSmall() ? pl : [0.72, 4.6, 0.1, 0];
    const mapPlace: Place = isSmall() ? [0.3, 0.15, 2.0, 0] : [0.56, 3.7, 0.1, 0];
    return [
      ["calm", () => fCalm()],
      ["web", () => shift(fBrowser(), ...pl)],
      ["app", () => shift(fTiles(), ...appPlace)],
      ["flow", () => shift(fLoop(), ...wide)],
      ["map", () => shift(fMegaphone(), ...mapPlace)],
      ["scr", () => fScreens(screenTints)],
    ];
  }

  return { DUST, worldSteps, fName, fCalm, fBrowser, fTiles, fLoop, fMegaphone, fScreens, textPts, rrect, shift };
}
