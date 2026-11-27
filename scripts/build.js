import { lockedArticle } from './locked-article.js'
import {
  cpSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from 'node:fs'
import { dirname, join } from 'node:path'
import { archiveTree, isArchiveEntry } from './archive-tree.js'
import { article } from './article.js'
import { indexSiblings, siblingNav } from './sibling-navigation.js'
import { escapeHtml as esc } from 'markdown-it/lib/common/utils.mjs'

const labels = { posts: 'Posts', notes: 'Notes' }
const descriptions = {
  posts:
    'CTF writeups for various competitions and categories.',
  notes: 'Research notes on security things.',
}
const github = 'https://github.com/kos0ng'
const twitter = 'https://x.com/_ryuk12345'
const newTab = 'target="_blank" rel="noopener noreferrer" title="Opens in a new tab"'
const profiles = `<a href="${github}" ${newTab}>GitHub ↗</a><a href="${twitter}" ${newTab}>Twitter ↗</a>`
const team = (name, id) => `<a href="https://ctftime.org/team/${id}" ${newTab}>${name}</a>`
const affiliations = `CTFs with ${team('idek', 157039)}, ${team('SKSD', 211952)}, ${team('HCS', 70159)}, and ${team('PwnSec', 28797)}.`
const pages = []
function collect(section, dir = '') {
  for (const file of readdirSync(join('books', section, dir), {
    withFileTypes: true,
  })) {
    if (file.isDirectory() && file.name !== 'images') collect(section, join(dir, file.name))
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
      })
    }
  }
}
Object.keys(labels).forEach((section) => collect(section))
const byUrl = new Map(pages.map((p) => [p.url, p]))
for (const [section, title] of Object.entries(labels)) {
  byUrl.set(`/${section}/`, { title })
}
const entries = (section) =>
  pages
    .filter((p) => p.section === section && isArchiveEntry(p))
    .sort((a, b) => {
      const year = (p) =>
        Number(p.dir.match(/(?:^|\/)(20\d\d)(?:\/|$)/)?.[1] || 0)
      return year(b) - year(a) || a.dir.localeCompare(b.dir)
    })
