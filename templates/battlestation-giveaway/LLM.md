# LLM.md — repurpose RIGDROP for a new giveaway/sweepstakes

This is a complete brief for turning the **RIGDROP** dark-neon battlestation
giveaway into a giveaway for a *different* prize/niche (a car, a vacation, a cash
drop, a sneaker vault, a camera kit, a home-studio setup…). Hand this file to an
LLM along with the template folder.

## What this template is

A dark, bold **enter-to-win sweepstakes** page. The conversion event is an email
opt-in, not a purchase. The architecture (top to bottom):

1. **Urgency topbar** — drop number + live countdown.
2. **Hero** — kicker ("Free to enter"), headline graphic, typography-polished lede
   with the prize value highlighted, the **enter-to-win form** (email + one image
   CTA), a trust row, and a rotating **prize-value seal** that opens a video modal.
3. **Stat strip** — grand prize / drops awarded / total entries / 100% free (count-ups).
4. **Prize bento** — itemized prize cut-outs with per-item value + a total-value tile.
5. **How it works** — 3 steps: enter / share for bonus entries / drawn live.
6. **Winner spotlight** — a verified-winner quote over a parallax scene + mini stats.
7. **Urgency** — big countdown panel + CTA.
8. **FAQ** — accordion (is it free, how chosen, eligibility, what you win, when).
9. **Final CTA** — repeat the enter form.
10. **Footer** — nav + sweepstakes official-rules language. Keep it clearly fictional.

## To repurpose

1. **`brand/brand.json`** — change `name`, `tagline`, `seed`, and the
   `styleSignature` to the new mood/palette. Keep one display + one body font.
   Update the CSS `:root` vars in `assets/styles.css` to match (one source of truth).
2. **`assets/prompts/manifest.json`** — rewrite each `subjectPrompt` for the new
   prize (swap the 7 product cut-outs, the hero scene, the winner scene, the
   headline text, the logo, and the `ENTER TO WIN` button label if needed). Keep
   the `post` steps: scenes → `imgkit webp`; cut-outs/icons/seal → `fal.py bg` +
   `imgkit alpha`; logo/headline/button → `ideogram/v3` → `fal.py bg` + `imgkit alpha`.
3. **`index.html`** — swap copy: prize names + values in the bento, the total, the
   winner quote, FAQ answers, countdown target month in `assets/script.js`
   (`nextTarget()` uses month index 5 = June 30), the topbar/stat numbers.
4. **Generate** (Stage 2) — `styleSignature + subjectPrompt`, seed from brand.json.
   Read and eyeball every asset; regenerate any dud (generic, washed-out,
   cluttered, or a button that wraps/two-tones/typos). Keep the bento product
   silhouettes clean — `fal.py bg` matting beats colour-keying.
5. **QA** (Stage 3) — `python3 -m http.server 8771`; check 360/768/1280, the form
   success state, countdown tick, modal open/close, AA contrast, no overflow.

## Hard rules (from the kit)

- Generated art only. **No emojis, no hand-authored/invented SVG icon art** —
  every icon/check/chevron/seal is a generated, background-removed PNG.
- **Exactly one** art-directed image CTA (`ENTER TO WIN`, reused hero/final/modal);
  every other button is a CSS `.btn`.
- Video for variety, not wallpaper. The **modal embeds a real YouTube video**,
  never a generated clip.
- Low text: one promise per section, short headlines, big graphics. Run the
  typography polish pass on every lede/subhead.
- Contrast is non-negotiable: cyan/lime fills take dark ink; check the image CTA's
  baked label and the seal's overlaid number read AA on their own surface.

## Key files

- `brand/brand.json` — palette, seed, styleSignature (the consistency anchor).
- `assets/prompts/manifest.json` — every image's prompt + post step + output path.
- `assets/styles.css` — `:root` vars mirror brand.json; bento/form/countdown styles.
- `assets/script.js` — reveals, parallax, particles, count-ups, countdown, form
  handling, YouTube modal.
