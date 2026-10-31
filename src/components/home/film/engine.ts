/**
 * The home film's three.js scene, ported from
 * `docs/reference/home-film/index.html`.
 *
 * One renderer, one scene: a particle system that morphs through the
 * acts, three screen meshes carrying real recordings with reflections,
 * a camera that flies into the screening room, and the stage light that
 * takes the colour of whatever is on screen.
 *
 * WHY THE LOOP WRITES THE DOM ITSELF rather than handing the layers to
 * motion: the stage is `position: sticky`. Inside a pin, motion compiles
 * a scroll-linked `opacity` onto a ViewTimeline that never advances and
 * WAAPI then outranks inline style — handoff §5.1 and §5.86. One rAF
 * writing `style` directly is what those gotchas prescribe, and it keeps
 * the canvas, the copy and the camera on one clock.
 *
 * Deviations from the reference, both structural rather than visual:
 *  - the credits and the outcome cards are rendered once by React and
 *    shown/hidden here, where the reference rewrites `innerHTML` on each
 *    camera move. Same copy, same timing, no string HTML in a component.
 *  - DPR is min(dpr,1.5) below 820 and min(dpr,2) above, per the spec.
 */
import * as THREE from "three";
import { clamp, smooth as sm, type Formation } from "../particles/toolkit";
import { createFilmFormations, isSmall, SCR, SH, SW, type FilmFormations } from "./formations";
import { PROJECTS, SERVICES } from "./content";

export type FilmOpts = {
  film: HTMLElement;
  light: HTMLElement;
  layers: {
    partners: HTMLElement;
    services: HTMLElement;
    work: HTMLElement;
    signature: HTMLElement;
    finale: HTMLElement;
  };
  marks: HTMLElement[];
  vIntro: HTMLElement;
  beats: HTMLElement[];
  rail: HTMLElement[];
  wTop: HTMLElement;
  credits: HTMLElement[];
  counter: HTMLElement;
  sigCanvas: HTMLCanvasElement;
  sigSvg: SVGSVGElement;
  sigWord: SVGTextElement;
  outs: HTMLElement[];
  ts: HTMLElement;
  /** The name the visitor typed, or "" for the placeholder. */
  getName: () => string;
};

export type FilmHandle = {
  dispose: () => void;
  /** Rebuild the particle name after the field settles. */
  setName: () => void;
};

/* ── the act timeline, verbatim ───────────────────────────────────── */
export const T = {
  pS: 0, pE: 0.1,
  vS: 0.1, vI: 0.165, vE: 0.425,
  wS: 0.425, wE: 0.68,
  sS: 0.68, sE: 0.82,
  fS: 0.82,
};
const BEAT = [0.165, 0.23, 0.295, 0.36, 0.425];
const WIN: Array<[string, string, number, number]> = [
  ["calm", "web", 0.152, 0.172],
  ["web", "app", 0.222, 0.238],
  ["app", "flow", 0.287, 0.303],
  ["flow", "map", 0.352, 0.368],
  ["map", "scr", 0.425, 0.47],
  ["scr", "calm", 0.69, 0.71],
  ["calm", "NAME", 0.82, 0.865],
];

