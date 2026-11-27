const field = document.querySelector('.filter')
field.hidden = false
const rows = [...document.querySelectorAll('#entries li')].map((row) => [
  row,
  row.textContent.toLowerCase(),
])
field.querySelector('input').addEventListener('input', (event) => {
  const query = event.target.value.trim().toLowerCase()
  let count = 0
  for (const [row, text] of rows) {
    row.hidden = !text.includes(query)
    if (!row.hidden) count++
  }
  document.querySelector('#count').textContent = count
    ? count + (count === 1 ? ' entry' : ' entries')
    : 'No matches. Try another year or topic.'
})
