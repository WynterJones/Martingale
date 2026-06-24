# UI/UX Design Rules

A portable rulebook for building polished, production-grade web interfaces.
Project-agnostic — use it in any codebase. Each rule is a thing to **do** or
to **avoid**, with the failure mode it prevents.

**Core principle:** the interface should read as a finished product, not a
draft. Every screen passes a glance test (clear hierarchy, nothing broken)
and a use test (you can imagine actually using it). Consistency is enforced
*within* a product; distinct products are allowed distinct identities.

**Purpose-built screens.** Each screen is a *working demo of one screen
doing its real job*, not a page describing the product:

- **One core job, centered.** Name the single thing the screen exists to do
  and make it the visual focus; everything else is supporting chrome. Avoid
  generic dashboards that could belong to any product.
- **An obvious, wired main action.** Each screen has one dominant primary
  button (the job's verb) that *does something on click* — opens a modal or
  flow, never a dead button. Secondary actions look secondary. One primary
  per zone.
- **Show, don't tell.** Demonstrate the UI; don't narrate it. Prefer real
  components (tables, cards, stats, charts, label/value rows) over running
  text. No paragraph walls where a component belongs.
- **Built for every screen size.** Design the layout at each breakpoint, not
  a desktop layout that happens to shrink. The core job and its main action
  still lead on mobile.

---

## 0. Entertainment-grade polish (LP-Templates house style)

These landing pages are not utilitarian app screens — they are **premium,
graphics-heavy marketing experiences** that must look expensive and "pop." The
rules below sit *on top of* the rubric in the rest of this file. (See
`skills/entertainment-designer/SKILL.md` for the how; this is the what.)

- **Graphics-led, low text.** The page is a gallery, not an essay. One promise
  per section, big visuals, one clear CTA per zone — never paragraph walls.
- **Large accent graphics.** Oversized hero props, gradient orbs/blobs, 3D
  shapes, mascots, cut-out characters, floating chips — generated, placed big and
  bold, layered for depth with parallax. Accent graphics do real design work.
- **Layer every section (≥3 graphic layers).** Flat text-on-a-fill is the #1 cheap
  tell. Each hero/feature band stacks: background scene/video → scrim → ambient
  (particles/orbs/glow) + an accent cutout bleeding off an edge → headline graphic
  + short copy + CTA. Plus global grain, layered soft shadows, coloured glows.
- **Bold & low-text — text crowds out graphics.** One promise per section: an
  optional eyebrow + a ≤7-word headline + ≤1 short line. When a section feels
  cramped, cut copy, don't shrink the art.
- **Build in iterative passes.** Structure & assets → review → add a layer of
  depth/motion to every flat section → re-review. Don't one-shot the polish.
- **Vary the layout per niche.** Cinematic, bento/UI, split, editorial, card,
  giveaway, VSL/squeeze — pick an archetype that differs from sibling templates.
  Two templates must not feel like one skeleton recolored.
- **Juicy headline graphics.** Every template ships a hero headline graphic (a
  designed treatment CSS can't match — gradient/3D/chrome/foil typography, big and
  bold) AND 1–3 more for key section headers — lifted with `drop-shadow` + glow +
  a touch of float/wiggle. Keep an accessible `<h1>`/`<h2>` (visually-hidden if the
  headline is an image).
- **Buttons: ONE image CTA, CSS for the rest.** Exactly one art-directed,
  generated image button for the primary CTA (reused for the final CTA if
  wanted); every other button is a premium CSS button (gradient fill, inset
  highlight, colored glow, hover lift). Don't image-ify every button.
- **All iconography is generated image assets** (icons, checks, arrows, play
  badges, seals, stars). **No emojis. No hand-authored or invented SVG icon
  art.** CSS is for layout primitives only (gradients, rings, lines, blur, masks).
- **Transparency via fal background removal** (BiRefNet), never colour-keying —
  clean alpha edges on every cutout.
- **Video = variety, not wallpaper.** A signature loop + vertical-video cards +
  small animated accents — don't background-video every section. Always muted/
  loop/playsinline with a poster; lazy-load below-the-fold. **Modal/popup videos
  embed a real YouTube video**, never a generated clip.
- **A mascot or host** when it fits the brand — large and recurring.
- **Real motion polish, in passes.** Scroll reveals, multi-speed parallax,
  particle/orb fields, glow pulses, count-ups, marquees, 3D tilt, micro-
  interactions. Vanilla JS + curated libraries are both fine (GSAP/ScrollTrigger,
  Lenis, SplitType, Swiper, tsParticles). Animate transform/opacity only (60fps).
- **Modern CSS effects** are encouraged: `mask-image`/`clip-path` for image &
  video masks, `mix-blend-mode` glow, `backdrop-filter` glass, native
  scroll-driven animations, `background-clip:text` gradient headlines, oversized
  bleeding images, `aspect-ratio` (no layout shift).
- **No orphan words** in any headline/subhead (`text-wrap:balance`, `&nbsp;` on
  trailing short phrases); re-check at every breakpoint.
- **Always honor `prefers-reduced-motion`** and keep AA contrast over busy media
  (use scrims/overlays). The non-negotiables in the checklist below still apply.

---

## 1. Layout & structure

- **Nothing cut off.** No content trailing past the right edge, no text
  bleeding out of a card, no element overlapping another. Open at the
  target widths and look at every edge.
- **No accidental horizontal scroll.** If the page scrolls sideways, a
  track grew past the viewport. Usual cause: a grid `1fr` track holding
  unbounded content (a `<pre>`, wide `<table>`, long URL, fixed-`viewBox`
  SVG). Use `minmax(0, 1fr)` for every flexible grid track — in the base
  rule *and* every media-query override — so it can shrink below intrinsic
  content width. Pair with `overflow-x: auto` on the scrollable child.
  - Repro: at the narrowest target width, compare
    `document.documentElement.scrollWidth` to `window.innerWidth`. If
    scrollWidth is larger, a track grew.
- **Full-viewport apps fit the viewport.** For a single-screen workspace
  (dashboard, inbox, editor) that should not page-scroll: `body { height:
  100vh; overflow: hidden }`, fixed-height top chrome, main area `flex: 1;
  min-height: 0` (or `calc(100vh - <chrome>)`), and `overflow-y: auto` on
  the individual panels that scroll. A stray right-edge gutter means the
  page is over-spilling its height — switch to viewport-locked layout.
  Content that genuinely exceeds the viewport (long article, settings) is
  a *scrolling* page instead — use `min-height: 100vh` and accept it.
- **Adjacent zones must be visually distinct.** Stacked horizontal bands
  (topbar → sub-header → filter strip → content) each need a background
  shift, a hairline border, or both — never zero. Two adjacent zones with
  the same background and no border are the same zone, which means the
  structure is wrong.
- **No empty containers.** A panel titled "Recent activity" with nothing
  in it reads as broken. Show real (plausible) content or an empty state.
- **No orphaned fixed panels.** No `position: fixed` overlay covering
  content with no way to close it.

---

## 2. Color & contrast

- **Body text meets WCAG AA** (≥ 4.5:1 against its background). Muted /
  secondary text stays ≥ 3.5:1 — never lower.
- **No light-on-light.** Never set headings or eyebrow labels in ~30%-black
  or low-alpha tints. Faint eyebrow text ("SECTION · v14") looks refined in
  a mockup and fails at runtime — lift it to a real dark ink value.
- **Headings on tinted/gradient panels** get an explicit `color` chosen
  against the gradient's mid-tone, not just its brightest stop.
- **Button labels contrast their fill (≥ 4.5:1) — check every variant.** A
  label must read against the button's *actual* fill, not the page: white
  text on a pale/gold/yellow/mint fill, dark text on a deep fill, or a label
  that sits over the lighter stop of a gradient all fail. Verify primary,
  ghost, hover, and disabled states — a ghost button's text often inherits a
  page color that vanishes on the button's hover background. Gold/amber and
  pastel fills almost always need **dark** ink, not white.
- **Image/AI CTA buttons: eyeball the baked-in label too.** A generated
  button (embossed/engraved/foil lettering) must stay legible against its own
  material — gold-on-gold, white-on-cream, or a soft emboss with no tonal
  break is unreadable. If the label doesn't pop at button size, regenerate
  with a deeper recess/darker engraving or add a tonal contrast, and confirm
  the `alt` matches the visible words.
- **Card & tile text contrasts the card surface, not the section.** Text on a
  tinted, glass, or gradient card is judged against the *card*; a muted token
  tuned for the page background can fail on a darker/lighter card. Re-check
  body, meta, eyebrows, and icon labels on every card surface.
- **Text over photos, video, or busy art needs a scrim.** Lay a gradient/solid
  overlay (or text-shadow as a backup) so headings and body clear AA over the
  *brightest* region the media can show — not just the frame you previewed.
- **Logos & wordmarks must read on light *and* dark.** A brand mark or CSS
  wordmark used in both a dark nav and a light footer needs a fill that holds
  on both, or a per-context variant. A gold/white mark disappears on cream; a
  dark mark disappears on the hero. Don't ship a logo that's invisible in half
  its placements.
- **Numbers/text overlaid on badges & seals contrast the medallion.** A count
  or label dropped onto a gold seal or colored badge uses dark ink on gold,
  light ink on a deep badge — never same-tone-on-same-tone.
- **Gradients are single-hue only.** One hue, two lightness/saturation
  stops. Never blend two different hues (no blue→purple, mint→amber,
  purple→pink). Picking a color means picking *one* color; the gradient
  adds texture, not a second identity. Avatar fallbacks, hero washes, and
  card covers all follow this — solid accent or tonal single-hue gradient.

---

## 3. Typography

- **Breathing room in text stacks.** A title + subtitle/meta stack needs
  air between rows (a flex `gap`, or title `margin-bottom`). Title
  line-height tight (1.15–1.2); subhead relaxed (1.4–1.5) — don't reuse the
  title's tight line-height on the subhead. Dense identity meta (4+ items)
  uses `flex-wrap: wrap; gap: 4px 10px` instead of cramming one line.
- **No orphans or widows.** No heading, body line, caption, stat subline,
  or meta string ending with a lone word on its own line. Fixes in order:
  rewrite tighter → `text-wrap: balance` (headings) / `text-wrap: pretty`
  (body) → `&nbsp;` between the last 2–3 words so the phrase wraps as a
  unit (`track&nbsp;at&nbsp;risk`). Any trailing short noun phrase ("at
  risk", "in progress", "on track") gets `&nbsp;`.
- **Monospace is for data, not chrome.** Reserve mono for code, identifiers
  (`INC-003`, `ctr_8f4a2`), and tabular numerics. Do **not** set section
  titles, page headings, or card labels in mono — unless the product's
  whole identity is a developer/terminal tool where mono is a deliberate
  brand choice. Default eyebrows to the body sans family.
- **Body copy over ~3 lines on desktop is a redesign signal** — split into
  a list, move into a disclosure, or widen the surface.

---

## 4. Buttons, badges & controls

- **A button looks like a button.** Visible chrome — fill, border, or
  background tint; never zero. Bare text with no chrome is a link, not a
  button; if it's a secondary action use a ghost button with a hover bg.
- **Labels centered.** `justify-content: center`. A full-width primary
  with a left-hugging label ("Approve $8,000") reads as broken.
- **Same-row controls share dimensions.** Buttons beside buttons, or an
  input beside a button, share `height`, `border-radius`, and vertical
  padding; center them with `align-items: center` on the row. Don't ship an
  11px-padded primary next to a 7px-padded ghost in the same group.
- **Two-option stacks are two buttons.** A secondary action below a primary
  stays a (ghost/outline) button — it doesn't drop to plain text.
- **Labels fit on one line.** `white-space: nowrap`. If a label is too long
  for a tight row, shorten it, go icon-only with an `aria-label`, or drop
  the button to its own row at narrow widths. Hit area ≥ 32px tall.
- **Badges never wrap mid-word.** `white-space: nowrap` baseline; truncate
  or restack long ones.
- **Hero CTAs stay content-width on mobile** — centered, not edge-to-edge
  (full-width reads as a form submit). In-app form buttons ("Save",
  "Submit") *may* be full-width — that's a different context.

---

## 5. Forms

- **Reuse one field component.** Side-by-side inputs in a grid align on the
  same top edge; misalignment by even 2–4px reads as broken. Use
  `align-items: start` on the grid and `.field { display: flex;
  flex-direction: column; gap: 6px }` so inputs anchor by content order,
  not stretch. Same `.input` class (same border/padding) on every field.
- **Stack labels when the column is narrow** (< ~640px). Long uppercase
  labels must never wrap — `white-space: nowrap`, or widen the label column
  with `grid-template-columns: max-content 1fr`.
- **Textareas auto-grow.** Start at `min-height: 84–120px`; grow on input
  (`el.style.height = 'auto'; el.style.height = Math.min(el.scrollHeight,
  MAX) + 'px'`) up to a max, then scroll internally with a themed scrollbar.
- **Visible focus rings on every input** — `:focus { outline: 2px solid
  <accent>; outline-offset: 2px }` or an accent box-shadow ring.
- **Disabled states:** ~50% opacity + `cursor: not-allowed`.

---

## 6. Tables

- **Scannable, ≤ 6 visible columns.** More than that → push extras into a
  detail panel or a card list. No nested tables; no row-spanning headers
  unless unavoidable.
- **Visible outer border.** The frame must stand out against the page bg —
  a hairline in the same shade as the background disappears and the table
  reads as data floating in space. Use the stronger rule token for the
  outer frame; give the header row a tinted bg + a stronger bottom border.
  A borderless table is only acceptable on a tinted card surface that
  itself has a visible border.
- **Numbers right-aligned**, `font-variant-numeric: tabular-nums`.
- **Status as pills**, not full sentences.
- **Truncate long cell strings** (names, emails) with `white-space: nowrap;
  overflow: hidden; text-overflow: ellipsis` + a column `max-width`; never
  wrap mid-string. Headers stay one line (abbreviate if needed).
- **Collapse on mobile.** Don't ship the desktop `<table>` to 360px.
  Either re-layout rows as cards (`table { display: block }`, each `tr` a
  card with label/value pairs) or hide non-essential columns. Keep
  title + status + one metric; drop "edited 7m ago by …" trivia.

---

## 7. Structured data

- **Label/value pairs use a definition list, not a paragraph blob.** Intake
  summaries, audit entries, order details, contact cards → `dl { display:
  grid; grid-template-columns: max-content 1fr; gap: 8px 16px }` with `dt`
  as a muted micro-label and `dd` as the body. Stack to one column under
  ~480px. Never run multiple `label: value` pairs into one sentence. If the
  intent is a genuine written note, use real prose — don't fake structure
  with colons.

---

## 8. Footers

- **At most one footer per page. Never two.** A duplicated/stacked footer
  (two copyright lines, two Terms/Privacy rows) is always a bug — most
  often an injected "legal footer" added on top of a page that already had
  one. If a page already has a footer, do not add another; remove the
  redundant one.
- **A real page footer carries:** `© <year> <product>`, Terms, Privacy
  (optionally Status / Support / Changelog / version). Small (12–13px),
  quiet (muted color), `flex-wrap: wrap; gap: 12px`, links promote to
  ink/brand on hover. It should never compete with content.
- **Placement:** marketing/landing → a dedicated bottom `<footer>` band
  with a hairline top border; app with a sidebar → small attribution
  pinned at the sidebar bottom (`mt-auto`); single-column app → a small
  centered footer below content.
- **Style-reference / styleguide pages have NO footer.** A design-system or
  component-reference page documents tokens and components — it is not a
  product page and must not carry copyright/legal footer chrome.
- A functional bottom bar (form Back/Next, an editor toolbar, a message
  composer, a media transport, a bottom-sheet action row) is **not** a
  footer — it doesn't count against the one-footer rule and shouldn't be
  removed.

---

## 9. Icons & imagery

- **Left icon size matches the text block it pairs with.** Single-line row:
  icon ≈ 1.4× line-height. Two-line title+subhead block: 40–48px square/
  circle. Three-line block: 48–56px. Use `align-items: flex-start` for
  multi-line text so the icon optical-aligns to the headline cap-height;
  `align-items: center` only for single-line rows. Don't pair a tiny icon
  with a tall text block.
- **Placeholder imagery** = solid color blocks or simple single-hue CSS
  gradients (label with a faint caption if helpful), not stock photos.

---

## 10. Responsive

- **Design for 360 / 768 / 1280** (phone / tablet / desktop). Standard
  breakpoints: `@media (max-width: 768px)` (tablet down), `@media
  (max-width: 480px)` (phone). Common collapses: multi-column grid → single
  column; right-rail metadata → below main; wide tables → cards.
- **Real mobile nav, not wrapped tabs.** A tab/nav bar that wraps to two
  lines is not a mobile nav. At ≤ 768px hide the desktop nav and show a
  hamburger that opens a real drawer (full-height overlay, same items at
  44px tap targets, active state, × close + click-outside-to-close, same
  brand at top). Apply it to **every** page, not just the index.
- **Collapse sidebars / facet panels into a toggle on mobile.** Hide the
  inline sidebar at ≤ 768px; surface a "Filters" button that opens a drawer
  with the full contents (selected-count badge, Apply + Clear all). Same
  for large secondary panels — collapse to a one-line summary that expands
  on tap. Never answer "the user can scroll" — make them tap to choose.
- **No text walls on mobile.** A section over ~4 lines of copy, or a data
  row wrapping to ≥ 3 lines, gets redesigned: truncate long breadcrumb
  chains to the last 2 segments, re-architect wide data rows as cards,
  split marketing blocks into bullets/disclosures. If you can't read it in
  3 seconds on a phone, it isn't done.

---

## 11. Motion & micro-interactions

Motion is felt, not noticed — it confirms an action and softens a
transition. Never animate *at* the user.

- **Buttons:** `:active { transform: translateY(1px) }` (80ms); hover bg/
  border shift (120ms).
- **Cards/rows:** hover = 1–2px border shift (60ms); inserted items fade-up
  ~200ms.
- **Modals:** backdrop fade 180ms; card fade + 8px translateY rise 200ms
  ease-out; close 150ms ease-in. Never bounce/spring.
- **Toasts:** slide in 220ms, hold ~3s, fade out 200ms.
- **Respect `prefers-reduced-motion: reduce`** — keep opacity/press
  feedback, drop translates and shimmers. Avoid scroll-tied animation,
  hover scale (1.05×) on cards, and forever-marquees.

---

## 12. Highlights & active states

- **Active/selected/focus rings float, not hug.** `outline-offset: 3–4px`
  (1–2px reads as a border); `outline-width: 2px` selected, 2–3px keyboard
  focus. The container needs padding that accommodates the offset, or the
  ring clips the next sibling.
- **Avoid neighbor encroachment:** widen the parent gap to at least
  `offset + width + 4px`, or use an `inset` box-shadow ring (lives inside
  the box) / a soft halo glow instead of a crisp outline.
- **One signal per state.** If active uses a ring, it doesn't *also* bold,
  scale, or recolor — two signals on one affordance reads as a defect.

---

## 13. Interactivity & UX

- **Open modals on interaction, never on load.** Wire real actions to real
  modals — destructive ("Delete" → confirm with item name + warning),
  costly ("Run" → cost preview), commit ("Save" → what's going live).
  Esc closes, click-outside closes, × closes. Card-based surfaces (kanban,
  inbox, queue) wire the card itself to a detail modal with a clear hover
  affordance.
- **Semantics:** `<button type="button">` for any non-link interactive
  element — never `<div onclick>`. `cursor: pointer` on clickable things,
  default cursor on text.
- **Vanilla JS is enough** for dropdowns, tabs, modals, drawers — no heavy
  framework for interface chrome.

---

## 14. CSS robustness

- **Base `display` declarations precede their `@media` overrides.** If
  `.nav-toggle { display: none }` appears in source *after* a media query
  that flips it to `inline-flex`, the later equal-specificity rule wins and
  the toggle never appears. Put base rules before the media blocks that
  target them (or, last resort, `!important` in the query).
- **Selectors survive markup refactors.** Long descendant chains
  (`.header h1`) silently stop matching when you introduce wrapper layers.
  Prefer a leaf class on the element (`<h1 class="page-h1">`) so structural
  changes don't break styling.
- **Theme the scrollbars** on any designed scroll surface — never leave the
  OS default:
  ```css
  ::-webkit-scrollbar { width: 10px; height: 10px; }
  ::-webkit-scrollbar-track { background: var(--track); }
  ::-webkit-scrollbar-thumb { background: var(--thumb); border-radius: 999px; border: 2px solid var(--track); }
  ::-webkit-scrollbar-thumb:hover { background: var(--thumb-strong); }
  * { scrollbar-width: thin; scrollbar-color: var(--thumb) var(--track); }
  ```
- **`white-space: pre-wrap` belongs on the leaf**, not a wrapper — on a
  wrapper it renders the source newlines between markup as visible gaps.

---

## 15. Consistency within a product

- **One brand mark + product name** on every screen.
- **One nav pattern, used everywhere** — pick top-nav *or* sidebar *or*
  single-page-no-nav and commit. Don't ship one screen with a sidebar and
  its sibling with a top-nav. Active state changes per page; the items
  don't. (Data-dense/admin tools default to sidebar; consumer/marketing/
  forms default to top-nav.)
- **Shared tokens** — same radius, shadow, and spacing scale across screens.
- **Real, plausible content** — no Lorem ipsum, no "Click here", no
  "Lorem"-grade placeholder data.

---

## 16. Pre-flight checklist

Run before shipping a screen. Fast.

- [ ] `<!doctype>`, `<meta charset>`, `<meta viewport>`, real `<title>`
- [ ] Nothing cut off / overlapping / empty; no sideways page scroll
- [ ] Body text passes AA; no light-on-light eyebrows or headings
- [ ] All gradients single-hue
- [ ] Every button label passes AA on its own fill (primary/ghost/hover/disabled); image-CTA baked-in label legible at size; gold/pastel fills use dark ink
- [ ] Card/tile text contrasts the card surface; text over photos/video has a scrim
- [ ] Logo/wordmark + any badge/seal overlay text read on both light and dark placements
- [ ] Buttons look like buttons (chrome + centered label); same-row controls share height
- [ ] Labels fit one line; badges `nowrap`
- [ ] Inputs aligned; labels stack when narrow; textareas auto-grow; visible focus rings
- [ ] Tables ≤ 6 cols, visible outer border, tabular nums, status pills; collapse to cards on mobile
- [ ] Structured data as `<dl>` rows, not paragraph blobs
- [ ] **Exactly one footer (or none) — never duplicated; style-reference pages have no footer**
- [ ] Footer (where present): © + Terms + Privacy, small and quiet
- [ ] Icons sized to the text block; multi-line uses `align-items: flex-start`
- [ ] No orphan words in headings/subtext at 360/768/1280; mono only for code/data
- [ ] Sensible layout at 360 / 768 / 1280
- [ ] Real mobile hamburger drawer (working JS), not wrapped tabs
- [ ] Sidebars/facets collapse to a Filters toggle on mobile
- [ ] No mobile text walls; long breadcrumbs/data rows redesigned
- [ ] Press affordance + hover transitions; honors reduced-motion
- [ ] Active rings have ≥ 3px offset + container padding; one signal per state
- [ ] Modals open on click (not load); Esc / click-outside / × all close
- [ ] `<button type="button">` (not `<div onclick>`); pointer cursor on clickables
- [ ] Base `display` toggles declared before their `@media` overrides
- [ ] Grid flex tracks use `minmax(0, 1fr)`, not bare `1fr`, where a child can overflow
- [ ] Full-viewport apps fit `100vh` — no page scrollbar / right-edge gutter
- [ ] Themed scrollbars; no external JS libs for chrome
- [ ] Consistent brand mark + nav pattern + tokens across screens
