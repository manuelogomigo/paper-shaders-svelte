import {
	colorPanelsMeta,
	defaultPatternSizing,
	dotOrbitMeta,
	emptyPixel,
	gemSmokeMeta,
	godRaysMeta,
	grainGradientMeta,
	heatmapMeta,
	toProcessedGemSmoke,
	toProcessedHeatmap,
	toProcessedLiquidMetal,
	meshGradientMeta,
	metaballsMeta,
	pulsingBorderMeta,
	simplexNoiseMeta,
	smokeRingMeta,
	staticMeshGradientMeta,
	staticRadialGradientMeta,
	swirlMeta,
	voronoiMeta,
	warpMeta,
	type ColorPanelsParams,
	type DitheringParams,
	type DotGridParams,
	type DotOrbitParams,
	type FlutedGlassParams,
	type GemSmokeParams,
	type GodRaysParams,
	type GrainGradientParams,
	type HalftoneCmykParams,
	type HeatmapParams,
	type HalftoneDotsParams,
	type ImageDitheringParams,
	type LiquidMetalParams,
	type MeshGradientParams,
	type MetaballsParams,
	type NeuroNoiseParams,
	type PaperTextureParams,
	type PerlinNoiseParams,
	type PulsingBorderParams,
	type SimplexNoiseParams,
	type SmokeRingParams,
	type StaticMeshGradientParams,
	type SpiralParams,
	type StaticRadialGradientParams,
	type SwirlParams,
	type VoronoiParams,
	type WarpParams,
	type WaterParams,
	type WavesParams,
	DitheringShapes,
	DitheringTypes,
	DotGridShapes,
	GemSmokeShapes,
	GlassDistortionShapes,
	GlassGridShapes,
	GrainGradientShapes,
	HalftoneCmykTypes,
	HalftoneDotsGrids,
	HalftoneDotsTypes,
	LiquidMetalShapes,
	PulsingBorderAspectRatios,
	WarpPatterns,
	getShaderColorFromString,
	ShaderFitOptions,
	type ShaderMountUniforms
} from '@paper-design/shaders';

export type ShaderDimensions = number | string;

export type DitheringSvelteProps = DitheringParams & {
	width?: ShaderDimensions;
	height?: ShaderDimensions;
	minPixelRatio?: number;
	maxPixelCount?: number;
};

export type PaperTextureSvelteProps = PaperTextureParams & {
	width?: ShaderDimensions;
	height?: ShaderDimensions;
	minPixelRatio?: number;
	maxPixelCount?: number;
};

export type FlutedGlassSvelteProps = FlutedGlassParams & {
	width?: ShaderDimensions;
	height?: ShaderDimensions;
	minPixelRatio?: number;
	maxPixelCount?: number;
};

export type WaterSvelteProps = WaterParams & {
	width?: ShaderDimensions;
	height?: ShaderDimensions;
	minPixelRatio?: number;
	maxPixelCount?: number;
};

export type ImageDitheringSvelteProps = Omit<ImageDitheringParams, 'image'> & {
	image?: ImageDitheringParams['image'];
	width?: ShaderDimensions;
	height?: ShaderDimensions;
	minPixelRatio?: number;
	maxPixelCount?: number;
};

export type HalftoneDotsSvelteProps = HalftoneDotsParams & {
	width?: ShaderDimensions;
	height?: ShaderDimensions;
	minPixelRatio?: number;
	maxPixelCount?: number;
};

export type HalftoneCMYKSvelteProps = HalftoneCmykParams & {
	width?: ShaderDimensions;
	height?: ShaderDimensions;
	minPixelRatio?: number;
	maxPixelCount?: number;
};

export type HeatmapSvelteProps = Omit<HeatmapParams, 'image'> & {
	image?: HeatmapParams['image'];
	width?: ShaderDimensions;
	height?: ShaderDimensions;
	minPixelRatio?: number;
	maxPixelCount?: number;
};

export type LiquidMetalSvelteProps = LiquidMetalParams & {
	width?: ShaderDimensions;
	height?: ShaderDimensions;
	minPixelRatio?: number;
	maxPixelCount?: number;
};

export type GemSmokeSvelteProps = GemSmokeParams & {
	width?: ShaderDimensions;
	height?: ShaderDimensions;
	minPixelRatio?: number;
	maxPixelCount?: number;
};

export type MeshGradientSvelteProps = MeshGradientParams & {
	width?: ShaderDimensions;
	height?: ShaderDimensions;
	minPixelRatio?: number;
	maxPixelCount?: number;
};

export type MetaballsSvelteProps = MetaballsParams & {
	width?: ShaderDimensions;
	height?: ShaderDimensions;
	minPixelRatio?: number;
	maxPixelCount?: number;
};

export type StaticMeshGradientSvelteProps = StaticMeshGradientParams & {
	width?: ShaderDimensions;
	height?: ShaderDimensions;
	minPixelRatio?: number;
	maxPixelCount?: number;
};

export type StaticRadialGradientSvelteProps = StaticRadialGradientParams & {
	width?: ShaderDimensions;
	height?: ShaderDimensions;
	minPixelRatio?: number;
	maxPixelCount?: number;
};

export type GrainGradientSvelteProps = GrainGradientParams & {
	width?: ShaderDimensions;
	height?: ShaderDimensions;
	minPixelRatio?: number;
	maxPixelCount?: number;
};

export type DotOrbitSvelteProps = DotOrbitParams & {
	width?: ShaderDimensions;
	height?: ShaderDimensions;
	minPixelRatio?: number;
	maxPixelCount?: number;
};

export type DotGridSvelteProps = DotGridParams & {
	width?: ShaderDimensions;
	height?: ShaderDimensions;
	minPixelRatio?: number;
	maxPixelCount?: number;
};

export type ColorPanelsSvelteProps = ColorPanelsParams & {
	width?: ShaderDimensions;
	height?: ShaderDimensions;
	minPixelRatio?: number;
	maxPixelCount?: number;
};

export type GodRaysSvelteProps = GodRaysParams & {
	width?: ShaderDimensions;
	height?: ShaderDimensions;
	minPixelRatio?: number;
	maxPixelCount?: number;
};

export type WarpSvelteProps = WarpParams & {
	width?: ShaderDimensions;
	height?: ShaderDimensions;
	minPixelRatio?: number;
	maxPixelCount?: number;
};

export type SpiralSvelteProps = SpiralParams & {
	width?: ShaderDimensions;
	height?: ShaderDimensions;
	minPixelRatio?: number;
	maxPixelCount?: number;
};

export type SwirlSvelteProps = SwirlParams & {
	width?: ShaderDimensions;
	height?: ShaderDimensions;
	minPixelRatio?: number;
	maxPixelCount?: number;
};

export type WavesSvelteProps = WavesParams & {
	width?: ShaderDimensions;
	height?: ShaderDimensions;
	minPixelRatio?: number;
	maxPixelCount?: number;
};

export type NeuroNoiseSvelteProps = NeuroNoiseParams & {
	width?: ShaderDimensions;
	height?: ShaderDimensions;
	minPixelRatio?: number;
	maxPixelCount?: number;
};

export type PerlinNoiseSvelteProps = PerlinNoiseParams & {
	width?: ShaderDimensions;
	height?: ShaderDimensions;
	minPixelRatio?: number;
	maxPixelCount?: number;
};

export type PulsingBorderSvelteProps = PulsingBorderParams & {
	width?: ShaderDimensions;
	height?: ShaderDimensions;
	minPixelRatio?: number;
	maxPixelCount?: number;
};

export type SimplexNoiseSvelteProps = SimplexNoiseParams & {
	width?: ShaderDimensions;
	height?: ShaderDimensions;
	minPixelRatio?: number;
	maxPixelCount?: number;
};

export type SmokeRingSvelteProps = SmokeRingParams & {
	width?: ShaderDimensions;
	height?: ShaderDimensions;
	minPixelRatio?: number;
	maxPixelCount?: number;
};

export type VoronoiSvelteProps = VoronoiParams & {
	width?: ShaderDimensions;
	height?: ShaderDimensions;
	minPixelRatio?: number;
	maxPixelCount?: number;
};

export function toCssSize(value: ShaderDimensions | undefined, fallback: string): string {
	if (typeof value === 'number') return `${value}px`;
	if (typeof value === 'string') return value;
	return fallback;
}

