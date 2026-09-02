# -*- coding: utf-8 -*-
from pathlib import Path
from PIL import Image

root = Path(__file__).resolve().parents[1]
files = [
    "Dragon rouge 1.png", "Dragon rouge 2.png",
    "Aboleth 1.png", "Aboleth 2.png",
    "Fantôme 1.png", "Fantôme 2.png",
    "Dryade 1.png", "Dryade 2.png",
    "Golem 1.png", "Golem 2.png",
    "Aasimar 1.png", "Aasimar 2.png",
]

for name in files:
    path = root / "img" / name
    im = Image.open(path).convert("RGBA")
    w, h = im.size
    px = im.load()
    minx, miny, maxx, maxy = w, h, 0, 0
    opaque = 0
    r_sum = g_sum = b_sum = 0
    bottom_xs = []
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if a < 24:
                continue
            opaque += 1
            r_sum += r
            g_sum += g
            b_sum += b
            if x < minx: minx = x
            if y < miny: miny = y
            if x > maxx: maxx = x
            if y > maxy: maxy = y
    band = max(1, int((maxy - miny) * 0.08))
    for y in range(max(miny, maxy - band), maxy + 1):
        for x in range(minx, maxx + 1):
            if px[x, y][3] >= 40:
                bottom_xs.append(x)
    cx = (sum(bottom_xs) / len(bottom_xs)) if bottom_xs else (minx + maxx) / 2
    avg = (r_sum / opaque, g_sum / opaque, b_sum / opaque) if opaque else (0, 0, 0)
    print(
        "{0}: bbox=({1:.3f},{2:.3f})-({3:.3f},{4:.3f}) ground=({5:.3f},{6:.3f}) rgb=({7:.0f},{8:.0f},{9:.0f})".format(
            name,
            minx / w, miny / h, maxx / w, maxy / h,
            cx / w, maxy / h,
            avg[0], avg[1], avg[2],
        )
    )
