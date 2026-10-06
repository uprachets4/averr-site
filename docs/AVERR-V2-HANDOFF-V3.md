# AVERR STUDIOS v2 — HANDOFF V3

**Written:** 2026-09-29 · **Supersedes:** everything after Session 9 in `HANDOFF.md` / `REDESIGN-HANDOFF.md`
**Audience:** a fresh Claude Code session with no memory of this project. This file is your only memory. Read it all before touching anything.

> Note on naming: the sessions referred to a file called `AVERR-V2-MASTER-HANDOFF.md`. **No file by that name exists in the repo.** The pre-Session-9 documents are `HANDOFF.md` (root, dated July 2026), `REDESIGN-HANDOFF.md` (root), and `docs/00-master-reference.md` … `docs/03-build-status.md`. Those remain valid for project identity, brand, and pre-v2 history. **This file is authoritative for everything from Session 9-fix-c onward** and supersedes them on any conflict.

---

## 1. STATE

| | |
|---|---|
| **Repo** | `github.com/uprachets4/averr-site` |
| **Working branch** | `redesign-v2` (**~110 commits ahead of `main`** at the end of Session 17-fix — `git rev-list --count main..HEAD` for the exact number) |
| **HEAD** | `b51fa7d` — *"17g: the card sizes to whichever face is showing"*. **This is the last commit that changed code.** The commits after it touch only this file, so the tip is a doc commit — run `git log --oneline -1` for the exact hash rather than trusting one written here. |
| **Doc currency** | Written at the end of Session 17g. A hash written into this table goes stale the moment the table is committed, which is why the row above names the last *code* commit instead. |
| **Preview alias** | `https://averr-git-redesign-v2-prachets-upadhyay-s-projects.vercel.app` |
| **Production** | `averrstudios.com` responds **200**, and is served from **`main`** — i.e. **production is still the OLD site.** None of the v2 redesign has shipped to production. Promoting means merging `redesign-v2` → `main`. **Do not merge without Prachets saying so.** |
| **Local path** | `/Users/prachetsupadhyay/Developer/averr-site` |
| **Dev server** | already running on `http://localhost:5173` in most sessions. Never start dev servers with Bash — use the preview tooling, or just test against the alias. |

### Last verified bundle (build exit 0, unfiltered)

```
dist/index.html                    3.18 kB │ gzip:   1.40 kB  ← carries the route-chunk map
dist/assets/index-*.css           42.09 kB │ gzip:   8.75 kB
dist/assets/index-*.js           473.71 kB │ gzip: 150.18 kB  ← home + shell + motion
dist/assets/Services-*.js        196.38 kB │ gzip:  49.33 kB  ← the build page + the start pass
dist/assets/Cal.es-*.js            1.39 kB │ gzip:   0.75 kB  ← the embed, fetched on intent only
dist/assets/CaseStudy-*.js        51.34 kB │ gzip:  12.71 kB
dist/assets/Contact-*.js          44.67 kB │ gzip:  11.14 kB
dist/assets/Work-*.js             22.49 kB │ gzip:   6.80 kB
dist/assets/About-*.js            22.30 kB │ gzip:   5.93 kB
dist/assets/NotFound-*.js          4.28 kB │ gzip:   1.69 kB
dist/assets/MonogramMark-*.js      3.85 kB │ gzip:   1.81 kB
dist/assets/SectionBoundary-*.js   0.44 kB │ gzip:   0.29 kB
```

Home's initial JS moved **151.59 → 152.53 kB gzip (+0.94)** in 19-pre-2:
the generated screenshot manifest plus `prefetchRoute`. Well inside the
+12 kB gate.

**Fonts are now part of the budget too** — they are preloaded, so they
share the critical pipe with the entry chunk. `public/fonts` is **248 kB
total**, down from 816 kB:

```
InterVariable.woff2          77 kB   (was 344)  not preloaded
InterVariable-Italic.woff2   85 kB   (was 379)  not preloaded
geist-latin-wght-normal      29 kB              PRELOADED
cormorant-garamond-600-ital  23 kB              PRELOADED
geist-mono-latin-wght        23 kB              not preloaded
```

Gate: **flag anything over +12 KB gzip JS in a single session.** **17c-2 changed how this is measured**: routes are code-split, so the number that matters is now **home's initial JS = 151.65 kB gzip** (the motion chunk folded back into index in 17c-2-fix once /services/next began sharing components with /services; one fewer boundary, marginally smaller), down from a single 199.70 kB bundle — **−46 kB on the landing route**. Total across all chunks is higher than the old single bundle (splitting has overhead), but no visitor downloads all of it. Judge future sessions on the initial figure for the route they touch, and on that route's own chunk.

### Stack

Vite + React + TypeScript · `react-router-dom` · **`motion` 12.43.0** (imported as `motion/react`) · Tailwind v4 (tokens live in `src/index.css`, utilities are hand-rolled `type-*` classes) · Vercel auto-deploy on branch push · Playwright (in `node_modules`) used for all DOM verification.

---

## 2. SESSION LOG (9-fix-c → 16-fix-2 + 15d)

Every hash below verified against `git log`.

**9-fix-c** `1b6f0dc` — Home surgical fixes: real CG Walls featured image replacing a placeholder, gradient section seams removed (CaseStudies + Manifesto merged into one dark chapter), on-dark contrast raised to AA, Writing nav link resolved. `Hero.tsx` was under a no-touch guard.

**10** `40f7c13` — Type & scale system. Editorial display scale (`display-2xl` to 208px, `h2` to 56px), self-hosted Geist + Geist Mono (**zero Google Fonts requests**), `tnum` on stats, self-hosted Cormorant italic as the accent voice, wide/body measure tokens, `/process` → `/about#process`. Prachets amended the spec mid-session: keep Cormorant 500+600, drop the `opsz` axis, self-host Geist, leave `og-image.svg` alone.

**10-fix** `083205b` — Hero 1440 regression (headline `display-xl` → `display-l`, **class swap only** — Hero.tsx was otherwise locked), mobile full-screen nav overlay with focus trap, dropped the unused Cormorant 500.

**11** `784a593` — `<Chapter>` transition system: scroll-linked `clip-path` inset+radius expansion on every cream↔dark boundary. `MagneticCTA` gained an additive `tone="dark"` (replacing a `.cta-on-dark` `!important` override), single tab stop per CTA, desktop nav active state.

**11-fix** `de837cf` — StorySoFar stages fit the pinned frame, nav prominence + Work count, home→/work+/services wayfinding, `ImageFrame` additive `tone`. Prachets pre-approved a pre-check: *if the "234px Gallery sliver" turns out to be empty padding, STOP and report* — it was a measurement artifact (real slides were 820–845px), reported not "fixed".

**11-fix-2** `2d17870` — Chapter easing `outQuart` → `inOut` so the expansion lands mid-viewport.

**12** `6adc93e` — Hero cinematic rebuild (Prachets explicitly unlocked `Hero.tsx`): split h1 at `display-2xl`, slab pill entrance, pinned scroll takeover where the pill's clip-path expands to a full dark frame carrying a 4-case-study reel, Toronto clock, unpinned fallbacks. `HeroSignature` and the client row were deleted.

**12-fix** `f2dd291` — Tone-aware nav site-wide, mobile load film ×0.5 for LCP, **root-caused the frozen reel opacity** (see §5), deleted orphaned `HeroSignature`.

**12-fix-2** `85840e2` + `6d9aeec` — Swept every scroll-linked opacity in a sticky frame onto the new shared `useScrollStyle` hook (34 hits → 0).

**12-fix-3** `83d0a37` + `f86df6d` — Hero pill inside the container with balanced padding, reel pan retimed, /services Grow cards contained, /about numerals cleared of body copy; `useScrollStyle` changed to a **callback ref that writes on attach**, fixing a stuck `"serious."` clone.

**13** `7169c2e` — Home rebuild: StorySoFar → three unpinned scenes, Pillars → three service doors with live hover previews, Numbers + CaseStudies stats → one dark **ProofLedger**. Prachets's rules: *no image repeats anywhere on home*, *nothing invented*.

**14** `2db13ca` — /work rebuild ("The Vault"): hero, dark index chapter with full-width rows, cursor-follow preview with velocity tilt, URL-synced pillar filters with FLIP, /work-specific closer.

**14-fix** `ba6f3f0` — Removed the non-selective pillar filters entirely, single-sourced headline figures into case-study data (home + /work read one field), status fallback for rows with no measured figure.

