import { useEffect, useRef } from "react";
import * as THREE from "three";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";
import { MARK_PATH_D } from "../MonogramMark";

/**
 * The PU mark, extruded.
 *
 * The owner chose three.js ExtrudeGeometry over a CSS stack. The mark
 * is a FILLED path with `fill-rule: evenodd`, so `SVGLoader` gives us
 * shapes with their counters already holed out and the extrusion is
 * honest rather than a silhouette.
 *
 * Lazy: this module and three are one chunk, mounted only when the
 * section is near. Nothing here touches the hero or the LCP path.
 *
 * The gradient is the site's own — peach → violet → blue — baked into
 * the geometry as vertex colours along x, so it needs no texture and
 * no second material. A rim light rakes across the bevel and the
 * emissive edge carries the glow; there is no post-processing pass,
 * which keeps the chunk to three's core.
 */

const PEACH = new THREE.Color("#F9AF97");
const VIOLET = new THREE.Color("#9874E8");
const BLUE = new THREE.Color("#569AFA");

export default function Mark3D() {
  const hostRef = useRef<HTMLDivElement | null>(null);

  useEffect(function scene() {
    const host = hostRef.current;
    if (!host) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const narrow = window.matchMedia("(max-width: 860px)").matches;

    const renderer = new THREE.WebGLRenderer({ antialias: !narrow, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, narrow ? 1.5 : 2));
    renderer.setSize(host.clientWidth, host.clientHeight, false);
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, host.clientWidth / host.clientHeight, 1, 2000);
    camera.position.set(0, 0, 520);

    /* ── the mark ── */
    const loader = new SVGLoader();
    const parsed = loader.parse(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 327 454"><path d="${MARK_PATH_D}" fill="#fff" fill-rule="evenodd"/></svg>`
    );
    const shapes: THREE.Shape[] = [];
    parsed.paths.forEach(function each(pth) {
      SVGLoader.createShapes(pth).forEach((sh) => shapes.push(sh));
    });

    const geo = new THREE.ExtrudeGeometry(shapes, {
      depth: 46,
      bevelEnabled: true,
      bevelThickness: 5,
      bevelSize: 4,
      bevelSegments: 4,
      curveSegments: 14,
    });
    /* SVG y grows downward; centre the mark on its own bounds */
    geo.scale(1, -1, 1);
    geo.computeBoundingBox();
    const bb = geo.boundingBox!;
    geo.translate(
      -(bb.max.x + bb.min.x) / 2,
      -(bb.max.y + bb.min.y) / 2,
      -(bb.max.z + bb.min.z) / 2
    );
    geo.computeVertexNormals();

    /* the site gradient, baked along x as vertex colours */
    const pos = geo.attributes.position;
    const colors = new Float32Array(pos.count * 3);
    const span = bb.max.x - bb.min.x || 1;
    const c = new THREE.Color();
    for (let i = 0; i < pos.count; i++) {
      const t = (pos.getX(i) - -span / 2) / span;
      if (t < 0.5) c.copy(PEACH).lerp(VIOLET, t / 0.5);
      else c.copy(VIOLET).lerp(BLUE, (t - 0.5) / 0.5);
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const mat = new THREE.MeshStandardMaterial({
      vertexColors: true,
      metalness: 0.42,
      roughness: 0.28,
      emissive: new THREE.Color("#2A2250"),
      emissiveIntensity: 0.55,
    });
    const mesh = new THREE.Mesh(geo, mat);
    const group = new THREE.Group();
    group.add(mesh);
    scene.add(group);

    /* fit the mark to the viewport height */
    const h = bb.max.y - bb.min.y;
    const fit = (narrow ? 210 : 260) / h;
    mesh.scale.setScalar(fit);

    /* ── light ── */
    scene.add(new THREE.AmbientLight(0xffffff, 0.55));
    const key = new THREE.DirectionalLight(0xffffff, 2.0);
    key.position.set(-180, 240, 420);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0xA6B3EB, 2.6);
    rim.position.set(260, -120, -280);
    scene.add(rim);
    const warm = new THREE.PointLight(0xF9AF97, 1.1, 1400);
    warm.position.set(220, 180, 260);
    scene.add(warm);

    /* ── motion ── */
    let tx = 0;
    let ty = 0;
    function onMove(e: PointerEvent) {
      const r = host!.getBoundingClientRect();
      if (r.bottom < 0 || r.top > window.innerHeight) return;
      tx = ((e.clientX - (r.left + r.width / 2)) / (r.width / 2)) * 0.34;
      ty = ((e.clientY - (r.top + r.height / 2)) / (r.height / 2)) * 0.22;
    }
    if (!reduce) window.addEventListener("pointermove", onMove, { passive: true });

    function size() {
      if (!host) return;
      const w = host.clientWidth;
      const hh = host.clientHeight;
      renderer.setSize(w, hh, false);
      camera.aspect = w / hh;
      camera.updateProjectionMatrix();
    }
    window.addEventListener("resize", size);
    size();

    let visible = true;
    const io = new IntersectionObserver(
      function seen(es) {
        visible = es.some((e) => e.isIntersecting);
        if (visible && !raf) raf = requestAnimationFrame(tick);
      },
      { threshold: 0 }
    );
    io.observe(host);

    let raf = 0;
    let frames = 0;
    let t0 = performance.now();
    (window as unknown as { __markFps?: number }).__markFps = 0;

    function tick() {
      raf = 0;
      if (!visible || document.hidden) return;
      const now = performance.now();
      if (!reduce) group.rotation.y += 0.0042;
      /* lean toward the cursor on top of the slow turn */
      group.rotation.x += (ty - group.rotation.x) * 0.06;
      mesh.rotation.y += (tx - mesh.rotation.y) * 0.06;
      renderer.render(scene, camera);
      frames++;
      if (now - t0 >= 1000) {
        (window as unknown as { __markFps?: number }).__markFps = Math.round(
          (frames * 1000) / (now - t0)
        );
        frames = 0;
        t0 = now;
      }
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);

    return function stop() {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("resize", size);
      window.removeEventListener("pointermove", onMove);
      geo.dispose();
      mat.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode) renderer.domElement.parentNode.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={hostRef} className="os-mark" aria-hidden />;
}
