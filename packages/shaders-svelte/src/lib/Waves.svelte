<script lang="ts">
	import { onDestroy, onMount } from "svelte";
	import type { HTMLAttributes } from "svelte/elements";
	import {
		wavesFragmentShader,
		ShaderMount,
	} from "@paper-design/shaders";
	import {
		toCssSize,
		toWavesUniforms,
		type WavesSvelteProps,
		type ShaderDimensions,
	} from "./internal/common";

	type DivRestProps = Omit<
		HTMLAttributes<HTMLDivElement>,
		"type" | "class" | "style"
	>;

	type WavesProps = {
		width?: ShaderDimensions;
		height?: ShaderDimensions;
		colorBack?: WavesSvelteProps["colorBack"];
		colorFront?: WavesSvelteProps["colorFront"];
		shape?: WavesSvelteProps["shape"];
		frequency?: WavesSvelteProps["frequency"];
		amplitude?: WavesSvelteProps["amplitude"];
		spacing?: WavesSvelteProps["spacing"];
		proportion?: WavesSvelteProps["proportion"];
		softness?: WavesSvelteProps["softness"];
		scale?: WavesSvelteProps["scale"];
		rotation?: WavesSvelteProps["rotation"];
		offsetX?: WavesSvelteProps["offsetX"];
		offsetY?: WavesSvelteProps["offsetY"];
		fit?: WavesSvelteProps["fit"];
		worldWidth?: WavesSvelteProps["worldWidth"];
		worldHeight?: WavesSvelteProps["worldHeight"];
		originX?: WavesSvelteProps["originX"];
		originY?: WavesSvelteProps["originY"];
		minPixelRatio?: number;
		maxPixelCount?: number;
		class?: HTMLAttributes<HTMLDivElement>["class"];
		style?: HTMLAttributes<HTMLDivElement>["style"];
	} & DivRestProps;

	let {
		width = "100%",
		height = 320,
		colorBack = "#000000",
		colorFront = "#ffbb00",
		shape = 1,
		frequency = 0.5,
		amplitude = 0.5,
		spacing = 1.2,
		proportion = 0.1,
		softness = 0,
		scale = 0.6,
		rotation = 0,
		offsetX = 0,
		offsetY = 0,
		fit = "none",
		worldWidth = 0,
		worldHeight = 0,
		originX = 0.5,
		originY = 0.5,
		minPixelRatio = 2,
		maxPixelCount = 1920 * 1080 * 4,
		class: className,
		style: styleValue,
		...restProps
	}: WavesProps = $props();

	const hostStyle = $derived.by(() => {
		const styles: string[] = [];
		if (width !== undefined)
			styles.push(`width:${toCssSize(width, "100%")}`);
		if (height !== undefined)
			styles.push(`height:${toCssSize(height, "100%")}`);
		if (typeof styleValue === "string" && styleValue.trim().length > 0)
			styles.push(styleValue.trim());
		return styles.join(";");
	});

	const uniforms = $derived(
		toWavesUniforms({
			colorBack,
			colorFront,
			shape,
			frequency,
			amplitude,
			spacing,
			proportion,
			softness,
			scale,
			rotation,
			offsetX,
			offsetY,
			fit,
			worldWidth,
			worldHeight,
			originX,
			originY,
		}),
	);

	let host: HTMLDivElement | undefined;
	let shader: ShaderMount | undefined;

	onMount(() => {
		if (typeof window === "undefined" || !host) return;
		shader = new ShaderMount(
			host,
			wavesFragmentShader,
			uniforms,
			undefined,
			0,
			0,
			minPixelRatio,
			maxPixelCount,
		);
	});

	$effect(() => {
		const next = uniforms;
		if (!shader) return;
		shader.setUniforms(next);
	});

	$effect(() => {
		if (!shader) return;
		shader.setMinPixelRatio(minPixelRatio);
	});

	$effect(() => {
		if (!shader) return;
		shader.setMaxPixelCount(maxPixelCount);
	});

	onDestroy(() => {
		shader?.dispose();
		shader = undefined;
	});
</script>

<div {...restProps} class={className} style={hostStyle} bind:this={host}></div>
