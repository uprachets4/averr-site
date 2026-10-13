import ServiceChapter, { type ChapterSpec } from "./ServiceChapter";
import { Orb } from "./chapterObjects";

const SPEC: ChapterSpec = {
  id: "ch-ai",
  word: "AUTOMATE",
  tint: "rgba(123,92,255,0.44)",
  line: "The busywork, handled. Your team gets its week back.",
  support:
    "AI agents and automations that qualify leads, answer intake and move data, with a human signing off.",
  services: [
    { pillar: "automate", name: "Workflow audit" },
    { pillar: "automate", name: "AI agents" },
    { pillar: "automate", name: "Tool integration" },
    { pillar: "automate", name: "Human review built in" },
    { pillar: "automate", name: "Handoff documentation" },
  ],
  fill: [
    "/work/cadencestack/w/01-command-center-1680.webp",
    "/work/capitalcommand/w/05-signal-desk-1680.webp",
  ],
  proof: "cadencestack",
};

export default function AutomationChapter() {
  return <ServiceChapter spec={SPEC} object={Orb} />;
}
