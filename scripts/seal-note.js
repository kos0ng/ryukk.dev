// Author-side only. Writes one authenticated binary; neither HTML nor image bytes go on disk in cleartext.
import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve, relative, isAbsolute, sep } from 'node:path'
import { gzipSync } from 'node:zlib'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import MarkdownIt from 'markdown-it'
import sanitize from 'sanitize-html'
import { indexHeadings } from './table-of-contents.js'
import { highlightCode } from './highlight-code.js'
import { seal } from '../theme/note-crypto.js'

const [source, output] = process.argv.slice(2)
if (!source || !output || process.stdin.isTTY) throw Error('Pass the Markdown and output paths; supply the password on stdin, not as an argument.')
const password = readFileSync(0, 'utf8').replace(/\r?\n$/, '')
if (!password || /[\r\n]/.test(password)) throw Error('Expected one non-empty passphrase on stdin')
const md = MarkdownIt({ html: true })
const env = {}
const tokens = md.parse(readFileSync(source, 'utf8'), env)
indexHeadings(tokens)
const sources = new Map()
const html = highlightCode(sanitize(md.renderer.render(tokens, md.options, env), {
  allowedTags: [...sanitize.defaults.allowedTags, 'img', 'figure', 'figcaption', 'details', 'summary', 'kbd', 'del', 'mark'],
  allowedAttributes: { a: ['href'], img: ['src', 'alt', 'loading'], code: ['class'], ol: ['start'],
    ...Object.fromEntries(['h1','h2','h3','h4','h5','h6'].map(tag => [tag, ['id']])) },
  allowedSchemes: ['https', 'http', 'mailto'],
  transformTags: { img: (_, a) => {
    if (!a.src) throw Error('Private image without a source')
    if (!sources.has(a.src)) sources.set(a.src, sources.size)
    return { tagName: 'img', attribs: { src: `private-media/${sources.get(a.src)}`, alt: a.alt || '', loading: 'lazy' } }
  } },
}))
const curl = promisify(execFile)
async function imageData(src) {
  let data
  if (/^https:\/\/\d+-files\.gitbook\.io\//.test(src)) {
    try {
      const { stdout } = await curl('curl', ['-fsSL', '--proto', '=https', '--proto-redir', '=https', '--max-filesize', '41943040', '--max-time', '60', '--retry', '2', '--', src], { encoding: 'buffer', maxBuffer: 42 * 1024 ** 2 })
      data = stdout
    } catch { throw Error('Could not download a private illustration; no output written.') }
  } else {
    const root = dirname(resolve(source)), path = resolve(root, src), rel = relative(root, path)
    if (/^(?:[a-z][\w+.-]*:|\/)/i.test(src) || rel === '..' || rel.startsWith('..' + sep) || isAbsolute(rel)) throw Error('Expected a local image beside the Markdown or a GitBook upload')
    data = readFileSync(path)
  }
  const mime = data.subarray(0, 8).toString('hex') === '89504e470d0a1a0a' ? 'image/png'
    : data[0] === 255 && data[1] === 216 ? 'image/jpeg'
    : /^GIF8[79]a$/.test(data.toString('ascii', 0, 6)) ? 'image/gif'
    : data.toString('ascii', 0, 4) === 'RIFF' && data.toString('ascii', 8, 12) === 'WEBP' ? 'image/webp' : null
  if (!mime) throw Error('Private attachment is not a supported raster image')
  return `data:${mime};base64,${data.toString('base64')}`
}
const urls = [...sources.keys()], images = []
for (let i = 0; i < urls.length; i += 6) images.push(...await Promise.all(urls.slice(i, i + 6).map(imageData)))
const embedded = html.replace(/(<img\s+src=")private-media\/(\d+)(")/g, (_, before, i, after) => before + images[i] + after)
if (embedded.includes('<img src="private-media/')) throw Error('Unresolved image')
writeFileSync(output, await seal(password, gzipSync(embedded)))
console.log(`Sealed note including ${images.length} distinct images.`)
