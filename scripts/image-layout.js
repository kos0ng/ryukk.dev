// GitBook exports image layout as HTML in Markdown. Keep only layout values,
// never arbitrary inline styles, in both public and sealed articles.
const align = { name: 'align', values: ['left', 'center', 'right'] }
const sizes = { small: 188, medium: 375, large: 563, big: 563 }

// Standalone Markdown image + layout suffix, e.g. ![Map](map.png){align=left size=small}.
export function markdownImageLayout(md) {
  md.core.ruler.after('inline', 'image_layout', ({ tokens }) => {
    for (let i = 1; i < tokens.length - 1; i++) {
      const inline = tokens[i], open = tokens[i - 1], close = tokens[i + 1]
      if (open.type !== 'paragraph_open' || close.type !== 'paragraph_close' ||
          inline.type !== 'inline' || inline.children.length !== 2) continue
      const [image, tail] = inline.children
      if (image.type !== 'image' || tail.type !== 'text') continue
      const match = /^\{([^{}\n]+)\}$/.exec(tail.content)
      if (!match || !inline.content.endsWith(')' + tail.content)) continue
      const options = Object.create(null)
      const valid = match[1].trim().split(/\s+/).every(pair => {
        const [key, value, ...extra] = pair.split('=')
        if (extra.length || key in options || !(
          (key === 'align' && align.values.includes(value)) ||
          (key === 'size' && (value === 'original' || Object.hasOwn(sizes, value))) ||
          (key === 'width' && /^[1-9]\d{0,5}$/.test(value))
        )) return false
        options[key] = value
        return true
      })
      if (!valid) continue
      open.tag = close.tag = 'figure'
      open.hidden = close.hidden = false
      if (options.align) open.attrSet('align', options.align)
      if (options.size) image.attrSet('data-size', options.size)
      if (options.width) image.attrSet('width', options.width)
      inline.children.pop()
    }
  })
}

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
