"""Keep links between the author's two migrated books on the local site."""
import re
from urllib.parse import urlsplit

OLD = r'https://(?:kos0ng\.gitbook\.io|blog\.ryukk\.dev)/(?:ctfs|notes)(?=[/?#\s<>"\[\]()]|$)[^\s<>"\[\]()]*'
DEST = re.compile(r'(\]\(|\bhref=")(' + OLD + r')(?=[)"])')
AUTO = re.compile(r'<(' + OLD + r')>')
URL_LABEL = re.compile(r'\[(' + OLD + r')\](?=\()')


def target(url):
    u = urlsplit(url)
    parts = u.path.strip('/').removesuffix('.md').split('/')
    if parts[0] == 'ctfs':
        parts[0] = 'posts'
    return '/' + '/'.join(parts) + '/' + ('?' + u.query if u.query else '') + ('#' + u.fragment if u.fragment else '')


def label(url):
    return urlsplit(target(url)).path.rstrip('/').split('/')[-1].replace('-', ' ')


def localize_book_links(md):
    lines = []
    fence = ''
    for line in md.splitlines(keepends=True):
        marker = re.match(r'^\s*(`{3,}|~{3,})', line)
        if marker and not fence:
            fence = marker[1]
        elif fence and line.strip().startswith(fence) and not line.strip().strip(fence[0]):
            fence = ''
        elif not fence:
            line = URL_LABEL.sub(lambda m: '[' + label(m[1]) + ']', line)
            line = DEST.sub(lambda m: m[1] + target(m[2]), line)
            line = AUTO.sub(lambda m: '[' + label(m[1]) + '](' + target(m[1]) + ')', line)
        lines.append(line)
    return ''.join(lines)
