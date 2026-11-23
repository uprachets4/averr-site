import IndustryPage from "../components/industries/IndustryPage";

/**
 * /industries/contractors.
 *
 * Owns "contractor website design toronto", which the CG Walls & Floors
 * case file used to declare. See `src/data/industries.ts` for why it
 * moved.
 */
export default function IndustryContractors() {
  return <IndustryPage industryKey="contractors" metaKey="industryContractors" />;
}
