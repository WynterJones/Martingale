# SURGE — 6-Week Transformation Challenge

High-fidelity, graphics-led, video-backed landing-page template for a fictional
**$49 body-transformation challenge + online coaching** (cohort-based, with a
start-date countdown and limited spots). Dark athletic identity built around a
single electric **volt-lime** accent on near-black charcoal.

Open `index.html` in a browser (or serve the repo and visit
`/templates/fitness-surge/index.html`). No build step.

## What makes it stand out

- **Timeline archetype** — the page is built around the **6-week journey** as a
  vertical progress spine (Week 1 → Week 6) with a **scroll-scrubbed fill line**
  and nodes that light up volt-lime as you pass them. No sibling template uses
  this shape (not cinematic-stack, not bento).
- **Live cohort countdown** — a real JS countdown to a fixed demo cohort-start
  date, repeated in the hero and the urgency band; degrades gracefully to
  "New cohort starting soon" after it passes.
- **Ember/spark canvas** — a lightweight volt-lime particle field drifts over the
  hero video, pausing off-screen for perf.
- **Direct-response copy** — agitate the pain (no time / yo-yo diets / gym
  intimidation), sell the transformation, offer stack (Challenge / + Coaching /
  VIP), a do-the-work guarantee seal, scarcity + countdown, FAQ, final CTA.
- **Graphics-led, low-text** — one promise per section, big imagery, one CTA per
  zone. Generated icon set, before/after gallery, testimonial avatars.
- **Host widget + VSL modal** — Coach Mara Vance (fictional) bobs in the corner;
  the modal embeds a **real YouTube** placeholder (never a generated clip) and
  clears its `src` on close (Esc / × / click-outside).
- **Motion** — count-up stats, scroll reveals, marquee, glow pulses, sticky
  condensing nav, working mobile hamburger drawer. All honor
  `prefers-reduced-motion`.

## Buttons

Exactly **one** art-directed image CTA — "JOIN THE CHALLENGE" (volt-lime pill,
dark charcoal ink for AA, single line) — reused for the hero and the final CTA.
Every other button (nav, ghost, pricing, modal) is a crafted CSS button.

## How the art was made

Built with the `entertainment-designer` skill. Every asset = the `styleSignature`
in `brand/brand.json` + a subject prompt, seed 84217, single-hue volt-lime.

- **Hero still + loop**: `tools/fal.py image` (FLUX1.1 [pro] ultra) →
  `tools/imgkit.py webp`; `tools/fal.py video` (Kling v2.5) → `tools/vidkit.py
  web` + `poster` (a ~20 MB clip compresses to <1 MB).
- **Vertical workout loop**: same pipeline at 9:16 for the kit video card.
- **Logo**: Ideogram v3 lockup → `tools/fal.py bg` → `tools/imgkit.py alpha` +
  favicon/mark crops.
- **Image CTA, icon set, chrome, seal**: generated on solid white →
  `tools/imgkit.py keyout` to clean transparent PNGs (one shared descriptor so
  the icons read as siblings).
- **Photoreal host, before/after, avatars**: cinematic studio portraits, volt-lime
  rim light, on dark charcoal.

> The fal.ai balance was exhausted partway through the build, so the icon set,
> chrome, seal, image CTA, host, transformations and testimonial avatars were
> finished on the sanctioned **baseline tier** (Gemini `gemini-2.5-flash-image`
> on white → keyout for chrome/icons; Replicate **Flux 1.1 Pro** for the
> photoreal portraits). Same style signature, same palette — see
> `tools/IMAGE_PIPELINE.md`. The hero stills + both video loops + logo are the
> original fal.ai assets.

`assets/prompts/manifest.json` records the prompt + post step for every asset;
full-res originals are in `raw/`.

## Shape

```
brand/        brand.json, logo.png, logo-mark.png, favicon.png,
              style-board.webp, styleguide.html
assets/
  styles.css, script.js
  img/        hero, host, transform-1..3, avatar-1..3 (webp),
              ic-* icon set + chk-* chrome + seal + btn-cta (transparent png),
              noise.png (grain overlay)
  video/      hero.mp4 + hero-poster.jpg, workout.mp4 + workout-poster.jpg
  prompts/    manifest.json
raw/          full-res stills + original Kling mp4s
index.html
```

## Assumptions (labeled)

- **Fictional demo.** Brand, coach (Coach Mara Vance), testimonials, before/after
  photos, result stats, spots-left, and the guarantee are all illustrative — not
  a real offer. A fictional-demo disclaimer sits in the footer and on the gallery.
- **Cohort start** is pinned to a fixed near-future date in `script.js`
  (`TARGET`); update it per use.
- **VSL** uses a placeholder YouTube ID in the modal `data-src` — swap for the
  real walkthrough video.
- Tier prices ($49 / $129 / $299) and the offer stack are demo values.
