import ServiceChapter, { type ChapterSpec } from "./ServiceChapter";
import { SiteStack } from "./chapterObjects";

const SPEC: ChapterSpec = {
  id: "ch-websites",
  word: "WEBSITES",
  tint: "rgba(200,118,60,0.42)",
  line: "Your website is the first thing people judge.",
  support:
    "We design and build sites that look like you meant it, load fast, and turn visits into enquiries.",
  services: [
    { pillar: "design", name: "Brand & design direction" },
    { pillar: "design", name: "Marketing websites" },
    { pillar: "grow", name: "Landing pages" },
    { pillar: "design", name: "Post-launch refinement" },
  ],
  fill: ["/work/cgwalls/w/hero-1400.webp", "/work/cgwalls/w/gallery2-1400.webp"],
  proof: "cg-walls-and-floors",
};

export default function WebsitesChapter() {
  return <ServiceChapter spec={SPEC} object={SiteStack} />;
}
