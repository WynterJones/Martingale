# PROMPT.md — "Generate a template for X"

The single brief + playbook for spinning up a new premium landing-page template.
Say **"Generate a template for X"** (X = the offer/niche/product) and an agent
runs this file end-to-end: brief → brand → mockup → assets → motion → QA, ending
with a finished, self-contained `templates/<slug>/` folder that opens in a browser.

Read first (they are the law): `CLAUDE.md`, `DESIGN_GUIDELINES.md`,
`skills/landing-page-design-process/SKILL.md`,
`skills/entertainment-designer/SKILL.md`, `tools/IMAGE_PIPELINE.md`.

---

## How to use this file

1. **Fill in the Brief block below** (Part 1). Anything you leave blank, the agent
   infers and **labels the assumption** — it never blocks on missing detail except
   the few hard questions in Part 2.
2. Hand the agent: *"Generate a template for X — follow PROMPT.md."* (Or just say
   "Generate a template for X"; `CLAUDE.md` points here.)
3. The agent executes Parts 3–7 and reports the finished folder + how to QA it.

You do **not** copy this file into the template. It stays at the repo root as the
reusable kickoff brief. The per-template repurposing brief is the template's own
`LLM.md` (see `templates/fishing-cinematic/LLM.md`).

---

## Part 1 — The Brief (fill this in)

Copy this block, fill what you know, leave the rest for the agent to infer.

```yaml
# ── what we're selling ───────────────────────────────────────────
offer:            # e.g. "a $49 sourdough masterclass", "a B2B scheduling SaaS"
niche:            # e.g. baking / fishing / fintech / fitness
price:            # e.g. $49 one-time / $29-mo / free trial / lead-gen (no price)
primaryCTA:       # exact button label, SHORT — e.g. "Get the Course", "Start Free"
ctaTarget:        # section the CTA scrolls to — e.g. #order, #signup
audience:         # who buys, in one line
corePain:        # the painful current state we agitate
onePromise:       # the single transformation, one sentence

# ── voice & proof ────────────────────────────────────────────────
persuasionStyle:  # long-form sales letter | punchy SaaS | editorial | playful
proof:            # testimonials/stats to fabricate (clearly fictional) or "none"
host:             # on-page person/mascot name + look, or "none"

# ── look & feel ──────────────────────────────────────────────────
mood:             # e.g. dark cinematic / bright patisserie / clean tech / retro
palette:          # rough colours or "agent picks" (real hexes get locked in brand.json)
medium:           # photoreal | cinematic concept-art | flat vector | 3D | illustration
layoutArchetype:  # see Part 3 menu, or "agent picks (must differ from siblings)"
motionLevel:      # full (video + parallax + particles) | medium | restrained
fidelity:         # fal (FAL_KEY present, preferred) | baseline (Gemini/Replicate MCP)

# ── housekeeping ─────────────────────────────────────────────────
slug:             # templates/<slug> — kebab-case, e.g. "sourdough-cinematic"
fictional:        true   # demo template? keep proof/host clearly fictional
```

---

## Part 2 — Clarify only if blank (max ~3 questions)

Ask the user **only** when a blank would change the whole build. Otherwise infer +
label. The questions worth asking:

1. **Offer + price + primary CTA label** — if there's no offer at all, you can't
   write the page.
2. **Mood/medium** (dark-cinematic vs bright vs flat-vector…) — drives the entire
   style signature and every asset.
3. **fal vs baseline** — only if `.env`'s `FAL_KEY` presence is unclear (check it;
   if present, default to fal).

Everything else: assume something reasonable, write it into the copy, and note the
assumption in the template README. Do not interrogate.

---

## Part 3 — Pick a layout archetype (force variety)

**Two templates must never feel like the same skeleton recolored.** Before
building, choose an architecture that fits the niche *and differs from existing
siblings* in `templates/`. Glance at what's there, then pick a different shape:

| Archetype        | Feels like                | Good for                        |
|------------------|---------------------------|---------------------------------|
| Full-bleed cinematic | video hero, scene bands, dark | courses, experiences, flagship offers |
| Bento / UI grid  | tiles, device mockups, chips | SaaS, apps, dashboards          |
| Split-screen     | 50/50 image\|copy, alternating | products, services, comparisons |
| Editorial / long-form | magazine columns, big type | stories, info products, coaching |
| Card-driven      | stacked feature cards, carousels | marketplaces, bundles, catalogs |
| Timeline / steps | vertical journey, progress | methods, programs, onboarding   |

Then vary *within* it too: don't reuse the same section order each build. Lead
with image/video, not headlines. Large accent graphics do the design work.

---

## Part 4 — Execute the four stages

Start from the scaffold, then run the process from
`skills/landing-page-design-process/SKILL.md`. Honor `DESIGN_GUIDELINES.md`
throughout.

