import { imageAttributes, imageLayout, markdownImageLayout } from './image-layout.js'
import { highlightCode } from './highlight-code.js'
import { archiveMath, mathSlots } from './math.js'
import { indexHeadings, tableOfContents } from './table-of-contents.js'
import MarkdownIt from 'markdown-it'
import sanitize from 'sanitize-html'

const md = MarkdownIt({ html: true, linkify: false }).use(archiveMath).use(markdownImageLayout)

export function article(p, { sourceMap = false } = {}) {
  // GitBook's layout directives are not standard Markdown. Leave code fences untouched.
  let fence = ''
  const converted = p.source
    .split('\n')
    .map((line) => {
      const marker = line.match(/^\s*(`{3,}|~{3,})/)?.[1]
      if (marker && !fence) {
        fence = marker
        return line
      }
      if (fence) {
        if (marker?.startsWith(fence) && line.trim() === marker) fence = ''
        return line
      }
      const directive = line.match(/^\s*\{% (\w+)(.*?) %\}\s*$/)
      if (!directive) return line
      const [, name, attrs] = directive
      if (name === 'embed')
        return (
          attrs
            .match(/url="<?(https?:[^">]+)>?"/)?.[1]
            ?.replace(/^(.+)$/, '<$1>') || ''
        )
      if (name === 'code' || name === 'tab')
        return (
          attrs.match(/title="([^"]+)"/)?.[1]?.replace(/^(.+)$/, '**$1**\n') ||
          ''
        )
      return ''
    })
  // Tokens refer to the converted text; the editor still includes the title
  // and GitBook directives. Track their original lines for CMS previews only.
  const lines = sourceMap && converted.flatMap((text, i) => text.split('\n').map(() => i))
  const markdown = converted.join('\n').replace(/^# .+\n/m, (_, at, text) => {
    if (lines) lines.splice(text.slice(0, at).split('\n').length - 1, 1)
    return ''
  })
  const env = { math: mathSlots(p.url) }
  const tokens = md.parse(markdown, env)
  if (lines) {
    for (const token of tokens) {
      if (token.level === 0 && token.map && !token.hidden)
        token.attrSet('data-source-line', String(lines[token.map[0]]))
    }
  }
  const { ids: used, headings } = indexHeadings(tokens)
  // A handful of source TOCs still point at older challenge titles/scores.
  // Only rewrite a fragment when its original target is absent on this page.
  const oldTargets = {
    'fcaas-0-solve': 'fcaas',
    'seems-familiar-500-pts': 'seems-familiar-n-pts',
    'verifier-460-pts-mechacore-inventory': 'mechacore-inventory',
    'my_beloved_lcg.py-495-points': 'my_beloved_lcgpy-3-solves',
    'free-play-495-points': 'flag-generator-4-solves',
  }
  function articleLink(href) {
    if (!href.startsWith('#') || used.has(href.slice(1))) return href
    const slug = href.slice(1)
    const compact = (id) => id.replace(/^id-/, '').replace(/[^a-z0-9_]/g, '')
    const matches = [...used].filter((id) => compact(id) === compact(slug))
    if (matches.length === 1) return '#' + matches[0]
    return used.has(oldTargets[slug]) ? '#' + oldTargets[slug] : href
  }
  const safe = sanitize(md.renderer.render(tokens, md.options, env), {
    allowedTags: [
      ...sanitize.defaults.allowedTags,
      'img',
      'details',
      'summary',
      'mark',
      'del',
      'kbd',
      'sup',
      'sub',
    ],
    allowedAttributes: {
      ...(sourceMap ? { '*': ['data-source-line'] } : {}),
      a: ['href', 'id', 'name'],
      ...imageAttributes,
      code: ['class'],
      h2: ['id'],
      h3: ['id'],
      h4: ['id'],
      h5: ['id'],
      h6: ['id'],
      ol: ['start'],
    },
    transformTags: {
      a: (tagName, a) => ({
        tagName,
        attribs: {
          ...a,
          ...(a.href ? { href: articleLink(a.href) || '' } : {}),
        },
      }),
      img: (tagName, attrs) => {
        const { width, ...rest } = attrs
        return { tagName, attribs: { ...rest, loading: 'lazy', ...imageLayout(attrs) } }
      },
    },
  })
  return {
    body: env.math.restore(highlightCode(safe)),
    toc: tableOfContents(headings),
  }
}