export function toDitheringUniforms(params: DitheringSvelteProps): ShaderMountUniforms {
	const sizing = {
		...defaultPatternSizing,
		fit: params.fit ?? defaultPatternSizing.fit,
		scale: params.scale ?? defaultPatternSizing.scale,
		rotation: params.rotation ?? defaultPatternSizing.rotation,
		offsetX: params.offsetX ?? defaultPatternSizing.offsetX,
		offsetY: params.offsetY ?? defaultPatternSizing.offsetY,
		originX: params.originX ?? defaultPatternSizing.originX,
		originY: params.originY ?? defaultPatternSizing.originY,
		worldWidth: params.worldWidth ?? defaultPatternSizing.worldWidth,
		worldHeight: params.worldHeight ?? defaultPatternSizing.worldHeight
	};

	return {
		u_colorBack: getShaderColorFromString(params.colorBack ?? '#301c2a'),
		u_colorFront: getShaderColorFromString(params.colorFront ?? '#56ae6c'),
		u_shape: DitheringShapes[params.shape ?? 'warp'],
		u_type: DitheringTypes[params.type ?? '4x4'],
		u_pxSize: params.size ?? 1,
		u_fit: ShaderFitOptions[sizing.fit],
		u_scale: sizing.scale,
		u_rotation: sizing.rotation,
		u_originX: sizing.originX,
		u_originY: sizing.originY,
		u_offsetX: sizing.offsetX,
		u_offsetY: sizing.offsetY,
		u_worldWidth: sizing.worldWidth,
		u_worldHeight: sizing.worldHeight
	};
}

export function toPaperTextureUniforms(
	params: PaperTextureSvelteProps,
	assets?: { image?: HTMLImageElement; noiseTexture?: HTMLImageElement }
): ShaderMountUniforms {
	const sizing = {
		...defaultPatternSizing,
		fit: params.fit ?? 'cover',
		scale: params.scale ?? 0.6,
		rotation: params.rotation ?? defaultPatternSizing.rotation,
		offsetX: params.offsetX ?? defaultPatternSizing.offsetX,
		offsetY: params.offsetY ?? defaultPatternSizing.offsetY,
		originX: params.originX ?? defaultPatternSizing.originX,
		originY: params.originY ?? defaultPatternSizing.originY,
		worldWidth: params.worldWidth ?? defaultPatternSizing.worldWidth,
		worldHeight: params.worldHeight ?? defaultPatternSizing.worldHeight
	};

	return {
		u_image: assets?.image,
		u_noiseTexture: assets?.noiseTexture,
		u_colorBack: getShaderColorFromString(params.colorBack ?? '#ffffff'),
		u_colorFront: getShaderColorFromString(params.colorFront ?? '#9fadbc'),
		u_contrast: params.contrast ?? 0.3,
		u_roughness: params.roughness ?? 0.4,
		u_fiber: params.fiber ?? 0.3,
		u_fiberSize: params.fiberSize ?? 0.2,
		u_crumples: params.crumples ?? 0.3,
		u_crumpleSize: params.crumpleSize ?? 0.35,
		u_folds: params.folds ?? 0.65,
		u_foldCount: params.foldCount ?? 5,
		u_fade: params.fade ?? 0,
		u_drops: params.drops ?? 0.2,
		u_seed: params.seed ?? 6,
		u_fit: ShaderFitOptions[sizing.fit],
		u_scale: sizing.scale,
		u_rotation: sizing.rotation,
		u_originX: sizing.originX,
		u_originY: sizing.originY,
		u_offsetX: sizing.offsetX,
		u_offsetY: sizing.offsetY,
		u_worldWidth: sizing.worldWidth,
		u_worldHeight: sizing.worldHeight
	};
}

export function toFlutedGlassUniforms(
	params: FlutedGlassSvelteProps,
	assets?: { image?: HTMLImageElement }
): ShaderMountUniforms {
	const sizing = {
		...defaultPatternSizing,
		fit: params.fit ?? 'cover',
		scale: params.scale ?? defaultPatternSizing.scale,
		rotation: params.rotation ?? defaultPatternSizing.rotation,
		offsetX: params.offsetX ?? defaultPatternSizing.offsetX,
		offsetY: params.offsetY ?? defaultPatternSizing.offsetY,
		originX: params.originX ?? defaultPatternSizing.originX,
		originY: params.originY ?? defaultPatternSizing.originY,
		worldWidth: params.worldWidth ?? defaultPatternSizing.worldWidth,
		worldHeight: params.worldHeight ?? defaultPatternSizing.worldHeight
	};
	const margin = params.margin ?? 0;

	return {
		u_image: assets?.image,
		u_colorBack: getShaderColorFromString(params.colorBack ?? '#00000000'),
		u_colorShadow: getShaderColorFromString(params.colorShadow ?? '#000000'),
		u_colorHighlight: getShaderColorFromString(params.colorHighlight ?? '#ffffff'),
		u_shadows: params.shadows ?? 0.25,
		u_highlights: params.highlights ?? 0.1,
		u_size: params.size ?? 0.5,
		u_shape: GlassGridShapes[params.shape ?? 'lines'],
		u_angle: params.angle ?? 0,
		u_distortionShape: GlassDistortionShapes[params.distortionShape ?? 'prism'],
		u_distortion: params.distortion ?? 0.5,
		u_shift: params.shift ?? 0,
		u_stretch: params.stretch ?? 0,
		u_blur: params.blur ?? 0,
		u_edges: params.edges ?? 0.25,
		u_marginLeft: params.marginLeft ?? margin,
		u_marginRight: params.marginRight ?? margin,
		u_marginTop: params.marginTop ?? margin,
		u_marginBottom: params.marginBottom ?? margin,
		u_grainMixer: params.grainMixer ?? 0,
		u_grainOverlay: params.grainOverlay ?? 0,
		u_fit: ShaderFitOptions[sizing.fit],
		u_scale: sizing.scale,
		u_rotation: sizing.rotation,
		u_originX: sizing.originX,
		u_originY: sizing.originY,
		u_offsetX: sizing.offsetX,
		u_offsetY: sizing.offsetY,
		u_worldWidth: sizing.worldWidth,
		u_worldHeight: sizing.worldHeight
	};
}

export function toWaterUniforms(
	params: WaterSvelteProps,
	assets?: { image?: HTMLImageElement }
): ShaderMountUniforms {
	const sizing = {
		...defaultPatternSizing,
		fit: params.fit ?? 'contain',
		scale: params.scale ?? defaultPatternSizing.scale,
		rotation: params.rotation ?? defaultPatternSizing.rotation,
		offsetX: params.offsetX ?? defaultPatternSizing.offsetX,
		offsetY: params.offsetY ?? defaultPatternSizing.offsetY,
		originX: params.originX ?? defaultPatternSizing.originX,
		originY: params.originY ?? defaultPatternSizing.originY,
		worldWidth: params.worldWidth ?? defaultPatternSizing.worldWidth,
		worldHeight: params.worldHeight ?? defaultPatternSizing.worldHeight
	};

	return {
		u_image: assets?.image,
		u_colorBack: getShaderColorFromString(params.colorBack ?? '#8f8f8f'),
		u_colorHighlight: getShaderColorFromString(params.colorHighlight ?? '#ffffff'),
		u_highlights: params.highlights ?? 0.07,
		u_layering: params.layering ?? 0.5,
		u_edges: params.edges ?? 0.8,
		u_waves: params.waves ?? 0.3,
		u_caustic: params.caustic ?? 0.1,
		u_size: params.size ?? 1,
		u_fit: ShaderFitOptions[sizing.fit],
		u_scale: sizing.scale,
		u_rotation: sizing.rotation,
		u_originX: sizing.originX,
		u_originY: sizing.originY,
		u_offsetX: sizing.offsetX,
		u_offsetY: sizing.offsetY,
		u_worldWidth: sizing.worldWidth,
		u_worldHeight: sizing.worldHeight
	};
}

export function toImageDitheringUniforms(
	params: ImageDitheringSvelteProps,
	assets?: { image?: HTMLImageElement }
): ShaderMountUniforms {
	const sizing = {
		...defaultPatternSizing,
		fit: params.fit ?? 'cover',
		scale: params.scale ?? defaultPatternSizing.scale,
		rotation: params.rotation ?? defaultPatternSizing.rotation,
		offsetX: params.offsetX ?? defaultPatternSizing.offsetX,
		offsetY: params.offsetY ?? defaultPatternSizing.offsetY,
		originX: params.originX ?? defaultPatternSizing.originX,
		originY: params.originY ?? defaultPatternSizing.originY,
		worldWidth: params.worldWidth ?? defaultPatternSizing.worldWidth,
		worldHeight: params.worldHeight ?? defaultPatternSizing.worldHeight
	};

	return {
		u_image: assets?.image,
		u_colorBack: getShaderColorFromString(params.colorBack ?? '#000c38'),
		u_colorFront: getShaderColorFromString(params.colorFront ?? '#94ffaf'),
		u_colorHighlight: getShaderColorFromString(params.colorHighlight ?? '#eaff94'),
		u_type: DitheringTypes[params.type ?? '8x8'],
		u_pxSize: params.size ?? 2,
		u_colorSteps: params.colorSteps ?? 2,
		u_originalColors: params.originalColors ?? false,
		u_inverted: params.inverted ?? false,
		u_fit: ShaderFitOptions[sizing.fit],
		u_scale: sizing.scale,
		u_rotation: sizing.rotation,
		u_originX: sizing.originX,
		u_originY: sizing.originY,
		u_offsetX: sizing.offsetX,
		u_offsetY: sizing.offsetY,
		u_worldWidth: sizing.worldWidth,
		u_worldHeight: sizing.worldHeight
	};
}

