import { cpSync, existsSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'

// Public builds never render private Markdown or need a password.
export function lockedArticle(page) {
  const dir = join('books', page.section, page.dir)
  const payload = join(dir, 'note.locked')
  if (!existsSync(payload)) return null
  if (page.source.trim() !== '# ' + page.title || existsSync(join(dir, 'images'))) {
    throw Error('Locked pages must contain only a public title and ciphertext: ' + page.url)
  }
  const destination = join('public', page.url)
  mkdirSync(destination, { recursive: true })
  cpSync(payload, join(destination, 'note.locked'))
  return { toc: '', body: `<section class="locked-note">
<p>This note and its illustrations are encrypted. Enter the shared password to read them.</p>
<form hidden><label>Note password <input type="password" autocomplete="current-password" required></label>
<button type="submit">Unlock note</button></form>
<p role="status" aria-live="polite"></p>
<noscript>Enable JavaScript to decrypt this note in your browser.</noscript></section>
<div class="unlocked-note" hidden><button type="button">Lock note</button><div class="private-body"></div></div>
<script type="module" src="/unlock-note.js"></script>` }
}
