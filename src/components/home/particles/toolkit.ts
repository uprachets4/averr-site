/**
 * The particle toolkit — ONE copy, shared by the hero and the film.
 *
 * Both reference files (`docs/reference/hero/hero-v6-reference.html` and
 * `docs/reference/home-film/index.html`) carry this code byte for byte.
 * Spec 30 requires it live in one module that both import rather than
 * being copied, so this is it; the hero's own shapes stay in
 * `planet/formations.ts` and the film's in `film/formations.ts`.
 *
 * Every point carries a TINT id:
 *   0 white · 1 Websites · 2 Web Apps · 3 AI Automation · 4 Marketing
 *   5 the studio gradient
 * The shaders turn those ids into the service colours.
 */

/** One formation: a flat xyz buffer and the tint id of each point. */
export type Formation = {
  pos: Float32Array;
  tint: Float32Array;
  /** Set by the film's name formation so the loop can tell rebuilds apart. */
  id?: number;
};

/** [startIndex, endIndex) into the buffers, one per ring. */
export type RingRange = [number, number];

export type Pt = [number, number, number];

export const R = Math.random;
export const rnd = (a: number, b: number) => a + R() * (b - a);
export const gauss = () => (R() + R() + R() - 1.5) / 1.5;
export const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const smooth = (t: number) => {
  const x = clamp(t, 0, 1);
  return x * x * (3 - 2 * x);
};

export function rotX(x: number, y: number, z: number, a: number): Pt {
  const c = Math.cos(a);
  const si = Math.sin(a);
  return [x, y * c - z * si, y * si + z * c];
}

/** Weighted choice between point generators. */
export function pick(list: Array<[number, () => Pt]>): Pt {
  let T = 0;
  list.forEach((o) => (T += o[0]));
  let r = R() * T;
  for (const o of list) {
    if ((r -= o[0]) <= 0) return o[1]();
  }
  return list[list.length - 1][1]();
}

/** The drawing surface a formation writes into. */
export type Filler = {
  /** current tint id; every `put` after this takes it */
  c: number;
  readonly i: number;
  put(x: number, y: number, z: number): void;
  edgeRect(x0: number, y0: number, w: number, h: number, z: number, n: number, j?: number): void;
  fillRect(x0: number, y0: number, w: number, h: number, z: number, n: number, j?: number): void;
  circle(
    cx: number, cy: number, cz: number, r: number, n: number,
    plane?: "xy" | "xz", j?: number, a0?: number, a1?: number,
  ): void;
  sphere(cx: number, cy: number, cz: number, r: number, n: number): void;
  line(ax: number, ay: number, az: number, bx: number, by: number, bz: number, n: number, j?: number): void;
  poly(pts: number[][], z: number, n: number, j?: number): void;
  star(cx: number, cy: number, z: number, r: number, n: number): void;
  box(x0: number, y0: number, z0: number, w: number, h: number, d: number, n: number): void;
};

/**
 * Builds the toolkit for one particle count.
 *
 * `N` is fixed for the life of an engine, so every formation it makes
 * shares the same buffer length and the shader can morph any pair of them
 * attribute for attribute. The hero and the film run different counts
 * (30,000/14,000 and 24,000/12,000), which is why this is a factory.
 */
