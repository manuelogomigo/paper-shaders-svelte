<script lang="ts">
	import { onDestroy } from "svelte";
	import type { HTMLAttributes } from "svelte/elements";
	import {
		emptyPixel,
		flutedGlassFragmentShader,
		ShaderMount,
		type ShaderMountUniforms,
	} from "@paper-design/shaders";
	import {
		processShaderUniforms,
		toCssSize,
		toFlutedGlassUniforms,
		type FlutedGlassSvelteProps,
		type ShaderDimensions,
	} from "./internal/common";

	type DivRestProps = Omit<
		HTMLAttributes<HTMLDivElement>,
		"type" | "class" | "style"
	>;

	type FlutedGlassProps = {
		width?: ShaderDimensions;
		height?: ShaderDimensions;
		image?: FlutedGlassSvelteProps["image"];
		colorBack?: FlutedGlassSvelteProps["colorBack"];
		colorShadow?: FlutedGlassSvelteProps["colorShadow"];
		colorHighlight?: FlutedGlassSvelteProps["colorHighlight"];
		shadows?: FlutedGlassSvelteProps["shadows"];
		highlights?: FlutedGlassSvelteProps["highlights"];
		size?: FlutedGlassSvelteProps["size"];
		shape?: FlutedGlassSvelteProps["shape"];
		angle?: FlutedGlassSvelteProps["angle"];
		distortionShape?: FlutedGlassSvelteProps["distortionShape"];
		distortion?: FlutedGlassSvelteProps["distortion"];
		shift?: FlutedGlassSvelteProps["shift"];
		stretch?: FlutedGlassSvelteProps["stretch"];
		blur?: FlutedGlassSvelteProps["blur"];
		edges?: FlutedGlassSvelteProps["edges"];
		margin?: FlutedGlassSvelteProps["margin"];
		marginLeft?: FlutedGlassSvelteProps["marginLeft"];
		marginRight?: FlutedGlassSvelteProps["marginRight"];
		marginTop?: FlutedGlassSvelteProps["marginTop"];
		marginBottom?: FlutedGlassSvelteProps["marginBottom"];
		grainMixer?: FlutedGlassSvelteProps["grainMixer"];
		grainOverlay?: FlutedGlassSvelteProps["grainOverlay"];
		scale?: FlutedGlassSvelteProps["scale"];
		rotation?: FlutedGlassSvelteProps["rotation"];
		offsetX?: FlutedGlassSvelteProps["offsetX"];
		offsetY?: FlutedGlassSvelteProps["offsetY"];
		fit?: FlutedGlassSvelteProps["fit"];
		worldWidth?: FlutedGlassSvelteProps["worldWidth"];
		worldHeight?: FlutedGlassSvelteProps["worldHeight"];
		originX?: FlutedGlassSvelteProps["originX"];
		originY?: FlutedGlassSvelteProps["originY"];
		speed?: FlutedGlassSvelteProps["speed"];
		frame?: FlutedGlassSvelteProps["frame"];
		minPixelRatio?: FlutedGlassSvelteProps["minPixelRatio"];
		maxPixelCount?: FlutedGlassSvelteProps["maxPixelCount"];
		class?: HTMLAttributes<HTMLDivElement>["class"];
		style?: HTMLAttributes<HTMLDivElement>["style"];
	} & DivRestProps;

	let {
		width = "100%",
		height = 320,
		image = "/assets/flowers.webp",
		colorBack = "#00000000",
		colorShadow = "#000000",
		colorHighlight = "#ffffff",
		shadows = 0.25,
		highlights = 0.1,
		size = 0.5,
		shape = "lines",
		angle = 0,
		distortionShape = "prism",
		distortion = 0.5,
		shift = 0,
		stretch = 0,
		blur = 0,
		edges = 0.25,
		margin = 0,
		marginLeft,
		marginRight,
		marginTop,
		marginBottom,
		grainMixer = 0,
		grainOverlay = 0,
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
	}: FlutedGlassProps = $props();

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
		const base = toFlutedGlassUniforms(
			{
				image,
				colorBack,
				colorShadow,
				colorHighlight,
				shadows,
				highlights,
				size,
				shape,
				angle,
				distortionShape,
				distortion,
				shift,
				stretch,
				blur,
				edges,
				margin,
				marginLeft,
				marginRight,
				marginTop,
				marginBottom,
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
			},
			{
				image: undefined,
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
			flutedGlassFragmentShader,
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
