import ServiceChapter, { type ChapterSpec } from "./ServiceChapter";
import { Rings } from "./chapterObjects";

const SPEC: ChapterSpec = {
  id: "ch-marketing",
  word: "GROW",
  tint: "rgba(212,168,75,0.44)",
  line: "Be the business people find first.",
  support:
    "Local search, outreach, ads, content and reporting that compound month over month.",
  /* Landing pages lives in the Websites chapter by owner ruling, so this
     chapter carries the remaining five Grow services. */
  services: [
    { pillar: "grow", name: "Local search" },
    { pillar: "grow", name: "Outreach campaigns" },
    { pillar: "grow", name: "Paid ads" },
    { pillar: "grow", name: "Content" },
    { pillar: "grow", name: "Reporting" },
  ],
  fill: [
    "/work/cgwalls/w/gallery-1400.webp",
    "/work/cadencestack/w/04-performance-analytics-1680.webp",
  ],
  proof: "cg-walls-and-floors",
};

export default function MarketingChapter() {
  return <ServiceChapter spec={SPEC} object={Rings} />;
}
