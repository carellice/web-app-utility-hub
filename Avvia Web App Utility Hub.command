#!/bin/zsh

set -e

SCRIPT_DIR="${0:A:h}"

if ! command -v npm >/dev/null 2>&1; then
  osascript -e 'display dialog "Node.js non è installato. Installalo e riapri Web App Utility Hub." buttons {"OK"} with icon caution'
  exit 1
fi

cd "$SCRIPT_DIR"
npm run setup
npm run dev
