<script lang="ts">
	import { onDestroy } from "svelte";
	import type { HTMLAttributes } from "svelte/elements";
	import {
		getShaderNoiseTexture,
		voronoiFragmentShader,
		ShaderMount,
		type ShaderMountUniforms,
	} from "@paper-design/shaders";
	import {
		processShaderUniforms,
		toCssSize,
		toVoronoiUniforms,
		type VoronoiSvelteProps,
		type ShaderDimensions,
	} from "./internal/common";

	type DivRestProps = Omit<
		HTMLAttributes<HTMLDivElement>,
		"type" | "class" | "style"
	>;

	type VoronoiProps = {
		width?: ShaderDimensions;
		height?: ShaderDimensions;
		colors?: VoronoiSvelteProps["colors"];
		colorGap?: VoronoiSvelteProps["colorGap"];
		colorGlow?: VoronoiSvelteProps["colorGlow"];
		stepsPerColor?: VoronoiSvelteProps["stepsPerColor"];
		distortion?: VoronoiSvelteProps["distortion"];
		gap?: VoronoiSvelteProps["gap"];
		glow?: VoronoiSvelteProps["glow"];
		scale?: VoronoiSvelteProps["scale"];
		rotation?: VoronoiSvelteProps["rotation"];
		offsetX?: VoronoiSvelteProps["offsetX"];
		offsetY?: VoronoiSvelteProps["offsetY"];
		fit?: VoronoiSvelteProps["fit"];
		worldWidth?: VoronoiSvelteProps["worldWidth"];
		worldHeight?: VoronoiSvelteProps["worldHeight"];
		originX?: VoronoiSvelteProps["originX"];
		originY?: VoronoiSvelteProps["originY"];
		speed?: VoronoiSvelteProps["speed"];
		frame?: VoronoiSvelteProps["frame"];
		minPixelRatio?: VoronoiSvelteProps["minPixelRatio"];
		maxPixelCount?: VoronoiSvelteProps["maxPixelCount"];
		class?: HTMLAttributes<HTMLDivElement>["class"];
		style?: HTMLAttributes<HTMLDivElement>["style"];
	} & DivRestProps;

	let {
		width = "100%",
		height = 320,
		colors,
		colorGap = "#2e0000",
		colorGlow = "#ffffff",
		stepsPerColor = 3,
		distortion = 0.4,
		gap = 0.04,
		glow = 0,
		scale = 0.5,
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
	}: VoronoiProps = $props();

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
		return toVoronoiUniforms(
			{
				colors,
				colorGap,
				colorGlow,
				stepsPerColor,
				distortion,
				gap,
				glow,
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
			voronoiFragmentShader,
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