export function toHalftoneDotsUniforms(
	params: HalftoneDotsSvelteProps,
	assets?: { image?: HTMLImageElement }
): ShaderMountUniforms {
	const sizing = {
		...defaultPatternSizing,
		fit: params.fit ?? 'cover',
		scale: params.scale ?? defaultPatternSizing.scale,
		rotation: params.rotation ?? defaultPatternSizing.rotation,
		offsetX: params.offsetX ?? defaultPatternSizing.offsetX,
		offsetY: params.offsetY ?? defaultPatternSizing.offsetY,
		originX: params.originX ?? defaultPatternSizing.originX,
		originY: params.originY ?? defaultPatternSizing.originY,
		worldWidth: params.worldWidth ?? defaultPatternSizing.worldWidth,
		worldHeight: params.worldHeight ?? defaultPatternSizing.worldHeight
	};

	return {
		u_image: assets?.image,
		u_colorBack: getShaderColorFromString(params.colorBack ?? '#f2f1e8'),
		u_colorFront: getShaderColorFromString(params.colorFront ?? '#2b2b2b'),
		u_originalColors: params.originalColors ?? false,
		u_type: HalftoneDotsTypes[params.type ?? 'gooey'],
		u_inverted: params.inverted ?? false,
		u_grid: HalftoneDotsGrids[params.grid ?? 'hex'],
		u_size: params.size ?? 0.5,
		u_radius: params.radius ?? 1.25,
		u_contrast: params.contrast ?? 0.4,
		u_grainMixer: params.grainMixer ?? 0.2,
		u_grainOverlay: params.grainOverlay ?? 0.2,
		u_grainSize: params.grainSize ?? 0.5,
		u_fit: ShaderFitOptions[sizing.fit],
		u_scale: sizing.scale,
		u_rotation: sizing.rotation,
		u_originX: sizing.originX,
		u_originY: sizing.originY,
		u_offsetX: sizing.offsetX,
		u_offsetY: sizing.offsetY,
		u_worldWidth: sizing.worldWidth,
		u_worldHeight: sizing.worldHeight
	};
}

export function toHalftoneCMYKUniforms(
	params: HalftoneCMYKSvelteProps,
	assets?: { image?: HTMLImageElement; noiseTexture?: HTMLImageElement }
): ShaderMountUniforms {
	const sizing = {
		...defaultPatternSizing,
		fit: params.fit ?? 'cover',
		scale: params.scale ?? defaultPatternSizing.scale,
		rotation: params.rotation ?? defaultPatternSizing.rotation,
		offsetX: params.offsetX ?? defaultPatternSizing.offsetX,
		offsetY: params.offsetY ?? defaultPatternSizing.offsetY,
		originX: params.originX ?? defaultPatternSizing.originX,
		originY: params.originY ?? defaultPatternSizing.originY,
		worldWidth: params.worldWidth ?? defaultPatternSizing.worldWidth,
		worldHeight: params.worldHeight ?? defaultPatternSizing.worldHeight
	};

	return {
		u_image: assets?.image,
		u_noiseTexture: assets?.noiseTexture,
		u_colorBack: getShaderColorFromString(params.colorBack ?? '#fbfaf4'),
		u_colorC: getShaderColorFromString(params.colorC ?? '#00b3ff'),
		u_colorM: getShaderColorFromString(params.colorM ?? '#fc4f9d'),
		u_colorY: getShaderColorFromString(params.colorY ?? '#ffd900'),
		u_colorK: getShaderColorFromString(params.colorK ?? '#231f20'),
		u_size: params.size ?? 0.2,
		u_gridNoise: params.gridNoise ?? 0.2,
		u_type: HalftoneCmykTypes[params.type ?? 'ink'],
		u_softness: params.softness ?? 1,
		u_contrast: params.contrast ?? 1,
		u_floodC: params.floodC ?? 0.15,
		u_floodM: params.floodM ?? 0,
		u_floodY: params.floodY ?? 0,
		u_floodK: params.floodK ?? 0,
		u_gainC: params.gainC ?? 0.3,
		u_gainM: params.gainM ?? 0,
		u_gainY: params.gainY ?? 0.2,
		u_gainK: params.gainK ?? 0,
		u_grainMixer: params.grainMixer ?? 0,
		u_grainOverlay: params.grainOverlay ?? 0,
		u_grainSize: params.grainSize ?? 0.5,
		u_fit: ShaderFitOptions[sizing.fit],
		u_scale: sizing.scale,
		u_rotation: sizing.rotation,
		u_originX: sizing.originX,
		u_originY: sizing.originY,
		u_offsetX: sizing.offsetX,
		u_offsetY: sizing.offsetY,
		u_worldWidth: sizing.worldWidth,
		u_worldHeight: sizing.worldHeight
	};
}

const meshGradientDefaultColors = ['#e0eaff', '#241d9a', '#f75092', '#9f50d3'];

export function toMeshGradientUniforms(params: MeshGradientSvelteProps): ShaderMountUniforms {
	const sizing = {
		...defaultPatternSizing,
		fit: params.fit ?? 'contain',
		scale: params.scale ?? defaultPatternSizing.scale,
		rotation: params.rotation ?? defaultPatternSizing.rotation,
		offsetX: params.offsetX ?? defaultPatternSizing.offsetX,
		offsetY: params.offsetY ?? defaultPatternSizing.offsetY,
		originX: params.originX ?? defaultPatternSizing.originX,
		originY: params.originY ?? defaultPatternSizing.originY,
		worldWidth: params.worldWidth ?? defaultPatternSizing.worldWidth,
		worldHeight: params.worldHeight ?? defaultPatternSizing.worldHeight
	};

	const source = params.colors && params.colors.length > 0 ? params.colors : meshGradientDefaultColors;
	const capped = source.slice(0, meshGradientMeta.maxColorCount);
	const u_colors = capped.map((c) => getShaderColorFromString(c));

	return {
		u_colors,
		u_colorsCount: u_colors.length,
		u_distortion: params.distortion ?? 0.8,
		u_swirl: params.swirl ?? 0.1,
		u_grainMixer: params.grainMixer ?? 0,
		u_grainOverlay: params.grainOverlay ?? 0,
		u_fit: ShaderFitOptions[sizing.fit],
		u_scale: sizing.scale,
		u_rotation: sizing.rotation,
		u_originX: sizing.originX,
		u_originY: sizing.originY,
		u_offsetX: sizing.offsetX,
		u_offsetY: sizing.offsetY,
		u_worldWidth: sizing.worldWidth,
		u_worldHeight: sizing.worldHeight
	};
}

const staticMeshGradientDefaultColors = ['#ffad0a', '#6200ff', '#e2a3ff', '#ff99fd'];

export function toStaticMeshGradientUniforms(
	params: StaticMeshGradientSvelteProps
): ShaderMountUniforms {
	const sizing = {
		...defaultPatternSizing,
		fit: params.fit ?? 'contain',
		scale: params.scale ?? defaultPatternSizing.scale,
		rotation: params.rotation ?? 270,
		offsetX: params.offsetX ?? defaultPatternSizing.offsetX,
		offsetY: params.offsetY ?? defaultPatternSizing.offsetY,
		originX: params.originX ?? defaultPatternSizing.originX,
		originY: params.originY ?? defaultPatternSizing.originY,
		worldWidth: params.worldWidth ?? defaultPatternSizing.worldWidth,
		worldHeight: params.worldHeight ?? defaultPatternSizing.worldHeight
	};

	const source =
		params.colors && params.colors.length > 0 ? params.colors : staticMeshGradientDefaultColors;
	const capped = source.slice(0, staticMeshGradientMeta.maxColorCount);
	const u_colors = capped.map((c) => getShaderColorFromString(c));

	return {
		u_colors,
		u_colorsCount: u_colors.length,
		u_positions: params.positions ?? 2,
		u_waveX: params.waveX ?? 1,
		u_waveXShift: params.waveXShift ?? 0.6,
		u_waveY: params.waveY ?? 1,
		u_waveYShift: params.waveYShift ?? 0.21,
		u_mixing: params.mixing ?? 0.93,
		u_grainMixer: params.grainMixer ?? 0,
		u_grainOverlay: params.grainOverlay ?? 0,
		u_fit: ShaderFitOptions[sizing.fit],
		u_scale: sizing.scale,
		u_rotation: sizing.rotation,
		u_originX: sizing.originX,
		u_originY: sizing.originY,
		u_offsetX: sizing.offsetX,
		u_offsetY: sizing.offsetY,
		u_worldWidth: sizing.worldWidth,
		u_worldHeight: sizing.worldHeight
	};
}

const staticRadialGradientDefaultColors = ['#00bbff', '#00ffe1', '#ffffff'];

