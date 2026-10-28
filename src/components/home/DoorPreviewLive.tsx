import { lazy, Suspense, useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useReducedMotion } from "motion/react";
import { duration, ease } from "../../lib/motion";
import type { PillarId } from "../../data/servicePillars";

/**
 * The live miniature inside a door's preview frame.
 *
 * The door used to show a hand-made still per pillar. It now shows the
 * REAL /services screens for that pillar, cycling — the same
 * components, in their `compact` layout, which exists precisely so
 * they can be rendered small without becoming the scaled-stills
 * gotcha (§5: the dense desktop composition restructures rather than
 * shrinks).
 *
 * Mounted ONLY while the door is hovered or focused, and each pillar's
 * screens are a lazy import, so home's initial JS does not carry any
 * of it. Everything inside is decorative — the door's own copy is the
 * accessible content — so the whole frame is aria-hidden.
 */

const Design = lazy(async function loadDesign() {
  const m = await import("../services/build/BuildScreens");
  return {
    default: function DesignCycle(p: CycleProps) {
      return <Cycle {...p} screens={[m.ScreenBrandBoard, m.ScreenLocalSite, m.ScreenAnalytics, m.ScreenLibrary, m.ScreenRelease]} />;
    },
  };
});
const Automate = lazy(async function loadAutomate() {
  const m = await import("../services/build/AutomateScreens");
  return {
    default: function AutomateCycle(p: CycleProps) {
      return <Cycle {...p} screens={[m.ScreenAudit, m.ScreenAgent, m.ScreenCanvas, m.ScreenInbox, m.ScreenDocs]} />;
    },
  };
});
const Grow = lazy(async function loadGrow() {
  const m = await import("../services/build/GrowScreens");
  return {
    default: function GrowCycle(p: CycleProps) {
      return <Cycle {...p} screens={[m.ScreenMap, m.ScreenSequence, m.ScreenAds, m.ScreenABTest, m.ScreenCalendar, m.ScreenReport]} />;
    },
  };
});

type ScreenComp = (p: { local: ReturnType<typeof useMotionValue<number>>; compact?: boolean }) => React.ReactNode;
type CycleProps = { reduce: boolean };

/** Steps through a pillar's screens with the app-switch crossfade. */
function Cycle({ reduce, screens }: CycleProps & { screens: ScreenComp[] }) {
  const [i, setI] = useState(0);
  // the screens animate off a scroll value on /services; here they are
  // simply held at their settled state
  const local = useMotionValue(1);

  useEffect(
    function step() {
      if (reduce || screens.length < 2) return;
      const t = window.setInterval(function next() {
        setI((v) => (v + 1) % screens.length);
      }, 2200);
      return function stop() {
        window.clearInterval(t);
      };
    },
    [reduce, screens.length]
  );

  const Screen = screens[i];
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={i}
        className="dpl-screen"
        initial={reduce ? false : { opacity: 0, scale: 0.985 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={reduce ? undefined : { opacity: 0, scale: 1.01 }}
        transition={{ duration: reduce ? 0 : duration.base, ease: ease.outQuart }}
      >
        <Screen local={local} compact />
      </motion.div>
    </AnimatePresence>
  );
}

export default function DoorPreviewLive({ pillar }: { pillar: PillarId }) {
  const reduce = !!useReducedMotion();
  const Pillar = pillar === "design" ? Design : pillar === "automate" ? Automate : Grow;

  return (
    <div className="dpl" aria-hidden="true">
      <Suspense fallback={<span className="dpl-wait" />}>
        <Pillar reduce={reduce} />
      </Suspense>
      <style>{`
        .dpl {
          position: absolute; inset: 0; overflow: hidden;
          background: var(--color-bg);
        }
        .dpl-screen { position: absolute; inset: 0; overflow: hidden; }
        .dpl-wait { position: absolute; inset: 0; background: var(--color-bg-alt); }
      `}</style>
    </div>
  );
}
