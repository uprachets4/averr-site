import { useRef } from "react";
import { useReducedMotion, useScroll, useTransform } from "motion/react";
import { easing } from "../../lib/motion";
import { ReadFill } from "../case-study/ReadFill";

/**
 * NOT RENDERED since 18e — the founder section is credits now. This
 * file is kept deliberately: it holds the canonical bio sentences the
 * credit lines are sourced from, including the Google wording ruled on
 * in 18b, so the provenance of every credit line stays checkable and
 * the copy can be restored verbatim if the credits are reverted.
 *
 * The founder bio, read the way the case studies are read.
 *
 * The statement is the first sentence and carries the section; the rest
 * supports it. Each fills on its own scroll range so the statement has
 * finished before the support starts, which is the order you read them
 * in anyway.
 *
 * useFillVar (inside ReadFill) writes ONE custom property per paragraph
 * by subscription rather than through a motion style, which is what
 * keeps this off a ViewTimeline — the paragraphs are not moving through
 * their own scrollport.
 */

/**
 * SUPERSEDED IN PART. The 18e ruling re-worded the Google fact to
 * "B2B SaaS for Google" wherever it is RENDERED — which is the SALES
 * credit line. The sentence below is left exactly as it was because
 * this file's whole job is to record what the bio said; if it is ever
 * restored, the Google clause must be brought in line with that ruling
 * rather than copied as-is.
 */
export const FOUNDER_STATEMENT =
  "Toronto-based design engineer with a background spanning B2B SaaS sales within Google's extended workforce program, frontend development, and AI workflow automation.";

export const FOUNDER_SUPPORT =
  "Previously co-founded KlaasX Edutech (15-person team, 150+ institutions). Started Averr Studios to build the kind of client websites that actually earn their portfolio slot.";

export default function FounderStatement() {
  const reduce = !!useReducedMotion();

  const stRef = useRef<HTMLDivElement | null>(null);
  const spRef = useRef<HTMLDivElement | null>(null);

  const st = useScroll({ target: stRef, offset: ["start 88%", "end 58%"] });
  const sp = useScroll({ target: spRef, offset: ["start 90%", "end 62%"] });

  const stP = useTransform(st.scrollYProgress, [0, 1], [0, 1], { ease: easing.outQuart });
  const spP = useTransform(sp.scrollYProgress, [0, 1], [0, 1], { ease: easing.outQuart });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
      <div ref={stRef}>
        <ReadFill
          as="h3"
          text={FOUNDER_STATEMENT}
          progress={stP}
          reduce={reduce}
          className="type-h3"
          style={{ color: "var(--color-ink)", maxWidth: "26ch" }}
        />
      </div>
      <div ref={spRef}>
        <ReadFill
          text={FOUNDER_SUPPORT}
          progress={spP}
          reduce={reduce}
          className="type-body-lg"
          style={{ color: "var(--color-muted)", maxWidth: "46ch" }}
        />
      </div>
    </div>
  );
}
