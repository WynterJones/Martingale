---
name: landing-page-design-process
description: Build or polish premium graphic-heavy static HTML landing-page templates with a per-template AI brand identity. Use when creating LP-Templates pages, long-form sales letters, offer pages, static HTML funnels, image-rich CTA sections, AI-generated logo/icon/background/CTA assets, brand styleguides, favicon/icon/image assets, responsive landing pages, animation polish, or final QA for desktop, tablet, and mobile.
---

# Landing Page Design Process

Use this skill for LP-Templates work. The output should be a finished static HTML template folder with a cohesive AI-generated brand identity — not a marketing explanation of a template.

Every template is its own self-contained brand. The thing that makes a template
look premium and consistent is that the logo, icons, backgrounds, CTA buttons,
and headline graphics all share one visual identity. That identity is captured in
`brand/brand.json` as a **style signature** and prepended to every image prompt.

## Required Inputs

Confirm or infer:

- Product or offer
- Price and primary CTA
- Audience and pain points
- Desired persuasion style
- Template slug under `templates/`
- Visual direction (illustration vs photo, mood, palette) — feeds the brand

If details are missing, make conservative fictional assumptions and label them in the template copy only when legally or ethically needed.

Start from the scaffold: `cp -r templates/_blank templates/<slug>`.

## Step 0: Brief And Brand (do this first)

No page art is generated until the brand is locked. Read `tools/IMAGE_PIPELINE.md`
for engine names, the transparency workflow, and known issues.

- Fill in `brand/brand.json`: name, palette (real hexes), type, a fixed `seed`,
  and the single `styleSignature` sentence that anchors every image (medium,
  lighting, exact palette hexes, texture, mood; end with "No text, no words").
- Generate and post-process the brand assets:
  - `brand/logo.png` and `brand/logo-mark.png` (Gemini on solid white → `imgkit keyout`).
  - `brand/favicon.png` (`imgkit favicon` from the mark/logo).
  - `brand/style-board.webp` (one mood-board image → `imgkit webp`).
- Build `brand/styleguide.html` showing logo, palette, type, icons, scenes, and
  CTA together. Use `templates/fishing-course-local-lake/brand/styleguide.html`
  as the reference. Styleguide pages carry no footer.

Step 0 acceptance:

- `brand.json` has a real palette and a concrete style signature.
- Logo, mark, and favicon are true-transparent PNGs that read on light and dark.
- `styleguide.html` opens and every asset on it loads.

## Step 1: Mockup And Sales Architecture

Build the full page with all sections before visual polish.

- Create `index.html` and any initial `assets/` files.
- Write the sales page as a complete long-form argument: hook, problem, story, mechanism, proof-style elements, offer stack, bonuses, guarantee, FAQ, final CTA.
- Use persuasive direct-response copy inspired by classic funnel structure, without copying protected copy or naming a real marketer in public page text.
- Keep every CTA wired to a real target section such as `#order`.
- Include realistic placeholder proof, testimonials, and stats only if the fictional nature is clear in metadata/comments or the template context.
- Design sections for 360px, 768px, and 1280px from the start.
- Declare a slot in `assets/prompts/manifest.json` for **every** image the page
  needs (hero, panels, icons, CTA textures) — id, type, subjectPrompt, post step,
  output path. The HTML can reference these paths before the files exist.
- Derive `assets/styles.css` colors from `brand.json` so the palette is one source
  of truth.

Step 1 acceptance:

- The whole page reads in order.
- No lorem ipsum remains.
- Every section has a purpose.
- The main CTA exists in the hero, middle, offer stack, and final section.
- The manifest lists every image the page references.
- A **hero headline graphic** is in the manifest, plus 1–3 section headline graphics.
- Copy obeys the **low-text budget** (one promise per section, ≤7-word headlines, no
  paragraph walls) so every section has room for graphics.

## Step 2: Asset Generation And Visual Polish

Turn the mockup into a premium graphic-heavy template by filling the manifest's
image slots, then polish.

- Generate each manifest asset as `brand.json.styleSignature + asset.subjectPrompt`
  via the engine in `tools/IMAGE_PIPELINE.md`, then run its `post` step with
  `tools/imgkit.py`. Scenes → webp; icons/logo → generated on white, keyed to
  transparent. Save originals to `raw/`, finals to `assets/img/`.
- Generate icons as a set with one shared descriptor so they read as siblings.
- Always Read each generated file and eyeball it before processing; regenerate duds.
- Use image-backed primary CTA buttons (texture + hover texture) with the label as
  HTML over the texture — never bake text into an image.
- Generate tiny chrome (check marks, arrows, play badges, bullets, stars) as
  image assets (fal → `imgkit keyout`). Never use emojis or hand-authored/
  invented SVG icon art; reserve CSS for layout primitives only.
- Apply `DESIGN_GUIDELINES.md` as the layout, contrast, typography, mobile, and
  button rubric.
- Avoid fragile external image dependencies; all assets live under the template folder.

Step 2 acceptance:

- The first viewport has strong on-brand imagery.
- CTA buttons have visible hover/focus states.
- Logo, icons, scenes, and CTA all share the brand's look.
- No engine-fallback placeholders remain; the page works opened from disk.

