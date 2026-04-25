<script lang="ts">
	import { onDestroy, onMount } from "svelte";
	import type { HTMLAttributes } from "svelte/elements";
	import {
		simplexNoiseFragmentShader,
		ShaderMount,
	} from "@paper-design/shaders";
	import {
		toCssSize,
		toSimplexNoiseUniforms,
		type SimplexNoiseSvelteProps,
		type ShaderDimensions,
	} from "./internal/common";

	type DivRestProps = Omit<
		HTMLAttributes<HTMLDivElement>,
		"type" | "class" | "style"
	>;

	type SimplexNoiseProps = {
		width?: ShaderDimensions;
		height?: ShaderDimensions;
		colors?: SimplexNoiseSvelteProps["colors"];
		stepsPerColor?: SimplexNoiseSvelteProps["stepsPerColor"];
		softness?: SimplexNoiseSvelteProps["softness"];
		scale?: SimplexNoiseSvelteProps["scale"];
		rotation?: SimplexNoiseSvelteProps["rotation"];
		offsetX?: SimplexNoiseSvelteProps["offsetX"];
		offsetY?: SimplexNoiseSvelteProps["offsetY"];
		fit?: SimplexNoiseSvelteProps["fit"];
		worldWidth?: SimplexNoiseSvelteProps["worldWidth"];
		worldHeight?: SimplexNoiseSvelteProps["worldHeight"];
		originX?: SimplexNoiseSvelteProps["originX"];
		originY?: SimplexNoiseSvelteProps["originY"];
		speed?: SimplexNoiseSvelteProps["speed"];
		frame?: SimplexNoiseSvelteProps["frame"];
		minPixelRatio?: SimplexNoiseSvelteProps["minPixelRatio"];
		maxPixelCount?: SimplexNoiseSvelteProps["maxPixelCount"];
		class?: HTMLAttributes<HTMLDivElement>["class"];
		style?: HTMLAttributes<HTMLDivElement>["style"];
	} & DivRestProps;

	let {
		width = "100%",
		height = 320,
		colors,
		stepsPerColor = 2,
		softness = 0,
		scale = 0.2,
		rotation = 0,
		offsetX = 0,
		offsetY = 0,
		fit = "none",
		worldWidth = 0,
		worldHeight = 0,
		originX = 0.5,
		originY = 0.5,
		speed = 2,
		frame = 0,
		minPixelRatio = 2,
		maxPixelCount = 1920 * 1080 * 4,
		class: className,
		style: styleValue,
		...restProps
	}: SimplexNoiseProps = $props();

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
		toSimplexNoiseUniforms({
			colors,
			stepsPerColor,
			softness,
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
			simplexNoiseFragmentShader,
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
