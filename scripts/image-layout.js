// GitBook exports image layout as HTML in Markdown. Keep only layout values,
// never arbitrary inline styles, in both public and sealed articles.
const align = { name: 'align', values: ['left', 'center', 'right'] }
const sizes = { small: 188, medium: 375, large: 563, big: 563 }

export const imageAttributes = {
  div: [align], figure: [align],
  img: ['src', 'alt', 'loading', 'width', { name: 'data-size', values: ['original', ...Object.keys(sizes)] }],
}

export function imageLayout(attrs) {
  const size = attrs['data-size']
  const width = /^[1-9]\d{0,5}$/.test(attrs.width) ? attrs.width
    : Object.hasOwn(sizes, size) ? String(sizes[size]) : null
  return { ...(width && { width }), ...(size && { 'data-size': size }) }
}
