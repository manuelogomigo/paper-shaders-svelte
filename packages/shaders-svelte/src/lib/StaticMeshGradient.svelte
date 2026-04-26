<script lang="ts">
	import { onDestroy, onMount } from "svelte";
	import type { HTMLAttributes } from "svelte/elements";
	import {
		staticMeshGradientFragmentShader,
		ShaderMount,
	} from "@paper-design/shaders";
	import {
		toCssSize,
		toStaticMeshGradientUniforms,
		type StaticMeshGradientSvelteProps,
		type ShaderDimensions,
	} from "./internal/common";

	type DivRestProps = Omit<
		HTMLAttributes<HTMLDivElement>,
		"type" | "class" | "style"
	>;

	type StaticMeshGradientProps = {
		width?: ShaderDimensions;
		height?: ShaderDimensions;
		colors?: StaticMeshGradientSvelteProps["colors"];
		positions?: StaticMeshGradientSvelteProps["positions"];
		waveX?: StaticMeshGradientSvelteProps["waveX"];
		waveXShift?: StaticMeshGradientSvelteProps["waveXShift"];
		waveY?: StaticMeshGradientSvelteProps["waveY"];
		waveYShift?: StaticMeshGradientSvelteProps["waveYShift"];
		mixing?: StaticMeshGradientSvelteProps["mixing"];
		grainMixer?: StaticMeshGradientSvelteProps["grainMixer"];
		grainOverlay?: StaticMeshGradientSvelteProps["grainOverlay"];
		scale?: StaticMeshGradientSvelteProps["scale"];
		rotation?: StaticMeshGradientSvelteProps["rotation"];
		offsetX?: StaticMeshGradientSvelteProps["offsetX"];
		offsetY?: StaticMeshGradientSvelteProps["offsetY"];
		fit?: StaticMeshGradientSvelteProps["fit"];
		worldWidth?: StaticMeshGradientSvelteProps["worldWidth"];
		worldHeight?: StaticMeshGradientSvelteProps["worldHeight"];
		originX?: StaticMeshGradientSvelteProps["originX"];
		originY?: StaticMeshGradientSvelteProps["originY"];
		speed?: StaticMeshGradientSvelteProps["speed"];
		frame?: StaticMeshGradientSvelteProps["frame"];
		minPixelRatio?: StaticMeshGradientSvelteProps["minPixelRatio"];
		maxPixelCount?: StaticMeshGradientSvelteProps["maxPixelCount"];
		class?: HTMLAttributes<HTMLDivElement>["class"];
		style?: HTMLAttributes<HTMLDivElement>["style"];
	} & DivRestProps;

	let {
		width = "100%",
		height = 320,
		colors,
		positions = 2,
		waveX = 1,
		waveXShift = 0.6,
		waveY = 1,
		waveYShift = 0.21,
		mixing = 0.93,
		grainMixer = 0,
		grainOverlay = 0,
		scale = 1,
		rotation = 270,
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
	}: StaticMeshGradientProps = $props();

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
		toStaticMeshGradientUniforms({
			colors,
			positions,
			waveX,
			waveXShift,
			waveY,
			waveYShift,
			mixing,
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
			staticMeshGradientFragmentShader,
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
