import {
	defaultPatternSizing,
	type DitheringParams,
	DitheringShapes,
	DitheringTypes,
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
