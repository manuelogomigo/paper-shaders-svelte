<script lang="ts">
	import { onDestroy, onMount } from "svelte";
	import type { HTMLAttributes } from "svelte/elements";
	import {
		perlinNoiseFragmentShader,
		ShaderMount,
	} from "@paper-design/shaders";
	import {
		toCssSize,
		toPerlinNoiseUniforms,
		type PerlinNoiseSvelteProps,
		type ShaderDimensions,
	} from "./internal/common";

	type DivRestProps = Omit<
		HTMLAttributes<HTMLDivElement>,
		"type" | "class" | "style"
	>;

	type PerlinNoiseProps = {
		width?: ShaderDimensions;
		height?: ShaderDimensions;
		colorBack?: PerlinNoiseSvelteProps["colorBack"];
		colorFront?: PerlinNoiseSvelteProps["colorFront"];
		proportion?: PerlinNoiseSvelteProps["proportion"];
		softness?: PerlinNoiseSvelteProps["softness"];
		octaveCount?: PerlinNoiseSvelteProps["octaveCount"];
		persistence?: PerlinNoiseSvelteProps["persistence"];
		lacunarity?: PerlinNoiseSvelteProps["lacunarity"];
		scale?: PerlinNoiseSvelteProps["scale"];
		rotation?: PerlinNoiseSvelteProps["rotation"];
		offsetX?: PerlinNoiseSvelteProps["offsetX"];
		offsetY?: PerlinNoiseSvelteProps["offsetY"];
		fit?: PerlinNoiseSvelteProps["fit"];
		worldWidth?: PerlinNoiseSvelteProps["worldWidth"];
		worldHeight?: PerlinNoiseSvelteProps["worldHeight"];
		originX?: PerlinNoiseSvelteProps["originX"];
		originY?: PerlinNoiseSvelteProps["originY"];
		speed?: PerlinNoiseSvelteProps["speed"];
		frame?: PerlinNoiseSvelteProps["frame"];
		minPixelRatio?: PerlinNoiseSvelteProps["minPixelRatio"];
		maxPixelCount?: PerlinNoiseSvelteProps["maxPixelCount"];
		class?: HTMLAttributes<HTMLDivElement>["class"];
		style?: HTMLAttributes<HTMLDivElement>["style"];
	} & DivRestProps;

	let {
		width = "100%",
		height = 320,
		colorBack = "#632ad5",
		colorFront = "#fccff7",
		proportion = 0.35,
		softness = 0.1,
		octaveCount = 1,
		persistence = 1,
		lacunarity = 1.5,
		scale = 1,
		rotation = 0,
		offsetX = 0,
		offsetY = 0,
		fit = "none",
		worldWidth = 0,
		worldHeight = 0,
		originX = 0.5,
		originY = 0.5,
		speed = 0.5,
		frame = 0,
		minPixelRatio = 2,
		maxPixelCount = 1920 * 1080 * 4,
		class: className,
		style: styleValue,
		...restProps
	}: PerlinNoiseProps = $props();

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
		toPerlinNoiseUniforms({
			colorBack,
			colorFront,
			proportion,
			softness,
			octaveCount,
			persistence,
			lacunarity,
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
			perlinNoiseFragmentShader,
			uniforms,
			undefined,
			speed,
			frame,
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
		shader.setSpeed(speed);
	});

	$effect(() => {
		if (!shader) return;
		shader.setFrame(frame);
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
