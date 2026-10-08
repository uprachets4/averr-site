/** Every screen on the monitor takes the same props. */
export type ScreenProps = {
  /** True while this is the screen the monitor is showing. */
  active: boolean;
  /** The stacked layout below 900px, or reduced motion. */
  stacked?: boolean;
  /** Always true inside the studio; kept so a screen can be reused. */
  dark?: boolean;
};

/** The colour each screen lights the room with. */
export const SPILLS = [
  "rgba(61, 107, 255, 0.30)",
  "rgba(124, 92, 255, 0.30)",
  "rgba(43, 212, 217, 0.24)",
  "rgba(124, 92, 255, 0.32)",
];
