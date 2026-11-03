#!/usr/bin/env bash
# Joins video chunks (chunk-000.mp4 ...) and muxes the finished audio mix. The mix may be mono: its one channel goes to both sides at full level.
#   scripts/join.sh <chunks-dir> <mix.wav> <out.mp4>
set -euo pipefail
dir="$(realpath "$1")"; mix="$2"; out="$3"
: > "$dir/list.txt"
for f in $(ls "$dir"/chunk-*.mp4 | sort); do echo "file '$f'" >> "$dir/list.txt"; done
ffmpeg -v error -y -f concat -safe 0 -i "$dir/list.txt" -i "$mix" -map 0:v -map 1:a -c:v copy -af "pan=stereo|c0=c0|c1=c0" -c:a aac -b:a 192k -shortest -movflags +faststart "$out"
