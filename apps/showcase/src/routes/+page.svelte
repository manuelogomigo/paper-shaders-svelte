<script lang="ts">
    import { onMount } from "svelte";
    import type { Component } from "svelte";
    import LazyShader from "$lib/LazyShader.svelte";
    import DevMischiefMark from "$lib/DevMischiefMark.svelte";
    import {
        preloadGemSmoke,
        preloadHeatmap,
        preloadLiquidMetal,
        ColorPanels,
        Dithering,
        DotGrid,
        DotOrbit,
        FlutedGlass,
        GemSmoke,
        GodRays,
        GrainGradient,
        HalftoneCMYK,
        HalftoneDots,
        Heatmap,
        ImageDithering,
        LiquidMetal,
        MeshGradient,
        Metaballs,
        NeuroNoise,
        PaperTexture,
        PerlinNoise,
        PulsingBorder,
        SimplexNoise,
        SmokeRing,
        Spiral,
        StaticMeshGradient,
        StaticRadialGradient,
        Swirl,
        Voronoi,
        Warp,
        Water,
        Waves,
    } from "@devmischief/shaders-svelte";
    import AspectRatio from "$lib/aspectRatio.svelte";

    type ReadyShader = {
        name: string;
        href: string;
        image?: string;
        component: Component<{
            width: number | string;
            height: number | string;
        }>;
        status: "ready";
    };

    type ComingSoonShader = {
        name: string;
        status: "coming-soon";
    };

    type ShaderCard = ReadyShader | ComingSoonShader;

    const imageFilters: ShaderCard[] = [
        {
            name: "Paper Texture",
            href: "/paper-texture",
            image: "/assets/paper-texture.png",
            component: PaperTexture,
            status: "ready",
        },
        {
            name: "Fluted Glass",
            href: "/fluted-glass",
            component: FlutedGlass,
            image: "/assets/fluted-glass.png",
            status: "ready",
        },
        {
            name: "Water",
            href: "/water",
            component: Water,
            image: "/assets/water.png",
            status: "ready",
        },
        {
            name: "Image Dithering",
            href: "/image-dithering",
            component: ImageDithering,
            image: "/assets/image-dithering.png",
            status: "ready",
        },
        {
            name: "Halftone Dots",
            href: "/halftone-dots",
            component: HalftoneDots,
            image: "/assets/halftone-dots.png",
            status: "ready",
        },
        {
            name: "Halftone CMYK",
            href: "/halftone-cmyk",
            component: HalftoneCMYK,
            image: "/assets/halftone-cmyk.png",
            status: "ready",
        },
    ];

    const logoAnimations: ShaderCard[] = [
        {
            name: "Heatmap",
            href: "/heatmap",
            component: Heatmap,
            image: "/assets/heatmap.png",
            status: "ready",
        },
        {
            name: "Liquid Metal",
            href: "/liquid-metal",
            component: LiquidMetal,
            image: "/assets/liquid-metal.png",
            status: "ready",
        },
        {
            name: "Gem Smoke",
            href: "/gem-smoke",
            component: GemSmoke,
            image: "/assets/gem-smoke.png",
            status: "ready",
        },
    ];

    const effects: ShaderCard[] = [
        {
            name: "Mesh Gradient",
            href: "/mesh-gradient",
            component: MeshGradient,
            image: "/assets/mesh-gradient.png",
            status: "ready",
        },
        {
            name: "Static Mesh Gradient",
            href: "/static-mesh-gradient",
            component: StaticMeshGradient,
            image: "/assets/static-mesh-gradient.png",
            status: "ready",
        },
        {
            name: "Static Radial Gradient",
            href: "/static-radial-gradient",
            component: StaticRadialGradient,
            image: "/assets/static-radial-gradient.png",
            status: "ready",
        },
        {
            name: "Dithering",
            href: "/dithering",
            component: Dithering,
            image: "/assets/dithering.png",
            status: "ready",
        },
        {
            name: "Grain Gradient",
            href: "/grain-gradient",
            component: GrainGradient,
            image: "/assets/grain-gradient.png",
            status: "ready",
        },
        {
            name: "Dot Orbit",
            href: "/dot-orbit",
            component: DotOrbit,
            image: "/assets/dot-orbit.png",
            status: "ready",
        },
        {
            name: "Dot Grid",
            href: "/dot-grid",
            component: DotGrid,
            status: "ready",
            image: "/assets/dot-grid.png",
        },
        {
            name: "Warp",
            href: "/warp",
            component: Warp,
            status: "ready",
            image: "/assets/warp.png",
        },
        {
            name: "Spiral",
            href: "/spiral",
            component: Spiral,
            status: "ready",
            image: "/assets/spiral.png",
        },
        {
            name: "Swirl",
            href: "/swirl",
            component: Swirl,
            status: "ready",
            image: "/assets/swirl.png",
        },
        {
            name: "Waves",
            href: "/waves",
            component: Waves,
            status: "ready",
            image: "/assets/waves.png",
        },
        {
            name: "Neuro Noise",
            href: "/neuro-noise",
            component: NeuroNoise,
            image: "/assets/neuro-noise.png",
            status: "ready",
        },
        {
            name: "Perlin Noise",
            href: "/perlin-noise",
            component: PerlinNoise,
            image: "/assets/perlin-noise.png",
            status: "ready",
        },
        {
            name: "Simplex Noise",
            href: "/simplex-noise",
            component: SimplexNoise,
            image: "/assets/simplex-noise.png",
            status: "ready",
        },
        {
            name: "Voronoi",
            href: "/voronoi",
            component: Voronoi,
            image: "/assets/voronoi.png",
            status: "ready",
        },
        {
            name: "Pulsing Border",
            href: "/pulsing-border",
            component: PulsingBorder,
            image: "/assets/pulsing-border.png",
            status: "ready",
        },
        {
            name: "Metaballs",
            href: "/metaballs",
            component: Metaballs,
            image: "/assets/metaballs.png",
            status: "ready",
        },
        {
            name: "Color Panels",
            href: "/color-panels",
            component: ColorPanels,
            image: "/assets/color-panels.png",
            status: "ready",
        },
        {
            name: "Smoke Ring",
            href: "/smoke-ring",
            component: SmokeRing,
            image: "/assets/smoke-ring.png",
            status: "ready",
        },
        {
            name: "God Rays",
            href: "/god-rays",
            component: GodRays,
            image: "/assets/god-rays.png",
            status: "ready",
        },
    ];

    const sections: { title: string; items: ShaderCard[] }[] = [
        { title: "Image Filters", items: imageFilters },
        { title: "Logo Animations", items: logoAnimations },
        { title: "Effects", items: effects },
    ];

    let copied = $state(false);
    const installCmd = "npm i @devmischief/shaders-svelte";

    // Pre-warm the expensive image-processing caches for Heatmap and Liquid Metal
    // during idle time so the first hover on those cards is instant.
    onMount(() => {
        const defaultLogo =
            "https://shaders.paper.design/images/logos/diamond.svg";
        const schedule =
            typeof window.requestIdleCallback === "function"
                ? (cb: () => void) =>
                      window.requestIdleCallback(cb, { timeout: 1500 })
                : (cb: () => void) => window.setTimeout(cb, 0);
        schedule(() => {
            void preloadHeatmap(defaultLogo).catch(() => {});
            void preloadLiquidMetal(defaultLogo).catch(() => {});
            void preloadGemSmoke(defaultLogo).catch(() => {});
        });
    });

    async function copyInstall() {
        try {
            await navigator.clipboard.writeText(installCmd);
            copied = true;
            setTimeout(() => (copied = false), 1400);
        } catch {
            // clipboard blocked — no-op
        }
    }
