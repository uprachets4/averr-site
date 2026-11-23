/**
 * Compile api/ the way Vercel does, then actually import the route.
 *
 * This exists because the findability function deployed clean three
 * times and died on its first request every time with
 * ERR_MODULE_NOT_FOUND — first for src/lib/findability.ts, then for the
 * extensionless form, then for api/_findability without the .js that
 * Node ESM requires. None of it showed up in the build log, the five
 * gates or the 22 unit tests, because none of them load the function.
 *
 * Each round trip cost a push, a deploy and a log read. Compiling the
 * files to JavaScript and importing the result catches the whole class
 * in about two seconds.
 *
 * It checks that the module loads, that it exports a handler, and that
 * the handler rejects the hosts it must never fetch. It does not make a
 * real request: the sandbox cannot reach arbitrary sites, which is the
 * same constraint that made all of this necessary.
 */
import { execFileSync } from "node:child_process";
import { mkdtempSync, writeFileSync, rmSync, readdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

const root = new URL("..", import.meta.url).pathname;
const routes = readdirSync(join(root, "api")).filter((f) => f.endsWith(".ts"));
const out = mkdtempSync(join(tmpdir(), "fnload-"));
let failed = 0;

function fail(msg) {
  console.log(`  FAIL  ${msg}`);
  failed++;
}

try {
  execFileSync(
    "npx",
    [
      "tsc",
      ...routes.map((f) => join(root, "api", f)),
      "--ignoreConfig",
      "--outDir", out,
      "--module", "nodenext",
      "--moduleResolution", "nodenext",
      "--target", "es2022",
      "--skipLibCheck",
      "--lib", "es2023,dom",
      /* --ignoreConfig drops the project types too, and api/contact.ts
         uses `process`. */
      "--types", "node",
    ],
    { cwd: root, stdio: "pipe" }
  );
} catch (e) {
  console.log(String(e.stdout || e.message).slice(0, 900));
  fail("api/ did not compile");
  rmSync(out, { recursive: true, force: true });
  process.exit(1);
}

/* Vercel's functions are ESM; without this Node reads the compiled
   output as CommonJS and the import fails for the wrong reason. */
writeFileSync(join(out, "package.json"), JSON.stringify({ type: "module" }));

for (const f of routes) {
  if (f.startsWith("_")) continue; // shared module, not a route
  const name = f.replace(/\.ts$/, ".js");
  let mod;
  try {
    mod = await import(pathToFileURL(join(out, name)).href);
  } catch (e) {
    fail(`${f} does not load: ${e.code || ""} ${e.url || e.message}`);
    continue;
  }
  const handler = mod.GET || mod.POST || mod.default;
  if (typeof handler !== "function") {
    fail(`${f} loads but exports no handler`);
    continue;
  }
  console.log(`  ok    api/${f} loads and exports ${Object.keys(mod).join(", ")}`);
}

/* The guards on the one route that fetches what it is given. */
const fnd = await import(pathToFileURL(join(out, "findability.js")).href).catch(() => null);
if (fnd?.GET) {
  for (const host of ["localhost", "169.254.169.254", "127.0.0.1", "10.0.0.1", "file:///etc/passwd", ""]) {
    const res = await fnd.GET(new Request(`https://x/api/findability?url=${encodeURIComponent(host)}`));
    if (res.status !== 400) fail(`findability accepted "${host}" with ${res.status}; it must be refused`);
  }
  console.log("  ok    findability refuses private hosts, bad schemes and empty input");
}

rmSync(out, { recursive: true, force: true });
console.log(failed === 0 ? "\nPASS" : `\nFAIL — ${failed} problem(s)`);
process.exit(failed === 0 ? 0 : 1);
