"""Refresh the Markdown archive from the public GitBook sitemaps."""
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
import re
import html
from urllib.parse import urlparse, parse_qs
import subprocess
from functools import cache
from gitbook_math import restore_equations
from gitbook_images import localize_images, save_image
from gitbook_tables import retain_challenge_index
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1] / 'books'
BASE = 'https://kos0ng.gitbook.io/'


def get(url):
    return subprocess.check_output(['curl', '-fsSL', '--retry', '3', '--max-time', '60', url]).decode()


def fix_images(md, url, load_html):
    # Some exports use opaque /files/ IDs. The public reader exposes the real
    # storage URLs in the same sequence as the exported figures.
    if 'src="/files/' not in md:
        return md
    figures = list(re.finditer(r'<figure>\s*<img src="([^"]+)"', md))
    tags = re.findall(r'<img [^>]*data-testid="zoom-image"[^>]*>', load_html())
    if len(tags) != len(figures):
        raise ValueError('Cannot match exported figures: ' + url)
    for match, tag in reversed(list(zip(figures, tags))):
        if match[1].startswith('/files/'):
            src = html.unescape(re.search(r' src="([^"]+)"', tag)[1])
            asset = parse_qs(urlparse(src).query).get('url', [src])[0]
            md = md[:match.start(1)] + html.escape(asset, quote=True) + md[match.end(1):]
    return md


def save(job):
    url, path = job
    md = get(url + '.md')
    md = re.sub(r'^> For the complete documentation index,[^\n]*\n+', '', md)
    if md.startswith('# Page Not Found') or not re.search(r'^# .+', md, re.M):
        raise ValueError('Invalid Markdown: ' + url)
    path.parent.mkdir(parents=True, exist_ok=True)
    @cache
    def load_html():
        return get(url)

    md = restore_equations(md, load_html, url)
    if path.exists():
        md = retain_challenge_index(md, path.read_text(encoding='utf8'), url)
    md = fix_images(md, url, load_html)
    md = localize_images(md, lambda src: save_image(src, path.parent))
    path.write_text(md, encoding='utf8')


if __name__ == '__main__':
    jobs = []
    for book, section in [('ctfs', 'posts'), ('notes', 'notes')]:
        base = BASE + book
        xml = ET.fromstring(get(base + '/sitemap-pages.xml'))
        for loc in xml.findall('.//{*}loc'):
            slug = loc.text.removeprefix(base).strip('/')
            if not re.fullmatch(r'[a-zA-Z0-9_./-]*', slug) or '..' in slug.split('/'):
                raise ValueError(loc.text)
            # GitBook lists each landing page at the bare book URL, but
            # serves its Markdown at introduction.md (see llms.txt).
            slug = slug or 'introduction'
            jobs.append((base + '/' + slug, ROOT / section / slug / 'index.md'))
    with ThreadPoolExecutor(8) as pool:
        list(pool.map(save, jobs))
    print(f'Saved {len(jobs)} Markdown pages.')
