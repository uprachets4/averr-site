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
 * September's three pillars are NOT the four services, so this mapping is
 * a judgement, not a fact, and it is the one thing here to check.
 *
 * The restored sections name **Design**, **Automate** and **Grow** — the
 * pillar vocabulary — and the spec says not to rename them. Their content
 * is what decides the colour: Automate's services are the AI ones and
 * Grow's are the marketing ones, so those two are the same offering under
 * an older name. Design covers both "Marketing websites" and "Product &
 * SaaS interfaces", so it spans Websites and Web Apps and is given
 * Websites, the larger half.
 *
 * Web Apps therefore has no surface on home until the doors are renamed.
 */
export const PILLAR_SERVICE: Record<string, ServiceId> = {
  design: "websites",
  automate: "aiAutomation",
  grow: "marketing",
};

/** The same mapping for the case-study chips, which use the pillar words. */
export const CHIP_SERVICE: Record<string, ServiceId> = {
  Design: "websites",
  Automate: "aiAutomation",
  Grow: "marketing",
};
