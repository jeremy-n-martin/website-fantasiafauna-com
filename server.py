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
BALANCE_LOG_FILE = ROOT / "balance_sessions.jsonl"
BUST_FILE = ROOT / "art_bust.json"
PORT = int(os.environ.get("PORT", "5500"))
ART_RE = re.compile(r"^img/(.+) (\d+)\.png$", re.IGNORECASE)
API_POST_PATHS = {"/api/art-rank", "/api/balance-log"}


def load_art_bust() -> dict:
    try:
        if BUST_FILE.is_file():
            data = json.loads(BUST_FILE.read_text(encoding="utf-8"))
            return data if isinstance(data, dict) else {}
    except (OSError, json.JSONDecodeError):
        pass
    return {}


def save_art_bust(base: str, bust: int) -> None:
    data = load_art_bust()
    data[base] = int(bust)
    BUST_FILE.write_text(json.dumps(data, ensure_ascii=False, indent=0) + "\n", encoding="utf-8")


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
        img_root = IMG_DIR.resolve()
        resolved.relative_to(img_root)
        return resolved
    except (OSError, ValueError):
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
        # Force un nouveau Last-Modified (sinon le cache navigateur garde l’ancienne n°1)
        now = time.time()
        os.utime(first, (now, now))
        os.utime(current, (now, now))
    except OSError as e:
        # best-effort rollback
        try:
            if tmp.is_file() and not first.is_file():
                tmp.rename(first)
        except OSError:
            pass
        return {"ok": False, "error": f"rename_failed:{e}"}

    bust = int(time.time() * 1000)
    try:
        save_art_bust(base, bust)
    except OSError:
        pass

    return {
        "ok": True,
        "swapped": True,
        "base": base,
        "from": num,
        "to": 1,
        "bust": bust,
        "art": f"img/{base} 1.png",
        "formerFirst": f"img/{base} {num}.png",
    }


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def end_headers(self):
        # Évite le cache agressif en local (surtout après swap d’images).
        path = urlparse(self.path).path
        if path.startswith("/api/") or path.startswith("/img/") or path.endswith("art_bust.json"):
            self.send_header("Cache-Control", "no-cache, no-store, must-revalidate")
            self.send_header("Pragma", "no-cache")
            self.send_header("Expires", "0")
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
        path = urlparse(self.path).path
        if path in API_POST_PATHS:
            self.send_response(204)
            self.send_header("Access-Control-Allow-Origin", "*")
            self.send_header("Access-Control-Allow-Methods", "POST, OPTIONS")
            self.send_header("Access-Control-Allow-Headers", "Content-Type")
            self.end_headers()
            return
        self.send_error(404)

    def do_POST(self):
        path = urlparse(self.path).path
        if path == "/api/balance-log":
            self._handle_balance_log()
            return
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

    def _handle_balance_log(self):
        """Append une session d’équilibre (JSONL) pour analyse IA / balance."""
        try:
            length = int(self.headers.get("Content-Length") or "0")
            raw = self.rfile.read(max(0, min(length, 512_000)))
            data = json.loads(raw.decode("utf-8") or "{}")
        except Exception:
            self._json(400, {"ok": False, "error": "invalid_json"})
            return
        if not isinstance(data, dict):
            self._json(400, {"ok": False, "error": "expected_object"})
            return
        ip = client_ip(self)
        ts = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
        entry = {
            "ts": ts,
            "ip": ip,
            **{k: v for k, v in data.items() if k not in ("ts", "ip")},
        }
        line = json.dumps(entry, ensure_ascii=False, separators=(",", ":")) + "\n"
        try:
            with BALANCE_LOG_FILE.open("a", encoding="utf-8") as f:
                f.write(line)
        except OSError:
            self._json(500, {"ok": False, "error": "write_failed"})
            return
        self._json(200, {"ok": True, "file": BALANCE_LOG_FILE.name, "bytes": len(line.encode("utf-8"))})

    def log_message(self, fmt, *args):
        # Garde les logs serveur discrets.
        if str(args[0]).startswith("POST"):
            super().log_message(fmt, *args)


def main():
    httpd = ThreadingHTTPServer(("0.0.0.0", PORT), Handler)
    print(f"Fantasia Fauna — http://localhost:{PORT}/")
    print(f"Promotion art (#1) -> {LOG_FILE}")
    print(f"Équilibre sessions -> {BALANCE_LOG_FILE}")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nArrêt.")


if __name__ == "__main__":
    main()
