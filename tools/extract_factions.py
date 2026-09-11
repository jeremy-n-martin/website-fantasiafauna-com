# -*- coding: utf-8 -*-
"""Extrait la table nom → faction depuis le dernier catalogue du jeu."""
from __future__ import annotations

import json
import re
import subprocess
import unicodedata
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "data" / "factions.json"
SOURCE_REVISION = "3b2e3dd:creatures-data.js"


def slugify(name: str) -> str:
    text = "".join(
        char
        for char in unicodedata.normalize("NFD", name)
        if unicodedata.category(char) != "Mn"
    ).lower()
    text = text.replace("'", "-")
    return re.sub(r"[^a-z0-9]+", "-", text).strip("-")


def main() -> None:
    source = subprocess.check_output(
        ["git", "show", SOURCE_REVISION],
        cwd=ROOT,
        text=True,
        encoding="utf-8",
    )
    pairs = re.findall(
        r'"name"\s*:\s*"([^"]+)"[\s\S]*?"capital"\s*:\s*"([^"]+)"',
        source,
    )
    current_slugs = {
        slugify(match.group(1).replace("_", "'"))
        for path in (ROOT / "img").glob("*.png")
        if (match := re.match(r"^(.*) [12]\.png$", path.name, re.I))
    }
    factions = {
        slugify(name): capital
        for name, capital in pairs
        if slugify(name) in current_slugs
    }
    payload = {
        "source": SOURCE_REVISION,
        "factions": factions,
    }
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT.write_text(
        json.dumps(payload, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    print(f"factions={len(set(factions.values()))} creatures={len(factions)}")


if __name__ == "__main__":
    main()
