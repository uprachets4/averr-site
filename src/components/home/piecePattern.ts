/**
 * The giant words' fill.
 *
 * Until Session 26 each chapter's word was filled with two real project
 * captures. Captures now appear exactly once on home — the work section
 * — so the fill becomes a slow-drifting pattern made of the chapter's
 * OWN pieces: the word is literally made of the things the chapter
 * assembles.
 *
 * An inline SVG data URI rather than a file: it is a few hundred bytes,
 * it needs no request, and `background-position` already drifts it
 * (ServiceChapter pans the fill across the letterforms with scroll).
 *
 * Nothing in here is text a reader is meant to read — it is texture
 * behind a parch wash — so the tiles carry shapes and glyph forms only.
 */

const PARCH = "#EDE9E2";
const ACCENT = "#C8763C";

function uri(svg: string) {
  return `url("data:image/svg+xml,${encodeURIComponent(svg.replace(/\s+/g, " ").trim())}")`;
}

/** Ch2 — type specimens and colour chips. */
export const WEBSITES_FILL = uri(`
<svg xmlns='http://www.w3.org/2000/svg' width='320' height='220' viewBox='0 0 320 220'>
  <rect width='320' height='220' fill='#1A1813'/>
  <g font-family='Geist, sans-serif' font-weight='600' fill='${PARCH}' opacity='0.9'>
    <text x='18' y='70' font-size='62'>Aa</text>
    <text x='196' y='182' font-size='54'>Aa</text>
  </g>
  <g font-family='Georgia, serif' font-style='italic' fill='${ACCENT}' opacity='0.95'>
    <text x='170' y='72' font-size='58'>Aa</text>
    <text x='24' y='186' font-size='50'>Aa</text>
  </g>
  <g opacity='0.95'>
    <rect x='126' y='96' width='34' height='34' rx='7' fill='${ACCENT}'/>
    <rect x='166' y='96' width='34' height='34' rx='7' fill='${PARCH}'/>
    <rect x='206' y='96' width='34' height='34' rx='7' fill='#6B665C'/>
    <rect x='86' y='96' width='34' height='34' rx='7' fill='#2A2926'/>
  </g>
</svg>`);

/** Ch3 — interface components. */
export const PRODUCTS_FILL = uri(`
<svg xmlns='http://www.w3.org/2000/svg' width='300' height='210' viewBox='0 0 300 210'>
  <rect width='300' height='210' fill='#15171D'/>
  <g opacity='0.95'>
    <rect x='16' y='20' width='104' height='30' rx='9' fill='${ACCENT}'/>
    <rect x='140' y='20' width='64' height='30' rx='15' fill='${PARCH}' opacity='0.5'/>
    <circle cx='236' cy='35' r='15' fill='${PARCH}' opacity='0.75'/>
    <rect x='16' y='70' width='188' height='12' rx='6' fill='${PARCH}' opacity='0.4'/>
    <rect x='16' y='92' width='126' height='12' rx='6' fill='${PARCH}' opacity='0.28'/>
    <rect x='16' y='126' width='80' height='58' rx='10' fill='${PARCH}' opacity='0.22'/>
    <rect x='108' y='126' width='80' height='58' rx='10' fill='${PARCH}' opacity='0.16'/>
    <rect x='200' y='126' width='80' height='58' rx='10' fill='${ACCENT}' opacity='0.5'/>
    <path d='M212 70 L240 54 L268 62 L288 40' stroke='${ACCENT}' stroke-width='4' fill='none' stroke-linecap='round'/>
  </g>
</svg>`);
