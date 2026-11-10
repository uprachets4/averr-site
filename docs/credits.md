# Image credits

## Atmosphere plates (`public/atmos/*.webp`)

**All atmosphere images are owner-generated** with Midjourney on a paid
plan. They are owned by Averr Studios. **No attribution is required**
and none is rendered on the site.

The sources live in `assets-src/atmosphere/` and are **gitignored** —
roughly 60 MB of PNG. Only the derivatives in `public/atmos/` ship.

### Pipeline

`tools/derive-atmosphere.mjs` (`node tools/derive-atmosphere.mjs`)
reads the sources and writes the WebP derivatives plus the manifest at
`src/data/atmosphere.ts`.

The grade is deliberately light — the images already sit in the Nolana
palette, so a duotone would flatten the mist they exist for:

- black point lifted to the site navy `#121C27` (per-channel linear)
- saturation to 0.88
- the site's deterministic film grain laid over in `soft-light`
- WebP quality 76
- widths 960 / 1440 / 1920 / 2560, **never upscaled** — a source only
  gets the widths below its own, plus its native width

Current output: **38 derivatives, 2.92 MB total.**

### Placement

| file | where it appears |
|---|---|
| `01-device-story-ridges` | behind the device story's glass UI |
| `02-work-card-warm` | behind the first work card |
| `03-work-card-cool` | behind the second work card |
| `04-one-studio-valley` | "One studio", behind the 3D PU mark (desktop) |
| `10-mobile-one-studio` | "One studio" on mobile (portrait) |
| `05-ending-lake` | the ending (desktop) |
| `06-mobile-ending` | the ending on mobile (portrait) |
| `07-spare-navy-valley` | spare — unused |
| `08-spare-stars-ridges` | spare — unused |
| `09-spare-ending-stars` | spare — unused |

No spare was needed: every placement passed legibility measurement.

### Legibility

Every text block sitting on a plate carries its own measured scrim,
sized to the text and feathered only outside it. Measured at 1440 and
390 with the text hidden, sampling the brightest ground pixel:

| text | 1440 | 390 |
|---|---|---|
| ending statement | 11.91:1 | 12.05:1 |
| ending chip | 12.83:1 | 10.89:1 |
| ending CTAs | 14.69:1 | 9.26:1 |
| One studio heading | 15.67:1 | 13.46:1 |
| One studio line | 14.72:1 | 13.51:1 |
| device story steps (worst run) | 6.26:1 | — |

All clear AA (4.5:1) with margin.

## Project captures (`public/work/**`)

Real screens from Averr Studios' own client work, used with the
clients' permission. These are the only photographic-origin assets on
the site besides the atmosphere plates.

## Map data

`src/data/osmOshawa.ts` is derived from OpenStreetMap —
**© OpenStreetMap contributors**, ODbL.
