import { useEffect, useRef } from "react";

/**
 * The hero's particle wave.
 *
 * A grid of points displaced in a vertex shader — a slow travelling
 * swell, a ripple that follows the cursor, and an amplitude that lifts
 * gently with scroll. Colour runs teal → lavender → a faint peach on
 * the crests, and the far rows fade into the navy.
 *
 * RAW WebGL2, not three.js. The brief allows three + @react-three/fiber
 * inside a 180 kB gzip budget; three's core alone is about 170 kB gzip
 * before the renderer, so the budget and the library are in tension for
 * what is one draw call of gl.POINTS. This is the same effect in a few
 * kB, and it keeps the lazy chunk off the critical path entirely.
 *
 * It never runs when it cannot be seen: the loop stops when the hero
 * leaves the viewport or the tab is hidden.
 */

const VERT = `#version 300 es
precision highp float;
in vec2 aGrid;              // 0..1 across the field
uniform float uTime;
uniform vec2  uMouse;       // in grid space, -1 when absent
uniform float uRipple;      // seconds since the cursor last moved
uniform float uAmp;         // scroll-driven amplitude
uniform vec2  uRes;
uniform float uDpr;
out float vLift;
out float vFade;

// cheap value noise — enough texture for a water surface
float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p){
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1,0)), u.x),
             mix(hash(i + vec2(0,1)), hash(i + vec2(1,1)), u.x), u.y);
}

void main(){
  vec2 g = aGrid;

  // the standing swell: two crossed sines plus drifting noise
  float h =
      sin(g.x * 7.0 + uTime * 0.55) * 0.5
    + sin((g.x * 3.1 - g.y * 4.4) + uTime * 0.37) * 0.35
    + (noise(g * 4.0 + vec2(uTime * 0.12, uTime * 0.08)) - 0.5) * 0.9;

  // the cursor's travelling ring
  if (uMouse.x > -0.5) {
    float d = distance(g, uMouse);
    float age = uRipple;
    float ring = sin(d * 26.0 - age * 6.5);
    h += ring * exp(-d * 5.5) * exp(-age * 1.6) * 1.5;
  }

  h *= uAmp;

  // the field lies back into the frame: y is depth
  float depth = g.y;
  float persp = mix(1.0, 0.34, depth);
  vec2 p;
  p.x = (g.x - 0.5) * 2.0 * persp;
  p.y = -1.0 + depth * 1.34 + h * 0.19 * persp;

  gl_Position = vec4(p.x, p.y, 0.0, 1.0);
  gl_PointSize = max(1.0, (3.4 - depth * 1.9) * uDpr);

  vLift = clamp(h * 0.5 + 0.5, 0.0, 1.0);
  vFade = 1.0 - smoothstep(0.52, 1.0, depth);
  vFade *= smoothstep(0.0, 0.08, depth);
}`;

const FRAG = `#version 300 es
precision highp float;
in float vLift;
in float vFade;
out vec4 outColor;

const vec3 TEAL  = vec3(0.333, 0.518, 0.557);  // #55848E
const vec3 LAV   = vec3(0.651, 0.702, 0.922);  // #A6B3EB
const vec3 PEACH = vec3(0.976, 0.686, 0.592);  // #F9AF97

void main(){
  // soft round sprite
  vec2 d = gl_PointCoord - 0.5;
  float r = dot(d, d);
  float a = smoothstep(0.25, 0.02, r);
  if (a <= 0.001) discard;

  vec3 c = mix(TEAL, LAV, smoothstep(0.25, 0.72, vLift));
  c = mix(c, PEACH, smoothstep(0.72, 1.0, vLift) * 0.85);

  outColor = vec4(c, a * vFade);
}`;

function compile(gl: WebGL2RenderingContext, type: number, src: string) {
  const sh = gl.createShader(type)!;
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    throw new Error(gl.getShaderInfoLog(sh) || "shader");
  }
  return sh;
}

