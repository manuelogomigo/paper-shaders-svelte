<script lang="ts">
    import { ImageDithering } from "@devmischief/shaders-svelte";
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

    type DitheringType = "random" | "2x2" | "4x4" | "8x8";
    type Fit = "cover" | "contain";

    type Params = {
        image?: string;
        colorBack: string;
        colorFront: string;
        colorHighlight: string;
        originalColors: boolean;
        inverted: boolean;
        type: DitheringType;
        size: number;
        colorSteps: number;
        scale: number;
        rotation: number;
        offsetX: number;
        offsetY: number;
        fit: Fit;
    };

    const ditheringTypes = ["random", "2x2", "4x4", "8x8"] as const;

    const presets: Record<string, Params> = {
        default: {
            colorBack: "#000c38",
            colorFront: "#94ffaf",
            colorHighlight: "#eaff94",
            originalColors: false,
            inverted: false,
            type: "8x8",
            size: 2,
            colorSteps: 2,
            scale: 1,
            rotation: 0,
            offsetX: 0,
            offsetY: 0,
            fit: "cover",
        },
        bauhaus: {
            colorBack: "#0a0a0a",
            colorFront: "#ff3b1f",
            colorHighlight: "#ffd400",
            originalColors: false,
            inverted: false,
            type: "8x8",
            size: 5,
            colorSteps: 3,
            scale: 1,
            rotation: 0,
            offsetX: 0,
            offsetY: 0,
            fit: "cover",
        },
        gameboy: {
            colorBack: "#0f380f",
            colorFront: "#306230",
            colorHighlight: "#9bbc0f",
            originalColors: false,
            inverted: false,
            type: "4x4",
            size: 3,
            colorSteps: 4,
            scale: 1,
            rotation: 0,
            offsetX: 0,
            offsetY: 0,
            fit: "cover",
        },
        photo: {
            colorBack: "#000000",
            colorFront: "#ffffff",
            colorHighlight: "#ffffff",
            originalColors: true,
            inverted: false,
            type: "8x8",
            size: 1.5,
            colorSteps: 4,
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
            description: "Source image processed by the dithering filter.",
            type: "string",
            values: "url",
        },
        {
            name: "colorBack",
            description: "Background color of the dither palette.",
            type: "string",
            values: "hex / rgba",
        },
        {
            name: "colorFront",
            description: "Foreground color of the dither palette.",
            type: "string",
            values: "hex / rgb",
        },
        {
            name: "colorHighlight",
            description:
                "Secondary foreground color (set equal to colorFront for classic 2-color dithering).",
            type: "string",
            values: "hex / rgb",
        },
        {
            name: "originalColors",
            description:
                "Sample the image's own colors instead of the configured palette.",
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
            description: "Dithering algorithm.",
            type: "string",
            values: ditheringTypes.join(" · "),
        },
        {
            name: "size",
            description: "Pixel size of the dithering grid.",
            type: "number",
            values: "0.5 → 20",
        },
        {
            name: "colorSteps",
            description: "Number of colors in the palette.",
            type: "number",
            values: "1 → 7",
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
            description: "Animation speed for time-based motion.",
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
        $derived(`import { ImageDithering } from '@devmischief/shaders-svelte';

<ImageDithering
  width={1280}
  height={720}${params.image ? `\n  image="${params.image}"` : ""}
  colorBack="${params.colorBack}"
  colorFront="${params.colorFront}"
  colorHighlight="${params.colorHighlight}"
  originalColors={${params.originalColors}}
  inverted={${params.inverted}}
  type="${params.type}"
  size={${params.size}}
  colorSteps={${params.colorSteps}}
  scale={${params.scale}}
  rotation={${params.rotation}}
  offsetX={${params.offsetX}}
  offsetY={${params.offsetY}}
  fit="${params.fit}"
/>`);
</script>

<PlaygroundShell
    title="image dithering"
    description="A dithering image filter with four algorithms, custom palettes up to seven colors, and a sampled-from-image mode for retro-photo treatments."
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
                    <ImageDithering
                        width={1920}
                        height={1080}
                        image={params.image}
                        colorBack={params.colorBack}
                        colorFront={params.colorFront}
                        colorHighlight={params.colorHighlight}
                        originalColors={params.originalColors}
                        inverted={params.inverted}
                        type={params.type}
                        size={params.size}
                        colorSteps={params.colorSteps}
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
            <PlaygroundColor
                label="colorHighlight"
                bind:value={params.colorHighlight}
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
                options={ditheringTypes}
                onChange={markCustom}
            />
            <PlaygroundSlider
                label="size"
                bind:value={params.size}
                min={0.5}
                max={20}
                step={0.1}
                onChange={markCustom}
            />
            <PlaygroundSlider
                label="colorSteps"
                bind:value={params.colorSteps}
                min={1}
                max={7}
                step={1}
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