export function toStaticRadialGradientUniforms(
	params: StaticRadialGradientSvelteProps
): ShaderMountUniforms {
	const sizing = {
		...defaultPatternSizing,
		fit: params.fit ?? 'contain',
		scale: params.scale ?? defaultPatternSizing.scale,
		rotation: params.rotation ?? defaultPatternSizing.rotation,
		offsetX: params.offsetX ?? defaultPatternSizing.offsetX,
		offsetY: params.offsetY ?? defaultPatternSizing.offsetY,
		originX: params.originX ?? defaultPatternSizing.originX,
		originY: params.originY ?? defaultPatternSizing.originY,
		worldWidth: params.worldWidth ?? defaultPatternSizing.worldWidth,
		worldHeight: params.worldHeight ?? defaultPatternSizing.worldHeight
	};

	const source =
		params.colors && params.colors.length > 0 ? params.colors : staticRadialGradientDefaultColors;
	const capped = source.slice(0, staticRadialGradientMeta.maxColorCount);
	const u_colors = capped.map((c) => getShaderColorFromString(c));

	return {
		u_colorBack: getShaderColorFromString(params.colorBack ?? '#000000'),
		u_colors,
		u_colorsCount: u_colors.length,
		u_radius: params.radius ?? 0.8,
		u_focalDistance: params.focalDistance ?? 0.99,
		u_focalAngle: params.focalAngle ?? 0,
		u_falloff: params.falloff ?? 0.24,
		u_mixing: params.mixing ?? 0.5,
		u_distortion: params.distortion ?? 0,
		u_distortionShift: params.distortionShift ?? 0,
		u_distortionFreq: params.distortionFreq ?? 12,
		u_grainMixer: params.grainMixer ?? 0,
		u_grainOverlay: params.grainOverlay ?? 0,
		u_fit: ShaderFitOptions[sizing.fit],
		u_scale: sizing.scale,
		u_rotation: sizing.rotation,
		u_originX: sizing.originX,
		u_originY: sizing.originY,
		u_offsetX: sizing.offsetX,
		u_offsetY: sizing.offsetY,
		u_worldWidth: sizing.worldWidth,
		u_worldHeight: sizing.worldHeight
	};
}

const grainGradientDefaultColors = ['#7300ff', '#eba8ff', '#00bfff', '#2b00ff'];

export function toGrainGradientUniforms(
	params: GrainGradientSvelteProps,
	assets?: { noiseTexture?: HTMLImageElement }
): ShaderMountUniforms {
	const sizing = {
		...defaultPatternSizing,
		fit: params.fit ?? 'contain',
		scale: params.scale ?? defaultPatternSizing.scale,
		rotation: params.rotation ?? defaultPatternSizing.rotation,
		offsetX: params.offsetX ?? defaultPatternSizing.offsetX,
		offsetY: params.offsetY ?? defaultPatternSizing.offsetY,
		originX: params.originX ?? defaultPatternSizing.originX,
		originY: params.originY ?? defaultPatternSizing.originY,
		worldWidth: params.worldWidth ?? defaultPatternSizing.worldWidth,
		worldHeight: params.worldHeight ?? defaultPatternSizing.worldHeight
	};

	const source =
		params.colors && params.colors.length > 0 ? params.colors : grainGradientDefaultColors;
	const capped = source.slice(0, grainGradientMeta.maxColorCount);
	const u_colors = capped.map((c) => getShaderColorFromString(c));

	return {
		u_noiseTexture: assets?.noiseTexture,
		u_colorBack: getShaderColorFromString(params.colorBack ?? '#000000'),
		u_colors,
		u_colorsCount: u_colors.length,
		u_softness: params.softness ?? 0.5,
		u_intensity: params.intensity ?? 0.5,
		u_noise: params.noise ?? 0.25,
		u_shape: GrainGradientShapes[params.shape ?? 'corners'],
		u_fit: ShaderFitOptions[sizing.fit],
		u_scale: sizing.scale,
		u_rotation: sizing.rotation,
		u_originX: sizing.originX,
		u_originY: sizing.originY,
		u_offsetX: sizing.offsetX,
		u_offsetY: sizing.offsetY,
		u_worldWidth: sizing.worldWidth,
		u_worldHeight: sizing.worldHeight
	};
}

const dotOrbitDefaultColors = ['#ffc96b', '#ff6200', '#ff2f00', '#421100', '#1a0000'];

export function toDotOrbitUniforms(
	params: DotOrbitSvelteProps,
	assets?: { noiseTexture?: HTMLImageElement }
): ShaderMountUniforms {
	const sizing = {
		...defaultPatternSizing,
		fit: params.fit ?? defaultPatternSizing.fit,
		scale: params.scale ?? defaultPatternSizing.scale,
		rotation: params.rotation ?? defaultPatternSizing.rotation,
		offsetX: params.offsetX ?? defaultPatternSizing.offsetX,
		offsetY: params.offsetY ?? defaultPatternSizing.offsetY,
		originX: params.originX ?? defaultPatternSizing.originX,
		originY: params.originY ?? defaultPatternSizing.originY,
		worldWidth: params.worldWidth ?? defaultPatternSizing.worldWidth,
		worldHeight: params.worldHeight ?? defaultPatternSizing.worldHeight
	};

	const source =
		params.colors && params.colors.length > 0 ? params.colors : dotOrbitDefaultColors;
	const capped = source.slice(0, dotOrbitMeta.maxColorCount);
	const u_colors = capped.map((c) => getShaderColorFromString(c));

	return {
		u_noiseTexture: assets?.noiseTexture,
		u_colorBack: getShaderColorFromString(params.colorBack ?? '#000000'),
		u_colors,
		u_colorsCount: u_colors.length,
		u_stepsPerColor: params.stepsPerColor ?? 4,
		u_size: params.size ?? 1,
		u_sizeRange: params.sizeRange ?? 0,
		u_spreading: params.spreading ?? 1,
		u_fit: ShaderFitOptions[sizing.fit],
		u_scale: sizing.scale,
		u_rotation: sizing.rotation,
		u_originX: sizing.originX,
		u_originY: sizing.originY,
		u_offsetX: sizing.offsetX,
		u_offsetY: sizing.offsetY,
		u_worldWidth: sizing.worldWidth,
		u_worldHeight: sizing.worldHeight
	};
}

export function toDotGridUniforms(params: DotGridSvelteProps): ShaderMountUniforms {
	const sizing = {
		...defaultPatternSizing,
		fit: params.fit ?? defaultPatternSizing.fit,
		scale: params.scale ?? defaultPatternSizing.scale,
		rotation: params.rotation ?? defaultPatternSizing.rotation,
		offsetX: params.offsetX ?? defaultPatternSizing.offsetX,
		offsetY: params.offsetY ?? defaultPatternSizing.offsetY,
		originX: params.originX ?? defaultPatternSizing.originX,
		originY: params.originY ?? defaultPatternSizing.originY,
		worldWidth: params.worldWidth ?? defaultPatternSizing.worldWidth,
		worldHeight: params.worldHeight ?? defaultPatternSizing.worldHeight
	};

	return {
		u_colorBack: getShaderColorFromString(params.colorBack ?? '#000000'),
		u_colorFill: getShaderColorFromString(params.colorFill ?? '#ffffff'),
		u_colorStroke: getShaderColorFromString(params.colorStroke ?? '#ffaa00'),
		u_dotSize: params.size ?? 2,
		u_gapX: params.gapX ?? 32,
		u_gapY: params.gapY ?? 32,
		u_strokeWidth: params.strokeWidth ?? 0,
		u_sizeRange: params.sizeRange ?? 0,
		u_opacityRange: params.opacityRange ?? 0,
		u_shape: DotGridShapes[params.shape ?? 'circle'],
		u_fit: ShaderFitOptions[sizing.fit],
		u_scale: sizing.scale,
		u_rotation: sizing.rotation,
		u_originX: sizing.originX,
		u_originY: sizing.originY,
		u_offsetX: sizing.offsetX,
		u_offsetY: sizing.offsetY,
		u_worldWidth: sizing.worldWidth,
		u_worldHeight: sizing.worldHeight
	};
}

const warpDefaultColors = ['#121212', '#9470ff', '#121212', '#8838ff'];

export function toWarpUniforms(
	params: WarpSvelteProps,
	assets?: { noiseTexture?: HTMLImageElement }
): ShaderMountUniforms {
	const sizing = {
		...defaultPatternSizing,
		fit: params.fit ?? defaultPatternSizing.fit,
		scale: params.scale ?? defaultPatternSizing.scale,
		rotation: params.rotation ?? defaultPatternSizing.rotation,
		offsetX: params.offsetX ?? defaultPatternSizing.offsetX,
		offsetY: params.offsetY ?? defaultPatternSizing.offsetY,
		originX: params.originX ?? defaultPatternSizing.originX,
		originY: params.originY ?? defaultPatternSizing.originY,
		worldWidth: params.worldWidth ?? defaultPatternSizing.worldWidth,
		worldHeight: params.worldHeight ?? defaultPatternSizing.worldHeight
	};

	const source = params.colors && params.colors.length > 0 ? params.colors : warpDefaultColors;
	const capped = source.slice(0, warpMeta.maxColorCount);
	const u_colors = capped.map((c) => getShaderColorFromString(c));

	return {
		u_noiseTexture: assets?.noiseTexture,
		u_colors,
		u_colorsCount: u_colors.length,
		u_proportion: params.proportion ?? 0.45,
		u_softness: params.softness ?? 1,
		u_shape: WarpPatterns[params.shape ?? 'checks'],
		u_shapeScale: params.shapeScale ?? 0.1,
		u_distortion: params.distortion ?? 0.25,
		u_swirl: params.swirl ?? 0.8,
		u_swirlIterations: params.swirlIterations ?? 10,
		u_fit: ShaderFitOptions[sizing.fit],
		u_scale: sizing.scale,
		u_rotation: sizing.rotation,
		u_originX: sizing.originX,
		u_originY: sizing.originY,
		u_offsetX: sizing.offsetX,
		u_offsetY: sizing.offsetY,
		u_worldWidth: sizing.worldWidth,
		u_worldHeight: sizing.worldHeight
	};
}

