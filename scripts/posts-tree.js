// Group by calendar year first, while preserving the source hierarchy below it.
// Nodes may have both a page and children: keep the overview link independent
// of the disclosure so a click never has to both navigate and expand.
const sectionNames = new Map([
  ['write-up', 'Write-ups'],
  ['ctf-author', 'Authored challenges'],
  ['lifetime-ctf', 'Lifetime CTF'],
])

function branch(label) {
  return { label, children: new Map() }
}

function child(parent, key, label) {
  if (!parent.children.has(key)) parent.children.set(key, branch(label))
  return parent.children.get(key)
}

export function postsTree(pages, esc) {
  const groups = new Map()
  for (const page of pages) {
    const parts = page.dir.split('/')
    const yearAt = parts.findIndex((s) => /^20\d\d$/.test(s))
    const year = yearAt < 0 ? '' : parts[yearAt]
    if (!groups.has(year)) groups.set(year, branch(year || 'Collections'))
    let node = groups.get(year)
    for (const [i, part] of parts.entries()) {
      if (i === yearAt) continue
      node = child(
        node,
        part,
        sectionNames.get(part) || part.replaceAll('-', ' ')
      )
    }
    node.page = page
    // Year index pages are called just “2025”, even when the content is an
    // author log. Keep the collection name visible on those nodes.
    if (yearAt !== parts.length - 1) node.label = page.title
  }

  function render(node, depth, path, open = false) {
    const children = [...node.children.values()].sort((a, b) => {
      if (a.label === 'Write-ups') return -1
      if (b.label === 'Write-ups') return 1
      return a.label.localeCompare(b.label, 'en', { numeric: true })
    })
    const page = node.page
    const key = [...path, node.label]
    const items = children.map((c) =>
      render(c, depth + 1, key, depth === 0 && c.label === 'Write-ups')
    )
    const count = items.reduce((n, i) => n + i.count, page ? 1 : 0)
    const overview =
      depth === 1 && /^20\d\d$/.test(page?.title) ? 'Year overview' : 'Overview'
    const link = page
      ? `<a class="tree-page" data-search="${esc([...key, page.title, page.dir.replaceAll('-', ' ')].join(' ').toLowerCase())}" href="${esc(page.url)}"${children.length ? ` aria-label="${esc(key.join(' / ') + ': ' + overview)}"` : ''}>${esc(children.length ? overview : node.label)}<span aria-hidden="true">→</span></a>`
      : ''
    if (!children.length) return { html: `<li>${link}</li>`, count }
    const html = `<li><details${open ? ' open' : ''}><summary><span>${esc(node.label)}</span><small>${count} ${count === 1 ? 'page' : 'pages'}</small></summary><ul>${page ? `<li>${link}</li>` : ''}${items.map((c) => c.html).join('')}</ul></details></li>`
    return { html, count }
  }

  const sections = [...groups.keys()]
    .sort()
    .reverse()
    .map((key, i) => render(groups.get(key), 0, [], i === 0).html)
  return `<ul class="posts-tree" id="entries">${sections.join('')}</ul>`
}
