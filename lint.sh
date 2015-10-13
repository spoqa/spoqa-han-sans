#!/usr/bin/env bash
set -e
RESULT_PATH="/tmp/result-spoqa-han-sans.html"
HTML2TEXT="/tmp/html2text.py"
cd "$(dirname "$0")"
jekyll build --no-watch --quiet
curl -X POST \
     -F content=@_site/index.html \
     -F parser=html \
     --connect-timeout 5 \
     --compressed \
     --retry 10 --retry-delay 3 \
     -o "$RESULT_PATH" \
     --silent \
     https://html5.validator.nu/
if grep "There were errors." "$RESULT_PATH"; then
  if [[ ! -f "$HTML2TEXT" ]]; then
    curl -o "$HTML2TEXT" http://www.aaronsw.com/2002/html2text/html2text.py
  fi
  python "$HTML2TEXT" "$RESULT_PATH"
  echo "[FAILED] Invalid HTML." >> /dev/stderr
  exit 1
fi
if [[ "$(which shellcheck)" != "" ]]; then
  shellcheck "$0" || echo "[FAILED] Invalid shell script: $0" >> /dev/stderr
fi
echo "[SUCCESS] OK."
