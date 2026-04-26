<script lang="ts">
    import { Dithering } from "@devmischief/shaders-svelte";
    import AspectRatio from "$lib/aspectRatio.svelte";
    import {
        PlaygroundShell,
        PlaygroundSlider,
        PlaygroundColor,
        PlaygroundSelect,
        PlaygroundPresets,
        type Prop,
    } from "$lib/playground";

    type DitheringShape =
        | "simplex"
        | "warp"
        | "dots"
        | "wave"
        | "ripple"
        | "swirl"
        | "sphere";
    type DitheringType = "random" | "2x2" | "4x4" | "8x8";
    type Fit = "none" | "cover" | "contain";

    type Params = {
        colorBack: string;
        colorFront: string;
        shape: DitheringShape;
        type: DitheringType;
        size: number;
        speed: number;
        scale: number;
        rotation: number;
        offsetX: number;
        offsetY: number;
        fit: Fit;
    };

    const ditheringShapes = [
        "simplex",
        "warp",
        "dots",
        "wave",
        "ripple",
        "swirl",
        "sphere",
    ] as const;
    const ditheringTypes = ["random", "2x2", "4x4", "8x8"] as const;
    const fitOptions = ["none", "cover", "contain"] as const;

    const presets: Record<string, Params> = {
        default: {
            colorBack: "#191919",
            colorFront: "#56ae6c",
            shape: "warp",
            type: "4x4",
            size: 1,
            speed: 1,
            scale: 1,
            rotation: 0,
            offsetX: 0,
            offsetY: 0,
            fit: "none",
        },
        noise: {
            colorBack: "#0a0a0a",
            colorFront: "#fafafa",
            shape: "simplex",
            type: "8x8",
            size: 2,
            speed: 0.5,
            scale: 1,
            rotation: 0,
            offsetX: 0,
            offsetY: 0,
            fit: "none",
        },
        wave: {
            colorBack: "#0a1a3a",
            colorFront: "#a0d8ef",
            shape: "wave",
            type: "4x4",
            size: 1.5,
            speed: 0.8,
            scale: 1,
            rotation: 0,
            offsetX: 0,
            offsetY: 0,
            fit: "none",
        },
        globe: {
            colorBack: "#000000",
            colorFront: "#ffffff",
            shape: "sphere",
            type: "8x8",
            size: 1.2,
            speed: 0.3,
            scale: 1,
            rotation: 0,
            offsetX: 0,
            offsetY: 0,
            fit: "none",
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

    const shaderProps: Prop[] = [
        {
            name: "colorBack",
            description: "Background color of the dither.",
            type: "string",
            values: "hex / rgba",
        },
        {
            name: "colorFront",
            description: "Foreground (ink) color of the dither.",
            type: "string",
            values: "hex / rgb",
        },
        {
            name: "shape",
            description: "Procedural pattern source.",
            type: "string",
            values: ditheringShapes.join(" · "),
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
            name: "speed",
            description: "Animation speed of the underlying pattern.",
            type: "number",
            values: "0 → 3",
        },
        {
            name: "fit",
            description: "How the pattern is fit into the canvas.",
            type: "string",
            values: fitOptions.join(" · "),
        },
    ];

    const commonProps: Prop[] = [
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
            name: "worldWidth",
            description:
                "Virtual width of the graphic before it's scaled to fit the canvas.",
            type: "number",
        },
        {
            name: "worldHeight",
            description:
                "Virtual height of the graphic before it's scaled to fit the canvas.",
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

    const code = $derived(`import { Dithering } from '@devmischief/shaders-svelte';

<Dithering
  width={1280}
  height={720}
  colorBack="${params.colorBack}"
  colorFront="${params.colorFront}"
  shape="${params.shape}"
  type="${params.type}"
  size={${params.size}}
  speed={${params.speed}}
  scale={${params.scale}}
  rotation={${params.rotation}}
  offsetX={${params.offsetX}}
  offsetY={${params.offsetY}}
  fit="${params.fit}"
/>`);
</script>

<PlaygroundShell
    title="dithering"
    description="A two-colour dither over seven procedurally generated patterns. Animated by default — pick a shape, pick an algorithm, dial in the pixel size."
    {code}
    {shaderProps}
    {commonProps}
>
    {#snippet preview()}
        <div
            class="flex min-w-0 flex-1 flex-col items-center justify-center"
        >
            <AspectRatio
                ratio={16 / 12}
                class="w-full overflow-hidden rounded-xl border border-pg-border-2 bg-pg-surface"
            >
                <div class="flex h-full w-full overflow-hidden">
                    <Dithering
                        colorBack={params.colorBack}
                        colorFront={params.colorFront}
                        shape={params.shape}
                        type={params.type}
                        size={params.size}
                        speed={params.speed}
                        scale={params.scale}
                        rotation={params.rotation}
                        offsetX={params.offsetX}
                        offsetY={params.offsetY}
                        fit={params.fit}
                    />
                </div>
            </AspectRatio>
        </div>
    {/snippet}

    {#snippet controls()}
        <PlaygroundPresets
            names={Object.keys(presets)}
            active={activePreset}
            onApply={applyPreset}
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
            <PlaygroundSelect
                label="shape"
                bind:value={params.shape}
                options={ditheringShapes}
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
                label="speed"
                bind:value={params.speed}
                min={0}
                max={3}
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
                options={fitOptions}
                onChange={markCustom}
            />
        </div>
    {/snippet}
</PlaygroundShell>
