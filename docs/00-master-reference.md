# Premium Website Master Reference (condensed)

Single-source playbook for every Averr Studios premium build. Read Parts I-II before pitching. Read Parts III-VI before writing code. Parts VII-IX are the gate before deploy.

## PART I · What Premium Actually Means

Immersion is spatial composition, motion, and interaction as primary storytelling. Not decoration. Effects exist because they carry meaning.

Symptoms of visual noise (cut them):
- No information architecture — nav is hidden or requires teaching
- No motion timing logic — elements jitter, no rhythm
- 3D that doesnt communicate — scenes without product/brand tie
- Performance debt — janky scroll, long loads, mobile crashes
- Interaction gimmicks — custom controls with no payoff

2026 Budget tiers (USD):
- Starter $5-15K: template-based, no 3D
- Standard $20-50K: custom UI, one 3D moment, full CMS
- Premium $50-100K: rich scroll storytelling, integrated 3D, WCAG AA
- Flagship $100-200K+: bespoke real-time, 3D worlds, custom GLSL
- Rush premium: 15-30% surcharge

## PART II · Design System

Typography rules:
- Max 3 face families
- font-display: swap always
- Preload critical faces with crossorigin (required even same-origin)
- Variable fonts default (30-50% smaller than static)
- Subset to Latin only for perf (~30-90KB vs 300-800KB)
- Match fallback metrics (size-adjust, ascent-override, descent-override) to prevent CLS

Spacing scale (px): 4, 8, 12, 16, 24, 32, 48, 64, 96, 128
- Section padding desktop: 96-128 vertical
- Section padding mobile: 48-64 vertical
- Card padding: 24-32
- Element gaps: 16-32

Responsive breakpoints: 375, 768, 1024, 1440. Mobile is first-class layout with own spatial decisions.

Banned AI-default aesthetics (unless briefed):
1. Warm cream + terracotta serif
2. Black + acid-green accent
3. Newspaper broadsheet with hairline rules

## PART III · Motion Standards

Entrance choreography (required):
- Eyebrow at 0ms
- Headline +100ms (fade + Y-translate 20-30px)
- Body +200ms
- CTAs +300ms
- Grid children stagger 50-80ms each
- once: true, duration 0.5-0.8s, easing [0.25, 0.1, 0.25, 1]

Motion rules (non-negotiable):
1. prefers-reduced-motion → instant fallback
2. Mobile intensity -50%. No parallax mobile unless buttery smooth.
3. NEVER animate layout properties. Only transform + opacity.
4. Physical easing (spring/cubic-bezier). Never linear on entrances.
5. Consistent timing site-wide.

Load choreography (first 1.5s): 0ms bg → 200ms nav → 300-600ms headline (word/line stagger, NOT character) → 500-800ms subtext+CTAs → 400-800ms hero image reveal.

Ambient motion: gradient orbs 60-120s loops, grain 3-5%, breathing pulse 3-4s.

## PART IV · Engineering Stack

Motion (motion/react): declarative React animation. LazyMotion + m pattern for 4.6KB baseline. Rebranded from framer-motion Feb 2025.

GSAP: imperative timeline choreography. 100% free post April 2025 including all Club plugins (SplitText, ScrollSmoother, MorphSVG, CustomEase). Core 23KB gzip. ScrollTrigger 10KB.

Golden rule: never allow both libraries to animate same CSS property on same element. Segment by element or by property. GSAP for orchestration/pinning/ScrollSmoother. Motion for UI state, gestures, page transitions.

React 18/19 Strict Mode + GSAP: always use @gsap/react useGSAP hook.

Tailwind v4 gotcha: @theme custom color tokens sometimes dont resolve in class utilities. Use inline styles for critical colors.

## PART V · 3D in the Browser

Three.js core primitives: Scene, Camera, Mesh (Geometry + Material), WebGLRenderer, Lights.

React Three Fiber performance rule: never let React re-render during animation. Use mutable refs in useFrame, not state.

drei helpers: PerspectiveCamera, OrbitControls, useGLTF, Environment, Text, ScrollControls, Loader.

Ray marching + SDFs: for complex real-time 3D inside a single fragment shader. Reference: iquilezles.org, Shadertoy.

Graceful degradation: detect WebGL, device tier via navigator.deviceMemory + hardwareConcurrency + connection. Fallback ladder: full 3D → WebM video → static image → typographic hero. Pause when off-screen (IntersectionObserver).

## PART VI · Accessibility

WCAG motion criteria:
- 2.3.1 Three Flashes: never more than 3 flashes/sec (seizure risk)
- 2.3.3 Animation from Interactions: user can disable non-essential motion
- 2.2.2 Pause, Stop, Hide: auto animation over 5s must have toggle

Vestibular triggers to gate: parallax, z-axis zooms, autoplay video bg, fullscreen transitions, endless loops.

Keyboard navigation essentials:
- :focus-visible over :focus (shows ring only for keyboard)
- Skip link (visually hidden until focused, links to main id="main")
- Focus trap in modals (return focus on close)
- Never positive tabindex values
- Common ARIA patterns: dialog, tabs, disclosure, live regions
- Semantic HTML: button for actions, a for nav. Never div onClick. Headings in order.

Testing: Microsoft Accessibility Insights, WAVE, axe DevTools, Lighthouse. Screen readers: NVDA, JAWS, VoiceOver, TalkBack.

