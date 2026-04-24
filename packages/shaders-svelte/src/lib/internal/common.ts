import {
	defaultPatternSizing,
	emptyPixel,
	type DitheringParams,
	type FlutedGlassParams,
	type HalftoneCmykParams,
	type HalftoneDotsParams,
	type ImageDitheringParams,
	type PaperTextureParams,
	type WaterParams,
	DitheringShapes,
	DitheringTypes,
	GlassDistortionShapes,
	GlassGridShapes,
	HalftoneCmykTypes,
	HalftoneDotsGrids,
	HalftoneDotsTypes,
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
	const margin = params.margin ?? 0;

	return {
		u_image: assets?.image,
		u_noiseTexture: assets?.noiseTexture,
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
