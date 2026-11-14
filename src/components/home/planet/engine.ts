/**
 * The Planet hero's three.js scene, ported from
 * `docs/reference/hero/hero-v6-reference.html`.
 *
 * Two renderers over one set of typed arrays: `#back` draws everything
 * except ring particles in front of the planet's centre, `#front` draws
 * only those, over the copy. Each has its own BufferGeometry; the
 * attribute arrays are shared, so a morph is written once.
 *
 * WHY THE FRAME LOOP WRITES THE DOM ITSELF, rather than handing the beats,
 * the rail, the sweep and the takeover to motion: the stage is
 * `position: sticky`. Inside a pin, motion hardware-accelerates a
 * scroll-linked `opacity` or `clip-path` onto a ViewTimeline that never
 * advances, and WAAPI then outranks inline style — handoff §5.1 and
 * §5.86, the bug that cost two sessions and shipped a dark hero frame.
 * One rAF writing `style` directly is the shape those two gotchas
 * prescribe, and it also keeps the canvas and the copy on the same clock.
 *
 * Deviations from the reference, both deliberate:
 *   - DPR is min(dpr, 1.5) below 820px, min(dpr, 2) above, per the spec's
 *     load-order section. The reference uses min(dpr, 2) everywhere.
 *   - three is 0.179.1, not the reference's r128 or the spec's 0.185.x.
 *     ShaderMaterial with gl_FragColor is unchanged across all three, so
 *     no colour-space chunks are added.
 */
import * as THREE from "three";
import { isSoftwareGL, SOFT_FRAME_MS } from "../softGL";
import { createHeroFormations, type Formation } from "./formations";

export type PlanetOpts = {
  story: HTMLElement;
  beats: HTMLElement[];
  rail: HTMLElement[];
  take: HTMLElement;
  takeIn: HTMLElement;
  sweep: HTMLElement | null;
  /** Told when the last formation has been built, for tests and probes. */
  onReady?: () => void;
  /** The four icon slots on the services beat, in stage pixels, untransformed. */
  slots: () => Array<{ x: number; y: number; w: number; h: number }>;
  /** Where the story ends and the takeover begins (0–1 of the story). */
  storyEnd?: number;
  /** Where the services beat is reached; it holds from there to storyEnd. */
  holdEnd?: number;
};

export type PlanetHandle = {
  dispose: () => void;
  /** Scroll the story to chapter `i` of 0..5. */
  goTo: (i: number) => void;
  /** Light one of the four icons (1–4), 0 for all. */
  setFocus: (i: number) => void;
};

export const STORY_END = 0.84;
const SMALL_QUERY = 820;

const VS = `
attribute vec3 aTo; attribute vec3 aSeed; attribute float aRing; attribute float aTF; attribute float aTT; attribute float aGrp;
uniform vec4 uG; uniform float uFourW,uAlpha;
uniform float uMix,uTime,uForce,uSize,uPR,uCalm,uFlare,uFront,uSplit,uSide; uniform vec3 uMouse;
varying float vA; varying vec3 vCol; varying float vTint; varying float vDepth;
vec3 grad(float x){
  vec3 c0=vec3(.976,.686,.592),c1=vec3(.835,.506,.549),c2=vec3(.596,.455,.910),c3=vec3(.439,.553,.973),c4=vec3(.337,.604,.980);
  float s=clamp(x,0.,1.)*4.;
  if(s<1.)return mix(c0,c1,s); if(s<2.)return mix(c1,c2,s-1.); if(s<3.)return mix(c2,c3,s-2.); return mix(c3,c4,s-3.);}
vec3 tc(float k,float gx){
  if(k<.5)return vec3(.961,.957,.976);
  if(k<1.5)return vec3(.976,.686,.592);
  if(k<2.5)return vec3(.835,.506,.549);
  if(k<3.5)return vec3(.596,.455,.910);
  if(k<4.5)return vec3(.337,.604,.980);
  return grad(gx);}
vec3 flow(vec3 p,float t){return vec3(sin(p.y*1.3+t)+sin(p.z*.9-t*.7),sin(p.z*1.1+t*.8)+sin(p.x*.7+t),sin(p.x*1.2-t*.6)+sin(p.y*.8+t*.5))*.5;}
void main(){
  float d=aSeed.x*.45;
  float t=clamp((uMix-d)/.55,0.,1.); t=t*t*(3.-2.*t);
  vec3 p=mix(position,aTo,t);
  float burst=sin(3.14159*t);
  p+=flow(p*.55+aSeed*5.,uTime*.35*uCalm)*(.03+burst*1.35)*mix(.4,1.,aSeed.y);
  vec2 dm=p.xy-uMouse.xy; float dist=length(dm);
  float f=exp(-dist*dist/.9)*uForce;
  vec2 dir=dm/(dist+1e-3);
  p.xy+=dir*f*.42+vec2(-dir.y,dir.x)*f*.38;
  p.z+=f*.9;
  vec4 mv=modelViewMatrix*vec4(p,1.);
  float isFront=step(.5,aRing)*step(uSplit,mv.z)*step(.5,uFront);
  float keep=uSide>.5?isFront:1.-isFront;
  float gx=p.x/12.+.5+sin(uTime*.25)*.08;
  vCol=mix(tc(aTF,gx),tc(aTT,gx),t);
  vTint=mix(step(.5,aTF),step(.5,aTT),t);
  gl_Position=projectionMatrix*mv;
  gl_PointSize=keep*uSize*uPR*(.55+aSeed.z*.9)*(17./-mv.z)*(1.+f*.6)*(1.+vTint*(.12+uFlare*.7));
  float gm=aGrp<.5?1.:aGrp<1.5?uG.x:aGrp<2.5?uG.y:aGrp<3.5?uG.z:uG.w;
  gl_PointSize*=mix(1.,(.62+gm*.3),uFourW);
  if(keep<.5)gl_Position=vec4(2.,2.,2.,1.);
  vA=(.42+.58*aSeed.z)*clamp(1.2-(-mv.z-14.)*.06,.25,1.)*mix(1.,gm,uFourW)*uAlpha;
  vDepth=clamp((-mv.z-17.4)*.11,0.,.6);
}`;

