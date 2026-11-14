/**
 * GET /api/geo → { country, region } from Vercel's edge headers.
 * Used only to pick the consent rules (opt-in for Quebec, the EU/EEA, the
 * UK and Switzerland). No IP address or anything else is returned or kept.
 */
export function GET(req: Request): Response {
  const country = req.headers.get("x-vercel-ip-country") || "";
  const region = req.headers.get("x-vercel-ip-country-region") || "";
  return new Response(JSON.stringify({ country, region }), {
    headers: { "content-type": "application/json", "cache-control": "private, no-store" },
  });
}
