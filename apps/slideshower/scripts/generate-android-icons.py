#!/usr/bin/env python3
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "public" / "logo.png"
RES = ROOT / "android" / "app" / "src" / "main" / "res"
LAUNCHER_BACKGROUND = (255, 255, 255, 255)

DENSITIES = {
    "mipmap-mdpi": 48,
    "mipmap-hdpi": 72,
    "mipmap-xhdpi": 96,
    "mipmap-xxhdpi": 144,
    "mipmap-xxxhdpi": 192,
}

FOREGROUND_DENSITIES = {
    "mipmap-mdpi": 108,
    "mipmap-hdpi": 162,
    "mipmap-xhdpi": 216,
    "mipmap-xxhdpi": 324,
    "mipmap-xxxhdpi": 432,
}


def contain_on_canvas(image, size, padding=0, background=(0, 0, 0, 0)):
    canvas = Image.new("RGBA", (size, size), background)
    max_size = max(1, size - padding * 2)
    copy = image.copy()
    copy.thumbnail((max_size, max_size), Image.Resampling.LANCZOS)
    x = (size - copy.width) // 2
    y = (size - copy.height) // 2
    canvas.alpha_composite(copy, (x, y))
    return canvas


def main():
    if not SOURCE.exists():
        raise SystemExit(f"Logo not found: {SOURCE}")

    if not RES.exists():
        raise SystemExit("Android project not found. Run `npm run android:init` first.")

    logo = Image.open(SOURCE).convert("RGBA")

    for folder, size in DENSITIES.items():
        out_dir = RES / folder
        out_dir.mkdir(parents=True, exist_ok=True)
        icon = contain_on_canvas(logo, size, padding=int(size * 0.12), background=LAUNCHER_BACKGROUND)
        icon.save(out_dir / "ic_launcher.png")
        icon.save(out_dir / "ic_launcher_round.png")

    for folder, size in FOREGROUND_DENSITIES.items():
        out_dir = RES / folder
        out_dir.mkdir(parents=True, exist_ok=True)
        foreground = contain_on_canvas(logo, size, padding=int(size * 0.18))
        foreground.save(out_dir / "ic_launcher_foreground.png")

    background = RES / "values" / "ic_launcher_background.xml"
    background.parent.mkdir(parents=True, exist_ok=True)
    background.write_text(
        '<?xml version="1.0" encoding="utf-8"?>\n'
        "<resources>\n"
        '    <color name="ic_launcher_background">#FFFFFF</color>\n'
        "</resources>\n",
        encoding="utf-8",
    )

    print(f"Generated Android launcher icons from {SOURCE}")


if __name__ == "__main__":
    main()
