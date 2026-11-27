import { unescapeAll } from 'markdown-it/lib/common/utils.mjs'

// Dated write-ups and research notes go on the calendar. Other paths remain intact.
// Nodes may have both a page and children: keep the overview link independent
// of the disclosure so a click never has to both navigate and expand.
const sectionNames = new Map([
  ['write-up', 'Write-ups'],
  ['ctf-author', 'Authored challenges'],
  ['lifetime-ctf', 'Lifetime CTF'],
  ['hack-the-box', 'Hack The Box'],
  ['reverse-engineering', 'Reverse Engineering'],
])

function branch(label) {
  return { label, children: new Map() }
}

function child(parent, key, label) {
  if (!parent.children.has(key)) parent.children.set(key, branch(label))
  return parent.children.get(key)
}

const calendarPath = /^(?:write-up|research)\/(20\d\d)(?:\/|$)/

// Keep these navigation pages published for bookmarks, but treat them as
// folders in the archive instead of adding an Overview link inside each.
const folderOnly = new Set([
  'introduction',
  'lifetime-ctf/hack-the-box',
  'lifetime-ctf/hack-the-box/reverse-engineering',
])

export function isArchiveEntry({ dir }) {
  const isYearOverview = calendarPath.test(dir) && dir.split('/').length === 2
  return dir && !folderOnly.has(dir) && !isYearOverview
}

function participationNote(source) {
  // Competition index pages start with a GitBook info hint, followed by a
  // category table. Don't use the table or a hint buried in a write-up.
  const hint = source?.match(
    /^# [^\n]+\n\s*\{% hint style="info" %\}([\s\S]*?)\{% endhint %\}/
  )?.[1]
  if (!hint) return ''
  const text = unescapeAll(hint)
    .replace(/\bGot nth place\./gi, '')
    .replace(/ out of n teams\b/gi, '')
    .replace(/\bGot (\d+(?:st|nd|rd|th)) place\b/g, 'Placed $1')
    .replace(/\s+/g, ' ')
    .trim()
  return text === '-' ? '' : text
}

// The reader pager follows the same order as the expanded archive folders.
export function compareArchiveTitles(a, b) {
  if (/^20\d\d$/.test(a) && /^20\d\d$/.test(b)) return Number(b) - Number(a)
  return a.localeCompare(b, 'en', { numeric: true })
}

export function archiveTree(pages, esc) {
  const groups = new Map()
  for (const page of pages) {
    const parts = page.dir.split('/')
    const year = page.dir.match(calendarPath)?.[1] || ''
    if (!groups.has(year)) groups.set(year, branch(year || 'Collections'))
    let node = groups.get(year)
    for (const part of year ? parts.slice(2) : parts) {
      node = child(
        node,
        part,
        sectionNames.get(part) || part.replaceAll('-', ' ')
      )
    }
    node.page = page
    node.label = page.title
  }

  function render(node, path, open = false, eventContext = '') {
    const children = [...node.children.values()].sort((a, b) =>
      compareArchiveTitles(a.label, b.label)
    )
    const page = node.page
    const key = [...path, node.label]
    const eventFolder =
      children.length > 0 &&
      /^(?:write-up|ctf-author)\/20\d\d\//.test(page?.dir)
    const note =
      eventFolder && page.dir.split('/').length === 3
        ? participationNote(page.source)
        : ''
    const items = children.map((c) =>
      render(c, key, false, note || eventContext)
    )
    const hasLink = page && !eventFolder
    const count = items.reduce((n, i) => n + i.count, hasLink ? 1 : 0)
    const authorYear = /^ctf-author\/20\d\d$/.test(page?.dir)
    const folder = authorYear || children.length > 0
    const overview = authorYear ? 'Challenge list' : 'Overview'
    const link = hasLink
      ? `<a class="tree-page" data-search="${esc([...key, page.title, page.dir.replaceAll('-', ' '), eventContext].join(' ').toLowerCase())}" href="${esc(page.url)}"${folder ? ` aria-label="${esc(key.join(' / ') + ': ' + overview)}"` : ''}>${esc(folder ? overview : node.label)}<span aria-hidden="true">→</span></a>`
      : ''
    if (!folder) return { html: `<li>${link}</li>`, count }
    const html = `<li><details${open ? ' open' : ''}><summary><span>${esc(node.label)}</span><small>${count} ${count === 1 ? 'page' : 'pages'}</small></summary>${note ? `<p class="event-result">${esc(note)}</p>` : ''}<ul>${link ? `<li>${link}</li>` : ''}${items.map((c) => c.html).join('')}</ul></details></li>`
    return { html, count }
  }

  const sections = [...groups.keys()]
    .sort()
    .reverse()
    .map((key, i) => render(groups.get(key), [], i === 0))
  return {
    html: `<ul class="archive-tree" id="entries">${sections.map((s) => s.html).join('')}</ul>`,
    count: sections.reduce((total, s) => total + s.count, 0),
  }
}
