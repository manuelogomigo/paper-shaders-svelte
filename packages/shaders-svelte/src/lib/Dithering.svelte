<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { ditheringFragmentShader, ShaderMount } from '@paper-design/shaders';
	import { toCssSize, toDitheringUniforms, type DitheringSvelteProps, type ShaderDimensions } from './internal/common';

	const props = $props<{
		width?: ShaderDimensions;
		height?: ShaderDimensions;
		colorBack?: DitheringSvelteProps['colorBack'];
		colorFront?: DitheringSvelteProps['colorFront'];
		shape?: DitheringSvelteProps['shape'];
		type?: DitheringSvelteProps['type'];
		size?: DitheringSvelteProps['size'];
		speed?: DitheringSvelteProps['speed'];
		frame?: DitheringSvelteProps['frame'];
		scale?: DitheringSvelteProps['scale'];
		rotation?: DitheringSvelteProps['rotation'];
		offsetX?: DitheringSvelteProps['offsetX'];
		offsetY?: DitheringSvelteProps['offsetY'];
		fit?: DitheringSvelteProps['fit'];
		worldWidth?: DitheringSvelteProps['worldWidth'];
		worldHeight?: DitheringSvelteProps['worldHeight'];
		originX?: DitheringSvelteProps['originX'];
		originY?: DitheringSvelteProps['originY'];
		minPixelRatio?: DitheringSvelteProps['minPixelRatio'];
		maxPixelCount?: DitheringSvelteProps['maxPixelCount'];
	}>();

	const width = $derived(props.width ?? '100%');
	const height = $derived(props.height ?? '100%');
	const colorBack = $derived(props.colorBack ?? '#301c2a');
	const colorFront = $derived(props.colorFront ?? '#56ae6c');
	const shape = $derived(props.shape ?? 'warp');
	const type = $derived(props.type ?? '4x4');
	const size = $derived(props.size ?? 1);
	const speed = $derived(props.speed ?? 1);
	const frame = $derived(props.frame ?? 0);
	const scale = $derived(props.scale ?? 1);
	const rotation = $derived(props.rotation ?? 0);
	const offsetX = $derived(props.offsetX ?? 0);
	const offsetY = $derived(props.offsetY ?? 0);
	const fit = $derived(props.fit ?? 'none');
	const worldWidth = $derived(props.worldWidth ?? 0);
	const worldHeight = $derived(props.worldHeight ?? 0);
	const originX = $derived(props.originX ?? 0.5);
	const originY = $derived(props.originY ?? 0.5);
	const minPixelRatio = $derived(props.minPixelRatio ?? 2);
	const maxPixelCount = $derived(props.maxPixelCount ?? 1920 * 1080 * 4);

	let host: HTMLDivElement | undefined;
	let shader: ShaderMount | undefined;

	function currentUniforms() {
		return toDitheringUniforms({
			colorBack,
			colorFront,
			shape,
			type,
			size,
			scale,
			rotation,
			offsetX,
			offsetY,
			fit,
			worldWidth,
			worldHeight,
			originX,
			originY
		});
	}

	onMount(() => {
		if (typeof window === 'undefined' || !host) return;
		shader = new ShaderMount(
			host,
			ditheringFragmentShader,
			currentUniforms(),
			undefined,
			speed,
			frame,
			minPixelRatio,
			maxPixelCount
		);
	});

	$effect(() => {
		if (!shader) return;
		shader.setUniforms(currentUniforms());
		shader.setSpeed(speed);
		shader.setFrame(frame ?? 0);
		shader.setMinPixelRatio(minPixelRatio);
		shader.setMaxPixelCount(maxPixelCount);
	});

	onDestroy(() => {
		shader?.dispose();
		shader = undefined;
	});
</script>

<div bind:this={host} style:width={toCssSize(width, '100%')} style:height={toCssSize(height, '100%')}></div>
