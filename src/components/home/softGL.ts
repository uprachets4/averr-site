import type * as THREE from "three";

/**
 * True when WebGL is running on the CPU (SwiftShader, llvmpipe, Microsoft
 * Basic Render): no graphics card, or one the browser has blocklisted.
 * Google's PageSpeed test machines are exactly this case, and so are some
 * older office PCs. On these the particle scenes draw at 1x pixel ratio and
 * about 12 frames a second instead of tying up the processor for every
 * frame; with a real GPU nothing changes.
 */
export function isSoftwareGL(r: THREE.WebGLRenderer): boolean {
  try {
    const gl = r.getContext();
    const ext = gl.getExtension("WEBGL_debug_renderer_info");
    const name = String(ext ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER));
    return /swiftshader|llvmpipe|softpipe|software|basic render/i.test(name);
  } catch {
    return false;
  }
}

/** Minimum milliseconds between drawn frames on software WebGL. */
export const SOFT_FRAME_MS = 1000 / 12;
