<script lang="ts">
	import { onDestroy, onMount } from "svelte";
	import type { HTMLAttributes } from "svelte/elements";
	import {
		spiralFragmentShader,
		ShaderMount,
	} from "@paper-design/shaders";
	import {
		toCssSize,
		toSpiralUniforms,
		type SpiralSvelteProps,
		type ShaderDimensions,
	} from "./internal/common";

	type DivRestProps = Omit<
		HTMLAttributes<HTMLDivElement>,
		"type" | "class" | "style"
	>;

	type SpiralProps = {
		width?: ShaderDimensions;
		height?: ShaderDimensions;
		colorBack?: SpiralSvelteProps["colorBack"];
		colorFront?: SpiralSvelteProps["colorFront"];
		density?: SpiralSvelteProps["density"];
		distortion?: SpiralSvelteProps["distortion"];
		strokeWidth?: SpiralSvelteProps["strokeWidth"];
		strokeTaper?: SpiralSvelteProps["strokeTaper"];
		strokeCap?: SpiralSvelteProps["strokeCap"];
		noise?: SpiralSvelteProps["noise"];
		noiseFrequency?: SpiralSvelteProps["noiseFrequency"];
		softness?: SpiralSvelteProps["softness"];
		scale?: SpiralSvelteProps["scale"];
		rotation?: SpiralSvelteProps["rotation"];
		offsetX?: SpiralSvelteProps["offsetX"];
		offsetY?: SpiralSvelteProps["offsetY"];
		fit?: SpiralSvelteProps["fit"];
		worldWidth?: SpiralSvelteProps["worldWidth"];
		worldHeight?: SpiralSvelteProps["worldHeight"];
		originX?: SpiralSvelteProps["originX"];
		originY?: SpiralSvelteProps["originY"];
		speed?: SpiralSvelteProps["speed"];
		frame?: SpiralSvelteProps["frame"];
		minPixelRatio?: SpiralSvelteProps["minPixelRatio"];
		maxPixelCount?: SpiralSvelteProps["maxPixelCount"];
		class?: HTMLAttributes<HTMLDivElement>["class"];
		style?: HTMLAttributes<HTMLDivElement>["style"];
	} & DivRestProps;

	let {
		width = "100%",
		height = 320,
		colorBack = "#001429",
		colorFront = "#7ad1ff",
		density = 1,
		distortion = 0,
		strokeWidth = 0.5,
		strokeTaper = 0,
		strokeCap = 0,
		noise = 0,
		noiseFrequency = 0,
		softness = 0,
		scale = 1,
		rotation = 0,
		offsetX = 0,
		offsetY = 0,
		fit = "contain",
		worldWidth = 0,
		worldHeight = 0,
		originX = 0.5,
		originY = 0.5,
		speed = 1,
		frame = 0,
		minPixelRatio = 2,
		maxPixelCount = 1920 * 1080 * 4,
		class: className,
		style: styleValue,
		...restProps
	}: SpiralProps = $props();

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
		toSpiralUniforms({
			colorBack,
			colorFront,
			density,
			distortion,
			strokeWidth,
			strokeTaper,
			strokeCap,
			noise,
			noiseFrequency,
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
			spiralFragmentShader,
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
