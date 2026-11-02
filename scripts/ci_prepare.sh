#!/usr/bin/env bash
# Overlays the private content repo (checked out in content-src/) onto the engine, then installs dependencies.
set -euo pipefail
cp -r content-src/episodes/. src/toon/episodes/
cp -r content-src/public/. public/
sudo apt-get update -y -qq
sudo apt-get install -y -qq ffmpeg libnss3 libdbus-1-3 libatk1.0-0 libgbm-dev libasound2t64 libxrandr2 libxkbcommon-dev libxfixes3 \
  libxcomposite1 libxdamage1 libatk-bridge2.0-0 libpango-1.0-0 libcairo2 libcups2 || \
sudo apt-get install -y -qq ffmpeg libnss3 libdbus-1-3 libatk1.0-0 libgbm-dev libasound2 libxrandr2 libxkbcommon-dev libxfixes3 \
  libxcomposite1 libxdamage1 libatk-bridge2.0-0 libpango-1.0-0 libcairo2 libcups2
npm ci --no-audit --no-fund
