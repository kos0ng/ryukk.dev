const tree = document.querySelector('.archive-tree')
const field = document.querySelector('.filter')
const pages = [...tree.querySelectorAll('[data-search]')]
const folders = [...tree.querySelectorAll('details')]
const items = [...tree.querySelectorAll('li')]
const count = document.querySelector('#count')
const initialCount = count.textContent
let beforeSearch

field.hidden = false
field.querySelector('input').addEventListener('input', (event) => {
  const terms = event.target.value
    .toLowerCase()
    .trim()
    .split(/\s+/)
    .filter(Boolean)
  if (!terms.length) {
    for (const item of items) item.hidden = false
    if (beforeSearch)
      for (const folder of folders) folder.open = beforeSearch.has(folder)
    beforeSearch = undefined
    count.textContent = initialCount
    return
  }
  beforeSearch ??= new Set(folders.filter((folder) => folder.open))
  const visible = new Set()
  let matches = 0
  for (const page of pages) {
    if (!terms.every((term) => page.dataset.search.includes(term))) continue
    matches++
    for (
      let item = page.closest('li');
      item;
      item = item.parentElement.closest('li')
    ) {
      if (visible.has(item)) break
      visible.add(item)
    }
  }
  for (const item of items) item.hidden = !visible.has(item)
  for (const folder of folders) folder.open = visible.has(folder.parentElement)
  count.textContent = matches
    ? `${matches} matching ${matches === 1 ? 'page' : 'pages'}`
    : 'No matches. Try another year, title or topic.'
})