export function createToolkit(N: number) {
  const DUST = Math.floor(N * 0.07);

  /* The dust is the same cloud in every formation of one engine, so it is
     seeded once and replayed — otherwise it would churn on every morph. */
  const dustSeed = new Float32Array(DUST * 3);
  for (let k = 0; k < DUST; k++) {
    dustSeed[k * 3] = rnd(-14, 14);
    dustSeed[k * 3 + 1] = rnd(-8, 8);
    dustSeed[k * 3 + 2] = rnd(-10, 4);
  }

  function makeBuf(): Formation {
    return { pos: new Float32Array(N * 3), tint: new Float32Array(N) };
  }

  function filler(buf: Formation, skip?: RingRange): Filler {
    let i = 0;
    const put = (x: number, y: number, z: number) => {
      if (skip && i === skip[0]) i = skip[1];
      if (i < N) {
        buf.pos[i * 3] = x;
        buf.pos[i * 3 + 1] = y;
        buf.pos[i * 3 + 2] = z;
        buf.tint[i] = f.c;
        i++;
      }
    };

    const f: Filler = {
      c: 0,
      put,
      get i() {
        return i;
      },
      edgeRect(x0, y0, w, h, z, n, j = 0.012) {
        for (let k = 0; k < n; k++) {
          const s = R() * 2 * (w + h);
          let x: number, y: number;
          if (s < w) { x = x0 + s; y = y0; }
          else if (s < w + h) { x = x0 + w; y = y0 + (s - w); }
          else if (s < 2 * w + h) { x = x0 + w - (s - w - h); y = y0 + h; }
          else { x = x0; y = y0 + h - (s - 2 * w - h); }
          put(x + gauss() * j, y + gauss() * j, z + gauss() * j);
        }
      },
      fillRect(x0, y0, w, h, z, n, j = 0.02) {
        for (let k = 0; k < n; k++) put(x0 + R() * w, y0 + R() * h, z + gauss() * j);
      },
      circle(cx, cy, cz, r, n, plane = "xy", j = 0.012, a0 = 0, a1 = Math.PI * 2) {
        for (let k = 0; k < n; k++) {
          const a = a0 + R() * (a1 - a0);
          const u = Math.cos(a) * r;
          const v = Math.sin(a) * r;
          if (plane === "xy") put(cx + u + gauss() * j, cy + v + gauss() * j, cz + gauss() * j);
          else put(cx + u + gauss() * j, cy + gauss() * j, cz + v + gauss() * j);
        }
      },
      sphere(cx, cy, cz, r, n) {
        for (let k = 0; k < n; k++) {
          const u = R() * 2 - 1;
          const a = R() * Math.PI * 2;
          const s = Math.sqrt(1 - u * u);
          put(cx + s * Math.cos(a) * r, cy + u * r, cz + s * Math.sin(a) * r);
        }
      },
      line(ax, ay, az, bx, by, bz, n, j = 0.012) {
        for (let k = 0; k < n; k++) {
          const t = R();
          put(
            ax + (bx - ax) * t + gauss() * j,
            ay + (by - ay) * t + gauss() * j,
            az + (bz - az) * t + gauss() * j,
          );
        }
      },
      poly(pts, z, n, j = 0.01) {
        const L: number[] = [];
        let T = 0;
        for (let k = 0; k < pts.length - 1; k++) {
          const d = Math.hypot(pts[k + 1][0] - pts[k][0], pts[k + 1][1] - pts[k][1]);
          L.push(d);
          T += d;
        }
        for (let k = 0; k < n; k++) {
          let r = R() * T;
          let s = 0;
          while (r > L[s] && s < L.length - 1) { r -= L[s]; s++; }
          const t = r / L[s];
          put(
            pts[s][0] + (pts[s + 1][0] - pts[s][0]) * t + gauss() * j,
            pts[s][1] + (pts[s + 1][1] - pts[s][1]) * t + gauss() * j,
            z + gauss() * j,
          );
        }
      },
      star(cx, cy, z, r, n) {
        const p: number[][] = [];
        for (let k = 0; k <= 10; k++) {
          const a = Math.PI / 2 + (k * Math.PI) / 5;
          const rr = k % 2 ? r * 0.42 : r;
          p.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr]);
        }
        this.poly(p, z, n, 0.006);
        for (let k = 0; k < n * 0.6; k++) {
          const a = R() * Math.PI * 2;
          const rr = r * 0.38 * Math.sqrt(R());
          put(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr, z);
        }
      },
      box(x0, y0, z0, w, h, d, n) {
        const A = [w * h, w * h, w * d, w * d, h * d, h * d];
        const T = A.reduce((a, b) => a + b);
        for (let k = 0; k < n; k++) {
          let r = R() * T;
          let s = 0;
          while (r > A[s]) { r -= A[s]; s++; }
          const u = R();
          const v = R();
          let x: number, y: number, z: number;
          switch (s) {
            case 0: x = u * w; y = v * h; z = 0; break;
            case 1: x = u * w; y = v * h; z = d; break;
            case 2: x = u * w; y = 0; z = v * d; break;
            case 3: x = u * w; y = h; z = v * d; break;
            case 4: x = 0; y = u * h; z = v * d; break;
            default: x = w; y = u * h; z = v * d;
          }
          put(x0 + x, y0 + y, z0 + z);
        }
      },
    };
    return f;
  }

  function dust(f: Filler) {
    f.c = 0;
    for (let k = 0; k < DUST; k++) f.put(dustSeed[k * 3], dustSeed[k * 3 + 1], dustSeed[k * 3 + 2]);
  }

  /** Fill whatever budget a formation left over, so no point is stranded. */
  function topUp(f: Filler, fn: () => void) {
    let g = 0;
    while (f.i < N && g < N * 4) { fn(); g++; }
  }

  const inRect =
    (x: number, y: number, w: number, h: number, z: number, j = 0.02) =>
    (): Pt => [x + R() * w, y + R() * h, z + gauss() * j];

  return { N, DUST, makeBuf, filler, dust, topUp, inRect };
}

export type Toolkit = ReturnType<typeof createToolkit>;
