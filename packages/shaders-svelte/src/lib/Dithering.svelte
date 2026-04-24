<script lang="ts">
	import { onDestroy, onMount } from "svelte";
	import type { HTMLAttributes } from "svelte/elements";
	import {
		ditheringFragmentShader,
		ShaderMount,
	} from "@paper-design/shaders";
	import {
		toCssSize,
		toDitheringUniforms,
		type DitheringSvelteProps,
		type ShaderDimensions,
	} from "./internal/common";

	type DivRestProps = Omit<
		HTMLAttributes<HTMLDivElement>,
		"type" | "class" | "style"
	>;

	type DitheringProps = {
		width?: ShaderDimensions;
		height?: ShaderDimensions;
		colorBack?: DitheringSvelteProps["colorBack"];
		colorFront?: DitheringSvelteProps["colorFront"];
		shape?: DitheringSvelteProps["shape"];
		type?: DitheringSvelteProps["type"];
		size?: DitheringSvelteProps["size"];
		speed?: DitheringSvelteProps["speed"];
		frame?: DitheringSvelteProps["frame"];
		scale?: DitheringSvelteProps["scale"];
		rotation?: DitheringSvelteProps["rotation"];
		offsetX?: DitheringSvelteProps["offsetX"];
		offsetY?: DitheringSvelteProps["offsetY"];
		fit?: DitheringSvelteProps["fit"];
		worldWidth?: DitheringSvelteProps["worldWidth"];
		worldHeight?: DitheringSvelteProps["worldHeight"];
		originX?: DitheringSvelteProps["originX"];
		originY?: DitheringSvelteProps["originY"];
		minPixelRatio?: DitheringSvelteProps["minPixelRatio"];
		maxPixelCount?: DitheringSvelteProps["maxPixelCount"];
		class?: HTMLAttributes<HTMLDivElement>["class"];
		style?: HTMLAttributes<HTMLDivElement>["style"];
	} & DivRestProps;

	let {
		width = "100%",
		height = 320,
		colorBack = "#301c2a",
		colorFront = "#56ae6c",
		shape = "warp",
		type = "4x4",
		size = 1,
		speed = 1,
		frame = 0,
		scale = 1,
		rotation = 0,
		offsetX = 0,
		offsetY = 0,
		fit = "none",
		worldWidth = 0,
		worldHeight = 0,
		originX = 0.5,
		originY = 0.5,
		minPixelRatio = 2,
		maxPixelCount = 1920 * 1080 * 4,
		class: className,
		style: styleValue,
		...restProps
	}: DitheringProps = $props();

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
		toDitheringUniforms({
			colorBack,
			colorFront,
			shape,
			type,
			size,
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
			ditheringFragmentShader,
			uniforms,
			undefined,
			speed,
			frame,
			minPixelRatio,
			maxPixelCount,
		);
	});

	$effect(() => {
		if (!shader) return;
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
