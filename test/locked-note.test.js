import test from 'node:test'
import assert from 'node:assert/strict'
import { randomBytes } from 'node:crypto'
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { spawnSync } from 'node:child_process'
import { gunzipSync } from 'node:zlib'
import { unseal } from '../theme/note-crypto.js'

test('sealed Markdown and images are authenticated, private, and rendered without active content', async () => {
  const dir = mkdtempSync(join(tmpdir(), 'locked-note-test-'))
  try {
    const source = join(dir, 'private.md'), out = join(dir, 'note.locked')
    const secret = randomBytes(24).toString('hex'), text = 'private-' + randomBytes(16).toString('hex')
    writeFileSync(source, `# Private example\n\n${text}\n\n![Example](a.png){align=center size=small}\n\n<div align="right"><figure><img src="a.png" alt="Detail" width="307"></figure></div>\n\n<script>alert(1)</script>\n`)
    writeFileSync(join(dir, 'a.png'), Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+a3XkAAAAASUVORK5CYII=', 'base64'))
    const result = spawnSync(process.execPath, ['scripts/seal-note.js', source, out], { input: secret })
    assert.equal(result.status, 0, result.stderr.toString())
    const sealed = readFileSync(out)
    assert.ok(!sealed.includes(secret) && !sealed.includes(text))
    const html = gunzipSync(Buffer.from(await unseal(secret, sealed))).toString()
    assert.match(html, /<figure align="center">\s*<img [^>]*width="188"/)
    assert.ok(html.includes(text) && html.includes('src="data:image/png;base64,'))
    assert.match(html, /<div align="right"><figure><img src="data:image\/png;base64,[^"]+" alt="Detail" loading="lazy" width="307"/)
    assert.doesNotMatch(html, /<script|src="a\.png"/)
    await assert.rejects(unseal('incorrect', sealed))
    sealed[sealed.length - 1] ^= 1
    await assert.rejects(unseal(secret, sealed))
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
})
