# AVERR STUDIOS v2 — HANDOFF V3

**Written:** 2026-09-29 · **Supersedes:** everything after Session 9 in `HANDOFF.md` / `REDESIGN-HANDOFF.md`
**Audience:** a fresh Claude Code session with no memory of this project. This file is your only memory. Read it all before touching anything.

> Note on naming: the sessions referred to a file called `AVERR-V2-MASTER-HANDOFF.md`. **No file by that name exists in the repo.** The pre-Session-9 documents are `HANDOFF.md` (root, dated July 2026), `REDESIGN-HANDOFF.md` (root), and `docs/00-master-reference.md` … `docs/03-build-status.md`. Those remain valid for project identity, brand, and pre-v2 history. **This file is authoritative for everything from Session 9-fix-c onward** and supersedes them on any conflict.

---

## 1. STATE

| | |
|---|---|
| **Repo** | `github.com/uprachets4/averr-site` |
| **Working branch** | `redesign-v2` (**108 commits ahead of `main`**) |
| **HEAD** | `ea20a63` — *"17-fix (2): log Session 17 and the stacked-ambient fix in the handoff"* |
| **Tip after this doc** | `ea20a63` is the tip; this doc is current as of it. |
| **Preview alias** | `https://averr-git-redesign-v2-prachets-upadhyay-s-projects.vercel.app` |
| **Production** | `averrstudios.com` responds **200**, and is served from **`main`** — i.e. **production is still the OLD site.** None of the v2 redesign has shipped to production. Promoting means merging `redesign-v2` → `main`. **Do not merge without Prachets saying so.** |
| **Local path** | `/Users/prachetsupadhyay/Developer/averr-site` |
| **Dev server** | already running on `http://localhost:5173` in most sessions. Never start dev servers with Bash — use the preview tooling, or just test against the alias. |

### Last verified bundle (build exit 0, unfiltered)

```
dist/assets/index-BpqLEds-.css   41.14 kB │ gzip:   8.64 kB
dist/assets/index-BD_1sY_e.js   662.69 kB │ gzip: 192.30 kB
```

Gate: **flag anything over +12 KB gzip JS in a single session.** Session 17 was the largest so far at **+3.63 KB gzip** (188.67 → 192.30) for five items plus the fix; before that, per-session deltas were all under +2 KB. The CSS has not moved in several sessions — the `type-*` system absorbs new work without new rules.

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

---

## 3. SITE MAP AS BUILT

### `/` — Home (`src/pages/Home.tsx`)

| Order | Component | Signature mechanic |
|---|---|---|
| 1 | `Hero` | **The "serious." takeover.** Split h1 at `display-2xl`; a slab pill on the word "serious." expands via scroll-linked `clip-path` from the measured pill rect into a full dark frame carrying a 4-case-study reel that pans. Publishes a nav-dark override. **This is the quality floor for every other page.** |
| 2 | `Chapter tone="cream" from="dark"` → `ThreeScenes` + `ThreeDoors` | Three unpinned scenes (template sameness → client specificity → full-bleed result); then three service doors with live hover previews clamped against both the name and the promise, Grow showing a mini dashboard labelled ILLUSTRATIVE |
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

### `/services` — the kickoff calendar (`src/pages/Services.tsx`)

Rebuilt in Session 17. Signature mechanic: **the 14-day calendar.**

| Order | Component | Signature mechanic |
|---|---|---|
| 1 | `ServicesHeader` | h1 `display-l` on one `CharReveal` stagger, "One studio" an accent segment bound with an NBSP; home's scroll cue |
| 2 | `PillarSequence` | Sticky-scroll Design / Automate / Grow, three stages each, ambient right column. Design = mood board at natural aspect, fanning ±6° on hover. Automate = node path with illustrative task chips looping it, nodes lighting on arrival. Grow = dashboard counting to its sample figures. Both Automate and Grow carry ILLUSTRATIVE. "What's included" assembles as chips. Rail meets the container edge at ≥1680. |
| 3 | `Chapter dark from cream` → `NoList` | Each refusal struck as you read, across a verbatim substring |
| 4 | `Chapter cream-warm from dark` → `KickoffCalendar` | **The signature.** 14 cells fill in order as the section scrolls past (normal flow, never pinned); each step card arrives as its own first day fills and spans exactly its day range, so a card's width is the length of the step. `WITHIN 14 DAYS · KICKOFF` at day 12. |
| 5 | `Chapter dark from cream-warm` → `ServicesCloser` | /services-specific. `useDeclarePageEndTone("dark")`. |

