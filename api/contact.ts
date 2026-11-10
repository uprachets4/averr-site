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

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== "POST") {
    return bad(405, { error: "Method not allowed" });
  }

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
    return bad(resendRes.status >= 500 ? 502 : 500, {
      error: providerMessage || `Email service returned ${resendRes.status}`,
    });
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { "content-type": "application/json" },
  });
}
