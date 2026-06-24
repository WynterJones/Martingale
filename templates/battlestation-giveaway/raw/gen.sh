#!/usr/bin/env bash
# RIGDROP — generate all raw stills. Run from repo root.
set -u
cd "$(dirname "$0")/../../.."   # -> repo root
T=templates/battlestation-giveaway
R=$T/raw
SEED=80517
FAL="python3 tools/fal.py image"

# style signature (scenes + products) read from brand.json
SS=$(python3 -c "import json;print(json.load(open('$T/brand/brand.json'))['styleSignature'])")

gen () { # model aspect seed prompt outfile
  local model="$1" aspect="$2" seed="$3" prompt="$4" out="$5"
  if [ -s "$out" ]; then echo "=== $out (exists, skip) ==="; return; fi
  echo "=== $out ==="
  $FAL --model "$model" --aspect "$aspect" --seed "$seed" --prompt "$prompt" --out "$out" 2>&1 | tail -1
}

FLUX=fal-ai/flux-pro/v1.1-ultra
IDEO=fal-ai/ideogram/v3

# --- scenes ---
gen $FLUX 16:9 $SEED "$SS a complete high-end gaming battlestation glowing in a dark room: a custom tempered-glass PC tower with vivid RGB fans, a huge curved ultrawide monitor showing an abstract neon game, mechanical keyboard and mouse on a desk mat, a sleek racing-style gaming chair, hovering volumetric haze, intense cyan and magenta edge lighting, cinematic hero composition with empty negative space in the upper-left for a headline" $R/hero.jpg
gen $FLUX 4:3 $SEED "$SS a happy young gamer sitting at their newly-won glowing RGB battlestation at night, arms raised in celebration, neon cyan and magenta light on their face, cinematic, shallow depth of field, dark room" $R/winner.jpg

# --- product cut-outs (dark glossy, rim-lit; bg removed later) ---
gen $FLUX 1:1 $SEED "$SS a single premium tempered-glass mid-tower gaming PC with vivid RGB fans and a visible liquid-cooler, floating and centered, glossy, dramatic cyan and magenta rim light, plain dark studio backdrop, one object only" $R/prize-pc.jpg
gen $FLUX 1:1 $SEED "$SS a single huge curved ultrawide OLED gaming monitor on a sleek stand, screen glowing with an abstract neon swirl, floating and centered, cyan and magenta rim light, plain dark studio backdrop, one object only" $R/prize-monitor.jpg
gen $FLUX 1:1 $SEED "$SS a single premium mechanical gaming keyboard with per-key RGB backlight, three-quarter angle, floating, glossy keycaps, cyan and magenta rim light, plain dark studio backdrop, one object only" $R/prize-keyboard.jpg
gen $FLUX 1:1 $SEED "$SS a single high-end racing-style gaming chair in black with neon-cyan stitching accents, three-quarter view, floating, glossy, cyan and magenta rim light, plain dark studio backdrop, one object only" $R/prize-chair.jpg
gen $FLUX 1:1 $SEED "$SS a single premium over-ear gaming headset with glowing cyan ear-cup rings, floating three-quarter view, glossy, magenta rim light, plain dark studio backdrop, one object only" $R/prize-headset.jpg
gen $FLUX 1:1 $SEED "$SS a single ergonomic pro gaming mouse with RGB underglow and accent lighting, floating three-quarter view, glossy, cyan and magenta rim light, plain dark studio backdrop, one object only" $R/prize-mouse.jpg
gen $FLUX 1:1 $SEED "$SS a single stream-deck control pad with glowing customizable LCD keys in cyan and magenta, floating three-quarter view, glossy, plain dark studio backdrop, one object only" $R/prize-deck.jpg

# --- icons (neon-on-white, bg removed later) ---
ICON="single premium glossy 3D icon, smooth rounded style, vivid electric-cyan to hot-magenta neon gradient on dark glossy material with a soft neon glow, centered, on a solid flat pure-white background, no cast shadow, no text, no words"
gen $FLUX 1:1 80520 "an email envelope with a small spark, $ICON" $R/ic-enter.jpg
gen $FLUX 1:1 80520 "three connected share nodes with arrows (a share network glyph), $ICON" $R/ic-share.jpg
gen $FLUX 1:1 80520 "a winners trophy cup with small confetti, $ICON" $R/ic-win.jpg
gen $FLUX 1:1 80520 "a shield with a checkmark (verified badge), $ICON" $R/ic-verified.jpg

GLYPH="single glowing electric-cyan neon glyph, smooth rounded, centered, on a solid flat pure-white background, no cast shadow, no text, no words"
gen $FLUX 1:1 80521 "a bold rounded checkmark, $GLYPH" $R/ic-check.jpg
gen $FLUX 1:1 80521 "a small four-point sparkle star, $GLYPH" $R/ic-spark.jpg
gen $FLUX 1:1 80521 "a right-pointing chevron arrow, $GLYPH" $R/ic-chev.jpg

# --- seal (empty center for number overlay) ---
gen $FLUX 1:1 $SEED "a circular neon emblem badge with a hexagonal tech border, electric-cyan and hot-magenta neon glow on a glossy dark metallic ring, smooth empty dark flat center reserved for a number, centered, on a solid flat pure-white background, no cast shadow, no text, no words" $R/seal.jpg

# --- headline graphic (ideogram) ---
gen $IDEO 16:9 $SEED "bold uppercase display headline text reading exactly 'WIN THE ULTIMATE BATTLESTATION' on three tight centered lines, chrome metallic extruded letters with electric-cyan and hot-magenta edge glow, slight upward dynamic angle, plain pure-white background, no other objects, no extra text" $R/headline.jpg

# --- image CTA button (ideogram) x2 ---
BTN="ultra-wide rounded-rectangle pill button filling the entire frame, glossy electric-cyan to hot-magenta neon gradient with a thick dark bevel, top sheen, soft outer glow and a diagonal specular highlight; ONE single centered line of bold uppercase dark-ink text reading exactly 'ENTER TO WIN'; a small glowing hexagonal power-core emblem fused into the left end; plain pure-white background, no second button, no extra text, no emoji, no price, no numbers"
gen $IDEO 3:1 $SEED "$BTN" $R/btn-cta-1.jpg
gen $IDEO 3:1 80518 "$BTN" $R/btn-cta-2.jpg

echo "ALL_DONE"
