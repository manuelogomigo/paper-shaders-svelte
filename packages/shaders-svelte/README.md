# @devmischief/paper-shaders-svelte

Svelte wrapper components for [`@paper-design/shaders`](https://www.npmjs.com/package/@paper-design/shaders).

## Install

```bash
pnpm add @devmischief/paper-shaders-svelte
```

This package includes `@paper-design/shaders` as a dependency, so users do not need to install it separately.

## Usage

```svelte
<script lang="ts">
	import { Dithering } from '@devmischief/paper-shaders-svelte';
</script>

<Dithering
	width={1280}
	height={720}
	colorBack="#301c2a"
	colorFront="#56ae6c"
	shape="warp"
	type="4x4"
	size={1}
	speed={1}
	scale={0.8}
	offsetX={-0.02}
/>
```

## Exports

- `Dithering`

## Development

```bash
pnpm install
pnpm check
pnpm build
```
