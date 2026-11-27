import { renderOutline } from '../theme/outline.js'

// Assign the anchor and collect its label in one pass, so duplicate section
// names (e.g. “Solution”) always link to the right occurrence.
export function indexHeadings(tokens) {
  const ids = new Set()
  const headings = []
  tokens.forEach((token, i) => {
    if (token.type !== 'heading_open') return
    const label = tokens[i + 1].children
      .map((child) => {
        if (
          ['text', 'code_inline', 'math_inline', 'image'].includes(child.type)
        )
          return child.content
        return ['softbreak', 'hardbreak'].includes(child.type) ? ' ' : ''
      })
      .join('')
      .trim()
    const base =
      label
        .toLowerCase()
        .replace(/[^\p{L}\p{N}_\s-]/gu, '')
        .trim()
        .replace(/[\s-]+/g, '-') || 'section'
    let id = base,
      suffix = 1
    while (ids.has(id)) id = `${base}-${suffix++}`
    ids.add(id)
    token.attrSet('id', id)
    const level = Number(token.tag.slice(1))
    if (label && level >= 2 && level <= 4) headings.push({ level, label, id })
  })
  return { ids, headings }
}

export function tableOfContents(headings) {
  const outline = renderOutline(headings)
  return outline && outline + '<script type="module" src="/reading-position.js"></script>'
}