export function toSpiralUniforms(params: SpiralSvelteProps): ShaderMountUniforms {
	const sizing = {
		...defaultPatternSizing,
		fit: params.fit ?? 'contain',
		scale: params.scale ?? defaultPatternSizing.scale,
		rotation: params.rotation ?? defaultPatternSizing.rotation,
		offsetX: params.offsetX ?? defaultPatternSizing.offsetX,
		offsetY: params.offsetY ?? defaultPatternSizing.offsetY,
		originX: params.originX ?? defaultPatternSizing.originX,
		originY: params.originY ?? defaultPatternSizing.originY,
		worldWidth: params.worldWidth ?? defaultPatternSizing.worldWidth,
		worldHeight: params.worldHeight ?? defaultPatternSizing.worldHeight
	};

	return {
		u_colorBack: getShaderColorFromString(params.colorBack ?? '#001429'),
		u_colorFront: getShaderColorFromString(params.colorFront ?? '#7ad1ff'),
		u_density: params.density ?? 1,
		u_distortion: params.distortion ?? 0,
		u_strokeWidth: params.strokeWidth ?? 0.5,
		u_strokeTaper: params.strokeTaper ?? 0,
		u_strokeCap: params.strokeCap ?? 0,
		u_noise: params.noise ?? 0,
		u_noiseFrequency: params.noiseFrequency ?? 0,
		u_softness: params.softness ?? 0,
		u_fit: ShaderFitOptions[sizing.fit],
		u_scale: sizing.scale,
		u_rotation: sizing.rotation,
		u_originX: sizing.originX,
		u_originY: sizing.originY,
		u_offsetX: sizing.offsetX,
		u_offsetY: sizing.offsetY,
		u_worldWidth: sizing.worldWidth,
		u_worldHeight: sizing.worldHeight
	};
}

const swirlDefaultColors = ['#ffd1d1', '#ff8a8a', '#660000'];

export function toSwirlUniforms(params: SwirlSvelteProps): ShaderMountUniforms {
	const sizing = {
		...defaultPatternSizing,
		fit: params.fit ?? 'contain',
		scale: params.scale ?? defaultPatternSizing.scale,
		rotation: params.rotation ?? defaultPatternSizing.rotation,
		offsetX: params.offsetX ?? defaultPatternSizing.offsetX,
		offsetY: params.offsetY ?? defaultPatternSizing.offsetY,
		originX: params.originX ?? defaultPatternSizing.originX,
		originY: params.originY ?? defaultPatternSizing.originY,
		worldWidth: params.worldWidth ?? defaultPatternSizing.worldWidth,
		worldHeight: params.worldHeight ?? defaultPatternSizing.worldHeight
	};

	const source = params.colors && params.colors.length > 0 ? params.colors : swirlDefaultColors;
	const capped = source.slice(0, swirlMeta.maxColorCount);
	const u_colors = capped.map((c) => getShaderColorFromString(c));

	return {
		u_colorBack: getShaderColorFromString(params.colorBack ?? '#330000'),
		u_colors,
		u_colorsCount: u_colors.length,
		u_bandCount: params.bandCount ?? 4,
		u_twist: params.twist ?? 0.1,
		u_center: params.center ?? 0.2,
		u_proportion: params.proportion ?? 0.5,
		u_softness: params.softness ?? 0,
		u_noise: params.noise ?? 0.2,
		u_noiseFrequency: params.noiseFrequency ?? 0.4,
		u_fit: ShaderFitOptions[sizing.fit],
		u_scale: sizing.scale,
		u_rotation: sizing.rotation,
		u_originX: sizing.originX,
		u_originY: sizing.originY,
		u_offsetX: sizing.offsetX,
		u_offsetY: sizing.offsetY,
		u_worldWidth: sizing.worldWidth,
		u_worldHeight: sizing.worldHeight
	};
}

export function toWavesUniforms(params: WavesSvelteProps): ShaderMountUniforms {
	const sizing = {
		...defaultPatternSizing,
		fit: params.fit ?? defaultPatternSizing.fit,
		scale: params.scale ?? 0.6,
		rotation: params.rotation ?? defaultPatternSizing.rotation,
		offsetX: params.offsetX ?? defaultPatternSizing.offsetX,
		offsetY: params.offsetY ?? defaultPatternSizing.offsetY,
		originX: params.originX ?? defaultPatternSizing.originX,
		originY: params.originY ?? defaultPatternSizing.originY,
		worldWidth: params.worldWidth ?? defaultPatternSizing.worldWidth,
		worldHeight: params.worldHeight ?? defaultPatternSizing.worldHeight
	};

	return {
		u_colorBack: getShaderColorFromString(params.colorBack ?? '#000000'),
		u_colorFront: getShaderColorFromString(params.colorFront ?? '#ffbb00'),
		u_shape: params.shape ?? 1,
		u_frequency: params.frequency ?? 0.5,
		u_amplitude: params.amplitude ?? 0.5,
		u_spacing: params.spacing ?? 1.2,
		u_proportion: params.proportion ?? 0.1,
		u_softness: params.softness ?? 0,
		u_fit: ShaderFitOptions[sizing.fit],
		u_scale: sizing.scale,
		u_rotation: sizing.rotation,
		u_originX: sizing.originX,
		u_originY: sizing.originY,
		u_offsetX: sizing.offsetX,
		u_offsetY: sizing.offsetY,
		u_worldWidth: sizing.worldWidth,
		u_worldHeight: sizing.worldHeight
	};
}

export function toNeuroNoiseUniforms(params: NeuroNoiseSvelteProps): ShaderMountUniforms {
	const sizing = {
		...defaultPatternSizing,
		fit: params.fit ?? defaultPatternSizing.fit,
		scale: params.scale ?? defaultPatternSizing.scale,
		rotation: params.rotation ?? defaultPatternSizing.rotation,
		offsetX: params.offsetX ?? defaultPatternSizing.offsetX,
		offsetY: params.offsetY ?? defaultPatternSizing.offsetY,
		originX: params.originX ?? defaultPatternSizing.originX,
		originY: params.originY ?? defaultPatternSizing.originY,
		worldWidth: params.worldWidth ?? defaultPatternSizing.worldWidth,
		worldHeight: params.worldHeight ?? defaultPatternSizing.worldHeight
	};

	return {
		u_colorFront: getShaderColorFromString(params.colorFront ?? '#ffffff'),
		u_colorMid: getShaderColorFromString(params.colorMid ?? '#47a6ff'),
		u_colorBack: getShaderColorFromString(params.colorBack ?? '#000000'),
		u_brightness: params.brightness ?? 0.05,
		u_contrast: params.contrast ?? 0.3,
		u_fit: ShaderFitOptions[sizing.fit],
		u_scale: sizing.scale,
		u_rotation: sizing.rotation,
		u_originX: sizing.originX,
		u_originY: sizing.originY,
		u_offsetX: sizing.offsetX,
		u_offsetY: sizing.offsetY,
		u_worldWidth: sizing.worldWidth,
		u_worldHeight: sizing.worldHeight
	};
}

export function toPerlinNoiseUniforms(params: PerlinNoiseSvelteProps): ShaderMountUniforms {
	const sizing = {
		...defaultPatternSizing,
		fit: params.fit ?? defaultPatternSizing.fit,
		scale: params.scale ?? defaultPatternSizing.scale,
		rotation: params.rotation ?? defaultPatternSizing.rotation,
		offsetX: params.offsetX ?? defaultPatternSizing.offsetX,
		offsetY: params.offsetY ?? defaultPatternSizing.offsetY,
		originX: params.originX ?? defaultPatternSizing.originX,
		originY: params.originY ?? defaultPatternSizing.originY,
		worldWidth: params.worldWidth ?? defaultPatternSizing.worldWidth,
		worldHeight: params.worldHeight ?? defaultPatternSizing.worldHeight
	};

	return {
		u_colorBack: getShaderColorFromString(params.colorBack ?? '#632ad5'),
		u_colorFront: getShaderColorFromString(params.colorFront ?? '#fccff7'),
		u_proportion: params.proportion ?? 0.35,
		u_softness: params.softness ?? 0.1,
		u_octaveCount: params.octaveCount ?? 1,
		u_persistence: params.persistence ?? 1,
		u_lacunarity: params.lacunarity ?? 1.5,
		u_fit: ShaderFitOptions[sizing.fit],
		u_scale: sizing.scale,
		u_rotation: sizing.rotation,
		u_originX: sizing.originX,
		u_originY: sizing.originY,
		u_offsetX: sizing.offsetX,
		u_offsetY: sizing.offsetY,
		u_worldWidth: sizing.worldWidth,
		u_worldHeight: sizing.worldHeight
	};
}

