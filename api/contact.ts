type ContactPayload = {
  name?: unknown;
  email?: unknown;
  message?: unknown;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TO = "prachets@averrstudios.com";
const FROM = "Averr Contact <contact@averrstudios.com>";

function bad(status: number, body: object) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

/**
 * Say so, out loud, when a message does not get through.
 *
 * On 24 Nov 2026 this form had been failing for an unknown length of
 * time with RESEND_API_KEY missing from the Vercel project. Every
 * enquiry through /contact was lost. Nothing recorded it: the route
 * returned its errors as HTTP responses and wrote nothing to the
 * console, so Vercel's runtime logs were empty, there was no alert,
 * and the only evidence was a visitor seeing "it didn't send".
 *
 * One line per failure, prefixed so it can be filtered, and carrying
 * the reason rather than a status code on its own. Never the key, and
 * never the sender's address or their message — a log is not the place
 * for either, and the useful part is why the send failed.
 */
function logFailure(reason: string, detail?: Record<string, unknown>) {
  console.error(`[contact] send failed: ${reason}`, detail ? JSON.stringify(detail) : "");
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/* Web-standard handler. Vercel's Node runtime treats a default export as
   `(req, res) => void` and ignores a returned Response, so the form's
   messages never reached Resend. A named POST export gets a real Request
   and its Response is sent. */
export async function POST(req: Request): Promise<Response> {
  let payload: ContactPayload;
  try {
    payload = (await req.json()) as ContactPayload;
  } catch {
    return bad(400, { error: "Invalid JSON" });
  }

  const name = typeof payload.name === "string" ? payload.name.trim() : "";
  const email = typeof payload.email === "string" ? payload.email.trim() : "";
  const message =
    typeof payload.message === "string" ? payload.message.trim() : "";

  if (!name) return bad(400, { error: "Name is required" });
  if (!email || !EMAIL_RE.test(email))
    return bad(400, { error: "Valid email is required" });
  if (!message) return bad(400, { error: "Message is required" });
  if (name.length > 200) return bad(400, { error: "Name too long" });
  if (email.length > 320) return bad(400, { error: "Email too long" });
  if (message.length > 8000) return bad(400, { error: "Message too long" });

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    logFailure("RESEND_API_KEY is not set on this deployment");
    return bad(500, {
      error:
        "Email backend is not configured. Please set RESEND_API_KEY in Vercel.",
    });
  }

  const html = `
    <div style="font-family:system-ui,sans-serif;font-size:14px;line-height:1.55;color:#141412">
      <p><strong>From:</strong> ${escapeHtml(name)} &lt;${escapeHtml(email)}&gt;</p>
      <p><strong>Message:</strong></p>
      <p style="white-space:pre-wrap">${escapeHtml(message)}</p>
    </div>
  `;

  const text = `From: ${name} <${email}>\n\n${message}`;

  let resendRes: Response;
  try {
    resendRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        from: FROM,
        to: [TO],
        reply_to: email,
        subject: `[averrstudios.com] New message from ${name}`,
        html,
        text,
      }),
    });
  } catch (e) {
    logFailure("could not reach the email service", {
      cause: e instanceof Error ? e.message : String(e),
    });
    return bad(502, { error: "Could not reach email service" });
  }

  // Trust the status code — success is 2xx only.
  if (!resendRes.ok) {
    let providerMessage = "";
    try {
      const body = (await resendRes.json()) as { message?: string };
      providerMessage = body?.message ?? "";
    } catch {
      /* ignore */
    }
    logFailure("the email service rejected the send", {
      status: resendRes.status,
      providerMessage: providerMessage || "(none given)",
    });
    return bad(resendRes.status >= 500 ? 502 : 500, {
      error: providerMessage || `Email service returned ${resendRes.status}`,
    });
  }

  /* Logged too, so an empty log means no one wrote in rather than
     the form being broken again. No address and no message body. */
  console.log("[contact] send ok");

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { "content-type": "application/json" },
  });
}
