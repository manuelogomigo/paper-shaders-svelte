<script lang="ts">
	import { onDestroy, onMount } from "svelte";
	import type { HTMLAttributes } from "svelte/elements";
	import {
		swirlFragmentShader,
		ShaderMount,
	} from "@paper-design/shaders";
	import {
		toCssSize,
		toSwirlUniforms,
		type SwirlSvelteProps,
		type ShaderDimensions,
	} from "./internal/common";

	type DivRestProps = Omit<
		HTMLAttributes<HTMLDivElement>,
		"type" | "class" | "style"
	>;

	type SwirlProps = {
		width?: ShaderDimensions;
		height?: ShaderDimensions;
		colors?: SwirlSvelteProps["colors"];
		colorBack?: SwirlSvelteProps["colorBack"];
		bandCount?: SwirlSvelteProps["bandCount"];
		twist?: SwirlSvelteProps["twist"];
		center?: SwirlSvelteProps["center"];
		proportion?: SwirlSvelteProps["proportion"];
		softness?: SwirlSvelteProps["softness"];
		noise?: SwirlSvelteProps["noise"];
		noiseFrequency?: SwirlSvelteProps["noiseFrequency"];
		scale?: SwirlSvelteProps["scale"];
		rotation?: SwirlSvelteProps["rotation"];
		offsetX?: SwirlSvelteProps["offsetX"];
		offsetY?: SwirlSvelteProps["offsetY"];
		fit?: SwirlSvelteProps["fit"];
		worldWidth?: SwirlSvelteProps["worldWidth"];
		worldHeight?: SwirlSvelteProps["worldHeight"];
		originX?: SwirlSvelteProps["originX"];
		originY?: SwirlSvelteProps["originY"];
		speed?: SwirlSvelteProps["speed"];
		frame?: SwirlSvelteProps["frame"];
		minPixelRatio?: SwirlSvelteProps["minPixelRatio"];
		maxPixelCount?: SwirlSvelteProps["maxPixelCount"];
		class?: HTMLAttributes<HTMLDivElement>["class"];
		style?: HTMLAttributes<HTMLDivElement>["style"];
	} & DivRestProps;

	let {
		width = "100%",
		height = 320,
		colors,
		colorBack = "#330000",
		bandCount = 4,
		twist = 0.1,
		center = 0.2,
		proportion = 0.5,
		softness = 0,
		noise = 0.2,
		noiseFrequency = 0.4,
		scale = 1,
		rotation = 0,
		offsetX = 0,
		offsetY = 0,
		fit = "contain",
		worldWidth = 0,
		worldHeight = 0,
		originX = 0.5,
		originY = 0.5,
		speed = 0.32,
		frame = 0,
		minPixelRatio = 2,
		maxPixelCount = 1920 * 1080 * 4,
		class: className,
		style: styleValue,
		...restProps
	}: SwirlProps = $props();

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
		toSwirlUniforms({
			colors,
			colorBack,
			bandCount,
			twist,
			center,
			proportion,
			softness,
			noise,
			noiseFrequency,
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
			swirlFragmentShader,
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