const FS = `
uniform float uFlare; varying float vA; varying vec3 vCol; varying float vTint; varying float vDepth;
void main(){vec2 c=gl_PointCoord-.5;float r=length(c);if(r>.5)discard;
  vec3 col=mix(vCol,vec3(.137,.157,.216),vDepth);
  col=mix(col,vec3(1.),vTint*uFlare*.25);
  float a=smoothstep(.5,.15,r)*vA*(1.+vTint*(.35+uFlare*.6));
  gl_FragColor=vec4(col,min(a,1.));}`;

/** rIC where it exists, a 300ms timeout where it does not. */
function idle(fn: () => void): () => void {
  const w = window as Window & {
    requestIdleCallback?: (cb: IdleRequestCallback, o?: { timeout: number }) => number;
    cancelIdleCallback?: (h: number) => void;
  };
  if (typeof w.requestIdleCallback === "function") {
    const h = w.requestIdleCallback(() => fn(), { timeout: 300 });
    return () => w.cancelIdleCallback?.(h);
  }
  const h = window.setTimeout(fn, 300);
  return () => window.clearTimeout(h);
}

/**
 * Does this browser actually give us a WebGL context?
 *
 * Checked BEFORE three.js is asked for a renderer: its constructor logs
 * "THREE.WebGLRenderer: Error creating WebGL context." to the console
 * before it throws, and the spec's no-WebGL path requires no errors at
 * all. Probing on a throwaway canvas keeps the real one untouched.
 */
function hasWebGL(): boolean {
  try {
    const c = document.createElement("canvas");
    const gl = (c.getContext("webgl2") || c.getContext("webgl")) as WebGLRenderingContext | null;
    if (!gl) return false;
    /* Release it. A probe context is still a context: leaving two of
       them around (one per engine) put the page at five live contexts
       where it should hold three. */
    gl.getExtension("WEBGL_lose_context")?.loseContext();
    return true;
  } catch {
    return false;
  }
}