**14-fix-2** `8fded56` — Fragment captions (SIFT's trailing period dropped; Prachets accepted home changing by that one character), status shown once (meta = year number only).

**14-fix-3** `d04b44b` + **14-fix-3b** `d984ba0` — **All pricing removed site-wide** (timelines instead), /services gutter restored, /services hero `PillHl` → Cormorant accent, ledger dedupe (CG row), ILLUSTRATIVE labels on sample metrics, door previews clamped + enlarged + Grow mini dashboard. Prachets answered three questions: derive the pillar count word from data; use each section's own eyebrow as the rail label source; fold ScrollProgress into the rail.

**15a** `4368c6a` `b2de080` `cd6b81d` `9f46983` — Case studies part 1: zoom-into-the-work hero with client-tint glow (additive `tint`), reading rail, word-level read-fill Context, pinned Approach with image wipes. Prachets chose: pinned split on **all four** studies (retiring the `text-then-image-full` render but keeping it in data/union), derive the "Two/Three pillars" count from data, rail labels = the sections' own eyebrows.

**15b** `5e57481` `755955e` `cfde955` `0a96a72` `121b756` — Rail ≥1600 only, self-ticking "what we built" with live count, detail-zoom Signatures on additive `focal` points, figure-led Outcome, quiet "what's next", next-project finale replacing the shared `FinalCTA`. Prachets approved two image corrections: CapitalCommand's "operational truth" signature → `08-system-health`, SIFT's "sync engine" signature → `07-sources`.

**15c** `aa8236a` `ade4646` `07ccb7c` `48d3b37` `a366fca` `5d5cb2e` `1b37a3a` `b6ae77a` — Fixed the blank CapitalCommand page (see §5), per-section `SectionBoundary`, Approach images at natural aspect, finale scrim, rail ≥1700, Context as statement+support with verbatim tint highlighters, labelled "what we built", lit "what's next" timeline. **Item 4 (zero image repeats) was reported BLOCKED** — the pool was empty.

**15c-fix** `49e2b93` — Unblocked it: the hero's two back screens became **blurred, tinted depth copies of the front image**, and the front switched to `heroImage` (= `heroImages[0]`, used nowhere else). Zero rendered content repeats.

**16** `f166859` `11c3fa7` `64e8bcd` — /work rebuild: vault doors, pinned project film, side index, clone-expand transition into case studies, mobile snap sections; row index + CursorPreview deleted. `64e8bcd` fixed two type errors that had been **pushed broken** because build output was being piped through `grep`.

**16-fix-2** `f8b5c1c` — Doors open inside the pin; nav tone made honest via an out-of-clip marker.

**16-fix** `6a530c3` — Compact dot index with hover-expand names, film screen back to ~64%, and the **unfiltered-build standing rule** adopted.

**16-fix-2 + 15d** `f3957b0` `01da18e` `46b8f1e` `40219c6` `b2ce349` `3fd88ed` — Film: every project gets a dwell (CapitalCommand fixed), sequenced text transitions, measured name fitting → name moved to its own full-width row, doors became an overlay with project one behind them. Case studies: Approach outline-fill pillar names + statement/support + verbatim emphasis, the blank Approach frame fixed at its real cause, finale CTA moved below the image, and the frame's base layer marked `[data-frame-base]` for audits.

**17** `08965f2` `a70693b` `9ef61fe` `c3c65d6` `eece7b5` `b1994b9` `ed4e054` `cd59093` `ca06bee` `8eba163` — **/services rebuild.** Split out of the 2169-line page into `src/data/servicesProcess.ts` + `src/components/services/{AutomatePipeline,NoList,KickoffCalendar,ServicesCloser}.tsx`.

- *Pillars:* the Automate ambient gained illustrative task chips (New lead → Enriched → Draft ready → Sent → Logged) travelling the existing node path on a 6s loop, 3 in flight, nodes lighting as a chip arrives; hand-written rAF (see §5.15). The unsourced caption **"System average: 12h/week returned" was cut** (§7.11). Mood-board cards re-cut to each image's natural aspect — they were ~1.8:1 screenshots in a fixed 1.40 box under `object-fit: cover`, cropping ~23% off every one — and the stack fans ±6° on hover. "What's included" became chips that assemble, latched once, on both paths. The pillar rail meets the container edge at ≥1680, measured off a probe.
- *The "no" list:* each line's refusal is struck as you read — a 2px parch rule drawn across a **verbatim** substring held in data, with `splitRefusal()` throwing in dev if it ever stops being one. The rule is a background with `box-decoration-break: clone`, not a positioned bar, so it draws correctly across phrases that wrap (§5.16).
- *The calendar:* the three-column steps became 14 cells filling one at a time, each step card arriving as its own first day fills. Day 01 = Monday (what makes "3 business days" land on day 04 without crossing a weekend); step 03 spans days 08–12; 06/07 and 13/14 are quiet weekend cells; stamp reads `WITHIN 14 DAYS · KICKOFF` at day 12. Prachets ruled the mapping, and ruled **out** labelling day 05 "your decision" — only the steps' own copy appears.
- *Closer:* a /services-specific dark closer replaced the shared `FinalCTA`; page end tone now `dark`. With ComingSoon's slab swapped for the Cormorant accent, **`PillHl` is now exactly home hero + home `FinalCTA` + the 404** (verified live: home 2, /nope 1, all other routes 0).
- *Hero:* headline moved onto one `CharReveal` stagger with "One studio" as an accent segment, plus the home scroll cue.

Prachets's rulings: 20 minutes is the canonical call length (a sweep found /contact and ComingSoon already agreeing — nothing changed); "fixed price" and "up to 15 pages" stay as scope promises, not prices.

**17-fix** `a9ef74a` `4642136` `ea20a63` — `StackedPillar` (< 900px, and **any** width under reduced motion) rendered no ambient at all, so reduced-motion readers lost all three visuals instead of getting a real final state, and `AutomatePipeline`'s reduce branch was unreachable. `AmbientVisual` gained `frozen`, and `StaticAmbient` feeds it progress pinned at 1 so every scroll-linked transform resolves to its end value. The stills are **scaled** to the column, not reflowed — the compositions are authored in fixed px and a 0–400 SVG space and do not survive squeezing — and the ILLUSTRATIVE label is printed at full size *outside* the scaled box, because at 375 the still runs ~0.45 and a label inside it landed near 5px.

**17-fix-2** — Two rulings from Prachets. (a) **Standing rule 18 is absolute** — commit + push per verified item; a brief's `Commit:` line is the report summary, not a squash target. Recorded in §4.18, §7.12 closed. (b) The scaled Automate still's ~6px labels at 375 were **a defect, not an acceptable thumbnail**. Below 900px that still is now a purpose-built **vertical** composition — the five nodes on a straight vertical line, each with its label at real `type-eyebrow` size and its resting chip beside it, ILLUSTRATIVE above. Not the desktop diagram shrunk. Design and Grow continue to scale.

**17b** `10cd235` `9cf8ec5` — **/services leads with what we do.** Owner feedback: the page opened on three enormous pillar words with the services people actually buy reduced to chips, so a visitor could not tell what the studio sells. The hierarchy is inverted — services are the page, pillars are the labels they group under.

- **`servicePillars.ts` is now the single source for /services *and* home.** `PILLAR_SERVICES` holds 16 services, each with `name`, `outcome`, `proof: string[]`, and `from` — the original "what's included" string it renders in plain language, kept unrendered so every line on the page traces to the claim it came from. `SERVICE_COUNT` is derived, so the hero's "16 WAYS WE HELP" cannot drift from the list.
- **Grow went from 4 services to 6.** The four offered services described work the portfolio does not show; the work it *does* show had no line. Prachets ruled: keep all four, add **Local search** and **Outreach campaigns**, both traced to CG Walls' own copy (*"Google Business Profile optimization"*, *"Google Business Profile seeded with an authentic Brampton homeowner review"*, *"Realtor lead-gen infrastructure: scrapers that watch posting activity, AI email generator that references the specific listing"*, *"door-to-door playbook … tier-ranked by home era and density"*). **Reporting** also regained "Attribution".
- **Proof links only where a study's own copy shows the service was delivered — 9 of 16.** Prachets tightened two of my pairings in review: **Workflow audit** lost its CG link (a reduced-hours figure is an outcome, not evidence an audit was delivered) and **Human review built in** lost CapitalCommand (product philosophy, not a review layer built for a team). A row with no verified pair renders **no chip and reserves no space** — the absence is intended.
- **`ServiceIndex.tsx`** — grouped rows at `--container-wide`, pillar label + timeline per group, name `type-h2` left, outcome `type-body-lg` right, proof chips beneath. Hover/focus shifts the name +8px, lifts the outcome to full ink, and fades a 240px proof thumbnail into a third grid track that the copy can never reach (measured: 24–60px clear at every width). A sticky pillar switcher tracks the active group by IntersectionObserver, jumps on click, and fades out after the index; on mobile it becomes a scroll-snap chip row and the thumbnails are dropped.
- **Hero:** "Here's *exactly* what we do." (Cormorant on "exactly"), GTA subhead, scroll cue kept.
- **The pillar sequence became "How each one works."** — pillar word down from `display-xl` to `display-l`, and stage 2 now names the same services the index sells instead of the old internal phrasing. Stacked path mirrors it.
- **Home doors** print their pillar's first four service names in mono under the promise, read from the same record. The preview clamp is unaffected — its 24px clearance is measured against the promise column's left edge, which the added lines do not move.

**17c-1** `2902d5b` `35383eb` — **/services rebuild, part 1 of 3, on a hidden route.** Prachets rated 17b **1–2/10**: a flat list, then the same services repeated in the pinned section, and not cinematic. New concept: ONE continuous pinned scene where a generic business's site is visibly built as you scroll, each of the 16 services being the caption of the step happening on the canvas. **The story is the list** — no service is named twice on the page.

- **Built on `/services/next`**, noindex and linked from nowhere. `/services` is untouched until 17c-3 swaps them; nothing half-built is ever visible on the live route. Only `App.tsx` changed outside the three new files.
- **Pin math.** Beat = 65vh. Wrapper = `beats × 65vh + 100vh` per the n+1 rule (§5.4). Design's five beats: travel **325vh**, wrapper **425vh** (measured 3825px at 900vh viewport = 4.25×, sticky child exactly 1.00×). The 16-beat target with two 80vh chapter transitions is **1200vh travel / 1300vh wrapper**.
- **Per-beat phases:** caption in 0–0.15, canvas build 0.05–0.40, **dwell 0.40–0.85** (29.25vh of hold, ruled up from 45% of a 55vh beat), caption out 0.85–1.00. Dwell midpoints at progress 0.125 / 0.325 / 0.525 / 0.725 / 0.925 — those are the screenshot positions.
- **One continuous float drives caption, canvas and rail.** Nothing on a timer, nothing keyed on an index that flips independently (§5.13). The caption remounts only at a beat boundary, by which point the previous one has faded to 0 — sequenced, never overlapping. Every canvas scene stays mounted and crossfades, so there is never a frame with nothing to draw (§5.6).
- **The rail is the index:** three chapters, sixteen ticks, hover shows the service name, click lands in that beat's dwell. Automate and Grow read "soon" with disabled ticks until 17c-2 (verified: 16 ticks, 5 enabled).
- **Canvas** is CSS and inline SVG only — no screenshots, no brand marks, a non-Averr palette so it reads as someone else's business, and ILLUSTRATIVE on the surface throughout. A browser frame on `yourbusiness.ca`: wireframe recoloured by a dropped-in palette with the mark drawing itself → sections assembling top-down → the site becoming a dashboard → **a labelled specimen grid** → a version tag ticking with pulsing "+" marks.
- Mobile and reduced motion drop the pin: one section per service, each canvas playing its beat once on entry or resting at its finished state.

*A fix inside the session:* beat 4 first pulled the dashboard apart with x-offsets and floated three labels over it. On screen that read as a broken layout — sidebar slid out leaving a dead gutter, table past the frame edge, each label beside something it did not name. Rebuilt as real labelled specimens (button, card, input, tokens, spacing). **The DOM sweep passed it both times; only looking at the screenshot caught it.**

**17c-2** `076af86` `b0abe23` `dd0f8ab` `9a1f3c4` `5e390f5` — **/services/next rebuilt at product fidelity.** Prachets rated 17c-1 **3–4/10**: the concept was right but the canvas read as a small pastel wireframe and every beat was the same toy window.

- **A1 · route code-splitting.** Every route but home behind `React.lazy`; home stays eager as the LCP surface. Home's initial JS **199.70 → 153.46 kB gzip**. The Suspense fallback paints the page ground at a full viewport — a zero-height `main` is what makes the footer jump and the scroll lurch on a route change.
- **A2 · `WindowChrome`** — a real application window at 62% of the container and up to 82vh (measured 821×738 at 1440, 886×813 at 1920): traffic lights, title/URL bar, a four-layer tinted shadow, a diagonal reflection. Hairlines are inset shadows, not 1px borders, so they stay hairlines at 2dppx.
- **A3 · `GhostCursor`** — a pointer choreographed from the same scroll value as everything else, eased hops, a slow wobble, a press ripple. **Each screen reads the same local progress the cursor is keyed against**, so a click and its response cannot drift.
- **A4 · `camera`** — per-beat push-ins scaling the window CONTENT toward a focal point via `transform-origin`. The chrome is outside the transform; scaling the window edges is what makes a mockup look like a zoomed screenshot rather than a camera move.
- **A5** — only the active beat ±1 is mounted. **Zero long tasks >50ms** across a full scroll of the chapter, measured with a PerformanceObserver on the alias.
- **B1–B5 · five genuinely different pieces of software**: a brand board (SVG logo, palette with hex, type specimen, business card and van decal that recolour when the cursor picks an accent); a local-business homepage that scrolls inside its own window (booking widget the cursor fills and submits, success toast); a **dark** analytics dashboard (date range switched 7d→30d with KPIs and chart responding, status pills, notifications); a component library (4 variants × 4 states, input states, token tables, a dark-mode toggle that re-themes in place); a release dashboard (changelog, score ring 72→98, Core Web Vitals turning green). All content invented and plausible for the GTA; ILLUSTRATIVE throughout.

*Three fixes inside the session, all caught by looking rather than by the sweep:* the window **collapsed to its 38px title bar** (an auto-height wrapper; the absolutely-positioned screens contributed no height and `overflow:hidden` clipped everything — the DOM sweep read all five screens' text correctly the whole time); the **next screen ghosted through the current beat** at ~12% (crossfade began 0.42 of a beat early, now the last tenth); and screens were **still assembling during their own dwell** (layout now completes by local 0.40, leaving the dwell for the cursor's interaction).

**Outstanding, not done:** mobile type. 176 text nodes inside the screens render below 11px at 375 — the fine print (mono labels at 8px, card descriptions at 9px). The headline content is legible, but this misses the brief's ≥11px requirement. The fix is mobile-specific simplified variants of the dense panels, not a uniform font bump, which would break the desktop density the screens depend on. **Carry into 17c-3.**

**17c-2-fix** `6818f1e` `…` — audit of Prachets's screen recording at ~1680. Six items, all fixed and measured on the alias.

1. **Caption collided with the window.** Measured: "Post-launch" rendered **562px inside a 461px column at 1680** — 101px of silent overflow, its right edge 682 against a window starting at 671; at 1920 it was 11px *inside* the window. My 17c-2 report of "gap 90px, no collision" had measured the h2's block box, which reports the column width no matter how far an inline-block word spills past it (§5.5). The name is now `type-h1` in a 30% column, **fitted by measuring the widest word**. After: worst gap **51 / 57 / 96 / 96px** at 1280 / 1440 / 1680 / 1920, zero overflow.
2. **Window 62% → 66% of `--container-wide`**, 82vh → 84vh. Measured **66.0% of the container at every width**; as a share of *viewport* that is 60.7 / 60.7 / 56.5 / 49.5% — it falls on wide screens because the container caps at 1440, which is why the recording read it as small. The Releases screen was also filled out: eight changelog entries with tags and per-deploy timings, plus a ten-week deploy-history chart.
3. **Camera → focus move.** Scale capped at **1.22** (from 1.5–1.6), transform origin at the focus rect's centre so the focused element cannot leave frame, and a four-band spotlight veils the surroundings at 0.66. Four bands rather than one masked overlay because `backdrop-filter` applies to what is *behind* an element — a single rect would blur the thing meant to stay sharp. **Any scale above 1 crops the frame edges; the veil is what makes the cropping read as background rather than damage.** It is mitigation, not elimination.
4. **Transitions went grey.** Two causes, both found by looking: the incoming window was ramping up *semi-transparent* so the outgoing one read straight through it, offset; and the ILLUSTRATIVE label was rendered per layer, so two overlapped on every switch. The incoming window now becomes opaque almost immediately and **occludes** the outgoing one; the label moved to the stage.
5. **Pin released into an empty viewport.** Scroll progress hits 1 exactly where the sticky unsticks, so the final beat's fade ran the window to zero while the stage was still pinned. The last beat's window and caption now **hold** to the end. `/services/next` continues into `NoList` → `KickoffCalendar` → `ServicesCloser`, the same components in the same order `/services` uses. Verified: **0 blank samples** at four offsets across the release.
6. **"Northgate" vs the specified "Your Business".** 17c-2 used Northgate for realism and **did not report the substitution** — a deviation that should have been flagged. Prachets accepted it; it is now consistent (the URL bar had still read `yourbusiness.ca` while every window title said Northgate). **Standing instruction from this session: report every deviation from a brief, however small.**

*Probe errors, mine:* the gap check first measured the **leftmost** frame rather than the active one — during a dwell the outgoing layer sits translated −6%, so it reported 4–5px gaps that did not exist. And the automated "empty area" heuristic scored the dense website screen at 66% empty by counting hits on large containers; fill was judged visually instead.

**17c-3** `64fe34a` … `d5b675e` + the chapter-card fix — **Automate chapter, plus two rulings.**

- **R1 · the scale push-in is gone.** At 1.6, 1.35 and 1.22 it cropped the frame's edges — arithmetic, not tuning: scaling content inside a fixed window always pushes some out. Focus is now carried entirely by the spotlight veil. Verified: **0 scaled content layers** at every beat, spotlight bands present on all ten.
- **R2 · the build stage may exceed the 1440 container on /services/next only**, capped at 1680 with the normal gutter; columns 29/67. Measured window: **61.7% / 61.9% / 58.6% of viewport** at 1440 / 1680 / 1920 — the 1920 target of ≥58% is met. Caption gaps 151 / 226 / 268px. Every other surface keeps `--container-wide`.
- **Slot space.** Beats are no longer evenly spaced, so scroll maps onto SLOTS: five Design beats at 65vh, an 80vh transition, five Automate beats at 65vh. **Travel 730vh, wrapper 830vh** (measured 8.30× viewport).
- **T1 · the back-office reveal.** The Releases window slides left and shrinks to 0.86, revealing the time-audit app already behind it, then exits while the back office settles to centre. The pulled-aside window holds z-index 20 so it reads as the front window moving away. The chapter card ("CHAPTER 2 / Automate / What runs *behind* the site.") lands in the **back half** of the transition — shown from the start it was half-covered by the sliding window, which crosses the caption column.
- **Five Automate screens**, each a different application: a time-audit heatmap with an automatable toggle and a ticking hours total; a navy agent console with a resolving run timeline, a streaming reply and a fit gauge; a dotted-grid workflow canvas with packets and a run log; an email-client approval inbox with a tracked-change diff; a serif docs runbook. Rail: 10 ticks enabled, Automate segment active.
- **Mobile.** Every Automate screen ships a restructured `compact` variant — **all five measure exactly 11px minimum, 0 nodes under**. The five Design screens remain **7–8px** and have no compact variant; that is the gate on the swap session, unchanged.

*Three bugs, and one of them was mine from a session earlier:*
- **React #185, maximum update depth**, crashing the whole route at the last Design beat — no windows, no caption, the noindex meta gone with the unmounted tree. The caption fitter added in **17c-2-fix** kept its scale in state, measured the rendered word and divided by the current scale to recover the base width, with `scale` in its own deps; width does not scale perfectly linearly with font-size, so it oscillated forever. **It only fires when a word actually overflows, so a 30% column never tripped it and 17c-3's 29% column did immediately — it shipped latent for a session.** Rewritten with no state and no dependency on its own output.
- **`tsc` exhausted its heap** (2GB, FATAL) on nested ternaries inside `useTransform` — TypeScript reconciling a union of tuple types across three transforms. Keyframes are now built as plain typed arrays first. Builds pass on the default heap.
- **A 4.3-million-line file.** A python edit sliced `s[s.index(A):s.index(B)]` where B occurred *before* A, producing an empty string; `str.replace("", new)` inserts between every character. **Guard: assert the slice is non-empty and the indices are ordered before replacing.**

**17c-4** `c3154e9` … — **Grow chapter, carry-over fixes, and a new standing rule.**

- **All three chapters now run on one pinned stage: 16 beats, two 80vh transitions. Travel 1200vh, wrapper 1300vh** — exactly the figure the pin plan projected in 17c-1. Measured 13.00× viewport (1300vh *is* 13 viewports; an earlier probe expecting 14 was wrong arithmetic, not a wrong wrapper).
- **C1 · the workflow canvas connectors are measured, not guessed.** They were cubic curves between percentage points with both control points on the source's y, which swung wide and never met the boxes. Each node now reports its own rect, the path leaves a real port on the right edge and arrives at one on the left, routed orthogonally with rounded corners, and the packets travel that exact polyline.
- **C2 · the run-log spotlight is aligned** — the log is positioned in percentages so the rect names the same box. Verified sharp inside its own veil.
- **Six Grow screens:** a Durham map with a results panel where Northgate climbs #7 → #2 on a layout spring while its review count ticks 38 → 212; an outreach sequence with merge-filled previews and replies landing; an ads manager with impressions/clicks/CTR/leads and two ad previews; an A/B test where B wins and expands; a content calendar with a draft dragged onto Thursday; and a monthly report with an SVG attribution flow from five channels into leads and booked jobs.
- **No currency anywhere**, illustrative data included — which also removed the agent console's "$15–25K" budget band that 17c-3 had introduced in breach of the same rule.
- **Mobile:** all six Grow screens measure exactly **11px minimum, 0 nodes under**. The five Design screens remain 7–8px and are still the swap-session gate.
- **New standing rule §4.23 — crash-scroll.** See below; added after 17c-3.

*A bug class worth naming, because it bit three times in one session:* **an SVG with a small viewBox stretched across a large panel scales its `<text>` with everything else.** The map's 8px labels rendered near 26px in a 300×220 viewBox under `preserveAspectRatio="slice"`, and the report's flow labels did the same at 7px in a 200-wide box. **Draw type as HTML at a real font size, or size the viewBox to the panel.** The map was rebuilt in positioned CSS; the report's two labels became spans.

*Also mine:* the C2 screenshot first captured the approval inbox rather than the workflow canvas — slot-vs-beat indexing in the probe, the third time that specific confusion has produced a wrong reading. It did surface a real defect by accident (A4's focus rect was framing empty space below the diff), but the carry-over it was meant to verify went unverified until a second pass.

*Honest limit:* the map is the weakest of the six. It now reads as a map — white streets, tinted blocks, an amber arterial, legible labels — but it is a stylised one, sparser than the report or the workflow canvas, both of which genuinely look like software.

**17c-5** `…` — **the finale: the build page is now `/services`.**

- **Design mobile variants** — the last five screens at 7–8px now have restructured single-column variants. **All sixteen screens measure 11px minimum, 0 nodes under, at 375.** The gate is closed.
- **The map is real streets.** `src/data/osmOshawa.ts` — a committed Overpass extract over central Oshawa/Whitby, projected flat and simplified, **880 ways at 9.4 kB gzip** against a 60 kB budget. No tiles, no runtime API, no map library. **OpenStreetMap data is ODbL; "© OpenStreetMap contributors" renders inside the map window at 11px and must not be removed.** Styled in our palette with road weights by class — not a look-alike of any provider.
- **The swap.** `/services` renders the build page; `/services/next`, its route, its lazy import and the client-side noindex are gone. Deleted with zero importers: `ServicesNext.tsx`, `ServiceIndex.tsx`, `AutomatePipeline.tsx`, and the old `Services.tsx` in full. Title and meta description updated and restored on unmount.
- **Verified on the alias:** all 16 captions correct · **all 16 rail jumps correct** · both chapter cards · 3-speed crash-scroll at 1440/1920/375 both directions with **0 console and 0 React errors** · 0 long tasks on a full scroll · 0 ViewTimeline on sticky descendants · no `$` strings · PillHl home 2 / 404 1 / services 0 · 375: 16 frames, **0 nodes under 11px**, zero overflow · all three chapter anchors on cold loads · a real door click from home.

**Mobile lab numbers (390×844, 4× CPU throttle, ~1.6 Mbps) — one of these is bad:**

| | |
|---|---|
| CLS | **0.001** |
| TBT proxy | **174 ms** over 4 long tasks |
| **LCP** | **4884 ms** — element `P.type-body-lg`, the hero subhead |

**The LCP element is gated behind its own entrance delay.** The hero subhead animates in at `delay: 1.1`, so it cannot paint before 1.1s, and under throttle the whole chain stretches. The route also costs a lazy-load round trip. **This pattern is on every page hero, not just this one** — it is a ship-pass item, and the cheapest fix is to let the LCP text paint immediately and animate something else.

*Four wrong guesses in a row on one bug, worth recording as method:* the chapter anchors appeared to fail on `#automate` and `#grow`. I changed the scroll to instant, then added retries, then fixed a guard that was cancelling those retries — all without evidence. **Instrumenting the scroll position took one run and showed the anchors had worked the whole time**: final y 4653, caption "Workflow audit". The probe was reusing one page across `#design → #automate → #grow`, and a hash-only change is a same-document navigation, so React never remounted. It did surface one real edge — clicking `/services#grow` while already on `/services` did nothing — now fixed by taking the hash from `useLocation`. **Instrument before the second guess.**

**19-pre** `f47c12d` … `341a231` — **Site-wide LCP. Every hero's LCP element now paints at first render, and the font loading was rebuilt around it.** Nine commits.

*The ruling (Prachets):* **the LCP element must PAINT at first render.** Its entrance becomes transform-only — y 8px → 0, `duration.base`, `ease.outQuart`, from 0ms. Every other hero element keeps its choreography. Target: **mobile lab LCP < 2.5 s on every route.**

**The LCP element per route** (390×844, 4× CPU, ~1.6 Mbps), and what it was hiding behind:

| Route | LCP element | Was | Now |
|---|---|---|---|
| `/` | `P.type-body-lg` hero kicker | delay 0.675 (mobile film) | painted |
| `/work` | `IMG` first preview | `loading="lazy"`, faded `whileInView` | eager, `fetchPriority=high`, painted |
| 4 case studies | `P.type-body-lg` subhead | delay 0.75 | painted |
| careerclarity-ai | `P` body copy | delay 1.2 | painted |
| `/services` | `P.type-body-lg` subhead | **delay 1.1** | painted |
| `/about` | `SPAN.type-display-l` CharReveal | **delay 2.2** + per-char fade | painted (`paint` prop) |
| `/contact` | `P.type-body-lg` subhead | **delay 1.6** | painted |
| 404 | `H1.type-display-l` | delay 0.3 | painted (its pill keeps delay 0.9) |

**`CharReveal` gained a `paint` prop.** It keeps every character at opacity 1 from the first frame, drops the per-char stagger, and animates y only. Reserved for an LCP element — do not sprinkle it; the stagger is the component's reason to exist.

**Retiming alone did not reach the target, and the measurement said why.** After the choreography fixes every route still sat at 2.5–3.4 s, with first contentful paint pinned at ~2.2 s. The waterfall: **the 344 kB `InterVariable.woff2` preload was racing the 151 kB entry chunk for the pipe.** The JS took 1826 ms to arrive instead of the ~760 ms it needs alone. Three changes followed, each measured:

1. **Subset the Inter variable fonts** — 344 → 77 kB and 379 → 85 kB, both axes kept, every codepoint the original covered from our source charset still covered. `tools/subset-inter.py` records the range and is idempotent.
2. **Preload Geist only, not Inter.** A preload is a *high-priority* request; preloading 106 kB of fonts alongside the JS cost ~370 ms of FCP to save a swap on body copy. Geist carries every display headline and is 29 kB, so it keeps its preload.
3. **A metric-matched fallback for Inter** (`'Inter Fallback'`, `size-adjust: 97.22%` measured from the site's own body copy, vertical overrides from Inter's hhea), so the swap cannot reflow.

**`/work` was mounting the desktop film on phones.** `useMedia` started at `false` and only read `matchMedia` in an effect, so every phone visit rendered the whole `ProjectFilm` first — its four preview images have no `loading` attribute, so **431 kB was requested on the critical path and then thrown away**. `/work`'s own LCP image finished behind three images no one would ever see. Fixed by reading `matchMedia` in the `useState` initialiser, the way `Nav.tsx` already did.

**Results — mobile lab, 390×844, 4× CPU, ~1.6 Mbps/150 ms:**

| Route | LCP before | LCP after | CLS before → after |
|---|---|---|---|
| `/` | 4060 | **2264** | 0 → 0 |
| `/work` | 4908 | **3384** ✗ | **0.054 → 0.016** |
| cg-walls | 3804 | **2304** | 0.004 → 0 |
| capitalcommand | 3876 | **2344** | 0 → 0 |
| sift | 3824 | **2356** | 0.004 → 0 |
| cadencestack | 3892 | **2368** | 0.005 → 0 |
| careerclarity-ai | 4440 | **2244** | 0 → 0 |
| `/services` | 5052 | **2792** ✗ | 0.001 → 0.001 |
| `/about` | 2680 | **2252** | 0 → 0 |
| `/contact` | 4940 | **2284** | 0 → 0 |
| 404 | 3548 | **2184** | 0 → 0 |

**9 of 11 routes under 2.5 s. Two are not, and neither can be fixed by choreography:**

- **`/work` 3384.** The LCP element is an `<img>` that React has to render before the browser can even request it — it cannot paint at first render by construction. It is requested at ~2.3 s and is 86 kB. The fixes are a smaller preview (it renders ~358 px wide from a 1400 px source) or prerendering. **Both are owner calls — see §7.**
- **`/services` 2792.** FCP is 1928; the gap is the lazy route chunk, a second round trip after the entry chunk plus the heaviest first render on the site. A build-time path→chunk map injecting `modulepreload` would recover most of it. **Not attempted — it is a build-pipeline change, not hero choreography.**

**The real floor is first contentful paint at ~1.9 s**, and it is the SPA boot: HTML round trip (~330 ms) + 151 kB entry chunk (~1100 ms) + React mount at 4× CPU (~450 ms). Nothing in the hero can paint before that. **Prerendering the shell is the only lever left** — logged in §8.

**Reduced motion:** unchanged, verified — character opacity 1 and no transform at every sampled instant on `/`, `/about`, `/services`.

**Verified on the alias:** build exit **0** unfiltered · frames at 0/300/800/1500 ms on all eight hero types, visually reviewed · opacity census of every hero text node at each frame · CLS attributed to its source node, not just totalled · **zero horizontal overflow at 375 on all 11 routes** (`scrollWidth` 375 everywhere) · **3-speed crash-scroll at 1440/1920/375, both directions — 33 route-runs, 0 console errors, 0 React errors, every route alive.**

*Two probe notes.* **A crash-scroll piped through `tail` shows nothing until it ends** — I lost 45 minutes watching an empty file before rewriting it to log per route. It is a ~25-minute run; log every route as it finishes. And **`1920 /work` recorded 946 s against 38 s at 1440** — not reproducible: a fresh pass is 5.8 s with one 59 ms long task, and the per-step cost is identical at both widths. Recorded as an unexplained outlier, not diagnosed.

**19-pre-2** `e521774` … `895313d` — **Prachets's four rulings on 19-pre.** Three commits.

**1 · Every hero text element paints at first render.** Not just the LCP one. Each starts at opacity 1 and animates the transform only — y 12 → 0, `duration.base`, `ease.outQuart` — and **keeps its original stagger offset**, so the offsets now describe the order the lines TRAVEL in rather than the order they appear in. A hero still reads top → bottom with nothing hidden.

- `LineReveal` gains `paint`: the mask goes with the fade, because a line sitting 110% below its own clipping box is not on screen. The clip is dropped with it or it would crop the painted line.
- `CharReveal`'s `paint` now **keeps the per-character stagger** (19-pre had zeroed it), so a painted headline still reads as a reveal.
- Non-text keeps what it had: the home **slab** (still the signature), the Toronto clock — which got its own fade so the eyebrow beside it could paint — the scroll cues, the monogram, and the accent bounce on /nope and the coming-soon page, which was already a transform.
- Home's kicker gets its `1.35 / 0.55` place in the ladder back. 19-pre had deleted it when the element became painted; with everything painted it is needed again.

*Verified per-frame on the alias*, sampling every animation frame from mount: **every line at opacity 1.00 the whole time**, travelling strictly in order — "The studio for" 0.35 → "businesses that want to" 0.43 → "look" 0.65 → "serious." 0.80 → kicker 1.35 → CTAs 1.43/1.51 at 1440, the same order at half speed on 390. The only thing that *appears* on screen is the slab.

**2 · WebP derivatives, site-wide.** `tools/derive-screenshots.mjs` emits 640/960/1280 and the natural width for every capture under `public/work/`, **never upscaling** (a 1400px source emits 640/960/1280/1400). **Outputs are committed** rather than generated by a Vite plugin, so the build stays a plain `vite build` with no image toolchain in it — re-run the script after adding a screenshot. It also writes `src/data/screenshots.ts` with each file's intrinsic size and available widths.

`<Screenshot>` is now the one way a screenshot is rendered: a `<picture>` with the WebP `srcset`, the original JPEG as the fallback `<img>`, and the intrinsic `width`/`height` always set. Three places animate the `<img>` itself (the Signatures push-in, the open-transition clone) and take a `<WebpSource>` beside it instead. The duplicated `w`/`h` in `workIndex` is gone — **one generated source of truth**, because two hand-maintained copies of the same number is how they drift.

| Route (390×844, full scroll) | image bytes before | after | |
|---|---|---|---|
| `/work` | 303 kB | **100 kB** | **−67%** |
| `/work/cadencestack` | 256 kB | **101 kB** | **−61%** |
| `/work/sift` | 189 kB | **82 kB** | **−56%** |

**3 · The route chunk is preloaded for the path being loaded.** `tools/route-preload.ts` reads the bundle at build time, resolves each route to its chunk **plus that chunk's static imports**, and writes the map into `index.html`. A tiny inline script — no modules, no imports, so it can run before the entry script — matches `location.pathname` and appends `<link rel="modulepreload">`, so the two downloads overlap instead of queueing. The same map is left on `window` for `src/lib/prefetchRoute.ts`, which warms a route on nav-link hover, focus or touch (`rel="prefetch"` there, not `modulepreload`: the visitor has not committed to going yet).

**4 · Prerendering is deferred to the Ship pass** — §8.

### Mobile lab, 3-run median (390×844, 4× CPU, ~1.6 Mbps/150 ms)

| Route | 19-pre | 19-pre-2 | CLS | |
|---|---|---|---|---|
| `/` | 2264 | **1904** | 0.000 | |
| `/work` | 3384 | **2320** | 0.016 | was the worst route |
| cg-walls | 2304 | **2048** | 0.008 | |
| capitalcommand | 2344 | **2072** | 0.000 | |
| sift | 2356 | **2084** | 0.009 | |
| cadencestack | 2368 | **2080** | 0.000 | |
| careerclarity-ai | 2244 | **2008** | 0.001 | |
| `/services` | 2792 | **2228** | 0.001 | the chunk preload |
| `/about` | 2252 | **2016** | 0.000 | |
| `/contact` | 2284 | **2056** | 0.000 | |
| 404 | 2184 | **1904** | 0.000 | |

**All eleven routes under 2.5 s.** First contentful paint is now 1644–1856 ms.

**Verified on the alias:** build exit **0** unfiltered · per-animation-frame ladder on home at 1440 and 390 · frame montages at 0.30–1.5 s, visually reviewed · image bytes counted per route over a full scroll · CLS attributed to its source node under a *gentle* scroll · **reduced motion clean on all 8 hero routes** (final state at 900 ms, no fades, no offsets) · **zero horizontal overflow at 375 on all 11 routes** · **3-speed crash-scroll at 1440/1920/375, both directions — 33 route-runs, 0 console errors, 0 React errors, every route alive.** The 946 s `1920 /work` outlier logged in 19-pre ran **53 s** here, confirming it was environmental.

*A measurement correction that matters more than the numbers.* **Every single-pass figure in this project, 19-pre's "after" table included, was measuring a cold edge cache.** The first pass over a freshly deployed asset set is consistently 300–600 ms slower than the second and third; 19-pre-2's first pass read `/` at 2504 ms and the median is 1904 ms. **Measure three passes and take the median** — one pass straight after a deploy is a worst case, not a result.

**17d** `608a0c6` … `d925553` — **Owner recording audit: /services quality plus two site-wide fixes.** Twelve commits.

**1 · The captions were in beat space, not slot space.** `BuildCaption` read `position` — a SLOT float — against `beat.index`. The two agree only for Design: the first chapter transition displaces every later beat by one slot and the second by two. So on every Automate and Grow beat the fade window `[i+0.85, i+1]` was already behind the playhead, `useTransform` clamped to its end value, and **the caption sat at opacity 0 for the whole beat.** That is the empty caption column in the recording — **§5's own slot-vs-beat trap, in the one place nobody had checked.** The caption is now visible for the whole beat bar a 7% swap at each edge, the first beat does not fade in at all (its slot starts at position 0, while the stage is already on screen during the lead-in), and the two per-element entrances are gone: they were wall-clock delays inside a scroll-driven scene, so a quick scroll left the outcome and chips still fading in several beats later. **Verified: all 16 beats show name + outcome at 10 of 10 samples.**

**2 · The spotlight had two faults.** `backdrop-filter: blur(2px)` ran inside a transformed ancestor, where Chromium composites the band as an **opaque fill** rather than failing quietly — that is the white box over the Approvals diff. The old comment called it free because it "costs nothing where it works"; **a filter documented as unreliable in the exact context it runs in is not free.** And one fixed near-black tint sat over every screen, which on a light screen is a grey wash over cream. The scrim is now the screen's **own** surface: light screens fade toward their paper at 0.55, dark ones deepen toward their ink at 0.5. **Verified: 18/18 veils screen-tinted, zero backdrop-filter anywhere, nothing covered.**

**3 · Density and scale.** Measured before: **base type 7.5–10.5px, minimum 7px, blank regions up to 39%** of the window. Now: **base 13px and minimum 11px on every screen at both 1440 and 1680.** 174 font sizes were raised by a codemod that reads each style object — anything in a mono object floors at 11px, anything else lands at 13px unless it was already a heading — and five screens were rebuilt by hand:

| Screen | Was | Now |
|---|---|---|
| Agent console | one reply line above ~500px of nothing | four streamed paragraphs + a "sources used" block |
| Workflow canvas | small nodes, a floating log card | 148px node cards with icon/name/status, graph spans the canvas, full-width log strip |
| Approvals | 4 stubs, short draft | 6 threads with previews, 268px list, draft fills the pane |
| A/B test | five grey bars per variant | two real landing pages — nav, hero, proof row, postal-code form, services strip |
| Content calendar | 8 entries, 7.5px day numbers | 20 entries across most weekdays at 11px, composer with body copy, hashtags, channels |

Plus the time audit (heatmap rows were a fixed 22px, so it sat in the top third — now stretches), the runbook (gained the right rail a docs site has, a costs section and a change log) and outreach (10 prospects, and the rest of the sequence under the email preview).

**Six screens are still over the 15% blank target** and are listed in §7. **The van decal's phone number** was SVG `<text>` at 7 units in a stretched viewBox — the §5 SVG-text gotcha again — and was removed rather than enlarged; the same number already sits at 11px on the business card above it.

**4 · The nav CTA.** Not a tone bug — a **cross-fade collision**. Background and colour ran the same duration from opposite ends, so they met in the middle: 175ms into a tone flip the pill was `rgb(133,131,127)` and the label `rgb(127,125,119)` — **1.09:1**. Two opposite ramps over one duration always cross; arithmetic, not tuning. The colour now **steps once at the halfway point**, and the ramp uses `ease.inOut` because it is the only token that is point-symmetric (`[0.65,0,0.35,1]`), so it is exactly half way at exactly half time **in both directions**. Worst contrast through a flip is now **3.56:1**, and the settled states were never the problem. **Verified: 50 settled samples and 174 continuous-scroll samples across 5 routes, zero blank frames.**

**5 · The home ledger** lost the CareerClarity row — an unverified "student throughput" figure for an unreleased product — and was deliberately **not** repadded. Four rows remain (SIFT 42%, and the three studio figures), count-up resolves, hairline gaps even.

**6 · The home CTAs** have their `spring.snappy` back, on the transform only: they stay painted at opacity 1 from the first frame per the hero LCP rule, so the bounce is motion on something already on screen.

**Verified on the alias:** build exit **0** unfiltered · caption sampling 10 points × 16 beats · spotlight veil and backdrop-filter audited per beat with screenshots · density and type measured at **1440 and 1680** with dwell screenshots reviewed one by one · nav CTA pixel-tested at 50 settled and 174 continuous points with dark-state screenshots · ledger rows, figures and spacing · **zero horizontal overflow at 375 on all 11 routes, scrolled** · **3-speed crash scroll at 1440/1920/375 on /, /work, a case study, /services, /about — 15 route-runs, 0 console errors, 0 React errors** · **mobile LCP median of 3: home 1964 ms, /services 2240 ms, both under 2.5 s**, CLS 0.000/0.001.

*Three probe errors of mine, all caught before they reached a number in this log.* A caption baseline of "0/160" was measured against a **Vercel Security Checkpoint 403** page — §5.22, tripped by my own polling. Twice, a density sample for the **last beat** landed on the kickoff calendar **below** the stage, because the final caption keeps its text after the pin releases and the sticky frame still reports a positive top; the probe now requires the frame to sit near the top of the viewport. And the first font-size census read the **modal size including mono labels** as "base", which is not what the brief means by base UI text — it now reads the modal of non-mono text and judges mono by the 11px floor.

**17e** `aae26c8` … `ccd4c1f` — **/services: the 14-day calendar becomes "Pick the day you call us."** Seven commits.

*Owner feedback:* the calendar was accurate and inert — fourteen cells filling as you scrolled past, which the reader had to decode before it said anything. It is replaced by one question and the reader's own dates.

**Pre-flight, as asked.** The booking tool is **Cal.com**, link `prachets/discoverycall`, embedded on /contact via `@calcom/embed-react`. **It does support a date parameter** — both the embed `config` and the hosted page take `date` and `month`. /services' CTA previously pointed at `/contact` with no parameter. The calendar sat in the `cream-warm` chapter between `NoList` and `ServicesCloser`, under `//_05 · how to start` and the h2 "Three steps. Two weeks to kickoff, max." **Only `Services.tsx` imported it.**

**What it is now.** A strip of the next 21 days from today in **America/Toronto**; weekend chips are quieter and disabled; the default is the next business day (today, when today is one). A lens glides between chips on `spring.soft`. Pointer drag, click/tap, and the keyboard all drive it — arrows skip weekends, Home/End jump to the first and last selectable day — with `role="radiogroup"` and an `aria-live` sentence. Three nodes on a line show **Discovery call** (the pick, "20 minutes"), **Proposal** (+3 business days) and **Kickoff** (+14 calendar days, the bound, in the Cormorant accent). Digits roll on an odometer, the nodes shift as the segment lengths change, and the line redraws. The old h2 survives verbatim as the closing line, so **no copy was lost and no new promise was made** — the only facts used are the 20-minute call, 3 business days, 14 days, preview URLs from day one.

**The CTA carries the date.** "Book {Weekday}'s call" → `/contact?date=YYYY-MM-DD`, and Contact passes it to both the Cal embed config and the hosted-page fallback link. **Verified end to end:** `?date=2026-10-09` produces `…/embed?layout=month_view&date=2026-10-09&month=2026-10`; a malformed value is ignored; no page errors.

**The date maths is its own tested module.** `src/lib/businessDays.ts` carries civil dates **pinned to midday UTC** and read only through UTC getters, so a DST boundary cannot move "add 14 days" onto the day before. `tools/business-days.test.ts` runs on node's own test runner with no new dependency — **`npm run test:dates`, 8 passing**: a Friday pick, a +3 that crosses a weekend, a month boundary, a year boundary, a leap day, the weekend rules and ISO round-tripping.

**⚠ There is no holiday calendar.** Only Saturday and Sunday are skipped, so a proposal due three business days after a pick that straddles a statutory holiday will read one working day early. The page only ever promises "3 business days", which is the same promise the old calendar made — but it is a real limitation and a holiday list is the fix if it ever matters.

**Five sampled picks, all correct:**

| Call | Proposal (+3 business) | Kickoff (+14 calendar) |
|---|---|---|
| Tue Oct 6 | Fri Oct 9 | Tue Oct 20 |
| Wed Oct 7 | Mon Oct 12 | Wed Oct 21 |
| Thu Oct 8 | Tue Oct 13 | Thu Oct 22 |
| **Fri Oct 9** | **Wed Oct 14** | **Fri Oct 23** |
| Mon Oct 12 | Thu Oct 15 | Mon Oct 26 |

**Deleted:** `KickoffCalendar.tsx` (zero importers verified) plus `CALENDAR_DAYS`, `WEEKDAY_HEADERS`, `WEEKEND_DAYS`, `KICKOFF_STAMP`, `KICKOFF_STAMP_DAY` and the `dayStart`/`dayEnd` fields on `ProcessStep`, none of which anything else read. `STEPS` stays — `ProcessTimeline` and `AutomateScreens` use it.

**Verified on the alias:** build exit **0** unfiltered · default selection = next business day · 21 chips, 6 weekend chips disabled and a weekend click ignored · keyboard, pointer drag and tap all select · `aria-live` announces the full sentence, and each node carries its own date as `sr-only` text because the odometer renders all ten glyphs · CTA date param correct after arrow, Home/End and tap · **reduced motion: both the digit column and the line segment compute `transform: none`** · mobile 375: strip scrolls with `scroll-snap-type: x`, minimum font **13px**, document width 375 · **zero horizontal overflow at 375 on all 11 routes** · **3-speed crash scroll on /services at 1440/1920/375 — 0 console errors, 0 React errors** · **mobile LCP median of 3: /services 2388 ms, home 1876 ms**, CLS 0.001/0.000.

*Four faults found by looking at the screenshots rather than the numbers.* The kickoff node sat flush against the container edge and its date read as clipped. All 21 chips did not fit at 1680 — the strip ran ~400px past the container and cut the last one. **`type-accent` was on the same element as `type-h2`**, and its `font-size: 1.12em` resolves against the PARENT's size, so the kickoff date rendered at about a third of the other two — it must nest INSIDE. And the odometer's clipped columns were as wide as the widest glyph, so a two-digit date read "Wed 1 4"; each column is now sized by an invisible copy of its own digit, because Cormorant has no tabular figures and a fixed `1ch` advance did not fix the accented date.

**One deviation from the brief:** the eyebrow reads **`//_05 · TRY IT`**, not bare "TRY IT" — the site's section eyebrows all carry the `//_NN ·` prefix and this section was `//_05 · how to start`. Say the word and it drops to "TRY IT".

**One cosmetic nit left:** the accented kickoff date still shows a hair more space between its two digits than the sans dates do. It is Cormorant italic's own side bearings, not a layout bug, and it is far better than it was.

**17f** `b6ea58f` … `231f1f2` — **"Your project start pass".** Five commits.

*Owner verdict on 17e: concept right, presentation 4/10, and the kickoff date was clipped.* This is the centrepiece version: two questions that build one artefact.

### Pre-flight, as asked

| | |
|---|---|
| Cal.com `?notes=` prefill | **Supported** — survives the redirect and reaches the embed |
| Cal.com `?date=` | **Works** — applied, then stripped from the visible URL by Cal's router |
| Weekend availability | **Saturday and Sunday both showed slots** when checked |
| **Event duration** | **"Discovery Call 30m"** — the site says **20 minutes** everywhere. See §7. |

### The date rules changed

**Weekends are bookable.** The call may be any day. Only the proposal count skips non-working days, and it now skips **Ontario's nine statutory holidays** as well as weekends — a static 2026–2027 table in `businessDays.ts`, which closes the no-holiday-calendar limitation 17e logged.

**It needed two anchors, and a test caught it.** A call ON a business day counts from the day after (Monday → Thursday). A call on a weekend or a holiday counts the following business day as day one (Saturday → Wednesday). Without the second anchor a Saturday call would have landed *later* than the Monday after it, which is not a promise anyone would make out loud. **12 tests passing, up from 8.**

**Eight picks on the alias, all correct** (Thanksgiving is Mon Oct 12 2026):

| Call | Proposal | Kickoff |
|---|---|---|
| Wed Oct 7 | Tue Oct 13 | Wed Oct 21 |
| Thu Oct 8 | Wed Oct 14 | Thu Oct 22 |
| Fri Oct 9 | Thu Oct 15 | Fri Oct 23 |
| **Sat Oct 10** | **Thu Oct 15** | Sat Oct 24 |
| **Sun Oct 11** | **Thu Oct 15** | Sun Oct 25 |
| **Mon Oct 12 (Thanksgiving)** | **Thu Oct 15** | Mon Oct 26 |
| Tue Oct 13 | Fri Oct 16 | Tue Oct 27 |
| Wed Oct 14 | Mon Oct 19 | Wed Oct 28 |

### What it is

A **28-day wheel** that centres its selection, scales and fades neighbours by distance (transform and opacity only), marks today, labels weekends "Weekend call" and **names the holiday on the day itself** — "THANKSGIVING" appears under Oct 12. Drag with momentum, click, arrows, Home/End; `role="listbox"` with `aria-activedescendant` and an `aria-live` sentence.

The **pass** is a 560px card on the new `--surface-elevated` token with a three-layer tinted shadow: Averr mark, "PROJECT START PASS", the business name at `type-h1`, three rows, a radial-gradient perforation, a barcode drawn deterministically from the name and the day, a pass number (`AV-1006-NR`), and a **READY TO BOOK** stamp that lands once per completion. On change the dates roll, a sheen sweeps and the card settles through ≤3°; on desktop it tilts ≤4° toward the cursor.

**The kickoff date is MEASURED**, not hoped for — the line is measured against the card's inner width and the font scaled to fit, one pass, reset-measure-write. **Verified unclipped at 1280 / 1440 / 1680 / 1920 / 375** with a 32-character business name: right edge 932 vs 1195, 1114 vs 1348, 1300 vs 1526, 1420 vs 1646, 144 vs 333.

**Privacy.** The business name is component state only — **no storage, no analytics, no fetch**. It rides to /contact as `notes`, which is the field Cal.com prefills from, and **never as `name`**, which belongs to a person. **Verified end to end:** `/contact?date=2026-10-10&notes=Northgate%20Renovations` produces `…/embed?layout=month_view&date=2026-10-10&month=2026-10&notes=Northgate+Renovations`.

**Verified on the alias:** build exit **0** unfiltered · 8 picks correct incl. Sat, Sun, a holiday and a holiday straddle · weekends selectable · **kickoff unclipped at all five widths** · name typing updates pass, pass number and CTA · the stamp fires on completion and resets when the name is cleared · keyboard, drag and touch all select · `aria-live` announces · **zero horizontal overflow at 375**, minimum font **13px** · **reduced motion: the sheen is absent and the stamp simply appears** · **3-speed crash scroll on /services at 1440/1920/375 — 0 console errors, 0 React errors** · **mobile LCP median of 3: /services 2236 ms (was 2388), home 1872 ms**, CLS 0.001/0.000. The section's code was NOT lazy-loaded — the Services chunk grew 44.15 → 45.75 kB gzip and LCP did not regress, so the extra boundary would have bought nothing.

*Four faults the screenshots caught, not the numbers.* The wheel read as a stub — the opacity falloff hit zero four days out and the track was anchored left, so the selection sat against the edge; it now centres and keeps six days legible. **Cormorant's italic figures draw outside a 1em line box**, so the odometer window clipped them and leaked the tail of the digit above as a stray stroke over "Sat 24"; window and cells are 1.35em with the strip lifted by half the extra leading. At 375 the pass rows' fixed 132px label column squeezed the date onto two lines and pushed it under the "20 MIN" meta; below 1024 the row is a grid with the label on its own line. And the mobile wheel showed two days at a 104px cell, now 82px and five.

**Deviations.** `--surface-elevated` **did not exist** — I added it to `index.css` as `#FBF9F4`, paper rather than white, so the card sits in the same family as `--color-bg`. The "mid-typing" screenshot is the **completed** state rather than a true mid-keystroke frame; the stamp moment and mid-typing are therefore one capture, not two.

**17g** `267c248` … `b51fa7d` — **A guided conversation, an obvious date control, and a pass that confirms.** Five commits.

*Owner audit of 17f:* the name question was missed — a faint mono label over a pale underline reads as a caption, not an action; the date wheel could not be changed by clicking; the call is 30 minutes; and a booked pass should show the booked time.

### Pre-flight

| | |
|---|---|
| Booking event | **`bookingSuccessfulV2`**. Only **`startTime`** is read. The deprecated `bookingSuccessful` carries `organizer.name` and `.email`; V2 carries **no attendee identity at all**, which is why it is used. |
| Modal | `cal("modal", { calLink, config })`, taking the same `date` / `month` / `notes` prefill. |
| Loader | The embed is **dynamic-imported on first intent**. It is now its own **1.39 kB** chunk and `app.cal.com` is not contacted until hover, focus or click — **measured: 0 cal.com requests before the CTA, 87 after.** |
| "20" mentions | **Six**, all corrected (below). |

### 1 · Thirty minutes, site-wide

| File | Before → after |
|---|---|
| `ServicesCloser.tsx:97` | "Twenty minutes, no deck" → **"Thirty minutes, no deck"** |
| `servicesProcess.ts:39` | "20 minutes. No slide deck." → **"30 minutes."** |
| `KickoffPass.tsx` | `meta="20 min"` → **`"30 min"`** |
| `ComingSoon.tsx:110` | "a 20-minute call" → **"a 30-minute call"** |
| `Contact.tsx:1096` | "Book a 20-minute intro call." → **"30-minute"** |
| `businessDays.ts:178` | the doc comment naming the facts |

**Zero remaining.** This closes the owner item 17f opened.

### 2 · The conversation

Each step carries a mono "STEP n OF 2" over the question at **`type-h3` in ink**, never the muted token — measured at **14.15:1**. The name input is a real field: elevated fill, 12px radius, `type-h2` text at **17.53:1**, a 2px focus ring, **93px tall**. An animated placeholder types and deletes three example names with a blinking caret once the section is in view, **stops the moment the field is focused**, and is replaced by a static placeholder under reduced motion. Nothing is autofocused. At ≥2 characters Step 1 takes a tick and dims to 0.62 while Step 2 goes to full emphasis — **Step 2 is never locked.** The pass's empty name slot carries a **pulsing dashed outline** until a name is typed, so both columns point at the same first action.

### 3 · The date control

Centre day at `type-display-l` with **52px arrows**, clickable dimmed neighbours, swipe, arrow keys, Home/End, and a **month popover** (this month and next, past days disabled, Escape and outside-click close with focus returned to the trigger). Range **today → +60 days**. Weekends and holidays are named on the day itself.

| | |
|---|---|
| initial | Tuesday, Oct 6 · **Today** |
| next arrow | Wednesday, Oct 7 |
| neighbour click | Thursday, Oct 8 |
| ArrowRight | Friday, Oct 9 |
| End | Saturday, Dec 5 · **Weekend call** |
| Home | Tuesday, Oct 6 |
| popover | 31 days, 5 disabled, October 2026; Escape returns focus to "Pick another date" |

### 4 · In-page booking

The CTA opens the Cal modal. **Measured end to end:** `/embed?layout=month_view&date=2026-10-07&month=2026-10&notes=Northgate+Renovations&embedType=modal` — the chosen day preselected and the business name in notes. Embed failure falls back to `/contact?date=…&notes=…`; /contact is unchanged.

### 5 · Booked → CONFIRMED

A 180° `rotateY` flip (instant under reduced motion — `transform: none` measured) to a back face carrying **"Wed, Oct 7 · 2:30 PM ET · 30 MIN"**, the proposal and kickoff **recomputed from the booked day** (Oct 7 → proposal Tue Oct 13, past Thanksgiving; kickoff Wed Oct 21), the inbox line, a green CONFIRMED stamp, and aria-live **"Booked: Wednesday, October 7 at 2:30 PM Eastern."** The CTA becomes a quiet "Book another call" and the date control is disabled showing "Booked: Wed, Oct 7".

**Verified with a simulated event, not a real booking.** `?simulateBooking=<ISO>` sets component state and nothing else — no request, no storage. **It is reachable on a deployment when typed by hand**, which is a deliberate trade so the flip could be verified on the alias; the dev-only `CustomEvent` path exists too. See §7.

### Verification on the alias

Build exit **0** unfiltered · Q1 **14.15:1**, input text **17.53:1**, field outline composited **4.02:1** against the fill and **3.25:1** against the warm ground · animated placeholder runs, stops on focus, absent under reduced motion · pulsing slot before typing · step progression with tick · date control by arrow, neighbour, keyboard, Home/End and popover · range limits · weekend and holiday labels · **0 cal.com requests before intent** · modal on the selected date with notes · the flip in both motion modes · mobile 375: **no control under 44px**, minimum font **13px**, field full-width, **zero overflow** · **crash scroll 1440/1920/375 — 0 console errors, 0 React errors** · **mobile LCP median of 3: /services 2336 ms, home 1876 ms**, CLS 0.001/0.000 · **12 date tests passing**.

*Three faults the screenshots caught, not the numbers.* **The booking CTA was 700px below the fold** in the empty state: `.kp2-pass` sets `position: relative` later in the same stylesheet at the same specificity, so it beat `.kp2-face--back`, the back face sat in normal flow and the card measured 1267px instead of 613. Then **the CONFIRMED stamp and barcode were clipped** — the back face is taller than the front, and `inset: 0` clipped it to the front's height; the face that is NOT showing is now the one taken out of flow. And **a confirmed pass was still pulsing the dashed "fill this in" slot** when no name had been typed.

*One measurement error of mine, reported:* I first read the field outline as 17.53:1 by substituting alpha 1 into the `rgba` — that measures the ink, not the border. Composited properly, `--hair-hi` is **1.47:1** and fails WCAG 1.4.11; the border is now `rgba(20,20,18,0.55)`.

**Deviations.** There is **no `--border` token** — §5.23 records that `--color-border` does not exist — and `--hair-hi` fails 3:1, so the field, the arrows and the "pick another date" control use a literal `rgba(20,20,18,0.55)`. The eyebrow remains **`//_05 · TRY IT`** rather than bare "TRY IT", keeping the site's `//_NN ·` section convention. And the simulated-booking harness is reachable in production via an explicit query param, as above.

---

## 3. SITE MAP AS BUILT

### `/` — Home (`src/pages/Home.tsx`)

| Order | Component | Signature mechanic |
|---|---|---|
| 1 | `Hero` | **The "serious." takeover.** Split h1 at `display-2xl`; a slab pill on the word "serious." expands via scroll-linked `clip-path` from the measured pill rect into a full dark frame carrying a 4-case-study reel that pans. Publishes a nav-dark override. **This is the quality floor for every other page.** |
| 2 | `Chapter tone="cream" from="dark"` → `ThreeScenes` + `ThreeDoors` | Three unpinned scenes (template sameness → client specificity → full-bleed result); then three service doors with live hover previews clamped against both the name and the promise, Grow showing a mini dashboard labelled ILLUSTRATIVE; each door prints its pillar's first four service names in mono under the promise, read from `PILLAR_SERVICES` |
| 3 | `Chapter tone="dark" from="cream-alt"` → `ProofLedger` + `Manifesto` | Ledger rows count up, hairline draws left→right; `FeaturedCard` above carries the 85% |
| 4 | `Chapter tone="cream" from="dark"` → `FinalCTA markerNumber="06"` | Contains the only remaining home `PillHl` ("actually") |

Data: `src/data/homeScenes.ts`, `src/data/heroReel.ts`, `src/data/servicePillars.ts`, `src/data/caseStudies.ts` (figures).

### `/work` — The vault (`src/pages/Work.tsx`)

Desktop is a **single relative wrapper**: `ProjectFilm lead={1.5}` with `VaultDoors lead={1.5}` absolutely positioned over its first 1.5 screens.

| Component | Signature mechanic |
|---|---|
| `VaultDoors` | **Two cream panels part** to reveal the film already playing behind them. Title halves ride outward ±32vw and fade. Overlay, `pointer-events: none`, returns `null` under reduced motion. |
| `ProjectFilm` | One pinned dark stage over `(count + 1 + lead) × 100vh`. Position is a **continuous float**, not an index; text leaves before the next arrives; images crossfade. Each project: meta, name full-width (`display-xl`), then a 30/70 grid of facts + screenshot at natural aspect. Room lit in the client's tint at 18%. |
| `FilmIndex` (inside ProjectFilm) | Compact dot column + active name; hover/focus expands all names, each on its own dark ground. Dots are buttons with `aria-label` = project name. |
| `OpenTransition` | Clone of the screen grows from its rect to fill the viewport over the study's tint, then the route changes. Falls back to plain navigation on reduced motion / missing image / throw. |
| `WorkMobile` | < 768px: static hero, then one `100svh` scroll-snap section per project, progress dots. |
| `VaultCloser` | Kept from Session 14, inside `Chapter tone="cream" from="dark"` |

Back from a case study restores the exact segment via `sessionStorage` + `useNavigationType() === "POP"`.

### `/work/:slug` — Case studies (`src/pages/CaseStudy.tsx`)

Order, each wrapped in `SectionBoundary`:

1. `ReadingRail` — fixed, **≥1700px only**; below that a tinted 2px bar under the nav. Labels come from `caseSections.ts`. Replaced `ScrollProgress` (now orphaned — see §7).
2. `CaseHero` — **zoom into the work**: one screenshot scaling 0.62→1, flattening rotateX 12°→0°, radius 12→8, landing at exactly `--container-wide`; two blurred tinted depth copies of the *same* image fan out behind it.
3. `Context` — statement (first sentence, `type-h2`, ink) + support (rest, muted, offset right), both read-fill; verbatim tint highlighter on the statement; numerals fill `--hair` → tint.
4. `Approach` — pinned split: blocks scroll left, one sticky frame right, images wipe up. Pillar names render as **outline + fill clipped by one `--fill` var per block**, with a 2px tint rule. Counter `"DESIGN · 1 / 3"` under the frame.
5. `Inventory` — self-ticking checklist; each item's box draws a check in the tint; counter `"05 / 07 shipped"`; labels (h3) over detail (body); stack chips assemble after the last tick.
6. `Chapter tone="dark" from="cream"` → `Signatures` (if any) + `Gallery` (if any) + `Outcome`
   - `Signatures` — full-width rows, image zooms 1→1.35 with `transform-origin` on the signature's own `focal` point.
   - `Outcome` — figure-led where a `headlineFigure` exists (counts up, tint glow); otherwise leads with the headline. **Never a placeholder.**
7. `Chapter tone="cream-alt" from="dark"` → `Next` — a lit timeline, one node per sentence, phase openers ("Weeks 4–12", "Before") promoted to mono labels.
8. `CaseFinale` — next study's hero image full-bleed expanding to viewport width, then the label + Continue CTA + one booking link **below it on clean cream**.

`useDeclarePageEndTone("cream")` so the Footer reveals over cream.

### `/work/careerclarity-ai` — draft

`status: "draft"` routes to `ComingSoon`. **Never linked from the finale cycle.** Appears in the /work film as the final segment: muted name, `IN PROGRESS`, no image, no figure, no link, neutral (non-tint) light.

### `/services` — "Watch us build your business" (`src/pages/Services.tsx`)

**Rebuilt across 17c-1 … 17c-5 and swapped in here in 17c-5**, replacing the flat 16-row service index. Signature mechanic: **the build**.

One continuous pinned scene. A generic GTA home-services business (**Northgate**, `northgate.ca`) is built as you scroll, and each of the sixteen services is the caption of the step happening on screen. **The story is the list — no service is named twice on the page.**

| Order | Component | What it is |
|---|---|---|
| 1 | `BuildHero` | Eyebrow counts `SERVICE_COUNT`; h1 "Watch us build *your* business." on one `CharReveal`; scroll cue |
| 2 | `ServicesBuild` | **The stage.** 16 beats + 2 chapter transitions on one pin |
| 3 | `Chapter dark from cream` → `NoList` | unchanged |
| 4 | `Chapter cream-warm from dark` → `KickoffPass` | **17g**: guided two-step conversation (visible name field + live typing hint, arrows/neighbours/month popover) building a live boarding pass; in-page Cal.com modal; flips to CONFIRMED on a real booking |
| 5 | `Chapter dark from cream-warm` → `ServicesCloser` | `useDeclarePageEndTone("dark")` |

**Slot model.** Beats are not evenly spaced, so scroll maps onto SLOTS, not beats: 5 Design beats at 65vh, an 80vh transition, 5 Automate beats, an 80vh transition, 6 Grow beats. **Travel 1200vh, wrapper 1300vh** (the n+1 rule, §5.4). Per beat: caption in 0–0.15, screen builds 0.05–0.40, **dwell 0.40–0.85**, caption out 0.85–1.00. One continuous float drives caption, canvas and rail.

**The sixteen screens** live in `components/services/build/`: `BuildScreens.tsx` (Design), `AutomateScreens.tsx`, `GrowScreens.tsx`. Each is a different piece of software, each has a `compact` mobile variant — **restructured, never scaled — with 11px the floor for every text node across all sixteen.**

**Systems:** `WindowChrome` (the window, 67% of a stage capped at 1680 on this route only), `GhostCursor` (choreographed from the same scroll value, so a click and its response cannot drift), `camera.ts` + `FocusSpotlight` (**spotlight only — there is no scale; every push-in value tried cropped the frame, which is arithmetic, not tuning**), and `ALL_SPECS`, which mounts only the active slot ±1.

**Chapter anchors.** Home's doors link to `/services#design|#automate|#grow`. Those ids are no longer sections — the chapters are scroll positions inside one pin — so `ServicesBuild` reads the hash (from `useLocation`, so it reacts to a same-document hash change too) and jumps to that chapter's first beat, retrying until layout settles and cancelling on a real gesture.

**Map data.** `src/data/osmOshawa.ts` is a committed static extract of real streets over central Oshawa and Whitby: **OpenStreetMap, © OpenStreetMap contributors, licensed ODbL.** Pulled once from Overpass, projected flat and Douglas-Peucker simplified — 880 ways, 9.4 kB gzip. **No tiles, no API call at runtime, no map library.** The attribution renders inside the map window at 11px and must stay there.

**Mobile / reduced motion** drop the pin: one section per service, each screen at its finished state.

**Deleted in the swap** (zero importers each, verified): `pages/ServicesNext.tsx`, `components/services/ServiceIndex.tsx`, `components/services/AutomatePipeline.tsx`, and the whole of the old `Services.tsx` (`ServicesHeader`, `PillarSequence`, `PillarSection`, `StackedPillar`, `StaticAmbient`, the three pillar ambients).

### `/about`, `/contact`, `*` (404)

`/about` — monogram hero, 4 principles with distinct numeral choreography, 5-step process timeline, founder card. `/contact` — 7-band editorial scroll with the designed form, Cal.com band. `404` (`NotFound`) — carries its own `PillHl` ("doesn't exist"). `/about` and `/contact` are **Session 18/19 targets** and are the weakest pages now.

### Image-usage map (rendered)

**Zero content repeats on every case-study page**, verified on the alias:

| Study | Content images | Repeats |
|---|---|---|
| CG Walls | 3 | none |
| CapitalCommand | 8 | none |
| SIFT | 8 | none |
| CadenceStack | 8 | none |

Two categories must be **excluded** from any image audit or you will get false positives:
- `.case-zoom-wrap div[aria-hidden="true"] img` — the hero's 2 blurred depth copies (same src as the front, by design).
- `[data-frame-base] img` — the Approach frame's base layer, which stays mounted at rest holding the same image as the top layer (dropping it reintroduced a blank first paint).

The **data** still lists `heroImages[1]` and `[2]` per study; they are **never rendered** (the hero uses `heroImage` alone). They are documented in the type as droppable — removing them plus the `heroImages?.[0]` fallbacks in `CaseHero` and `CaseFinale` is safe cleanup.

---

## 4. LOCKED RULES + STANDING RULES

**Never break these without Prachets explicitly unlocking them in the session brief.**

### Locked
1. **`type-*` utility classes only.** No per-page inline font sizes. Tiers: `display-2xl`, `display-xl`, `display-l`, `h1`, `h2`, `h3`, `body-lg`, `body`, `small`, `eyebrow`, plus `type-accent` (Cormorant italic).
2. **Motion tokens only** — `src/lib/motion.ts` (`duration`, `ease`, `easing`, `spring`). No ad-hoc durations or beziers.
3. **`useReducedMotion` everywhere**, with a real final state (not just "no animation").
4. **`useScrollStyle` for ALL scroll-linked opacity inside sticky frames.** Non-negotiable — see §5.
5. **`easing.*` (cubicBezier callables) for `useTransform`'s `ease` option** — never the `ease.*` tuples. See §5.
6. **Measured pixels, not `calc()`**, for animated sizes/positions. See §5.
7. **Screenshots at natural aspect (`object-fit: contain`)** — never cropped, never upscaled past natural size.
8. **No prices anywhere on a live route.** Timelines instead. The contact form's budget bands are the sole exception (asking a client's budget ≠ publishing ours).
9. **`PillHl` = home hero + `FinalCTA` "actually" + `/nope` only.** Note `FinalCTA` is shared by home and `/services`, so "actually" legitimately appears on both.
10. **Client tint is ambient only** — glows, small progress accents, highlighter grounds. Never body text, headings, or Averr buttons.
11. **ASSET RULE** — if an asset the spec references is missing or inconsistent with the other studies, **STOP and flag before building.** Do not ship visible inconsistencies.
12. **Never invent figures.** Only `headlineFigure` values may be shown as results. Sample numbers must carry the ILLUSTRATIVE label.
13. **Verbatim rule** — any emphasis/highlighted phrase must be an exact substring of the copy it sits in; labels must be built only from that item's own words. Verify programmatically before shipping; if it isn't verbatim, don't ship it.
14. **One signature mechanic per page, never reused.** Home = the takeover. /work = doors + film. Case studies = the zoom + the rail. /services and /about must each get their own.
15. **The home "serious." takeover is the quality floor.** Any new page that reads weaker than it is not done.

### Standing (process)
16. **`npm run build` UNFILTERED, exit code 0, before every push — and report the exit code.** Never pipe it through `grep`: that is how two broken commits were pushed (`64e8bcd` fixed them). `npx vite build` skips `tsc` and will happily produce a bundle from code that does not typecheck.
17. **Visually review every screenshot you take and describe what you see.** Measurements alone have repeatedly passed while the page looked wrong.
18. **Commit + push after each verified item**, so a usage limit mid-session loses nothing. **This outranks the `Commit:` line at the foot of a brief** — that line is the session *summary for the final report*, not one commit message to squash the work onto. Ruled by Prachets in 17-fix after Session 17 shipped as ten commits against a brief that supplied one message.
19. **Verification protocol:** build exit 0 → push → confirm remote hash matches local → wait for Vercel → poll the alias until it serves the new bundle hash → DOM sweep **on the alias** → screenshots → hand back the preview URL.
20. **Zero horizontal overflow at 375** on all routes, every session.
21. **Zero ViewTimeline/ScrollTimeline on sticky descendants**, every session.
22. **Bundle gate:** report the delta; flag anything over **+12 KB gzip JS**.
23. **Crash-scroll before reporting.** Before reporting ANY session, scroll every touched route top → bottom at three speeds — slow wheel, normal, fast/large steps — and back up again, with **zero console errors and zero React errors**. A route that crashes anywhere means the session is not verified, whatever the DOM sweep says. Added in 17c-4 after 17c-3 shipped a React #185 that a position-sampling probe never hit: the probe jumped straight to each dwell midpoint and the crash lived in the travel between them.
24. **Report your own probe errors.** Several "bugs" were bad measurements (the 234px sliver, a rotation inflating `getBoundingClientRect`, reading `strokeDashoffset` when motion animates `stroke-dasharray`, sampling a segment before its count-up finished). Re-probe before changing working code.

---

## 5. TECHNICAL LEARNINGS (every gotcha, with cause + fix)

**1 · motion 12.43.0 ViewTimeline acceleration.** *Cause:* motion hardware-accelerates scroll-linked `opacity` into a native WAAPI animation bound to a **`ViewTimeline`** — the element's own progress through its scrollport — not the `useScroll` progress it was derived from. Inside `position: sticky` the element never moves, so the timeline is meaningless; once WAAPI owns the property motion stops writing inline style, and **WAAPI outranks inline style in the cascade**. `transform` is unaffected (not accelerated). *Diagnosis:* `el.getAnimations()`. *Fix:* `src/lib/useScrollStyle.ts` — subscribe to the MotionValue and write `el.style.opacity` by hand. Returns a **callback ref** so conditionally-mounted nodes paint correctly on attach.

**2 · `useTransform`'s `ease` option crashes on a bezier tuple.** *Cause:* `transition` accepts `[0.65,0,0.35,1]`, but `useTransform`'s `ease` **calls** what it's given; motion's `pipe()` throws `"a is not a function"`. TypeScript does not catch it. *Fix:* `easing.inOut` etc. in `lib/motion.ts` (`cubicBezier(...)`), passed as an **array**: `{ ease: [easing.inOut] }` — one easing per segment.

**3 · `calc()` → `100vw` does not interpolate.** *Cause:* motion cannot tween `calc(var(--container-wide) * 0.6)` against `100vw`; it snaps to the end value on the first frame. *Fix:* measure both ends to pixels (`clientWidth`, a container probe) and interpolate numbers. Same rule for `clip-path` insets — use px, not %.

**4 · Sticky pin math.** A wrapper of height H containing a `100vh` sticky child pins for **H − 100vh**, not H.
- A **160vh** wrapper pins for only **60vh** — the hero zoom was timed over 0→0.55 of the wrapper and finished *after* the pin released.
- An **n × 100vh** wrapper pins a 100vh stage for **n − 1** segments — the last project never got pinned time. Fix: wrapper `(n + 1) × 100vh`, and map progress over `height − innerHeight`.

**5 · CharReveal word overflow.** *Cause:* `CharReveal` lays each word out as an `inline-block`, so nothing breaks mid-word: a word wider than its column **overflows silently while still reporting one line**. Line-count checks miss it entirely — that is how "CadenceStack" ended up sitting on top of a screenshot. *Fix:* measure the **widest single word** against the column width. And when no tier fits, the layout is wrong, not the type scale — the /work name moved to its own full-width row.

**6 · `AnimatePresence` with no `exit` drops the outgoing layer instantly.** *Cause:* keyed on the active index with no `exit` prop, the old layer unmounts the moment the key changes, while the incoming layer mounts fully clipped (`inset(100%)`). For the length of the wipe there is **nothing to draw**. Preloading cannot help — the gap is structural. *Fix:* keep the outgoing image mounted underneath until the incoming one has wiped over it. Keep it mounted at rest too (dropping it at rest reintroduces a blank first paint); mark it `[data-frame-base]` so audits exclude it.

**7 · `IntersectionObserver` ignores `clip-path`, and the nav collects targets once.** *Cause:* the nav's tone detector queries `[data-tone='dark']` **once per route** (a rAF after mount) and observes a 1px band under the nav. A clipped dark stage still reports its full box, so the nav flipped the instant a 1px slit appeared; and adding `data-tone` later doesn't register the element. *Fix — the marker pattern:* keep a marker element **always in the DOM, outside any clipped ancestor**, and move it in and out of the nav's band by changing `top`. Make it span the frame once open, or it falls above the band as the frame scrolls away.

**8 · React state survives `/work/:slug` changes.** *Cause:* React reuses the component instance across a param change, so `Approach`'s `active` index survived from a three-pillar study into a two-pillar one and `entries[2].pillar` threw **during render** — blanking the whole route, and only via client-side navigation. *Fix:* clamp indexes in render (not just in the scroll handler, which runs after), and wrap each section in `SectionBoundary` so one throw drops a section instead of the page.

**9 · framer adds `tabIndex` to `whileHover` spans.** Any `motion` element with a hover/tap prop becomes focusable, creating phantom tab stops. Audit tab stops per section; give decorative links `aria-hidden` + `tabIndex={-1}`.

**10 · Grid blowout.** `1fr` means `minmax(auto, 1fr)`; large type sets `min-content` and breaks out of the track, clipping inside `overflow: hidden`. Use **`minmax(0, 1fr)`** (or `max-content` for a name that must not squeeze).

**11 · The double-gutter trap.** `--container-wide: min(1440px, calc(100vw - 2 * var(--gutter)))` **already subtracts the gutter.** Adding `padding: 0 var(--gutter)` inside it insets twice and clips radii. It bit the /services stage and the finale CTA.

**12 · Filtered build output hides errors.** `npm run build | grep …` swallows `tsc` failures and exits 0 from the grep. Two commits were pushed that did not typecheck. Always run it unfiltered and echo `$?`.

**13 · Timer-vs-scroll desync.** A CSS/`animate` crossfade on a 300ms timer, driven by an index that flips instantly at a scroll boundary, means the index and the visible content disagree for the whole transition — and on a fast scroll the entire dwell is consumed by the fade. CapitalCommand appeared to never render because of this. *Fix:* derive visibility from a **continuous scroll position**, and move the index's switch point to the middle of the hand-over.

**15 · A continuous loop inside a sticky frame wants a hand-written rAF, not motion.** *Cause:* gotcha 1 again, from the other direction — an ambient loop inside a pin has no meaningful `useScroll` progress to hang off, and handing its opacity to motion invites the same WAAPI/ViewTimeline capture. *Fix:* the Automate pipeline writes `style.transform` and `style.opacity` itself in a rAF, so nothing else ever owns those properties, and suspends the loop entirely on an `IntersectionObserver`. `useScrollStyle` does not apply — there is no MotionValue to subscribe to.

**16 · `transform: translate(%)` resolves against the element, not its container.** *Cause:* a CSS transform percentage is a percentage of the transformed element's own border box. `translate(55%)` on a 90px chip moves it 49px, not 55% of the 720px diagram. *Fix:* measure the host (`ResizeObserver`) and translate in px. Same class of bug as 3: percentages and `calc()` both look like they mean what you want and do not.

**17 · A strike that must survive wrapping is a background, not a bar.** *Cause:* an absolutely-positioned 2px bar draws exactly one line; "projects we can't ship in 90 days" takes three at 375. *Fix:* paint the rule as a `linear-gradient` background on the inline phrase with `box-decoration-break: clone`, which gives every wrapped fragment its own full-width rule, and animate `background-size`. It costs a paint property instead of a transform — the right trade against being visibly wrong on mobile.

**18 · CSS grid auto-placement will backfill the holes you left.** *Cause:* cells and cards shared one 7-column grid; the week-one cards occupied columns 1–4 of their row, so week two's first three cells flowed into columns 5–7 *beside them* and the rest wrapped below. Week two was split across two visual rows. *Fix:* name `gridRow` and `gridColumn` on every item in a grid that mixes item sizes. Nothing in the DOM sweep caught this — only looking at the screenshot did.

**19 · `getBoundingClientRect()` is inflated by rotation.** *Cause:* it returns the axis-aligned bounding box, so a rotated card reports a larger, differently-proportioned box than its layout. Measuring the mood cards this way made correct natural-aspect boxes look wrong (1.63 vs 1.80). *Fix:* use `offsetWidth`/`offsetHeight` for layout questions and reserve the client rect for on-screen position. Listed in §4.23 as a recurring source of false bugs; this is the second time it has bitten.

**20 · Scaling a still shrinks its labels with it.** *Cause:* `StaticAmbient` scales a 720px composition to a 327px column, so every label inside scales too — the ILLUSTRATIVE label landed near 5px, small enough to stop discharging rule 12. *Fix:* lift compliance-critical text *outside* the scaled box and print it at full size. Measure effective on-screen font size as `fontSize × (clientRect.width / offsetWidth)`, not `fontSize`, when anything above the element is scaled.

**21 · Vercel silently drops builds after rapid pushes.** *Cause:* nine pushes in ~15 minutes; the ninth commit reached `origin` and Vercel created **no deployment at all** — not queued, not building, not errored, nothing in the deployments list. *Diagnosis:* compare `git rev-parse origin/redesign-v2` against the newest deployment's `githubCommitSha` (the Vercel MCP `list_deployments` is faster than the dashboard here). *Fix:* push an empty commit to refire the webhook (`git commit --allow-empty`); it built immediately. **Never assume a green local build plus a successful push means the alias will update.**

**22 · The preview alias serves a 403 Security Checkpoint under automated polling.** *Cause:* polling the alias every 5s for a new bundle hash trips Vercel's bot protection; the alias then returns `403` with a "Vercel Security Checkpoint" HTML page to *every* automated request, including Playwright. It clears on its own after a few minutes and never affects a real browser. *Fix:* **poll at 60s intervals or slower.** A tight `until` loop on the bundle hash is the exact shape that trips it.

**23 · A `<link rel="preload">` is a *priority* decision, not a free win.** *Cause:* the hero fonts were preloaded on the reasoning that the hero needs them. A preload is a high-priority fetch, so 344 kB of Inter sat in front of the 151 kB entry chunk and more than doubled its download time on a 1.6 Mbps link — first contentful paint 2992 ms. *Fix:* preload only what is both small and visually load-bearing (Geist 29 kB, Cormorant 23 kB). Everything else loads behind the JS with `font-display: swap`. **Measure the waterfall before adding a preload; `performance.getEntriesByType("resource")` with `startTime`/`responseEnd` shows the contention immediately.**

**24 · A swapped font reflows the text above the LCP element.** *Cause:* `/work/sift` and `/work/cadencestack` carried 0.035–0.049 CLS at ~2.4 s. It looked like the Inter swap; it was **Cormorant**, which sets the accent words *inside* the headline at `1.12em`. When it arrived the headline relaid and pushed the subhead down. *Fix:* preload Cormorant (23 kB) — CLS went to **0.000** on both. *Method note:* the first two attempts (metric-matched Inter fallback, then re-checking the preload) were guesses. **Attributing the shift to its source node took one run** — `PerformanceObserver` on `layout-shift` with `entry.sources[].node` — and named the timestamp and the element. Same lesson as the chapter anchors: instrument before the second guess.

**25 · `useState(false)` + `matchMedia` in an effect renders the wrong branch first.** *Cause:* `/work`'s `useMedia` initialised to `false`, so every phone visit mounted the entire desktop `ProjectFilm` for one commit before the effect flipped it — four eager images, 431 kB, fetched on the critical path and discarded. *Fix:* read `window.matchMedia(q).matches` in the `useState` initialiser (`Nav.tsx` already did). **Any media hook that gates which subtree mounts must be initialised synchronously, not in an effect.** One that only gates behaviour can stay in an effect.

**26 · An `<img>` can never be the LCP element and paint at first render.** React has to render it before the browser can request it, so the fetch starts after mount no matter what `fetchPriority` says. Give it `width`/`height` so it does not shift (that alone took `/work` from 0.054 to 0.016), keep it eager, and accept that the only real fixes are a smaller file or prerendered markup.

**27 · A route-chunk preload is the same trade as a font preload.** Preloading `/services`' 40 kB chunk pushes first contentful paint out slightly — it shares the pipe with the entry chunk, exactly as the Inter preload did (§5.23) — but the chunk is then already there when React mounts, so LCP lands 560 ms earlier. **Net positive here only because the route chunk is on the critical path for the render; a preload that is not is pure contention.** Judge every preload by the measured net, never by "the page needs it".

**28 · Intrinsic size belongs in one generated place.** `/work`'s previews carried hand-written `w`/`h` in `workIndex.ts` from 19-pre; `src/data/screenshots.ts` is generated from the files themselves. Two copies of the same number drift the moment a screenshot is replaced. The hand-written pair is gone.

**29 · A 600px-step probe scroll invents layout shift.** A full-scroll CLS probe reported **0.155 on /work/sift** and 0.076 on cadencestack, attributed to the nav. Under a gentle 100px-step scroll both read **0.009 and 0.000**. Jumping 600px at a time skips the sticky nav's intermediate states, so a 4px compaction registers as a large unanchored shift that no visitor could experience. **Scroll in steps a human could produce, or the number is fiction.** (§4.24 again.)

**30 · `backdrop-filter` inside a transformed ancestor paints an opaque box.** *Cause:* the spotlight bands carried `backdrop-filter: blur(2px)` with a comment saying it was kept because it "costs nothing where it works". Inside a transformed ancestor Chromium does not fail quietly — it composites the band as a solid fill, which is the white box over the Approvals diff. *Fix:* removed. **A filter documented as unreliable in the exact context it runs in is not free; delete it rather than leaving it in as a maybe.**

**31 · Two colours cross-fading from opposite ends always collide.** *Cause:* the nav CTA's pill background and its label ran the same duration and easing in opposite directions, so at the midpoint both were mid-grey — 1.09:1, a pill with no label, for roughly 80ms of every tone flip. *Fix:* the label does not ramp. It **steps once at the halfway point**, and the background uses `ease.inOut`, the only token that is point-symmetric, so the step lands when the pill is exactly mid-value in both directions. Minimum 3.56:1. **Any two-colour transition where both sides move needs one of them to be a step.**

**32 · A caption keyed to beat index cannot read a slot-space playhead.** *Cause:* see §2's 17d entry. *Fix:* `slotForBeat(beat.index)`. **Every scroll-linked value on /services is in SLOT space — if a component indexes by beat, convert first.** The screens already did; the caption did not, and it had shipped that way since 17c-2.

**33 · `type-accent` must NEST inside the size class, never sit beside it.** *Cause:* its `font-size: 1.12em` resolves against the PARENT's computed size. On `className="type-h2 type-accent"` the accent measured against the inherited body size and rendered a display date at roughly a third of its neighbours. *Fix:* `<span className="type-h2"><span className="type-accent">…</span></span>`. **Anywhere the accent voice is wanted at a display size, it goes in a child.**

**34 · A clipped odometer column is as wide as its widest glyph.** *Cause:* each rolling digit is a column of 0–9 with `overflow: hidden`, so the box takes the width of the widest numeral and a "1" floats in it — "14" rendered as "1 4". `font-variant-numeric: tabular-nums` fixes it only in a face that has tabular figures; Cormorant does not. *Fix:* size the column with an invisible copy of the digit it is currently showing and absolutely position the rolling strip over it. Correct in every face.

**35 · Civil dates must not be built with the local-time `Date` constructor.** *Cause:* "add 14 days" to a local-midnight Date lands on the day before twice a year, and a CI box in UTC disagrees with a reader in Toronto about what "today" is. *Fix:* `src/lib/businessDays.ts` pins every date to **12:00 UTC** and reads only UTC getters; "today" comes from `Intl.DateTimeFormat("en-CA", { timeZone: "America/Toronto" })`. Unit tested — `npm run test:dates`.

**36 · A clipped odometer needs a window TALLER than one em.** *Cause:* Cormorant's italic figures draw outside their 1em line box, so a window of exactly 1em cut them and let the tail of the next digit in the column show above — a stray stroke over the accented date. *Fix:* window and cells at **1.35em**, with the rolling strip lifted by half the extra leading so the glyph keeps the baseline of the text beside it. **Any face with real ascenders or a slanted axis needs the bleed.**

**37 · "+3 business days" needs two anchors, not one.** *Cause:* counting from the first business day on or after the call makes a Saturday call land a day LATER than the Monday after it. *Fix:* a call on a business day counts from the day after; a call on a weekend or holiday counts the following business day as day one. Saturday → Wednesday, Monday → Thursday. Unit tested both ways.

**38 · Two single-class selectors, later wins — and it silently moved a CTA off the page.** *Cause:* `.kp2-face--back { position: absolute }` was declared before `.kp2-pass { position: relative }` in the same `<style>` block. Equal specificity, so the later rule won, the back face sat in normal flow, the card measured twice its height and the booking CTA ended 700px below the fold. *Fix:* compound selectors (`.kp2-pass.kp2-face--back`). **In a component-scoped `<style>` block, order is the only thing separating two single-class rules; make the one that must win compound.**

**39 · A flipped card must size to the face that is showing.** *Cause:* with the back face `position: absolute; inset: 0`, it is clipped to the FRONT face's height. The back was taller, so the CONFIRMED stamp and barcode were cut off. *Fix:* take the hidden face out of flow instead of always the back one.

**40 · Compositing matters when measuring a border's contrast.** *Cause:* reading `rgba(20,20,18,0.18)` as if it were opaque reports 17.5:1 — the ink's contrast, not the border's. Composited over the fill it is **1.47:1**, failing WCAG 1.4.11's 3:1 for a control boundary. *Fix:* composite `fg·α + bg·(1−α)` first, and check against BOTH adjacent colours (the fill inside and the page ground outside).

**41 · Misc, already fixed:** `.pill-hl > span` (0,1,1) beat `.pill-hl__slab` (0,1,0) and applied the text gradient → scope with `:not(.pill-hl--bare)`. `animate={{opacity:1}}` overwrites a style-prop opacity on the same element (the /work row dim). `--color-border` **does not exist** — hairlines are `--hair`, `--hair-hi`, `--hair-d`, `--hair-d-hi`. `ReadFill` must not set `margin` inline or callers can't offset it via a class. `type-eyebrow` uppercases, so case-sensitive text assertions on it fail.

---

## 6. DATA FACTS

### Tints (additive `tint`, ambient only)

| Study | Tint | Source |
|---|---|---|
| CG Walls & Floors | `#9E4139` | data says "copper accent"; hex sampled from `cgwalls/hero.jpg` (hue 0–12°, corroborated by `testimonials.jpg`) |
| CapitalCommand | `#87B6EB` | sampled from `01-overview.jpg` (hue 216°, corroborated by `05-signal-desk.jpg`) |
| SIFT | `#F2A93C` | **stated in the data twice** — "sodium amber (#F2A93C) as the primary accent" |
| CadenceStack | `#447ED2` | sampled from `01-command-center.jpg` (hue 216°) |
| CareerClarity AI | — | draft; the film uses a neutral `#8A8377` light |

CapitalCommand and CadenceStack share hue 216° — approved, both products are genuinely blue.

### Figures / statuses

| Study | `headlineFigure` | Status tail | Year | Sector | Pillars |
|---|---|---|---|---|---|
| CG Walls | **85%** — "Reduction in manual outreach hours" | ongoing | 2025 | Home renovation, GTA | Design/Automate/Grow |
| CapitalCommand | *(none)* → shows "Internal alpha" | internal alpha | 2026 | Fintech — portfolio intelligence | Design/Automate |
| SIFT | **42%** — "ATS-score improvement average after AI resume rewrite" | ongoing | 2025 | SaaS — job search | Design/Automate |
| CadenceStack | *(none)* → shows "Ongoing" | ongoing | 2025 | SaaS — LinkedIn presence | Design/Automate/Grow |
| CareerClarity AI | *(none)* | — | — | AI for education | Automate |

Home's ledger: **85% / 3.2× / 42% / 40+ / 15× / 1.4s** (CG, CareerClarity, SIFT, then three Averr Studio figures). `ProofLedger` reads CG's and SIFT's from `caseStudies.ts` via `fromData()`; the other four are literals.

### /work film order + cyclic finale

Film order = `vault` (live first, data order): **CG Walls → CapitalCommand → SIFT → CadenceStack → CareerClarity AI** (last, not a link).
Finale cycle (live only): **CG → CapitalCommand → SIFT → CadenceStack → CG**.
Film slide = each study's `heroImage`, which **equals its case-hero front image**, so the open-transition lands on the same screen.

### `src/data/servicePillars.ts`

`PILLAR_TIMELINE` = Design `"2 – 3 weeks"` · Automate `"1 – 2 weeks"` · Grow `"Ongoing"` (read by /services **and** home's doors).
`GROW_METRICS` = Impressions 48.2K +42% · Engagement 6.8% +18% · CTR 3.4% +24% · Sessions 12.1K +36%. **Sample figures — every surface rendering them must show `ILLUSTRATIVE_LABEL` ("Illustrative").**

### `src/data/caseSections.ts`

`context` 01 · `approach` 02 · `inventory` 03 (id `built`, label "what we built") · `signatures` 04 ("signature moments") · `outcome` 05 · `next` 06. The rail labels itself from these, so it can never drift from the page.

### Additive text data (all verified verbatim / word-sourced)

- **`contextEmphasis[]`** (11 phrases), e.g. CG ¶2 `"no ad budget, no headcount, no time to burn"`, SIFT ¶3 `"craft, not volume"`.
- **`outcome.emphasis`** (4), e.g. SIFT `"Source → score → tailor → apply → track"`.
- **`inventoryLabels[]`** (28 labels, each ≤6 words and built only from its own item's words).
- **`approach[].emphasis`** (10), e.g. CadenceStack Design `"a product system, not a prompt box"`.
- **`signatures[].focal`** — 9 focal points, e.g. SIFT sync-engine `{x:0.52, y:0.58}`.

---

## 7. OPEN ITEMS (owner actions — Prachets)

1. **Number truth check.** CareerClarity AI's **3.2×** opens the home ledger while CareerClarity itself is a draft with no case study; and the three Averr Studio figures (**40+ sites, 15× AI agents/workflows, 1.4s Core Web Vitals**) have never been audited in-session. Confirm each is defensible or replace it.
2. **Founder photo for /about** — Session 18 ("proof of a person") is blocked without it.
3. **A /contact recording** — Session 19 is blocked; /contact has never been reviewed against a recording.
4. **Iubenda + legal pages** — the footer links `/privacy`, `/cookies`, `/terms`; confirm these resolve.
5. **`RESEND_API_KEY` on Vercel** — the contact form cannot deliver without it.
6. **Contact-form budget bands** — Under $5K / $5K–$10K / $10K–$25K / $25K+. Deliberately kept under the no-prices rule; confirm the bands.
7. **`og-image.svg` → PNG** — several platforms won't render SVG OG images.
8. **"sales at Google" wording on /about** — flagged earlier, never resolved.
9. **Full mobile review** — automated checks confirm zero overflow, but no human pass has been done on a real device. The Session 17 stacked stills are no longer a concern here: **Prachets ruled the ~6px Automate labels a defect, and 17-fix-2 replaced that still below 900px with a purpose-built vertical composition** — five nodes on a straight vertical path, every label at real `type-eyebrow` size. Design and Grow still scale, and both were checked as readable at 375.
10. ~~**`/work`'s LCP image.**~~ **APPROVED and DONE in 19-pre-2.** Prachets ruled that resized derivatives of existing screenshots are not new assets, so rule 11 does not apply. `/work` is 2320 ms.
11. **Prerendering the shell — deferred to the Ship pass by Prachets.** First contentful paint is 1.64–1.86 s on every route because nothing paints until 152 kB of JS downloads and React mounts. Static-rendering each route's hero into its HTML would put LCP near first byte. Build-pipeline decision, not a page change.
12. **The `?simulateBooking=<ISO>` harness is reachable in production.** It sets component state so the pass shows the CONFIRMED face — no request, no storage, nothing server-side, and it affects only the browser that types it. It exists because the flip had to be verified on the alias, where a dev-only build flag does not apply. **Say the word and it becomes dev-only, at the cost of never verifying the confirmed state on a deployment again.**
13. **Weekend bookability now depends on the Cal.com availability schedule.** The pass offers Saturday and Sunday, and both showed slots when checked — but if the schedule is ever narrowed to weekdays, the page will offer a day the booking page refuses. **Keep weekend availability on, or tell me to grey weekends out again.**
14. **The holiday table ends after 2027.** `businessDays.ts` covers 2026–2027; past that the proposal count silently degrades to weekends only. `holidayCoverageEndsAfter` exists so a future session can assert on it.
15. **Six /services screens are still over the ~15% blank target** (largest flat rectangle as a share of the window, measured at 1680 / 1440): **Reporting 28.8 / 30**, **Brand & design direction 24.2 / 24.2**, **Human review built in 21.9 / 12.2**, **Paid ads 20 / 22.5**, **Product & SaaS interfaces 18.8 / 18.8**, **Design systems 18.3 / 18.3**, **Landing pages 16.4 / 16.4**. Type and legibility are met everywhere (base 13px, min 11px); these are composition density only. Each needs the same treatment the other eight got — content that reaches the bottom of the window, or panes that stretch rather than sit at their natural height.
16. **A second, larger WebP rung is fetched on some case-study loads** — `01-command-overview-1280.webp` *and* `-1680.webp` on `/work/sift`, about 32 kB wasted. Seen in two probes, **not reproducible in a third, and I did not identify which element re-selects.** Both are lazy and land after LCP, so it costs bytes, not a metric. Worth one instrumented pass next time something touches that page.
17. **`/work/sift` carries 0.009 CLS** from the hero meta grid moving 27 px at ~3.1 s — almost certainly the Inter swap relaying the one subhead long enough to change line count, despite the metric-matched fallback. Inside "good" and the route passes; left alone deliberately rather than chased.
18. **Cleanup (safe, unowned):** `src/components/case-study/ScrollProgress.tsx` is now orphaned (no importers). `heroImages[1..2]` are dead data. `src/legacy/components-v1/**` is unreachable and still contains old price strings.
19. ~~**"System average: 12h/week returned"**~~ — **RESOLVED in Session 17.** This unsourced result claim sat unlabelled in the Automate ambient. Prachets ruled: cut entirely, nothing in its place. The illustrative task chips that replaced the space carry an ILLUSTRATIVE label.
20. ~~**Commit-message convention.**~~ **CLOSED — Prachets ruled in 17-fix: standing rule 18 wins, always.** Commit + push per verified item. The `Commit:` line at the foot of a brief is the **summary for the final report**, not a single commit message to squash onto. See §4.18.

---

## 8. ROADMAP REMAINING

- ~~**Session 17 — /services.**~~ **DONE** (`08965f2` … `4642136`). It now has its own signature mechanic — the 14-day kickoff calendar — plus a live illustrative pipeline, a struck "no" list and its own closer. See §2 and §3.
- ~~**Session 17 — /services.**~~ **COMPLETE** (17 → 17c-5). The page is the build scene; see §3.
- **Session 18 — /about ("proof of a person").** Interactive principle track, PU monogram → founder photo transition, drawn process line. **Needs the photo.**
- ~~**Session 19-pre — site-wide LCP.**~~ **DONE** (`f47c12d` … `341a231`).
- ~~**Session 19-pre-2 — Prachets's four rulings.**~~ **DONE** (`e521774` … `895313d`). **All eleven routes under 2.5 s.** See §2.
- ~~**Session 17g — guided conversation + in-page booking.**~~ **DONE** (`267c248` … `b51fa7d`). The call is 30 minutes site-wide, the name field is unmissable, the date control is obvious, booking happens in a modal and the pass flips to CONFIRMED. **One owner item — §7.13 (weekend availability).**
- ~~**Session 17f — "Your project start pass".**~~ **DONE** (`b6ea58f` … `231f1f2`). Weekends bookable, Ontario stat holidays in the business-day count, kickoff clipping fixed.
- ~~**Session 17e — /services kickoff section.**~~ **DONE** (`aae26c8` … `ccd4c1f`). The 14-day calendar is an interactive personal timeline; `KickoffCalendar` removed.
- ~~**Session 17d — /services quality + two site-wide fixes.**~~ **DONE** (`608a0c6` … `d925553`). Captions, spotlight, density, nav CTA, ledger, hero CTAs. **Six screens remain over the blank target — §7.12.**
- **Session 19 — /contact.** After the recording.
- **Session 20 — site-wide.** Page transitions using the slab wipe, footer redesign, home polish (richer door previews, reel hover, 404 pill).
- **Ship pass.** **Now also carries prerendering** (§7.11): FCP is pinned at ~1.7 s by SPA boot on every route, and static-rendering the hero is the only lever left on it. The ship-pass amendments: **BLOCKED-ON-PRACHETS gates**, the TBT lab proxy, flag-don't-fix copy, exactly one test submission, Cal.com load-only, og-image.

---

## 9. RATINGS HISTORY (Prachets's own scores)

| Surface | Trajectory |
|---|---|
| Home | **2 → 4–5 → 6** |
| Case studies | **2 → 4–5** |
| /services | **4** |
| /about | **4** |
| **Target** | **9/10 everywhere** |

Read these as the reason for the "one signature mechanic per page" and "the takeover is the floor" rules. Incremental polish has not moved these numbers; structural rebuilds have.

---

## 10. HOW TO START THE NEXT SESSION

Paste this as the first message of a fresh session:

```
Read docs/AVERR-V2-HANDOFF-V3.md in /Users/prachetsupadhyay/Developer/averr-site
before doing anything. It is your only memory of this project — the repo,
branch, HEAD, every locked rule, every technical gotcha, and the data facts.

Then confirm back to me, in a few lines:
  - HEAD hash + branch, and that it matches git log
  - the last verified bundle size
  - the three locked rules you think are most likely to be violated by the
    work I'm about to describe
  - anything in the handoff that no longer matches the code

Do not start building until I paste the session brief.
```

Then paste the session brief. A brief normally carries: PRE-FLIGHT (report before writing), numbered items, the ASSET RULE, the verification protocol, and the commit message.

### What to do first, mechanically

```bash
cd /Users/prachetsupadhyay/Developer/averr-site
git log --oneline -5          # confirm HEAD
git status                    # expect clean
npm run build                 # unfiltered; expect exit 0
```

Verify against the alias, not localhost, for anything you report as done:
`https://averr-git-redesign-v2-prachets-upadhyay-s-projects.vercel.app`

### The shape of a good session here

Pre-flight and report **before** writing. Build → commit → push per verified item. Poll the alias for your bundle hash before sweeping. Take screenshots **and look at them**. Report probe errors as your own. Flag deviations rather than absorbing them — every session so far has surfaced at least one thing the spec assumed that the code did not support, and saying so early has been more useful than working around it silently.
