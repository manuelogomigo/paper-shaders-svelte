<script lang="ts">
	import { onDestroy } from "svelte";
	import type { HTMLAttributes } from "svelte/elements";
	import {
		getShaderNoiseTexture,
		godRaysFragmentShader,
		ShaderMount,
		type ShaderMountUniforms,
	} from "@paper-design/shaders";
	import {
		processShaderUniforms,
		toCssSize,
		toGodRaysUniforms,
		type GodRaysSvelteProps,
		type ShaderDimensions,
	} from "./internal/common";

	type DivRestProps = Omit<
		HTMLAttributes<HTMLDivElement>,
		"type" | "class" | "style"
	>;

	type GodRaysProps = {
		width?: ShaderDimensions;
		height?: ShaderDimensions;
		colors?: GodRaysSvelteProps["colors"];
		colorBack?: GodRaysSvelteProps["colorBack"];
		colorBloom?: GodRaysSvelteProps["colorBloom"];
		bloom?: GodRaysSvelteProps["bloom"];
		intensity?: GodRaysSvelteProps["intensity"];
		density?: GodRaysSvelteProps["density"];
		spotty?: GodRaysSvelteProps["spotty"];
		midSize?: GodRaysSvelteProps["midSize"];
		midIntensity?: GodRaysSvelteProps["midIntensity"];
		scale?: GodRaysSvelteProps["scale"];
		rotation?: GodRaysSvelteProps["rotation"];
		offsetX?: GodRaysSvelteProps["offsetX"];
		offsetY?: GodRaysSvelteProps["offsetY"];
		fit?: GodRaysSvelteProps["fit"];
		worldWidth?: GodRaysSvelteProps["worldWidth"];
		worldHeight?: GodRaysSvelteProps["worldHeight"];
		originX?: GodRaysSvelteProps["originX"];
		originY?: GodRaysSvelteProps["originY"];
		speed?: GodRaysSvelteProps["speed"];
		frame?: GodRaysSvelteProps["frame"];
		minPixelRatio?: GodRaysSvelteProps["minPixelRatio"];
		maxPixelCount?: GodRaysSvelteProps["maxPixelCount"];
		class?: HTMLAttributes<HTMLDivElement>["class"];
		style?: HTMLAttributes<HTMLDivElement>["style"];
	} & DivRestProps;

	let {
		width = "100%",
		height = 320,
		colors,
		colorBack = "#000000",
		colorBloom = "#0000ff",
		bloom = 0.4,
		intensity = 0.8,
		density = 0.3,
		spotty = 0.3,
		midSize = 0.2,
		midIntensity = 0.4,
		scale = 1,
		rotation = 0,
		offsetX = 0,
		offsetY = -0.55,
		fit = "contain",
		worldWidth = 0,
		worldHeight = 0,
		originX = 0.5,
		originY = 0.5,
		speed = 0.75,
		frame = 0,
		minPixelRatio = 2,
		maxPixelCount = 1920 * 1080 * 4,
		class: className,
		style: styleValue,
		...restProps
	}: GodRaysProps = $props();

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

	const uniformsInput = $derived.by(() => {
		return toGodRaysUniforms(
			{
				colors,
				colorBack,
				colorBloom,
				bloom,
				intensity,
				density,
				spotty,
				midSize,
				midIntensity,
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
			{
				noiseTexture: getShaderNoiseTexture(),
			},
		) as Record<string, unknown>;
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
			godRaysFragmentShader,
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
		if (!shader || !next) return;
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
