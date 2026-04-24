<script lang="ts">
	import { onDestroy } from "svelte";
	import type { HTMLAttributes } from "svelte/elements";
	import {
		emptyPixel,
		getShaderNoiseTexture,
		halftoneCmykFragmentShader,
		ShaderMount,
		type ShaderMountUniforms,
	} from "@paper-design/shaders";
	import {
		processShaderUniforms,
		toCssSize,
		toHalftoneCMYKUniforms,
		type HalftoneCMYKSvelteProps,
		type ShaderDimensions,
	} from "./internal/common";

	type DivRestProps = Omit<
		HTMLAttributes<HTMLDivElement>,
		"type" | "class" | "style"
	>;

	type HalftoneCMYKProps = {
		width?: ShaderDimensions;
		height?: ShaderDimensions;
		image?: HalftoneCMYKSvelteProps["image"];
		colorBack?: HalftoneCMYKSvelteProps["colorBack"];
		colorC?: HalftoneCMYKSvelteProps["colorC"];
		colorM?: HalftoneCMYKSvelteProps["colorM"];
		colorY?: HalftoneCMYKSvelteProps["colorY"];
		colorK?: HalftoneCMYKSvelteProps["colorK"];
		size?: HalftoneCMYKSvelteProps["size"];
		gridNoise?: HalftoneCMYKSvelteProps["gridNoise"];
		type?: HalftoneCMYKSvelteProps["type"];
		softness?: HalftoneCMYKSvelteProps["softness"];
		contrast?: HalftoneCMYKSvelteProps["contrast"];
		floodC?: HalftoneCMYKSvelteProps["floodC"];
		floodM?: HalftoneCMYKSvelteProps["floodM"];
		floodY?: HalftoneCMYKSvelteProps["floodY"];
		floodK?: HalftoneCMYKSvelteProps["floodK"];
		gainC?: HalftoneCMYKSvelteProps["gainC"];
		gainM?: HalftoneCMYKSvelteProps["gainM"];
		gainY?: HalftoneCMYKSvelteProps["gainY"];
		gainK?: HalftoneCMYKSvelteProps["gainK"];
		grainMixer?: HalftoneCMYKSvelteProps["grainMixer"];
		grainOverlay?: HalftoneCMYKSvelteProps["grainOverlay"];
		grainSize?: HalftoneCMYKSvelteProps["grainSize"];
		scale?: HalftoneCMYKSvelteProps["scale"];
		rotation?: HalftoneCMYKSvelteProps["rotation"];
		offsetX?: HalftoneCMYKSvelteProps["offsetX"];
		offsetY?: HalftoneCMYKSvelteProps["offsetY"];
		fit?: HalftoneCMYKSvelteProps["fit"];
		worldWidth?: HalftoneCMYKSvelteProps["worldWidth"];
		worldHeight?: HalftoneCMYKSvelteProps["worldHeight"];
		originX?: HalftoneCMYKSvelteProps["originX"];
		originY?: HalftoneCMYKSvelteProps["originY"];
		speed?: HalftoneCMYKSvelteProps["speed"];
		frame?: HalftoneCMYKSvelteProps["frame"];
		minPixelRatio?: HalftoneCMYKSvelteProps["minPixelRatio"];
		maxPixelCount?: HalftoneCMYKSvelteProps["maxPixelCount"];
		class?: HTMLAttributes<HTMLDivElement>["class"];
		style?: HTMLAttributes<HTMLDivElement>["style"];
	} & DivRestProps;

	let {
		width = "100%",
		height = 320,
		image = "https://paper.design/flowers.webp",
		colorBack = "#fbfaf4",
		colorC = "#00b3ff",
		colorM = "#fc4f9d",
		colorY = "#ffd900",
		colorK = "#231f20",
		size = 0.2,
		gridNoise = 0.2,
		type = "ink",
		softness = 1,
		contrast = 1,
		floodC = 0.15,
		floodM = 0,
		floodY = 0,
		floodK = 0,
		gainC = 0.3,
		gainM = 0,
		gainY = 0.2,
		gainK = 0,
		grainMixer = 0,
		grainOverlay = 0,
		grainSize = 0.5,
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
	}: HalftoneCMYKProps = $props();

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
		const base = toHalftoneCMYKUniforms(
			{
				image,
				colorBack,
				colorC,
				colorM,
				colorY,
				colorK,
				size,
				gridNoise,
				type,
				softness,
				contrast,
				floodC,
				floodM,
				floodY,
				floodK,
				gainC,
				gainM,
				gainY,
				gainK,
				grainMixer,
				grainOverlay,
				grainSize,
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
			halftoneCmykFragmentShader,
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
