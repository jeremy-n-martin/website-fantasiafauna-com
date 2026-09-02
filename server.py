from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import urllib.parse

ROOT = Path(__file__).resolve().parent


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        relative = urllib.parse.unquote(parsed.path.lstrip("/"))
        target = (ROOT / relative).resolve() if relative else ROOT
        try:
            target.relative_to(ROOT)
            is_file = target.is_file()
        except ValueError:
            is_file = False
        if not is_file and "." not in Path(parsed.path).name:
            self.path = "/index.html"
        return SimpleHTTPRequestHandler.do_GET(self)


if __name__ == "__main__":
    port = 8080
    httpd = ThreadingHTTPServer(("127.0.0.1", port), Handler)
    print("http://127.0.0.1:%s/" % port, flush=True)
    httpd.serve_forever()
