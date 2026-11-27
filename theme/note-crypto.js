// RYN1: magic (4), random PBKDF2 salt (16), random GCM IV (12), ciphertext + 128-bit tag.
// The version fixes the algorithms and work factor; authenticate the entire header.
const magic = new TextEncoder().encode('RYN1')
const headerBytes = 32

async function parameters(password, header, usage) {
  const material = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveKey'])
  const key = await crypto.subtle.deriveKey({ name: 'PBKDF2', hash: 'SHA-256', iterations: 600000,
    salt: header.subarray(4, 20) }, material, { name: 'AES-GCM', length: 256 }, false, [usage])
  return [{ name: 'AES-GCM', iv: header.subarray(20), additionalData: header, tagLength: 128 }, key]
}

export async function seal(password, bytes) {
  const header = crypto.getRandomValues(new Uint8Array(headerBytes))
  header.set(magic)
  const ciphertext = await crypto.subtle.encrypt(...await parameters(password, header, 'encrypt'), bytes)
  const output = new Uint8Array(header.length + ciphertext.byteLength)
  output.set(header)
  output.set(new Uint8Array(ciphertext), header.length)
  return output
}

export async function unseal(password, bytes) {
  if (bytes.length < headerBytes + 16 || !magic.every((b, i) => bytes[i] === b)) throw Error('Invalid sealed note')
  return crypto.subtle.decrypt(...await parameters(password, bytes.subarray(0, headerBytes), 'decrypt'), bytes.subarray(headerBytes))
}
