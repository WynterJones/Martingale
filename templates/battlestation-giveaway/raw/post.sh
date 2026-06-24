#!/usr/bin/env bash
# RIGDROP — post-process raw stills into final assets. Idempotent (skips finals
# that already exist). Run from repo root. Re-run to fill gaps after balance refills.
set -u
cd "$(dirname "$0")/../../.."   # -> repo root
T=templates/battlestation-giveaway
R=$T/raw
I=$T/assets/img

cut () { # raw.jpg  final.png  pad  size
  local raw="$1" fin="$2" pad="$3" size="$4"
  [ -s "$fin" ] && { echo "skip $fin"; return; }
  [ -s "$raw" ] || { echo "MISSING raw $raw"; return; }
  echo "=== cut $fin ==="
  python3 tools/fal.py bg "$raw" "${raw%.jpg}-cut.png" 2>&1 | tail -1
  [ -s "${raw%.jpg}-cut.png" ] && python3 tools/imgkit.py alpha "${raw%.jpg}-cut.png" "$fin" --pad "$pad" --size "$size" 2>&1 | tail -1
}
webp () { # raw.jpg final.webp max
  local raw="$1" fin="$2" max="$3"
  [ -s "$fin" ] && { echo "skip $fin"; return; }
  [ -s "$raw" ] || { echo "MISSING raw $raw"; return; }
  python3 tools/imgkit.py webp "$raw" "$fin" --max "$max" 2>&1 | tail -1
}

# scenes
webp $R/winner.jpg $I/winner.webp 1400

# product cut-outs
cut $R/prize-pc.jpg       $I/prize-pc.png       10 720
cut $R/prize-monitor.jpg  $I/prize-monitor.png  10 720
cut $R/prize-keyboard.jpg $I/prize-keyboard.png 10 720
cut $R/prize-chair.jpg    $I/prize-chair.png    10 720
cut $R/prize-headset.jpg  $I/prize-headset.png  10 720
cut $R/prize-mouse.jpg    $I/prize-mouse.png    10 720
cut $R/prize-deck.jpg     $I/prize-deck.png     10 720

# icons
cut $R/ic-enter.jpg    $I/ic-enter.png    24 256
cut $R/ic-share.jpg    $I/ic-share.png    24 256
cut $R/ic-win.jpg      $I/ic-win.png      24 256
cut $R/ic-verified.jpg $I/ic-verified.png 24 256
cut $R/ic-check.jpg    $I/ic-check.png    28 200
cut $R/ic-spark.jpg    $I/ic-spark.png    28 200
cut $R/ic-chev.jpg     $I/ic-chev.png     28 200

# seal
cut $R/seal.jpg $I/seal.png 12 512

# headline
cut $R/headline.jpg $I/headline.png 10 1200

# image CTA (btn-cta-1 = bright gradient fill, white label, emblem on left)
if [ ! -s "$I/btn-cta.png" ] && [ -s "$R/btn-cta-1.jpg" ]; then
  echo "=== cut btn-cta ==="
  python3 tools/fal.py bg "$R/btn-cta-1.jpg" "$R/btn-cta-1-cut.png" 2>&1 | tail -1
  [ -s "$R/btn-cta-1-cut.png" ] && python3 tools/imgkit.py alpha "$R/btn-cta-1-cut.png" "$I/btn-cta.png" --pad 8 2>&1 | tail -1
fi

echo "POST_DONE"
