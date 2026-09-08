# Averr Studios — Redesign v2 Handoff

**Last updated:** 2026-09-08
**Branch:** `redesign-v2`
**Status:** Design tokens + Nav component live. Placeholder App shell renders. Next: real Hero component.

---

## 1 · Project context

- **Studio:** Averr Studios · Toronto (GTA)
- **Operator:** Prachets Upadhyay (solo)
- **Business email:** prachets@averrstudios.com
- **Cal.com:** cal.com/prachets/discoverycall
- **Repo:** github.com/uprachets4/averr-site
- **Deploy:** Vercel (auto from `main`, preview from `redesign-v2`)
- **Stack:** Vite 8.2 + React 19.2 + TypeScript 6 + Tailwind v4 (CSS-first `@theme`)
- **Sister project:** "Studio Growth & Marketing" (separate Claude project — positioning, pricing, cold outreach, content strategy live there, NOT here). Website Studio project = design + build only.

## 2 · Positioning (locked)

**Three pillars:** DESIGN · AUTOMATE · GROW

| Pillar | Contains |
|---|---|
| **Design** | Websites, SaaS product UI, design systems |
| **Automate** | AI agents, workflows, custom automations |
| **Grow** | Meta, Google, LSA, social content, organic + paid |

**Elevator pitch:** *"Averr Studios designs the websites, engineers the SaaS products and AI systems, and grows the audiences of businesses that refuse to look templated."*

**Site hero headline (locked):** *"The studio for businesses that want to look [serious]."*
Where `[serious]` is the pill-highlighted keyword with gradient text inside.

**Ideal clients:**
- Primary (aspirational): Toronto Series-A founders needing website + SaaS UI + AI agents at flagship craft
- Secondary (bread-and-butter): GTA law firms, healthtech, professional services needing rebuilds + marketing + automation
- **Design for primary. Secondary trusts a site aimed higher; reverse doesn't work.**

**Rough pricing anchors** (real pricing lives in Studio Growth project):
| Service | SMB tier | Mid-market tier |
|---|---|---|
| Website | $800 – $3,500 CAD | $8K – $25K |
| Marketing retainer | $1,500 – $5K/mo | $5K – $15K/mo |
| AI automation project | $3K – $10K | $10K – $30K |
| SaaS product build (MVP) | $10K – $25K | $30K – $75K |

## 3 · Visual language (locked)

**Direction:** Nolana-anchored. Warm cream base with one dark inversion moment. No orange, no italic, no chromatic accent (monochrome).

### Palette

```css
--color-bg:         #F4F0E6;   /* primary cream */
--color-bg-alt:     #EDE9E2;   /* elevated cards, alt sections */
--color-bg-warm:    #E8E1D0;   /* warmer break */
--color-dark:       #141412;   /* dark inversion sections */
--color-dark-alt:   #1C1B18;   /* elevated on dark */
--color-ink:        #141412;   /* text on light */
--color-ink-soft:   #2A2926;   /* text emphasis */
--color-parch:      #EDE9E2;   /* text on dark */
--color-muted:      #6B665C;   /* secondary text on light */
--color-muted-2:    #8A8377;   /* tertiary/captions */
--color-muted-l:    #7A7770;   /* secondary text on dark */
```

Hairlines: `rgba(20,20,18,0.10)` on light, `rgba(237,231,218,0.10)` on dark.

### Typography

| Face | Preview (free) | Production (paid) |
|---|---|---|
| Display | Geist | PP Neue Montreal (Pangram Pangram, ~$60–150, PENDING PURCHASE) |
| Body | Inter Variable | Inter Variable (same) |
| Mono | Geist Mono | Geist Mono (same) |

**Zero italic serif.** No editorial accent faces. All sans, tight tracking, sentence case.

### Signature moves

1. **Pill highlight** — one keyword in every major headline wrapped in dark rounded chip with gradient text inside (white → cream → muted cream, horizontal shine animation)
2. **Treatment B — horizontal gradient fade** — locked as THE signature gradient move on select headlines. Ink → ink → muted → transparent, left to right.
3. **Number stats with shifting gradient** — Nolana move. 8-stop vertical gradient (ink → muted → transparent) with 8-second animated position shift, giving numbers a subtle "shimmer" of colors.
4. **Grain overlay** — 6% opacity on light surfaces (multiply blend), 7% on dark (overlay blend). Prevents flat digital feel.
5. **Section markers** — `//_01`, `//_02` monospace labels above section titles.

### Motion (Phase 2 implementation)

**Layer 1 (ambient, always):** radial gradients drift 60–90s cycle, grain animates subtly, cursor-tracked warm glow in hero.

**Layer 2 (load, first 1.5s):** nav → eyebrow → headline word-by-word (150ms stagger) → pill scale-in bounce → subhead → CTAs → trust bar.

**Layer 3 (scroll):** every section eyebrow → title → body → CTA (100ms stagger, `useInView`). Numbers count up on scroll. Cream ↔ dark transitions animate. Sticky-scroll pillar reveal. 0.3× parallax on hero bg.

**Layer 4 (hover):** primary CTAs magnetic (0.15 strength), cards lift -6px, nav underline draw-on, pillars background wash, case study cards reveal preview.

## 4 · Sitemap (v2, approved)

Full doc: `/mnt/user-data/outputs/averr-sitemap-v2.md`