## Step 3: Motion, Detail Polish, And QA

Add final behavior and inspect the template like a shippable page.

- **Work in 2–3 polish passes** (build → review the served page → add a layer of
  depth/motion to every flat section → re-review). Each hero/feature section ends
  with **≥3 stacked visual layers** (bg media → scrim → accent cutout/glow/
  particles → content). See the entertainment-designer "Layer every section" doctrine.
- **Ping-pong looping videos** (`vidkit pingpong`) before `vidkit web` so muted
  autoplay loops never hard-cut at the seam.
- Add restrained scroll reveal, hover, parallax, sticky bar, countdown, accordions, or section highlighting only when they improve the sales experience.
- Run the **typography polish pass** (below) on every subheadline, lede, and key body line.
- Polish text wrapping, scrollbar styling, focus rings, selection color, and reduced-motion behavior.
- Verify no horizontal overflow at 360px, 768px, and 1280px.
- Check CTA links, FAQ toggles, animations, asset paths, favicon path, and image loading.
- Keep animations subtle and fast; the page should feel expensive, not busy.

Step 3 acceptance:

- Desktop, tablet, and mobile are readable and polished.
- No overlapping UI, clipped text, broken images, dead buttons, or accidental horizontal scrolling.
- Every subheadline/lede has been through the typography polish pass — none is flat, undersized, or unemphasized.
- The template folder can be copied as a standalone static design.

### Typography Polish Layer (subheadlines, ledes, key body)

The headline graphic carries the hero, but flat HTML subheadlines are where
templates read "cheap." Treat every subheadline, lede, and pull-quote as a small
design object, not a paragraph. This is a deliberate polish pass, not an
afterthought — run it on each one.

For each subheadline / lede:

- **Pull one phrase to emphasize.** Find the 1–3 words that carry the promise
  (a number, a noun, the payoff) and lift them — never style the whole line
  uniformly. Wrap them in `<strong>` (or `<mark>` for a softer accent) and color
  with the brand accent. Numbers especially ("18 short videos", "$28", "3×")
  earn the strongest treatment.
- **Slanted highlight for the hero phrase.** For the single most important phrase,
  use an art-directed highlighter band instead of plain colored text: dark text
  on a skewed brand-gradient band, rounded, with a soft accent glow. Pattern:

  ```css
  .lede strong { position: relative; display: inline-block; z-index: 0;
    color: <dark-ink>; font-weight: 900; padding: 0.04em 0.32em; text-shadow: none; }
  .lede strong::before { content: ""; position: absolute; inset: 0; z-index: -1;
    background: linear-gradient(100deg, var(--accent), var(--accent-deep));
    transform: skewX(-9deg); border-radius: 4px;
    box-shadow: 0 6px 18px var(--accent-glow); }
  ```

  Use exactly one such band per zone — like the image CTA, scarcity earns it impact.
- **Size up.** Subheadlines are usually too small. Use a fluid `clamp()` that tops
  out generously (e.g. hero lede `clamp(22px, 2.8vw, 30px)`); err larger.
- **Tighten the type.** Pull `line-height` in toward `1.3–1.4` and add slightly
  negative `letter-spacing` (`-0.01em`) so the line reads as a confident statement,
  not body copy. Leave enough line-height that any highlight band doesn't clip.
- **Brighten + lift off the background.** Use near-white over dark scenes (not a
  dimmed alpha), and add a `text-shadow: 0 2px 16px rgba(0,0,0,0.55)` over video/
  imagery so it stays legible.
- **Composition.** Add small left/right `padding` so lines never kiss the viewport
  edge on mobile, and tune top margin (even slightly negative) so the lede nests
  under the rotated headline graphic instead of floating away from it.
- **Restraint.** No-orphan-words still applies; keep ledes to ~2 lines; one accent
  treatment per line. The goal is emphasis with hierarchy, not a rainbow.

## File Pattern

Use this folder shape (copy `templates/_blank`):

```text
templates/<template-slug>/
├── index.html
├── brand/
│   ├── brand.json          # palette, type, seed, styleSignature (the anchor)
│   ├── styleguide.html     # visual brand reference (no footer)
│   ├── logo.png
│   ├── logo-mark.png
│   ├── favicon.png
│   └── style-board.webp
├── assets/
│   ├── styles.css          # colors derived from brand.json
│   ├── script.js
│   ├── img/                # all generated page imagery
│   │   ├── hero.webp
│   │   ├── scene-*.webp
│   │   ├── icon-*.png      # transparent
│   │   └── cta*.webp
│   └── prompts/manifest.json
└── raw/                    # full-res originals for re-processing
```

Tooling: `tools/imgkit.py` (post-processing) and `tools/IMAGE_PIPELINE.md`
(engines, transparency workflow, known issues).

## Copy Notes

For a long-form sales letter, prefer these beats:

1. Specific promise
2. Painful current state
3. New mechanism
4. Personal or local story
5. What the buyer gets
6. Why it works
7. Offer stack
8. Risk reversal
9. Urgency or reason to act now
10. FAQ and final CTA

Do not fabricate real endorsements, real credentials, real scarcity, or real legal claims. Fictional templates can use clearly fictional names and demo proof.

