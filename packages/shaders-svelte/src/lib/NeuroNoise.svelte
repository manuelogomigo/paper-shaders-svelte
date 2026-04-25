<script lang="ts">
	import { onDestroy, onMount } from "svelte";
	import type { HTMLAttributes } from "svelte/elements";
	import {
		neuroNoiseFragmentShader,
		ShaderMount,
	} from "@paper-design/shaders";
	import {
		toCssSize,
		toNeuroNoiseUniforms,
		type NeuroNoiseSvelteProps,
		type ShaderDimensions,
	} from "./internal/common";

	type DivRestProps = Omit<
		HTMLAttributes<HTMLDivElement>,
		"type" | "class" | "style"
	>;

	type NeuroNoiseProps = {
		width?: ShaderDimensions;
		height?: ShaderDimensions;
		colorFront?: NeuroNoiseSvelteProps["colorFront"];
		colorMid?: NeuroNoiseSvelteProps["colorMid"];
		colorBack?: NeuroNoiseSvelteProps["colorBack"];
		brightness?: NeuroNoiseSvelteProps["brightness"];
		contrast?: NeuroNoiseSvelteProps["contrast"];
		scale?: NeuroNoiseSvelteProps["scale"];
		rotation?: NeuroNoiseSvelteProps["rotation"];
		offsetX?: NeuroNoiseSvelteProps["offsetX"];
		offsetY?: NeuroNoiseSvelteProps["offsetY"];
		fit?: NeuroNoiseSvelteProps["fit"];
		worldWidth?: NeuroNoiseSvelteProps["worldWidth"];
		worldHeight?: NeuroNoiseSvelteProps["worldHeight"];
		originX?: NeuroNoiseSvelteProps["originX"];
		originY?: NeuroNoiseSvelteProps["originY"];
		speed?: NeuroNoiseSvelteProps["speed"];
		frame?: NeuroNoiseSvelteProps["frame"];
		minPixelRatio?: NeuroNoiseSvelteProps["minPixelRatio"];
		maxPixelCount?: NeuroNoiseSvelteProps["maxPixelCount"];
		class?: HTMLAttributes<HTMLDivElement>["class"];
		style?: HTMLAttributes<HTMLDivElement>["style"];
	} & DivRestProps;

	let {
		width = "100%",
		height = 320,
		colorFront = "#ffffff",
		colorMid = "#47a6ff",
		colorBack = "#000000",
		brightness = 0.05,
		contrast = 0.3,
		scale = 1,
		rotation = 0,
		offsetX = 0,
		offsetY = 0,
		fit = "none",
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
	}: NeuroNoiseProps = $props();

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
		toNeuroNoiseUniforms({
			colorFront,
			colorMid,
			colorBack,
			brightness,
			contrast,
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
			neuroNoiseFragmentShader,
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
