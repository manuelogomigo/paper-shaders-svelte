<script lang="ts">
    import { PaperTexture } from "@devmischief/shaders-svelte";
    import AspectRatio from "$lib/aspectRatio.svelte";

    type Prop = {
        name: string;
        description: string;
        type: string;
        values?: string;
    };

    type Params = {
        image?: string;
        colorBack: string;
        colorFront: string;
        contrast: number;
        roughness: number;
        fiber: number;
        fiberSize: number;
        crumples: number;
        crumpleSize: number;
        folds: number;
        foldCount: number;
        drops: number;
        fade: number;
        seed: number;
        scale: number;
        fit: "cover" | "contain";
    };

    const presets: Record<string, Params> = {
        default: {
            colorBack: "#999180",
            colorFront: "#c7b89e",
            contrast: 0.4,
            roughness: 0.0,
            fiber: 0.35,
            fiberSize: 0.14,
            crumples: 0.7,
            crumpleSize: 0.1,
            folds: 0.0,
            foldCount: 1,
            drops: 0.1,
            fade: 0.0,
            seed: 2,
            scale: 0.6,
            fit: "cover",
        },
        cardboard: {
            colorBack: "#d6b48a",
            colorFront: "#5a3b1c",
            contrast: 0.55,
            roughness: 0.7,
            fiber: 0.6,
            fiberSize: 0.45,
            crumples: 0.15,
            crumpleSize: 0.5,
            folds: 0.2,
            foldCount: 3,
            drops: 0.05,
            fade: 0.1,
            seed: 12.4,
            scale: 0.9,
            fit: "cover",
        },
        abstract: {
            colorBack: "#1a1f2e",
            colorFront: "#e0c896",
            contrast: 0.85,
            roughness: 0.25,
            fiber: 0.1,
            fiberSize: 0.7,
            crumples: 0.7,
            crumpleSize: 0.2,
            folds: 0.9,
            foldCount: 8,
            drops: 0.4,
            fade: 0.3,
            seed: 22.1,
            scale: 1.4,
            fit: "cover",
        },
        details: {
            colorBack: "#fafaf6",
            colorFront: "#1f1f1f",
            contrast: 0.95,
            roughness: 0.35,
            fiber: 0.85,
            fiberSize: 0.08,
            crumples: 0.05,
            crumpleSize: 0.6,
            folds: 0.05,
            foldCount: 2,
            drops: 0.0,
            fade: 0.0,
            seed: 7.3,
            scale: 1.0,
            fit: "cover",
        },
    };

    let params = $state<Params>({ ...presets.default });
    let activePreset = $state<string>("default");
    let fileInputEl: HTMLInputElement | null = $state(null);

    function applyPreset(name: string) {
        Object.assign(params, presets[name]);
        activePreset = name;
    }

    function markCustom() {
        if (activePreset !== "custom") activePreset = "custom";
    }

    function uploadImage(e: Event) {
        const input = e.currentTarget as HTMLInputElement;
        const file = input.files?.[0];
        if (!file) return;
        const url = URL.createObjectURL(file);
        params.image = url;
        markCustom();
    }

    function deleteImage() {
        if (params.image?.startsWith("blob:")) URL.revokeObjectURL(params.image);
        params.image = undefined;
        if (fileInputEl) fileInputEl.value = "";
        markCustom();
    }

    const shaderProps: Prop[] = [
        { name: "image", description: "Source image used as the underlying texture.", type: "string", values: "url" },
        { name: "colorBack", description: "Background paper color.", type: "string", values: "hex / rgb" },
        { name: "colorFront", description: "Foreground / fiber color.", type: "string", values: "hex / rgb" },
        { name: "contrast", description: "Contrast between the paper layers.", type: "number", values: "0 → 1" },
        { name: "roughness", description: "Surface roughness applied to the noise field.", type: "number", values: "0 → 1" },
        { name: "fiber", description: "Strength of the fiber pattern.", type: "number", values: "0 → 1" },
        { name: "fiberSize", description: "Size of individual paper fibers.", type: "number", values: "0 → 1" },
        { name: "crumples", description: "Amount of crumple deformation in the surface.", type: "number", values: "0 → 1" },
        { name: "crumpleSize", description: "Size of crumple folds in the texture.", type: "number", values: "0 → 1" },
        { name: "folds", description: "Strength of the larger paper folds.", type: "number", values: "0 → 1" },
        { name: "foldCount", description: "Number of fold creases across the surface.", type: "number", values: "integer" },
        { name: "drops", description: "Adds water droplet artifacts to the paper.", type: "number", values: "0 → 1" },
        { name: "fade", description: "Fades the texture toward the edges.", type: "number", values: "0 → 1" },
        { name: "fit", description: "How the source image is fit into the canvas.", type: "string", values: "cover · contain" },
    ];

    const commonProps: Prop[] = [
        { name: "scale", description: "Overall zoom level of the graphics.", type: "number", values: "0.01 → 4" },
        { name: "rotation", description: "Overall rotation angle of the graphics.", type: "number", values: "0 → 360" },
        { name: "offsetX", description: "Horizontal offset of the graphics.", type: "number", values: "−1 → 1" },
        { name: "offsetY", description: "Vertical offset of the graphics.", type: "number", values: "−1 → 1" },
        { name: "originX", description: "Reference point for positioning width in the canvas.", type: "number", values: "0 → 1" },
        { name: "originY", description: "Reference point for positioning height in the canvas.", type: "number", values: "0 → 1" },
        { name: "minPixelRatio", description: "Minimum pixel ratio used when rendering the shader (default 2).", type: "number" },
        { name: "maxPixelCount", description: "Maximum pixel count the shader may process.", type: "number" },
    ];

    const codeExample = $derived(`import { PaperTexture } from '@devmischief/shaders-svelte';

<PaperTexture
  width={1280}
  height={720}${params.image ? `\n  image="${params.image}"` : ""}
  colorBack="${params.colorBack}"
  colorFront="${params.colorFront}"
  contrast={${params.contrast}}
  roughness={${params.roughness}}
  fiber={${params.fiber}}
  fiberSize={${params.fiberSize}}
  crumples={${params.crumples}}
  crumpleSize={${params.crumpleSize}}
  folds={${params.folds}}
  foldCount={${params.foldCount}}
  drops={${params.drops}}
  fade={${params.fade}}
  seed={${params.seed}}
  scale={${params.scale}}
  fit="${params.fit}"
/>`);

    const installCmd = "npm i @devmischief/shaders-svelte";

    let copiedInstall = $state(false);
    let copiedCode = $state(false);

    async function copy(text: string, set: (v: boolean) => void) {
        try {
            await navigator.clipboard.writeText(text);
            set(true);
            setTimeout(() => set(false), 1400);
        } catch {
            // clipboard blocked — no-op
        }
    }

    function capitalize(s: string) {
        return s.charAt(0).toUpperCase() + s.slice(1);
    }
