<script lang="ts">
	import { onDestroy, onMount } from "svelte";
	import type { HTMLAttributes } from "svelte/elements";
	import {
		dotGridFragmentShader,
		ShaderMount,
	} from "@paper-design/shaders";
	import {
		toCssSize,
		toDotGridUniforms,
		type DotGridSvelteProps,
		type ShaderDimensions,
	} from "./internal/common";

	type DivRestProps = Omit<
		HTMLAttributes<HTMLDivElement>,
		"type" | "class" | "style"
	>;

	type DotGridProps = {
		width?: ShaderDimensions;
		height?: ShaderDimensions;
		colorBack?: DotGridSvelteProps["colorBack"];
		colorFill?: DotGridSvelteProps["colorFill"];
		colorStroke?: DotGridSvelteProps["colorStroke"];
		shape?: DotGridSvelteProps["shape"];
		size?: DotGridSvelteProps["size"];
		gapX?: DotGridSvelteProps["gapX"];
		gapY?: DotGridSvelteProps["gapY"];
		strokeWidth?: DotGridSvelteProps["strokeWidth"];
		sizeRange?: DotGridSvelteProps["sizeRange"];
		opacityRange?: DotGridSvelteProps["opacityRange"];
		scale?: DotGridSvelteProps["scale"];
		rotation?: DotGridSvelteProps["rotation"];
		offsetX?: DotGridSvelteProps["offsetX"];
		offsetY?: DotGridSvelteProps["offsetY"];
		fit?: DotGridSvelteProps["fit"];
		worldWidth?: DotGridSvelteProps["worldWidth"];
		worldHeight?: DotGridSvelteProps["worldHeight"];
		originX?: DotGridSvelteProps["originX"];
		originY?: DotGridSvelteProps["originY"];
		minPixelRatio?: number;
		maxPixelCount?: number;
		class?: HTMLAttributes<HTMLDivElement>["class"];
		style?: HTMLAttributes<HTMLDivElement>["style"];
	} & DivRestProps;

	let {
		width = "100%",
		height = 320,
		colorBack = "#000000",
		colorFill = "#ffffff",
		colorStroke = "#ffaa00",
		shape = "circle",
		size = 2,
		gapX = 32,
		gapY = 32,
		strokeWidth = 0,
		sizeRange = 0,
		opacityRange = 0,
		scale = 1,
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
	}: DotGridProps = $props();

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
		toDotGridUniforms({
			colorBack,
			colorFill,
			colorStroke,
			shape,
			size,
			gapX,
			gapY,
			strokeWidth,
			sizeRange,
			opacityRange,
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
			dotGridFragmentShader,
			uniforms,
			undefined,
			0,
			0,
			minPixelRatio,
			maxPixelCount,
		);
	});

	$effect(() => {
		if (!shader) return;
		shader.setUniforms(uniforms);
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
