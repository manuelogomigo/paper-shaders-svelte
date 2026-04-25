# paper-shaders-svelte

Monorepo for [`@devmischief/shaders-svelte`](https://www.npmjs.com/package/@devmischief/shaders-svelte) — Svelte 5 components for [`@paper-design/shaders`](https://www.npmjs.com/package/@paper-design/shaders).

[![npm version](https://img.shields.io/npm/v/@devmischief/shaders-svelte.svg?color=ff3e00&label=npm)](https://www.npmjs.com/package/@devmischief/shaders-svelte)
[![Svelte 5](https://img.shields.io/badge/Svelte-5-ff3e00.svg)](https://svelte.dev)
[![license](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)

## What's in here

| Path | What it is |
|------|------------|
| [`packages/shaders-svelte`](./packages/shaders-svelte) | The published npm package — 28 Svelte 5 shader components |
| [`apps/showcase`](./apps/showcase) | SvelteKit demo app showing every shader live |

## Getting started

### Install in your own project

```bash
pnpm add @devmischief/shaders-svelte
```

See the [package README](./packages/shaders-svelte/README.md) for usage, the full component catalog, and performance tips.

### Run the showcase locally

```bash
pnpm install
cd apps/showcase
pnpm dev
```

### Develop the package

```bash
pnpm install
cd packages/shaders-svelte
pnpm check   # type-check
pnpm build   # emit dist/
```

## Acknowledgments

Built on [`@paper-design/shaders`](https://github.com/paper-design/shaders) by the Paper Design team. This repo provides the Svelte 5 wrapper layer over their WebGL engine.

## License

[MIT](./LICENSE) © DevMischief
