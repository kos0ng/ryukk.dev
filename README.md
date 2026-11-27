# ryukk.dev

kos0ng’s CTF write-ups and security notebooks. The site builds static HTML from versioned Markdown, without a database or GitBook requests at build time.

## Local development

Use Node 20.19+ and run `npm ci`, then `npm start`. The preview server uses port 8080 by default. Rebuild after edits with `npm run build`. Deploy the resulting `public/` directory; Netlify settings are included.

After building, run `python3 scripts/check-site.py` to verify that every Markdown file has a published page and that all local links, images and heading references resolve.

## Content

- `books/posts/` mirrors the [CTF GitBook](https://kos0ng.gitbook.io/ctfs). The Posts index shows write-ups by year → competition → category. Expanding a competition reveals its recorded participation result (when available) above direct links to category write-ups. The team and placement are also searchable. Collections holds authored challenges (grouped by year) and Lifetime CTF. The introduction and write-up year overviews keep their URLs but are omitted from the index. Filtering opens matching branches; clearing the search restores your place.
- `books/notes/` mirrors the [Notes GitBook](https://kos0ng.gitbook.io/notes). The `/notes/` tree lists research by year and omits the introduction and year overviews. Old `/shelves/` bookmarks redirect to their matching `/notes/` pages.
- Run `npm run import` from a networked machine with Python 3.9+ and curl to refresh Markdown from both page sitemaps. Review changes before publishing. It does not delete files for pages removed upstream.
- The collection roots serve searchable indexes. Each book’s introduction and other Markdown pages retain their source paths. Images and downloads remain hosted at their original URLs.
- `theme/` contains the pixel landscape, palette, typography and optional archive filter. The full archive is navigable without JavaScript. Language-tagged code blocks are highlighted at build time with Highlight.js and its Tokyo Night Dark theme; unlabelled or unsupported languages stay plain text.

## Challenge indexes

Use `Challenge | Topic`: link the challenge name (including points and medals) to its heading, a migrated article, or a verified external solution. Use short topic labels from the write-up; an undocumented technique is not a reason to guess. Leave the name as plain text when there is no known destination.

For indexes converted from GitBook’s `Challenge | Link` format, edit the Markdown between the `challenge-index` comments. The fingerprint identifies the **old upstream table**, not the edited one. On refresh the importer keeps the curated block and imports the rest of the page normally. If the upstream table changes, it stops on that page for manual reconciliation rather than dropping local topics or new challenges.

## Writing equations

Use `$x_i$` or `\(x_i\)` for inline math. Put display equations between `$$` lines, `\[...\]`, or in a fenced `math` block. For multiple rows, use a `gathered` or `aligned` environment. KaTeX renders HTML and accessible MathML during the build; styles and fonts are served locally, with no browser JavaScript required. Invalid TeX stops the build and identifies the affected page. On import, display equations are recovered from GitBook’s original TeX annotations rather than its Markdown-escaped version.

## License

The original site code was distributed under the [MIT License](LICENSE). Imported write-ups, images and linked materials retain their respective ownership.
