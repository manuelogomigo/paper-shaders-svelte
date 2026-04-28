<script lang="ts">
	import { onDestroy } from "svelte";
	import type { HTMLAttributes } from "svelte/elements";
	import {
		gemSmokeFragmentShader,
		ShaderMount,
	} from "@paper-design/shaders";
	import {
		getEmptyPixelImage,
		preloadGemSmoke,
		toCssSize,
		toGemSmokeUniforms,
		type GemSmokeSvelteProps,
		type ShaderDimensions,
	} from "./internal/common";

	type DivRestProps = Omit<
		HTMLAttributes<HTMLDivElement>,
		"type" | "class" | "style"
	>;

	type GemSmokeProps = {
		width?: ShaderDimensions;
		height?: ShaderDimensions;
		image?: GemSmokeSvelteProps["image"];
		colors?: GemSmokeSvelteProps["colors"];
		colorBack?: GemSmokeSvelteProps["colorBack"];
		colorInner?: GemSmokeSvelteProps["colorInner"];
		shape?: GemSmokeSvelteProps["shape"];
		innerDistortion?: GemSmokeSvelteProps["innerDistortion"];
		outerDistortion?: GemSmokeSvelteProps["outerDistortion"];
		outerGlow?: GemSmokeSvelteProps["outerGlow"];
		innerGlow?: GemSmokeSvelteProps["innerGlow"];
		offset?: GemSmokeSvelteProps["offset"];
		angle?: GemSmokeSvelteProps["angle"];
		size?: GemSmokeSvelteProps["size"];
		scale?: GemSmokeSvelteProps["scale"];
		rotation?: GemSmokeSvelteProps["rotation"];
		offsetX?: GemSmokeSvelteProps["offsetX"];
		offsetY?: GemSmokeSvelteProps["offsetY"];
		fit?: GemSmokeSvelteProps["fit"];
		worldWidth?: GemSmokeSvelteProps["worldWidth"];
		worldHeight?: GemSmokeSvelteProps["worldHeight"];
		originX?: GemSmokeSvelteProps["originX"];
		originY?: GemSmokeSvelteProps["originY"];
		speed?: GemSmokeSvelteProps["speed"];
		frame?: GemSmokeSvelteProps["frame"];
		minPixelRatio?: GemSmokeSvelteProps["minPixelRatio"];
		maxPixelCount?: GemSmokeSvelteProps["maxPixelCount"];
		class?: HTMLAttributes<HTMLDivElement>["class"];
		style?: HTMLAttributes<HTMLDivElement>["style"];
	} & DivRestProps;

	let {
		width = "100%",
		height = 320,
		image = "https://shaders.paper.design/images/logos/diamond.svg",
		colors,
		colorBack = "#f0efea",
		colorInner = "#fafaf5",
		shape = "diamond",
		innerDistortion = 0.8,
		outerDistortion = 0.6,
		outerGlow = 0.55,
		innerGlow = 1,
		offset = 0,
		angle = 0,
		size = 0.8,
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
	}: GemSmokeProps = $props();

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
		void preloadGemSmoke(source)
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
		toGemSmokeUniforms(
			{
				colors,
				colorBack,
				colorInner,
				shape,
				innerDistortion,
				outerDistortion,
				outerGlow,
				innerGlow,
				offset,
				angle,
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
			gemSmokeFragmentShader,
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
