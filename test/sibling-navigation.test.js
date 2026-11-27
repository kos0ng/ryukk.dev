import test from 'node:test'
import assert from 'node:assert/strict'
import MarkdownIt from 'markdown-it'
import { indexSiblings, siblingNav } from '../scripts/sibling-navigation.js'

const esc = new MarkdownIt().utils.escapeHtml
const page = (section, dir, title) => ({ section, dir, title, url: `/${section}/${dir}/` })

test('neighbors stay inside their direct parent and do not wrap, even when titles repeat', () => {
  const crypto = page('posts', 'write-up/2025/deadsec/crypto', 'Cryptography')
  const rev = page('posts', 'write-up/2025/deadsec/rev', 'Reverse Engineering')
  const other = page('posts', 'write-up/2025/other/crypto', 'Cryptography')
  const nested = page('posts', 'write-up/2025/deadsec/rev/part-1', 'Part 1')
  const note = page('notes', crypto.dir, crypto.title)
  const neighbors = indexSiblings([rev, other, note, crypto, nested])
  assert.equal(neighbors.size, 2)
  assert.deepEqual(neighbors.get(crypto.url), { parent: '/posts/write-up/2025/deadsec/', prev: undefined, next: rev })
  assert.equal(neighbors.get(rev.url).prev, crypto)
  assert.equal(neighbors.get(rev.url).next, undefined)
  assert.equal(siblingNav(neighbors.get(note.url), '', esc), '')
})

test('uses archive order: newest year first and numbered challenges in numeric order', () => {
  const years = [2022, 2024, 2023].map(n => page('notes', `research/${n}`, String(n)))
  const parts = [10, 1, 2].map(n => page('posts', `event/c${n}`, `Challenge #${n}`))
  const neighbors = indexSiblings([...parts, ...years])
  for (const [middle, prev, next] of [[years[2], years[1], years[0]], [parts[2], parts[1], parts[0]]]) {
    assert.equal(neighbors.get(middle.url).prev, prev)
    assert.equal(neighbors.get(middle.url).next, next)
  }
})

test('renders a named navigation landmark with only the available direction and escaped text', () => {
  const html = siblingNav({ next: page('notes', '2025/entry', 'A & B') }, 'A "folder"', esc)
  assert.match(html, /<nav class="sibling-nav" aria-label="More in A &quot;folder&quot;">/)
  assert.match(html, /rel="next" href="\/notes\/2025\/entry\/"/)
  assert.match(html, /Next.*<strong>A &amp; B<\/strong>/)
  assert.doesNotMatch(html, /Previous|rel="prev"|>More in /)
})