Below 900px — **and at any width under reduced motion** — `PillarSequence` renders `StackedPillar`, which shows each ambient as a scaled still via `StaticAmbient` (see §2, 17-fix). No `FinalCTA`, no `PillHl`.

Data: `src/data/servicePillars.ts` (timelines, Grow metrics), `src/data/servicesProcess.ts` (steps + day ranges, refusals + struck phrases, pipeline chip labels).

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
18. **Commit + push after each verified item**, so a usage limit mid-session loses nothing.
19. **Verification protocol:** build exit 0 → push → confirm remote hash matches local → wait for Vercel → poll the alias until it serves the new bundle hash → DOM sweep **on the alias** → screenshots → hand back the preview URL.
20. **Zero horizontal overflow at 375** on all routes, every session.
21. **Zero ViewTimeline/ScrollTimeline on sticky descendants**, every session.
22. **Bundle gate:** report the delta; flag anything over **+12 KB gzip JS**.
23. **Report your own probe errors.** Several "bugs" were bad measurements (the 234px sliver, a rotation inflating `getBoundingClientRect`, reading `strokeDashoffset` when motion animates `stroke-dasharray`, sampling a segment before its count-up finished). Re-probe before changing working code.

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

**23 · Misc, already fixed:** `.pill-hl > span` (0,1,1) beat `.pill-hl__slab` (0,1,0) and applied the text gradient → scope with `:not(.pill-hl--bare)`. `animate={{opacity:1}}` overwrites a style-prop opacity on the same element (the /work row dim). `--color-border` **does not exist** — hairlines are `--hair`, `--hair-hi`, `--hair-d`, `--hair-d-hi`. `ReadFill` must not set `margin` inline or callers can't offset it via a class. `type-eyebrow` uppercases, so case-sensitive text assertions on it fail.

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
9. **Full mobile review** — automated checks confirm zero overflow, but no human pass has been done on a real device. Session 17 added a new thing to look at here: the stacked pillar stills are scaled to ~0.45 at 375, so their internal labels sit near 6px. The compliance-critical ILLUSTRATIVE label was lifted out to full size, but the node names and chip labels inside the still are decorative-small by design — **worth a human eye on a real phone to confirm that reads as a thumbnail and not as a mistake.**
10. **Cleanup (safe, unowned):** `src/components/case-study/ScrollProgress.tsx` is now orphaned (no importers). `heroImages[1..2]` are dead data. `src/legacy/components-v1/**` is unreachable and still contains old price strings.
11. ~~**"System average: 12h/week returned"**~~ — **RESOLVED in Session 17.** This unsourced result claim sat unlabelled in the Automate ambient. Prachets ruled: cut entirely, nothing in its place. The illustrative task chips that replaced the space carry an ILLUSTRATIVE label.
12. **Commit-message convention.** Session 17's brief supplied one session-summary commit message; the work shipped as ten per-item commits instead, following standing rule 18 (commit + push after each verified item, so a usage limit loses nothing). The two conventions conflict — worth settling which wins before Session 18.

---

## 8. ROADMAP REMAINING

- ~~**Session 17 — /services.**~~ **DONE** (`08965f2` … `4642136`). It now has its own signature mechanic — the 14-day kickoff calendar — plus a live illustrative pipeline, a struck "no" list and its own closer. See §2 and §3.
- **Session 18 — /about ("proof of a person").** Interactive principle track, PU monogram → founder photo transition, drawn process line. **Needs the photo.**
- **Session 19 — /contact.** After the recording.
- **Session 20 — site-wide.** Page transitions using the slab wipe, footer redesign, home polish (richer door previews, reel hover, 404 pill).
- **Ship pass.** The ship-pass amendments: **BLOCKED-ON-PRACHETS gates**, the TBT lab proxy, flag-don't-fix copy, exactly one test submission, Cal.com load-only, og-image.

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
