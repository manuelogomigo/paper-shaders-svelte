<script lang="ts">
	import { onDestroy } from "svelte";
	import type { HTMLAttributes } from "svelte/elements";
	import {
		liquidMetalFragmentShader,
		ShaderMount,
	} from "@paper-design/shaders";
	import {
		getEmptyPixelImage,
		preloadLiquidMetal,
		toCssSize,
		toLiquidMetalUniforms,
		type LiquidMetalSvelteProps,
		type ShaderDimensions,
	} from "./internal/common";

	type DivRestProps = Omit<
		HTMLAttributes<HTMLDivElement>,
		"type" | "class" | "style"
	>;

	type LiquidMetalProps = {
		width?: ShaderDimensions;
		height?: ShaderDimensions;
		image?: LiquidMetalSvelteProps["image"];
		colorBack?: LiquidMetalSvelteProps["colorBack"];
		colorTint?: LiquidMetalSvelteProps["colorTint"];
		shape?: LiquidMetalSvelteProps["shape"];
		repetition?: LiquidMetalSvelteProps["repetition"];
		softness?: LiquidMetalSvelteProps["softness"];
		shiftRed?: LiquidMetalSvelteProps["shiftRed"];
		shiftBlue?: LiquidMetalSvelteProps["shiftBlue"];
		distortion?: LiquidMetalSvelteProps["distortion"];
		contour?: LiquidMetalSvelteProps["contour"];
		angle?: LiquidMetalSvelteProps["angle"];
		scale?: LiquidMetalSvelteProps["scale"];
		rotation?: LiquidMetalSvelteProps["rotation"];
		offsetX?: LiquidMetalSvelteProps["offsetX"];
		offsetY?: LiquidMetalSvelteProps["offsetY"];
		fit?: LiquidMetalSvelteProps["fit"];
		worldWidth?: LiquidMetalSvelteProps["worldWidth"];
		worldHeight?: LiquidMetalSvelteProps["worldHeight"];
		originX?: LiquidMetalSvelteProps["originX"];
		originY?: LiquidMetalSvelteProps["originY"];
		speed?: LiquidMetalSvelteProps["speed"];
		frame?: LiquidMetalSvelteProps["frame"];
		minPixelRatio?: LiquidMetalSvelteProps["minPixelRatio"];
		maxPixelCount?: LiquidMetalSvelteProps["maxPixelCount"];
		class?: HTMLAttributes<HTMLDivElement>["class"];
		style?: HTMLAttributes<HTMLDivElement>["style"];
	} & DivRestProps;

	let {
		width = "100%",
		height = 320,
		image = "https://shaders.paper.design/images/logos/diamond.svg",
		colorBack = "#aaaaac",
		colorTint = "#ffffff",
		shape = "diamond",
		repetition = 2,
		softness = 0.1,
		shiftRed = 0.3,
		shiftBlue = 0.3,
		distortion = 0.07,
		contour = 0.4,
		angle = 70,
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
	}: LiquidMetalProps = $props();

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

	let processedImage = $state<HTMLImageElement | undefined>(undefined);
	let placeholderImage = $state<HTMLImageElement | undefined>(undefined);

	$effect(() => {
		if (typeof window === "undefined") return;
		if (placeholderImage) return;
		void getEmptyPixelImage()
			.then((img) => {
				placeholderImage = img;
			})
			.catch(() => {});
	});

	$effect(() => {
		if (typeof window === "undefined") return;
		if (!image) {
			processedImage = undefined;
			return;
		}
		let stale = false;
		const source = typeof image === "string" ? image : image.src;
		void preloadLiquidMetal(source)
			.then((img) => {
				if (stale) return;
				processedImage = img;
			})
			.catch(() => {
				// fail silently — fall back to predefined shape
			});
		return () => {
			stale = true;
		};
	});

	const hasImage = $derived(Boolean(image) && processedImage !== undefined);

	const uniforms = $derived(
		toLiquidMetalUniforms(
			{
				colorBack,
				colorTint,
				shape,
				repetition,
				softness,
				shiftRed,
				shiftBlue,
				distortion,
				contour,
				angle,
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
				image: hasImage ? processedImage : placeholderImage,
				hasImage,
			},
		),
	);

	let host: HTMLDivElement | undefined;
	let shader: ShaderMount | undefined;

	$effect(() => {
		if (typeof window === "undefined" || !host) return;
		if (shader) return;
		// Wait for the placeholder so u_image is always an HTMLImageElement at
		// construction — otherwise ShaderMount never registers u_imageAspectRatio
		// and a later upload renders at degenerate UVs.
		if (!placeholderImage) return;
		if (image && !processedImage) return;
		shader = new ShaderMount(
			host,
			liquidMetalFragmentShader,
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
