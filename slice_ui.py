#!/usr/bin/env python3
"""Slice ui/*.png spritesheets into individual sprites and classify by category."""
from __future__ import annotations

import json
import re
import shutil
from collections import defaultdict
from pathlib import Path

import numpy as np
from PIL import Image
from scipy import ndimage

ROOT = Path(__file__).resolve().parent
UI = ROOT / "ui"
SHEETS = UI / "_sheets"
SPRITES = UI / "sprites"
MANIFEST = UI / "manifest.json"

# Source filename (stem) -> category folder under sprites/
CATEGORY_MAP = {
    "Bars": "bars",
    "Beds": "furniture/beds",
    "Blacksmith": "workshop/blacksmith",
    "Candle 1": "candles",
    "Candle 2": "candles",
    "Candle 3": "candles",
    "candle 4": "candles",
    "Candle 5": "candles",
    "Candle 6": "candles",
    "candle": "candles",
    "cats furniture": "furniture/cats",
    "Chairs": "furniture/chairs",
    "Closet": "furniture/closets",
    "Doors, windows and curtains": "furniture/doors-windows",
    "Dressers": "furniture/dressers",
    "Esoteric": "esoteric",
    "Farm": "farm",
    "Fireplace": "furniture/fireplace",
    "Meat": "food/meat",
    "Others": "misc",
    "Pan": "kitchen/pans",
    "Pan_01-Sheet": "kitchen/pans",
    "Pan_02-Sheet": "kitchen/pans",
    "Pan_03-Sheet": "kitchen/pans",
    "Pan_04-Sheet": "kitchen/pans",
    "Pan_05-Sheet": "kitchen/pans",
    "Part 1 copiar": "props/decor",
    "Part 2 copiar": "props/decor",
    "Part 9 copiar": "props/decor",
    "Part 10 copiar": "props/kitchen",
    "Part 11 copiar": "props/decor",
    "Resources": "resources",
    "Rocks": "environment/rocks",
    "Shadows": "effects/shadows",
    "Sofa and armchair": "furniture/sofas",
    "speech bubble, emojis, reaction": "ui/speech",
    "Tables and desks": "furniture/tables",
    "Tools": "tools",
    "Vegetation": "environment/vegetation",
    "Walls and Floors": "environment/walls-floors",
    "weather icons": "weather",
    "Xmas": "seasonal/xmas",
}

BG_THRESH = 12  # near-black treated as background
MIN_AREA = 8
MERGE_GAP = 2  # merge boxes within this pixel distance
PAD = 1


def slug(s: str) -> str:
    s = s.strip().lower()
    s = re.sub(r"[^\w\-]+", "-", s, flags=re.UNICODE)
    s = re.sub(r"-+", "-", s).strip("-")
    return s or "sheet"


def is_fg(rgba: np.ndarray) -> np.ndarray:
    """Foreground mask: not (near-black or fully transparent)."""
    r, g, b, a = rgba[..., 0], rgba[..., 1], rgba[..., 2], rgba[..., 3]
    dark = (r <= BG_THRESH) & (g <= BG_THRESH) & (b <= BG_THRESH)
    return (a > 8) & (~dark)


def connected_components(mask: np.ndarray) -> list[tuple[int, int, int, int]]:
    """Return bounding boxes (x0,y0,x1,y1) exclusive of connected FG regions."""
    labeled, n = ndimage.label(mask, structure=np.ones((3, 3), dtype=int))
    boxes: list[tuple[int, int, int, int]] = []
    # ndimage.find_objects returns slices for labels 1..n
    objects = ndimage.find_objects(labeled)
    for i, slc in enumerate(objects, start=1):
        if slc is None:
            continue
        ys, xs = slc
        area = int((labeled[ys, xs] == i).sum())
        if area < MIN_AREA:
            continue
        boxes.append((xs.start, ys.start, xs.stop, ys.stop))
    return boxes


def boxes_near(a, b, gap: int) -> bool:
    ax0, ay0, ax1, ay1 = a
    bx0, by0, bx1, by1 = b
    return not (
        ax1 + gap < bx0
        or bx1 + gap < ax0
        or ay1 + gap < by0
        or by1 + gap < ay0
    )


