"""Offline migration integrity check. Run after npm run build."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urljoin, urlsplit, unquote


class Page(HTMLParser):
    def __init__(self, path):
        super().__init__()
        self.ids = set()
        self.links = []
        self.feed(path.read_text(encoding='utf8'))

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if 'id' in attrs:
            self.ids.add(attrs['id'])
        for key in ('href', 'src'):
            if key in attrs:
                self.links.append(attrs[key])


public = Path('public')
pages = {p: Page(p) for p in public.rglob('*.html')}
sources = list(Path('books').rglob('index.md'))
expected = {public / p.relative_to('books').with_suffix('.html') for p in sources}
expected.update(public / p for p in ('index.html', 'posts/index.html', 'notes/index.html'))
# Static redirects exist on hosts that do not apply Netlify's HTTP redirects.
for note in list(expected):
    if note.is_relative_to(public / 'notes'):
        alias = public / 'shelves' / note.relative_to(public / 'notes')
        target = '/' + note.parent.relative_to(public).as_posix() + '/'
        if alias not in pages or target not in pages[alias].links:
            raise SystemExit(f'Missing redirect from {alias} to {target}')
        expected.add(alias)
if expected != pages.keys():
    raise SystemExit(f'Page inventory mismatch: {expected.symmetric_difference(pages)}')
errors = []
for path, page in pages.items():
    base = '/' + path.parent.relative_to(public).as_posix() + '/'
    for link in page.links:
        u = urlsplit(urljoin(base, link))
        if u.netloc or u.scheme:
            continue
        target = public / unquote(u.path).lstrip('/')
        if target.is_dir():
            target /= 'index.html'
        if not target.is_file() or (u.fragment and target in pages and unquote(u.fragment) not in pages[target].ids):
            errors.append(f'{path}: {link}')
if errors:
    raise SystemExit('\n'.join(errors))
print(f'Checked {len(sources)} Markdown documents, {len(pages)} pages and their local links.')
