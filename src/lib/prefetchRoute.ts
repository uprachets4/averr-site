/**
 * Warm a route's chunk on hover or focus.
 *
 * The map comes from the build (tools/route-preload.ts), which already
 * uses it to preload the chunk for the path being loaded. This is the
 * same list, used a second way: by the time a pointer has rested on a
 * nav link the chunk is usually already in the cache, so the route
 * swap has nothing to wait for.
 *
 * `prefetch` rather than `modulepreload`: the visitor has not committed
 * to going there, and prefetch is the priority that says so. In dev
 * there is no map and every call is a no-op.
 */

type RouteChunks = Array<[string, string[]]>;

const warmed = new Set<string>();

function chunksFor(pathname: string): string[] | undefined {
  const map = (window as unknown as { __ROUTE_CHUNKS?: RouteChunks })
    .__ROUTE_CHUNKS;
  if (!map) return undefined;
  for (const [pattern, files] of map) {
    if (new RegExp(pattern).test(pathname)) return files;
  }
  return undefined;
}

export function prefetchRoute(to: string) {
  // a full URL, a hash or a query would all mis-key the cache
  const pathname = to.split("#")[0].split("?")[0];
  if (!pathname.startsWith("/") || warmed.has(pathname)) return;

  const files = chunksFor(pathname);
  if (!files) return;
  warmed.add(pathname);

  for (const href of files) {
    if (document.querySelector(`link[href="${href}"]`)) continue;
    const link = document.createElement("link");
    link.rel = "prefetch";
    link.as = "script";
    link.href = href;
    link.crossOrigin = "";
    document.head.appendChild(link);
  }
}
