from pathlib import Path
import sys
import unittest

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / 'scripts'))
from gitbook_images import localize_images, save_image
from tempfile import TemporaryDirectory


class ImageMigrationTest(unittest.TestCase):
    def test_restore_exported_figure_and_preserve_other_code_and_outbound_links(self):
        figure = '<figure><img src="https://example.org/fig?x=1&amp;y=2" alt="diagram"><figcaption>Caption</figcaption></figure>'
        code = '```html\n' + figure + '\n```\n'
        source = '  ```\n  ' + figure + '\n  ```\n' + code + '![Diagram](https://example.org/fig2) [Source](https://example.org/)\n'
        seen = []
        def resolve(url):
            seen.append(url)
            return 'images/test.png'
        result = localize_images(source, resolve)
        self.assertEqual(seen, ['https://example.org/fig?x=1&y=2', 'https://example.org/fig2'])
        self.assertIn('  <figure><img src="images/test.png" alt="diagram"><figcaption>Caption', result)
        self.assertIn(code, result)
        self.assertIn('![Diagram](images/test.png) [Source](https://example.org/)', result)

    def test_refresh_reuses_local_upload_even_if_token_changes(self):
        from hashlib import sha256
        url = 'https://123-files.gitbook.io/upload/image.png'
        with TemporaryDirectory() as d:
            key = sha256(url.encode()).hexdigest()[:24]
            rel = 'images/' + key + '.png'
            (Path(d) / 'images').mkdir()
            (Path(d) / rel).touch()
            self.assertEqual(save_image(url + '?alt=media&token=new', d, self.fail), rel)
