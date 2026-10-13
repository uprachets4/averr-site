import ServiceChapter, { type ChapterSpec } from "./ServiceChapter";
import { Exploded } from "./chapterObjects";

const SPEC: ChapterSpec = {
  id: "ch-products",
  word: "PRODUCTS",
  tint: "rgba(61,107,255,0.44)",
  line: "Software your customers actually enjoy using.",
  support: "Dashboards, portals and SaaS products, designed and built as one system.",
  services: [
    { pillar: "design", name: "Product & SaaS interfaces" },
    { pillar: "design", name: "Design systems" },
  ],
  fill: [
    "/work/capitalcommand/w/01-overview-1680.webp",
    "/work/sift/w/01-command-overview-1680.webp",
  ],
  lift: 0.8,
  proof: "capitalcommand",
};

export default function ProductsChapter() {
  return <ServiceChapter spec={SPEC} object={Exploded} />;
}
