import test from 'node:test'
import assert from 'node:assert/strict'
import { article } from '../scripts/article.js'

const render = source => article({ source: '# Title\n\n' + source, url: '/example/' }).body

test('keep GitBook alignment, caption and exact width including non-preset widths', () => {
  for (const align of ['left', 'center', 'right']) {
    const html = render(`<div align="${align}"><figure><img src="images/a.png" width="349" data-size="big" alt="Detail"><figcaption>Caption</figcaption></figure></div>`)
    assert.ok(html.includes(`<div align="${align}"><figure>`))
    assert.match(html, /width="349"/)
    assert.match(html, /alt="Detail"/)
    assert.match(html, /<figcaption>Caption<\/figcaption>/)
  }
})

test('resolve named sizes; no implicit width on original or ordinary inline images', () => {
  for (const [size, width] of Object.entries({ small: 188, medium: 375, large: 563, big: 563 })) {
    assert.ok(render(`<figure align="left"><img src="a.png" data-size="${size}"></figure>`).includes(`width="${width}"`))
  }
  assert.doesNotMatch(render('<figure><img src="a.png" data-size="original"></figure>'), /width=/)
  assert.match(render('Before ![inline](a.png) after'), /Before <img[^>]*> after/)
})

test('standalone Markdown image layouts work without altering prose, code, or invalid suffixes', () => {
  for (const [align, size, width] of [['left', 'small', 188], ['center', 'medium', 375], ['right', 'big', 563]]) {
    const html = render(`![Details](a.png){align=${align} size=${size}}`)
    assert.ok(html.includes(`<figure align="${align}">`) && html.includes(`width="${width}"`))
    assert.doesNotMatch(html, /\{align=/)
  }
  assert.match(render('![Details](a.png){width=420}'), /width="420"/)
  for (const source of ['Before ![a](a.png){align=left}', '![a](a.png){align=bad}', '`![a](a.png){align=left}`']) {
    assert.doesNotMatch(render(source), /<figure/)
  }
})

test('reject arbitrary styling, unknown presets, bad widths and alignment', () => {
  assert.doesNotMatch(render('<div align="justify"><figure style="color:red"><img src="a.png" style="width:300vw" width="80vw" data-size="huge" onload="noop()"></figure></div>'), /(?:align|style|width|data-size|onload)=/)
})
