/**
 * Build-time prerender entry (tools/prerender.mjs). Renders a route to HTML
 * so every URL ships its own text, headings and links before any script
 * runs — for search engines, AI crawlers and link previews. The browser
 * still boots with createRoot and replaces this markup; nothing here runs
 * on the client.
 */
import { StrictMode } from "react";
import { prerender } from "react-dom/static";
import { StaticRouter } from "react-router";
import App from "./App";

export async function render(url: string): Promise<string> {
  const { prelude } = await prerender(
    <StrictMode>
      <StaticRouter location={url}>
        <App />
      </StaticRouter>
    </StrictMode>
  );
  const reader = prelude.getReader();
  const dec = new TextDecoder();
  let html = "";
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    html += dec.decode(value, { stream: true });
  }
  return html + dec.decode();
}

/* Data the prerender script needs to write each page's head. */
export { META } from "./lib/documentMeta";
export { BUILT } from "./data/builtByAverr";
export { FAQ, SERVICES as SERVICE_CARDS } from "./data/servicesBuild";
