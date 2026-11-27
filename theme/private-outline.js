import { renderOutline, trackOutline } from './outline.js'

// Called only after decryption. Keep heading text out of URLs/browser history.
export function mountPrivateOutline(body) {
  const headings = []
  const anchors = new Map()
  let n = 0
  for (const el of body.querySelectorAll('h2,h3,h4')) {
    const label = el.textContent.trim()
    if (!label) continue
    let id
    do { id = `private-section-${++n}` } while (document.getElementById(id))
    if (el.id) anchors.set('#' + el.id, '#' + id)
    el.id = id
    headings.push({ id, label, level: Number(el.tagName[1]) })
  }
  if (!headings.length) return
  for (const a of body.querySelectorAll('a[href^="#"]')) {
    const href = anchors.get(a.getAttribute('href'))
    if (href) a.setAttribute('href', href)
  }
  const layout = body.parentElement
  layout.classList.add('reading-layout')
  body.insertAdjacentHTML('beforebegin', renderOutline(headings))
  const toc = body.previousElementSibling
  const stop = trackOutline(toc, body)
  return () => {
    stop()
    toc.remove()
    layout.classList.remove('reading-layout')
  }
}
