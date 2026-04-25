<script lang="ts">
	import { onDestroy } from "svelte";
	import type { HTMLAttributes } from "svelte/elements";
	import {
		getShaderNoiseTexture,
		smokeRingFragmentShader,
		ShaderMount,
		type ShaderMountUniforms,
	} from "@paper-design/shaders";
	import {
		processShaderUniforms,
		toCssSize,
		toSmokeRingUniforms,
		type SmokeRingSvelteProps,
		type ShaderDimensions,
	} from "./internal/common";

	type DivRestProps = Omit<
		HTMLAttributes<HTMLDivElement>,
		"type" | "class" | "style"
	>;

	type SmokeRingProps = {
		width?: ShaderDimensions;
		height?: ShaderDimensions;
		colors?: SmokeRingSvelteProps["colors"];
		colorBack?: SmokeRingSvelteProps["colorBack"];
		noiseScale?: SmokeRingSvelteProps["noiseScale"];
		thickness?: SmokeRingSvelteProps["thickness"];
		radius?: SmokeRingSvelteProps["radius"];
		innerShape?: SmokeRingSvelteProps["innerShape"];
		noiseIterations?: SmokeRingSvelteProps["noiseIterations"];
		scale?: SmokeRingSvelteProps["scale"];
		rotation?: SmokeRingSvelteProps["rotation"];
		offsetX?: SmokeRingSvelteProps["offsetX"];
		offsetY?: SmokeRingSvelteProps["offsetY"];
		fit?: SmokeRingSvelteProps["fit"];
		worldWidth?: SmokeRingSvelteProps["worldWidth"];
		worldHeight?: SmokeRingSvelteProps["worldHeight"];
		originX?: SmokeRingSvelteProps["originX"];
		originY?: SmokeRingSvelteProps["originY"];
		speed?: SmokeRingSvelteProps["speed"];
		frame?: SmokeRingSvelteProps["frame"];
		minPixelRatio?: SmokeRingSvelteProps["minPixelRatio"];
		maxPixelCount?: SmokeRingSvelteProps["maxPixelCount"];
		class?: HTMLAttributes<HTMLDivElement>["class"];
		style?: HTMLAttributes<HTMLDivElement>["style"];
	} & DivRestProps;

	let {
		width = "100%",
		height = 320,
		colors,
		colorBack = "#000000",
		noiseScale = 3,
		thickness = 0.65,
		radius = 0.25,
		innerShape = 0.7,
		noiseIterations = 8,
		scale = 0.8,
		rotation = 0,
		offsetX = 0,
		offsetY = 0,
		fit = "contain",
		worldWidth = 0,
		worldHeight = 0,
		originX = 0.5,
		originY = 0.5,
		speed = 0.5,
		frame = 0,
		minPixelRatio = 2,
		maxPixelCount = 1920 * 1080 * 4,
		class: className,
		style: styleValue,
		...restProps
	}: SmokeRingProps = $props();

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

	const uniformsInput = $derived.by(() => {
		return toSmokeRingUniforms(
			{
				colors,
				colorBack,
				noiseScale,
				thickness,
				radius,
				innerShape,
				noiseIterations,
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
				noiseTexture: getShaderNoiseTexture(),
			},
		) as Record<string, unknown>;
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
			smokeRingFragmentShader,
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
