from pathlib import Path
import sys
import unittest

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / 'scripts'))
from gitbook_links import localize_book_links


class LocalBookLinksTest(unittest.TestCase):
    def test_old_hosts_link_locally_without_changing_external_sources_or_code(self):
        note = 'https://kos0ng.gitbook.io/notes/research/example.md?mode=reader#solution'
        post = 'https://blog.ryukk.dev/ctfs'
        outside = 'https://other.gitbook.io/notes'
        code = '```md\n[Example](' + note + ')\n```'
        source = f'[{note}]({note}) <{post}> <a href="{post}">Posts</a> [Source]({outside})\n{code}'
        self.assertEqual(localize_book_links(source),
                         f'[example](/notes/research/example/?mode=reader#solution) [posts](/posts/) <a href="/posts/">Posts</a> [Source]({outside})\n{code}')
