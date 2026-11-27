import { compareArchiveTitles } from './archive-tree.js'

// Group by the full parent URL: a category, competition or year with the same
// name elsewhere in Posts or Notes must never become a reading neighbor.
export function indexSiblings(pages) {
  const groups = new Map()
  for (const page of pages) {
    if (!page.dir) continue
    const parent = page.url.slice(0, page.url.lastIndexOf('/', page.url.length - 2) + 1)
    if (!groups.has(parent)) groups.set(parent, [])
    groups.get(parent).push(page)
  }
  const neighbors = new Map()
  for (const [parent, group] of groups) {
    if (group.length < 2) continue
    group.sort((a, b) => compareArchiveTitles(a.title, b.title) || a.url.localeCompare(b.url, 'en'))
    group.forEach((page, i) => {
      neighbors.set(page.url, { parent, prev: group[i - 1], next: group[i + 1] })
    })
  }
  return neighbors
}

export function siblingNav(neighbors, parentTitle, esc) {
  if (!neighbors) return ''
  const label = parentTitle ? `More in ${esc(parentTitle)}` : 'More in this folder'
  const link = (page, rel, direction) => page
    ? `<a rel="${rel}" href="${esc(page.url)}"><span class="sibling-direction">${direction}</span><strong>${esc(page.title)}</strong></a>`
    : ''
  return `<nav class="sibling-nav" aria-label="${label}"><div>${link(neighbors.prev, 'prev', '<span aria-hidden="true">← </span>Previous')}${link(neighbors.next, 'next', 'Next<span aria-hidden="true"> →</span>')}</div></nav>`
}
