<script lang="ts">
	import { onDestroy } from "svelte";
	import type { HTMLAttributes } from "svelte/elements";
	import {
		getShaderNoiseTexture,
		pulsingBorderFragmentShader,
		ShaderMount,
		type ShaderMountUniforms,
	} from "@paper-design/shaders";
	import {
		processShaderUniforms,
		toCssSize,
		toPulsingBorderUniforms,
		type PulsingBorderSvelteProps,
		type ShaderDimensions,
	} from "./internal/common";

	type DivRestProps = Omit<
		HTMLAttributes<HTMLDivElement>,
		"type" | "class" | "style"
	>;

	type PulsingBorderProps = {
		width?: ShaderDimensions;
		height?: ShaderDimensions;
		colors?: PulsingBorderSvelteProps["colors"];
		colorBack?: PulsingBorderSvelteProps["colorBack"];
		roundness?: PulsingBorderSvelteProps["roundness"];
		thickness?: PulsingBorderSvelteProps["thickness"];
		softness?: PulsingBorderSvelteProps["softness"];
		aspectRatio?: PulsingBorderSvelteProps["aspectRatio"];
		intensity?: PulsingBorderSvelteProps["intensity"];
		bloom?: PulsingBorderSvelteProps["bloom"];
		spots?: PulsingBorderSvelteProps["spots"];
		spotSize?: PulsingBorderSvelteProps["spotSize"];
		pulse?: PulsingBorderSvelteProps["pulse"];
		smoke?: PulsingBorderSvelteProps["smoke"];
		smokeSize?: PulsingBorderSvelteProps["smokeSize"];
		margin?: PulsingBorderSvelteProps["margin"];
		marginLeft?: PulsingBorderSvelteProps["marginLeft"];
		marginRight?: PulsingBorderSvelteProps["marginRight"];
		marginTop?: PulsingBorderSvelteProps["marginTop"];
		marginBottom?: PulsingBorderSvelteProps["marginBottom"];
		scale?: PulsingBorderSvelteProps["scale"];
		rotation?: PulsingBorderSvelteProps["rotation"];
		offsetX?: PulsingBorderSvelteProps["offsetX"];
		offsetY?: PulsingBorderSvelteProps["offsetY"];
		fit?: PulsingBorderSvelteProps["fit"];
		worldWidth?: PulsingBorderSvelteProps["worldWidth"];
		worldHeight?: PulsingBorderSvelteProps["worldHeight"];
		originX?: PulsingBorderSvelteProps["originX"];
		originY?: PulsingBorderSvelteProps["originY"];
		speed?: PulsingBorderSvelteProps["speed"];
		frame?: PulsingBorderSvelteProps["frame"];
		minPixelRatio?: PulsingBorderSvelteProps["minPixelRatio"];
		maxPixelCount?: PulsingBorderSvelteProps["maxPixelCount"];
		class?: HTMLAttributes<HTMLDivElement>["class"];
		style?: HTMLAttributes<HTMLDivElement>["style"];
	} & DivRestProps;

	let {
		width = "100%",
		height = 320,
		colors,
		colorBack = "#000000",
		roundness = 0.25,
		thickness = 0.1,
		softness = 0.75,
		aspectRatio = "auto",
		intensity = 0.2,
		bloom = 0.25,
		spots = 4,
		spotSize = 0.5,
		pulse = 0.25,
		smoke = 0.3,
		smokeSize = 0.6,
		margin = 0,
		marginLeft,
		marginRight,
		marginTop,
		marginBottom,
		scale = 0.6,
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
	}: PulsingBorderProps = $props();

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
		return toPulsingBorderUniforms(
			{
				colors,
				colorBack,
				roundness,
				thickness,
				softness,
				aspectRatio,
				intensity,
				bloom,
				spots,
				spotSize,
				pulse,
				smoke,
				smokeSize,
				margin,
				marginLeft,
				marginRight,
				marginTop,
				marginBottom,
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
			pulsingBorderFragmentShader,
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