const simplexNoiseDefaultColors = ['#e7cae5', '#110d21', '#442c44', '#e7bcbc', '#fff5f5'];

export function toSimplexNoiseUniforms(params: SimplexNoiseSvelteProps): ShaderMountUniforms {
	const sizing = {
		...defaultPatternSizing,
		fit: params.fit ?? defaultPatternSizing.fit,
		scale: params.scale ?? 0.2,
		rotation: params.rotation ?? defaultPatternSizing.rotation,
		offsetX: params.offsetX ?? defaultPatternSizing.offsetX,
		offsetY: params.offsetY ?? defaultPatternSizing.offsetY,
		originX: params.originX ?? defaultPatternSizing.originX,
		originY: params.originY ?? defaultPatternSizing.originY,
		worldWidth: params.worldWidth ?? defaultPatternSizing.worldWidth,
		worldHeight: params.worldHeight ?? defaultPatternSizing.worldHeight
	};

	const source =
		params.colors && params.colors.length > 0 ? params.colors : simplexNoiseDefaultColors;
	const capped = source.slice(0, simplexNoiseMeta.maxColorCount);
	const u_colors = capped.map((c) => getShaderColorFromString(c));

	return {
		u_colors,
		u_colorsCount: u_colors.length,
		u_stepsPerColor: params.stepsPerColor ?? 2,
		u_softness: params.softness ?? 0,
		u_fit: ShaderFitOptions[sizing.fit],
		u_scale: sizing.scale,
		u_rotation: sizing.rotation,
		u_originX: sizing.originX,
		u_originY: sizing.originY,
		u_offsetX: sizing.offsetX,
		u_offsetY: sizing.offsetY,
		u_worldWidth: sizing.worldWidth,
		u_worldHeight: sizing.worldHeight
	};
}

const voronoiDefaultColors = ['#ff8247', '#ffe53d'];

export function toVoronoiUniforms(
	params: VoronoiSvelteProps,
	assets?: { noiseTexture?: HTMLImageElement }
): ShaderMountUniforms {
	const sizing = {
		...defaultPatternSizing,
		fit: params.fit ?? defaultPatternSizing.fit,
		scale: params.scale ?? 0.5,
		rotation: params.rotation ?? defaultPatternSizing.rotation,
		offsetX: params.offsetX ?? defaultPatternSizing.offsetX,
		offsetY: params.offsetY ?? defaultPatternSizing.offsetY,
		originX: params.originX ?? defaultPatternSizing.originX,
		originY: params.originY ?? defaultPatternSizing.originY,
		worldWidth: params.worldWidth ?? defaultPatternSizing.worldWidth,
		worldHeight: params.worldHeight ?? defaultPatternSizing.worldHeight
	};

	const source = params.colors && params.colors.length > 0 ? params.colors : voronoiDefaultColors;
	const capped = source.slice(0, voronoiMeta.maxColorCount);
	const u_colors = capped.map((c) => getShaderColorFromString(c));

	return {
		u_noiseTexture: assets?.noiseTexture,
		u_colors,
		u_colorsCount: u_colors.length,
		u_stepsPerColor: params.stepsPerColor ?? 3,
		u_colorGap: getShaderColorFromString(params.colorGap ?? '#2e0000'),
		u_colorGlow: getShaderColorFromString(params.colorGlow ?? '#ffffff'),
		u_distortion: params.distortion ?? 0.4,
		u_gap: params.gap ?? 0.04,
		u_glow: params.glow ?? 0,
		u_fit: ShaderFitOptions[sizing.fit],
		u_scale: sizing.scale,
		u_rotation: sizing.rotation,
		u_originX: sizing.originX,
		u_originY: sizing.originY,
		u_offsetX: sizing.offsetX,
		u_offsetY: sizing.offsetY,
		u_worldWidth: sizing.worldWidth,
		u_worldHeight: sizing.worldHeight
	};
}

const pulsingBorderDefaultColors = ['#0dc1fd', '#d915ef', '#ff3f2ecc'];

export function toPulsingBorderUniforms(
	params: PulsingBorderSvelteProps,
	assets?: { noiseTexture?: HTMLImageElement }
): ShaderMountUniforms {
	const sizing = {
		...defaultPatternSizing,
		fit: params.fit ?? 'contain',
		scale: params.scale ?? 0.6,
		rotation: params.rotation ?? defaultPatternSizing.rotation,
		offsetX: params.offsetX ?? defaultPatternSizing.offsetX,
		offsetY: params.offsetY ?? defaultPatternSizing.offsetY,
		originX: params.originX ?? defaultPatternSizing.originX,
		originY: params.originY ?? defaultPatternSizing.originY,
		worldWidth: params.worldWidth ?? defaultPatternSizing.worldWidth,
		worldHeight: params.worldHeight ?? defaultPatternSizing.worldHeight
	};
	const margin = params.margin ?? 0;

	const source =
		params.colors && params.colors.length > 0 ? params.colors : pulsingBorderDefaultColors;
	const capped = source.slice(0, pulsingBorderMeta.maxColorCount);
	const u_colors = capped.map((c) => getShaderColorFromString(c));

	return {
		u_noiseTexture: assets?.noiseTexture,
		u_colorBack: getShaderColorFromString(params.colorBack ?? '#000000'),
		u_colors,
		u_colorsCount: u_colors.length,
		u_roundness: params.roundness ?? 0.25,
		u_thickness: params.thickness ?? 0.1,
		u_softness: params.softness ?? 0.75,
		u_marginLeft: params.marginLeft ?? margin,
		u_marginRight: params.marginRight ?? margin,
		u_marginTop: params.marginTop ?? margin,
		u_marginBottom: params.marginBottom ?? margin,
		u_aspectRatio: PulsingBorderAspectRatios[params.aspectRatio ?? 'auto'],
		u_intensity: params.intensity ?? 0.2,
		u_bloom: params.bloom ?? 0.25,
		u_spots: params.spots ?? 4,
		u_spotSize: params.spotSize ?? 0.5,
		u_pulse: params.pulse ?? 0.25,
		u_smoke: params.smoke ?? 0.3,
		u_smokeSize: params.smokeSize ?? 0.6,
		u_fit: ShaderFitOptions[sizing.fit],
		u_scale: sizing.scale,
		u_rotation: sizing.rotation,
		u_originX: sizing.originX,
		u_originY: sizing.originY,
		u_offsetX: sizing.offsetX,
		u_offsetY: sizing.offsetY,
		u_worldWidth: sizing.worldWidth,
		u_worldHeight: sizing.worldHeight
	};
}

const metaballsDefaultColors = ['#6e33cc', '#ff5500', '#ffc105', '#ffc800', '#f585ff'];

export function toMetaballsUniforms(
	params: MetaballsSvelteProps,
	assets?: { noiseTexture?: HTMLImageElement }
): ShaderMountUniforms {
	const sizing = {
		...defaultPatternSizing,
		fit: params.fit ?? 'contain',
		scale: params.scale ?? defaultPatternSizing.scale,
		rotation: params.rotation ?? defaultPatternSizing.rotation,
		offsetX: params.offsetX ?? defaultPatternSizing.offsetX,
		offsetY: params.offsetY ?? defaultPatternSizing.offsetY,
		originX: params.originX ?? defaultPatternSizing.originX,
		originY: params.originY ?? defaultPatternSizing.originY,
		worldWidth: params.worldWidth ?? defaultPatternSizing.worldWidth,
		worldHeight: params.worldHeight ?? defaultPatternSizing.worldHeight
	};

	const source =
		params.colors && params.colors.length > 0 ? params.colors : metaballsDefaultColors;
	const capped = source.slice(0, metaballsMeta.maxColorCount);
	const u_colors = capped.map((c) => getShaderColorFromString(c));

	return {
		u_noiseTexture: assets?.noiseTexture,
		u_colorBack: getShaderColorFromString(params.colorBack ?? '#000000'),
		u_colors,
		u_colorsCount: u_colors.length,
		u_count: params.count ?? 10,
		u_size: params.size ?? 0.83,
		u_fit: ShaderFitOptions[sizing.fit],
		u_scale: sizing.scale,
		u_rotation: sizing.rotation,
		u_originX: sizing.originX,
		u_originY: sizing.originY,
		u_offsetX: sizing.offsetX,
		u_offsetY: sizing.offsetY,
		u_worldWidth: sizing.worldWidth,
		u_worldHeight: sizing.worldHeight
	};
}