</script>

{#snippet sliderRow(
    label: string,
    value: number,
    set: (v: number) => void,
    min: number,
    max: number,
    step: number,
    digits = 2,
)}
    <div class="grid grid-cols-[6.5rem_1fr_3.5rem] items-center gap-3">
        <span class="text-pg-text">{label}</span>
        <input
            type="range"
            {min}
            {max}
            {step}
            {value}
            oninput={(e) => {
                set(+e.currentTarget.value);
                markCustom();
            }}
            class="paper-range h-[2px] w-full cursor-pointer appearance-none bg-pg-border-2"
        />
        <span
            class="rounded-md border border-pg-divider bg-pg-bg px-2 py-1 text-right tabular-nums text-pg-text"
        >
            {value.toFixed(digits)}
        </span>
    </div>
{/snippet}

{#snippet colorRow(
    label: string,
    value: string,
    set: (v: string) => void,
)}
    <div
        class="grid grid-cols-[6.5rem_2rem_1fr] items-center gap-3"
    >
        <span class="text-pg-text">{label}</span>
        <label
            class="relative flex h-7 w-7 cursor-pointer items-center justify-center overflow-hidden rounded-md border border-pg-divider"
            style="background-color: {value};"
        >
            <input
                type="color"
                {value}
                oninput={(e) => {
                    set(e.currentTarget.value);
                    markCustom();
                }}
                class="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                aria-label={label}
            />
        </label>
        <input
            type="text"
            {value}
            oninput={(e) => {
                const v = e.currentTarget.value.trim();
                if (/^#[0-9a-fA-F]{6}$/.test(v)) {
                    set(v);
                    markCustom();
                }
            }}
            class="h-7 rounded-md border border-pg-divider bg-pg-bg px-2 text-pg-text outline-none focus:border-pg-border"
        />
    </div>
{/snippet}

