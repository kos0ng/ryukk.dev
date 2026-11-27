"""Recover the original TeX: GitBook's Markdown export escapes subscripts and
can even turn a line starting with a minus sign into a Markdown bullet."""
from html.parser import HTMLParser
import re


class DisplayEquations(HTMLParser):
    def __init__(self):
        super().__init__()
        self.display = self.capture = False
        self.equations = []

    def handle_starttag(self, tag, attrs):
        if tag == 'math':
            self.display = dict(attrs).get('display') == 'block'
        elif tag == 'annotation' and self.display and dict(attrs).get('encoding') == 'application/x-tex':
            self.capture = True
            self.equations.append('')

    def handle_data(self, data):
        if self.capture:
            self.equations[-1] += data

    def handle_endtag(self, tag):
        if tag == 'annotation':
            self.capture = False
        elif tag == 'math':
            self.display = False


def display_ranges(lines):
    fence = start = None
    raw_pre = False
    for i, line in enumerate(lines):
        stripped = line.strip()
        if start is not None:
            if stripped == '$$':
                yield start, i
                start = None
        elif fence:
            if stripped.startswith(fence) and not stripped.strip(fence[0]):
                fence = None
        elif raw_pre or re.match(r'^<pre\b', stripped):
            raw_pre = '</pre>' not in line
        elif marker := re.match(r'^(`{3,}|~{3,})', stripped):
            fence = marker[1]
        elif stripped == '$$':
            start = i + 1


def restore_equations(md, load_html, url):
    lines = md.splitlines(keepends=True)
    ranges = list(display_ranges(lines))
    if not ranges:
        return md
    reader = DisplayEquations()
    reader.feed(load_html())
    reader.close()
    if len(reader.equations) != len(ranges):
        raise ValueError('Cannot match exported equations to original TeX: ' + url)
    for (start, end), tex in reversed(list(zip(ranges, reader.equations))):
        # In display mode, explicit line breaks need a multiline environment.
        tex = tex.strip().removesuffix(r'\\').rstrip()
        if re.search(r'\\\\[ \t]*\n', tex) and r'\begin{' not in tex:
            tex = '\\begin{gathered}\n' + tex + '\n\\end{gathered}'
        lines[start:end] = [tex + '\n']
    return ''.join(lines)