def merge_boxes(boxes: list[tuple[int, int, int, int]], gap: int) -> list[tuple[int, int, int, int]]:
    if not boxes:
        return []
    boxes = list(boxes)
    changed = True
    while changed:
        changed = False
        out: list[tuple[int, int, int, int]] = []
        used = [False] * len(boxes)
        for i, bi in enumerate(boxes):
            if used[i]:
                continue
            x0, y0, x1, y1 = bi
            used[i] = True
            grew = True
            while grew:
                grew = False
                for j, bj in enumerate(boxes):
                    if used[j]:
                        continue
                    if boxes_near((x0, y0, x1, y1), bj, gap):
                        used[j] = True
                        x0 = min(x0, bj[0])
                        y0 = min(y0, bj[1])
                        x1 = max(x1, bj[2])
                        y1 = max(y1, bj[3])
                        grew = True
                        changed = True
            out.append((x0, y0, x1, y1))
        boxes = out
    return boxes


def expand(box, w, h, pad=PAD):
    x0, y0, x1, y1 = box
    return (
        max(0, x0 - pad),
        max(0, y0 - pad),
        min(w, x1 + pad),
        min(h, y1 + pad),
    )


def category_for(stem: str) -> str:
    if stem in CATEGORY_MAP:
        return CATEGORY_MAP[stem]
    # fuzzy
    low = stem.lower()
    for k, v in CATEGORY_MAP.items():
        if k.lower() == low:
            return v
    return f"uncategorized/{slug(stem)}"


def slice_sheet(path: Path) -> list[dict]:
    im = Image.open(path).convert("RGBA")
    arr = np.array(im)
    h, w = arr.shape[:2]
    mask = is_fg(arr)
    boxes = connected_components(mask)
    boxes = merge_boxes(boxes, MERGE_GAP)
    # sort reading order
    boxes.sort(key=lambda b: (b[1] // 8, b[0], b[1]))

    cat = category_for(path.stem)
    out_dir = SPRITES / cat
    out_dir.mkdir(parents=True, exist_ok=True)
    base = slug(path.stem)
    entries = []
    for idx, box in enumerate(boxes, 1):
        x0, y0, x1, y1 = expand(box, w, h)
        crop = im.crop((x0, y0, x1, y1))
        # skip near-empty after crop
        c = np.array(crop)
        if is_fg(c).sum() < MIN_AREA:
            continue
        name = f"{base}_{idx:03d}.png"
        dest = out_dir / name
        crop.save(dest)
        entries.append(
            {
                "file": str(dest.relative_to(UI)).replace("\\", "/"),
                "sheet": path.name,
                "category": cat,
                "index": idx,
                "bbox": [x0, y0, x1, y1],
                "size": [x1 - x0, y1 - y0],
            }
        )
    return entries


def main():
    SHEETS.mkdir(parents=True, exist_ok=True)
    SPRITES.mkdir(parents=True, exist_ok=True)

    sheets = sorted(UI.glob("*.png"))
    if not sheets:
        # already moved?
        sheets = sorted(SHEETS.glob("*.png"))
        source_dir = SHEETS
        move_after = False
    else:
        source_dir = UI
        move_after = True

    # clean previous sprites for idempotency
    if SPRITES.exists():
        shutil.rmtree(SPRITES)
    SPRITES.mkdir(parents=True, exist_ok=True)

    all_entries = []
    by_cat: dict[str, int] = defaultdict(int)

    for path in sheets:
        print(f"slicing {path.name} ...", flush=True)
        entries = slice_sheet(path)
        all_entries.extend(entries)
        by_cat[category_for(path.stem)] += len(entries)
        if move_after:
            dest = SHEETS / path.name
            if dest.exists():
                dest.unlink()
            shutil.move(str(path), str(dest))
        print(f"  -> {len(entries)} sprites -> {category_for(path.stem)}")

    manifest = {
        "sheet_count": len(sheets),
        "sprite_count": len(all_entries),
        "categories": dict(sorted(by_cat.items())),
        "sprites": all_entries,
    }
    MANIFEST.write_text(json.dumps(manifest, indent=2, ensure_ascii=False), encoding="utf-8")
    print("\nDone.")
    print(f"sheets: {len(sheets)} -> {SHEETS}")
    print(f"sprites: {len(all_entries)} -> {SPRITES}")
    print(f"manifest: {MANIFEST}")
    for cat, n in sorted(by_cat.items()):
        print(f"  {cat}: {n}")


if __name__ == "__main__":
    main()
