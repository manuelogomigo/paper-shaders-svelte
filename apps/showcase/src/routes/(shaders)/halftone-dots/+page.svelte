<script lang="ts">
    import { HalftoneDots } from "@devmischief/shaders-svelte";
    import AspectRatio from "$lib/aspectRatio.svelte";
    import {
        PlaygroundShell,
        PlaygroundSlider,
        PlaygroundColor,
        PlaygroundSelect,
        PlaygroundToggle,
        PlaygroundPresets,
        PlaygroundImageActions,
        type Prop,
    } from "$lib/playground";

    type DotsType = "classic" | "gooey" | "holes" | "soft";
    type GridType = "square" | "hex";
    type Fit = "cover" | "contain";

    type Params = {
        image?: string;
        colorBack: string;
        colorFront: string;
        originalColors: boolean;
        inverted: boolean;
        type: DotsType;
        grid: GridType;
        size: number;
        radius: number;
        contrast: number;
        grainMixer: number;
        grainOverlay: number;
        grainSize: number;
        scale: number;
        rotation: number;
        offsetX: number;
        offsetY: number;
        fit: Fit;
    };

    const dotsTypes = ["classic", "gooey", "holes", "soft"] as const;
    const gridTypes = ["square", "hex"] as const;

    const presets: Record<string, Params> = {
        default: {
            colorBack: "#f2f1e8",
            colorFront: "#2b2b2b",
            originalColors: false,
            inverted: false,
            type: "gooey",
            grid: "hex",
            size: 0.5,
            radius: 1.25,
            contrast: 0.4,
            grainMixer: 0.2,
            grainOverlay: 0.2,
            grainSize: 0.5,
            scale: 1,
            rotation: 0,
            offsetX: 0,
            offsetY: 0,
            fit: "cover",
        },
        led_screen: {
            colorBack: "#000000",
            colorFront: "#29ff7b",
            originalColors: false,
            inverted: false,
            type: "soft",
            grid: "square",
            size: 0.5,
            radius: 1.5,
            contrast: 0.3,
            grainMixer: 0,
            grainOverlay: 0,
            grainSize: 0.5,
            scale: 1,
            rotation: 0,
            offsetX: 0,
            offsetY: 0,
            fit: "cover",
        },
        moasic: {
            colorBack: "#000000",
            colorFront: "#b2aeae",
            originalColors: true,
            inverted: false,
            type: "classic",
            grid: "hex",
            size: 0.6,
            radius: 2,
            contrast: 0.01,
            grainMixer: 0.0,
            grainOverlay: 0.0,
            grainSize: 0.5,
            scale: 1,
            rotation: 0,
            offsetX: 0,
            offsetY: 0,
            fit: "cover",
        },
        round_and_square: {
            colorBack: "#141414",
            colorFront: "#ff8000",
            originalColors: false,
            inverted: true,
            type: "holes",
            grid: "square",
            size: 0.8,
            radius: 1,
            contrast: 1,
            grainMixer: 0.05,
            grainOverlay: 0.3,
            grainSize: 0.5,
            scale: 1,
            rotation: 0,
            offsetX: 0,
            offsetY: 0,
            fit: "cover",
        },
    };

    let params = $state<Params>({
        ...presets.default,
        image: "/assets/flowers.webp",
    });
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
            description: "Source image processed into halftone dots.",
            type: "string",
            values: "url",
        },
        {
            name: "colorBack",
            description: "Background color shown behind the dots.",
            type: "string",
            values: "hex / rgba",
        },
        {
            name: "colorFront",
            description: "Dot color (ignored when originalColors is enabled).",
            type: "string",
            values: "hex / rgb",
        },
        {
            name: "originalColors",
            description:
                "Sample dot colors from the image instead of using colorFront.",
            type: "boolean",
            values: "true · false",
        },
        {
            name: "inverted",
            description:
                "Invert the image's luminance. Has no effect at zero contrast.",
            type: "boolean",
            values: "true · false",
        },
        {
            name: "type",
            description: "Dot rendering style.",
            type: "string",
            values: dotsTypes.join(" · "),
        },
        {
            name: "grid",
            description: "Underlying lattice the dots are placed on.",
            type: "string",
            values: gridTypes.join(" · "),
        },
        {
            name: "size",
            description: "Grid cell size relative to the image.",
            type: "number",
            values: "0 → 1",
        },
        {
            name: "radius",
            description:
                "Maximum dot size relative to its grid cell. Values above 1 let dots overflow into neighbors.",
            type: "number",
            values: "0 → 2",
        },
        {
            name: "contrast",
            description: "Contrast applied to the sampled image.",
            type: "number",
            values: "0 → 1",
        },
        {
            name: "grainMixer",
            description: "Grain distortion applied to dot edges.",
            type: "number",
            values: "0 → 1",
        },
        {
            name: "grainOverlay",
            description: "Post-process black/white grain overlay.",
            type: "number",
            values: "0 → 1",
        },
        {
            name: "grainSize",
            description: "Scale of the grain distortion and overlay.",
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
            name: "speed",
            description: "Animation speed for time-based grain motion.",
            type: "number",
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
        $derived(`import { HalftoneDots } from '@devmischief/shaders-svelte';

<HalftoneDots
  width={1280}
  height={720}${params.image ? `\n  image="${params.image}"` : ""}
  colorBack="${params.colorBack}"
  colorFront="${params.colorFront}"
  originalColors={${params.originalColors}}
  inverted={${params.inverted}}
  type="${params.type}"
  grid="${params.grid}"
  size={${params.size}}
  radius={${params.radius}}
  contrast={${params.contrast}}
  grainMixer={${params.grainMixer}}
  grainOverlay={${params.grainOverlay}}
  grainSize={${params.grainSize}}
  scale={${params.scale}}
  rotation={${params.rotation}}
  offsetX={${params.offsetX}}
  offsetY={${params.offsetY}}
  fit="${params.fit}"
/>`);
</script>

<PlaygroundShell
    title="halftone dots"
    description="A halftone-dot image filter for comic, risograph, and newsprint treatments. Mix-and-match dot styles, hex or square grids, and custom palettes."
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
                    <HalftoneDots
                        width={1920}
                        height={1080}
                        image={params.image}
                        colorBack={params.colorBack}
                        colorFront={params.colorFront}
                        originalColors={params.originalColors}
                        inverted={params.inverted}
                        type={params.type}
                        grid={params.grid}
                        size={params.size}
                        radius={params.radius}
                        contrast={params.contrast}
                        grainMixer={params.grainMixer}
                        grainOverlay={params.grainOverlay}
                        grainSize={params.grainSize}
                        scale={params.scale}
                        rotation={params.rotation}
                        offsetX={params.offsetX}
                        offsetY={params.offsetY}
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
            <PlaygroundToggle
                label="originalColors"
                bind:value={params.originalColors}
                onChange={markCustom}
            />
            <PlaygroundToggle
                label="inverted"
                bind:value={params.inverted}
                onChange={markCustom}
            />
            <PlaygroundSelect
                label="type"
                bind:value={params.type}
                options={dotsTypes}
                onChange={markCustom}
            />
            <PlaygroundSelect
                label="grid"
                bind:value={params.grid}
                options={gridTypes}
                onChange={markCustom}
            />
            <PlaygroundSlider
                label="size"
                bind:value={params.size}
                min={0}
                max={1}
                step={0.01}
                onChange={markCustom}
            />
            <PlaygroundSlider
                label="radius"
                bind:value={params.radius}
                min={0}
                max={2}
                step={0.01}
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
                label="grainMixer"
                bind:value={params.grainMixer}
                min={0}
                max={1}
                step={0.01}
                onChange={markCustom}
            />
            <PlaygroundSlider
                label="grainOverlay"
                bind:value={params.grainOverlay}
                min={0}
                max={1}
                step={0.01}
                onChange={markCustom}
            />
            <PlaygroundSlider
                label="grainSize"
                bind:value={params.grainSize}
                min={0}
                max={1}
                step={0.01}
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
            <PlaygroundSlider
                label="rotation"
                bind:value={params.rotation}
                min={0}
                max={360}
                step={1}
                onChange={markCustom}
            />
            <PlaygroundSlider
                label="offsetX"
                bind:value={params.offsetX}
                min={-1}
                max={1}
                step={0.01}
                onChange={markCustom}
            />
            <PlaygroundSlider
                label="offsetY"
                bind:value={params.offsetY}
                min={-1}
                max={1}
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
