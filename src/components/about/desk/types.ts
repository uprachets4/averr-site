/** Every screen on the monitor takes the same props. */
export type ScreenProps = {
  /** True while this is the screen the monitor is showing. */
  active: boolean;
  /** The stacked layout below 900px, or reduced motion. */
  stacked?: boolean;
  /** Always true inside the studio; kept so a screen can be reused. */
  dark?: boolean;
};

/**
 * The colour each screen lights the room with — its own dominant tone.
 * Solid here; the alphas are mixed in CSS so one value can drive both
 * the wide halo and the tight bloom on the bezel.
 *
 *   01 the crafted page's accent          electric blue
 *   02 the direction sheet's two glows    their midpoint
 *   03 the track and the dot              the panel's cyan
 *   04 the ages-well gradient's violet    violet
 */
export const SPILLS = ["#3D6BFF", "#5B74FF", "#2BD4D9", "#7C5CFF"];
