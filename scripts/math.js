import { randomUUID } from 'node:crypto'
import { tex } from '@mdit/plugin-tex'
import katex from 'katex'

export function archiveMath(md) {
  md.use(tex, {
    delimiters: 'all',
    mathFence: true,
    render: (source, display, env) => env.math.slot(source, display),
  })
  // Single dollars also occur in registers, format strings and mangled names.
  // Require a standalone pair, unlike the default rule which accepts `$a+$b`.
  const inline =
    /\$(?![\s$])((?:\\[^\n]|[^\\$\n])+?)(?<!\s)\$(?![\p{L}\p{N}_$])/uy
  md.inline.ruler.at('math_inline_dollar', (state, silent) => {
    const pos = state.pos
    if (
      state.src[pos] !== '$' ||
      /[\p{L}\p{N}_$]/u.test(state.src[pos - 1] || '')
    )
      return false
    inline.lastIndex = pos
    const match = inline.exec(state.src)
    if (!match || inline.lastIndex > state.posMax) return false
    state.pos = inline.lastIndex
    if (!silent) {
      const token = state.push('math_inline', 'math', 0)
      token.content = match[1]
      token.markup = '$'
    }
    return true
  })
}

// Keep imported HTML under the existing sanitizer. Restore only KaTeX output
// we generated ourselves, so user HTML doesn't gain access to styles or SVG.
export function mathSlots(page) {
  const prefix = `math-${randomUUID()}-`
  const formulas = []
  return {
    slot(source, displayMode) {
      try {
        const html = katex.renderToString(source.trim(), {
          displayMode,
          trust: false,
          throwOnError: true,
          strict: 'error',
        })
        return `<span>${prefix}${formulas.push(html) - 1}</span>`
      } catch (cause) {
        throw new Error(`Invalid LaTeX in ${page}: ${cause.message}`, { cause })
      }
    },
    restore(html) {
      return html.replace(
        new RegExp(`<span>${prefix}(\\d+)</span>`, 'g'),
        (_, i) => formulas[i]
      )
    },
  }
}
