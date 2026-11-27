// Shared by the static Markdown build and outlines created after decryption.
const escapeHtml = (s) => s.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c])

export function renderOutline(headings) {
  if (!headings.length) return ''
  const root = { level: 0, children: [] }
  const parents = [root]
  for (const heading of headings) {
    while (parents.at(-1).level >= heading.level) parents.pop()
    const node = { ...heading, children: [] }
    parents.at(-1).children.push(node)
    parents.push(node)
  }
  function list(nodes) {
    return `<ul>${nodes.map(({ id, label, children }) => `<li><a href="#${escapeHtml(id)}">${escapeHtml(label)}</a>${children.length ? list(children) : ''}</li>`).join('')}</ul>`
  }
  return `<details class="article-toc"><summary>Table of contents</summary><nav aria-label="Table of contents">${list(root.children)}</nav></details>`
}

export function trackOutline(toc, body) {
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
  const listeners = new AbortController()
  const { signal } = listeners
  window.addEventListener('scroll', schedule, { passive: true, signal })
  window.addEventListener('resize', syncLayout, { signal })
  window.addEventListener('pageshow', schedule, { signal })
  window.addEventListener('hashchange', schedule, { signal })
  toc.addEventListener('toggle', schedule, { signal })
  // Late-loading figures and changed font metrics can move a heading without a scroll.
  const observer = new ResizeObserver(schedule)
  observer.observe(body)
  syncLayout()

  return () => {
    listeners.abort()
    observer.disconnect()
    cancelAnimationFrame(frame)
  }
}
