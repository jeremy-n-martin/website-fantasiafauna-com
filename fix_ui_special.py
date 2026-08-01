#!/usr/bin/env python3
"""Fix special cases: shadows, candle strips, pan animation sheets."""
from __future__ import annotations

import re
from pathlib import Path

import numpy as np
from PIL import Image
from scipy import ndimage

UI = Path("ui")
SHEETS = UI / "_sheets"
SPRITES = UI / "sprites"


def slug(s: str) -> str:
    s = s.strip().lower()
    s = re.sub(r"[^\w\-]+", "-", s, flags=re.UNICODE)
    return re.sub(r"-+", "-", s).strip("-")


def clear_stem(out_dir: Path, stem: str) -> None:
    base = slug(stem)
    for old in out_dir.glob(f"{base}_*.png"):
        old.unlink()


def save_boxes(im: Image.Image, boxes, out_dir: Path, stem: str) -> int:
    out_dir.mkdir(parents=True, exist_ok=True)
    clear_stem(out_dir, stem)
    base = slug(stem)
    boxes = sorted(boxes, key=lambda b: (b[1] // 4, b[0], b[1]))
    n = 0
    for idx, (x0, y0, x1, y1) in enumerate(boxes, 1):
        crop = im.crop((x0, y0, x1, y1))
        crop.save(out_dir / f"{base}_{idx:03d}.png")
        n += 1
    return n


def slice_mask(path: Path, cat: str, *, bg_thresh=12, merge_gap=0, min_area=4) -> int:
    im = Image.open(path).convert("RGBA")
    arr = np.array(im)
    r, g, b, a = arr[..., 0], arr[..., 1], arr[..., 2], arr[..., 3]
    if bg_thresh is None:
        mask = (a > 0) & ~((r == 0) & (g == 0) & (b == 0))
    else:
        dark = (r <= bg_thresh) & (g <= bg_thresh) & (b <= bg_thresh)
        mask = (a > 8) & (~dark)

    labeled, _ = ndimage.label(mask, structure=np.ones((3, 3), dtype=int))
    objects = ndimage.find_objects(labeled)
    boxes = []
    for i, slc in enumerate(objects, 1):
        if slc is None:
            continue
        ys, xs = slc
        area = int((labeled[ys, xs] == i).sum())
        if area < min_area:
            continue
        boxes.append((xs.start, ys.start, xs.stop, ys.stop))

    if merge_gap > 0 and boxes:
        changed = True
        while changed:
            changed = False
            out = []
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
                        ax0, ay0, ax1, ay1 = x0, y0, x1, y1
                        bx0, by0, bx1, by1 = bj
                        near = not (
                            ax1 + merge_gap < bx0
                            or bx1 + merge_gap < ax0
                            or ay1 + merge_gap < by0
                            or by1 + merge_gap < ay0
                        )
                        if near:
                            used[j] = True
                            x0, y0 = min(x0, bx0), min(y0, by0)
                            x1, y1 = max(x1, bx1), max(y1, by1)
                            grew = True
                            changed = True
                out.append((x0, y0, x1, y1))
            boxes = out

    n = save_boxes(im, boxes, SPRITES / cat, path.stem)
    print(f"{path.name}: {n} -> {cat}")
    return n


def slice_grid(path: Path, cat: str, fw: int, fh: int, min_area=2) -> int:
    im = Image.open(path).convert("RGBA")
    arr = np.array(im)
    h, w = arr.shape[:2]
    r, g, b, a = arr[..., 0], arr[..., 1], arr[..., 2], arr[..., 3]
    dark = (r <= 12) & (g <= 12) & (b <= 12)
    mask = (a > 8) & (~dark)
    cols, rows = w // fw, max(1, h // fh)
    boxes = []
    for row in range(rows):
        for col in range(cols):
            x0, y0 = col * fw, row * fh
            x1, y1 = x0 + fw, y0 + fh
            if mask[y0:y1, x0:x1].sum() < min_area:
                continue
            boxes.append((x0, y0, x1, y1))
    n = save_boxes(im, boxes, SPRITES / cat, path.stem)
    print(f"{path.name} [grid {fw}x{fh}]: {n} -> {cat}")
    return n


def main():
    slice_mask(SHEETS / "Shadows.png", "effects/shadows", bg_thresh=None, merge_gap=1, min_area=4)

    for name in [
        "Candle 1.png",
        "Candle 2.png",
        "Candle 3.png",
        "candle 4.png",
        "Candle 5.png",
        "Candle 6.png",
        "candle.png",
    ]:
        im = Image.open(SHEETS / name)
        w, h = im.size
        fw, fh = 16, 16 if h >= 16 else h
        slice_grid(SHEETS / name, "candles", fw, fh)

    for name in [
        "Pan_01-Sheet.png",
        "Pan_02-Sheet.png",
        "Pan_03-Sheet.png",
        "Pan_04-Sheet.png",
        "Pan_05-Sheet.png",
    ]:
        im = Image.open(SHEETS / name)
        w, h = im.size
        fw = 32 if w % 32 == 0 else 16
        fh = 32 if h >= 32 else h
        slice_grid(SHEETS / name, "kitchen/pans", fw, fh)


if __name__ == "__main__":
    main()
