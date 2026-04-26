<script lang="ts">
    import { PaperTexture } from "@devmischief/shaders-svelte";
    import AspectRatio from "$lib/aspectRatio.svelte";
    import {
        PlaygroundShell,
        PlaygroundSlider,
        PlaygroundColor,
        PlaygroundSelect,
        PlaygroundPresets,
        PlaygroundImageActions,
        type Prop,
    } from "$lib/playground";

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
            colorBack: "#ffffff",
            colorFront: "#9fadbc",
            contrast: 0.3,
            roughness: 0.4,
            fiber: 0.3,
            fiberSize: 0.2,
            crumples: 0.3,
            crumpleSize: 0.35,
            folds: 0.65,
            foldCount: 5,
            fade: 0.0,
            drops: 0.2,
            seed: 6,
            scale: 0.6,
            fit: "cover",
        },
        cardboard: {
            colorBack: "#999180",
            colorFront: "#c7b89e",
            contrast: 0.4,
            roughness: 0,
            fiber: 0.35,
            fiberSize: 0.14,
            crumples: 0.7,
            crumpleSize: 0.1,
            folds: 0,
            foldCount: 1,
            fade: 0,
            drops: 0.1,
            seed: 1.6,
            scale: 0.6,
            fit: "cover",
        },
        abstract: {
            colorFront: "#00eeff",
            colorBack: "#ff0a81",
            contrast: 0.85,
            roughness: 0,
            fiber: 0.1,
            fiberSize: 0.2,
            crumples: 0,
            crumpleSize: 0.3,
            folds: 1,
            foldCount: 3,
            fade: 0,
            drops: 0.2,
            seed: 2.2,
            scale: 0.6,
            fit: "cover",
        },
        details: {
            colorBack: "#00000000",
            colorFront: "#00000000",
            contrast: 0,
            roughness: 1,
            fiber: 0.27,
            fiberSize: 0.22,
            crumples: 1,
            crumpleSize: 0.5,
            folds: 1,
            foldCount: 15,
            fade: 0,
            drops: 0,
            seed: 6,
            scale: 3.0,
            fit: "cover",
        },
    };

    let params = $state<Params>({ ...presets.default });
    let activePreset = $state<string>("default");

    function applyPreset(name: string) {
        Object.assign(params, presets[name]);
        activePreset = name;
    }

    function markCustom() {
        if (activePreset !== "custom") activePreset = "custom";
    }

    function randomImage() {
        const n = Math.floor(Math.random() * 16) + 1;
        const filename = n < 10 ? `00${n}.webp` : `00${n}.webp`;
        params.image = `/assets/image-filters/${filename}`;
        markCustom();
    }

    const shaderProps: Prop[] = [
        {
            name: "image",
            description: "Source image used as the underlying texture.",
            type: "string",
            values: "url",
        },
        {
            name: "colorBack",
            description: "Background paper color.",
            type: "string",
            values: "hex / rgb",
        },
        {
            name: "colorFront",
            description: "Foreground / fiber color.",
            type: "string",
            values: "hex / rgb",
        },
        {
            name: "contrast",
            description: "Contrast between the paper layers.",
            type: "number",
            values: "0 → 1",
        },
        {
            name: "roughness",
            description: "Surface roughness applied to the noise field.",
            type: "number",
            values: "0 → 1",
        },
        {
            name: "fiber",
            description: "Strength of the fiber pattern.",
            type: "number",
            values: "0 → 1",
        },
        {
            name: "fiberSize",
            description: "Size of individual paper fibers.",
            type: "number",
            values: "0 → 1",
        },
        {
            name: "crumples",
            description: "Amount of crumple deformation in the surface.",
            type: "number",
            values: "0 → 1",
        },
        {
            name: "crumpleSize",
            description: "Size of crumple folds in the texture.",
            type: "number",
            values: "0 → 1",
        },
        {
            name: "folds",
            description: "Strength of the larger paper folds.",
            type: "number",
            values: "0 → 1",
        },
        {
            name: "foldCount",
            description: "Number of fold creases across the surface.",
            type: "number",
            values: "integer",
        },
        {
            name: "drops",
            description: "Adds water droplet artifacts to the paper.",
            type: "number",
            values: "0 → 1",
        },
        {
            name: "fade",
            description: "Fades the texture toward the edges.",
            type: "number",
            values: "0 → 1",
        },
        {
            name: "fit",
            description: "How the source image is fit into the canvas.",
            type: "string",
            values: "cover · contain",
        },
    ];

    const commonProps: Prop[] = [
        {
            name: "scale",
            description: "Overall zoom level of the graphics.",
            type: "number",
            values: "0.01 → 4",
        },
        {
            name: "rotation",
            description: "Overall rotation angle of the graphics.",
            type: "number",
            values: "0 → 360",
        },
        {
            name: "offsetX",
            description: "Horizontal offset of the graphics.",
            type: "number",
            values: "−1 → 1",
        },
        {
            name: "offsetY",
            description: "Vertical offset of the graphics.",
            type: "number",
            values: "−1 → 1",
        },
        {
            name: "originX",
            description: "Reference point for positioning width in the canvas.",
            type: "number",
            values: "0 → 1",
        },
        {
            name: "originY",
            description:
                "Reference point for positioning height in the canvas.",
            type: "number",
            values: "0 → 1",
        },
        {
            name: "minPixelRatio",
            description:
                "Minimum pixel ratio used when rendering the shader (default 2).",
            type: "number",
        },
        {
            name: "maxPixelCount",
            description: "Maximum pixel count the shader may process.",
            type: "number",
        },
    ];

    const code =
        $derived(`import { PaperTexture } from '@devmischief/shaders-svelte';

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
</script>

<PlaygroundShell
    title="paper texture"
    description="A static texture built from multiple noise layers — usable as a realistic paper or cardboard surface, or as an image filter."
    {code}
    {shaderProps}
    {commonProps}
>
    {#snippet preview()}
        <div
            onclick={randomImage}
            role="button"
            tabindex="0"
            onkeydown={(e) => {
                if (e.key === "Enter" || e.key === " ") randomImage();
            }}
            class="flex min-w-0 flex-1 cursor-pointer flex-col items-center justify-center"
        >
            <AspectRatio
                ratio={16 / 12}
                class="pointer-events-none w-full overflow-hidden rounded-xl border border-pg-border-2 bg-pg-surface"
            >
                <div class="flex h-full w-full overflow-hidden">
                    <PaperTexture
                        width={1920}
                        height={1080}
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
                </div>
            </AspectRatio>
            <span
                class="pointer-events-none mx-auto py-4 text-center text-sm text-pg-text-muted select-none"
            >
                Click the preview to load a random sample image.
            </span>
        </div>
    {/snippet}

    {#snippet controls()}
        <PlaygroundPresets
            names={Object.keys(presets)}
            active={activePreset}
            onApply={applyPreset}
        />

        <PlaygroundImageActions
            image={params.image}
            onUpload={(url) => {
                params.image = url;
                markCustom();
            }}
            onDelete={() => {
                params.image = undefined;
                markCustom();
            }}
            onRandom={randomImage}
        />

        <div
            class="flex flex-col gap-2 border-t border-pg-divider/60 px-4 py-4"
        >
            <PlaygroundColor
                label="colorBack"
                bind:value={params.colorBack}
                onChange={markCustom}
            />
            <PlaygroundColor
                label="colorFront"
                bind:value={params.colorFront}
                onChange={markCustom}
            />
            <PlaygroundSlider
                label="contrast"
                bind:value={params.contrast}
                min={0}
                max={1}
                step={0.01}
                onChange={markCustom}
            />
            <PlaygroundSlider
                label="roughness"
                bind:value={params.roughness}
                min={0}
                max={1}
                step={0.01}
                onChange={markCustom}
            />
            <PlaygroundSlider
                label="fiber"
                bind:value={params.fiber}
                min={0}
                max={1}
                step={0.01}
                onChange={markCustom}
            />
            <PlaygroundSlider
                label="fiberSize"
                bind:value={params.fiberSize}
                min={0}
                max={1}
                step={0.01}
                onChange={markCustom}
            />
            <PlaygroundSlider
                label="crumples"
                bind:value={params.crumples}
                min={0}
                max={1}
                step={0.01}
                onChange={markCustom}
            />
            <PlaygroundSlider
                label="crumpleSize"
                bind:value={params.crumpleSize}
                min={0}
                max={1}
                step={0.01}
                onChange={markCustom}
            />
            <PlaygroundSlider
                label="folds"
                bind:value={params.folds}
                min={0}
                max={1}
                step={0.01}
                onChange={markCustom}
            />
            <PlaygroundSlider
                label="foldCount"
                bind:value={params.foldCount}
                min={0}
                max={12}
                step={1}
                onChange={markCustom}
            />
            <PlaygroundSlider
                label="fade"
                bind:value={params.fade}
                min={0}
                max={1}
                step={0.01}
                onChange={markCustom}
            />
            <PlaygroundSlider
                label="drops"
                bind:value={params.drops}
                min={0}
                max={1}
                step={0.01}
                onChange={markCustom}
            />
            <PlaygroundSlider
                label="seed"
                bind:value={params.seed}
                min={0}
                max={50}
                step={0.1}
                onChange={markCustom}
            />
            <PlaygroundSlider
                label="scale"
                bind:value={params.scale}
                min={0.1}
                max={2}
                step={0.01}
                onChange={markCustom}
            />
            <PlaygroundSelect
                label="fit"
                bind:value={params.fit}
                options={["cover", "contain"]}
                onChange={markCustom}
            />
        </div>
    {/snippet}
</PlaygroundShell>
