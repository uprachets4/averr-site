# Averr Studios — Build Status

Branch: redesign-v2
Live preview: https://averr-git-redesign-v2-prachets-upadhyay-s-projects.vercel.app

## STACK
- Vite 8.2 + React 19 + TypeScript 6 + Tailwind v4 (CSS-first @theme)
- Motion (motion/react) for animation
- GSAP + @gsap/react installed, not yet used
- Three.js + @react-three/fiber + @react-three/drei installed, not yet used
- Deploys to Vercel as static SPA
- Repo: github.com/uprachets4/averr-site
- Local: ~/Developer/averr-site

## WHAT'S LIVE (Home page complete)
All in src/components/:
- Nav.tsx — glassmorphic sticky, scroll-shift, Cal.com CTA (cal.com/prachets/discoverycall)
- Hero.tsx — centered, headline with pill on "serious", magnetic CTAs, trust bar
- Pillars.tsx — 3-column DESIGN/AUTOMATE/GROW with hairline dividers
- Numbers.tsx — 3 stats with shifting-gradient numbers (40+, 15x, 1.4s)
- CaseStudies.tsx — dark inversion, featured card (CG Walls 85%), 2 supporting stats
- FinalCTA.tsx — pill on "actually", both CTAs
- Footer.tsx — 4 columns + legal bottom bar

Global:
- src/index.css — @theme design tokens + reset + .grain-light + .grain-dark + .fade-h + .num-gradient + .pill-hl
- src/App.tsx — renders Nav → Hero → Pillars → Numbers → CaseStudies → FinalCTA → Footer
- index.html — Google Fonts (Geist + Inter + Geist Mono), meta tags, OG, Twitter card
- src/legacy/components-v1/ — 30 original components archived (do not touch)

## CONFIRMED WORKING (on live preview)
- Home renders all sections correctly desktop + mobile
- Nav glass shift on scroll
- Pill highlight visible with gradient text inside dark chip
- Magnetic CTA hover
- Card entrance animation on scroll (staggered)
- Section transitions cream → dark → cream

## KNOWN COSMETIC ISSUES (log for polish pass, NOT BLOCKING)
1. The "serious" pill inner gradient shine may be static — Tailwind v4 possibly overriding background-clip: text animation
2. Git repo push size 76MB — node_modules was tracked in early history before .gitignore added. Needs git filter-repo cleanup.
3. Vite config uses deprecated __dirname (warning on npm run dev, not blocking)

## OPEN NON-BLOCKERS
- PP Neue Montreal not purchased yet (Geist works as fallback)
- Vercel Speed Insights + Web Analytics not enabled (free on Pro plan)
- Two motion libs installed (framer-motion + motion) — dedupe in polish pass
- Cookie banner + Plausible analytics not wired yet (needed before public launch)
- Privacy policy not written (need Iubenda subscription)

## SERVICES PAGE: shipped
Live on redesign-v2 preview at `/services`. One page, all three pillars in extended detail. Sitemap wins the pricing conflict — no on-page numeric prices anywhere; every pillar block ends in a Book-a-call CTA, and the "Typical engagement" line describes timeline shape only.

Sections shipped (7 rendered + Footer via App shell):
1. Header — "Three services. One [studio] behind them all."
2. DESIGN — intro / What's included (5 bullets) / Typical engagement / Recent work: CG Walls & Floors / CTA
3. AUTOMATE — same structure / Recent work: CareerClarity AI / on bg-alt for rhythm
4. GROW — same structure / Recent work: SIFT and CadenceStack
5. What we don't do — dark inversion, 3 lines, "boutique studio" close
6. How to start — 3 steps, bg-warm
7. Final CTA — reuses FinalCTA component

Routing shipped: react-router-dom installed; `vercel.json` rewrites everything to `/index.html`; Nav uses `<Link>`; unbuilt routes (`/work`, `/about`, `/writing`, etc.) fall through to a lightweight NotFound placeholder pointing back to `/` and `/services`.

Motion dedup: `framer-motion` uninstalled. All components already used `motion/react`. Bundle saves ~34KB.

## AFTER SERVICES (in order)
- Work index (bento grid)
- Case study detail template
- About
- Contact
- 404
- Then Tier 2 (Process, Writing, Legal via Iubenda)

## WORKFLOW LESSONS LEARNED (repeat these)
1. Heredoc corrupts multi-line JSX — the > operator gets misread. For .tsx files with complex JSX, use Cursor drop-and-replace, NEVER terminal heredoc.
2. Small config/CSS files with heredoc are fine — App.tsx, index.css, index.html all worked via heredoc.
3. Inline styles beat Tailwind v4 utilities for critical colors — token resolution is unreliable.
4. Commit and push after every completed section — don't wait for whole page.
5. Restart dev server after config changes — Vite doesn't always hot-reload CSS token changes.
