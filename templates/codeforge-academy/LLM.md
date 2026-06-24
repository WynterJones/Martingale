# Repurpose this template for a new offer — LLM brief

You are an **elite art director + conversion copywriter**. This template is a
**dark cinematic "forge" sales page for an online course** (the demo: *CodeForge*,
a project-based coding course). Repurpose it for a **new course / digital product /
download** while preserving its structure, motion, and premium graphics-led feel.

Read the `entertainment-designer` and `landing-page-design-process` skills first.
Everything here uses the repo tools (fal.ai + Pillow + ffmpeg); `FAL_KEY` is already
in the repo-root `.env`.

## Origin note
This was forged from the repo's own `salespage/` (the DragonForge product page) and
re-positioned as a course template. The dragon-forge art is a **metaphor** ("forge
your skills"), so it suits any course / bootcamp / skill product. If your new niche
clashes with fantasy, re-skin the palette + style signature and regenerate the art.

## What NOT to change
- The section architecture & component classes: promo bar, sticky nav + mobile
  drawer, **video hero** with headline graphic + image CTA + dragon mascot,
  3-step pitch, **slot-machine "project/showcase reel"**, 0–4 timeline, feature
  grid, count-up stat strip, "what you get" checklist, **offer card** with ambient
  video + animated glow + medallion seal, FAQ `<details>`, ember-field final CTA,
  footer, and the **mascot host widget → YouTube modal**.
- The ethos: graphics-heavy, **low-text**, one promise per section, one CTA per
  zone, **exactly one art-directed image CTA** (`btn-cta.png`, reused at hero +
  offer + final), every other button CSS. No orphan words; AA contrast.
- The motion system in `assets/script.js` (reveals, parallax, count-ups, the
  idle-respinning reels, particle/ember canvases, modal).

## Wire-up (do this regardless of niche)
- **Checkout:** set `BUY_URL` at the top of `assets/script.js` to your course /
  product checkout (Teachable, Podia, Thinkific, Kajabi, Gumroad, Stripe link…).
  Every `[data-buy]` link inherits it.
- **Demo video:** the host widget + offer modal point a real YouTube embed at a
  placeholder (`dQw4w9...`). Swap `data-src` on `#player` for your sample lesson /
  VSL. Keep it a **real** video, never a generated clip.
- **Price** appears in the hero/promo copy, the `.price-amount` block, the stat
  strip, and CTAs — update all of them together.

## Text-bearing graphics (regenerate when you rename)
Two assets bake in the word **CodeForge / Start Forging** and must be regenerated
if you rebrand. Use `fal-ai/ideogram/v3`, then `fal bg` → `imgkit alpha`. Keep the
same filenames so the HTML keeps working.

```bash
SIG="$(cat brand/brand.json | jq -r .styleSignature)"   # or paste it

# Hero wordmark -> assets/img/hl-forge.png  (ONE word, perfect spelling)
python3 tools/fal.py image --model fal-ai/ideogram/v3 --aspect 16:9 --seed 88231 --format png \
  --out raw/hl.png --prompt "$SIG Epic 3D fantasy logo title text reading exactly 'YOURNAME' on ONE line, carved from molten gold metal with glowing ember edges and a forged-steel bevel, dragon-scale texture, plain pure white background, perfect spelling."
python3 tools/fal.py bg raw/hl.png raw/hl-cut.png
python3 tools/imgkit.py alpha raw/hl-cut.png assets/img/hl-forge.png --pad 12

# Image CTA -> assets/img/btn-cta.png  (one short verb phrase)
python3 tools/fal.py image --model fal-ai/ideogram/v3 --aspect 3:1 --seed 41902 --format png \
  --out raw/btn.png --prompt "A single premium 3D UI call-to-action BUTTON and nothing else, a wide rounded-rectangle pill filling the whole frame, molten-gold-to-ember gradient, glossy top sheen, dragon-scale micro-texture, soft outer glow. Bold white sans-serif on ONE line reading exactly 'YOUR CTA', perfect spelling. No dragon, no creature, no scene, no extra objects, plain pure white background."
python3 tools/fal.py bg raw/btn.png raw/btn-cut.png
python3 tools/imgkit.py alpha raw/btn-cut.png assets/img/btn-cta.png --pad 8
```
> Eyeball both. Ideogram sometimes renders a *scene* around the button — if it
> does, reroll with a new `--seed` and lean harder on "no scene / no creature".

## The rest of the art (reuse or regenerate)
Most assets are **text-free** and theme the page, not the words — reuse as-is for a
forge/skill course, or regenerate from new prompts for a different mood. The art set:
- `assets/video/hero.mp4` + `forge.mp4` (+ posters) — ambient loops.
- `assets/img/mascot.png` — the host dragon (hero, final CTA, FAB widget).
- `assets/img/card-*.webp` — the 5 **reel cards**: relabel each `<figcaption>` to a
  project/module/showcase item; regenerate the emblem art if the niche shifts.
- `assets/img/ic-*.png` — feature/step icons (anvil, spark, terminal, chest,
  scroll, motion). `ic-check.png`, `seal.png`, `play-badge.png`, `coil.png`.
- `brand/og-image.png`, `favicon.png` — share + tab art (text-free).
  `brand/logo.png` still shows the **old** wordmark and is **unused** by the page
  (nav/footer use a CSS text wordmark) — regenerate or ignore.

## Copy pass
Rewrite every section for the new offer: promo, hero sub, 3 pitch steps, reel
captions, the 0–4 path/curriculum, 6 feature cards, 4 stats, "what you get"
checklist, offer card + guarantee, 6 FAQs, final CTA, footer. Keep it punchy and
benefit-led — one idea per block, no walls of text.

## QA
```bash
python3 -m http.server 8771   # from repo root
# open http://localhost:8771/templates/<slug>/index.html
```
Check 360 / 768 / 1280: no horizontal overflow, AA contrast, the video has a
poster and autoplays muted, modal closes on Esc / × / click-outside, no orphan
words, and the image CTA reads cleanly against the dark hero.
