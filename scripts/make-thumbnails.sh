#!/bin/bash

# === SETTINGS ===
CROP_PERCENT=30        # Total cropping (removes 30% → 15% each side)
FINAL_WIDTH=600        # Final thumbnail width
TMP_DIR="tmp-crop"     # Temporary cropped images
OUT_DIR="$(pwd)/thumbnails"     # Final output directory (absolute path)

# === PREP ===
mkdir -p "$TMP_DIR"
mkdir -p "$OUT_DIR"

echo "Cropping ${CROP_PERCENT}% inward and generating ${FINAL_WIDTH}px thumbnails..."

# === PROCESS ===
for f in *.png; do
  [ -e "$f" ] || continue

  name="${f%.*}"
  width=$(vipsheader -f width "$f")
  height=$(vipsheader -f height "$f")

  # Calculate crop margins (remove 30% → 15% from each side)
  crop_x=$(( width * CROP_PERCENT / 200 ))    # left offset
  crop_y=$(( height * CROP_PERCENT / 200 ))   # top offset
  crop_w=$(( width - (width * CROP_PERCENT / 100) ))
  crop_h=$(( height - (height * CROP_PERCENT / 100) ))

  echo "Cropping $f → center crop (${crop_w} x ${crop_h})"

  # Step 1 — Crop inward toward center
  vips crop "$f" "${TMP_DIR}/${name}.png" \
    "$crop_x" \
    "$crop_y" \
    "$crop_w" \
    "$crop_h"

  # Step 2 — Make thumbnail from cropped version (write directly to OUT_DIR)
  vipsthumbnail "${TMP_DIR}/${name}.png" \
    -s "$FINAL_WIDTH" \
    -o "${OUT_DIR}/${name}.webp[Q=80]"
done

echo "Done! Thumbnails in: $OUT_DIR"