rmSync('public', { recursive: true, force: true })
cpSync('theme', 'public', { recursive: true })
const tokenTheme = new URL(
  import.meta.resolve('highlight.js/styles/tokyo-night-dark.css')
)
const mathTheme = new URL(import.meta.resolve('katex/dist/katex.min.css'))
mkdirSync('public/katex', { recursive: true })
cpSync(mathTheme, 'public/katex/katex.min.css')
cpSync(new URL('fonts/', mathTheme), 'public/katex/fonts', { recursive: true })
cpSync(new URL('../LICENSE', mathTheme), 'public/katex/LICENSE')
cpSync(tokenTheme, 'public/tokyo-night-dark.css')
cpSync(new URL('../LICENSE', tokenTheme), 'public/highlight-js-LICENSE.txt')
function emit(url, title, body, section = '') {
  const nav = (href, text, current) =>
    `<a href="${href}"${current ? ' aria-current="' + (href === url ? 'page' : 'location') + '"' : ''}>${text}</a>`
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#15161d"><title>${esc(title)} · ryukk.dev</title><link rel="icon" type="image/svg+xml" sizes="any" href="/pixel-moon.svg"><link rel="stylesheet" href="/tokyo-night-dark.css">${body.includes('<span class="katex') ? '<link rel="stylesheet" href="/katex/katex.min.css">' : ''}<link rel="stylesheet" href="/site.css"></head><body><a class="skip" href="#main">Skip to content</a><header><div class="bar"><a class="brand" href="/"><img src="/zenitsu-face.svg" alt="" width="48" height="48"> ryukk<span>.dev</span></a><nav aria-label="Primary">${nav('/', 'Home', url === '/')}${Object.keys(
    labels
  )
    .map((k) => nav('/' + k + '/', labels[k], section === k))
    .join(
      ''
    )}</nav></div></header><main id="main"${section && url !== `/${section}/` ? ' class="article-page"' : ''}>${body}</main><footer><strong>kos0ng<span> // </span>ryukk.dev</strong><div>${profiles}</div></footer></body></html>`
  const file = join('public', url, 'index.html')
  mkdirSync(dirname(file), { recursive: true })
  writeFileSync(file, html)
  if (section === 'notes') redirect(url.replace(/^\/notes\//, '/shelves/'), url, 'Notes')
}

// Static hosts (including GitHub Pages) need a real file at each old URL.
function redirect(from, to, label) {
  const file = join('public', from, 'index.html')
  mkdirSync(dirname(file), { recursive: true })
  writeFileSync(file, `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Moved to ${label}</title><meta name="robots" content="noindex"><link rel="canonical" href="${esc(to)}"><script>location.replace(document.querySelector('[rel=canonical]').href + location.search + location.hash)</script><meta http-equiv="refresh" content="0;url=${esc(to)}"></head><body><a href="${esc(to)}">Continue to ${label}</a></body></html>`)
}
redirect('/posts/introduction/', '/posts/', 'Posts')
redirect('/notes/introduction/', '/notes/', 'Notes')
redirect('/shelves/introduction/', '/notes/', 'Notes')
for (const section of ['notes', 'shelves']) {
  redirect(`/${section}/research/2024/reverse-engineering-application-protected-with-pyarmor/`,
    '/notes/research/2024/reverse-engineering-protected-python-application-with-pyarmor/', 'the updated article')
}

const archives = Object.fromEntries(Object.keys(labels).map((k) => [k, archiveTree(entries(k), esc)]))
function card(k, i) {
  return `<a class="card" href="/${k}/"><small>VOLUME 0${i + 1} <b>↗</b></small><h3>${labels[k]}</h3><p>${descriptions[k]}</p><strong>${archives[k].count} entries →</strong></a>`
}
emit(
  '/',
  'kos0ng’s field notes',
  `<section class="hero"><div class="scene" aria-hidden="true"></div><div class="intro"><small>Personal Blog</small><h1>kos0ng<span>_</span></h1><p class="job-title">Malware Researcher.</p><p class="affiliations">${affiliations}</p></div></section><div class="section-title"><small>INDEX / 01</small><h2>Explore the archive</h2></div><div class="cards">${Object.keys(labels).map(card).join('')}</div>`
)
for (const [section, label] of Object.entries(labels)) {
  const archive = archives[section]
  emit(
    `/${section}/`,
    label,
    `<small>FIELD ARCHIVE / ${section === 'posts' ? '01' : '02'}</small><h1>${label}</h1><p>${descriptions[section]}</p><label class="filter" hidden>Filter ${label.toLowerCase()}<input type="search" placeholder="Type a year, title or topic…" aria-controls="entries"></label><p id="count" aria-live="polite">${archive.count} entries</p>${archive.html}<script src="/tree-filter.js" defer></script>`,
    section
  )
}
const siblings = indexSiblings(pages)
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
  const neighbors = siblings.get(p.url)
  const pager = siblingNav(neighbors, byUrl.get(neighbors?.parent)?.title, esc)
  const protectedContent = lockedArticle(p)
  const images = join('books', p.section, p.dir, 'images')
  if (existsSync(images)) cpSync(images, join('public', p.url, 'images'), { recursive: true })
  const { body, toc } = protectedContent ?? article(p)
  const content = toc ? `<div class="reading-layout">${toc}<div class="article-body">${body}</div></div>` : body
  emit(
    p.url,
    p.title,
    `<nav class="crumb" aria-label="Breadcrumb">${crumbs.join(' / ')}</nav><article${toc ? ' class="with-toc"' : ''}><h1>${esc(p.title)}</h1>${content}</article>${pager}`,
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
