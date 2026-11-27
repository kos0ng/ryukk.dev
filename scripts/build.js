import {
  cpSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from 'node:fs'
import { dirname, join } from 'node:path'
import { archiveTree, isArchiveEntry } from './archive-tree.js'
import { highlightCode } from './highlight-code.js'
import MarkdownIt from 'markdown-it'
import sanitize from 'sanitize-html'

const md = MarkdownIt({ html: true, linkify: false })
const labels = { posts: 'Posts', notes: 'Notes' }
const books = { posts: 'ctfs', notes: 'notes' }
const descriptions = {
  posts:
    'Explore CTF write-ups by year, then open a competition to find its challenges.',
  notes: 'Research notes on reverse engineering, software and security.',
}
const github = 'https://github.com/kos0ng'
const linkedin =
  'https://www.linkedin.com/in/achmad-zaenuri-dahlan-putra-51b063170/'
const profiles = `<a href="${github}">GitHub ↗</a><a href="${linkedin}">LinkedIn ↗</a>`
const esc = md.utils.escapeHtml
const pages = []
function collect(section, dir = '') {
  for (const file of readdirSync(join('books', section, dir), {
    withFileTypes: true,
  })) {
    if (file.isDirectory()) collect(section, join(dir, file.name))
    else if (file.name === 'index.md') {
      const source = readFileSync(
        join('books', section, dir, file.name),
        'utf8'
      )
      const title = source.match(/^# (.+)$/m)?.[1]?.trim()
      if (!title) throw new Error(`Missing title: ${section}/${dir}`)
      pages.push({
        section,
        dir,
        title,
        source,
        url: `/${section}/${dir ? dir + '/' : ''}`,
        origin: `https://kos0ng.gitbook.io/${books[section]}${dir ? '/' + dir : ''}`,
      })
    }
  }
}
Object.keys(labels).forEach((section) => collect(section))
const byOrigin = new Map(pages.map((p) => [p.origin, p.url]))
const byUrl = new Map(pages.map((p) => [p.url, p]))
for (const [section, book] of Object.entries(books)) {
  const url = `/${section}/`
  byOrigin.set(`https://kos0ng.gitbook.io/${book}`, url)
  byUrl.set(url, { title: labels[section] })
}
const entries = (section) =>
  pages
    .filter((p) => p.section === section && isArchiveEntry(p))
    .sort((a, b) => {
      const year = (p) =>
        Number(p.dir.match(/(?:^|\/)(20\d\d)(?:\/|$)/)?.[1] || 0)
      return year(b) - year(a) || a.dir.localeCompare(b.dir)
    })
function localLink(href, origin) {
  try {
    if (!href || href.startsWith('#')) return href
    const u = new URL(href, origin)
    const mapped = byOrigin.get(u.origin + u.pathname.replace(/\.md$|\/$/, ''))
    return mapped ? mapped + u.search + u.hash : u.href
  } catch {
    return undefined
  }
}
function article(p) {
  // GitBook's layout directives are not standard Markdown. Leave code fences untouched.
  let fence = ''
  const markdown = p.source
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
      if (name === 'hint') return '**Note**\n'
      return ''
    })
    .join('\n')
    .replace(/^# .+\n/m, '')
  const tokens = md.parse(markdown, {})
  const used = new Set()
  tokens.forEach((t, i) => {
    if (t.type !== 'heading_open') return
    const heading = tokens[i + 1].children
      .filter((child) => ['text', 'code_inline'].includes(child.type))
      .map((child) => child.content)
      .join('')
    const base = heading
      .toLowerCase()
      .replace(/[^\p{L}\p{N}_\s-]/gu, '')
      .trim()
      .replace(/[\s-]+/g, '-')
    let id = base,
      n = 1
    while (used.has(id)) id = `${base}-${n++}`
    used.add(id)
    t.attrSet('id', id)
  })
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
    if (!href.startsWith('#') || used.has(href.slice(1)))
      return localLink(href, p.origin)
    const slug = href.slice(1)
    const compact = (id) => id.replace(/^id-/, '').replace(/[^a-z0-9_]/g, '')
    const matches = [...used].filter((id) => compact(id) === compact(slug))
    if (matches.length === 1) return '#' + matches[0]
    return used.has(oldTargets[slug]) ? '#' + oldTargets[slug] : href
  }
  return sanitize(md.renderer.render(tokens, md.options, {}), {
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
      a: ['href', 'id', 'name'],
      img: ['src', 'alt', 'loading'],
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
      img: sanitize.simpleTransform('img', { loading: 'lazy' }),
    },
  })
}
rmSync('public', { recursive: true, force: true })
cpSync('theme', 'public', { recursive: true })
const tokenTheme = new URL(
  import.meta.resolve('highlight.js/styles/tokyo-night-dark.css')
)
cpSync(tokenTheme, 'public/tokyo-night-dark.css')
cpSync(new URL('../LICENSE', tokenTheme), 'public/highlight-js-LICENSE.txt')
function emit(url, title, body, section = '') {
  const nav = (href, text, current) =>
    `<a href="${href}"${current ? ' aria-current="' + (href === url ? 'page' : 'location') + '"' : ''}>${text}</a>`
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#15161d"><title>${esc(title)} · ryukk.dev</title><link rel="icon" href="/bolt.svg"><link rel="stylesheet" href="/tokyo-night-dark.css"><link rel="stylesheet" href="/site.css"></head><body><a class="skip" href="#main">Skip to content</a><header><div class="bar"><a class="brand" href="/"><img src="/bolt.svg" alt="" width="30" height="30"> ryukk<span>.dev</span></a><nav aria-label="Primary">${nav('/', 'Home', url === '/')}${Object.keys(
    labels
  )
    .map((k) => nav('/' + k + '/', labels[k], section === k))
    .join(
      ''
    )}</nav></div></header><main id="main">${body}</main><footer><strong>kos0ng<span> // </span>ryukk.dev</strong><div>${profiles}</div></footer></body></html>`
  const file = join('public', url, 'index.html')
  mkdirSync(dirname(file), { recursive: true })
  writeFileSync(file, html)
  // Netlify serves HTTP redirects. Keep old bookmarks working on plain static
  // hosts and the local preview too, including search parameters and anchors.
  if (section === 'notes') {
    const alias = join(
      'public',
      url.replace(/^\/notes\//, '/shelves/'),
      'index.html'
    )
    mkdirSync(dirname(alias), { recursive: true })
    writeFileSync(
      alias,
      `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Moved to Notes</title><meta name="robots" content="noindex"><link rel="canonical" href="${esc(url)}"><script>location.replace(document.querySelector('[rel=canonical]').href + location.search + location.hash)</script><meta http-equiv="refresh" content="0;url=${esc(url)}"></head><body><a href="${esc(url)}">Continue to Notes</a></body></html>`
    )
  }
}
function card(k, i) {
  return `<a class="card" href="/${k}/"><small>VOLUME 0${i + 1} <b>↗</b></small><h3>${labels[k]}</h3><p>${descriptions[k]}</p><strong>${entries(k).length} entries →</strong></a>`
}
emit(
  '/',
  'kos0ng’s field notes',
  `<section class="hero"><div class="scene" aria-hidden="true"></div><div class="intro"><small>⚡ &nbsp; SECURITY FIELD ARCHIVE</small><h1>kos0ng<span>_</span></h1><p>CTF write-ups &amp; research notes by<br>Achmad Zaenuri Dahlan Putra.</p><div class="profiles">${profiles}</div></div></section><div class="section-title"><small>INDEX / 01</small><h2>Explore the archive</h2></div><div class="cards">${Object.keys(labels).map(card).join('')}</div>`
)
for (const [section, label] of Object.entries(labels)) {
  const items = entries(section)
  const archive = archiveTree(items, esc)
  emit(
    `/${section}/`,
    label,
    `<small>FIELD ARCHIVE / ${section === 'posts' ? '01' : '02'}</small><h1>${label}</h1><p>${descriptions[section]}</p><label class="filter" hidden>Filter ${label.toLowerCase()}<input type="search" placeholder="Type a year, title or topic…" aria-controls="entries"></label><p id="count" aria-live="polite">${items.length} entries</p>${archive}<script src="/tree-filter.js" defer></script>`,
    section
  )
}
for (const p of pages.filter((p) => p.dir)) {
  const parts = p.dir.split('/')
  const crumbs = [
    `/${p.section}/`,
    ...parts
      .slice(0, -1)
      .map((_, i) => `/${p.section}/${parts.slice(0, i + 1).join('/')}/`),
  ]
    .filter((url) => byUrl.has(url))
    .map(
      (url) =>
        `<a href="${url}">${esc(url === `/${p.section}/` ? labels[p.section] : byUrl.get(url).title)}</a>`
    )
  emit(
    p.url,
    p.title,
    `<nav class="crumb" aria-label="Breadcrumb">${crumbs.join(' / ')}</nav><article><small>${labels[p.section].toUpperCase()} / FIELD NOTES</small><h1>${esc(p.title)}</h1>${highlightCode(article(p))}</article>`,
    p.section
  )
}
writeFileSync(
  'public/sitemap.xml',
  `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${['/', ...byUrl.keys()].map((url) => `<url><loc>https://ryukk.dev${esc(url)}</loc></url>`).join('')}</urlset>`
)
console.log(
  `Built home, two archive indexes and ${pages.length} Markdown pages.`
)
