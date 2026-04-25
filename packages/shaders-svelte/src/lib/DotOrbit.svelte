<script lang="ts">
	import { onDestroy } from "svelte";
	import type { HTMLAttributes } from "svelte/elements";
	import {
		dotOrbitFragmentShader,
		getShaderNoiseTexture,
		ShaderMount,
		type ShaderMountUniforms,
	} from "@paper-design/shaders";
	import {
		processShaderUniforms,
		toCssSize,
		toDotOrbitUniforms,
		type DotOrbitSvelteProps,
		type ShaderDimensions,
	} from "./internal/common";

	type DivRestProps = Omit<
		HTMLAttributes<HTMLDivElement>,
		"type" | "class" | "style"
	>;

	type DotOrbitProps = {
		width?: ShaderDimensions;
		height?: ShaderDimensions;
		colors?: DotOrbitSvelteProps["colors"];
		colorBack?: DotOrbitSvelteProps["colorBack"];
		stepsPerColor?: DotOrbitSvelteProps["stepsPerColor"];
		size?: DotOrbitSvelteProps["size"];
		sizeRange?: DotOrbitSvelteProps["sizeRange"];
		spreading?: DotOrbitSvelteProps["spreading"];
		scale?: DotOrbitSvelteProps["scale"];
		rotation?: DotOrbitSvelteProps["rotation"];
		offsetX?: DotOrbitSvelteProps["offsetX"];
		offsetY?: DotOrbitSvelteProps["offsetY"];
		fit?: DotOrbitSvelteProps["fit"];
		worldWidth?: DotOrbitSvelteProps["worldWidth"];
		worldHeight?: DotOrbitSvelteProps["worldHeight"];
		originX?: DotOrbitSvelteProps["originX"];
		originY?: DotOrbitSvelteProps["originY"];
		speed?: DotOrbitSvelteProps["speed"];
		frame?: DotOrbitSvelteProps["frame"];
		minPixelRatio?: DotOrbitSvelteProps["minPixelRatio"];
		maxPixelCount?: DotOrbitSvelteProps["maxPixelCount"];
		class?: HTMLAttributes<HTMLDivElement>["class"];
		style?: HTMLAttributes<HTMLDivElement>["style"];
	} & DivRestProps;

	let {
		width = "100%",
		height = 320,
		colors,
		colorBack = "#000000",
		stepsPerColor = 4,
		size = 1,
		sizeRange = 0,
		spreading = 1,
		scale = 1,
		rotation = 0,
		offsetX = 0,
		offsetY = 0,
		fit = "none",
		worldWidth = 0,
		worldHeight = 0,
		originX = 0.5,
		originY = 0.5,
		speed = 1.5,
		frame = 0,
		minPixelRatio = 2,
		maxPixelCount = 1920 * 1080 * 4,
		class: className,
		style: styleValue,
		...restProps
	}: DotOrbitProps = $props();

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
		return toDotOrbitUniforms(
			{
				colors,
				colorBack,
				stepsPerColor,
				size,
				sizeRange,
				spreading,
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
			dotOrbitFragmentShader,
			uniforms,
			undefined,
			speed,
			frame,
			minPixelRatio,
			maxPixelCount,
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
