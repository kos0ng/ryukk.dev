"""Keep locally edited Challenge / Topic indexes when refreshing GitBook pages."""
import hashlib
import re


# GitBook exports some indexes as pipe tables and others as a single HTML line.
LEGACY_INDEX = re.compile(
    r'^\|[ \t]*Challenge(?: Name)?[ \t]*\|[ \t]*Link[ \t]*\|[ \t]*(?:\n\|[^\n]+)+'
    r'|^<table><thead><tr><th\b[^>]*>Challenge(?: Name)?</th><th\b[^>]*>Link</th></tr></thead>[^\n]*?</table>[ \t]*$',
    re.I | re.M,
)
CURATED_INDEX = re.compile(
    r'^<!-- challenge-index: ([0-9a-f]{16}) -->\n.*?^<!-- /challenge-index -->$', re.M | re.S
)


def fingerprint(table):
    return hashlib.sha256(table.encode('utf8')).hexdigest()[:16]


def retain_challenge_index(incoming, previous, url):
    curated = CURATED_INDEX.search(previous)
    if not curated:
        return incoming
    for table in LEGACY_INDEX.finditer(incoming):
        if fingerprint(table[0]) == curated[1]:
            return incoming[:table.start()] + curated[0] + incoming[table.end():]
    # Don't silently discard new upstream challenges or local topic research.
    raise ValueError('Challenge index changed upstream; review before replacing: ' + url)