const colorPanelsDefaultColors = [
	'#ff9d00',
	'#fd4f30',
	'#809bff',
	'#6d2eff',
	'#333aff',
	'#f15cff',
	'#ffd557'
];

export function toColorPanelsUniforms(params: ColorPanelsSvelteProps): ShaderMountUniforms {
	const sizing = {
		...defaultPatternSizing,
		fit: params.fit ?? 'contain',
		scale: params.scale ?? 0.8,
		rotation: params.rotation ?? defaultPatternSizing.rotation,
		offsetX: params.offsetX ?? defaultPatternSizing.offsetX,
		offsetY: params.offsetY ?? defaultPatternSizing.offsetY,
		originX: params.originX ?? defaultPatternSizing.originX,
		originY: params.originY ?? defaultPatternSizing.originY,
		worldWidth: params.worldWidth ?? defaultPatternSizing.worldWidth,
		worldHeight: params.worldHeight ?? defaultPatternSizing.worldHeight
	};

	const source =
		params.colors && params.colors.length > 0 ? params.colors : colorPanelsDefaultColors;
	const capped = source.slice(0, colorPanelsMeta.maxColorCount);
	const u_colors = capped.map((c) => getShaderColorFromString(c));

	return {
		u_colors,
		u_colorsCount: u_colors.length,
		u_colorBack: getShaderColorFromString(params.colorBack ?? '#000000'),
		u_density: params.density ?? 3,
		u_angle1: params.angle1 ?? 0,
		u_angle2: params.angle2 ?? 0,
		u_length: params.length ?? 1.1,
		u_edges: params.edges ?? true,
		u_blur: params.blur ?? 0,
		u_fadeIn: params.fadeIn ?? 1,
		u_fadeOut: params.fadeOut ?? 0.3,
		u_gradient: params.gradient ?? 0,
		u_fit: ShaderFitOptions[sizing.fit],
		u_scale: sizing.scale,
		u_rotation: sizing.rotation,
		u_originX: sizing.originX,
		u_originY: sizing.originY,
		u_offsetX: sizing.offsetX,
		u_offsetY: sizing.offsetY,
		u_worldWidth: sizing.worldWidth,
		u_worldHeight: sizing.worldHeight
	};
}

const smokeRingDefaultColors = ['#ffffff'];

export function toSmokeRingUniforms(
	params: SmokeRingSvelteProps,
	assets?: { noiseTexture?: HTMLImageElement }
): ShaderMountUniforms {
	const sizing = {
		...defaultPatternSizing,
		fit: params.fit ?? 'contain',
		scale: params.scale ?? 0.8,
		rotation: params.rotation ?? defaultPatternSizing.rotation,
		offsetX: params.offsetX ?? defaultPatternSizing.offsetX,
		offsetY: params.offsetY ?? defaultPatternSizing.offsetY,
		originX: params.originX ?? defaultPatternSizing.originX,
		originY: params.originY ?? defaultPatternSizing.originY,
		worldWidth: params.worldWidth ?? defaultPatternSizing.worldWidth,
		worldHeight: params.worldHeight ?? defaultPatternSizing.worldHeight
	};

	const source =
		params.colors && params.colors.length > 0 ? params.colors : smokeRingDefaultColors;
	const capped = source.slice(0, smokeRingMeta.maxColorCount);
	const u_colors = capped.map((c) => getShaderColorFromString(c));

	return {
		u_noiseTexture: assets?.noiseTexture,
		u_colorBack: getShaderColorFromString(params.colorBack ?? '#000000'),
		u_colors,
		u_colorsCount: u_colors.length,
		u_noiseScale: params.noiseScale ?? 3,
		u_thickness: params.thickness ?? 0.65,
		u_radius: params.radius ?? 0.25,
		u_innerShape: params.innerShape ?? 0.7,
		u_noiseIterations: params.noiseIterations ?? 8,
		u_fit: ShaderFitOptions[sizing.fit],
		u_scale: sizing.scale,
		u_rotation: sizing.rotation,
		u_originX: sizing.originX,
		u_originY: sizing.originY,
		u_offsetX: sizing.offsetX,
		u_offsetY: sizing.offsetY,
		u_worldWidth: sizing.worldWidth,
		u_worldHeight: sizing.worldHeight
	};
}

const godRaysDefaultColors = ['#a600ff6e', '#6200fff0', '#ffffff', '#33fff5'];

export function toGodRaysUniforms(
	params: GodRaysSvelteProps,
	assets?: { noiseTexture?: HTMLImageElement }
): ShaderMountUniforms {
	const sizing = {
		...defaultPatternSizing,
		fit: params.fit ?? 'contain',
		scale: params.scale ?? defaultPatternSizing.scale,
		rotation: params.rotation ?? defaultPatternSizing.rotation,
		offsetX: params.offsetX ?? defaultPatternSizing.offsetX,
		offsetY: params.offsetY ?? -0.55,
		originX: params.originX ?? defaultPatternSizing.originX,
		originY: params.originY ?? defaultPatternSizing.originY,
		worldWidth: params.worldWidth ?? defaultPatternSizing.worldWidth,
		worldHeight: params.worldHeight ?? defaultPatternSizing.worldHeight
	};

	const source = params.colors && params.colors.length > 0 ? params.colors : godRaysDefaultColors;
	const capped = source.slice(0, godRaysMeta.maxColorCount);
	const u_colors = capped.map((c) => getShaderColorFromString(c));

	return {
		u_noiseTexture: assets?.noiseTexture,
		u_colorBack: getShaderColorFromString(params.colorBack ?? '#000000'),
		u_colorBloom: getShaderColorFromString(params.colorBloom ?? '#0000ff'),
		u_colors,
		u_colorsCount: u_colors.length,
		u_bloom: params.bloom ?? 0.4,
		u_intensity: params.intensity ?? 0.8,
		u_density: params.density ?? 0.3,
		u_spotty: params.spotty ?? 0.3,
		u_midSize: params.midSize ?? 0.2,
		u_midIntensity: params.midIntensity ?? 0.4,
		u_fit: ShaderFitOptions[sizing.fit],
		u_scale: sizing.scale,
		u_rotation: sizing.rotation,
		u_originX: sizing.originX,
		u_originY: sizing.originY,
		u_offsetX: sizing.offsetX,
		u_offsetY: sizing.offsetY,
		u_worldWidth: sizing.worldWidth,
		u_worldHeight: sizing.worldHeight
	};
}

const heatmapDefaultColors = ['#a600ff6e', '#6200fff0', '#ffffff', '#33fff5', '#33cc99'];

export function toHeatmapUniforms(
	params: HeatmapSvelteProps,
	assets?: { image?: HTMLImageElement }
): ShaderMountUniforms {
	const sizing = {
		...defaultPatternSizing,
		fit: params.fit ?? 'contain',
		scale: params.scale ?? 0.75,
		rotation: params.rotation ?? defaultPatternSizing.rotation,
		offsetX: params.offsetX ?? defaultPatternSizing.offsetX,
		offsetY: params.offsetY ?? defaultPatternSizing.offsetY,
		originX: params.originX ?? defaultPatternSizing.originX,
		originY: params.originY ?? defaultPatternSizing.originY,
		worldWidth: params.worldWidth ?? defaultPatternSizing.worldWidth,
		worldHeight: params.worldHeight ?? defaultPatternSizing.worldHeight
	};

	const source = params.colors && params.colors.length > 0 ? params.colors : heatmapDefaultColors;
	const capped = source.slice(0, heatmapMeta.maxColorCount);
	const u_colors = capped.map((c) => getShaderColorFromString(c));

	return {
		u_image: assets?.image,
		u_colorBack: getShaderColorFromString(params.colorBack ?? '#000000'),
		u_colors,
		u_colorsCount: u_colors.length,
		u_contour: params.contour ?? 0.5,
		u_angle: params.angle ?? 0,
		u_noise: params.noise ?? 0,
		u_innerGlow: params.innerGlow ?? 0.5,
		u_outerGlow: params.outerGlow ?? 0.5,
		u_fit: ShaderFitOptions[sizing.fit],
		u_scale: sizing.scale,
		u_rotation: sizing.rotation,
		u_originX: sizing.originX,
		u_originY: sizing.originY,
		u_offsetX: sizing.offsetX,
		u_offsetY: sizing.offsetY,
		u_worldWidth: sizing.worldWidth,
		u_worldHeight: sizing.worldHeight
	};
}

