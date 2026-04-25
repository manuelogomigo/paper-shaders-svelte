<script lang="ts">
	import { onDestroy, onMount } from "svelte";
	import type { HTMLAttributes } from "svelte/elements";
	import {
		colorPanelsFragmentShader,
		ShaderMount,
	} from "@paper-design/shaders";
	import {
		toCssSize,
		toColorPanelsUniforms,
		type ColorPanelsSvelteProps,
		type ShaderDimensions,
	} from "./internal/common";

	type DivRestProps = Omit<
		HTMLAttributes<HTMLDivElement>,
		"type" | "class" | "style"
	>;

	type ColorPanelsProps = {
		width?: ShaderDimensions;
		height?: ShaderDimensions;
		colors?: ColorPanelsSvelteProps["colors"];
		colorBack?: ColorPanelsSvelteProps["colorBack"];
		density?: ColorPanelsSvelteProps["density"];
		angle1?: ColorPanelsSvelteProps["angle1"];
		angle2?: ColorPanelsSvelteProps["angle2"];
		length?: ColorPanelsSvelteProps["length"];
		edges?: ColorPanelsSvelteProps["edges"];
		blur?: ColorPanelsSvelteProps["blur"];
		fadeIn?: ColorPanelsSvelteProps["fadeIn"];
		fadeOut?: ColorPanelsSvelteProps["fadeOut"];
		gradient?: ColorPanelsSvelteProps["gradient"];
		scale?: ColorPanelsSvelteProps["scale"];
		rotation?: ColorPanelsSvelteProps["rotation"];
		offsetX?: ColorPanelsSvelteProps["offsetX"];
		offsetY?: ColorPanelsSvelteProps["offsetY"];
		fit?: ColorPanelsSvelteProps["fit"];
		worldWidth?: ColorPanelsSvelteProps["worldWidth"];
		worldHeight?: ColorPanelsSvelteProps["worldHeight"];
		originX?: ColorPanelsSvelteProps["originX"];
		originY?: ColorPanelsSvelteProps["originY"];
		speed?: ColorPanelsSvelteProps["speed"];
		frame?: ColorPanelsSvelteProps["frame"];
		minPixelRatio?: ColorPanelsSvelteProps["minPixelRatio"];
		maxPixelCount?: ColorPanelsSvelteProps["maxPixelCount"];
		class?: HTMLAttributes<HTMLDivElement>["class"];
		style?: HTMLAttributes<HTMLDivElement>["style"];
	} & DivRestProps;

	let {
		width = "100%",
		height = 320,
		colors,
		colorBack = "#000000",
		density = 3,
		angle1 = 0,
		angle2 = 0,
		length = 1.1,
		edges = true,
		blur = 0,
		fadeIn = 1,
		fadeOut = 0.3,
		gradient = 0,
		scale = 0.8,
		rotation = 0,
		offsetX = 0,
		offsetY = 0,
		fit = "contain",
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
	}: ColorPanelsProps = $props();

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
		toColorPanelsUniforms({
			colors,
			colorBack,
			density,
			angle1,
			angle2,
			length,
			edges,
			blur,
			fadeIn,
			fadeOut,
			gradient,
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
			colorPanelsFragmentShader,
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
