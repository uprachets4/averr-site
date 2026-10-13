import ServiceChapter, { type ChapterSpec } from "./ServiceChapter";
import ProductsScene from "./scenes/ProductsScene";
import { PRODUCTS_FILL } from "./piecePattern";

/**
 * Ch3 — Products.
 *
 * Session 26: the three real product captures and their proof tiles are
 * GONE from here. Captures appear exactly once on home now — the work
 * section — so the chapter shows what a product is MADE of instead of
 * what three of ours look like: an app skeleton of primitives that
 * explodes into its named layers and re-locks inside a ring of its own
 * design system. "See real ones" sends the reader to the work.
 */

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
  fill: PRODUCTS_FILL,
  lift: 0.8,
  proof: "capitalcommand",
};

export default function ProductsChapter() {
  return <ServiceChapter spec={SPEC} object={ProductsScene} />;
}
