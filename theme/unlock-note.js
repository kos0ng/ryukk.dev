import { unseal } from './note-crypto.js'

const gate = document.querySelector('.locked-note')
const form = gate.querySelector('form')
const input = form.querySelector('input')
const submit = form.querySelector('button')
const status = gate.querySelector('[role=status]')
const panel = document.querySelector('.unlocked-note')
const body = panel.querySelector('.private-body')
const title = gate.closest('article').querySelector('h1')
const lockButton = panel.querySelector('button')
let ciphertext
let generation = 0

function lock() {
  generation++
  body.replaceChildren()
  input.value = ''
  panel.hidden = true
  title.hidden = false
  gate.hidden = false
  submit.disabled = false
  status.textContent = ''
}

if (window.crypto?.subtle && window.DecompressionStream) {
  form.hidden = false
} else {
  status.textContent = 'Open this page over HTTPS in a current browser to unlock it.'
}

form.addEventListener('submit', async event => {
  event.preventDefault()
  if (submit.disabled) return
  const attempt = ++generation
  let password = input.value
  input.value = ''
  submit.disabled = true
  status.textContent = 'Loading encrypted note…'
  try {
    if (!ciphertext) {
      const response = await fetch('note.locked', { credentials: 'omit' })
      if (!response.ok) throw Error('download')
      ciphertext = new Uint8Array(await response.arrayBuffer())
    }
    if (attempt !== generation) return
    status.textContent = 'Unlocking…'
    const bytes = await unseal(password, ciphertext)
    const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'))
    const html = await new Response(stream).text()
    if (attempt !== generation) return
    // Authenticated HTML sanitized by the local sealing tool, with embedded raster images.
    body.innerHTML = html
    gate.hidden = title.hidden = true
    panel.hidden = false
    lockButton.focus()
  } catch {
    if (attempt !== generation) return
    status.textContent = ciphertext ? 'Could not unlock. Check the password and try again.' : 'Could not load the encrypted note. Please try again.'
    input.focus()
  } finally {
    password = ''
    if (attempt === generation) submit.disabled = false
  }
})

lockButton.addEventListener('click', () => { lock(); input.focus() })
window.addEventListener('pagehide', lock)
