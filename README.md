# ryukk.dev

Achmad Zaenuri Dahlan Putra (kos0ng)’s CTF write-ups and security notebooks. The site builds static HTML from versioned Markdown, without a database or GitBook requests at build time.

## Local development

Use Node 20+ and run `npm ci`, then `npm start`. The preview server uses port 8080 by default. Rebuild after edits with `npm run build`. Deploy the resulting `public/` directory; Netlify settings are included.

After building, run `python3 scripts/check-site.py` to verify that every Markdown file has a published page and that all local links, images and heading references resolve.

## Content

- `books/posts/` mirrors the [CTF GitBook](https://kos0ng.gitbook.io/ctfs).
- `books/shelves/` mirrors the [Notes GitBook](https://kos0ng.gitbook.io/notes).
- Run `npm run import` from a networked machine with Python 3.9+ and curl to refresh Markdown from both page sitemaps. Review changes before publishing. It does not delete files for pages removed upstream.
- The collection roots serve searchable indexes. Each book’s introduction and other Markdown pages retain their source paths and link back to GitBook. Images and downloads remain hosted at their original URLs.
- `theme/` contains the pixel landscape, palette, typography and optional archive filter. The full archive is navigable without JavaScript.

## License

The original site code was distributed under the [MIT License](LICENSE). Imported write-ups, images and linked materials retain their respective ownership.
