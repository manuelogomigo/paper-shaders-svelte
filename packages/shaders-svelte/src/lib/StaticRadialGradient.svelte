<script lang="ts">
	import { onDestroy, onMount } from "svelte";
	import type { HTMLAttributes } from "svelte/elements";
	import {
		staticRadialGradientFragmentShader,
		ShaderMount,
	} from "@paper-design/shaders";
	import {
		toCssSize,
		toStaticRadialGradientUniforms,
		type StaticRadialGradientSvelteProps,
		type ShaderDimensions,
	} from "./internal/common";

	type DivRestProps = Omit<
		HTMLAttributes<HTMLDivElement>,
		"type" | "class" | "style"
	>;

	type StaticRadialGradientProps = {
		width?: ShaderDimensions;
		height?: ShaderDimensions;
		colors?: StaticRadialGradientSvelteProps["colors"];
		colorBack?: StaticRadialGradientSvelteProps["colorBack"];
		radius?: StaticRadialGradientSvelteProps["radius"];
		focalDistance?: StaticRadialGradientSvelteProps["focalDistance"];
		focalAngle?: StaticRadialGradientSvelteProps["focalAngle"];
		falloff?: StaticRadialGradientSvelteProps["falloff"];
		mixing?: StaticRadialGradientSvelteProps["mixing"];
		distortion?: StaticRadialGradientSvelteProps["distortion"];
		distortionShift?: StaticRadialGradientSvelteProps["distortionShift"];
		distortionFreq?: StaticRadialGradientSvelteProps["distortionFreq"];
		grainMixer?: StaticRadialGradientSvelteProps["grainMixer"];
		grainOverlay?: StaticRadialGradientSvelteProps["grainOverlay"];
		scale?: StaticRadialGradientSvelteProps["scale"];
		rotation?: StaticRadialGradientSvelteProps["rotation"];
		offsetX?: StaticRadialGradientSvelteProps["offsetX"];
		offsetY?: StaticRadialGradientSvelteProps["offsetY"];
		fit?: StaticRadialGradientSvelteProps["fit"];
		worldWidth?: StaticRadialGradientSvelteProps["worldWidth"];
		worldHeight?: StaticRadialGradientSvelteProps["worldHeight"];
		originX?: StaticRadialGradientSvelteProps["originX"];
		originY?: StaticRadialGradientSvelteProps["originY"];
		speed?: StaticRadialGradientSvelteProps["speed"];
		frame?: StaticRadialGradientSvelteProps["frame"];
		minPixelRatio?: StaticRadialGradientSvelteProps["minPixelRatio"];
		maxPixelCount?: StaticRadialGradientSvelteProps["maxPixelCount"];
		class?: HTMLAttributes<HTMLDivElement>["class"];
		style?: HTMLAttributes<HTMLDivElement>["style"];
	} & DivRestProps;

	let {
		width = "100%",
		height = 320,
		colors,
		colorBack = "#000000",
		radius = 0.8,
		focalDistance = 0.99,
		focalAngle = 0,
		falloff = 0.24,
		mixing = 0.5,
		distortion = 0,
		distortionShift = 0,
		distortionFreq = 12,
		grainMixer = 0,
		grainOverlay = 0,
		scale = 1,
		rotation = 0,
		offsetX = 0,
		offsetY = 0,
		fit = "contain",
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
	}: StaticRadialGradientProps = $props();

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
		toStaticRadialGradientUniforms({
			colors,
			colorBack,
			radius,
			focalDistance,
			focalAngle,
			falloff,
			mixing,
			distortion,
			distortionShift,
			distortionFreq,
			grainMixer,
			grainOverlay,
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
			staticRadialGradientFragmentShader,
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
