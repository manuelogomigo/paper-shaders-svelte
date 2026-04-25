# @devmischief/shaders-svelte

Svelte wrapper components for [`@paper-design/shaders`](https://www.npmjs.com/package/@paper-design/shaders).

## Install

```bash
pnpm add @devmischief/shaders-svelte
```

This package includes `@paper-design/shaders` as a dependency, so users do not need to install it separately.

## Usage

```svelte
<script lang="ts">
	import { Dithering, MeshGradient, PaperTexture } from '@devmischief/shaders-svelte';
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

<MeshGradient
	width={1280}
	height={720}
	colors={['#e0eaff', '#241d9a', '#f75092', '#9f50d3']}
	distortion={0.8}
	swirl={0.1}
	grainMixer={0}
	grainOverlay={0}
	speed={1}
/>

<PaperTexture
	image="https://paper.design/flowers.webp"
	colorBack="#ffffff"
	colorFront="#9fadbc"
	contrast={0.3}
	roughness={0.4}
	fiber={0.3}
	fiberSize={0.2}
	crumples={0.3}
	crumpleSize={0.35}
	folds={0.65}
	foldCount={5}
	drops={0.2}
	fade={0}
	seed={6}
	scale={0.6}
	fit="cover"
/>
```

Default usage is also supported:

```svelte
<Dithering />
```

## Troubleshooting (Vite)

If you see an error like `No loader is configured for ".svelte" files` during dependency optimization,
exclude this package from Vite optimizeDeps:

```ts
import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
	plugins: [svelte()],
	optimizeDeps: {
		exclude: ['@devmischief/shaders-svelte']
	}
});
```

This is a Vite/esbuild prebundle behavior in some setups. The package structure is standard for Svelte libraries.

## AI Prompt (Copy/Paste)

Use this prompt with Claude/Cursor/GPT when integrating this package:

```txt
Integrate @devmischief/shaders-svelte into my Svelte app.

Requirements:
1) Install the package and use the Dithering component in my main page.
2) Keep layout stable and visible by setting explicit container height or Dithering height.
3) If Vite optimizeDeps errors mention ".svelte" loader, update vite config:
   optimizeDeps.exclude = ['@devmischief/shaders-svelte']
4) Do not break existing styles or routing.
5) After changes, run project checks/build and summarize what changed.
```

## Release Notes Template

Use this for your next release description:

```md
### @devmischief/shaders-svelte - patch release

- Fix `Dithering` defaults so `<Dithering />` renders with a visible height out of the box.
- Improve prop forwarding so `class` and standard div attributes work correctly.
- Update docs with Vite troubleshooting for optimizeDeps/esbuild `.svelte` loader errors.
- Add copy/paste AI integration prompt for faster setup in existing Svelte apps.

If your app shows `No loader is configured for ".svelte" files`, add:

```ts
optimizeDeps: {
  exclude: ['@devmischief/shaders-svelte']
}
```
```

## Exports

Components:

- `Dithering`
- `DotGrid`
- `DotOrbit`
- `FlutedGlass`
- `GrainGradient`
- `HalftoneCMYK`
- `HalftoneDots`
- `ImageDithering`
- `MeshGradient`
- `NeuroNoise`
- `PaperTexture`
- `Spiral`
- `StaticMeshGradient`
- `StaticRadialGradient`
- `Swirl`
- `Warp`
- `Water`
- `Waves`

Types:

- `DitheringSvelteProps`
- `DotGridSvelteProps`
- `DotOrbitSvelteProps`
- `FlutedGlassSvelteProps`
- `GrainGradientSvelteProps`
- `HalftoneCMYKSvelteProps`
- `HalftoneDotsSvelteProps`
- `ImageDitheringSvelteProps`
- `MeshGradientSvelteProps`
- `NeuroNoiseSvelteProps`
- `PaperTextureSvelteProps`
- `SpiralSvelteProps`
- `StaticMeshGradientSvelteProps`
- `StaticRadialGradientSvelteProps`
- `SwirlSvelteProps`
- `WarpSvelteProps`
- `WaterSvelteProps`
- `WavesSvelteProps`
- `ShaderDimensions`

## Development

```bash
pnpm install
pnpm check
pnpm build
```
