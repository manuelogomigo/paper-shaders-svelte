<script lang="ts">
	import { onDestroy } from "svelte";
	import type { HTMLAttributes } from "svelte/elements";
	import {
		heatmapFragmentShader,
		ShaderMount,
	} from "@paper-design/shaders";
	import {
		preloadHeatmap,
		toCssSize,
		toHeatmapUniforms,
		type HeatmapSvelteProps,
		type ShaderDimensions,
	} from "./internal/common";

	type DivRestProps = Omit<
		HTMLAttributes<HTMLDivElement>,
		"type" | "class" | "style"
	>;

	type HeatmapProps = {
		width?: ShaderDimensions;
		height?: ShaderDimensions;
		image?: HeatmapSvelteProps["image"];
		colors?: HeatmapSvelteProps["colors"];
		colorBack?: HeatmapSvelteProps["colorBack"];
		contour?: HeatmapSvelteProps["contour"];
		angle?: HeatmapSvelteProps["angle"];
		noise?: HeatmapSvelteProps["noise"];
		innerGlow?: HeatmapSvelteProps["innerGlow"];
		outerGlow?: HeatmapSvelteProps["outerGlow"];
		scale?: HeatmapSvelteProps["scale"];
		rotation?: HeatmapSvelteProps["rotation"];
		offsetX?: HeatmapSvelteProps["offsetX"];
		offsetY?: HeatmapSvelteProps["offsetY"];
		fit?: HeatmapSvelteProps["fit"];
		worldWidth?: HeatmapSvelteProps["worldWidth"];
		worldHeight?: HeatmapSvelteProps["worldHeight"];
		originX?: HeatmapSvelteProps["originX"];
		originY?: HeatmapSvelteProps["originY"];
		speed?: HeatmapSvelteProps["speed"];
		frame?: HeatmapSvelteProps["frame"];
		minPixelRatio?: HeatmapSvelteProps["minPixelRatio"];
		maxPixelCount?: HeatmapSvelteProps["maxPixelCount"];
		class?: HTMLAttributes<HTMLDivElement>["class"];
		style?: HTMLAttributes<HTMLDivElement>["style"];
	} & DivRestProps;

	let {
		width = "100%",
		height = 320,
		image = "https://shaders.paper.design/images/logos/diamond.svg",
		colors,
		colorBack = "#000000",
		contour = 0.5,
		angle = 0,
		noise = 0,
		innerGlow = 0.5,
		outerGlow = 0.5,
		scale = 0.75,
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
	}: HeatmapProps = $props();

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

	$effect(() => {
		if (typeof window === "undefined") return;
		if (!image) return;
		let stale = false;
		const source = typeof image === "string" ? image : image.src;
		void preloadHeatmap(source)
			.then((img) => {
				if (stale) return;
				processedImage = img;
			})
			.catch(() => {
				// fail silently — Heatmap will not render until a valid image is supplied
			});
		return () => {
			stale = true;
		};
	});

	const uniforms = $derived(
		toHeatmapUniforms(
			{
				colors,
				colorBack,
				contour,
				angle,
				noise,
				innerGlow,
				outerGlow,
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
			{ image: processedImage },
		),
	);

	let host: HTMLDivElement | undefined;
	let shader: ShaderMount | undefined;

	$effect(() => {
		if (typeof window === "undefined" || !host) return;
		if (shader) return;
		if (!processedImage) return;
		shader = new ShaderMount(
			host,
			heatmapFragmentShader,
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
		if (!shader || !processedImage) return;
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
