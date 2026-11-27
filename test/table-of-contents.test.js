import assert from 'node:assert/strict'
import test from 'node:test'
import MarkdownIt from 'markdown-it'
import { indexHeadings, tableOfContents } from '../scripts/table-of-contents.js'

const md = MarkdownIt()

test('the post outline uses the same unique anchors as the rendered headings', () => {
  const tokens = md.parse(
    '# Title\n## Part A\n### Solution\n#### First `x < y`\n##### Detail\n## Part B\n### Solution\n```\n## Not a heading\n```',
    {}
  )
  const { headings } = indexHeadings(tokens)
  const html = tableOfContents(headings)
  assert.deepEqual(
    headings.map((h) => h.id),
    ['part-a', 'solution', 'first-x-y', 'part-b', 'solution-1']
  )
  assert.match(
    html,
    /href="#part-a">Part A<\/a><ul><li><a href="#solution">Solution<\/a><ul><li><a href="#first-x-y">First x &lt; y<\/a>/
  )
  assert.match(
    md.renderer.render(tokens, md.options, {}),
    /<h3 id="solution-1">Solution<\/h3>/
  )
  assert.doesNotMatch(html, /Detail|Not a heading|Title/)
})

test('accept skipped heading levels and omit an empty outline', () => {
  const { headings } = indexHeadings(
    md.parse('#### First\n## Next\n#### Deep', {})
  )
  assert.match(
    tableOfContents(headings),
    /First<\/a><\/li><li><a href="#next">Next<\/a><ul>/
  )
  assert.equal(tableOfContents([]), '')
})
