# Paper Shaders Svelte Service Docs

This site hosts interactive shader demos and usage examples for `@devmischief/shaders-svelte`.

## Main Endpoints

- `GET /` - homepage and shader directory
- `GET /sitemap.xml` - canonical URL sitemap
- `GET /robots.txt` - crawler directives and sitemap location
- `GET /{shader-slug}` - interactive shader playground pages

## Agent-Friendly Responses

- Send `Accept: text/markdown` to request markdown responses on HTML routes.
- Markdown responses include:
  - `Content-Type: text/markdown; charset=utf-8`
  - `x-markdown-tokens` estimated token count header