```bash
cp -r templates/_blank templates/<slug>
```

### Stage 0 — Brand (lock before any page art)
- Fill `brand/brand.json`: `name`, `tagline`, real-hex `palette`, `type`, a fixed
  `seed`, and the one **`styleSignature`** sentence — *medium, lighting, exact
  palette hexes, texture, mood; end with "No text, no words, no letters."* This
  string is prepended to **every** image prompt and is the consistency mechanism.
- Set `engines` to match `fidelity` (fal vs gemini).
- Generate brand assets: `brand/logo.png`, `brand/logo-mark.png`,
  `brand/favicon.png`, `brand/style-board.webp` (generate on solid white →
  `imgkit keyout` / `webp` / `favicon`).
- Build `brand/styleguide.html` (logo, palette, type, icons, scene, CTA together;
  no footer). Reference: `templates/fishing-course-local-lake/brand/styleguide.html`.
- **Gate:** real palette + concrete signature; logo/mark/favicon are true-
  transparent PNGs that read on light *and* dark; styleguide opens with every
  asset loading.

### Stage 1 — Mockup & sales architecture (build all sections before polish)
- Write `index.html` + `assets/styles.css` (colors derived from `brand.json`
  `:root` vars — one source of truth) in the chosen archetype.
- Full persuasive copy per `persuasionStyle`. For long-form, use the beats: promise
  → painful state → new mechanism → story → what you get → why it works → offer
  stack → risk reversal → urgency → FAQ → final CTA.
- One promise per section, one CTA per zone; main CTA in hero, mid-page, offer
  stack, and final section — all wired to `ctaTarget`.
- **Declare every image as a slot in `assets/prompts/manifest.json`** (id, type,
  subjectPrompt, post step, out path) before the files exist. HTML can reference
  the paths early.
- **Gate:** page reads top-to-bottom, no lorem, every section has a purpose,
  manifest lists every image the page references.

### Stage 2 — Asset generation & visual polish
- Generate each manifest asset as `styleSignature + subjectPrompt`, then run its
  `post` step. Scenes → `webp`; icons/logo/chrome → generate on solid white →
  `keyout` to transparent. Save originals to `raw/`, finals to `assets/img/`.
