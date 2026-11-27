import assert from 'node:assert/strict'
import test from 'node:test'
import { DomUtils, parseDocument } from 'htmlparser2'
import { highlightCode } from '../scripts/highlight-code.js'

test('colour fenced and GitBook code without changing copied text or emphasis', () => {
  for (const attr of ['language-python', 'lang-python']) {
    const html = `<pre><code class="${attr}">def greet():\n<strong>    return "&lt;sun&gt;&amp;moon"</strong>\n</code></pre>`
    const rendered = highlightCode(html)
    assert.match(rendered, /class="hljs-keyword"/)
    assert.match(rendered, /<strong>/)
    assert.equal(
      DomUtils.textContent(parseDocument(rendered)),
      'def greet():\n    return "<sun>&moon"\n'
    )
  }
})

test('leave prose, inline code, logs and unknown languages unhighlighted', () => {
  const html =
    '<p><code class="language-python">return</code></p><pre><code>log</code></pre><pre><code class="lang-unknown">&lt;sample&gt;</code></pre>'
  const rendered = highlightCode(html)
  assert.doesNotMatch(rendered, /hljs-|<sample>/)
  assert.equal(
    DomUtils.textContent(parseDocument(rendered)),
    'returnlog<sample>'
  )
})