export default function WaveMesh() {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(function run() {
    const cv = ref.current;
    if (!cv) return;
    const gl = cv.getContext("webgl2", { antialias: false, alpha: true, premultipliedAlpha: false });
    if (!gl) return;

    let prog: WebGLProgram | null = null;
    try {
      prog = gl.createProgram()!;
      gl.attachShader(prog, compile(gl, gl.VERTEX_SHADER, VERT));
      gl.attachShader(prog, compile(gl, gl.FRAGMENT_SHADER, FRAG));
      gl.linkProgram(prog);
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    } catch {
      return;
    }
    gl.useProgram(prog);

    /* density scales with the viewport: a phone draws a quarter of the
       points a desktop does, which is where the frame budget goes. */
    const narrow = window.matchMedia("(max-width: 860px)").matches;
    const COLS = narrow ? 110 : 210;
    const ROWS = narrow ? 56 : 104;
    const pts = new Float32Array(COLS * ROWS * 2);
    let k = 0;
    for (let y = 0; y < ROWS; y++) {
      for (let x = 0; x < COLS; x++) {
        pts[k++] = x / (COLS - 1);
        pts[k++] = y / (ROWS - 1);
      }
    }
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, pts, gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "aGrid");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(prog, "uTime");
    const uMouse = gl.getUniformLocation(prog, "uMouse");
    const uRipple = gl.getUniformLocation(prog, "uRipple");
    const uAmp = gl.getUniformLocation(prog, "uAmp");
    const uRes = gl.getUniformLocation(prog, "uRes");
    const uDpr = gl.getUniformLocation(prog, "uDpr");

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    const dpr = Math.min(window.devicePixelRatio || 1, narrow ? 1.5 : 2);
    function size() {
      if (!cv || !gl) return;
      const r = cv.getBoundingClientRect();
      cv.width = Math.max(1, Math.round(r.width * dpr));
      cv.height = Math.max(1, Math.round(r.height * dpr));
      gl.viewport(0, 0, cv.width, cv.height);
      gl.uniform2f(uRes, cv.width, cv.height);
      gl.uniform1f(uDpr, dpr);
    }
    size();
    window.addEventListener("resize", size);

    let mx = -1;
    let my = -1;
    let moved = -99;
    function onMove(e: PointerEvent) {
      if (!cv) return;
      const r = cv.getBoundingClientRect();
      const gx = (e.clientX - r.left) / r.width;
      const gy = 1 - (e.clientY - r.top) / r.height;
      if (gx < -0.2 || gx > 1.2 || gy < -0.6 || gy > 1.6) return;
      mx = gx;
      my = Math.max(0, Math.min(1, gy));
      moved = performance.now() / 1000;
    }
    window.addEventListener("pointermove", onMove, { passive: true });

    let amp = 1;
    function onScroll() {
      const y = window.scrollY;
      amp = 1 + Math.min(0.75, y / 1400);
    }
    window.addEventListener("scroll", onScroll, { passive: true });

    /* the loop stops when the hero is off screen or the tab is hidden */
    let visible = true;
    const io = new IntersectionObserver(
      function seen(es) {
        visible = es.some((e) => e.isIntersecting);
        if (visible && !raf) raf = requestAnimationFrame(frame);
      },
      { threshold: 0 }
    );
    io.observe(cv);

    let raf = 0;
    let frames = 0;
    let t0 = performance.now();
    (window as unknown as { __meshFps?: number }).__meshFps = 0;

    function frame() {
      raf = 0;
      if (!gl || !cv) return;
      if (!visible || document.hidden) return;
      const now = performance.now();
      const t = now / 1000;

      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform1f(uTime, t);
      gl.uniform2f(uMouse, mx, my);
      gl.uniform1f(uRipple, Math.max(0, t - moved));
      gl.uniform1f(uAmp, amp);
      gl.drawArrays(gl.POINTS, 0, COLS * ROWS);

      frames++;
      if (now - t0 >= 1000) {
        (window as unknown as { __meshFps?: number }).__meshFps = Math.round(
          (frames * 1000) / (now - t0)
        );
        frames = 0;
        t0 = now;
      }
      raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);

    return function stop() {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("resize", size);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return <canvas ref={ref} className="nh-mesh" aria-hidden />;
}