</script>

<main class="dark min-h-dvh bg-pg-bg text-pg-text antialiased">
    <div
        class="mx-auto box-content max-w-[1200px] px-5 py-12 sm:px-8 sm:py-16 lg:px-12"
    >
        <header class="mb-20 flex items-center justify-between sm:mb-24">
            <a
                href="/"
                class="group flex items-center outline-none"
                aria-label="devmischief home"
            >
                <DevMischiefMark
                    class="dm-header-mark h-9 w-auto text-pg-text-bright"
                />
            </a>
            <nav class="flex items-center gap-6 text-sm text-pg-text-nav">
                <a
                    href="/"
                    class="transition-colors hover:text-pg-text-nav-hover"
                >
                    shaders
                </a>
                <a
                    href="https://devmischief.com"
                    class="transition-colors hover:text-pg-text-nav-hover"
                >
                    hq
                </a>
            </nav>
        </header>

        <section class="mb-20 flex flex-col items-center text-center sm:mb-28">
            <span
                class="mb-4 inline-flex items-center gap-2 rounded-full border border-pg-divider bg-pg-surface px-3 py-1 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-pg-text-2"
            >
                <span class="size-1.5 rounded-full bg-emerald-400/80"></span>
                v0 · in mischief
            </span>
            <h1
                class="max-w-3xl text-4xl font-light tracking-tight text-pg-text-bright sm:text-5xl lg:text-6xl"
                style="font-feature-settings: 'ss01'; word-spacing: 0.08em;"
            >
                shaders for svelte
            </h1>
            <p class="mt-5 max-w-md text-base text-pg-text-2 sm:text-lg">
                Ultra-fast, zero-dependency shaders for your Svelte projects —
                built on <a
                    target="_blank"
                    href="https://www.npmjs.com/package/@paper-design/shaders"
                    class="transition-colors hover:text-pg-text-bright hover:underline"
                    >@paper-design/shaders</a
                >.
            </p>

            <div
                class="mt-8 flex h-11 items-center overflow-hidden rounded-lg border border-pg-border-2 bg-pg-surface font-mono text-sm"
            >
                <code class="flex h-full items-center px-4 text-pg-text">
                    {installCmd}
                </code>
                <div class="h-full w-px shrink-0 bg-pg-divider"></div>
                <button
                    type="button"
                    aria-label="Copy install command"
                    onclick={copyInstall}
                    class="flex h-full w-11 shrink-0 cursor-pointer items-center justify-center text-pg-text-2 transition-colors hover:bg-pg-btn-hover hover:text-pg-text-bright focus-visible:bg-pg-btn-hover focus-visible:outline-none"
                >
                    {#if copied}
                        <svg
                            width="14"
                            height="14"
                            viewBox="0 0 16 16"
                            fill="none"
                        >
                            <path
                                d="M2.5 8.5L6.5 12.5L13.5 3.5"
                                stroke="currentColor"
                                stroke-width="1.75"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            />
                        </svg>
                    {:else}
                        <svg
                            width="14"
                            height="14"
                            viewBox="0 0 16 16"
                            fill="currentColor"
                        >
                            <path
                                d="M11 4V2C11 1.48 10.61 1.06 10.1 1H2C1.48 1 1.06 1.39 1 1.9V10C1 10.55 1.45 11 2 11H4V6C4 4.9 4.9 4 6 4H11ZM6 5C5.48 5 5.06 5.39 5 5.9V14C5 14.55 5.45 15 6 15H14C14.55 15 15 14.55 15 14V6C15 5.48 14.61 5.06 14.1 5H6Z"
                            />
                        </svg>
                    {/if}
                </button>
            </div>
        </section>

        <div class="flex flex-col gap-20 pb-24">
            {#each sections as section}
                <section>
                    <div
                        class="mb-8 flex items-baseline justify-between border-b border-pg-divider pb-4"
                    >
                        <h2
                            class="text-xs font-medium uppercase tracking-[0.18em] text-pg-text-2"
                        >
                            {section.title}
                        </h2>
                        <span class="font-mono text-xs text-pg-text-muted">
                            {section.items.filter((s) => s.status === "ready")
                                .length}
                            / {section.items.length}
                        </span>
                    </div>
                    <div
                        class="grid grid-cols-1 gap-5 sm:grid-cols-2 md:gap-6 lg:grid-cols-3 2xl:grid-cols-4"
                    >
                        {#each section.items as shader}
                            {#if shader.status === "ready"}
                                {@const ShaderPreview = shader.component}
                                <a
                                    class="group flex flex-col gap-3 outline-none"
                                    href={shader.href}
                                >
                                    <AspectRatio
                                        class="overflow-hidden"
                                        ratio={3 / 3}
                                    >
                                        {#if shader.image}
                                            <LazyShader
                                                component={ShaderPreview}
                                                image={shader.image}
                                                alt={shader.name}
                                                width={480}
                                                height={480}
                                            />
                                        {:else}
                                            <ShaderPreview
                                                width={480}
                                                height={480}
                                            />
                                        {/if}
                                    </AspectRatio>
                                    <!-- <div
                                        class="relative flex aspect-3/3 items-center justify-center overflow-hidden rounded-xl border border-pg-divider bg-pg-surface transition-all duration-200 group-hover:-translate-y-0.5 group-hover:border-pg-border group-hover:shadow-[0_12px_32px_rgba(0,0,0,0.5)] group-focus-visible:border-pg-text-bright"
                                    >
                                        {#if shader.image}
                                            <LazyShader
                                                component={ShaderPreview}
                                                image={shader.image}
                                                alt={shader.name}
                                                width={480}
                                                height={480}
                                            />
                                        {:else}
                                            <ShaderPreview
                                                width={480}
                                                height={480}
                                            />
                                        {/if}
                                    </div> -->
                                    <div
                                        class="flex items-center justify-between"
                                    >
                                        <span
                                            class="text-sm text-pg-text transition-colors group-hover:text-pg-text-bright"
                                        >
                                            {shader.name.toLowerCase()}
                                        </span>
                                        <span
                                            class="text-xs text-pg-text-muted opacity-0 transition-opacity group-hover:opacity-100"
                                            aria-hidden="true"
                                        >
                                            →
                                        </span>
                                    </div>
                                </a>
                            {:else}
                                <div
                                    class="flex flex-col gap-3"
                                    aria-disabled="true"
                                >
                                    <div
                                        class="coming-soon-tile relative flex aspect-3/3 items-center justify-center overflow-hidden rounded-xl border border-dashed border-pg-border-2 bg-pg-surface/40"
                                    >
                                        <span
                                            class="relative rounded-full border border-pg-border-2 bg-pg-bg/80 px-3 py-1 font-mono text-[0.65rem] uppercase tracking-[0.14em] text-pg-text-2 backdrop-blur-sm"
                                        >
                                            Coming Soon
                                        </span>
                                    </div>
                                    <div class="flex items-center gap-2">
                                        <span
                                            class="text-sm text-pg-text-muted"
                                        >
                                            {shader.name.toLowerCase()}
                                        </span>
                                    </div>
                                </div>
                            {/if}
                        {/each}
                    </div>
                </section>
            {/each}
        </div>

        <footer
            class="flex flex-col items-center gap-1 border-t border-pg-divider pt-10 pb-4 text-center text-sm text-pg-text-muted"
        >
            <p>
                built with mischief by
                <a
                    href="https://devmischief.com"
                    class="text-pg-text transition-colors hover:text-pg-text-bright"
                >
                    devmischief
                </a>
            </p>
            <p class="font-mono text-xs">@devmischief/shaders-svelte</p>
        </footer>
    </div>
</main>

<style>
    :global(body) {
        margin: 0;
        background: var(--pg-bg);
    }

    .coming-soon-tile::before {
        content: "";
        position: absolute;
        inset: 0;
        background-image: radial-gradient(
            circle at 1px 1px,
            var(--pg-border) 1px,
            transparent 0
        );
        background-size: 14px 14px;
        opacity: 0.35;
        mask-image: radial-gradient(
            ellipse at center,
            #000 40%,
            transparent 75%
        );
    }
</style>
