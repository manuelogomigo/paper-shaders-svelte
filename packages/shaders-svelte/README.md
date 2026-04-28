# @devmischief/shaders-svelte

[![npm version](https://img.shields.io/npm/v/@devmischief/shaders-svelte.svg?color=ff3e00&label=npm)](https://www.npmjs.com/package/@devmischief/shaders-svelte)
[![license](https://img.shields.io/npm/l/@devmischief/shaders-svelte.svg)](https://github.com/manuelogomigo/paper-shaders-svelte/blob/main/LICENSE)
[![Svelte 5](https://img.shields.io/badge/Svelte-5-ff3e00.svg)](https://svelte.dev)
[![GitHub](https://img.shields.io/badge/GitHub-paper--shaders--svelte-181717.svg?logo=github)](https://github.com/manuelogomigo/paper-shaders-svelte)

> Svelte 5 components for [`@paper-design/shaders`](https://www.npmjs.com/package/@paper-design/shaders) — 28 GPU-accelerated WebGL shaders with a clean, typed API.

A faithful port of [Paper Design's React shader components](https://www.npmjs.com/package/@paper-design/shaders-react) to Svelte 5, built on the same [`@paper-design/shaders`](https://www.npmjs.com/package/@paper-design/shaders) WebGL engine.

---

## Install

```bash
pnpm add @devmischief/shaders-svelte
# or
npm i @devmischief/shaders-svelte
# or
yarn add @devmischief/shaders-svelte
```

> The underlying `@paper-design/shaders` package is included as a dependency — no extra install needed.

---

## Quick start

```svelte
<script lang="ts">
	import { MeshGradient } from '@devmischief/shaders-svelte';
</script>

<MeshGradient
	width="100%"
	height={400}
	colors={['#e0eaff', '#241d9a', '#f75092', '#9f50d3']}
	distortion={0.8}
	swirl={0.1}
	speed={1}
/>
```

Every component renders into a `<div>` that you can class, style, and absolutely position like any other DOM element.

---

## Components

### Image filters

Apply effects to your own images.

| Component | Description |
|-----------|-------------|
| `Dithering` | Animated 2-color dithering with multiple pattern sources |
| `FlutedGlass` | Glass refraction patterns over an image |
| `HalftoneCMYK` | CMYK halftone print effect |
| `HalftoneDots` | Halftone dot pattern in customizable grids |
| `ImageDithering` | Multi-color dithering applied to images |
| `PaperTexture` | Paper / canvas texture overlay with crumples and folds |
| `Water` | Animated caustic water surface over an image |

### Logo animations

Apply animated effects to logo shapes (require pre-processing — see [Performance](#performance)).

| Component | Description |
|-----------|-------------|
| `GemSmoke` | Glassy gem-like surface with smoky noise behind |
| `Heatmap` | Thermal heatmap effect flowing through a shape |
| `LiquidMetal` | Chromatic liquid-metal stripes warped by shape edges |

### Effects & gradients

Generative shaders that fill the canvas without an input image.

| Component | Description |
|-----------|-------------|
| `ColorPanels` | Glowing translucent 3D panels rotating around an axis |
| `DotGrid` | Static dot/diamond/square/triangle grid pattern |
| `DotOrbit` | Animated orbiting multi-color dots |
| `GodRays` | Animated rays of light radiating from center |
| `GrainGradient` | Grainy multi-color gradient with shape morphs |
| `MeshGradient` | Flowing multi-spot gradient with organic distortion |
| `Metaballs` | Up to 20 gooey colored balls merging into blobs |
| `NeuroNoise` | Glowing neural / web-like noise structure |
| `PerlinNoise` | Classic 3D Perlin noise with FBM controls |
| `PulsingBorder` | Luminous animated gradient contour |
| `SimplexNoise` | Multi-color gradient mapped onto Simplex noise |
| `SmokeRing` | Smoky radial ring with layered noise |
| `Spiral` | Animated spiral with stroke and noise controls |
| `StaticMeshGradient` | Static mesh gradient with two-direction warping |
| `StaticRadialGradient` | Static radial gradient with focal-point control |
| `Swirl` | Animated bands of color twisting from center |
| `Voronoi` | Anti-aliased animated Voronoi cells |
| `Warp` | Color fields warped by noise and swirls |
| `Waves` | Static line pattern morphing zigzag → sine → irregular |

**28 components total**, mirroring the Paper React catalog 1:1.

---

## Common props

Almost every component accepts these props. Defaults are chosen to match Paper's preset for that shader.

| Prop | Type | Description |
|------|------|-------------|
| `width` | `number \| string` | CSS width (default `"100%"`) |
| `height` | `number \| string` | CSS height (default `320`) |
| `speed` | `number` | Animation speed. `0` stops the loop |
| `frame` | `number` | Animation timestamp in ms (deterministic when `speed=0`) |
| `scale` | `number` | Zoom level (`0.01` to `4`) |
| `rotation` | `number` | Rotation in degrees (`0` to `360`) |
| `offsetX` / `offsetY` | `number` | Center offset (`-1` to `1`) |
| `fit` | `"none" \| "contain" \| "cover"` | Canvas fit mode |
| `originX` / `originY` | `number` | Reference point for world sizing (`0` to `1`) |
| `worldWidth` / `worldHeight` | `number` | Virtual graphic dimensions before fit |
| `minPixelRatio` | `number` | Minimum render DPR (default `2` for crisp antialiasing) |
| `maxPixelCount` | `number` | Render budget cap (default ≈ 8.3M pixels) |

Standard `<div>` attributes (`class`, `style`, `id`, `aria-*`, etc.) pass through to the host element.

---

## Performance

Each shader instance creates its own **WebGL context**, and browsers cap active contexts at ~16 per tab. If you render many shaders on a single page, follow these patterns.

### Lazy-mount on hover

Don't mount every shader at page load — only when the user can see them. The simplest pattern is to swap a static image for the live shader on `mouseenter` and dispose on `mouseleave`:

```svelte
<script lang="ts">
	import { MeshGradient } from '@devmischief/shaders-svelte';

	let active = $state(false);
</script>

<div
	onmouseenter={() => (active = true)}
	onmouseleave={() => (active = false)}
>
	<img src="/preview.png" alt="" />
	{#if active}
		<MeshGradient />
	{/if}
</div>
```

This keeps idle cards as zero-cost `<img>` tags and limits live WebGL contexts to whatever the user is actually hovering.

### Preloading expensive shaders

Three shaders pre-process their input image on the CPU before WebGL takes over (~150–250ms per image): `Heatmap`, `LiquidMetal`, and `GemSmoke`. You can warm their caches during page idle time so the first hover is instant:

```svelte
<script lang="ts">
	import { onMount } from 'svelte';
	import { preloadHeatmap, preloadLiquidMetal, preloadGemSmoke } from '@devmischief/shaders-svelte';

	onMount(() => {
		const logo = '/your-logo.svg';
		const schedule = window.requestIdleCallback ?? ((cb) => setTimeout(cb, 0));
		schedule(() => {
			void preloadHeatmap(logo).catch(() => {});
			void preloadLiquidMetal(logo).catch(() => {});
			void preloadGemSmoke(logo).catch(() => {});
		});
	});
</script>
```

Each unique URL is processed exactly once per page session. The processed image is cached at the module level — different component instances using the same URL share the same processed result.

---

## TypeScript

Every component exports a corresponding props type.

```ts
import type { MeshGradientSvelteProps, ShaderDimensions } from '@devmischief/shaders-svelte';

const myConfig: MeshGradientSvelteProps = {
	colors: ['#fff', '#000'],
	distortion: 0.5,
	speed: 1,
};
```

Available types: `ColorPanelsSvelteProps`, `DitheringSvelteProps`, `DotGridSvelteProps`, `DotOrbitSvelteProps`, `FlutedGlassSvelteProps`, `GemSmokeSvelteProps`, `GodRaysSvelteProps`, `GrainGradientSvelteProps`, `HalftoneCMYKSvelteProps`, `HalftoneDotsSvelteProps`, `HeatmapSvelteProps`, `ImageDitheringSvelteProps`, `LiquidMetalSvelteProps`, `MeshGradientSvelteProps`, `MetaballsSvelteProps`, `NeuroNoiseSvelteProps`, `PaperTextureSvelteProps`, `PerlinNoiseSvelteProps`, `PulsingBorderSvelteProps`, `ShaderDimensions`, `SimplexNoiseSvelteProps`, `SmokeRingSvelteProps`, `SpiralSvelteProps`, `StaticMeshGradientSvelteProps`, `StaticRadialGradientSvelteProps`, `SwirlSvelteProps`, `VoronoiSvelteProps`, `WarpSvelteProps`, `WaterSvelteProps`, `WavesSvelteProps`.

---

## SvelteKit / SSR

All components are SSR-safe — they render an empty `<div>` on the server and mount the shader after hydration. No special config required.

If you see Vite errors like `No loader is configured for ".svelte" files` during dependency optimization, exclude this package from `optimizeDeps`:

```ts
// vite.config.ts
import { defineConfig } from 'vite';
import { sveltekit } from '@sveltejs/kit/vite';

export default defineConfig({
	plugins: [sveltekit()],
	optimizeDeps: {
		exclude: ['@devmischief/shaders-svelte'],
	},
});
```

---

## Migrating from `@paper-design/shaders-react`

The Svelte API mirrors the React API name-for-name. The main differences:

| React | Svelte |
|-------|--------|
| `import { Mesh } from '@paper-design/shaders-react'` | `import { Mesh } from '@devmischief/shaders-svelte'` |
| `<Mesh colors={[…]} speed={1} />` | `<Mesh colors={[…]} speed={1} />` |
| `className="…"` | `class="…"` |
| `style={{ … }}` | `style="…"` |

Defaults match Paper's playground presets exactly, so most components render the same out of the box without explicit props.

---

## Acknowledgments

Built on top of the excellent [`@paper-design/shaders`](https://github.com/paper-design/shaders) by the Paper Design team. All credit for the GLSL shader sources, default presets, and visual design goes to them — this package only provides the Svelte 5 wrapper layer.

---

## Development

```bash
pnpm install
pnpm check
pnpm build
```

The package itself is in `packages/shaders-svelte/`. The `apps/showcase/` folder contains a SvelteKit demo app showing every shader in action.

---

## License

This package contains original Svelte wrapper/integration code and depends on
[`@paper-design/shaders`](https://www.npmjs.com/package/@paper-design/shaders).

The upstream shader engine license remains in effect for the underlying
dependency. See:

- `LICENSE`
- `NOTICE`
- `THIRD_PARTY_LICENSES.md`
