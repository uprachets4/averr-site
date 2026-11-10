# Averr Studios — Design Direction (v5 locked)

## POSITIONING
Pillars: DESIGN · AUTOMATE · GROW

Elevator pitch: "Averr Studios designs the websites, engineers the SaaS products and AI systems, and grows the audiences of businesses that refuse to look templated."

Hero headline (locked): "The studio for businesses that want to look [serious]."
- "[serious]" = pill-highlighted keyword with gradient text inside

Final CTA headline: "Build something that [actually] looks like you meant it."

Primary ICP: Toronto Series-A founders (design for this)
Secondary ICP: GTA law firms, healthtech, pro services

## PALETTE (all in src/index.css @theme)
- --color-bg: #F4F0E6 (primary cream)
- --color-bg-alt: #EDE9E2 (elevated/alt sections)
- --color-bg-warm: #E8E1D0 (warmer break)
- --color-dark: #141412 (dark inversion sections)
- --color-dark-alt: #1C1B18 (elevated on dark)
- --color-ink: #141412 (text on light)
- --color-ink-soft: #2A2926 (text emphasis)
- --color-parch: #EDE9E2 (text on dark)
- --color-muted: #6B665C (secondary text on light)
- --color-muted-2: #8A8377 (tertiary/captions)
- --color-muted-l: #7A7770 (secondary on dark)

Hairlines: rgba(20,20,18,0.10) on light / rgba(237,231,218,0.10) on dark.

## TYPOGRAPHY
- Display: Geist (preview) → PP Neue Montreal (production, PENDING PURCHASE from Pangram Pangram ~$60-150)
- Body: Inter Variable (Google Fonts)
- Mono: Geist Mono (Google Fonts)

Type scale (px, desktop):
- Display: 72-96 / weight 500 / tracking -0.035em / line 0.98
- H1: 48 / 500 / -0.025em / 1.10
- H2: 32 / 500 / -0.015em / 1.20
- Body: 17 / 400 / 0 / 1.60
- Eyebrow: 12 / 500 / +0.24em uppercase

ZERO italic serif. All sans, tight tracking, sentence case.

## SIGNATURE MOVES (all in src/index.css)
1. .pill-hl — Dark rounded chip with gradient text inside (white → cream → muted). Requires nested span structure.
2. .fade-h — Treatment B horizontal gradient fade on select headlines. Ink → muted → transparent left to right. Also .fade-h-dark for dark sections.
3. .num-gradient — Shifting stat numbers. 8-stop vertical gradient with 8s animated position shift. Also .num-gradient-dark.
4. .grain-light and .grain-dark — SVG noise overlays at 6-7% opacity. Multiply on light, overlay on dark.
5. Section markers — //_01, //_02 monospace labels above section titles.

## LOCKED — DO NOT REINTRODUCE
- Amber/orange accents (#D97841 REJECTED)
- Italic serif emphasis (Instrument Serif REJECTED)
- Chromatic accents (monochrome only)
- Anchor reference: Nolana (nolana.com). Reject Framer marketplace templates.

## LIVE VISUAL REFERENCE
https://averr-git-redesign-v2-prachets-upadhyay-s-projects.vercel.app

## MOTION SYSTEM
- Layer 1 (ambient): radial gradients drift 60-90s, grain subtle
- Layer 2 (load, first 1.5s): nav → eyebrow → headline word-by-word (150ms stagger) → pill scale-in bounce → subhead → CTAs → trust bar
- Layer 3 (scroll): every section eyebrow → title → body → CTA (100ms stagger via useInView), numbers count up on scroll, section transitions animate cream ↔ dark
- Layer 4 (hover): magnetic CTAs (0.15 strength), cards lift -6px, pillars background wash

Library: Motion (motion/react). GSAP installed but not yet used.

## KEY TAILWIND V4 GOTCHA
Tailwind v4 @theme custom color tokens (bg-bg, text-ink, etc.) sometimes don't resolve in class utilities. Always use inline style for critical text/background colors. All existing components follow this pattern.
