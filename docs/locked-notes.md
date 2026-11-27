# Publishing a password-protected note

Keep the real Markdown and illustrations **outside the repository**. A protected page has an ordinary directory under `books/notes/` containing only `index.md` (a single public `# Title`) and `note.locked`. Its title, URL, and approximate size are public. Never commit the password, source, or cleartext images, including on another branch.

Create or update the encrypted payload locally. This example prompts without echoing the passphrase or putting it in shell history or process arguments:

```sh
python3 -c 'from getpass import getpass; print(getpass("Note password: "))' | \
  node scripts/seal-note.js /private/path/to/article.md books/notes/research/YEAR/SLUG/note.locked
```

The sealer sanitizes and renders Markdown and embeds its PNG/JPEG/GIF/WebP illustrations (relative files or HTTPS GitBook uploads). It compresses and encrypts the entire result with AES-256-GCM, a random nonce and a key derived with PBKDF2-SHA-256 (600,000 iterations, random 128-bit salt). Builds copy only ciphertext and do not need a secret in GitHub Actions. Readers unlock it in their browser over HTTPS or localhost. No password is sent to the server or saved in browser storage.

Use a strong, unique passphrase and share it separately. A shared-password page does not prevent authorized readers from saving a copy, revoke previously downloaded content, protect the upstream originals, or provide server-side rate limiting against offline guesses. Never publish cleartext first and rely on deleting it later.
