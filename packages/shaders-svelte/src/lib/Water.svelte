<script lang="ts">
	import { onDestroy } from "svelte";
	import type { HTMLAttributes } from "svelte/elements";
	import {
		emptyPixel,
		waterFragmentShader,
		ShaderMount,
		type ShaderMountUniforms,
	} from "@paper-design/shaders";
	import {
		processShaderUniforms,
		toCssSize,
		toWaterUniforms,
		type WaterSvelteProps,
		type ShaderDimensions,
	} from "./internal/common";

	type DivRestProps = Omit<
		HTMLAttributes<HTMLDivElement>,
		"type" | "class" | "style"
	>;

	type WaterProps = {
		width?: ShaderDimensions;
		height?: ShaderDimensions;
		image?: WaterSvelteProps["image"];
		colorBack?: WaterSvelteProps["colorBack"];
		colorHighlight?: WaterSvelteProps["colorHighlight"];
		highlights?: WaterSvelteProps["highlights"];
		layering?: WaterSvelteProps["layering"];
		edges?: WaterSvelteProps["edges"];
		waves?: WaterSvelteProps["waves"];
		caustic?: WaterSvelteProps["caustic"];
		size?: WaterSvelteProps["size"];
		scale?: WaterSvelteProps["scale"];
		rotation?: WaterSvelteProps["rotation"];
		offsetX?: WaterSvelteProps["offsetX"];
		offsetY?: WaterSvelteProps["offsetY"];
		fit?: WaterSvelteProps["fit"];
		worldWidth?: WaterSvelteProps["worldWidth"];
		worldHeight?: WaterSvelteProps["worldHeight"];
		originX?: WaterSvelteProps["originX"];
		originY?: WaterSvelteProps["originY"];
		speed?: WaterSvelteProps["speed"];
		frame?: WaterSvelteProps["frame"];
		minPixelRatio?: WaterSvelteProps["minPixelRatio"];
		maxPixelCount?: WaterSvelteProps["maxPixelCount"];
		class?: HTMLAttributes<HTMLDivElement>["class"];
		style?: HTMLAttributes<HTMLDivElement>["style"];
	} & DivRestProps;

	let {
		width = "100%",
		height = 320,
		image = "https://paper.design/flowers.webp",
		colorBack = "#8f8f8f",
		colorHighlight = "#ffffff",
		highlights = 0.07,
		layering = 0.5,
		edges = 0.8,
		waves = 0.3,
		caustic = 0.1,
		size = 1,
		scale = 0.8,
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
	}: WaterProps = $props();

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
		const base = toWaterUniforms(
			{
				image,
				colorBack,
				colorHighlight,
				highlights,
				layering,
				edges,
				waves,
				caustic,
				size,
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
			waterFragmentShader,
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
