#!/usr/bin/env bash
set -euo pipefail

root_dir="$(cd "$(dirname "$0")/.." && pwd)"

remove_matches() {
  local dir="$1"
  shift

  [ -d "$dir" ] || return 0

  for pattern in "$@"; do
    find "$dir" -maxdepth 1 -type f -name "$pattern" -print -delete
  done
}

echo "Cleaning generated installer/package files..."

remove_matches "$root_dir/release" "*.dmg" "*.dmg.blockmap" "*.exe" "*.exe.blockmap" "*.yml"
remove_matches "$root_dir/android/app/build/outputs/apk/debug" "*.apk" "*.json"
remove_matches "$root_dir/android/app/build/outputs/apk/release" "*.apk" "*.json"

echo
echo "✅ Package cleanup complete"
echo "Checked folders:"
echo "  $root_dir/release"
echo "  $root_dir/android/app/build/outputs/apk/debug"
echo "  $root_dir/android/app/build/outputs/apk/release"