## PART VII · Media Pipeline

Background video hard rules:
- Loop ≤15-20s
- 720p (1280x720), never 1080p or 4K
- 24 or 25 FPS
- Strip audio
- Serve WebM + MP4 fallback
- preload="none" loop muted playsinline

Mobile bandwidth trap: display:none doesnt stop download. Lazy-load with breakpoint gating (skip download below 768px via IntersectionObserver).

Images: lazy load below-fold, maintain aspect ratios (no CLS), object-fit: cover with focal points, WebP/AVIF preferred JPEG fallback, use picture with srcset for responsive.

## PART VIII · Performance Standards

Core Web Vitals 2026 targets (75th percentile of real users):
- LCP under 2.5s
- INP under 200ms (replaced FID March 2024)
- CLS under 0.1

Supporting metrics:
- FCP under 1.8s
- TTFB under 800ms
- TBT under 200ms

Bundle budgets (gzipped):
- HTML (initial): under 30KB
- CSS (critical inline): under 14KB
- JS (initial blocking): under 100KB
- Fonts total: under 100KB
- Above-fold images total: under 500KB
- Total page (above fold): under 1MB

Resource hints:
- preconnect max 3-4 origins
- preload only for resources needed this page
- fetchpriority="high" reserve for LCP element

Runtime performance:
- Main thread budget: JS under 8ms/frame (of 16.67ms)
- Long tasks over 50ms hurt INP
- Layout thrashing: batch reads then writes
- Debounce/throttle scroll/resize handlers
- requestIdleCallback for non-critical work

Monitoring: web-vitals library sends to endpoint. Vercel Speed Insights built-in. Ship-blocker: Lighthouse mobile 90+ all axes. Field CrUX Good on LCP/INP/CLS within 30 days.

## PART IX · Procurement, CMS & Compliance

RFP red flags (spot, price, or walk):
- Vague scope + fixed budget (scope creep)
- No content/brand ready (+30% timeline)
- "Just like Company X" (reference-driven client)
- Multiple stakeholder chain (2-3x timeline)
- Unrealistic timeline for scope
- "Should be easy for you" (anchoring)

Compliance for Canadian/GTA clients:
- AODA (Ontario, orgs 20+ employees): WCAG 2.0 Level AA required
- PIPEDA (Canadian federal): meaningful consent for personal data. Every client site needs privacy policy.
- GDPR: applies if EU visitors. Default to compliant behavior if any international audience.

Cookie consent tiers:
- EU/UK/California: explicit opt-in before non-essential cookies fire
- Canada (PIPEDA): meaningful consent, banner disclosing cookies generally sufficient
- US non-CA: notice recommended not required

Recommended: custom minimal cookie banner + Iubenda-generated privacy policy (~$27/yr).

CMS decision matrix:
- Framer Collections: small marketing, non-technical client
- Sanity: structured content, real-time collaboration, dev team
- Contentful: enterprise, workflows/approvals
- Payload: self-hosted preference, TypeScript-first
- Prismic: marketing-team friendly, slice-based

## PART X · Workflow

Phase 0 (Onboarding): collect brand assets, content, access, signed contract with milestones.

Phase 1 (Design Direction): palette (5-7 tokens with roles), typography (display+body+optional utility, full scale), signature element, interaction plan, mood (3-5 adjectives).

Phase 2 (Build): section by section. After each: self-critique, screenshot, mobile check at 375px. Move on only when portfolio-worthy.

Phase 3 (Polish): spacing, motion, typography, responsive, interaction, copy, accessibility, performance, cross-browser, compliance audits.

Phase 4 (Handoff): credentials transfer, CMS training, video walkthrough, written docs, 30-60 day warranty, post-launch optimization checklist.

## PART XI · Portfolio Quality Gate

Before presenting complete, answer YES to every question:
- Would this look at home on Awwwards?
- Can I identify the signature element in under 3 seconds?
- Is the type pairing distinctive and specific to this client?
- Does every section earn its place?
- Are all spacing values on the defined scale?
- Is scroll choreography coordinated and purposeful?
- Do hover/cursor interactions feel polished?
- Does mobile feel designed, not compressed?
- Are all animations reduced-motion-safe?
- Is copy specific to this client?
- Are there clear accessible CTAs at logical intervals?
- Does the site hit Good for LCP/INP/CLS on mobile?
- Is the handoff document complete before launch invoice?
- Would I put this in the Averr portfolio?

If any answer is no, revise before presenting.

## Appendix · Anti-patterns (never ship)

- Cookie-cutter layout: gradient blob hero → three-column features → pricing table → footer
- The three AI-default aesthetics
- Numbered markers 01/02/03 unless genuinely sequential
- Stock photo hero with overlay text
- Flat identical card grids
- Font Awesome/Lucide defaults as substitute for visual identity
- Placeholder copy of any kind
- Motion where every element bounces in
- Any section that exists because "websites have this section"
- Zigzag layout rhythm (text-left/image-right, alternating)
- Gradient hover on every button
- Testimonials with generic attribution
- Trusted-by logos of companies never worked with
- Autoplay video with sound
- CSS animations for complex sequences (use Motion or GSAP)
- Layout-property animations (width/height/top/left)
- outline: none without replacement focus state
- div onClick instead of button
- Fonts from Google CDN without preconnect
- 4K bg video on mobile
- Cookie banner with only "Accept" and no reject
