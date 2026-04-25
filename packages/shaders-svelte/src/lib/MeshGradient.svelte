<script lang="ts">
	import { onDestroy, onMount } from "svelte";
	import type { HTMLAttributes } from "svelte/elements";
	import {
		meshGradientFragmentShader,
		ShaderMount,
	} from "@paper-design/shaders";
	import {
		toCssSize,
		toMeshGradientUniforms,
		type MeshGradientSvelteProps,
		type ShaderDimensions,
	} from "./internal/common";

	type DivRestProps = Omit<
		HTMLAttributes<HTMLDivElement>,
		"type" | "class" | "style"
	>;

	type MeshGradientProps = {
		width?: ShaderDimensions;
		height?: ShaderDimensions;
		colors?: MeshGradientSvelteProps["colors"];
		distortion?: MeshGradientSvelteProps["distortion"];
		swirl?: MeshGradientSvelteProps["swirl"];
		grainMixer?: MeshGradientSvelteProps["grainMixer"];
		grainOverlay?: MeshGradientSvelteProps["grainOverlay"];
		scale?: MeshGradientSvelteProps["scale"];
		rotation?: MeshGradientSvelteProps["rotation"];
		offsetX?: MeshGradientSvelteProps["offsetX"];
		offsetY?: MeshGradientSvelteProps["offsetY"];
		fit?: MeshGradientSvelteProps["fit"];
		worldWidth?: MeshGradientSvelteProps["worldWidth"];
		worldHeight?: MeshGradientSvelteProps["worldHeight"];
		originX?: MeshGradientSvelteProps["originX"];
		originY?: MeshGradientSvelteProps["originY"];
		speed?: MeshGradientSvelteProps["speed"];
		frame?: MeshGradientSvelteProps["frame"];
		minPixelRatio?: MeshGradientSvelteProps["minPixelRatio"];
		maxPixelCount?: MeshGradientSvelteProps["maxPixelCount"];
		class?: HTMLAttributes<HTMLDivElement>["class"];
		style?: HTMLAttributes<HTMLDivElement>["style"];
	} & DivRestProps;

	let {
		width = "100%",
		height = 320,
		colors,
		distortion = 0.8,
		swirl = 0.1,
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
		speed = 1,
		frame = 0,
		minPixelRatio = 2,
		maxPixelCount = 1920 * 1080 * 4,
		class: className,
		style: styleValue,
		...restProps
	}: MeshGradientProps = $props();

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
		toMeshGradientUniforms({
			colors,
			distortion,
			swirl,
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
			meshGradientFragmentShader,
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
