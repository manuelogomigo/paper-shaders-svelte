<script lang="ts">
    import { Water } from "@devmischief/shaders-svelte";
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

    type Fit = "cover" | "contain";

    type Params = {
        image?: string;
        colorBack: string;
        colorHighlight: string;
        highlights: number;
        layering: number;
        edges: number;
        waves: number;
        caustic: number;
        size: number;
        scale: number;
        rotation: number;
        offsetX: number;
        offsetY: number;
        speed: number;
        fit: Fit;
    };

    const presets: Record<string, Params> = {
        default: {
            colorBack: "#8f8f8f",
            colorHighlight: "#ffffff",
            highlights: 0.07,
            layering: 0.5,
            edges: 0.8,
            waves: 0.3,
            caustic: 0.1,
            size: 1,
            scale: 0.8,
            rotation: 0,
            offsetX: 0,
            offsetY: 0,
            speed: 1,
            fit: "contain",
        },
        pool: {
            colorBack: "#00000000",
            colorHighlight: "#ffffff",
            highlights: 0.12,
            layering: 0.7,
            edges: 1.0,
            waves: 0.1,
            caustic: 0.2,
            size: 1.5,
            scale: 1.0,
            rotation: 0,
            offsetX: 0,
            offsetY: 0,
            speed: 0.5,
            fit: "cover",
        },
        swell: {
            colorBack: "#00000000",
            colorHighlight: "#ffffff",
            highlights: 0.2,
            layering: 0.4,
            edges: 0.6,
            waves: 0.85,
            caustic: 0.3,
            size: 2.0,
            scale: 1.0,
            rotation: 0,
            offsetX: 0,
            offsetY: 0,
            speed: 1.5,
            fit: "cover",
        },
        caustic: {
            colorBack: "#00000000",
            colorHighlight: "#ffffff",
            highlights: 0.4,
            layering: 0.8,
            edges: 0.3,
            waves: 0.1,
            caustic: 1.0,
            size: 0.6,
            scale: 1.0,
            rotation: 0,
            offsetX: 0,
            offsetY: 0,
            speed: 1.2,
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
            description:
                "Optional source image. Without one, the shader renders a standalone water texture.",
            type: "string",
            values: "url",
        },
        {
            name: "colorBack",
            description:
                "Background color visible through transparent regions of the image.",
            type: "string",
            values: "hex / rgba",
        },
        {
            name: "colorHighlight",
            description: "Color of the caustic highlights and crests.",
            type: "string",
            values: "hex / rgb",
        },
        {
            name: "highlights",
            description:
                "Strength of the highlight color overlaid along the caustic shape.",
            type: "number",
            values: "0 → 1",
        },
        {
            name: "layering",
            description:
                "Strength of the secondary caustic layer for added depth.",
            type: "number",
            values: "0 → 1",
        },
        {
            name: "edges",
            description: "Caustic distortion power along the image edges.",
            type: "number",
            values: "0 → 1",
        },
        {
            name: "waves",
            description:
                "Additional simplex-noise distortion, independent of the caustic.",
            type: "number",
            values: "0 → 1",
        },
        {
            name: "caustic",
            description: "Power of the primary caustic distortion.",
            type: "number",
            values: "0 → 1",
        },
        {
            name: "size",
            description: "Pattern scale of the water texture.",
            type: "number",
            values: "0.01 → 7",
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
            description: "Animation speed multiplier (default 1).",
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

    const code = $derived(`import { Water } from '@devmischief/shaders-svelte';

<Water
  width={1280}
  height={720}${params.image ? `\n  image="${params.image}"` : ""}
  colorBack="${params.colorBack}"
  colorHighlight="${params.colorHighlight}"
  highlights={${params.highlights}}
  layering={${params.layering}}
  edges={${params.edges}}
  waves={${params.waves}}
  caustic={${params.caustic}}
  size={${params.size}}
  scale={${params.scale}}
  rotation={${params.rotation}}
  offsetX={${params.offsetX}}
  offsetY={${params.offsetY}}
  speed={${params.speed}}
  fit="${params.fit}"
/>`);
</script>

<PlaygroundShell
    title="water"
    description="A caustic water-surface distortion. Use it as an image filter for shimmering reflections, or run it standalone as an animated texture."
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
                    <Water
                        width={1920}
                        height={1080}
                        image={params.image}
                        colorBack={params.colorBack}
                        colorHighlight={params.colorHighlight}
                        highlights={params.highlights}
                        layering={params.layering}
                        edges={params.edges}
                        waves={params.waves}
                        caustic={params.caustic}
                        size={params.size}
                        scale={params.scale}
                        rotation={params.rotation}
                        offsetX={params.offsetX}
                        offsetY={params.offsetY}
                        speed={params.speed}
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
                label="colorHighlight"
                bind:value={params.colorHighlight}
                onChange={markCustom}
            />
            <PlaygroundSlider
                label="highlights"
                bind:value={params.highlights}
                min={0}
                max={1}
                step={0.01}
                onChange={markCustom}
            />
            <PlaygroundSlider
                label="layering"
                bind:value={params.layering}
                min={0}
                max={1}
                step={0.01}
                onChange={markCustom}
            />
            <PlaygroundSlider
                label="edges"
                bind:value={params.edges}
                min={0}
                max={1}
                step={0.01}
                onChange={markCustom}
            />
            <PlaygroundSlider
                label="waves"
                bind:value={params.waves}
                min={0}
                max={1}
                step={0.01}
                onChange={markCustom}
            />
            <PlaygroundSlider
                label="caustic"
                bind:value={params.caustic}
                min={0}
                max={1}
                step={0.01}
                onChange={markCustom}
            />
            <PlaygroundSlider
                label="size"
                bind:value={params.size}
                min={0.1}
                max={7}
                step={0.05}
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
                label="speed"
                bind:value={params.speed}
                min={0}
                max={3}
                step={0.05}
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