export function mount(stage: HTMLElement, opts: PlanetOpts): PlanetHandle {
  const { story, beats, rail, take, takeIn, sweep } = opts;
  const S = beats.length - 1;
  const END = opts.storyEnd ?? STORY_END;
  const HOLD = opts.holdEnd ?? END;

  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isSmall = () => innerWidth < SMALL_QUERY;
  const small0 = isSmall();
  const N = small0 ? 14000 : 30000;
  /* spec: min(dpr,2) desktop, min(dpr,1.5) below 820 */
  const dpr = Math.min(devicePixelRatio || 1, small0 ? 1.5 : 2);

  const backCanvas = stage.querySelector<HTMLCanvasElement>("canvas[data-layer='back']");
  const frontCanvas = stage.querySelector<HTMLCanvasElement>("canvas[data-layer='front']");
  if (!backCanvas || !frontCanvas) throw new Error("planet: canvases missing");
  if (!hasWebGL()) throw new Error("planet: no WebGL");

  const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
  camera.position.set(0, 0, 17);

  const kit = createHeroFormations(N);

  /* Shared attribute arrays — one morph write feeds both layers. */
  const fromA = new Float32Array(N * 3);
  const toA = new Float32Array(N * 3);
  const seedA = new Float32Array(N * 3);
  const ringA = new Float32Array(N);
  const grpA = new Float32Array(N);
  const tfA = new Float32Array(N);
  const ttA = new Float32Array(N);
  for (let i = 0; i < N * 3; i++) seedA[i] = Math.random();

  const uni = {
    uMix: { value: 0 },
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector3(99, 99, 0) },
    uForce: { value: 0 },
    uSize: { value: small0 ? 2.3 : 2.1 },
    uPR: { value: dpr },
    uCalm: { value: reduce ? 0 : 1 },
    uFlare: { value: 0 },
    uFront: { value: 1 },
    uSplit: { value: -17 },
    uG: { value: new THREE.Vector4(1, 1, 1, 1) },
    uFourW: { value: 0 },
    uAlpha: { value: 1 },
  };

  type Layer = {
    r: THREE.WebGLRenderer;
    s: THREE.Scene;
    p: THREE.Points;
    g: THREE.BufferGeometry;
    m: THREE.ShaderMaterial;
    from: THREE.BufferAttribute;
    to: THREE.BufferAttribute;
    tf: THREE.BufferAttribute;
    tt: THREE.BufferAttribute;
  };

  /* CPU-rendered WebGL: 1x pixels, ~12 fps (see softGL.ts). */
  let soft = false;
  let lastDraw = -1e9;
  let softP = -1;
  let softUntil = 0;
  function makeLayer(canvas: HTMLCanvasElement, side: number): Layer {
    const r = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    if (isSoftwareGL(r)) soft = true;
    r.setPixelRatio(soft ? 1 : dpr);
    const g = new THREE.BufferGeometry();
    const from = new THREE.BufferAttribute(fromA, 3);
    const to = new THREE.BufferAttribute(toA, 3);
    const tf = new THREE.BufferAttribute(tfA, 1);
    const tt = new THREE.BufferAttribute(ttA, 1);
    g.setAttribute("position", from);
    g.setAttribute("aTo", to);
    g.setAttribute("aSeed", new THREE.BufferAttribute(seedA, 3));
    g.setAttribute("aRing", new THREE.BufferAttribute(ringA, 1));
    g.setAttribute("aGrp", new THREE.BufferAttribute(grpA, 1));
    g.setAttribute("aTF", tf);
    g.setAttribute("aTT", tt);
    /* Object.assign shares the uniform OBJECTS, so writing uni.uMix.value
       once drives both layers — as in the reference. Only uSide differs. */
    const m = new THREE.ShaderMaterial({
      uniforms: Object.assign({}, uni, { uSide: { value: side } }),
      vertexShader: VS,
      fragmentShader: FS,
      transparent: true,
      depthWrite: false,
    });
    const p = new THREE.Points(g, m);
    p.frustumCulled = false;
    const s = new THREE.Scene();
    s.add(p);
    return { r, s, p, g, m, from, to, tf, tt };
  }

  const L = [makeLayer(backCanvas, 0), makeLayer(frontCanvas, 1)];
  if (soft) uni.uPR.value = 1;
  const pts = L[0].p;

  /* ── formations, built progressively ───────────────────────────────
     ONE FORMATION PER IDLE TASK. Building LOOSE and HERO together in
     mount() made a single ~480ms task — the spec's "split formation
     building if needed". They are two tasks now, and the loop does not
     start until HERO exists; the hero's text has already painted by
     then, so nothing the reader can see is waiting on this. The four
     chapter objects follow, long before the reader can scroll to them. */
  let LOOSE: Formation | null = null;
  let HERO: Formation | null = null;
  const K: Array<Formation | null> = new Array(S + 1).fill(null);
  const DUSTN = Math.floor(N * 0.07);
  for (let i = 0; i < N; i++) grpA[i] = i < DUSTN ? 0 : (i % 4) + 1;
  const VH = 2 * 17 * Math.tan(THREE.MathUtils.degToRad(17));
  /* ── The four service icons, drawn as dotted line-art ──── */
  type P2 = [number, number];
  type Icon = { lines: P2[][]; fills: Array<(r: () => number) => P2>; box: [number, number, number, number] };
  const arc = (cx: number, cy: number, rx: number, ry: number, a0: number, a1: number, n = 48): P2[] => {
    const o: P2[] = [];
    for (let k = 0; k <= n; k++) {
      const a = a0 + ((a1 - a0) * k) / n;
      o.push([cx + Math.cos(a) * rx, cy + Math.sin(a) * ry]);
    }
    return o;
  };
  const circ = (cx: number, cy: number, r: number) => arc(cx, cy, r, r, 0, Math.PI * 2, 40);
  const rr = (x0: number, y0: number, x1: number, y1: number, r: number): P2[] => [
    ...arc(x1 - r, y1 - r, r, r, 0, Math.PI / 2, 8),
    ...arc(x0 + r, y1 - r, r, r, Math.PI / 2, Math.PI, 8),
    ...arc(x0 + r, y0 + r, r, r, Math.PI, Math.PI * 1.5, 8),
    ...arc(x1 - r, y0 + r, r, r, Math.PI * 1.5, Math.PI * 2, 8),
    [x1, y1 - r],
  ];
  const seg = (x0: number, y0: number, x1: number, y1: number): P2[] => [[x0, y0], [x1, y1]];
  const quad = (a: P2, c: P2, b: P2, n = 24): P2[] => {
    const o: P2[] = [];
    for (let k = 0; k <= n; k++) {
      const t = k / n, u = 1 - t;
      o.push([u * u * a[0] + 2 * u * t * c[0] + t * t * b[0], u * u * a[1] + 2 * u * t * c[1] + t * t * b[1]]);
    }
    return o;
  };
  const box = (x0: number, y0: number, x1: number, y1: number) => (r: () => number): P2 => [x0 + r() * (x1 - x0), y0 + r() * (y1 - y0)];
  const disc = (cx: number, cy: number, rad: number) => (r: () => number): P2 => {
    const a = r() * Math.PI * 2, d = Math.sqrt(r()) * rad;
    return [cx + Math.cos(a) * d, cy + Math.sin(a) * d];
  };

  function iconWeb(): Icon {
    return {
      box: [-1.4, -1, 1.4, 1],
      lines: [
        rr(-1.4, -1, 1.4, 1, 0.12),
        seg(-1.4, 0.7, 1.4, 0.7),
        circ(-1.22, 0.85, 0.045), circ(-1.08, 0.85, 0.045), circ(-0.94, 0.85, 0.045),
        rr(-0.7, 0.79, 0.9, 0.92, 0.06),
        seg(-1.15, -0.08, -0.05, -0.08), seg(-1.15, -0.24, -0.35, -0.24),
        rr(-1.15, -0.66, -0.45, -0.44, 0.11),
        rr(0.3, -0.7, 1.18, 0.48, 0.06),
        [[0.36, -0.62], [0.62, -0.22], [0.78, -0.42], [0.98, -0.12], [1.12, -0.62]],
        circ(0.98, 0.24, 0.09),
      ],
      fills: [box(-1.15, 0.3, 0.1, 0.48), box(-1.15, 0.08, -0.15, 0.22), box(-1.12, -0.63, -0.48, -0.47)],
    };
  }
  function iconApp(): Icon {
    return {
      box: [-0.8, -1.2, 1.62, 1.2],
      lines: [
        rr(-0.62, -1.2, 0.62, 1.2, 0.2),
        seg(-0.16, 1.08, 0.16, 1.08),
        seg(-0.62, 0.78, 0.62, 0.78),
        rr(-0.48, 0.3, 0.48, 0.64, 0.08), circ(-0.32, 0.47, 0.08), seg(-0.16, 0.52, 0.3, 0.52), seg(-0.16, 0.4, 0.12, 0.4),
        rr(-0.48, -0.16, 0.48, 0.18, 0.08), circ(-0.32, 0.01, 0.08), seg(-0.16, 0.06, 0.3, 0.06), seg(-0.16, -0.06, 0.12, -0.06),
        rr(-0.48, -0.62, 0.48, -0.28, 0.08), circ(-0.32, -0.45, 0.08), seg(-0.16, -0.4, 0.3, -0.4), seg(-0.16, -0.52, 0.12, -0.52),
        seg(-0.62, -0.86, 0.62, -0.86),
        circ(-0.3, -1.02, 0.05), circ(0, -1.02, 0.05), circ(0.3, -1.02, 0.05),
        rr(0.74, 0.12, 1.62, 0.5, 0.09),
        circ(0.9, 0.31, 0.09),
        [[0.86, 0.31], [0.89, 0.27], [0.95, 0.35]],
        seg(1.06, 0.36, 1.5, 0.36), seg(1.06, 0.25, 1.36, 0.25),
      ],
      fills: [box(-0.46, -0.14, 0.46, 0.16)],
    };
  }
  function iconAI(): Icon {
    const nodes: P2[] = [[-1.25, 0.62], [-1.35, -0.05], [-1.2, -0.72], [1.25, 0.62], [1.35, -0.05], [1.2, -0.72]];
    const lines: P2[][] = [rr(-0.34, -0.34, 0.34, 0.34, 0.07), circ(0, 0, 0.14)];
    for (const k of [-0.18, 0, 0.18]) {
      lines.push(seg(-0.34, k, -0.46, k), seg(0.34, k, 0.46, k), seg(k, 0.34, k, 0.46), seg(k, -0.34, k, -0.46));
    }
    for (const n of nodes) {
      lines.push(circ(n[0], n[1], 0.11));
      const sx = n[0] < 0 ? -0.46 : 0.46;
      lines.push(quad([sx, n[1] * 0.25], [n[0] * 0.55, n[1]], [n[0] - Math.sign(n[0]) * 0.11, n[1]]));
    }
    return {
      box: [-1.46, -0.9, 1.46, 0.9],
      lines,
      fills: [disc(0, 0, 0.12), ...nodes.map((n) => disc(n[0], n[1], 0.07))],
    };
  }
  function iconMap(): Icon {
    const cy = 0.3, R = 0.55;
    const a0 = -Math.PI * 0.2, a1 = Math.PI * 1.2;
    const pinArc = arc(0, cy, R, R, a0, a1, 60);
    const tip: P2 = [0, -0.72];
    return {
      box: [-1.15, -1.0, 1.15, 0.92],
      lines: [
        pinArc,
        [pinArc[pinArc.length - 1], tip],
        [tip, pinArc[0]],
        circ(0, cy, 0.2),
        arc(0, -0.76, 0.55, 0.12, 0, Math.PI * 2, 48),
        arc(0, -0.78, 1.0, 0.22, 0, Math.PI * 2, 64),
      ],
      fills: [disc(0, cy, 0.17)],
    };
  }
  const ICONS = [iconWeb, iconApp, iconAI, iconMap];

  /** The four service icons, each fitted into its DOM slot. */
  function buildIcons() {
    const W = stage.clientWidth;
    const H = stage.clientHeight;
    const slots = opts.slots();
    const out: Formation = { pos: new Float32Array(N * 3), tint: new Float32Array(N) };
    const R0 = Math.random;
    for (let s = 0; s < 4; s++) {
      const ic = ICONS[s]();
      const r = slots[s];
      const rw = (r.w / H) * VH, rh = (r.h / H) * VH;
      const [bx0, by0, bx1, by1] = ic.box;
      const k = Math.min(rw / (bx1 - bx0), rh / (by1 - by0)) * 0.8;
      const wx = ((r.x + r.w / 2 - W / 2) / H) * VH;
      const wy = (-(r.y + r.h / 2 - H / 2) / H) * VH;
      const cx = (bx0 + bx1) / 2, cy = (by0 + by1) / 2;
      // cumulative lengths over every segment of every polyline
      const segs: Array<[P2, P2, number]> = [];
      let L = 0;
      for (const pl of ic.lines) for (let j = 1; j < pl.length; j++) {
        const a = pl[j - 1], b = pl[j];
        const l = Math.hypot(b[0] - a[0], b[1] - a[1]);
        if (l > 0) { L += l; segs.push([a, b, L]); }
      }
      const idx: number[] = [];
      for (let i = DUSTN; i < N; i++) if (i % 4 === s) idx.push(i);
      const nFill = ic.fills.length ? Math.floor(idx.length * 0.16) : 0;
      const nLine = idx.length - nFill;
      idx.forEach((i, q) => {
        let x: number, y: number;
        if (q < nLine) {
          const t = ((q + R0() * 0.5) / nLine) * L;
          let lo = 0, hi = segs.length - 1;
          while (lo < hi) { const m = (lo + hi) >> 1; if (segs[m][2] < t) lo = m + 1; else hi = m; }
          const [a, b, cum] = segs[lo];
          const l = Math.hypot(b[0] - a[0], b[1] - a[1]);
          const u = 1 - (cum - t) / l;
          x = a[0] + (b[0] - a[0]) * u + (R0() - 0.5) * 0.018;
          y = a[1] + (b[1] - a[1]) * u + (R0() - 0.5) * 0.018;
        } else {
          [x, y] = ic.fills[q % ic.fills.length](R0);
        }
        out.pos[i * 3] = (x - cx) * k + wx;
        out.pos[i * 3 + 1] = (y - cy) * k + wy;
        out.pos[i * 3 + 2] = (R0() - 0.5) * 0.06;
        out.tint[i] = s + 1;
      });
    }
    const base = HERO ?? LOOSE;
    if (base) for (let i = 0; i < DUSTN; i++) {
      out.pos[i * 3] = base.pos[i * 3];
      out.pos[i * 3 + 1] = base.pos[i * 3 + 1];
      out.pos[i * 3 + 2] = base.pos[i * 3 + 2];
      out.tint[i] = base.tint[i];
    }
    K[S] = out;
    lastSeg = -9;
  }

  const builders: Array<() => void> = [
    function loose() {
      LOOSE = kit.fHero(true);
    },
    function hero() {
      HERO = kit.fHero(false);
      /* the ring ranges are defined by the first fHero call */
      kit.rings().forEach((r, k) => {
        for (let i = r[0]; i < r[1]; i++) ringA[i] = k + 1;
      });
      K[0] = HERO;
      K[1] = LOOSE;
      buildIcons();
      start();
    },
  ];

  let cancelIdle: (() => void) | null = null;
  let disposed = false;

  function buildNext() {
    if (disposed) return;
    const next = builders.shift();
    if (!next) {
      opts.onReady?.();
      return;
    }
    next();
    /* a formation landing can complete a pair the loop was waiting for */
    lastSeg = -9;
    cancelIdle = idle(buildNext);
  }
  cancelIdle = idle(buildNext);

  function setPair(a: Formation, b: Formation) {
    fromA.set(a.pos);
    toA.set(b.pos);
    tfA.set(a.tint);
    ttA.set(b.tint);
    L.forEach((l) => {
      l.from.needsUpdate = true;
      l.to.needsUpdate = true;
      l.tf.needsUpdate = true;
      l.tt.needsUpdate = true;
    });
  }

  /* ── layout + pointer ──────────────────────────────────────────── */
  const ptr = { x: 0, y: 0, tx: 0, ty: 0, in: false, force: 0 };
  function onPointerMove(e: PointerEvent) {
    const r = stage.getBoundingClientRect();
    ptr.tx = ((e.clientX - r.left) / r.width) * 2 - 1;
    ptr.ty = -(((e.clientY - r.top) / r.height) * 2 - 1);
    ptr.in = true;
  }
  function onPointerLeave() {
    ptr.in = false;
  }
  addEventListener("pointermove", onPointerMove, { passive: true });
  document.addEventListener("pointerleave", onPointerLeave);

  function resize() {
    const w = stage.clientWidth;
    const h = stage.clientHeight;
    L.forEach((l) => l.r.setSize(w, h, false));
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    clearTimeout(fourT);
    fourT = window.setTimeout(buildIcons, 180);
  }
  let fourT = 0;
  addEventListener("resize", resize);
  resize();

  /* ── scroll story ──────────────────────────────────────────────── */
  let lastSeg = -9;
  function progress() {
    const r = story.getBoundingClientRect();
    const total = story.offsetHeight - innerHeight;
    return Math.min(1, Math.max(0, -r.top / total));
  }

  function goTo(i: number) {
    const total = story.offsetHeight - innerHeight;
    const top = story.getBoundingClientRect().top + scrollY;
    scrollTo({
      top: top + total * (i / S) * END + 2,
      behavior: reduce ? "auto" : "smooth",
    });
  }
  const railHandlers = rail.map((b, i) => {
    const h = () => goTo(i);
    b.addEventListener("click", h);
    return h;
  });

  const inv = new THREE.Matrix4();
  const ray = new THREE.Raycaster();
  const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
  const hit = new THREE.Vector3();
  const v2 = new THREE.Vector2();
  /* CPU-rendered WebGL starts with the intro already settled (rings in
     orbit) rather than spending ~2.5 s of 90 ms frames assembling them. */
  const t0 = performance.now() - (soft ? 2600 : 0);
  let smoothQ = 0;
  let focus = 0;
  const gW = [1, 1, 1, 1];
  let lockT = reduce ? -99 : 1.75;
  let flared = 0;
  let swept = false;
  const sm = (x: number) => x * x * (3 - 2 * x);

  /* The loop idles while the story is off screen (and while the tab is
     hidden), so a reader three chapters below is not paying for 30,000
     particles. */
  let onScreen = true;
  const io = new IntersectionObserver(
    (entries) => {
      onScreen = entries.some((e) => e.isIntersecting);
    },
    { rootMargin: "100px" },
  );
  io.observe(story);

  let raf = 0;
  let started = false;
  /** Called by the `hero` build step: nothing renders before HERO. */
  function start() {
    if (started || disposed) return;
    started = true;
    raf = requestAnimationFrame(frame);
  }

  function frame(now: number) {
    raf = requestAnimationFrame(frame);
    if (document.hidden || !onScreen) return;
    if (soft) {
      /* CPU-rendered: animate during the intro, while the page scrolls or
         eases, and while the pointer is over the scene; otherwise the canvas
         keeps its last frame and nothing is drawn. */
      const P0 = progress();
      const q0 = Math.min(P0 / HOLD, 1) * S;
      const busy =
        now - t0 < 2400 || Math.abs(P0 - softP) > 1e-4 || Math.abs(q0 - smoothQ) > 1e-3 || ptr.in || ptr.force > 0.01;
      if (busy && lastDraw > 0) softUntil = now + 1500; // let eased values (focus, morphs) settle
      if (now > softUntil && lastDraw > 0) return;
      if (now - lastDraw < SOFT_FRAME_MS) return;
      lastDraw = now;
      softP = P0;
    }
    const t = (now - t0) / 1000;
    const P = progress();
    const q = Math.min(P / HOLD, 1) * S;
    smoothQ += (q - smoothQ) * (reduce ? 1 : 0.12);

    // on load the rings arrive scattered and lock into orbit
    const intro = reduce ? 1 : Math.min(1, Math.max(0, (t - 0.3) / 1.45));
    let seg = Math.min(S - 1, Math.floor(smoothQ));
    const local = smoothQ - seg;
    if (intro < 1 && smoothQ < 0.02) seg = -1;
    if (seg !== lastSeg) {
      if (seg < 0) {
        /* LOOSE lands one idle task before HERO, so on the very first
           frames the scattered intro may not exist yet; the planet then
           simply starts locked rather than morphing from nothing. */
        if (LOOSE && HERO) {
          setPair(LOOSE, HERO);
          lastSeg = seg;
        }
      } else {
        const a = K[seg];
        const b = K[seg + 1];
        /* a chapter whose formation has not been built yet holds the last
           pair rather than morphing to nothing; buildNext resets lastSeg
           so this is retried the moment it lands */
        if (a && b) {
          setPair(a, b);
          lastSeg = seg;
        }
      }
    }
    uni.uMix.value = seg < 0 ? intro : Math.min(1, local / 0.6);
    uni.uTime.value = t;
    // light sweeps across "seriously." as the rings lock
    if (!swept && !reduce && t > 1.45) {
      swept = true;
      sweep?.classList.add("go");
    }

    // one flare of light each time a chapter's object settles
    const near = Math.round(smoothQ);
    if (Math.abs(smoothQ - near) < 0.05 && near !== flared && near > 0) {
      flared = near;
      lockT = t;
    }
    if (Math.abs(smoothQ - flared) > 0.6 && flared > 0) flared = -1;
    const ft = t - lockT;
    uni.uFlare.value = reduce ? 0 : ft > 0 ? Math.exp(-ft * 1.5) * Math.min(1, ft * 8) : 0;
    const heroW = Math.max(0, 1 - smoothQ * 2.5);
    const endW = 0;
    uni.uFront.value = heroW > 0.5 ? 1 : 0;
    const fourW = sm(Math.max(0, Math.min(1, smoothQ - (S - 1))));
    uni.uFourW.value = fourW;
    uni.uAlpha.value = 1;
    for (let g = 0; g < 4; g++) {
      const tgt = focus === 0 || focus === g + 1 ? 1 : 0.22;
      gW[g] += (tgt - gW[g]) * (reduce ? 1 : 0.1);
    }
    uni.uG.value.set(gW[0], gW[1], gW[2], gW[3]);


    const small = isSmall();
    /* Owner instruction, Session 29: below 380 the setup line runs to
       three lines and the top ring reaches up into it. The planet drops
       so the line clears; the takeover's circle centre is derived from
       the same `py`, so it follows without a second number. */
    const narrow = innerWidth < 380;
    beats.forEach((b, i) => {
      const d = Math.abs(smoothQ - i);
      const o = Math.max(0, Math.min(1, 1 - (d - 0.2) / 0.32));
      b.style.opacity = o.toFixed(3);
      b.dataset.on = o > 0.6 ? "1" : "0";
      const y = smoothQ - i;
      const top = b.children[0] as HTMLElement;
      const bot = b.children[1] as HTMLElement;
      top.style.transform = `translateY(${(y * -70).toFixed(1)}px)`;
      bot.style.transform = `translateY(${(y * -110).toFixed(1)}px)`;
    });
    if (!reduce && t < 1.6) {
      const k = sm(Math.min(1, t / 1.1));
      (beats[0].children[0] as HTMLElement).style.transform = `translateY(${((1 - k) * 16).toFixed(1)}px)`;
      (beats[0].children[1] as HTMLElement).style.transform = `translateY(${((1 - k) * 28).toFixed(1)}px)`;
    }
    rail.forEach((b, i) => b.setAttribute("aria-current", i === near ? "true" : "false"));

    const book = Math.max(heroW, endW);
    const sc = small
      ? THREE.MathUtils.lerp(0.38, 0.56, book)
      : THREE.MathUtils.lerp(0.72, 0.64, sm(book));
    const py = narrow
      ? THREE.MathUtils.lerp(1.0, 0.38, book)
      : small
        ? THREE.MathUtils.lerp(1.0, 0.7, book)
        : THREE.MathUtils.lerp(0.55, 1.1, sm(book));
    ptr.x += (ptr.tx - ptr.x) * 0.07;
    ptr.y += (ptr.ty - ptr.y) * 0.07;
    const spin = reduce ? 0 : t * 0.07;
    const ry =
      (-0.42 + ptr.x * 0.35 + Math.sin(t * 0.18) * 0.06 * (reduce ? 0 : 1)) *
        THREE.MathUtils.lerp(0.55, 1, book) +
      spin * book;
    const rx = 0.12 - ptr.y * 0.16;
    const L4 = THREE.MathUtils.lerp;
    L.forEach((l) => {
      l.p.position.set(0, L4(py, 0, fourW), 0);
      l.p.scale.setScalar(L4(sc, 1, fourW));
      l.p.rotation.set(L4(rx, -ptr.y * 0.05, fourW), L4(ry, ptr.x * 0.08, fourW), 0);
    });
    uni.uSplit.value = -camera.position.z;

    ptr.force += ((ptr.in && !reduce ? 1 : 0) - ptr.force) * 0.08;
    if (ptr.in) {
      v2.set(ptr.x, ptr.y);
      ray.setFromCamera(v2, camera);
      pts.updateMatrixWorld();
      if (ray.ray.intersectPlane(plane, hit)) {
        inv.copy(pts.matrixWorld).invert();
        hit.applyMatrix4(inv);
        uni.uMouse.value.copy(hit);
      }
    }
    uni.uForce.value = ptr.force;

    // takeover: light opens out of the planet's core into the rest of the page
    const k = END >= 1 ? 0 : Math.max(0, Math.min(1, (P - END) / (1 - END - 0.04)));
    const e = k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
    const W = stage.clientWidth;
    const H = stage.clientHeight;
    const cy = H / 2 - (py / (2 * Math.tan(THREE.MathUtils.degToRad(17)) * 17)) * H;
    take.style.clipPath = `circle(${(e * Math.hypot(W, H) * 0.75).toFixed(1)}px at 50% ${cy.toFixed(1)}px)`;
    takeIn.style.opacity = Math.max(0, (k - 0.55) / 0.45).toFixed(2);

    /* ...and then the stage itself dissolves, uncovering the film.
       The circle finishes covering this stage well before the story's
       scroll ends, and it paints the same gradient the film's stage
       does, so from that point on there was nothing on screen: one
       empty navy frame at 390 and at 1440 both. The film now lies
       directly under this stage (`.hf-film` is pulled up 100vh), so
       fading the stage out across the end of the flood hands straight
       over to "In good company" instead of to a blank. No act moves;
       the flood itself is untouched.

       The window matters. The circle's radius is `e * hypot(W,H) * .75`,
       which covers this stage's farthest corner at e ~= .70, i.e. k ~=
       .58 at 390x844 and ~= .57 at 1440x900. Start the dissolve there
       and the copy is already behind the flood, so no two blocks of
       text ever cross-fade; start it later and the blank frame comes
       back in between. */
    const stageOp = 1 - Math.max(0, Math.min(1, (k - 0.56) / 0.24));
    stage.style.opacity = stageOp.toFixed(3);
    /* Once it has dissolved it is still there, on top of the film, with
       a chapter rail that would go on taking clicks. */
    stage.style.pointerEvents = stageOp < 0.02 ? "none" : "";

    L.forEach((l) => l.r.render(l.s, camera));
  }
  function dispose() {
    disposed = true;
    cancelAnimationFrame(raf);
    cancelIdle?.();
    io.disconnect();
    clearTimeout(fourT);
    removeEventListener("resize", resize);
    removeEventListener("pointermove", onPointerMove);
    document.removeEventListener("pointerleave", onPointerLeave);
    rail.forEach((b, i) => b.removeEventListener("click", railHandlers[i]));
    /* SPA navigation away and back must not leak a WebGL context. */
    L.forEach((l) => {
      l.g.dispose();
      l.m.dispose();
      l.r.dispose();
      l.r.forceContextLoss();
    });
  }

  return { dispose, goTo, setFocus: (i: number) => { focus = i; } };
}