- Generate the **icon set with one shared descriptor** so they read as siblings.
- **Full-image CTA buttons**: one AI graphic per label (Ideogram → `keyout`),
  label in the `<img alt>`, only hover/press/glow in CSS. Art-direct the button
  (don't accept default candy-gloss) — see the entertainment-designer skill.
- Generate ALL chrome (checks, arrows, play, stars, badges, seals) as image
  assets. **No emojis. No hand-authored/invented SVG icon art.** CSS only for
  layout primitives.
- **Read every generated file and eyeball it; regenerate any dud** (generic,
  washed-out, cluttered; buttons that wrap, go two-tone, recolor, or typo).
- **Gate:** first viewport has strong on-brand imagery; CTAs have hover/focus;
  logo/icons/scenes/CTA share one look; no fallback placeholders; works from disk.
  **Contrast:** every button label (CSS *and* the image-CTA's baked-in
  lettering) reads AA on its own fill — gold/pastel fills take dark ink, no
  gold-on-gold or white-on-cream; the logo/wordmark and any badge/seal overlay
  number read on both their light and dark placements.

### Stage 3 — Motion, detail & QA
- Layer restrained motion: scroll reveal/stagger, parallax, sticky bar, count-ups,
  particle/orb fields, glow, micro-interactions, mascot bob. Vanilla JS + CSS,
  60fps (transform/opacity only), all honoring `prefers-reduced-motion`.
- Video for **variety, not wallpaper**: a signature loop + vertical-video cards +
  animated accent areas — don't background-video every section. **Modals embed a
  real YouTube video**, never a generated clip.
- Polish: `text-wrap: balance` on headings, no orphan words (`&nbsp;` trailing
  phrases, intentional `<br>`), themed scrollbar, focus rings, selection color.
- **Gate:** no horizontal overflow at 360 / 768 / 1280; AA contrast; videos
  autoplay/muted/loop with posters; modals close on Esc/×/click-outside; all CTA
  links, FAQ toggles, asset paths, favicon work; the folder copies as a standalone.

---

## Part 5 — Tool cheat-sheet (fal tier)

```bash
# scene / hero still -> webp
python3 tools/fal.py image --prompt "<styleSignature + subject>" --aspect 16:9 --seed <SEED> --out raw/hero.jpg
python3 tools/imgkit.py webp raw/hero.jpg assets/img/hero.webp --max 1920

# looping video (run in background, 1-5 min) -> ping-pong (seamless) -> web-weight + poster
python3 tools/fal.py video --image raw/hero.jpg --duration 5 --aspect 16:9 \
  --prompt "<looping idle: named layers that move + parallax, seamless loop>" --out raw/hero.mp4
python3 tools/vidkit.py pingpong raw/hero.mp4 raw/hero-pp.mp4          # forward+reverse: no seam-cut
python3 tools/vidkit.py web      raw/hero-pp.mp4 assets/video/hero.mp4 --max 1280
python3 tools/vidkit.py poster   raw/hero.mp4 assets/video/hero-poster.jpg

# cutouts (logo / icon / seal / mascot / prop): fal bg removal (Bria, best edges) -> trim
python3 tools/fal.py bg raw/logo.jpg raw/logo-cut.png             # default = Bria matting
python3 tools/imgkit.py alpha raw/logo-cut.png brand/logo.png     --pad 16 --size 640
python3 tools/fal.py bg raw/ic-x.jpg raw/ic-x-cut.png
python3 tools/imgkit.py alpha raw/ic-x-cut.png assets/img/ic-x.png --pad 28 --size 256 --square
python3 tools/imgkit.py favicon brand/logo.png brand/favicon.png  --size 256
# (imgkit keyout is the no-API fallback, only when generated on SOLID pure white)

# the ONE image CTA — art-direct it (recraft-v3, material-integrated text). 2-3 tries, keep best.
python3 tools/fal.py image --model fal-ai/recraft-v3 --imgsize 1600x520 \
  --prompt "Premium <FINISH e.g. embossed gold / glossy gel / brushed steel> button: ONE wide rounded-rectangle pill filling the frame, <BRAND colour/material>, thick bevel, top sheen, soft inner glow, crisp diagonal specular highlight; the words '<LABEL>' on ONE line in the SAME material (embossed, same lighting) — never flat Arial-on-image; a small <BRAND motif> emblem fused into the left end; soft contact shadow, plain pure-white background. No second button, no extra text, no emoji." \
  --out raw/btn-cta.jpg
python3 tools/fal.py bg raw/btn-cta.jpg raw/btn-cta-cut.png && python3 tools/imgkit.py alpha raw/btn-cta-cut.png assets/img/btn-cta.png --pad 6
# Hybrid alt (flagship style): CSS pill + a generated transparent prop/emblem cutout inside it + CSS shine-sweep.
```

**Baseline tier (no FAL_KEY):** use the `imagegen` MCP — Gemini
`model: "gemini-2.5-flash-image"` for scenes/icons/logo (on white → `keyout`),
Replicate Flux 1.1 Pro for photoreal. See `tools/IMAGE_PIPELINE.md` (and its known
issues — Gemini model id, no real transparency, gpt-image-1 broken).

---

## Part 6 — QA locally

```bash
python3 -m http.server 8771      # from repo root
# open http://localhost:8771/templates/<slug>/index.html
```

Check at 360 / 768 / 1280: no horizontal overflow, videos autoplay/loop with
posters, buttons crisp (no wrap/two-tone/typo), icons/seal clean, host modal opens
and closes (Esc/×/click-outside, iframe `src` cleared on close), no orphan words,
AA contrast, no dead CTAs, favicon loads.

---

## Part 7 — Wrap up

- Write the template's `README.md` (what it is, what stands out, how the art was
  made, the folder shape) — pattern: `templates/fishing-cinematic/README.md`.
- Write the template's `LLM.md` repurposing brief so the next niche can reuse it —
  pattern: `templates/fishing-cinematic/LLM.md`.
- Report: the finished `templates/<slug>/` path, the QA command, any labeled
  assumptions, and any assets that needed regeneration.

---

## The bar (don't ship below it)

Graphics-led, **bold, low-text**, marketing-focused. Every asset passes the glance
test — instant impact, strong focal point, rich color, readable silhouette. **Every
hero/feature section is layered (≥3 stacked graphic layers — bg → scrim → accent
cutout/glow/particles → content); no flat text-on-a-fill sections.** Ship a **juicy
hero headline graphic** plus 1–3 section headline graphics. The image CTA is
**art-directed** (material-integrated text + a brand emblem + bevel/sheen), never a
plain pill. Cut copy to a tight budget so there's room for art — when a section
feels cramped, cut text, don't shrink the graphics. **Built in 2–3 polish passes**,
not one. Looping video is **ping-ponged** so it never seam-cuts. Full-image AI CTA,
no emojis, no invented SVG icon art. Layout varies from its siblings. Motion feels
expensive, not busy. **Contrast is non-negotiable:** every button
label, card/section text, logo, and badge/seal overlay reads AA against its own
surface (not the page) — see DESIGN_GUIDELINES §2. If anything looks generic,
washed-out, cluttered, low-contrast, or a button is inconsistent — regenerate it. The page reads as a premium,
graphics-led marketing experience, not a document.
