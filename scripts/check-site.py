"""Offline migration integrity check. Run after npm run build."""
from html.parser import HTMLParser
from pathlib import Path
import re
from urllib.parse import urljoin, urlsplit, unquote


class Page(HTMLParser):
    def __init__(self, path):
        super().__init__()
        self.ids = set()
        self.links = []
        self.resources = []
        self.feed(path.read_text(encoding='utf8'))

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if 'id' in attrs:
            self.ids.add(attrs['id'])
        if 'src' in attrs:
            self.resources.append(attrs['src'])
        if tag == 'link' and set(attrs.get('rel', '').split()) & {'icon', 'stylesheet', 'preload'}:
            self.resources.append(attrs['href'])
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
        alias_url = '/' + alias.relative_to(public).as_posix()
        if alias not in pages or not any(urljoin(alias_url, link) == target for link in pages[alias].links):
            raise SystemExit(f'Missing redirect from {alias} to {target}')
        expected.add(alias)
if expected != pages.keys():
    raise SystemExit(f'Page inventory mismatch: {expected.symmetric_difference(pages)}')
errors = []
# Outbound references are fine; resources required to render a page must ship
# with it. Include CSS dependencies (hero artwork, web fonts and KaTeX fonts).
checks = [(p, page.links, page.resources) for p, page in pages.items()]
for css in public.rglob('*.css'):
    urls = [s.strip().strip('\"\'') for s in re.findall(r'url\(([^)]+)\)', css.read_text())]
    checks.append((css, urls, urls))
for path, links, resources in checks:
    base = '/' + path.relative_to(public).as_posix()
    for resource in resources:
        u = urlsplit(resource)
        if u.netloc or (u.scheme and u.scheme != 'data'):
            errors.append(f'{path}: external render resource {resource}')
    for link in links:
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
