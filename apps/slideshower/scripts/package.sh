#!/usr/bin/env bash
set -euo pipefail

target="${1:-all}"
root_dir="$(cd "$(dirname "$0")/.." && pwd)"

need_cmd() {
  if ! command -v "$1" >/dev/null 2>&1; then
    echo "Missing required command: $1" >&2
    exit 1
  fi
}

detect_android_sdk() {
  if [ -n "${ANDROID_HOME:-}" ] && [ -d "$ANDROID_HOME" ]; then
    printf "%s" "$ANDROID_HOME"
    return 0
  fi

  if [ -n "${ANDROID_SDK_ROOT:-}" ] && [ -d "$ANDROID_SDK_ROOT" ]; then
    printf "%s" "$ANDROID_SDK_ROOT"
    return 0
  fi

  if [ -d "$HOME/Library/Android/sdk" ]; then
    printf "%s" "$HOME/Library/Android/sdk"
    return 0
  fi

  return 1
}

ensure_android_sdk() {
  local sdk_dir

  if ! sdk_dir="$(detect_android_sdk)"; then
    cat >&2 <<'EOF'
Android SDK location not found.

Install Android Studio, then open:
  Android Studio > Settings > Languages & Frameworks > Android SDK

Install the SDK, then either rerun this command or set ANDROID_HOME, for example:
  export ANDROID_HOME="$HOME/Library/Android/sdk"
  export PATH="$ANDROID_HOME/platform-tools:$PATH"

If your SDK is in a custom path, create android/local.properties:
  sdk.dir=/absolute/path/to/Android/sdk
EOF
    exit 1
  fi

  mkdir -p android
  printf "sdk.dir=%s\n" "$sdk_dir" > android/local.properties
  echo "Using Android SDK: $sdk_dir"
}

build_web() {
  npm run build
}

list_outputs() {
  local output_dir="$1"
  shift

  for pattern in "$@"; do
    find "$output_dir" -maxdepth 1 -type f -name "$pattern" -print 2>/dev/null || true
  done
}

print_output() {
  local label="$1"
  local output_dir="$2"
  shift 2

  echo
  echo "✅ $label build complete"
  echo "Output folder:"
  echo "  $output_dir"

  local files
  files="$(list_outputs "$output_dir" "$@")"
  if [ -n "$files" ]; then
    echo "Generated files:"
    while IFS= read -r file; do
      echo "  $file"
    done <<< "$files"
  fi
  echo
}

clean_win_outputs() {
  [ -d "$root_dir/release" ] || return 0
  find "$root_dir/release" -maxdepth 1 -type f \( -name "*.exe" -o -name "*.exe.blockmap" \) -delete
}

build_mac() {
  build_web
  export CSC_IDENTITY_AUTO_DISCOVERY=false
  npx electron-builder --mac dmg
  print_output "macOS DMG" "$root_dir/release" "*.dmg"
}

build_win() {
  build_web
  clean_win_outputs
  npx electron-builder --win nsis --x64
  npx electron-builder --win nsis --arm64
  print_output "Windows EXE" "$root_dir/release" "*.exe"
}

build_android() {
  build_web
  if [ ! -d android ]; then
    npx cap add android
  fi
  npx cap sync android
  python3 scripts/generate-android-icons.py
  need_cmd java
  ensure_android_sdk
  cd android
  ./gradlew assembleDebug
  print_output "Android APK" "$root_dir/android/app/build/outputs/apk/debug" "*.apk"
}

case "$target" in
  mac)
    build_mac
    ;;
  win)
    build_win
    ;;
  android)
    build_android
    ;;
  all)
    build_mac
    build_win
    build_android
    ;;
  *)
    echo "Usage: scripts/package.sh [mac|win|android|all]" >&2
    exit 1
    ;;
esac
