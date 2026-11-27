// The TOC already links to unique heading IDs. Use those same targets rather
// than matching labels: a post can have several sections called “Solution”.
const toc = document.querySelector('.article-toc')
const nav = toc.querySelector('nav')
const sections = [...nav.querySelectorAll('a[href^="#"]')]
  .map((link) => ({
    link,
    heading: document.getElementById(link.getAttribute('href').slice(1)),
  }))
  .filter(({ heading }) => heading)

let current = null
let frame = 0

function update() {
  frame = 0
  // Just below the headings' scroll-margin: a clicked anchor is current even
  // when another short heading is visible a little further down the page.
  const readingLine =
    parseFloat(getComputedStyle(document.documentElement).fontSize) + 8
  const atEnd =
    window.scrollY > 0 &&
    Math.ceil(window.scrollY + window.innerHeight) >=
      document.documentElement.scrollHeight
  let next = null
  for (const { heading, link } of sections) {
    const rect = heading.getBoundingClientRect()
    if (!rect.height) continue
    if (!next || atEnd || rect.top <= readingLine) next = link
    if (!atEnd && rect.top > readingLine) break
  }
  if (next === current) return
  current?.removeAttribute('aria-current')
  current = next
  if (!current) return
  current.setAttribute('aria-current', 'location')

  // Reveal the active row inside long outlines without scrolling the article,
  // moving keyboard focus, or adding entries to browser history.
  if (toc.open && nav.scrollHeight > nav.clientHeight) {
    const row = current.getBoundingClientRect()
    const panel = nav.getBoundingClientRect()
    if (row.top < panel.top) nav.scrollTop += row.top - panel.top
    else if (row.bottom > panel.bottom)
      nav.scrollTop += row.bottom - panel.bottom
  }
}

function schedule() {
  if (!frame) frame = requestAnimationFrame(update)
}
// CSS decides whether there's room for a rail. Only apply the default on a
// change of layout, so resizing within a layout respects the reader's toggle.
let wasInRail
function syncLayout() {
  const inRail = getComputedStyle(toc).position === 'sticky'
  if (inRail !== wasInRail) {
    toc.open = inRail
    wasInRail = inRail
  }
  schedule()
}
window.addEventListener('scroll', schedule, { passive: true })
window.addEventListener('resize', syncLayout)
window.addEventListener('pageshow', schedule)
window.addEventListener('hashchange', schedule)
toc.addEventListener('toggle', schedule)
// Late-loading figures and changed font metrics can move a heading without a scroll.
new ResizeObserver(schedule).observe(document.querySelector('.article-body'))
syncLayout()
