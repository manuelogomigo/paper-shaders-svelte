<script lang="ts">
	import { onDestroy } from "svelte";
	import type { HTMLAttributes } from "svelte/elements";
	import {
		emptyPixel,
		imageDitheringFragmentShader,
		ShaderMount,
		type ShaderMountUniforms,
	} from "@paper-design/shaders";
	import {
		processShaderUniforms,
		toCssSize,
		toImageDitheringUniforms,
		type ImageDitheringSvelteProps,
		type ShaderDimensions,
	} from "./internal/common";

	type DivRestProps = Omit<
		HTMLAttributes<HTMLDivElement>,
		"type" | "class" | "style"
	>;

	type ImageDitheringProps = {
		width?: ShaderDimensions;
		height?: ShaderDimensions;
		image?: ImageDitheringSvelteProps["image"];
		colorBack?: ImageDitheringSvelteProps["colorBack"];
		colorFront?: ImageDitheringSvelteProps["colorFront"];
		colorHighlight?: ImageDitheringSvelteProps["colorHighlight"];
		originalColors?: ImageDitheringSvelteProps["originalColors"];
		inverted?: ImageDitheringSvelteProps["inverted"];
		type?: ImageDitheringSvelteProps["type"];
		size?: ImageDitheringSvelteProps["size"];
		colorSteps?: ImageDitheringSvelteProps["colorSteps"];
		scale?: ImageDitheringSvelteProps["scale"];
		rotation?: ImageDitheringSvelteProps["rotation"];
		offsetX?: ImageDitheringSvelteProps["offsetX"];
		offsetY?: ImageDitheringSvelteProps["offsetY"];
		fit?: ImageDitheringSvelteProps["fit"];
		worldWidth?: ImageDitheringSvelteProps["worldWidth"];
		worldHeight?: ImageDitheringSvelteProps["worldHeight"];
		originX?: ImageDitheringSvelteProps["originX"];
		originY?: ImageDitheringSvelteProps["originY"];
		speed?: ImageDitheringSvelteProps["speed"];
		frame?: ImageDitheringSvelteProps["frame"];
		minPixelRatio?: ImageDitheringSvelteProps["minPixelRatio"];
		maxPixelCount?: ImageDitheringSvelteProps["maxPixelCount"];
		class?: HTMLAttributes<HTMLDivElement>["class"];
		style?: HTMLAttributes<HTMLDivElement>["style"];
	} & DivRestProps;

	let {
		width = "100%",
		height = 320,
		image = "https://paper.design/flowers.webp",
		colorBack = "#000c38",
		colorFront = "#94ffaf",
		colorHighlight = "#eaff94",
		originalColors = false,
		inverted = false,
		type = "8x8",
		size = 2,
		colorSteps = 2,
		scale = 1,
		rotation = 0,
		offsetX = 0,
		offsetY = 0,
		fit = "cover",
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
	}: ImageDitheringProps = $props();

	const hostStyle = $derived.by(() => {
		const styles: string[] = [];
		if (width !== undefined)
			styles.push(`width:${toCssSize(width, "100%")}`);
		if (height !== undefined)
			styles.push(`height:${toCssSize(height, "320px")}`);
		if (typeof styleValue === "string" && styleValue.trim().length > 0)
			styles.push(styleValue.trim());
		return styles.join(";");
	});

	const uniformsInput = $derived.by(() => {
		const base = toImageDitheringUniforms(
			{
				image,
				colorBack,
				colorFront,
				colorHighlight,
				originalColors,
				inverted,
				type,
				size,
				colorSteps,
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
			{ image: undefined },
		);
		return {
			...base,
			u_image: image || emptyPixel,
		} as Record<string, unknown>;
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
			imageDitheringFragmentShader,
			uniforms,
			undefined,
			speed,
			frame,
			minPixelRatio,
			maxPixelCount,
			["u_image"],
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