export function toLiquidMetalUniforms(
	params: LiquidMetalSvelteProps,
	assets?: { image?: HTMLImageElement; hasImage?: boolean }
): ShaderMountUniforms {
	const sizing = {
		...defaultPatternSizing,
		fit: params.fit ?? 'contain',
		scale: params.scale ?? 0.6,
		rotation: params.rotation ?? defaultPatternSizing.rotation,
		offsetX: params.offsetX ?? defaultPatternSizing.offsetX,
		offsetY: params.offsetY ?? defaultPatternSizing.offsetY,
		originX: params.originX ?? defaultPatternSizing.originX,
		originY: params.originY ?? defaultPatternSizing.originY,
		worldWidth: params.worldWidth ?? defaultPatternSizing.worldWidth,
		worldHeight: params.worldHeight ?? defaultPatternSizing.worldHeight
	};

	return {
		u_image: assets?.image,
		u_isImage: assets?.hasImage ?? false,
		u_colorBack: getShaderColorFromString(params.colorBack ?? '#aaaaac'),
		u_colorTint: getShaderColorFromString(params.colorTint ?? '#ffffff'),
		u_shape: LiquidMetalShapes[params.shape ?? 'diamond'],
		u_repetition: params.repetition ?? 2,
		u_softness: params.softness ?? 0.1,
		u_shiftRed: params.shiftRed ?? 0.3,
		u_shiftBlue: params.shiftBlue ?? 0.3,
		u_distortion: params.distortion ?? 0.07,
		u_contour: params.contour ?? 0.4,
		u_angle: params.angle ?? 70,
		u_fit: ShaderFitOptions[sizing.fit],
		u_scale: sizing.scale,
		u_rotation: sizing.rotation,
		u_originX: sizing.originX,
		u_originY: sizing.originY,
		u_offsetX: sizing.offsetX,
		u_offsetY: sizing.offsetY,
		u_worldWidth: sizing.worldWidth,
		u_worldHeight: sizing.worldHeight
	};
}

const gemSmokeDefaultColors = ['#333333', '#e7e6df'];

export function toGemSmokeUniforms(
	params: GemSmokeSvelteProps,
	assets?: { image?: HTMLImageElement; hasImage?: boolean }
): ShaderMountUniforms {
	const sizing = {
		...defaultPatternSizing,
		fit: params.fit ?? 'contain',
		scale: params.scale ?? 0.6,
		rotation: params.rotation ?? defaultPatternSizing.rotation,
		offsetX: params.offsetX ?? defaultPatternSizing.offsetX,
		offsetY: params.offsetY ?? defaultPatternSizing.offsetY,
		originX: params.originX ?? defaultPatternSizing.originX,
		originY: params.originY ?? defaultPatternSizing.originY,
		worldWidth: params.worldWidth ?? defaultPatternSizing.worldWidth,
		worldHeight: params.worldHeight ?? defaultPatternSizing.worldHeight
	};

	const source = params.colors && params.colors.length > 0 ? params.colors : gemSmokeDefaultColors;
	const capped = source.slice(0, gemSmokeMeta.maxColorCount);
	const u_colors = capped.map((c) => getShaderColorFromString(c));

	return {
		u_image: assets?.image,
		u_isImage: assets?.hasImage ?? false,
		u_colorBack: getShaderColorFromString(params.colorBack ?? '#f0efea'),
		u_colorInner: getShaderColorFromString(params.colorInner ?? '#fafaf5'),
		u_colors,
		u_colorsCount: u_colors.length,
		u_shape: GemSmokeShapes[params.shape ?? 'diamond'],
		u_innerDistortion: params.innerDistortion ?? 0.8,
		u_outerDistortion: params.outerDistortion ?? 0.6,
		u_outerGlow: params.outerGlow ?? 0.55,
		u_innerGlow: params.innerGlow ?? 1,
		u_offset: params.offset ?? 0,
		u_angle: params.angle ?? 0,
		u_size: params.size ?? 0.8,
		u_fit: ShaderFitOptions[sizing.fit],
		u_scale: sizing.scale,
		u_rotation: sizing.rotation,
		u_originX: sizing.originX,
		u_originY: sizing.originY,
		u_offsetX: sizing.offsetX,
		u_offsetY: sizing.offsetY,
		u_worldWidth: sizing.worldWidth,
		u_worldHeight: sizing.worldHeight
	};
}

function setMinImageSize(img: HTMLImageElement) {
	if (img.naturalWidth < 1024 && img.naturalHeight < 1024) {
		if (img.naturalWidth < 1 || img.naturalHeight < 1) return;
		const aspect = img.naturalWidth / img.naturalHeight;
		img.width = Math.round(aspect > 1 ? 1024 * aspect : 1024);
		img.height = Math.round(aspect > 1 ? 1024 : 1024 / aspect);
	}
}

function isValidUrl(url: string): boolean {
	try {
		if (url.startsWith('/')) return true;
		new URL(url);
		return true;
	} catch {
		return false;
	}
}

function isExternalUrl(url: string): boolean {
	try {
		if (url.startsWith('/')) return false;
		const urlObject = new URL(url, window.location.origin);
		return urlObject.origin !== window.location.origin;
	} catch {
		return false;
	}
}

function loadUrlImage(url: string): Promise<HTMLImageElement> {
	return new Promise((resolve, reject) => {
		const img = new Image();
		if (isExternalUrl(url)) img.crossOrigin = 'anonymous';
		img.onload = () => {
			setMinImageSize(img);
			resolve(img);
		};
		img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
		img.src = url;
	});
}

export async function processShaderUniforms(
	uniformsProp: Record<string, unknown>
): Promise<ShaderMountUniforms> {
	const processedUniforms: ShaderMountUniforms = {};

	for (const [key, value] of Object.entries(uniformsProp)) {
		if (typeof value === 'string') {
			const url = value || emptyPixel;
			if (!isValidUrl(url)) continue;
			try {
				processedUniforms[key] = await loadUrlImage(url);
			} catch {
				processedUniforms[key] = await loadUrlImage(emptyPixel);
			}
			continue;
		}
		if (value instanceof HTMLImageElement) {
			if (value.complete) {
				if (value.naturalWidth > 0) {
					setMinImageSize(value);
					processedUniforms[key] = value;
				}
				continue;
			}

			await new Promise<void>((resolve) => {
				const onLoad = () => {
					value.removeEventListener('load', onLoad);
					value.removeEventListener('error', onError);
					resolve();
				};
				const onError = () => {
					value.removeEventListener('load', onLoad);
					value.removeEventListener('error', onError);
					resolve();
				};
				value.addEventListener('load', onLoad, { once: true });
				value.addEventListener('error', onError, { once: true });
			});

			if (value.complete && value.naturalWidth > 0) {
				setMinImageSize(value);
				processedUniforms[key] = value;
			}
			continue;
		}
		if (
			value === undefined ||
			typeof value === 'number' ||
			typeof value === 'boolean' ||
			Array.isArray(value)
		) {
			processedUniforms[key] = value;
		}
	}

	return processedUniforms;
}


// ─────────────────────────────────────────────────────────────────────────────
// Image preprocessing caches for shaders that need expensive pre-pass work
// (Heatmap, LiquidMetal). Each unique source URL is processed exactly once
// per page session; subsequent calls reuse the cached HTMLImageElement.
//
// Use `preloadHeatmap(url)` / `preloadLiquidMetal(url)` / `preloadGemSmoke(url)`
// to warm the cache during page idle time so the first hover is instant.
// ─────────────────────────────────────────────────────────────────────────────

const heatmapImageCache = new Map<string, Promise<HTMLImageElement>>();
const liquidMetalImageCache = new Map<string, Promise<HTMLImageElement>>();
const gemSmokeImageCache = new Map<string, Promise<HTMLImageElement>>();

function loadProcessedImage(
	source: string,
	cache: Map<string, Promise<HTMLImageElement>>,
	process: (file: string) => Promise<{ blob?: Blob; pngBlob?: Blob }>
): Promise<HTMLImageElement> {
	const cached = cache.get(source);
	if (cached) return cached;
	const promise = (async () => {
		const result = await process(source);
		const blob = result.blob ?? result.pngBlob;
		if (!blob) throw new Error(`Processing returned no blob for ${source}`);
		const objectUrl = URL.createObjectURL(blob);
		try {
			return await new Promise<HTMLImageElement>((resolve, reject) => {
				const img = new Image();
				img.onload = () => resolve(img);
				img.onerror = () => reject(new Error(`Failed to load processed image for ${source}`));
				img.src = objectUrl;
			});
		} finally {
			queueMicrotask(() => URL.revokeObjectURL(objectUrl));
		}
	})();
	cache.set(source, promise);
	promise.catch(() => cache.delete(source));
	return promise;
}

/** Process and cache a Heatmap source image. Returns the processed HTMLImageElement. */
export function preloadHeatmap(source: string): Promise<HTMLImageElement> {
	return loadProcessedImage(source, heatmapImageCache, async (s) => toProcessedHeatmap(s));
}

/** Process and cache a LiquidMetal source image. Returns the processed HTMLImageElement. */
export function preloadLiquidMetal(source: string): Promise<HTMLImageElement> {
	return loadProcessedImage(source, liquidMetalImageCache, async (s) => toProcessedLiquidMetal(s));
}

/** Process and cache a GemSmoke source image. Returns the processed HTMLImageElement. */
export function preloadGemSmoke(source: string): Promise<HTMLImageElement> {
	return loadProcessedImage(source, gemSmokeImageCache, async (s) => toProcessedGemSmoke(s));
}

