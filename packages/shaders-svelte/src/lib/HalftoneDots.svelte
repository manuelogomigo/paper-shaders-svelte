<script lang="ts">
	import { onDestroy } from "svelte";
	import type { HTMLAttributes } from "svelte/elements";
	import {
		emptyPixel,
		halftoneDotsFragmentShader,
		ShaderMount,
		type ShaderMountUniforms,
	} from "@paper-design/shaders";
	import {
		processShaderUniforms,
		toCssSize,
		toHalftoneDotsUniforms,
		type HalftoneDotsSvelteProps,
		type ShaderDimensions,
	} from "./internal/common";

	type DivRestProps = Omit<
		HTMLAttributes<HTMLDivElement>,
		"type" | "class" | "style"
	>;

	type HalftoneDotsProps = {
		width?: ShaderDimensions;
		height?: ShaderDimensions;
		image?: HalftoneDotsSvelteProps["image"];
		colorBack?: HalftoneDotsSvelteProps["colorBack"];
		colorFront?: HalftoneDotsSvelteProps["colorFront"];
		originalColors?: HalftoneDotsSvelteProps["originalColors"];
		type?: HalftoneDotsSvelteProps["type"];
		inverted?: HalftoneDotsSvelteProps["inverted"];
		grid?: HalftoneDotsSvelteProps["grid"];
		size?: HalftoneDotsSvelteProps["size"];
		radius?: HalftoneDotsSvelteProps["radius"];
		contrast?: HalftoneDotsSvelteProps["contrast"];
		grainMixer?: HalftoneDotsSvelteProps["grainMixer"];
		grainOverlay?: HalftoneDotsSvelteProps["grainOverlay"];
		grainSize?: HalftoneDotsSvelteProps["grainSize"];
		scale?: HalftoneDotsSvelteProps["scale"];
		rotation?: HalftoneDotsSvelteProps["rotation"];
		offsetX?: HalftoneDotsSvelteProps["offsetX"];
		offsetY?: HalftoneDotsSvelteProps["offsetY"];
		fit?: HalftoneDotsSvelteProps["fit"];
		worldWidth?: HalftoneDotsSvelteProps["worldWidth"];
		worldHeight?: HalftoneDotsSvelteProps["worldHeight"];
		originX?: HalftoneDotsSvelteProps["originX"];
		originY?: HalftoneDotsSvelteProps["originY"];
		speed?: HalftoneDotsSvelteProps["speed"];
		frame?: HalftoneDotsSvelteProps["frame"];
		minPixelRatio?: HalftoneDotsSvelteProps["minPixelRatio"];
		maxPixelCount?: HalftoneDotsSvelteProps["maxPixelCount"];
		class?: HTMLAttributes<HTMLDivElement>["class"];
		style?: HTMLAttributes<HTMLDivElement>["style"];
	} & DivRestProps;

	let {
		width = "100%",
		height = 320,
		image = "https://paper.design/flowers.webp",
		colorBack = "#f2f1e8",
		colorFront = "#2b2b2b",
		originalColors = false,
		type = "gooey",
		inverted = false,
		grid = "hex",
		size = 0.5,
		radius = 1.25,
		contrast = 0.4,
		grainMixer = 0.2,
		grainOverlay = 0.2,
		grainSize = 0.5,
		scale = 1,
		rotation = 0,
		offsetX = 0,
		offsetY = 0,
		fit = "cover",
		worldWidth = 0,
		worldHeight = 0,
		originX = 0.5,
		originY = 0.5,
		speed = 0,
		frame = 0,
		minPixelRatio = 2,
		maxPixelCount = 1920 * 1080 * 4,
		class: className,
		style: styleValue,
		...restProps
	}: HalftoneDotsProps = $props();

	const hostStyle = $derived.by(() => {
		const styles: string[] = [];
		if (width !== undefined)
			styles.push(`width:${toCssSize(width, "100%")}`);
		if (height !== undefined)
			styles.push(`height:${toCssSize(height, "320px")}`);
		if (typeof styleValue === "string" && styleValue.trim().length > 0)
			styles.push(styleValue.trim());
		return styles.join(";");
	});

	const uniformsInput = $derived.by(() => {
		const base = toHalftoneDotsUniforms(
			{
				image,
				colorBack,
				colorFront,
				originalColors,
				type,
				inverted,
				grid,
				size,
				radius,
				contrast,
				grainMixer,
				grainOverlay,
				grainSize,
				scale,
				rotation,
				offsetX,
				offsetY,
				fit,
				worldWidth,
				worldHeight,
				originX,
				originY,
			},
			{ image: undefined },
		);
		return {
			...base,
			u_image: image || emptyPixel,
		} as Record<string, unknown>;
	});

	let uniforms = $state<ShaderMountUniforms | undefined>(undefined);
	let host: HTMLDivElement | undefined;
	let shader: ShaderMount | undefined;

	$effect(() => {
		let isStale = false;
		void (async () => {
			const processed = await processShaderUniforms(uniformsInput);
			if (isStale) return;
			uniforms = processed;
		})();
		return () => {
			isStale = true;
		};
	});

	$effect(() => {
		if (typeof window === "undefined" || !host) return;
		if (shader) return;
		if (!uniforms) return;
		shader = new ShaderMount(
			host,
			halftoneDotsFragmentShader,
			uniforms,
			undefined,
			speed,
			frame,
			minPixelRatio,
			maxPixelCount,
			["u_image"],
		);
	});

	$effect(() => {
		if (!shader || !uniforms) return;
		shader.setUniforms(uniforms);
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
