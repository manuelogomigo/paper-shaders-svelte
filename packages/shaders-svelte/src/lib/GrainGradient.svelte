<script lang="ts">
	import { onDestroy } from "svelte";
	import type { HTMLAttributes } from "svelte/elements";
	import {
		getShaderNoiseTexture,
		grainGradientFragmentShader,
		ShaderMount,
		type ShaderMountUniforms,
	} from "@paper-design/shaders";
	import {
		processShaderUniforms,
		toCssSize,
		toGrainGradientUniforms,
		type GrainGradientSvelteProps,
		type ShaderDimensions,
	} from "./internal/common";

	type DivRestProps = Omit<
		HTMLAttributes<HTMLDivElement>,
		"type" | "class" | "style"
	>;

	type GrainGradientProps = {
		width?: ShaderDimensions;
		height?: ShaderDimensions;
		colors?: GrainGradientSvelteProps["colors"];
		colorBack?: GrainGradientSvelteProps["colorBack"];
		softness?: GrainGradientSvelteProps["softness"];
		intensity?: GrainGradientSvelteProps["intensity"];
		noise?: GrainGradientSvelteProps["noise"];
		shape?: GrainGradientSvelteProps["shape"];
		scale?: GrainGradientSvelteProps["scale"];
		rotation?: GrainGradientSvelteProps["rotation"];
		offsetX?: GrainGradientSvelteProps["offsetX"];
		offsetY?: GrainGradientSvelteProps["offsetY"];
		fit?: GrainGradientSvelteProps["fit"];
		worldWidth?: GrainGradientSvelteProps["worldWidth"];
		worldHeight?: GrainGradientSvelteProps["worldHeight"];
		originX?: GrainGradientSvelteProps["originX"];
		originY?: GrainGradientSvelteProps["originY"];
		speed?: GrainGradientSvelteProps["speed"];
		frame?: GrainGradientSvelteProps["frame"];
		minPixelRatio?: GrainGradientSvelteProps["minPixelRatio"];
		maxPixelCount?: GrainGradientSvelteProps["maxPixelCount"];
		class?: HTMLAttributes<HTMLDivElement>["class"];
		style?: HTMLAttributes<HTMLDivElement>["style"];
	} & DivRestProps;

	let {
		width = "100%",
		height = 320,
		colors,
		colorBack = "#000000",
		softness = 0.5,
		intensity = 0.5,
		noise = 0.25,
		shape = "corners",
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
	}: GrainGradientProps = $props();

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
		return toGrainGradientUniforms(
			{
				colors,
				colorBack,
				softness,
				intensity,
				noise,
				shape,
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
			grainGradientFragmentShader,
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
