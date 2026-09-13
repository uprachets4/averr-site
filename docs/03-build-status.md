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

## IMMEDIATE NEXT STEP: Services page
Per sitemap Tier 1 build order #3. One page (/services) with all three pillars in extended detail.

Sections (8 total):
1. Header — "Three services. One studio." + subhead
2. DESIGN pillar detail — what's included, timeline, starts at price, sample deliverables
3. AUTOMATE pillar detail — same structure
4. GROW pillar detail — same structure
5. What we don't do — no retainer minimums, no white-label, no 12-month contracts
6. How to start — 3-step visual (Book call → Scope → Kickoff)
7. Final CTA — Book a call
8. Footer

Routing note: No routing library installed yet. Recommend installing react-router-dom before Services build so we can have real /services, /work, /about, /contact routes.

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
