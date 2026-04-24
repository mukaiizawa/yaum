from __future__ import annotations

import sys
from pathlib import Path

try:
    from PIL import Image
except ImportError as exc:  # pragma: no cover - dependency check
    raise SystemExit(
        "Pillow is required. Install it with: python -m pip install Pillow"
    ) from exc


ROOT = Path(__file__).resolve().parent.parent
ICONS_DIR = ROOT / "icons"
SIZES = (16, 32, 48, 128)
STATES = ("on", "off")


def resize_icon(source_path: Path, destination_path: Path, size: int) -> None:
    if source_path.resolve() == destination_path.resolve():
        return

    with Image.open(source_path) as source:
        resized = source.resize((size, size), Image.Resampling.LANCZOS)
        resized.save(destination_path, format="PNG")


def main() -> int:
    for state in STATES:
        source_path = ICONS_DIR / f"icon-{state}-128.png"
        if not source_path.exists():
            raise SystemExit(f"Missing source icon: {source_path}")

        for size in SIZES:
            destination_path = ICONS_DIR / f"icon-{state}-{size}.png"
            resize_icon(source_path, destination_path, size)

    print("Generated icon variants from 128px sources.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
