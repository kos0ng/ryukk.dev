import assert from 'node:assert/strict'
import test from 'node:test'
import { escapeHtml } from 'markdown-it/lib/common/utils.mjs'
import { archiveTree } from '../scripts/archive-tree.js'

function page(dir, title, hint) {
  return {
    dir,
    title,
    url: `/posts/${dir}/`,
    source: `# ${title}\n\n{% hint style="info" %}\n${hint || ''}\n{% endhint %}`,
  }
}

test('a competition expands to its result and searchable category links, not an overview', () => {
  const event = page(
    'write-up/2025/example',
    'Example',
    'Participated with HCS &amp; Co. Got 7th place out of n teams.&#x20;'
  )
  const category = page(`${event.dir}/cryptography`, 'Cryptography')
  const { html, count } = archiveTree([event, category], escapeHtml)
  assert.equal(count, 1)
  assert.match(
    html,
    /<\/summary><p class="event-result">Participated with HCS &amp; Co\. Placed 7th\.<\/p><ul>/
  )
  assert.match(html, /data-search="[^"]*hcs &amp; co\.[^"]*7th/)
  assert.ok(html.includes(`href="${category.url}"`))
  assert.ok(!html.includes(`href="${event.url}"`))
  assert.doesNotMatch(html, /Overview/)
})

test('missing results do not create a blank note, and standalone articles remain reachable', () => {
  const event = page('write-up/2023/example', 'Example', '\\-')
  const category = page(`${event.dir}/misc`, 'Misc')
  const solo = page('write-up/2024/standalone', 'Standalone')
  const list = page('ctf-author/2023', '2023')
  const { html, count } = archiveTree([event, category, solo, list], escapeHtml)
  assert.equal(count, 3)
  assert.doesNotMatch(html, /event-result/)
  assert.ok(html.includes(`href="${solo.url}"`))
  assert.ok(html.includes('>Challenge list<span'))
})
