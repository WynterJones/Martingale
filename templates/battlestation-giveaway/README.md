# RIGDROP — Ultimate Battlestation Giveaway (dark-neon)

A **dark, bold giveaway / sweepstakes** landing-page template (fictional demo).
One winner takes a $12,400 RGB battlestation — custom PC, 49″ OLED ultrawide,
chair, and the full peripheral kit. Free enter-to-win, drawn live, shipped
worldwide. Built with the LP-Templates kit, using `fishing-cinematic` as the
quality bar.

## What stands out

- **Distinct dark-neon brand.** Near-black studio backdrop lit by electric cyan
  (`#16e0ff`) + hot magenta (`#ff2bd6`) with a violet glow — a different palette
  and mood from the light-luxe `makeup-giveaway` and the gold/teal `fishing-cinematic`.
  Display face is **Chakra Petch** (tech) over Inter body.
- **Giveaway archetype, "drop" layout.** Sticky urgency topbar + live countdown,
  a hero **enter-to-win form** with one art-directed image CTA, a live entry
  counter, and a rotating prize-value seal that opens a YouTube modal.
- **Itemized prize bento.** Nine flagship pieces as transparent product cut-outs in
  a bento grid (XL centerpiece PC, wide OLED, peripherals) with per-item value and
  a total-value tile.
- **Believable real-world offer.** 3-step how-it-works (enter / share for 5× /
  drawn live), a verified-winner spotlight with count-up stats, urgency countdown,
  FAQ accordion, and a footer with sweepstakes-style official-rules language.
- **Motion stack.** Lenis smooth scroll, IntersectionObserver reveals, multi-speed
  parallax bands, a perspective neon grid-floor, a cyan/magenta canvas particle
  field, animated count-ups, a 1-second-tick countdown, and a real form-success
  state — all 60fps (transform/opacity) and gated behind `prefers-reduced-motion`.

## How the art was made

Every image is `brand.json.styleSignature + subjectPrompt` (see
`assets/prompts/manifest.json`), seed `80517`:

- **Scenes** (hero, winner) — `fal-ai/flux-pro/v1.1-ultra` → `imgkit webp`.
- **Hero video loop** — `fal` Kling i2v from the hero still → `vidkit pingpong` →
  `vidkit web` + `vidkit poster`.
- **Product cut-outs** (the 7 prize tiles) + **icons/chrome/seal** — `flux-pro`
  on a plain backdrop → **`fal.py bg`** (BiRefNet matte) → `imgkit alpha`.
- **Logo lockup + headline graphic + the one image CTA** — `fal-ai/ideogram/v3`
  (clean in-image text) → `fal.py bg` → `imgkit alpha`.
- One art-directed image CTA (`ENTER TO WIN`); every other button is a CSS button.

## QA locally

```bash
python3 -m http.server 8771      # from repo root
# open http://localhost:8771/templates/battlestation-giveaway/index.html
```

Check at 360 / 768 / 1280: no horizontal overflow, hero video autoplays/loops with
poster, the enter form validates + shows success, countdown ticks, modal opens and
closes (Esc / × / click-outside, iframe `src` cleared), buttons crisp, AA contrast.

## Shape

```
brand/        brand.json, styleguide.html, logo.png, favicon.png
assets/
  styles.css, script.js, img/noise.png
  img/        hero.webp, winner.webp, prize-*.png, ic-*.png, seal.png, headline.png, btn-cta.png
  video/      hero.mp4 (+ hero-poster.jpg)
  prompts/    manifest.json (prompt + post step for every asset)
raw/          full-resolution generations kept for re-processing
index.html
```

Fictional demo. No purchase necessary; not a real sweepstakes. To repurpose for a
different prize/niche, see `LLM.md`.
