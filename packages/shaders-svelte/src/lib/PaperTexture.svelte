<script lang="ts">
	import { onDestroy } from "svelte";
	import type { HTMLAttributes } from "svelte/elements";
	import {
		emptyPixel,
		getShaderNoiseTexture,
		paperTextureFragmentShader,
		ShaderMount,
		type ShaderMountUniforms,
	} from "@paper-design/shaders";
	import {
		processShaderUniforms,
		toCssSize,
		toPaperTextureUniforms,
		type PaperTextureSvelteProps,
		type ShaderDimensions,
	} from "./internal/common";

	type DivRestProps = Omit<
		HTMLAttributes<HTMLDivElement>,
		"type" | "class" | "style"
	>;

	type PaperTextureProps = {
		width?: ShaderDimensions;
		height?: ShaderDimensions;
		image?: PaperTextureSvelteProps["image"];
		colorBack?: PaperTextureSvelteProps["colorBack"];
		colorFront?: PaperTextureSvelteProps["colorFront"];
		contrast?: PaperTextureSvelteProps["contrast"];
		roughness?: PaperTextureSvelteProps["roughness"];
		fiber?: PaperTextureSvelteProps["fiber"];
		fiberSize?: PaperTextureSvelteProps["fiberSize"];
		crumples?: PaperTextureSvelteProps["crumples"];
		crumpleSize?: PaperTextureSvelteProps["crumpleSize"];
		folds?: PaperTextureSvelteProps["folds"];
		foldCount?: PaperTextureSvelteProps["foldCount"];
		fade?: PaperTextureSvelteProps["fade"];
		drops?: PaperTextureSvelteProps["drops"];
		seed?: PaperTextureSvelteProps["seed"];
		scale?: PaperTextureSvelteProps["scale"];
		rotation?: PaperTextureSvelteProps["rotation"];
		offsetX?: PaperTextureSvelteProps["offsetX"];
		offsetY?: PaperTextureSvelteProps["offsetY"];
		fit?: PaperTextureSvelteProps["fit"];
		worldWidth?: PaperTextureSvelteProps["worldWidth"];
		worldHeight?: PaperTextureSvelteProps["worldHeight"];
		originX?: PaperTextureSvelteProps["originX"];
		originY?: PaperTextureSvelteProps["originY"];
		speed?: PaperTextureSvelteProps["speed"];
		frame?: PaperTextureSvelteProps["frame"];
		minPixelRatio?: PaperTextureSvelteProps["minPixelRatio"];
		maxPixelCount?: PaperTextureSvelteProps["maxPixelCount"];
		class?: HTMLAttributes<HTMLDivElement>["class"];
		style?: HTMLAttributes<HTMLDivElement>["style"];
	} & DivRestProps;

	let {
		width = "100%",
		height = 320,
		image = "/assets/flowers.webp",
		colorBack = "#ffffff",
		colorFront = "#9fadbc",
		contrast = 0.3,
		roughness = 0.4,
		fiber = 0.3,
		fiberSize = 0.2,
		crumples = 0.3,
		crumpleSize = 0.35,
		folds = 0.65,
		foldCount = 5,
		fade = 0,
		drops = 0.2,
		seed = 5.8,
		scale = 0.6,
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
	}: PaperTextureProps = $props();

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
		const base = toPaperTextureUniforms(
			{
				image,
				colorBack,
				colorFront,
				contrast,
				roughness,
				fiber,
				fiberSize,
				crumples,
				crumpleSize,
				folds,
				foldCount,
				fade,
				drops,
				seed,
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
				image: undefined,
				noiseTexture: getShaderNoiseTexture(),
			},
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
			paperTextureFragmentShader,
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
