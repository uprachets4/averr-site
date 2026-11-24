/**
 * The contact form says so when it fails.
 *
 * On 24 Nov 2026 this endpoint had been dropping every enquiry for an
 * unknown length of time: RESEND_API_KEY was missing from the Vercel
 * project, so the route returned 500 before it ever reached the email
 * service. Nothing recorded it. The route answered in HTTP and wrote
 * nothing to the console, so Vercel's runtime logs were empty and the
 * only evidence anywhere was a visitor being told "it didn't send".
 *
 * A contact form that fails loudly gets fixed in an afternoon. One
 * that fails silently gets fixed whenever somebody happens to test it.
 * These tests are what keep it in the first category.
 */
import test from "node:test";
import assert from "node:assert/strict";

import { POST } from "../api/contact.ts";

type Captured = { errors: string[]; logs: string[] };

/** Run `fn` with the console captured and the environment controlled. */
async function withConsole(
  env: { key?: string },
  fetchImpl: typeof fetch | null,
  fn: () => Promise<Response>
): Promise<{ res: Response; out: Captured }> {
  const out: Captured = { errors: [], logs: [] };

  const realError = console.error;
  const realLog = console.log;
  const realFetch = globalThis.fetch;
  const realKey = process.env.RESEND_API_KEY;

  console.error = (...a: unknown[]) => void out.errors.push(a.join(" "));
  console.log = (...a: unknown[]) => void out.logs.push(a.join(" "));
  if (fetchImpl) globalThis.fetch = fetchImpl;
  if (env.key === undefined) delete process.env.RESEND_API_KEY;
  else process.env.RESEND_API_KEY = env.key;

  try {
    const res = await fn();
    return { res, out };
  } finally {
    console.error = realError;
    console.log = realLog;
    globalThis.fetch = realFetch;
    if (realKey === undefined) delete process.env.RESEND_API_KEY;
    else process.env.RESEND_API_KEY = realKey;
  }
}

function post(body: unknown): Request {
  return new Request("https://www.averrstudios.com/api/contact", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
}

const GOOD = { name: "Sam", email: "sam@example.com", message: "Hello." };

test("a missing API key is logged, not just returned", async function missingKey() {
  const { res, out } = await withConsole({ key: undefined }, null, () => POST(post(GOOD)));

  assert.equal(res.status, 500);
  assert.equal(out.errors.length, 1, "exactly one failure line");
  assert.match(out.errors[0], /\[contact\] send failed/);
  assert.match(out.errors[0], /RESEND_API_KEY/);
});

test("a rejection from the email service is logged with its reason", async function rejected() {
  const stub = (async () =>
    new Response(JSON.stringify({ message: "Domain is not verified" }), {
      status: 403,
    })) as unknown as typeof fetch;

  const { res, out } = await withConsole({ key: "re_test" }, stub, () => POST(post(GOOD)));

  assert.equal(res.status, 500);
  assert.equal(out.errors.length, 1);
  assert.match(out.errors[0], /rejected the send/);
  assert.match(out.errors[0], /Domain is not verified/, "the provider's own words");
  assert.match(out.errors[0], /403/);
});

test("an unreachable email service is logged with its cause", async function unreachable() {
  const stub = (async () => {
    throw new Error("ECONNRESET");
  }) as unknown as typeof fetch;

  const { res, out } = await withConsole({ key: "re_test" }, stub, () => POST(post(GOOD)));

  assert.equal(res.status, 502);
  assert.equal(out.errors.length, 1);
  assert.match(out.errors[0], /could not reach/);
  assert.match(out.errors[0], /ECONNRESET/);
});

test("nothing secret reaches the log", async function noSecrets() {
  /* The key, the sender's address and the message body are all things
     that must not end up in a log that other people can read. */
  const secret = "re_a_real_looking_key_value";
  const stub = (async () =>
    new Response(JSON.stringify({ message: "nope" }), { status: 403 })) as unknown as typeof fetch;

  const { out } = await withConsole({ key: secret }, stub, () =>
    POST(post({ name: "Sam", email: "private@example.com", message: "Commercially sensitive." }))
  );

  const everything = [...out.errors, ...out.logs].join("\n");
  assert.ok(!everything.includes(secret), "the API key");
  assert.ok(!everything.includes("private@example.com"), "the sender's address");
  assert.ok(!everything.includes("Commercially sensitive"), "the message body");
});

test("a visitor's own mistake is not logged as a failure", async function validation() {
  /* An empty field is not an incident. If these logged, the signal
     that matters would be buried under people mistyping an address. */
  for (const body of [
    { email: "sam@example.com", message: "Hi" },
    { name: "Sam", email: "not-an-email", message: "Hi" },
    { name: "Sam", email: "sam@example.com" },
  ]) {
    const { res, out } = await withConsole({ key: "re_test" }, null, () => POST(post(body)));
    assert.equal(res.status, 400);
    assert.deepEqual(out.errors, [], `no log for ${JSON.stringify(body)}`);
  }
});

test("a successful send leaves a line, so silence means no enquiries", async function success() {
  const stub = (async () =>
    new Response(JSON.stringify({ id: "abc" }), { status: 200 })) as unknown as typeof fetch;

  const { res, out } = await withConsole({ key: "re_test" }, stub, () => POST(post(GOOD)));

  assert.equal(res.status, 200);
  assert.deepEqual(out.errors, []);
  assert.equal(out.logs.length, 1);
  assert.match(out.logs[0], /\[contact\] send ok/);
});
