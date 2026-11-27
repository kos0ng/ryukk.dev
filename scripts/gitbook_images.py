"""Local images for the optional legacy importer. Normal builds never download media."""
from hashlib import sha256
from html import unescape
from io import BytesIO
from pathlib import Path
import re
import subprocess
from urllib.parse import urlsplit, urlunsplit

# Some GitBook exports fence the entire figure as if it were a code sample.
# Only unwrap that exact single-figure artifact, not general code examples.
FIGURE_FENCE = re.compile(r'(?m)^([ \t]*)```[ \t]*\n\1(<figure><img src="https://[^"\n]+"[^\n]*?</figure>)[ \t]*\n\1```[ \t]*$')
IMAGE = re.compile(r'(<img\b[^>\n]*?\bsrc=")([^"\n]+)(")|(!\[[^\]\n]*\]\(<?)(https://[^\s<>)]+)(>?\))')
FENCE = re.compile(r'^\s*(`{3,}|~{3,})')
FORMATS = {'PNG': 'png', 'JPEG': 'jpg', 'GIF': 'gif', 'WEBP': 'webp'}


def download(url):
    return subprocess.check_output(['curl', '-fsSL', '--proto', '=https', '--proto-redir', '=https',
                                    '--max-filesize', str(40 * 1024**2), '--retry', '2', '--max-time', '60', url])


def save_image(url, directory, fetch=download):
    # The upload path identifies a GitBook object even if its access token rotates.
    u = urlsplit(url)
    if u.scheme != 'https' or not u.hostname:
        raise ValueError('Expected an HTTPS image URL')
    key = urlunsplit((u.scheme, u.netloc, u.path, '', '')) if u.hostname.endswith('-files.gitbook.io') else url
    stem = sha256(key.encode()).hexdigest()[:24]
    directory = Path(directory) / 'images'
    for ext in FORMATS.values():
        if (directory / f'{stem}.{ext}').is_file():
            return f'images/{stem}.{ext}'

    from PIL import Image  # only needed when importing uncached images
    data = fetch(url)
    with Image.open(BytesIO(data)) as img:
        ext = FORMATS[img.format]
        img.verify()
    directory.mkdir(parents=True, exist_ok=True)
    (directory / f'{stem}.{ext}').write_bytes(data)
    return f'images/{stem}.{ext}'


def localize_images(md, resolve):
    def replace(m):
        prefix, url, suffix = m.groups()[:3] if m[1] else m.groups()[3:]
        if not url.startswith('https://'):
            return m[0]
        return prefix + resolve(unescape(url)) + suffix

    lines = []
    fence = ''
    for line in FIGURE_FENCE.sub(r'\1\2', md).splitlines(keepends=True):
        marker = FENCE.match(line)
        if marker and not fence:
            fence = marker[1]
        elif fence and line.strip().startswith(fence) and not line.strip().strip(fence[0]):
            fence = ''
        elif not fence:
            line = IMAGE.sub(replace, line)
        lines.append(line)
    return ''.join(lines)
