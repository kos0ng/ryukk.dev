"""Run with python3 -m unittest discover -s test."""
from pathlib import Path
import sys
import unittest

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / 'scripts'))
from gitbook_tables import fingerprint, retain_challenge_index


class ChallengeIndexTest(unittest.TestCase):
    def test_refresh_keeps_topics_but_updates_the_rest_of_the_article(self):
        for upstream in [
            '| Challenge | Link |\n| --- | --- |\n| Example | [Here](#example) |',
            '<table><thead><tr><th width="347">Challenge Name</th><th>Link</th></tr></thead><tbody><tr><td>Example</td><td>Here</td></tr></tbody></table>',
        ]:
            with self.subTest(upstream=upstream):
                block = (f'<!-- challenge-index: {fingerprint(upstream)} -->\n\n'
                         '| Challenge | Topic |\n| --- | --- |\n| [Example](#example) | AES |\n\n'
                         '<!-- /challenge-index -->')
                self.assertEqual(retain_challenge_index(upstream + '\n\nNew text', block + '\n\nOld text', 'example'),
                                 block + '\n\nNew text')
                with self.assertRaisesRegex(ValueError, 'example'):
                    retain_challenge_index(upstream.replace('Example', 'Changed'), block, 'example')

    def test_uncurated_page_is_unchanged(self):
        self.assertEqual(retain_challenge_index('New', 'Old', 'example'), 'New')
