import type { Plugin } from "vite";

/**
 * Preload the route chunk for the path actually being loaded.
 *
 * Routes are lazy, so a cold visit to anything but home costs a second
 * round trip: the entry chunk has to download, parse and mount before
 * React even asks for the route's own chunk. On /services that was the
 * whole gap between a 1.9s first contentful paint and a 2.8s LCP.
 *
 * At build time this reads the bundle, works out which chunk each route
 * resolves to (plus that chunk's own static imports), and writes a tiny
 * map into index.html. An inline script in <head> matches
 * location.pathname against it and appends <link rel="modulepreload">
 * before the entry script has run, so both downloads overlap.
 *
 * The map is also left on window for src/lib/prefetchRoute.ts, which
 * warms the same chunks when a nav link is hovered or focused.
 */

/** Ordered: the first pattern that matches a path wins. */
const ROUTES: Array<{ test: string; module: string }> = [
  { test: "^/services(/|$)", module: "src/pages/Services.tsx" },
  { test: "^/work/[^/]+", module: "src/pages/CaseStudy.tsx" },
  { test: "^/work(/|$)", module: "src/pages/Work.tsx" },
  { test: "^/about(/|$)", module: "src/pages/About.tsx" },
  { test: "^/contact(/|$)", module: "src/pages/Contact.tsx" },
];

export default function routePreload(): Plugin {
  return {
    name: "averr:route-preload",
    apply: "build",
    transformIndexHtml: {
      order: "post",
      handler(html, ctx) {
        const bundle = ctx.bundle;
        if (!bundle) return html;

        const byFile = new Map<string, { imports: string[] }>();
        const byModule = new Map<string, string>();
        let entry: string | undefined;

        for (const [file, out] of Object.entries(bundle)) {
          if (out.type !== "chunk") continue;
          byFile.set(file, { imports: out.imports });
          if (out.isEntry) entry = file;
          if (out.facadeModuleId) {
            const id = out.facadeModuleId.split("\\").join("/");
            byModule.set(id, file);
          }
        }

        /** A chunk plus everything it statically imports, entry excluded. */
        function closure(file: string): string[] {
          const seen = new Set<string>();
          const stack = [file];
          while (stack.length) {
            const f = stack.pop()!;
            if (seen.has(f) || f === entry) continue;
            seen.add(f);
            for (const i of byFile.get(f)?.imports ?? []) stack.push(i);
          }
          return [...seen];
        }

        const map: Array<[string, string[]]> = [];
        for (const route of ROUTES) {
          let file: string | undefined;
          for (const [id, f] of byModule) {
            if (id.endsWith(route.module)) {
              file = f;
              break;
            }
          }
          if (!file) continue;
          map.push([route.test, closure(file).map((f) => `/${f}`)]);
        }

        if (map.length === 0) {
          this.warn(
            "route-preload: no route chunks matched — is the route list stale?"
          );
          return html;
        }

        // No modules, no imports: this has to run before the entry script,
        // which means it cannot be one.
        const script =
          `<script>(function(){var m=${JSON.stringify(map)};` +
          `window.__ROUTE_CHUNKS=m;` +
          `var p=location.pathname,i,r;` +
          `for(i=0;i<m.length;i++){if(new RegExp(m[i][0]).test(p)){r=m[i][1];break}}` +
          `if(!r)return;` +
          `for(i=0;i<r.length;i++){var l=document.createElement("link");` +
          `l.rel="modulepreload";l.href=r[i];l.crossOrigin="";document.head.appendChild(l)}` +
          `})();</script>`;

        return html.replace("</head>", `  ${script}\n  </head>`);
      },
    },
  };
}
