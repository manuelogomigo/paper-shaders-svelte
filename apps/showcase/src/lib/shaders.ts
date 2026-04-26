export type ShaderEntry = {
	name: string;
	href: string;
};

export const shaders: ShaderEntry[] = [
	{ name: "Paper Texture", href: "/paper-texture" },
	{ name: "Fluted Glass", href: "/fluted-glass" },
	{ name: "Water", href: "/water" },
	{ name: "Image Dithering", href: "/image-dithering" },
	{ name: "Halftone Dots", href: "/halftone-dots" },
	{ name: "Halftone CMYK", href: "/halftone-cmyk" },
	{ name: "Heatmap", href: "/heatmap" },
	{ name: "Liquid Metal", href: "/liquid-metal" },
	{ name: "Gem Smoke", href: "/gem-smoke" },
	{ name: "Mesh Gradient", href: "/mesh-gradient" },
	{ name: "Static Mesh Gradient", href: "/static-mesh-gradient" },
	{ name: "Static Radial Gradient", href: "/static-radial-gradient" },
	{ name: "Dithering", href: "/dithering" },
	{ name: "Grain Gradient", href: "/grain-gradient" },
	{ name: "Dot Orbit", href: "/dot-orbit" },
	{ name: "Dot Grid", href: "/dot-grid" },
	{ name: "Warp", href: "/warp" },
	{ name: "Spiral", href: "/spiral" },
	{ name: "Swirl", href: "/swirl" },
	{ name: "Waves", href: "/waves" },
	{ name: "Neuro Noise", href: "/neuro-noise" },
	{ name: "Perlin Noise", href: "/perlin-noise" },
	{ name: "Simplex Noise", href: "/simplex-noise" },
	{ name: "Voronoi", href: "/voronoi" },
	{ name: "Pulsing Border", href: "/pulsing-border" },
	{ name: "Metaballs", href: "/metaballs" },
	{ name: "Color Panels", href: "/color-panels" },
	{ name: "Smoke Ring", href: "/smoke-ring" },
	{ name: "God Rays", href: "/god-rays" },
];

export function getShaderNeighbours(pathname: string): {
	prev: ShaderEntry | null;
	next: ShaderEntry | null;
} {
	const index = shaders.findIndex((s) => s.href === pathname);
	if (index === -1) return { prev: null, next: null };
	return {
		prev: index > 0 ? shaders[index - 1] : null,
		next: index < shaders.length - 1 ? shaders[index + 1] : null,
	};
}
