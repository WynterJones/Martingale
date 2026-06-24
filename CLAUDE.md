# LP-Templates — premium AI landing-page kit

This repo is a **system for producing premium, graphics-heavy, animated static
landing-page templates** with AI-generated art and video. If you are an AI agent
(Claude Code / Codex / etc.) loaded into this folder, read this first — it is the
map. Everything you need to generate a high-quality landing page is here.

## Trigger: "Generate a template for X"

When the user says **"Generate a template for X"** (or "make a landing page for
X", etc.), open **`PROMPT.md`** at the repo root and run it end-to-end with `X` as
the offer/niche. `PROMPT.md` is the single kickoff brief + playbook: it captures
the brief, asks at most ~3 clarifying questions only when a blank would change the
whole build, picks a layout archetype that differs from existing siblings, then
executes the four stages below and ends with a finished `templates/<slug>/` folder
plus a QA command. Default to the fal tier when `FAL_KEY` is in `.env`.

## The process (always follow it)

Two repo-local skills drive the work — read them before building:

1. `skills/landing-page-design-process/` — the four-stage method: **Brief & Brand
   → Mockup & sales architecture → Asset generation & polish → Motion, detail &
   QA**, plus the brand-system (every template has `brand/brand.json` whose
   `styleSignature` is prepended to every image prompt for one coherent look).
2. `skills/entertainment-designer/` — the high-fidelity art direction: fal.ai
   stills + looping video, layered animation, **full-image CTA buttons**,
   text-as-image, a character/host widget, and the no-orphan-words rule.

`DESIGN_GUIDELINES.md` is the layout/UX/QA rubric. Honor it.

## Tools (all driven by these — no other dependencies)

- `tools/fal.py` — fal.ai: premium stills (`fal-ai/flux-pro/v1.1-ultra`), text/
  headline/button graphics (`fal-ai/ideogram/v3`), looping video
  (`fal-ai/kling-video`), and **background removal** (`bg`, BiRefNet).
- `tools/imgkit.py` — Pillow: `alpha` (trim transparent cutouts), `crop`, `webp`,
  `favicon`.
- `tools/vidkit.py` — ffmpeg (via pip `imageio-ffmpeg`): web-compress, poster,
  loop. A ~20 MB Kling clip → ~1 MB.
- `tools/IMAGE_PIPELINE.md` — engines, fidelity tiers, transparency workflow,
  and known issues (read it — it saves you the mistakes already made).

### Setup (one time)
Put a fal.ai key in a gitignored `.env` at the repo root:
```
FAL_KEY=your-fal-key
```
Pillow + imageio-ffmpeg install on first use: `python3 -m pip install Pillow imageio-ffmpeg`.

## Make a new template
```bash
cp -r templates/_blank templates/<your-slug>
```
Then follow the four stages. To **repurpose an existing template** for a new
offer/niche, give an LLM that template's `LLM.md` (e.g.
`templates/fishing-cinematic/LLM.md`) — it is a complete repurposing brief.

## What "good" means (the bar)
- Graphics-led, **low-text**, marketing-focused. One promise per section, one CTA
  per zone. Lead with image/video, not headlines. Use **large accent graphics**.
- **Vary the layout per template** — don't reuse one skeleton; different niches
  get different architectures (cinematic, bento/UI, split, editorial, cards).
- **Buttons:** exactly ONE art-directed image CTA (the hero/primary; reuse for the
  final CTA), every other button a premium CSS button. Don't image-ify them all.
- **Hero headline graphic** for standout (typographic image or text + big accent
  graphic), lifted with CSS drop-shadow / glow.
- Generated art only. **No emojis. No hand-authored/invented SVG icon art** —
  generate every icon/check/arrow/play/star/badge as an image asset; CSS only for
  layout primitives. Transparency via **fal `bg` removal**, never colour-keying.
- **Video = variety, not wallpaper:** a signature loop + vertical-video cards +
  animated accent areas — don't background-video every section. **Modal videos
  embed a real YouTube video**, never a generated clip.
