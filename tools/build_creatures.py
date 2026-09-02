# -*- coding: utf-8 -*-
"""Génère le manifeste des créatures et les miniatures du catalogue."""
from __future__ import annotations

import json
import re
import unicodedata
from collections import defaultdict
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
IMG = ROOT / "img"
THUMBS = ROOT / "thumbs"
DATA_JS = ROOT / "js" / "creatures-data.js"
REPORT = ROOT / "data" / "associations.md"
THUMB_SIZE = 240


def strip_accents(text: str) -> str:
    return "".join(
        ch for ch in unicodedata.normalize("NFD", text) if unicodedata.category(ch) != "Mn"
    )


def display_name(stem: str) -> str:
    name = stem.replace("_", "'")
    name = re.sub(r"\s+", " ", name).strip()
    return name


def slugify(name: str) -> str:
    s = strip_accents(name).lower()
    s = s.replace("'", "-")
    s = re.sub(r"[^a-z0-9]+", "-", s)
    return s.strip("-")


def search_key(name: str) -> str:
    return strip_accents(name).lower()


def main() -> None:
    files = sorted(p for p in IMG.iterdir() if p.is_file() and p.suffix.lower() == ".png")
    pat = re.compile(r"^(.*) (\d+)\.png$", re.I)
    groups: dict[str, dict[int, Path]] = defaultdict(dict)
    unmatched: list[str] = []

    for path in files:
        match = pat.match(path.name)
        if not match:
            unmatched.append(path.name)
            continue
        groups[match.group(1)][int(match.group(2))] = path

    THUMBS.mkdir(parents=True, exist_ok=True)
    (ROOT / "js").mkdir(exist_ok=True)
    (ROOT / "data").mkdir(exist_ok=True)

    creatures = []
    used_slugs: dict[str, str] = {}
    ambiguous: list[str] = []

    for stem in sorted(groups, key=lambda n: search_key(display_name(n))):
        variants = groups[stem]
        name = display_name(stem)
        slug = slugify(name)
        if slug in used_slugs:
            n = 2
            while f"{slug}-{n}" in used_slugs:
                n += 1
            base = slug
            slug = f"{slug}-{n}"
            ambiguous.append(
                f"- Collision de slug pour « {name} » (base « {base} » déjà utilisée par « {used_slugs[base]} »)."
            )
        used_slugs[slug] = name

        nums = sorted(variants)
        if nums != [1, 2]:
            ambiguous.append(f"- « {name} » : numéros {nums} au lieu de 1 et 2.")

        images = []
        for i, num in enumerate(nums, start=1):
            src = variants[num]
            rel = f"img/{src.name}"
            thumb_name = f"{slug}-{i}.png"
            thumb_path = THUMBS / thumb_name
            im = Image.open(src).convert("RGBA")
            im.resize((THUMB_SIZE, THUMB_SIZE), Image.Resampling.NEAREST).save(thumb_path, "PNG")
            images.append({"src": rel.replace("\\", "/"), "thumb": f"thumbs/{thumb_name}"})

        creatures.append(
            {
                "id": slug,
                "name": name,
                "slug": slug,
                "search": search_key(name),
                "images": images,
            }
        )

    payload = {
        "generatedFrom": "img/",
        "count": len(creatures),
        "creatures": creatures,
    }
    DATA_JS.write_text(
        "window.FF_DATA = " + json.dumps(payload, ensure_ascii=False, indent=2) + ";\n",
        encoding="utf-8",
    )

    lines = [
        "# Associations d'images",
        "",
        f"{len(files)} fichiers PNG, {len(groups)} groupes, {len(unmatched)} fichiers non associés.",
        "",
    ]
    if unmatched:
        lines.append("## Fichiers non associés")
        lines.extend(f"- `{name}`" for name in unmatched)
        lines.append("")
    if ambiguous:
        lines.append("## Ambiguïtés")
        lines.extend(ambiguous)
        lines.append("")
    else:
        lines.append("Aucune association ambiguë : chaque créature possède exactement deux vues numérotées 1 et 2.")
        lines.append("")
    REPORT.write_text("\n".join(lines), encoding="utf-8")
    print(f"creatures={len(creatures)} unmatched={len(unmatched)} ambiguous={len(ambiguous)}")


if __name__ == "__main__":
    main()
