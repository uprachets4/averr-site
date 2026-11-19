import PillarPage from "../components/services/pillar/PillarPage";

/**
 * /services/websites.
 *
 * The page itself lives in PillarPage, driven by `PILLARS.websites`
 * and the copy in `data/pillarPages.ts`. This file existed as 230
 * lines of markup until Web Apps arrived and made it a template; the
 * markup is shared now, so a spacing or contrast fix lands on every
 * pillar at once rather than once per page.
 */
export default function ServiceWebsites() {
  return <PillarPage id="websites" metaKey="serviceWebsites" />;
}