- Mascot/host widget when it fits (large, recurring).
- **Make graphics & icons LARGE** — feature icons 64–96px, accent graphics/
  mascots huge (40–70% viewport, bleeding off edges). Undersized = cheap.
- **Premium typography:** a characterful display font + clean body, fluid
  `clamp()` scale, tight display tracking. Not Inter-only.
- **Premium motion stack** for high-end builds: Lenis (smooth scroll) + GSAP
  ScrollTrigger (staggered/pinned/scrub) + SplitType (headline reveals). Plus
  layered soft shadows, a subtle grain overlay, colored glows. (Details in the
  "Push to super high-end" section of the entertainment-designer skill.)
- Real design polish: scroll reveals, parallax, particle/orb fields, glow,
  micro-interactions — 60fps (transform/opacity only); honor reduced-motion.
- No orphan words; AA contrast; no horizontal overflow at 360/768/1280; videos
  autoplay/muted/loop with posters; modals close on Esc/×/click-outside.
- Eyeball every generated asset; regenerate anything generic, washed-out,
  cluttered, or (for buttons) striped/two-tone/wrapped/typo'd.

## Templates
- `templates/fishing-cinematic/` — flagship (dark cinematic): video-backed, host
  widget, full-image buttons, deliverables showcase. Use as the reference build.
- `templates/macaron-cinematic/` — light patisserie theme; same system, proves it
  handles bright themes and a different niche (host: Alysha).
- `templates/saas-reelo/` — SaaS, original **bento** layout (not the cinematic
  skeleton): mascot, vertical-video cards, pricing tiers, large accent graphics,
  Lenis smooth scroll, YouTube demo modal. Shows layout variety + fal bg-removal.
- `templates/makeup-giveaway/` — luxury beauty **giveaway/sweepstakes** (Lumière):
  enter-to-win form, headline graphic, one image CTA + CSS buttons, prize grid,
  coupon close. Light luxe theme; distinct giveaway archetype.
- `templates/ai-profit-blueprint/` — **lead-gen VSL squeeze** (email opt-in for a
  free AI mini-course): Kennedy/Brunson direct-response copy, dark tech brand,
  fascination bullets, host VSL modal. Distinct archetype (not cinematic/bento).
- `templates/think-grow-rich/` — **editorial long-form book sales page** (art-deco
  wealth: emerald-black + antique gold + cream). Sells Napoleon Hill's classic and
  links to Amazon. No video, no host widget (both optional); the design is carried
  by typography + gold-foil deco art + restrained motion. Real cover/portrait,
  matted & duotoned. Distinct archetype (editorial) and niche (a book).
- `templates/battlestation-giveaway/` — **dark-neon giveaway/sweepstakes** (RIGDROP):
  enter-to-win an RGB battlestation. Bold electric-cyan + magenta on near-black,
  Chakra Petch display. Hero enter form + live countdown/entry counter + prize-value
  seal, itemized **prize bento** of product cut-outs, 3-step how-it-works, winner
  spotlight, urgency, FAQ, YouTube modal. Proves the giveaway archetype in a dark,
  gaming niche (contrast to the light-luxe makeup-giveaway).
- `templates/codeforge-academy/` — **dark cinematic course sales page** (CodeForge):
  a project-based coding course. Repurposed from the repo's own `salespage/` — keeps
  the obsidian + molten-gold **dragon-forge** art (mascot, ambient video, slot-machine
  showcase reel, medallion seal) but re-positions it: "forge real software." Hero video
  + regenerated **CodeForge** wordmark + **Start Forging** image CTA, project reel,
  0–4 curriculum, one-time price + lifetime access, sample-lesson YouTube modal. Proves
  the cinematic skeleton resells as a course / skill-product archetype.
- `templates/fishing-course-local-lake/` — baseline (no fal key; Gemini/Replicate).
- `templates/_blank/` — copy-to-start scaffold.

## QA locally
```bash
python3 -m http.server 8771      # from repo root
# open http://localhost:8771/templates/<slug>/index.html
```