const VS = `
attribute vec3 aTo; attribute vec3 aSeed; attribute float aTF; attribute float aTT;
uniform float uMix,uTime,uForce,uSize,uPR,uCalm,uFlare; uniform vec3 uMouse;
varying float vA; varying vec3 vCol;
vec3 grad(float x){vec3 c0=vec3(.976,.686,.592),c1=vec3(.835,.506,.549),c2=vec3(.596,.455,.910),c3=vec3(.439,.553,.973),c4=vec3(.337,.604,.980);float s=clamp(x,0.,1.)*4.;if(s<1.)return mix(c0,c1,s);if(s<2.)return mix(c1,c2,s-1.);if(s<3.)return mix(c2,c3,s-2.);return mix(c3,c4,s-3.);}
vec3 tc(float k,float gx){if(k<.5)return vec3(.961,.957,.976);if(k<1.5)return vec3(.976,.686,.592);if(k<2.5)return vec3(.835,.506,.549);if(k<3.5)return vec3(.596,.455,.910);if(k<4.5)return vec3(.337,.604,.980);return grad(gx);}
vec3 flow(vec3 p,float t){return vec3(sin(p.y*1.3+t)+sin(p.z*.9-t*.7),sin(p.z*1.1+t*.8)+sin(p.x*.7+t),sin(p.x*1.2-t*.6)+sin(p.y*.8+t*.5))*.5;}
void main(){
  float d=aSeed.x*.45; float t=clamp((uMix-d)/.55,0.,1.); t=t*t*(3.-2.*t);
  vec3 p=mix(position,aTo,t); float burst=sin(3.14159*t);
  p+=flow(p*.5+aSeed*5.,uTime*.35*uCalm)*(.03+burst*1.4)*mix(.4,1.,aSeed.y);
  vec2 dm=p.xy-uMouse.xy; float dist=length(dm); float near=exp(-dist*dist/1.)*step(abs(p.z-uMouse.z),3.);
  float f=near*uForce; vec2 dir=dm/(dist+1e-3); p.xy+=(dir*.42+vec2(-dir.y,dir.x)*.36)*f; p.z+=f*.8;
  vec4 mv=modelViewMatrix*vec4(p,1.); gl_Position=projectionMatrix*mv;
  float depth=-mv.z; float k=mix(aTF,aTT,step(.5,t));
  gl_PointSize=min(uSize*uPR*(.55+aSeed.z*.9)*(17./depth)*(1.+f*.6)*(1.+step(.5,k)*(.12+uFlare*.6)),8.*uPR);
  vCol=mix(tc(aTF,p.x/14.+.5),tc(aTT,p.x/14.+.5),t);
  vCol=mix(vCol,vec3(.137,.157,.216),clamp((depth-20.)*.03,0.,.6));
  vA=(.42+.58*aSeed.z)*smoothstep(80.,12.,depth)*smoothstep(.6,3.,depth)*(1.+step(.5,k)*(.3+uFlare*.6));
}`;

const FS = `varying float vA; varying vec3 vCol;
void main(){vec2 c=gl_PointCoord-.5;float r=length(c);if(r>.5)discard;
gl_FragColor=vec4(vCol,min(smoothstep(.5,.12,r)*vA,1.));}`;

const REFL_VS = `varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`;
const REFL_FS = `uniform sampler2D map;uniform float uOp;varying vec2 vUv;
void main(){vec3 c=texture2D(map,vec2(vUv.x,1.-vUv.y)).rgb;float f=smoothstep(.6,1.,vUv.y)*.14;gl_FragColor=vec4(c,f*uOp);}`;

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
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

