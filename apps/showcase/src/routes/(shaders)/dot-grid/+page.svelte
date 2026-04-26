<script lang="ts">
    import { DotGrid } from "@devmischief/shaders-svelte";
    import AspectRatio from "$lib/aspectRatio.svelte";
    import {
        PlaygroundShell,
        PlaygroundSlider,
        PlaygroundColor,
        PlaygroundSelect,
        PlaygroundPresets,
        type Prop,
    } from "$lib/playground";

    type DotShape = "circle" | "diamond" | "square" | "triangle";
    type Fit = "none" | "cover" | "contain";

    type Params = {
        colorBack: string;
        colorFill: string;
        colorStroke: string;
        shape: DotShape;
        size: number;
        gapX: number;
        gapY: number;
        strokeWidth: number;
        sizeRange: number;
        opacityRange: number;
        scale: number;
        rotation: number;
        offsetX: number;
        offsetY: number;
        fit: Fit;
    };

    const dotShapes = ["circle", "diamond", "square", "triangle"] as const;
    const fitOptions = ["none", "cover", "contain"] as const;

    const presets: Record<string, Params> = {
        default: {
            colorBack: "#000000",
            colorFill: "#ffffff",
            colorStroke: "#ffaa00",
            shape: "circle",
            size: 2,
            gapX: 32,
            gapY: 32,
            strokeWidth: 0,
            sizeRange: 0,
            opacityRange: 0,
            scale: 1,
            rotation: 0,
            offsetX: 0,
            offsetY: 0,
            fit: "none",
        },
        notebook: {
            colorBack: "#f7f3e8",
            colorFill: "#0a0a0a",
            colorStroke: "#0a0a0a",
            shape: "circle",
            size: 2,
            gapX: 24,
            gapY: 24,
            strokeWidth: 0,
            sizeRange: 0,
            opacityRange: 0.4,
            scale: 1,
            rotation: 0,
            offsetX: 0,
            offsetY: 0,
            fit: "none",
        },
        metric: {
            colorBack: "#0a1226",
            colorFill: "#0a1226",
            colorStroke: "#a0d8ef",
            shape: "square",
            size: 8,
            gapX: 40,
            gapY: 40,
            strokeWidth: 1,
            sizeRange: 0,
            opacityRange: 0,
            scale: 1,
            rotation: 0,
            offsetX: 0,
            offsetY: 0,
            fit: "none",
        },
        confetti: {
            colorBack: "#fafafa",
            colorFill: "#ff3d6e",
            colorStroke: "#3a86ff",
            shape: "diamond",
            size: 8,
            gapX: 28,
            gapY: 28,
            strokeWidth: 1,
            sizeRange: 0.7,
            opacityRange: 0.5,
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
            description: "Background color shown behind the dots.",
            type: "string",
            values: "hex / rgba",
        },
        {
            name: "colorFill",
            description: "Fill color of each shape.",
            type: "string",
            values: "hex / rgb",
        },
        {
            name: "colorStroke",
            description:
                "Stroke (outline) color of each shape. Visible when strokeWidth > 0.",
            type: "string",
            values: "hex / rgb",
        },
        {
            name: "shape",
            description: "Shape rendered at every grid cell.",
            type: "string",
            values: dotShapes.join(" · "),
        },
        {
            name: "size",
            description: "Base size of each shape in pixels.",
            type: "number",
            values: "1 → 100",
        },
        {
            name: "gapX",
            description: "Horizontal spacing between cell centers in pixels.",
            type: "number",
            values: "2 → 500",
        },
        {
            name: "gapY",
            description: "Vertical spacing between cell centers in pixels.",
            type: "number",
            values: "2 → 500",
        },
        {
            name: "strokeWidth",
            description: "Outline stroke width in pixels.",
            type: "number",
            values: "0 → 50",
        },
        {
            name: "sizeRange",
            description:
                "Random per-dot size variation. 0 = uniform, higher = more variation up to base size.",
            type: "number",
            values: "0 → 1",
        },
        {
            name: "opacityRange",
            description:
                "Random per-dot opacity variation. 0 = fully opaque, higher = more transparency.",
            type: "number",
            values: "0 → 1",
        },
        {
            name: "fit",
            description: "How the dot grid is fit into the canvas.",
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

    const code = $derived(`import { DotGrid } from '@devmischief/shaders-svelte';

<DotGrid
  width={1280}
  height={720}
  colorBack="${params.colorBack}"
  colorFill="${params.colorFill}"
  colorStroke="${params.colorStroke}"
  shape="${params.shape}"
  size={${params.size}}
  gapX={${params.gapX}}
  gapY={${params.gapY}}
  strokeWidth={${params.strokeWidth}}
  sizeRange={${params.sizeRange}}
  opacityRange={${params.opacityRange}}
  scale={${params.scale}}
  rotation={${params.rotation}}
  offsetX={${params.offsetX}}
  offsetY={${params.offsetY}}
  fit="${params.fit}"
/>`);
</script>

<PlaygroundShell
    title="dot grid"
    description="A static grid of geometric shapes — circles, diamonds, squares, or triangles — with independent X/Y spacing, fill, stroke, and randomization controls."
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
                    <DotGrid
                        colorBack={params.colorBack}
                        colorFill={params.colorFill}
                        colorStroke={params.colorStroke}
                        shape={params.shape}
                        size={params.size}
                        gapX={params.gapX}
                        gapY={params.gapY}
                        strokeWidth={params.strokeWidth}
                        sizeRange={params.sizeRange}
                        opacityRange={params.opacityRange}
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
                label="colorFill"
                bind:value={params.colorFill}
                onChange={markCustom}
            />
            <PlaygroundColor
                label="colorStroke"
                bind:value={params.colorStroke}
                onChange={markCustom}
            />
            <PlaygroundSelect
                label="shape"
                bind:value={params.shape}
                options={dotShapes}
                onChange={markCustom}
            />
            <PlaygroundSlider
                label="size"
                bind:value={params.size}
                min={1}
                max={100}
                step={0.5}
                onChange={markCustom}
            />
            <PlaygroundSlider
                label="gapX"
                bind:value={params.gapX}
                min={2}
                max={500}
                step={1}
                onChange={markCustom}
            />
            <PlaygroundSlider
                label="gapY"
                bind:value={params.gapY}
                min={2}
                max={500}
                step={1}
                onChange={markCustom}
            />
            <PlaygroundSlider
                label="strokeWidth"
                bind:value={params.strokeWidth}
                min={0}
                max={50}
                step={0.1}
                onChange={markCustom}
            />
            <PlaygroundSlider
                label="sizeRange"
                bind:value={params.sizeRange}
                min={0}
                max={1}
                step={0.01}
                onChange={markCustom}
            />
            <PlaygroundSlider
                label="opacityRange"
                bind:value={params.opacityRange}
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
                options={fitOptions}
                onChange={markCustom}
            />
        </div>
    {/snippet}
</PlaygroundShell>
