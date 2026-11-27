import assert from 'node:assert/strict'
import test from 'node:test'
import MarkdownIt from 'markdown-it'
import sanitize from 'sanitize-html'
import { archiveMath, mathSlots } from '../scripts/math.js'

const md = MarkdownIt({ html: true }).use(archiveMath)
function render(source) {
  const math = mathSlots('/fixture/')
  return math.restore(sanitize(md.render(source, { math })))
}

test('emit accessible inline and display equations through sanitization', () => {
  const html = render(String.raw`Inline $x_i$ and \(y^2\).

$$
\begin{gathered}
c_1 = m_1^e \bmod n \\
c_2 = (m_1*m_2)^e \bmod n
\end{gathered}
$$

\[\frac{1}{2}\]

<script>not math</script>`)
  assert.equal(html.match(/class="katex"/g).length, 4)
  assert.equal(html.match(/class="katex-display"/g).length, 2)
  for (const structure of ['msub', 'msup', 'mtable', 'mfrac'])
    assert.ok(html.includes(`<${structure}`))
  assert.doesNotMatch(html, /<script>/)
})

test('leave code examples, currency and adjacent registers alone', () => {
  const text = [
    '`$x$` and $rbp+$rdi; prices: $5 and $10.',
    '',
    '```text',
    '$$',
    'x^2',
    '$$',
    '```',
  ].join('\n')
  const html = render(text)
  assert.doesNotMatch(html, /class="katex/)
  assert.match(html, /<code>\$x\$<\/code>/)
  assert.match(html, /\$rbp\+\$rdi/)
})

test('fail the build with the article path on malformed math', () => {
  assert.throws(() => render('$$\\frac{1}{$$'), /Invalid LaTeX in \/fixture\//)
})
