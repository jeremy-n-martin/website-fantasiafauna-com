#!/usr/bin/env python3
"""Serveur local Fantasia Fauna : fichiers statiques + promotion art (#1)."""
from __future__ import annotations

import json
import os
import re
import time
from datetime import datetime, timezone
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parent
IMG_DIR = ROOT / "img"
LOG_FILE = ROOT / "art_ranks.log"
PORT = int(os.environ.get("PORT", "5500"))
ART_RE = re.compile(r"^img/(.+) (\d+)\.png$", re.IGNORECASE)


def client_ip(handler: SimpleHTTPRequestHandler) -> str:
    forwarded = handler.headers.get("X-Forwarded-For") or handler.headers.get("X-Real-IP")
    if forwarded:
        return forwarded.split(",")[0].strip()
    return handler.client_address[0]


def parse_art_path(art: str) -> tuple[str, int] | None:
    art = (art or "").replace("\\", "/").strip()
    # ignore cache-bust query
    art = art.split("?", 1)[0]
    m = ART_RE.match(art)
    if not m:
        return None
    base, num = m.group(1), int(m.group(2))
    if not base or num < 1 or ".." in base or "/" in base or "\\" in base:
        return None
    return base, num


def safe_img_file(base: str, num: int) -> Path | None:
    path = IMG_DIR / f"{base} {num}.png"
    try:
        resolved = path.resolve()
        if not str(resolved).startswith(str(IMG_DIR.resolve())):
            return None
        return resolved
    except OSError:
        return None


def promote_art_to_first(art: str) -> dict:
    """Échange le fichier courant avec « Base 1.png ». No-op si déjà #1."""
    parsed = parse_art_path(art)
    if not parsed:
        return {"ok": False, "error": "bad_art_path"}
    base, num = parsed
    current = safe_img_file(base, num)
    first = safe_img_file(base, 1)
    if current is None or first is None:
        return {"ok": False, "error": "unsafe_path"}
    if not current.is_file():
        return {"ok": False, "error": "missing_current"}
    if num == 1:
        return {
            "ok": True,
            "swapped": False,
            "base": base,
            "from": 1,
            "to": 1,
            "art": f"img/{base} 1.png",
        }
    if not first.is_file():
        return {"ok": False, "error": "missing_first"}

    tmp = IMG_DIR / f"{base} __swap_{os.getpid()}_{int(time.time() * 1000)}.png"
    try:
        first.rename(tmp)
        current.rename(first)
        tmp.rename(current)
    except OSError as e:
        # best-effort rollback
        try:
            if tmp.is_file() and not first.is_file():
                tmp.rename(first)
        except OSError:
            pass
        return {"ok": False, "error": f"rename_failed:{e}"}

    return {
        "ok": True,
        "swapped": True,
        "base": base,
        "from": num,
        "to": 1,
        "art": f"img/{base} 1.png",
        "formerFirst": f"img/{base} {num}.png",
    }


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def end_headers(self):
        # Évite le cache agressif en local pendant le dev.
        if self.path.startswith("/api/"):
            self.send_header("Cache-Control", "no-store")
        super().end_headers()

    def _json(self, code: int, payload: dict):
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(code)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_OPTIONS(self):
        if urlparse(self.path).path == "/api/art-rank":
            self.send_response(204)
            self.send_header("Access-Control-Allow-Origin", "*")
            self.send_header("Access-Control-Allow-Methods", "POST, OPTIONS")
            self.send_header("Access-Control-Allow-Headers", "Content-Type")
            self.end_headers()
            return
        self.send_error(404)

    def do_POST(self):
        path = urlparse(self.path).path
        if path != "/api/art-rank":
            self.send_error(404)
            return
        try:
            length = int(self.headers.get("Content-Length") or "0")
            raw = self.rfile.read(max(0, min(length, 8192)))
            data = json.loads(raw.decode("utf-8") or "{}")
        except Exception:
            self._json(400, {"ok": False, "error": "invalid_json"})
            return

        # Nouveau comportement : promouvoir l’image courante en #1 (swap avec 1).
        # rank=1 conservé pour compat ; tout autre rank est refusé.
        rank = data.get("rank", 1)
        try:
            rank = int(rank)
        except (TypeError, ValueError):
            rank = None
        if rank != 1:
            self._json(400, {"ok": False, "error": "rank_must_be_1"})
            return

        creature = str(data.get("creature") or data.get("name") or "?").replace("\t", " ").strip()[:120]
        art = str(data.get("art") or "").replace("\t", " ").strip()[:240]
        cid = data.get("id", "")
        ip = client_ip(self)
        ts = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")

        result = promote_art_to_first(art)
        if not result.get("ok"):
            self._json(400, result)
            return

        line = (
            f"{ts}\tpromote=1\tcreature={creature}\tid={cid}\tart={art}"
            f"\tfrom={result.get('from')}\tto=1\tswapped={result.get('swapped')}\tip={ip}\n"
        )
        try:
            with LOG_FILE.open("a", encoding="utf-8") as f:
                f.write(line)
        except OSError:
            self._json(500, {"ok": False, "error": "write_failed"})
            return

        result["ip"] = ip
        self._json(200, result)

    def log_message(self, fmt, *args):
        # Garde les logs serveur discrets.
        if str(args[0]).startswith("POST"):
            super().log_message(fmt, *args)


def main():
    httpd = ThreadingHTTPServer(("0.0.0.0", PORT), Handler)
    print(f"Fantasia Fauna — http://localhost:{PORT}/")
    print(f"Promotion art (#1) -> {LOG_FILE}")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nArrêt.")


if __name__ == "__main__":
    main()
