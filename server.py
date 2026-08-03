#!/usr/bin/env python3
"""Serveur local Fantasia Fauna : fichiers statiques + vote art (IP + log)."""
from __future__ import annotations

import json
import os
from datetime import datetime, timezone
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parent
LOG_FILE = ROOT / "art_ranks.log"
PORT = int(os.environ.get("PORT", "5500"))


def client_ip(handler: SimpleHTTPRequestHandler) -> str:
    forwarded = handler.headers.get("X-Forwarded-For") or handler.headers.get("X-Real-IP")
    if forwarded:
        return forwarded.split(",")[0].strip()
    return handler.client_address[0]


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def end_headers(self):
        # Évite le cache agressif en local pendant le dev.
        if self.path.startswith("/api/"):
            self.send_header("Cache-Control", "no-store")
        super().end_headers()

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
            self.send_response(400)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
            self.wfile.write(b'{"ok":false,"error":"invalid_json"}')
            return

        rank = data.get("rank")
        try:
            rank = int(rank)
        except (TypeError, ValueError):
            rank = None
        if rank not in (1, 2, 3):
            self.send_response(400)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
            self.wfile.write(b'{"ok":false,"error":"rank_must_be_1_2_or_3"}')
            return

        creature = str(data.get("creature") or data.get("name") or "?").replace("\t", " ").strip()[:120]
        art = str(data.get("art") or "").replace("\t", " ").strip()[:240]
        cid = data.get("id", "")
        ip = client_ip(self)
        ts = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
        line = f"{ts}\trank={rank}\tcreature={creature}\tid={cid}\tart={art}\tip={ip}\n"

        try:
            with LOG_FILE.open("a", encoding="utf-8") as f:
                f.write(line)
        except OSError:
            self.send_response(500)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
            self.wfile.write(b'{"ok":false,"error":"write_failed"}')
            return

        body = json.dumps({"ok": True, "ip": ip}).encode("utf-8")
        self.send_response(200)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def log_message(self, fmt, *args):
        # Garde les logs serveur discrets.
        if str(args[0]).startswith("POST"):
            super().log_message(fmt, *args)


def main():
    httpd = ThreadingHTTPServer(("0.0.0.0", PORT), Handler)
    print(f"Fantasia Fauna — http://localhost:{PORT}/")
    print(f"Votes art -> {LOG_FILE}")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nArrêt.")


if __name__ == "__main__":
    main()
