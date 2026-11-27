"""Make a verified public/ build portable between a Pages project URL and a custom domain."""
from pathlib import Path
import re
import sys
from urllib.parse import urlsplit
from xml.etree import ElementTree as ET


def prepare(root, site_url):
    for page in root.rglob('*.html'):
        # All pages are directory indexes. Relative URLs work both before and
        # after a domain change, without modifying external links or fragments.
        prefix = '../' * len(page.parent.relative_to(root).parts) or './'

        def tag_urls(match):
            return re.sub(r'( (?:href|src)="| content="0;url=)/(?!/)',
                          lambda attr: attr[1] + prefix, match[0])

        html = page.read_text(encoding='utf8')
        page.write_text(re.sub(r'<(?:a|link|script|img|meta)\b[^<>]*>', tag_urls, html), encoding='utf8')

    sitemap = root / 'sitemap.xml'
    ns = 'http://www.sitemaps.org/schemas/sitemap/0.9'
    ET.register_namespace('', ns)
    xml = ET.parse(sitemap)
    for loc in xml.iter(f'{{{ns}}}loc'):
        loc.text = site_url.rstrip('/') + urlsplit(loc.text).path
    xml.write(sitemap, encoding='utf-8', xml_declaration=True)


if __name__ == '__main__':
    prepare(Path('public'), sys.argv[1])
