/**
 * Spec 33 step 3: the "How we think" proofs claim to show
 * averrstudios.com's own tokens. This asserts that claim.
 *
 * Every number in `src/data/aboutTokens.ts` is re-derived here by
 * parsing `src/index.css`, so the proofs cannot quietly drift from the
 * stylesheet they are supposed to be quoting. Change a token in
 * `index.css` and this fails until `aboutTokens.ts` follows.
 *
 * Run with `npm run test:tokens` (node's own runner; Node strips the
 * types, so there is no build step and no extra dependency).
 */
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

import {
  DIRECTION_SWATCHES,
  DURATIONS,
  EASE_OUT_QUART,
  EASE_OUT_QUART_TOKEN,
  GRADIENT_BRIDGE,
  SPACING_SCALE,
  TYPE_SCALE,
} from "../src/data/aboutTokens.ts";
import {
  SERVICE_COLOR,
  SERVICE_NAMES,
  STUDIO_GRADIENT,
} from "../src/data/serviceColors.ts";

const here = dirname(fileURLToPath(import.meta.url));
const css = readFileSync(join(here, "..", "src", "index.css"), "utf8");

/** The declared value of a custom property in `index.css`. */
function declared(token: string): string {
  const m = css.match(
    new RegExp(`${token}\\s*:\\s*([^;]+);`)
  );
  assert.ok(m, `${token} is not declared in src/index.css`);
  return m[1].trim();
}

/**
 * The largest px value a token resolves to: the third argument of a
 * `clamp()`, or the value itself when it is a flat px.
 */
function maxPx(value: string): number {
  const clamp = value.match(/clamp\(([^)]*)\)/);
  if (clamp) {
    const parts = clamp[1].split(",").map((s) => s.trim());
    assert.equal(parts.length, 3, `expected 3 clamp args in "${value}"`);
    const px = parts[2].match(/([\d.]+)px/);
    assert.ok(px, `clamp maximum is not a px value: "${parts[2]}"`);
    return Number(px[1]);
  }
  const flat = value.match(/^([\d.]+)px$/);
  assert.ok(flat, `not a clamp and not a flat px: "${value}"`);
  return Number(flat[1]);
}

test("every --type-*-size maximum matches index.css", () => {
  for (const { label, token, max } of TYPE_SCALE) {
    assert.equal(
      maxPx(declared(token)),
      max,
      `${label} (${token}) drifted from index.css`
    );
  }
});

test("the type scale is the one the proof shows, in descending order", () => {
  assert.deepEqual(
    TYPE_SCALE.map((t) => t.label),
    ["Display", "H1", "H2", "H3", "Body", "Eyebrow"]
  );
  const sizes = TYPE_SCALE.map((t) => t.max);
  assert.deepEqual(sizes, [...sizes].sort((a, b) => b - a));
});

test("every --duration-* matches index.css", () => {
  for (const { label, token, ms } of DURATIONS) {
    const value = declared(token);
    const m = value.match(/^(\d+)ms$/);
    assert.ok(m, `${token} is not a plain ms value: "${value}"`);
    assert.equal(Number(m[1]), ms, `--duration-${label} drifted`);
  }
});

test("--ease-out-quart matches index.css verbatim", () => {
  assert.equal(declared(EASE_OUT_QUART_TOKEN), EASE_OUT_QUART);
});

test("the DIRECTION swatches are the service colours, in the fixed order", () => {
  assert.deepEqual(
    DIRECTION_SWATCHES.map((s) => s.name),
    [
      SERVICE_NAMES.websites,
      SERVICE_NAMES.webApps,
      SERVICE_NAMES.aiAutomation,
      "Bridge",
      SERVICE_NAMES.marketing,
    ]
  );
  assert.deepEqual(
    DIRECTION_SWATCHES.map((s) => s.hex),
    [
      SERVICE_COLOR.websites,
      SERVICE_COLOR.webApps,
      SERVICE_COLOR.aiAutomation,
      GRADIENT_BRIDGE,
      SERVICE_COLOR.marketing,
    ]
  );
});

test("the bridge stop really is in STUDIO_GRADIENT, between AI and Marketing", () => {
  const stops = [...STUDIO_GRADIENT.matchAll(/#[0-9A-Fa-f]{6}/g)].map((m) =>
    m[0].toUpperCase()
  );
  assert.deepEqual(stops, [
    SERVICE_COLOR.websites,
    SERVICE_COLOR.webApps,
    SERVICE_COLOR.aiAutomation,
    GRADIENT_BRIDGE,
    SERVICE_COLOR.marketing,
  ].map((h) => h.toUpperCase()));
});

test("the spacing scale is the studio scale, ascending and unique", () => {
  // No `--space-*` token exists in index.css to check against, so this
  // asserts the scale's shape rather than a stylesheet value. See the
  // note on SPACING_SCALE.
  assert.deepEqual([...SPACING_SCALE], [4, 8, 12, 16, 24, 32, 48, 64, 96, 128]);
  const asc = [...SPACING_SCALE].sort((a, b) => a - b);
  assert.deepEqual([...SPACING_SCALE], asc);
  assert.equal(new Set(SPACING_SCALE).size, SPACING_SCALE.length);
});

test("no --space-* token has appeared without the scale being pointed at it", () => {
  // A guard, not a check: if someone declares real spacing tokens, this
  // fails and tells the next person to make SPACING_SCALE read them.
  assert.equal(
    /--space(-|\s*:)/.test(css),
    false,
    "index.css now declares --space-* tokens; make SPACING_SCALE read them and assert against them here"
  );
});
