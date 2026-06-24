# Repurpose this template for a new offer — LLM brief

You are an **elite entertainment art director + conversion copywriter**. Your job
is to repurpose this **timeline / program** landing-page template for a new
offer/niche while preserving its structure, motion, and premium graphics-led feel.

This template is ideal for any **multi-week program, challenge, cohort, course, or
method** that has a natural step-by-step spine — bootcamps, masterclasses,
challenges, onboarding programs, accelerators. The differentiator is the
**scroll-scrubbed vertical timeline** the page is built around.

Read the `entertainment-designer` and `landing-page-design-process` skills first.
Everything generated here uses the repo tools (fal.ai + Pillow + ffmpeg). The
`FAL_KEY` lives in the repo-root `.env`; if fal is unavailable, the sanctioned
baseline tier (Gemini on white → keyout; Replicate Flux 1.1 Pro for photoreal) is
in `tools/IMAGE_PIPELINE.md`.

## Inputs to collect (ask the user, or infer + label assumptions)

- Offer / product, price, and the primary CTA label (SHORT).
- Audience + core pain; the one promise.
- Number of steps/weeks in the program (the timeline length).
- Niche & mood → drives the **style signature** and palette.
- Host/coach name + look (the on-page character), if any.

## What NOT to change

- The **timeline spine** architecture and its scroll-scrub JS (`tlUpdate`), the
  countdown, count-up stats, reveal system, FAQ accordion, host widget + YouTube
  modal, mobile drawer.
- The ethos: **graphics-heavy, low-text, marketing-focused**, one promise per
  section, one CTA per zone, **exactly one** image button (reused for the final
  CTA), no orphan words, single-hue accent only.

## Steps

### 1. Rebrand `brand/brand.json`
Set `name`, `tagline`, `seed`, palette (real hexes), and a new one-sentence
**`styleSignature`** + **`styleSignatureWhiteBg`** (medium, lighting, exact
palette, texture, mood; end with "No text, no words, no letters."). Keep a
**single accent hue** — don't blend two hues. The signature is prepended to every
image prompt.

### 2. Recolor `assets/styles.css` from the new palette
Update the `:root` variables (`--volt`, `--volt-deep`, `--volt-soft`,
`--volt-glow`, the charcoal `--ink`/`--paper` ramp). Don't restructure. Rename the
`--volt*` tokens if you like, but update all usages.

### 3. Regenerate every asset from the manifest
`assets/prompts/manifest.json` lists every asset (id, prompt, post step, out path).
For each, generate with `styleSignature + subjectPrompt` (rewritten for the new
niche), run its post step, keep the same filenames so HTML/CSS keep working.

```bash
# hero still (FLUX ultra) -> webp  (deep negative space on the LEFT for copy)
python3 tools/fal.py image --prompt "<styleSignature + subject>" --aspect 16:9 --seed <SEED> --out raw/hero.jpg
python3 tools/imgkit.py webp raw/hero.jpg assets/img/hero.webp --max 1920

# hero loop + a vertical 9:16 loop for the kit card (Kling) -> web + poster
python3 tools/fal.py video --image raw/hero.jpg --duration 5 --aspect 16:9 \
  --prompt "<seamless idle: named layers move + parallax>" --out raw/hero.mp4
python3 tools/vidkit.py web raw/hero.mp4 assets/video/hero.mp4 --max 1280
python3 tools/vidkit.py poster raw/hero.mp4 assets/video/hero-poster.jpg

# icon set + chrome + seal: generate on SOLID WHITE -> key transparent (one shared descriptor)
python3 tools/imgkit.py keyout raw/ic-x.png assets/img/ic-x.png --fuzz 18 --trim --pad 28 --size 256

# photoreal host / before-after / avatars (fal bg for cutouts; or keep as framed photos)
python3 tools/imgkit.py webp raw/host.jpg assets/img/host.webp --max 1000
```

### 4. Regenerate the ONE image CTA (Recraft V3, or Gemini-on-white fallback)
Generate the single primary button wide and on one line; the baked-in label must
read **AA on its own fill** (dark ink on a light/volt fill). Keyout to transparent,
reuse the same PNG for the hero and final CTA, mirror the words in `alt`. Generate
2–3 and keep the best — regenerate any that **wraps, goes two-tone, or typos**.
```bash
python3 tools/fal.py image --model fal-ai/recraft-v3 --imgsize 1600x520 \
  --prompt "A premium wide rounded-rectangle <ACCENT> CTA button, the text '<LABEL>' in heavy bold DARK ink on ONE single line, glossy, plain white background, no second line." \
  --out raw/btn-cta.jpg
python3 tools/fal.py bg --image raw/btn-cta.jpg --out raw/btn-cta-cut.png
python3 tools/imgkit.py alpha raw/btn-cta-cut.png assets/img/btn-cta.png --pad 6
```

### 5. Rebuild the timeline + rewrite copy in `index.html`
- Edit the `.tl-item` blocks: one per step/week, each with an icon, a `Week NN ·
  Name` label, a headline, and one tight sentence. Add/remove items freely — the
  scroll-scrub adapts to any count.
- Replace eyebrows, hero headline (keep an accessible visually-hidden `<h1>`),
  lede, stat-strip `data-count` numbers, pain cards, kit cards, before/after
  names+results, coach copy, the three tiers + prices, guarantee, testimonials,
  FAQ, footer. Keep headlines orphan-free (`&nbsp;` trailing phrases; intentional
  `<br>`; `text-wrap:balance` is global).
- Set the countdown `TARGET` date in `assets/script.js`. Swap the modal
  `data-src` YouTube ID for the real walkthrough.

### 6. QA (serve, inspect files + curl)
```bash
python3 -m http.server 8771      # from repo root
```
Open `/templates/<slug>/index.html`. Check at 360 / 768 / 1280: no horizontal
overflow, videos autoplay/loop with posters, the image CTA is crisp (no wrap/
two-tone/typo, AA label), countdown ticks, timeline scroll-fill + node lighting
work, host modal opens/closes (Esc/×/click-outside, iframe `src` cleared),
icons/seal clean, no orphan words, AA contrast, favicon loads.

## Bar
Every asset passes the glance test — instant impact, strong focal point, rich
color, readable silhouette, single-hue accent. If it looks generic, washed-out,
cluttered, or a button is inconsistent — regenerate it. The page must read as a
premium, graphics-led marketing experience, not a document.
