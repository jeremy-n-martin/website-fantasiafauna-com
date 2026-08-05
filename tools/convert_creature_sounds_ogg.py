#!/usr/bin/env python3
"""Convertit sons/creatures/*.wav (souvent ADPCM) en OGG Vorbis lisible par le navigateur."""
from __future__ import annotations

import json
import subprocess
import sys
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SRC_DIR = ROOT / "sons" / "creatures"
CATALOG = ROOT / "creature_sounds.json"
FFMPEG = "ffmpeg"


def convert_one(src: Path) -> tuple[Path, bool, str]:
    dst = src.with_suffix(".ogg")
    cmd = [
        FFMPEG, "-y", "-hide_banner", "-loglevel", "error",
        "-i", str(src),
        "-ac", "1",
        "-ar", "22050",
        "-c:a", "libvorbis",
        "-q:a", "4",
        str(dst),
    ]
    try:
        r = subprocess.run(cmd, capture_output=True, text=True, timeout=60)
        if r.returncode != 0:
            return dst, False, (r.stderr or r.stdout or "ffmpeg fail")[:200]
        if not dst.exists() or dst.stat().st_size < 64:
            return dst, False, "empty output"
        return dst, True, ""
    except Exception as e:
        return dst, False, str(e)


def main() -> int:
    wavs = sorted(SRC_DIR.glob("*.wav"))
    if not wavs:
        print("Aucun WAV dans", SRC_DIR)
        return 1
    print(f"Conversion de {len(wavs)} fichiers…")
    ok = err = 0
    with ThreadPoolExecutor(max_workers=8) as pool:
        futs = {pool.submit(convert_one, w): w for w in wavs}
        for i, fut in enumerate(as_completed(futs), 1):
            dst, success, msg = fut.result()
            if success:
                ok += 1
            else:
                err += 1
                print("ERR", futs[fut].name, msg)
            if i % 50 == 0 or i == len(wavs):
                print(f"  {i}/{len(wavs)} (ok={ok} err={err})")
    # Met à jour le catalogue .wav → .ogg
    data = json.loads(CATALOG.read_text(encoding="utf-8"))
    changed = 0
    for entry in (data.get("byId") or {}).values():
        for key in ("attack", "defend", "move", "wince", "shoot"):
            p = entry.get(key)
            if isinstance(p, str) and p.lower().endswith(".wav"):
                entry[key] = p[:-4] + ".ogg"
                changed += 1
    data["note"] = (
        "Mapping créature → sons OGG (attack/defend/move/wince). "
        "Convertis depuis WAV ADPCM pour compatibilité navigateur."
    )
    CATALOG.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Catalogue: {changed} chemins mis a jour -> {CATALOG.name}")
    print(f"Termine: ok={ok} err={err}")
    return 0 if err == 0 else 2


if __name__ == "__main__":
    sys.exit(main())
