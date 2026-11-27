import hljs from 'highlight.js'
import { DomUtils, parseDocument } from 'htmlparser2'

// GitBook uses both fenced Markdown and <pre><code class="lang-…">.
// Work on the sanitized fragment so both formats get the same treatment.
const aliases = new Map([
  ['nasm', 'x86asm'],
  ['asm', 'x86asm'],
])

function highlightText(children, language) {
  return children.flatMap((node) => {
    if (node.type === 'text' && /\S/.test(node.data)) {
      const { value } = hljs.highlight(node.data, {
        language,
        ignoreIllegals: true,
      })
      return parseDocument(value).children
    }
    // Preserve authored emphasis (e.g. <strong> around a line of interest).
    if (node.children) node.children = highlightText(node.children, language)
    return node
  })
}

export function highlightCode(html) {
  if (!html.includes('<pre>')) return html
  const doc = parseDocument(html)
  for (const pre of DomUtils.getElementsByTagName('pre', doc.children)) {
    const code = pre.children.find((child) => child.name === 'code')
    const label = code?.attribs.class?.match(
      /(?:^|\s)lang(?:uage)?-([^\s]+)/i
    )?.[1]
    if (!label) continue // Don't guess a language for terminal output or logs.
    pre.attribs['data-language'] = label
    const language = aliases.get(label.toLowerCase()) || label.toLowerCase()
    if (hljs.getLanguage(language))
      code.children = highlightText(code.children, language)
  }
  return DomUtils.getOuterHTML(doc, { encodeEntities: 'utf8' })
}
