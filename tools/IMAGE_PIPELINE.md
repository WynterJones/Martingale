# Image pipeline

How AI imagery is produced for LP-Templates. The goal: every asset in a template
looks like one brand. The mechanism: a single **style signature** (in each
template's `brand/brand.json`) is prepended to every image prompt.

```
prompt = brand.json.styleSignature + "\n" + asset.subjectPrompt
```

## Two fidelity tiers

- **High fidelity (preferred for hero / cinematic): fal.ai** — `tools/fal.py`
  (FLUX1.1 [pro] ultra stills, Kling looping video) + `tools/vidkit.py`
  (web-ready loops). Needs `FAL_KEY` in the gitignored `.env`. This is the
  `entertainment-designer` skill's engine. See **fal pipeline** below.
- **Baseline (no key needed): Gemini / Replicate** via the `imagegen` MCP, post-
  processed with `tools/imgkit.py`. Covered in the rest of this doc.

## fal pipeline (high fidelity)

```bash
# premium still (up to ~2.7k px); reuse one --seed across a set
python3 tools/fal.py image --prompt "<styleSignature + subject>" --aspect 16:9 \
  --seed 73412 --out raw/hero.jpg
python3 tools/imgkit.py webp raw/hero.jpg assets/img/hero.webp --max 1920

# looping video from a still (1-5 min; run in background), then make web-weight
python3 tools/fal.py video --image raw/hero.jpg --duration 5 --aspect 16:9 \
  --prompt "<looping idle animation prompt>" --out raw/hero.mp4
python3 tools/vidkit.py pingpong raw/hero.mp4 raw/hero-pp.mp4                 # seamless: no seam-cut
python3 tools/vidkit.py web      raw/hero-pp.mp4 assets/video/hero.mp4 --max 1280  # ~20MB -> ~1MB
python3 tools/vidkit.py poster   raw/hero.mp4 assets/video/hero-poster.jpg
```

- **Transparency = `fal.py bg` (Bria matting, best edges), not colour-keying.** Generate the
  subject, then matte it and trim:
  ```bash
  python3 tools/fal.py bg raw/mascot.jpg raw/mascot-cut.png
  python3 tools/imgkit.py alpha raw/mascot-cut.png assets/img/mascot.png --size 680
  ```
  Clean alpha, no halos, keeps subject colours matching the backdrop. `imgkit
  keyout` is the no-API fallback only.
- **Logo = lockup:** ideogram horizontal "icon + wordmark (one line)" → `fal.py
  bg` → `imgkit alpha` for the logo, `imgkit crop --box "0,0,0.26,1"` for the
  favicon. White wordmark on mid-gray for dark themes; dark on white for light.
- `FAL_KEY` lives in repo-root `.env` (gitignored). `tools/fal.py -h` lists models.
- Embed loops as muted autoplay `<video>` with a `poster` (see the
  `entertainment-designer` skill).

## Engines (MCP `imagegen`)

Verified working in this environment (keys present: OpenAI, Google, Replicate):

| Job                         | Engine call                                              | Notes |
|-----------------------------|---------------------------------------------------------|-------|
| Scenes / backgrounds / textures | `image_generate_gemini` `model: "gemini-2.5-flash-image"` | Default. Outputs ~1024² PNG. |
| Icons / logo (transparent)  | `image_generate_gemini` on a **solid white** bg, then key out | See transparency below. |
| Photoreal alternative       | `image_generate_replicate` (Flux 1.1 Pro) `format: "webp"` | Richest photo look; good fallback. |

### Known issues (important)

- **Gemini default model 404s.** You MUST pass `model: "gemini-2.5-flash-image"`.
  The tool's built-in default (`gemini-2.5-flash-image-preview`) no longer exists.
- **gpt-image-1 is broken.** `image_generate_openai` fails with
  `Unknown parameter: 'response_format'` regardless of args — the MCP server
  injects a param gpt-image-1 rejects. Do not use it until fixed.
- **No engine produces real transparency.** Asking Gemini for a "transparent
  background" makes it *paint a gray checkerboard* (opaque). Always generate on a
  solid flat colour and key it out locally (below).
- **No reference-image input.** These tools take a prompt only — you cannot feed
  the style-board back in as an image. Consistency comes from the shared text
  `styleSignature`, the exact palette hexes in every prompt, and a fixed `seed`.

## Post-processing — `tools/imgkit.py` (Pillow)

```bash
# transparent icon/logo: flood-fill the white bg from the corners -> alpha
python3 tools/imgkit.py keyout raw/icon-map.png assets/img/icon-map.png --trim --pad 36 --size 256
python3 tools/imgkit.py keyout raw/logo.png     brand/logo.png          --trim --pad 56 --size 640

# scene/background -> web-ready webp (longest edge <= --max)
python3 tools/imgkit.py webp raw/hero.png assets/img/hero.webp --max 1600 --quality 84

# favicon from a square-ish source
python3 tools/imgkit.py favicon brand/logo.png brand/favicon.png --size 256
```

`keyout` flood-fills inward from the four corners, so a flat-colour pixel *inside*
the artwork is preserved (only the connected background is removed). If a logo has
an enclosed shape (e.g. a badge outline), its interior stays filled — either
accept it, or prompt an open mark with no enclosing outline.

CTA button textures: generate a wide horizontal texture with no text, crop the
central band (Gemini adds white margins), then `webp`. Keep the button label as
HTML over the texture — never bake text into the image.

## Recipe per asset type

- **Logo** — "minimal logo emblem on a solid pure white background: <mark>. Flat
  vector, two-tone <hexes>." → `keyout --trim --pad 56 --size 640`.
- **Icon set** — generate each with one shared descriptor ("even medium stroke,
  two-tone <hexes>, matches a cohesive icon set") so they read as a set. **Matte
  with fal `bg` (BiRefNet), not `keyout`** — colour-keying leaves grey halos/boxes
  when the model paints a tinted (non-pure-white) backdrop or soft shadows:
  `fal.py bg raw/ic-x.jpg raw/ic-x-cut.png` → `imgkit alpha ... --pad 28 --size 256
  --square`. (`keyout` is the no-API fallback only.)
- **Scene** — describe subject + reuse `styleSignature`; leave open space for copy.
  → `webp --max 1600`.
- **Tiny chrome** (checkmarks, dividers) — use inline SVG, not AI. Crisp at any
  size, no keying artefacts.

Always eyeball each generation (Read the file) before processing; regenerate duds.
