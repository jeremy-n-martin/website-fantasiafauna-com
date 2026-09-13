"""Check that GitHub Pages direct routes load the same versioned app shell."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit, parse_qs

ROOT = Path(__file__).resolve().parents[1]

class Assets(HTMLParser):
    def __init__(self):
        super().__init__()
        self.urls = []

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == 'script' and attrs.get('src'):
            self.urls.append(attrs['src'])
        if tag == 'link' and attrs.get('rel') == 'stylesheet':
            self.urls.append(attrs['href'])


def main():
    shells = [(ROOT / name).read_text(encoding='utf-8') for name in ('index.html', '404.html')]
    assert shells[0] == shells[1], 'index.html and 404.html must serve the same application'
    for name, text in zip(('index.html', '404.html'), shells):
        assets = Assets()
        assets.feed(text)
        for path, version in {'/css/site.css': 'wallpapers1', '/js/app.js': 'nocitations1', '/js/theme.js': 'themes1'}.items():
            matches = [url for url in assets.urls if urlsplit(url).path == path]
            assert len(matches) == 1, (name, path, matches)
            assert parse_qs(urlsplit(matches[0]).query).get('v') == [version], (name, 'stale asset', matches)
        assert assets.urls[0] == '/js/theme.js?v=themes1', (name, 'theme must run before styles')
        assert '<script src="/js/theme.js?v=themes1"></script>' in text, (name, 'theme must be synchronous')
        for url in assets.urls:
            if url.startswith('/'):
                assert (ROOT / urlsplit(url).path.lstrip('/')).is_file(), (name, 'missing asset', url)
    print('PASS: identical Pages shells, fresh design assets and local script/style paths')


if __name__ == '__main__':
    main()