export function mount(stage: HTMLElement, opts: FilmOpts): FilmHandle {
  const { film, light, layers, marks, vIntro, beats, rail, wTop, credits, counter } = opts;
  const { sigCanvas, sigSvg, sigWord, outs, ts } = opts;

  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const small0 = isSmall();
  const N = small0 ? 12000 : 24000;
  const dpr = Math.min(devicePixelRatio || 1, small0 ? 1.5 : 2);

  const canvas = stage.querySelector<HTMLCanvasElement>("canvas[data-layer='film']");
  if (!canvas) throw new Error("film: canvas missing");
  if (!hasWebGL()) throw new Error("film: no WebGL");

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(dpr);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 200);

  const kit = createFilmFormations(N);

  /* ── particles ──────────────────────────────────────────────────── */
  const fromA = new Float32Array(N * 3);
  const toA = new Float32Array(N * 3);
  const seedA = new Float32Array(N * 3);
  const tfA = new Float32Array(N);
  const ttA = new Float32Array(N);
  for (let i = 0; i < N * 3; i++) seedA[i] = Math.random();

  const geo = new THREE.BufferGeometry();
  const aFrom = new THREE.BufferAttribute(fromA, 3);
  const aTo = new THREE.BufferAttribute(toA, 3);
  const aTF = new THREE.BufferAttribute(tfA, 1);
  const aTT = new THREE.BufferAttribute(ttA, 1);
  geo.setAttribute("position", aFrom);
  geo.setAttribute("aTo", aTo);
  geo.setAttribute("aSeed", new THREE.BufferAttribute(seedA, 3));
  geo.setAttribute("aTF", aTF);
  geo.setAttribute("aTT", aTT);

  const uni = {
    uMix: { value: 0 },
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector3(0, 0, 999) },
    uForce: { value: 0 },
    uSize: { value: small0 ? 2.3 : 2.1 },
    uPR: { value: dpr },
    uCalm: { value: reduce ? 0 : 1 },
    uFlare: { value: 0 },
  };
  const mat = new THREE.ShaderMaterial({
    uniforms: uni, transparent: true, depthWrite: false,
    vertexShader: VS, fragmentShader: FS,
  });
  const pts = new THREE.Points(geo, mat);
  pts.frustumCulled = false;
  scene.add(pts);

  /* ── the three screens ──────────────────────────────────────────── */
  type Screen = {
    v: HTMLVideoElement;
    m: THREE.MeshBasicMaterial;
    rm: THREE.ShaderMaterial;
    g: THREE.Group;
    poster: THREE.Texture;
    vt: THREE.VideoTexture;
    geoms: THREE.BufferGeometry[];
  };
  const loader = new THREE.TextureLoader();
  const screens: Screen[] = PROJECTS.map((P, i) => {
    const v = document.createElement("video");
    v.src = P.src;
    v.muted = true;
    v.loop = true;
    v.playsInline = true;
    v.setAttribute("playsinline", "");
    /* spec: nothing until the Work act is within a viewport */
    v.preload = "none";
    const poster = loader.load(P.poster);
    const vt = new THREE.VideoTexture(v);
    vt.minFilter = vt.magFilter = THREE.LinearFilter;
    const m = new THREE.MeshBasicMaterial({ map: poster, transparent: true, opacity: 0 });
    const rm = new THREE.ShaderMaterial({
      transparent: true, depthWrite: false,
      uniforms: { map: { value: poster }, uOp: { value: 0 } },
      vertexShader: REFL_VS, fragmentShader: REFL_FS,
    });
    v.addEventListener("playing", () => {
      m.map = vt;
      m.needsUpdate = true;
      rm.uniforms.map.value = vt;
    });
    const g = new THREE.Group();
    const s = SCR[i];
    g.position.set(s.x, s.y, s.z);
    g.rotation.y = s.ry;
    const gm = new THREE.PlaneGeometry(SW, SH);
    const gr = new THREE.PlaneGeometry(SW, SH);
    const mesh = new THREE.Mesh(gm, m);
    const refl = new THREE.Mesh(gr, rm);
    refl.position.y = -SH - 0.18;
    g.add(mesh);
    g.add(refl);
    scene.add(g);
    return { v, m, rm, g, poster, vt, geoms: [gm, gr] };
  });

  /** The signature act plays the same three recordings inside the word. */
  const sigVideos = PROJECTS.map((P) => {
    const v = document.createElement("video");
    v.src = P.src;
    v.muted = true;
    v.loop = true;
    v.playsInline = true;
    v.setAttribute("playsinline", "");
    v.preload = "none";
    v.style.cssText = "position:absolute;width:2px;height:2px;opacity:0;pointer-events:none";
    layers.signature.appendChild(v);
    const im = new Image();
    im.src = P.poster;
    return { v, poster: im };
  });

  /* Videos stay at preload="none" until Work is within one viewport. */
  let warmed = false;
  function warmVideos() {
    if (warmed) return;
    warmed = true;
    screens.forEach((s) => { s.v.preload = "metadata"; });
    sigVideos.forEach((s) => { s.v.preload = "metadata"; });
  }

  /* ── formations, one per idle task ──────────────────────────────── */
  let F: FilmFormations | null = null;
  let NAME: Formation | null = null;
  let NPREV: Formation | null = null;
  let nid = 0;
  let nameT0 = -9;
  let lastKey = "";

  const screenTints = PROJECTS.map((p) => p.tint);

  let disposed = false;
  let cancelIdle: (() => void) | null = null;
  function buildWorld() {
    if (disposed) return;
    F = kit.buildWorld(screenTints);
    NAME = kit.fName(nameStr());
    NAME.id = ++nid;
    NPREV = NAME;
    lastKey = "";
    start();
  }
  cancelIdle = idle(buildWorld);

  function nameStr() {
    const v = (opts.getName() || "").trim();
    return v ? v + "." : "Your business.";
  }

  function setPair(a: Formation, b: Formation) {
    fromA.set(a.pos);
    toA.set(b.pos);
    tfA.set(a.tint);
    ttA.set(b.tint);
    aFrom.needsUpdate = aTo.needsUpdate = aTF.needsUpdate = aTT.needsUpdate = true;
  }

  function formations(P: number, t: number) {
    if (!F || !NAME || !NPREV) return;
    let w = WIN[0];
    for (const x of WIN) if (P >= x[2]) w = x;
    const pickF = (k: string) => (k === "NAME" ? NAME! : (F as unknown as Record<string, Formation>)[k]);
    let A = pickF(w[0]);
    let B = pickF(w[1]);
    let mix = clamp((P - w[2]) / (w[3] - w[2]), 0, 1);
    let key = w[0] + w[1];
    if (w[1] === "NAME") {
      if (mix >= 1) {
        A = NPREV!;
        B = NAME!;
        mix = clamp((t - nameT0) / 1.3, 0, 1);
        key = "n" + NAME!.id;
        if (mix >= 1) NPREV = NAME;
      } else key += NAME!.id;
    }
    if (key !== lastKey) { setPair(A, B); lastKey = key; }
    uni.uMix.value = mix;
  }

  /* ── camera ─────────────────────────────────────────────────────── */
  const tmpP = new THREE.Vector3();
  const tmpL = new THREE.Vector3();
  const K = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);
  const wDist = () => {
    const a = camera.aspect;
    return Math.max(13.5, SW / (0.9 * 2 * Math.tan(THREE.MathUtils.degToRad(17)) * a));
  };
  const scrCam = (i: number): [THREE.Vector3, THREE.Vector3] => {
    const s = SCR[i];
    const d = wDist();
    return [
      K(s.x + Math.sin(s.ry) * d, s.y + 0.2, s.z + Math.cos(s.ry) * d),
      K(s.x, s.y - (isSmall() ? -0.6 : 0.55), s.z),
    ];
  };
  const HOME: [THREE.Vector3, THREE.Vector3] = [K(0, 0, 17), K(0, 0, 0)];

  function pose(P: number, t: number) {
    if (P < T.wS) {
      const v = clamp((P - T.vS) / (T.vE - T.vS), 0, 1);
      tmpP.set(0, 0, 17 - v * 1.2);
      tmpL.set(0, 0, 0);
    } else if (P < T.wE) {
      const u = (P - T.wS) / (T.wE - T.wS);
      const S = [scrCam(0), scrCam(1), scrCam(2)];
      const segs: Array<[number, number, [THREE.Vector3, THREE.Vector3], [THREE.Vector3, THREE.Vector3]]> = [
        [0, 0.2, HOME, S[0]], [0.2, 0.4, S[0], S[0]], [0.4, 0.55, S[0], S[1]],
        [0.55, 0.72, S[1], S[1]], [0.72, 0.87, S[1], S[2]], [0.87, 1.01, S[2], S[2]],
      ];
      for (const [s, e, f, g] of segs) {
        if (u < e) {
          /* reduced motion cuts between poses instead of gliding */
          const k = reduce ? 1 : sm((u - s) / (e - s));
          tmpP.lerpVectors(f[0], g[0], k);
          tmpL.lerpVectors(f[1], g[1], k);
          break;
        }
      }
    } else {
      tmpP.set(0, 0, 17);
      tmpL.set(0, 0, 0);
    }
    if (!reduce) {
      tmpP.x += Math.sin(t * 0.29) * 0.05;
      tmpP.y += Math.sin(t * 0.21) * 0.04;
    }
    camera.position.copy(tmpP);
    camera.lookAt(tmpL);
  }

  /* ── overlays ───────────────────────────────────────────────────── */
  const win = (P: number, s: number, e: number, f = 0.02) =>
    clamp(Math.min((P - s) / f, (e - P) / f), 0, 1);

  let lightC = "";
  function setLight(c: string, o: number) {
    if (c !== lightC) { light.style.color = c; lightC = c; }
    light.style.opacity = String(o);
  }

  let creditI = -1;
  let creditTimer = 0;
  function setCredit(i: number) {
    if (i === creditI) return;
    creditI = i;
    credits.forEach((c) => { c.style.opacity = "0"; });
    window.clearTimeout(creditTimer);
    creditTimer = window.setTimeout(() => {
      credits.forEach((c, k) => {
        c.style.display = k === i ? "" : "none";
        c.style.opacity = k === i ? "1" : "0";
      });
    }, reduce ? 0 : 200);
    counter.textContent = "";
    const b = document.createElement("b");
    b.textContent = "0" + (i + 1);
    counter.append(b, " / 03");
  }

  const OPOS = (): Array<[number, number]> =>
    isSmall() ? [[4, 56], [52, 56], [4, 66], [52, 66]] : [[8, 34], [70, 30], [10, 70], [68, 72]];
  function placeOuts() {
    const P = OPOS();
    outs.forEach((o, i) => {
      o.style.left = P[i][0] + "%";
      o.style.top = P[i][1] + "%";
      const dx = (P[i][0] < 40 ? -1 : 1) * 80;
      const dy = (P[i][1] < 50 ? -1 : 1) * 40;
      o.style.transform = `translate(${dx}px,${dy}px) scale(.9)`;
    });
  }

  let flT = -9;
  const flare = () => { flT = uni.uTime.value; };
  let outTimers: number[] = [];
  function playFinale() {
    outTimers.forEach(clearTimeout);
    outTimers = [];
    outs.forEach((o) => o.classList.remove("in"));
    ts.classList.remove("go");
    void ts.offsetWidth;
    outs.forEach((o, i) =>
      outTimers.push(window.setTimeout(() => { o.classList.add("in"); flare(); }, reduce ? 0 : 900 + i * 420)),
    );
    outTimers.push(window.setTimeout(() => { if (!reduce) ts.classList.add("go"); }, reduce ? 0 : 900 + 4 * 420));
  }

  function setName() {
    if (!F) return;
    NPREV = NAME;
    NAME = kit.fName(nameStr());
    NAME.id = ++nid;
    nameT0 = uni.uTime.value;
    playFinale();
  }

  /* ── the signature canvas ───────────────────────────────────────── */
  const torch = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5, user: false };
  function onSigMove(e: PointerEvent) {
    const r = sigCanvas.getBoundingClientRect();
    torch.tx = (e.clientX - r.left) / r.width;
    torch.ty = (e.clientY - r.top) / r.height;
    torch.user = true;
  }
  layers.signature.addEventListener("pointermove", onSigMove, { passive: true });

  const DPR2 = Math.min(devicePixelRatio || 1, 2);
  function fit(c: HTMLCanvasElement): [CanvasRenderingContext2D, number, number] {
    const w = c.clientWidth, h = c.clientHeight;
    if (c.width !== Math.round(w * DPR2) || c.height !== Math.round(h * DPR2)) {
      c.width = Math.round(w * DPR2);
      c.height = Math.round(h * DPR2);
    }
    const x = c.getContext("2d")!;
    x.setTransform(DPR2, 0, 0, DPR2, 0, 0);
    return [x, w, h];
  }
  function fitWord() {
    const w = sigSvg.clientWidth || innerWidth;
    const h = sigSvg.clientHeight || innerHeight;
    let fs = Math.min(w * (w < 820 ? 0.26 : 0.2), h * 0.42);
    sigWord.setAttribute("font-size", String(fs));
    try {
      const bb = sigWord.getBBox();
      if (bb.width > w * 0.92) {
        fs *= (w * 0.92) / bb.width;
        sigWord.setAttribute("font-size", String(fs));
      }
    } catch { /* not laid out yet */ }
  }

  let sigOn = false;
  const WASH = ["#F9AF97", "#D5818C", "#9874E8", "#708DF8", "#569AFA"];
  function signature(t: number, p: number) {
    const on = p > T.sS - 0.01 && p < T.sE + 0.01;
    if (on !== sigOn) {
      sigOn = on;
      sigVideos.forEach(({ v }) => {
        if (on && !reduce) { const pr = v.play(); if (pr && pr.catch) pr.catch(() => {}); }
        else v.pause();
      });
      if (on) fitWord();
    }
    if (!on) return;
    const [x, w, h] = fit(sigCanvas);
    x.fillStyle = "#121C27";
    x.fillRect(0, 0, w, h);
    const pw = w / 3;
    const drift = reduce ? 0 : Math.sin(t * 0.15) * w * 0.02;
    sigVideos.forEach(({ v, poster }, i) => {
      const src: CanvasImageSource | null =
        v.readyState >= 2 ? v : poster.complete && poster.naturalWidth ? poster : null;
      if (!src) return;
      const vw = (v.readyState >= 2 ? v.videoWidth : poster.naturalWidth) || 1;
      const vh = (v.readyState >= 2 ? v.videoHeight : poster.naturalHeight) || 1;
      const s = Math.max(pw / vw, h / vh) * 1.5;
      x.save();
      x.beginPath();
      x.rect(i * pw, 0, pw, h);
      x.clip();
      x.filter = "blur(5px) saturate(1.1)";
      x.drawImage(src, i * pw + (pw - vw * s) / 2 + drift, (h - vh * s) / 2 + Math.sin(t * 0.1 + i) * h * 0.05, vw * s, vh * s);
      x.filter = "none";
      x.restore();
    });
    const wash = x.createLinearGradient(0, 0, w, 0);
    WASH.forEach((c, i) => wash.addColorStop(i / 4, c));
    x.globalCompositeOperation = "overlay";
    x.globalAlpha = 0.55;
    x.fillStyle = wash;
    x.fillRect(0, 0, w, h);
    x.globalCompositeOperation = "screen";
    x.globalAlpha = 0.22;
    x.fillStyle = wash;
    x.fillRect(0, 0, w, h);
    x.globalCompositeOperation = "source-over";
    x.globalAlpha = 1;
    if (!torch.user) { torch.tx = 0.5 + Math.sin(t * 0.45) * 0.22; torch.ty = 0.52; }
    torch.x += (torch.tx - torch.x) * 0.1;
    torch.y += (torch.ty - torch.y) * 0.1;
    const tx = torch.x * w, ty = torch.y * h, R2 = Math.max(w, h) * 0.28;
    const d = x.createRadialGradient(tx, ty, 0, tx, ty, R2 * 1.8);
    d.addColorStop(0, "rgba(8,10,10,0)");
    d.addColorStop(0.5, "rgba(8,10,10,.06)");
    d.addColorStop(1, "rgba(8,10,10,.28)");
    x.fillStyle = d;
    x.fillRect(0, 0, w, h);
    const k = sm((p - T.sS) / 0.05);
    sigSvg.style.transform = `scale(${(1.25 - k * 0.25).toFixed(3)})`;
  }

  let finaleOn = false;
  function overlay(P: number) {
    // partners
    const pp = clamp(P / T.pE, 0, 1);
    layers.partners.style.opacity = (P < T.pE ? 1 : 1 - clamp((P - T.pE) / 0.02, 0, 1)).toFixed(3);
    marks.forEach((m, i) => {
      const k = sm(pp * 6 - 0.1 - i * 0.15);
      m.style.opacity = k.toFixed(3);
      m.style.transform = `translateZ(${((1 - k) * -420).toFixed(0)}px) translateY(${((1 - k) * 30).toFixed(1)}px)`;
    });
    // services
    layers.services.style.opacity = win(P, T.vS, T.vE + 0.005, 0.018).toFixed(3);
    const iu = (P - T.vS) / (T.vI - T.vS);
    vIntro.style.opacity = clamp(Math.min(iu * 6, (1 - iu) * 5), 0, 1).toFixed(3);
    vIntro.style.transform = `scale(${(1 + clamp(iu - 0.6, 0, 1) * 0.4).toFixed(3)})`;
    let cur = -1;
    BEAT.slice(0, 4).forEach((s, i) => { if (P >= s - 0.004 && P < BEAT[i + 1] - 0.004) cur = i; });
    beats.forEach((el, i) => {
      el.classList.toggle("on", i === cur);
      el.classList.toggle("gone", (cur > i && cur !== -1) || (cur === -1 && P >= T.vE));
    });
    rail.forEach((r, i) => r.classList.toggle("on", i === cur));
    // work
    layers.work.style.opacity = win(P, T.wS + 0.01, T.wE, 0.02).toFixed(3);
    const wu = (P - T.wS) / (T.wE - T.wS);
    wTop.style.opacity = (1 - sm((wu - 0.07) / 0.06)).toFixed(3);
    const wi = wu < 0.48 ? 0 : wu < 0.79 ? 1 : 2;
    setCredit(wi);
    const creditVisible = wu > 0.16 && !(wu > 0.42 && wu < 0.53) && !(wu > 0.74 && wu < 0.85);
    credits.forEach((c) => { c.style.visibility = creditVisible ? "visible" : "hidden"; });
    counter.style.opacity = wu > 0.15 ? "1" : "0";
    // signature
    layers.signature.style.opacity = win(P, T.sS, T.sE, 0.015).toFixed(3);
    // finale
    const fo = clamp((P - T.fS - 0.035) / 0.03, 0, 1);
    layers.finale.style.opacity = fo.toFixed(3);
    layers.finale.style.pointerEvents = fo > 0.5 ? "auto" : "none";
    if (fo > 0.6 && !finaleOn) { finaleOn = true; placeOuts(); playFinale(); }
    if (fo < 0.2 && finaleOn) { finaleOn = false; outs.forEach((o) => o.classList.remove("in")); }
    // the stage light takes the colour of whatever is on screen
    if (P < T.vI) setLight("#9874E8", 0.16);
    else if (P < T.wS) setLight(SERVICES[Math.max(0, cur)].color, 0.26);
    else if (P < T.wE) setLight(PROJECTS[wi].color, 0.24);
    else if (P < T.fS) setLight("#9874E8", 0.1);
    else setLight("#D5818C", 0.2);
    return { wi };
  }

  /* ── loop ───────────────────────────────────────────────────────── */
  const ptr = { x: 0, y: 0, tx: 0, ty: 0, in: false, f: 0 };
  function onMove(e: PointerEvent) {
    ptr.tx = (e.clientX / innerWidth) * 2 - 1;
    ptr.ty = -((e.clientY / innerHeight) * 2 - 1);
    ptr.in = true;
  }
  function onLeave() { ptr.in = false; }
  addEventListener("pointermove", onMove, { passive: true });
  document.addEventListener("pointerleave", onLeave);

  const ray = new THREE.Raycaster();
  const pl = new THREE.Plane();
  const hit = new THREE.Vector3();
  const v2 = new THREE.Vector2();
  const inv = new THREE.Matrix4();

  function resize() {
    const w = stage.clientWidth, h = stage.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    fitWord();
    placeOuts();
  }
  function onResize() { resize(); buildWorld(); }
  addEventListener("resize", onResize);
  resize();
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => { if (!disposed) { buildWorld(); fitWord(); } });
  }

  const progress = () => {
    const r = film.getBoundingClientRect();
    const tot = film.offsetHeight - innerHeight;
    return clamp(-r.top / tot, 0, 1);
  };

  /* Idle while the film is off screen, and warm the videos one viewport
     before the Work act needs them. */
  let onScreen = false;
  const io = new IntersectionObserver(
    (es) => { onScreen = es.some((e) => e.isIntersecting); if (onScreen) warmVideos(); },
    { rootMargin: "100% 0px" },
  );
  io.observe(film);

  let sp = 0;
  const t0 = performance.now();
  let playing = -2;
  let lastSubj = -9;
  let raf = 0;
  let started = false;
  function start() {
    if (started || disposed) return;
    started = true;
    raf = requestAnimationFrame(frame);
  }

  function frame(now: number) {
    raf = requestAnimationFrame(frame);
    if (document.hidden || !onScreen || !F) return;
    const t = (now - t0) / 1000;
    uni.uTime.value = t;
    const P = progress();
    sp += (P - sp) * (reduce ? 1 : 0.1);

    formations(sp, t);
    pose(sp, t);
    const { wi } = overlay(sp);
    signature(t, sp);

    // a flare as each subject settles
    const subj =
      sp < T.vI ? 0
        : sp < T.vE ? 1 + Math.floor(((sp - T.vI) / (T.vE - T.vI)) * 4)
        : sp < T.wE ? 10 + wi
        : sp < T.fS ? 20
        : 30;
    if (subj !== lastSubj) { lastSubj = subj; flT = t; }
    uni.uFlare.value = reduce ? 0 : Math.exp(-(t - flT) * 1.5) * Math.min(1, (t - flT) * 6);

    // screens: only the one in front plays
    const vis = sm((sp - T.wS) / 0.025) * (1 - sm((sp - T.wE + 0.005) / 0.02));
    screens.forEach((s, i) => {
      const o = vis * (i === wi ? 1 : 0.5);
      s.m.opacity = o;
      s.rm.uniforms.uOp.value = o;
      s.g.visible = o > 0.01;
    });
    const want = vis > 0.05 && !reduce ? wi : -1;
    if (want !== playing) {
      screens.forEach((s, i) => {
        if (i === want) { const pr = s.v.play(); if (pr && pr.catch) pr.catch(() => {}); }
        else s.v.pause();
      });
      playing = want;
    }

    // a gentle turn on the service objects
    const svcW = clamp(win(sp, T.vI, T.vE, 0.03), 0, 1);
    pts.rotation.y = svcW * (ptr.x * 0.14 + Math.sin(t * 0.2) * 0.05);
    pts.rotation.x = svcW * (-ptr.y * 0.08);
    ptr.x += (ptr.tx - ptr.x) * 0.08;
    ptr.y += (ptr.ty - ptr.y) * 0.08;
    ptr.f += ((ptr.in && !reduce ? 1 : 0) - ptr.f) * 0.08;

    const zp = sp >= T.wS && sp < T.wE ? SCR[wi].z + 0.3 : 0;
    pl.set(new THREE.Vector3(0, 0, 1), -zp);
    v2.set(ptr.x, ptr.y);
    ray.setFromCamera(v2, camera);
    pts.updateMatrixWorld();
    if (ray.ray.intersectPlane(pl, hit)) {
      inv.copy(pts.matrixWorld).invert();
      hit.applyMatrix4(inv);
      uni.uMouse.value.copy(hit);
    }
    /* No cursor force on the screens, so the frames stay straight; the
       finale caps at 0.3 so the name's letters do not streak. */
    uni.uForce.value = ptr.f * (sp >= T.wS && sp < T.wE ? 0 : sp >= T.fS ? 0.3 : 0.9);

    renderer.render(scene, camera);
  }

  function dispose() {
    disposed = true;
    cancelAnimationFrame(raf);
    cancelIdle?.();
    io.disconnect();
    outTimers.forEach(clearTimeout);
    window.clearTimeout(creditTimer);
    removeEventListener("resize", onResize);
    removeEventListener("pointermove", onMove);
    document.removeEventListener("pointerleave", onLeave);
    layers.signature.removeEventListener("pointermove", onSigMove);
    screens.forEach((s) => {
      s.v.pause();
      s.v.removeAttribute("src");
      s.v.load();
      s.geoms.forEach((g) => g.dispose());
      s.m.dispose();
      s.rm.dispose();
      s.poster.dispose();
      s.vt.dispose();
    });
    sigVideos.forEach(({ v }) => { v.pause(); v.removeAttribute("src"); v.load(); v.remove(); });
    geo.dispose();
    mat.dispose();
    renderer.dispose();
    renderer.forceContextLoss();
  }

  return { dispose, setName };
}