<main class="dark min-h-dvh bg-pg-bg text-pg-text antialiased">
    <div
        class="mx-auto box-content max-w-[1200px] px-5 py-12 sm:px-8 sm:py-16 lg:px-12"
    >
        <header class="mb-16 flex items-center justify-between sm:mb-20">
            <a
                href="/"
                class="group flex items-center gap-2.5 outline-none"
                aria-label="devmischief home"
            >
                <span
                    class="inline-grid size-7 grid-cols-3 grid-rows-3 gap-0.5"
                    aria-hidden="true"
                >
                    {#each Array(9) as _, i}
                        {#if i === 2}
                            <span
                                class="rounded-[1px] bg-pg-text-bright rotate-12 transition-transform duration-500 ease-out group-hover:translate-x-[2px] group-hover:translate-y-[-2px] group-hover:rotate-[-18deg]"
                            ></span>
                        {:else}
                            <span class="rounded-[1px] bg-pg-text-bright"
                            ></span>
                        {/if}
                    {/each}
                </span>
                <span
                    class="text-base font-medium tracking-tight text-pg-text-bright"
                >
                    devmischief
                </span>
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

        <section class="mb-12 flex flex-col gap-5 sm:mb-16">
            <a
                href="/"
                class="inline-flex w-fit items-center gap-1.5 font-mono text-[0.7rem] uppercase tracking-[0.18em] text-pg-text-muted transition-colors hover:text-pg-text-bright"
            >
                <span aria-hidden="true">←</span>
                shaders
            </a>
            <div class="flex flex-wrap items-end justify-between gap-4">
                <h1
                    class="text-4xl font-light tracking-tight text-pg-text-bright sm:text-5xl"
                    style="font-feature-settings: 'ss01';"
                >
                    paper texture
                </h1>
                <p class="max-w-md text-sm text-pg-text-2 sm:text-base">
                    A static texture built from multiple noise layers — usable
                    as a realistic paper or cardboard surface, or as an image
                    filter.
                </p>
            </div>
        </section>

        <section class="mb-16">
            <div
                class="mb-8 flex items-baseline justify-between border-b border-pg-divider pb-4"
            >
                <h2
                    class="text-xs font-medium uppercase tracking-[0.18em] text-pg-text-2"
                >
                    Preview
                </h2>
                <span class="font-mono text-xs text-pg-text-muted">live</span>
            </div>

            <div class="grid gap-6 lg:grid-cols-[1fr_360px]">
                <AspectRatio class="overflow-hidden" ratio={16 / 9}>
                    <PaperTexture
                        width={1280}
                        height={720}
                        image={params.image}
                        colorBack={params.colorBack}
                        colorFront={params.colorFront}
                        contrast={params.contrast}
                        roughness={params.roughness}
                        fiber={params.fiber}
                        fiberSize={params.fiberSize}
                        crumples={params.crumples}
                        crumpleSize={params.crumpleSize}
                        folds={params.folds}
                        foldCount={params.foldCount}
                        drops={params.drops}
                        fade={params.fade}
                        seed={params.seed}
                        scale={params.scale}
                        fit={params.fit}
                    />
                </AspectRatio>

                <aside
                    class="leva-panel flex flex-col overflow-hidden rounded-xl border border-pg-border-2 bg-pg-surface text-[13px]"
                >
                    <!-- Presets -->
                    <div class="px-4 pt-4 pb-3">
                        <div class="mb-2 text-pg-text-2">Presets</div>
                        <div class="grid grid-cols-2 gap-2">
                            {#each Object.keys(presets) as name}
                                {@const isActive = activePreset === name}
                                <button
                                    type="button"
                                    onclick={() => applyPreset(name)}
                                    class="cursor-pointer rounded-md border border-pg-divider bg-pg-surface-2 px-3 py-2 text-pg-text transition-colors hover:border-pg-border hover:bg-pg-btn-hover hover:text-pg-text-bright {isActive
                                        ? 'border-pg-border text-pg-text-bright ring-1 ring-pg-border'
                                        : ''}"
                                >
                                    {capitalize(name)}
                                </button>
                            {/each}
                        </div>
                    </div>

                    <!-- Image actions -->
                    <div
                        class="grid grid-cols-2 gap-2 border-t border-pg-divider/60 px-4 py-3"
                    >
                        <button
                            type="button"
                            onclick={() => fileInputEl?.click()}
                            class="cursor-pointer rounded-md border border-pg-divider bg-pg-surface-2 px-3 py-2 text-pg-text transition-colors hover:border-pg-border hover:bg-pg-btn-hover hover:text-pg-text-bright"
                        >
                            Upload image
                        </button>
                        <button
                            type="button"
                            onclick={deleteImage}
                            disabled={!params.image}
                            class="cursor-pointer rounded-md border border-pg-divider bg-pg-surface-2 px-3 py-2 text-pg-text transition-colors hover:border-pg-border hover:bg-pg-btn-hover hover:text-pg-text-bright disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-pg-divider disabled:hover:bg-pg-surface-2 disabled:hover:text-pg-text"
                        >
                            Delete image
                        </button>
                        <input
                            bind:this={fileInputEl}
                            type="file"
                            accept="image/*"
                            onchange={uploadImage}
                            class="hidden"
                        />
                    </div>

                    <!-- Controls -->
                    <div
                        class="flex flex-col gap-2 border-t border-pg-divider/60 px-4 py-4"
                    >
                        {@render colorRow(
                            "colorBack",
                            params.colorBack,
                            (v) => (params.colorBack = v),
                        )}
                        {@render colorRow(
                            "colorFront",
                            params.colorFront,
                            (v) => (params.colorFront = v),
                        )}
                        {@render sliderRow(
                            "contrast",
                            params.contrast,
                            (v) => (params.contrast = v),
                            0,
                            1,
                            0.01,
                        )}
                        {@render sliderRow(
                            "roughness",
                            params.roughness,
                            (v) => (params.roughness = v),
                            0,
                            1,
                            0.01,
                        )}
                        {@render sliderRow(
                            "fiber",
                            params.fiber,
                            (v) => (params.fiber = v),
                            0,
                            1,
                            0.01,
                        )}
                        {@render sliderRow(
                            "fiberSize",
                            params.fiberSize,
                            (v) => (params.fiberSize = v),
                            0,
                            1,
                            0.01,
                        )}
                        {@render sliderRow(
                            "crumples",
                            params.crumples,
                            (v) => (params.crumples = v),
                            0,
                            1,
                            0.01,
                        )}
                        {@render sliderRow(
                            "crumpleSize",
                            params.crumpleSize,
                            (v) => (params.crumpleSize = v),
                            0,
                            1,
                            0.01,
                        )}
                        {@render sliderRow(
                            "folds",
                            params.folds,
                            (v) => (params.folds = v),
                            0,
                            1,
                            0.01,
                        )}
                        {@render sliderRow(
                            "foldCount",
                            params.foldCount,
                            (v) => (params.foldCount = v),
                            0,
                            12,
                            1,
                            0,
                        )}
                        {@render sliderRow(
                            "fade",
                            params.fade,
                            (v) => (params.fade = v),
                            0,
                            1,
                            0.01,
                        )}
                        {@render sliderRow(
                            "drops",
                            params.drops,
                            (v) => (params.drops = v),
                            0,
                            1,
                            0.01,
                        )}
                        {@render sliderRow(
                            "seed",
                            params.seed,
                            (v) => (params.seed = v),
                            0,
                            50,
                            0.1,
                            1,
                        )}
                        {@render sliderRow(
                            "scale",
                            params.scale,
                            (v) => (params.scale = v),
                            0.1,
                            2,
                            0.01,
                        )}

                        <div
                            class="grid grid-cols-[6.5rem_1fr] items-center gap-3"
                        >
                            <span class="text-pg-text">fit</span>
                            <div class="relative">
                                <select
                                    bind:value={params.fit}
                                    onchange={markCustom}
                                    class="paper-select h-8 w-full cursor-pointer appearance-none rounded-md border border-pg-divider bg-pg-bg px-2 pr-7 text-pg-text outline-none focus:border-pg-border"
                                >
                                    <option value="cover">cover</option>
                                    <option value="contain">contain</option>
                                </select>
                                <span
                                    class="pointer-events-none absolute top-1/2 right-2 -translate-y-1/2 text-pg-text-muted"
                                    aria-hidden="true"
                                >
                                    ▾
                                </span>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>
        </section>

        <section class="mb-16">
            <div
                class="mb-8 flex items-baseline justify-between border-b border-pg-divider pb-4"
            >
                <h2
                    class="text-xs font-medium uppercase tracking-[0.18em] text-pg-text-2"
                >
                    Install
                </h2>
                <span class="font-mono text-xs text-pg-text-muted">npm</span>
            </div>
            <div
                class="flex h-11 items-center overflow-hidden rounded-lg border border-pg-border-2 bg-pg-surface font-mono text-sm"
            >
                <code class="flex h-full flex-1 items-center px-4 text-pg-text">
                    {installCmd}
                </code>
                <div class="h-full w-px shrink-0 bg-pg-divider"></div>
                <button
                    type="button"
                    aria-label="Copy install command"
                    onclick={() => copy(installCmd, (v) => (copiedInstall = v))}
                    class="flex h-full w-11 shrink-0 cursor-pointer items-center justify-center text-pg-text-2 transition-colors hover:bg-pg-btn-hover hover:text-pg-text-bright focus-visible:bg-pg-btn-hover focus-visible:outline-none"
                >
                    {#if copiedInstall}
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

        <section class="mb-16">
            <div
                class="mb-8 flex items-baseline justify-between border-b border-pg-divider pb-4"
            >
                <h2
                    class="text-xs font-medium uppercase tracking-[0.18em] text-pg-text-2"
                >
                    Code
                </h2>
                <button
                    type="button"
                    aria-label="Copy code example"
                    onclick={() => copy(codeExample, (v) => (copiedCode = v))}
                    class="flex cursor-pointer items-center gap-1.5 font-mono text-xs text-pg-text-muted transition-colors hover:text-pg-text-bright"
                >
                    {copiedCode ? "copied" : "copy"}
                </button>
            </div>
            <pre
                class="overflow-x-auto rounded-lg border border-pg-border-2 bg-pg-surface p-5 font-mono text-[0.8rem] leading-relaxed text-pg-text"><code
                    >{codeExample}</code
                ></pre>
        </section>

        <section class="mb-16">
            <div
                class="mb-8 flex items-baseline justify-between border-b border-pg-divider pb-4"
            >
                <h2
                    class="text-xs font-medium uppercase tracking-[0.18em] text-pg-text-2"
                >
                    Shader Props
                </h2>
                <span class="font-mono text-xs text-pg-text-muted">
                    {shaderProps.length}
                </span>
            </div>
            <div
                class="overflow-x-auto rounded-lg border border-pg-border-2 bg-pg-surface"
            >
                <table class="w-full text-sm">
                    <thead>
                        <tr class="border-b border-pg-divider text-left">
                            <th
                                class="px-4 py-3 font-mono text-[0.7rem] font-medium uppercase tracking-[0.14em] text-pg-text-2"
                                >name</th
                            >
                            <th
                                class="px-4 py-3 font-mono text-[0.7rem] font-medium uppercase tracking-[0.14em] text-pg-text-2"
                                >description</th
                            >
                            <th
                                class="px-4 py-3 font-mono text-[0.7rem] font-medium uppercase tracking-[0.14em] text-pg-text-2"
                                >type</th
                            >
                            <th
                                class="px-4 py-3 font-mono text-[0.7rem] font-medium uppercase tracking-[0.14em] text-pg-text-2"
                                >values</th
                            >
                        </tr>
                    </thead>
                    <tbody>
                        {#each shaderProps as prop}
                            <tr
                                class="border-b border-pg-divider/60 last:border-0"
                            >
                                <td
                                    class="px-4 py-3 align-top font-mono text-pg-text-bright"
                                    >{prop.name}</td
                                >
                                <td class="px-4 py-3 align-top text-pg-text"
                                    >{prop.description}</td
                                >
                                <td
                                    class="px-4 py-3 align-top font-mono text-xs text-pg-text-muted"
                                    >{prop.type}</td
                                >
                                <td
                                    class="px-4 py-3 align-top font-mono text-xs text-pg-text-muted"
                                >
                                    {prop.values ?? "—"}
                                </td>
                            </tr>
                        {/each}
                    </tbody>
                </table>
            </div>
        </section>

        <section class="mb-16">
            <div
                class="mb-8 flex items-baseline justify-between border-b border-pg-divider pb-4"
            >
                <h2
                    class="text-xs font-medium uppercase tracking-[0.18em] text-pg-text-2"
                >
                    Common Props
                </h2>
                <span class="font-mono text-xs text-pg-text-muted">
                    {commonProps.length}
                </span>
            </div>
            <div
                class="overflow-x-auto rounded-lg border border-pg-border-2 bg-pg-surface"
            >
                <table class="w-full text-sm">
                    <thead>
                        <tr class="border-b border-pg-divider text-left">
                            <th
                                class="px-4 py-3 font-mono text-[0.7rem] font-medium uppercase tracking-[0.14em] text-pg-text-2"
                                >name</th
                            >
                            <th
                                class="px-4 py-3 font-mono text-[0.7rem] font-medium uppercase tracking-[0.14em] text-pg-text-2"
                                >description</th
                            >
                            <th
                                class="px-4 py-3 font-mono text-[0.7rem] font-medium uppercase tracking-[0.14em] text-pg-text-2"
                                >type</th
                            >
                            <th
                                class="px-4 py-3 font-mono text-[0.7rem] font-medium uppercase tracking-[0.14em] text-pg-text-2"
                                >values</th
                            >
                        </tr>
                    </thead>
                    <tbody>
                        {#each commonProps as prop}
                            <tr
                                class="border-b border-pg-divider/60 last:border-0"
                            >
                                <td
                                    class="px-4 py-3 align-top font-mono text-pg-text-bright"
                                    >{prop.name}</td
                                >
                                <td class="px-4 py-3 align-top text-pg-text"
                                    >{prop.description}</td
                                >
                                <td
                                    class="px-4 py-3 align-top font-mono text-xs text-pg-text-muted"
                                    >{prop.type}</td
                                >
                                <td
                                    class="px-4 py-3 align-top font-mono text-xs text-pg-text-muted"
                                >
                                    {prop.values ?? "—"}
                                </td>
                            </tr>
                        {/each}
                    </tbody>
                </table>
            </div>
        </section>

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

    .leva-panel,
    .leva-panel * {
        font-family:
            ui-monospace, "SF Mono", Menlo, Consolas, "Liberation Mono",
            monospace;
    }

    .paper-range::-webkit-slider-runnable-track {
        height: 2px;
        background: var(--pg-border-2, #424242);
        border-radius: 9999px;
    }
    .paper-range::-moz-range-track {
        height: 2px;
        background: var(--pg-border-2, #424242);
        border-radius: 9999px;
    }
    .paper-range::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 12px;
        height: 12px;
        margin-top: -5px;
        border-radius: 3px;
        background: var(--pg-text-2, #919191);
        border: none;
        cursor: pointer;
        transition:
            background 0.12s ease,
            transform 0.12s ease;
    }
    .paper-range:hover::-webkit-slider-thumb,
    .paper-range:focus::-webkit-slider-thumb {
        background: var(--pg-text-bright, #f0f0f0);
    }
    .paper-range::-moz-range-thumb {
        width: 12px;
        height: 12px;
        border-radius: 3px;
        background: var(--pg-text-2, #919191);
        border: none;
        cursor: pointer;
    }

    .paper-select {
        background-image: none;
    }
</style>
