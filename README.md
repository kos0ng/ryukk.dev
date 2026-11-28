# ryukk.dev

kos0ng’s CTF write-ups and security notebooks. The site builds static HTML from versioned Markdown and local media. Neither builds nor readers need GitBook to load an article.

## Local development

Use Node 20.19+ and run `npm ci`, then `npm start`. The preview server uses port 8080 by default. Rebuild after edits with `npm run build`. Deploy the resulting `public/` directory; Netlify settings are included.

After building, run `python3 scripts/check-site.py` to verify that every Markdown file has a published page and that all local links, images and heading references resolve.

## Publishing

[GitHub Actions](https://github.com/kos0ng/ryukk.dev/actions/workflows/pages.yml) builds, checks and deploys the blog on pushes to `master`, or via **Run workflow**. The initial address is <https://kos0ng.github.io/ryukk.dev/>. The workflow publishes only `public/`. Its page links are relative, so the same deployment also works at the root of a custom domain.

To connect `ryukk.dev` later, verify domain ownership in your GitHub account’s **Settings → Pages**, then add `ryukk.dev` under the **repository’s Settings → Pages → Custom domain**. Follow [GitHub’s DNS instructions](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site) for an apex domain. Once GitHub validates DNS and issues the certificate, enable **Enforce HTTPS**. Re-run the workflow so the sitemap uses the new domain.

## Content

- `books/posts/` mirrors the [CTF GitBook](https://kos0ng.gitbook.io/ctfs). The Posts index shows write-ups by year → competition → category. Expanding a competition reveals its recorded participation result (when available) above direct links to category write-ups. The team and placement are also searchable. Collections holds authored challenges (grouped by year) and Lifetime CTF. Write-up year overviews keep their URLs but are omitted from the index. Filtering opens matching branches; clearing the search restores your place.
- `books/notes/` mirrors the [Notes GitBook](https://kos0ng.gitbook.io/notes). The `/notes/` tree lists research by year and omits year overviews. Old `/shelves/` bookmarks redirect to their matching `/notes/` pages.
- Run `npm run import` only if you want to refresh from the old GitBooks. The importer requires network access, Python 3.9+, curl, and Pillow (`python3 -m pip install Pillow`) for new images. It reuses local copies when available. Review changes before publishing. It does not delete files for pages removed upstream.
- The collection roots serve searchable indexes. The retired `/posts/introduction/`, `/notes/introduction/`, and `/shelves/introduction/` URLs redirect to their respective archives. Article images are versioned in an `images/` folder beside their `index.md` and copied byte-for-byte into the published page directory. To add an image, save it there and use `![Description](images/filename.png)`. Outbound citations and third-party download links remain external.
- `theme/` contains the pixel landscape, palette, typography and optional archive filter. The full archive is navigable without JavaScript. Language-tagged code blocks are highlighted at build time with Highlight.js and its Tokyo Night Dark theme; unlabelled or unsupported languages stay plain text.

## Image size and alignment

For an inline image, use `![Description](images/filename.png)`. To position or resize a standalone image, append this blog’s optional Markdown layout suffix. Separate each image from surrounding text with blank lines:

```md
![Login screen](images/login.png){align=left size=small}

![Settings dialog](images/settings.png){align=center size=medium}

![Dashboard](images/dashboard.png){align=right size=big}
```

Use `width=420` instead of `size=medium` for an exact pixel width. Standard Markdown readers may show the suffix as text. Imported GitBook HTML also works, including captions:

```html
<div align="right"><figure><img src="images/screenshot.png" alt="Settings dialog" width="375"><figcaption>Settings before saving.</figcaption></figure></div>
```

- Change `align` to `left`, `center`, or `right`. Without a wrapper, figures default to centered. You can also put `align` directly on the figure. The caption follows the image.
- Change `width="375"` to a positive pixel width (no `px`), or replace it with `data-size="small"` (188 px), `medium` (375 px), `large` / `big` (563 px), or `original`. An explicit width wins. With neither attribute, the intrinsic size is used. Images always shrink to fit a narrower reading column.
- Omit `<figcaption>…</figcaption>` if no caption is needed. Rebuild after editing; no JavaScript or CSS changes are required. For a [protected note](docs/locked-notes.md), edit the private Markdown and re-seal it instead of editing the public title stub.

## Challenge indexes

Use `Challenge | Topic`: link the challenge name (including points and medals) to its heading, a migrated article, or a verified external solution. Use short topic labels from the write-up; an undocumented technique is not a reason to guess. Leave the name as plain text when there is no known destination.

For indexes converted from GitBook’s `Challenge | Link` format, edit the Markdown between the `challenge-index` comments. The fingerprint identifies the **old upstream table**, not the edited one. On refresh the importer keeps the curated block and imports the rest of the page normally. If the upstream table changes, it stops on that page for manual reconciliation rather than dropping local topics or new challenges.

## Writing equations

Use `$x_i$` or `\(x_i\)` for inline math. Put display equations between `$$` lines, `\[...\]`, or in a fenced `math` block. For multiple rows, use a `gathered` or `aligned` environment. KaTeX renders HTML and accessible MathML during the build; styles and fonts are served locally, with no browser JavaScript required. Invalid TeX stops the build and identifies the affected page. On import, display equations are recovered from GitBook’s original TeX annotations rather than its Markdown-escaped version.

## License

The original site code was distributed under the [MIT License](LICENSE). Imported write-ups, images and linked materials retain their respective ownership.