**Tier 1 — MVP (7 pages, build order):**
1. Nav + Footer components (reused)
2. Home (`/`) — hero → pillars → numbers → dark case studies → final CTA → footer
3. Services (`/services`) — one page with all three pillars extended
4. Work index (`/work`) — bento grid
5. Case study detail (`/work/[slug]`) — dynamic template, min 3 studies
6. About (`/about`) — story + principles + stack + other work
7. Contact (`/contact`) — Cal.com embed + form fallback + mini FAQ (no pricing)
8. 404 — small delight

**Tier 2 (30 days after launch):** Process, Writing, Privacy/Cookies/Terms (Iubenda)

**Tier 3 (60+ days):** Lab, standalone Testimonials/FAQ, Resources. Explicitly NO pricing page.

**Globals (every page):** Nav, Footer, cookie banner, grain overlay, section markers, skip link (`Skip to main content`), loading states, robots.txt, sitemap.xml (via Vite plugin), OG images, Twitter cards, meta title+description, analytics (Plausible default, cookieless PIPEDA-friendly).

**Content dependencies:**
- Case studies: Prachets has content ready
- Trust bar clients (confirmed real): CG Walls & Floors, CareerClarity AI, SIFT, CadenceStack
- About copy, portrait photo, testimonials with attribution: TBD

## 5 · Reference files (in Claude outputs)

| File | Purpose |
|---|---|
| `premium-website-master-reference.md` | Master playbook, 3,609 lines, 11 parts + 8 appendices — Core Web Vitals, accessibility, motion, media, procurement, compliance, workflow |
| `averr-direction-v5-pill-gradient.html` | **THE visual reference** for the build — open in browser to see palette + type + pill gradient + shifting numbers + featured case study + final CTA |
| `averr-sitemap-v2.md` | Full page structure audited |

The v5 preview HTML is the ground truth for how everything should look. Every component built in Phase 2 must match its section in this file.

## 6 · Reference sites (external)

- **Nolana** (nolana.com) — THE anchor. Warm cream base, sentence case, `//_ ` markers, shifting number gradients, sticky-scroll reveals.
- TBD Studio (tbdstudio.framer.ai) — restraint reference
- Span (span.framer.ai) — restraint reference
- Axonix, Knotch, FintechX — Framer template baseline (avoid the templated feel)

## 7 · What's live right now

**Branch:** `redesign-v2`
**On disk:**
- `src/index.css` — design tokens + reset + grain overlays + `.fade-h` + `.num-gradient` + `.pill-hl` (Tailwind v4 `@theme`)
- `index.html` — Google Fonts (Geist + Inter + Geist Mono), meta tags, OG, Twitter card
- `src/App.tsx` — placeholder shell using Nav + hero test copy
- `src/components/Nav.tsx` — glassmorphic sticky nav with scroll shift, Book-a-call CTA linking to cal.com
- `src/legacy/components-v1/` — all 30 original components archived (do not touch, do not delete, reference only)
- `src/legacy/index-v1.css` — original tokens archived

**Verified working:**
- Design tokens render (cream bg, dark text, pill highlight around "studio")
- Nav renders with brand + 4 links + Book-a-call CTA
- Nav glass shifts on scroll
- Nav hover states work

**Known cosmetic:** pill inner-span gradient text may not show shine — Tailwind v4 possibly overriding `background-clip: text` on the nested span. Debug in polish pass.

## 8 · Open blockers

1. **Buy PP Neue Montreal** — Pangram Pangram, web license, ~$60–150. Not blocking build (Geist works as fallback), swap in later.
2. **Analytics** — defaulted to Plausible (cookieless, PIPEDA-friendly, $9/mo). Override to GA4 anytime.
3. **Legacy `framer-motion` + `motion` both installed** — dedupe in polish pass. Not blocking.

## 9 · Immediate next step

**Build the real Hero component** per v5 preview's hero section:
- Centered layout (hero-content max-width 1100px)
- Mono eyebrow "A boutique studio · Toronto" with hairline decorations
- Headline: "The studio for businesses that want to look [serious]." — with pill highlight around "serious"
- Subhead: "Averr Studios designs premium websites, builds AI automations, and runs the marketing engines for small and mid-market businesses across the GTA."
- Two CTAs: primary "Book a discovery call →" (dark pill, links to cal.com/prachets/discoverycall) + ghost "See our work →" (hairline border)
- Trust bar under hero: "Recent work" label + 4 real client names (CG Walls & Floors, CareerClarity AI, SIFT, CadenceStack)
- Hero bg: cream with two subtle radial gradients (top-left, bottom-right)
- Grain overlay at 6%
- Load choreography via Motion library — nav → eyebrow → headline word-by-word (150ms stagger) → pill scale-in → subhead → CTAs → trust bar

**Then:** Footer component, Pillars section, Numbers section, Dark case studies section (featured card + supporting stats), Final CTA.

**Then:** Services, Work index, Case Study template, About, Contact, 404.

## 10 · Standing rules

- **Evidence gate:** nothing marked closed without screenshot / live URL / received email as proof. No self-reported confirmations.
- **Numerical specificity in prompts:** hard values (contrast ratios, LCP targets, line counts) beat directional language.
- **Design system locks — DO NOT reintroduce:** amber/orange accents (`#D97841` REJECTED), italic serif emphasis (Instrument Serif REJECTED), Geist as production display (fallback only). Warm cream + dark ink + monochrome accents ONLY.
- **CSS-only plateau at "compliant but not premium"** — escalate to Motion / GSAP / R3F / shaders when needed.
- **Framer for client sites, Vite+React for the studio site itself** — confirmed architectural split.
- **Every commit on `redesign-v2` branch. Do not merge to main until Phase 3 polish complete.**

---

*Redesign is running against Nolana-anchored quality bar. Ship discipline over ship speed.*
