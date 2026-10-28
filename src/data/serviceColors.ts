/**
 * The service colour system — owner instruction, Session 29.
 *
 * Four services, four colours. The full ramp is the studio as a whole and
 * belongs anywhere all four appear together (the logo dot, the hero's
 * light moments); a single colour belongs to a surface that names or
 * shows ONE service.
 *
 * Rules that travel with these values:
 *   - never on body text;
 *   - one service colour per card;
 *   - under ~10% of any screen;
 *   - nothing violet (AI Automation) under 14px.
 */

export type ServiceId = "websites" | "webApps" | "aiAutomation" | "marketing";

/** The visible names, in the order the owner fixed them. */
export const SERVICE_NAMES: Record<ServiceId, string> = {
  websites: "Websites",
  webApps: "Web Apps",
  aiAutomation: "AI Automation",
  marketing: "Marketing",
};

export const SERVICE_COLOR: Record<ServiceId, string> = {
  websites: "#F9AF97",
  webApps: "#D5818C",
  aiAutomation: "#9874E8",
  marketing: "#569AFA",
};

/** All four together — the studio, never one service. */
export const STUDIO_GRADIENT =
  "linear-gradient(90deg, #F9AF97 0%, #D5818C 25%, #9874E8 50%, #708DF8 75%, #569AFA 100%)";

/** The hover glow the owner specified: the service's colour at 18%. */
export function serviceGlow(id: ServiceId): string {
  return `0 0 40px ${withAlpha(SERVICE_COLOR[id], 0.18)}`;
}

/** #RRGGBB -> rgba(r,g,b,a). */
export function withAlpha(hex: string, a: number): string {
  const h = hex.replace("#", "");
  const n = parseInt(h, 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
}

/**
 * Chip label -> service. One to one, by name.
 *
 * Session 29 opened with September's three pillars — Design, Automate,
 * Grow — and a judgement mapping them onto these four. The owner has
 * since renamed home's section to the four services, so that mapping is
 * gone: every surface on home now names a service directly and takes its
 * colour by name.
 */
export const CHIP_SERVICE: Record<string, ServiceId> = {
  Websites: "websites",
  "Web Apps": "webApps",
  "AI Automation": "aiAutomation",
  Marketing: "marketing",
};
