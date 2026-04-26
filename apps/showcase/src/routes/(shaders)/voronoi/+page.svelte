<script lang="ts">
    import { Voronoi } from "@devmischief/shaders-svelte";
    import AspectRatio from "$lib/aspectRatio.svelte";
    import {
        PlaygroundShell,
        PlaygroundSlider,
        PlaygroundColor,
        PlaygroundColors,
        PlaygroundSelect,
        PlaygroundPresets,
        type Prop,
    } from "$lib/playground";

    type Fit = "none" | "cover" | "contain";

    type Params = {
        colors: string[];
        colorGap: string;
        colorGlow: string;
        stepsPerColor: number;
        distortion: number;
        gap: number;
        glow: number;
        scale: number;
        rotation: number;
        offsetX: number;
        offsetY: number;
        speed: number;
        fit: Fit;
    };

    const fitOptions = ["none", "cover", "contain"] as const;

    const DEFAULT_PALETTE: string[] = [
        "#ff006e",
        "#ffbe0b",
        "#06d6a0",
        "#3a86ff",
        "#8338ec",
    ];

    const presets: Record<string, Params> = {
        default: {
            colors: DEFAULT_PALETTE.slice(0, 3),
            colorGap: "#2e0000",
            colorGlow: "#ffffff",
            stepsPerColor: 3,
            distortion: 0.4,
            gap: 0.04,
            glow: 0,
            scale: 0.5,
            rotation: 0,
            offsetX: 0,
            offsetY: 0,
            speed: 0.5,
            fit: "none",
        },
        cells: {
            colors: ["#0a3a2a", "#1a8a5a", "#7be8b6"],
            colorGap: "#001f14",
            colorGlow: "#a3ffd6",
            stepsPerColor: 2,
            distortion: 0.3,
            gap: 0.025,
            glow: 0.6,
            scale: 0.7,
            rotation: 0,
            offsetX: 0,
            offsetY: 0,
            speed: 0.3,
            fit: "none",
        },
        mosaic: {
            colors: ["#ff006e", "#ffd166", "#06d6a0", "#3a86ff", "#8338ec"],
            colorGap: "#0a0a0a",
            colorGlow: "#ffffff",
            stepsPerColor: 1,
            distortion: 0.15,
            gap: 0.08,
            glow: 0,
            scale: 0.5,
            rotation: 0,
            offsetX: 0,
            offsetY: 0,
            speed: 0.4,
            fit: "none",
        },
        lava: {
            colors: ["#1a0500", "#7a1a00", "#d4380c", "#ff8a1f", "#ffe066"],
            colorGap: "#1a0500",
            colorGlow: "#ffd166",
            stepsPerColor: 3,
            distortion: 0.5,
            gap: 0.015,
            glow: 0.4,
            scale: 0.6,
            rotation: 0,
            offsetX: 0,
            offsetY: 0,
            speed: 0.7,
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
            name: "colors",
            description: "Cell colors (up to 5).",
            type: "string[]",
            values: "hex / rgb",
        },
        {
            name: "colorGap",
            description: "Color used for the gap between cells.",
            type: "string",
            values: "hex / rgb",
        },
        {
            name: "colorGlow",
            description:
                "Color tint of the radial inner shadow inside cells. Effective when glow > 0.",
            type: "string",
            values: "hex / rgb",
        },
        {
            name: "stepsPerColor",
            description:
                "Extra interpolated colors generated between each pair of base colors.",
            type: "number",
            values: "1 → 3",
        },
        {
            name: "distortion",
            description: "Strength of noise-driven displacement of cell centers.",
            type: "number",
            values: "0 → 0.5",
        },
        {
            name: "gap",
            description:
                "Width of the border/gap between cells. Cannot be removed completely due to natural Voronoi border artifacts.",
            type: "number",
            values: "0 → 0.1",
        },
        {
            name: "glow",
            description: "Strength of the radial inner shadow inside cells.",
            type: "number",
            values: "0 → 1",
        },
        {
            name: "speed",
            description: "Animation speed of the cell drift.",
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

    const code = $derived.by(() => {
        const colorsLine = `[${params.colors.map((c) => `'${c}'`).join(", ")}]`;
        return `import { Voronoi } from '@devmischief/shaders-svelte';

<Voronoi
  width={1280}
  height={720}
  colors={${colorsLine}}
  colorGap="${params.colorGap}"
  colorGlow="${params.colorGlow}"
  stepsPerColor={${params.stepsPerColor}}
  distortion={${params.distortion}}
  gap={${params.gap}}
  glow={${params.glow}}
  scale={${params.scale}}
  rotation={${params.rotation}}
  offsetX={${params.offsetX}}
  offsetY={${params.offsetY}}
  speed={${params.speed}}
  fit="${params.fit}"
/>`;
    });
</script>

<PlaygroundShell
    title="voronoi"
    description="An animated Voronoi cell pattern with smooth, anti-aliased borders. Up to five base colours plus dedicated controls for cell gaps and inner glow."
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
                    <Voronoi
                        colors={params.colors}
                        colorGap={params.colorGap}
                        colorGlow={params.colorGlow}
                        stepsPerColor={params.stepsPerColor}
                        distortion={params.distortion}
                        gap={params.gap}
                        glow={params.glow}
                        scale={params.scale}
                        rotation={params.rotation}
                        offsetX={params.offsetX}
                        offsetY={params.offsetY}
                        speed={params.speed}
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
            <PlaygroundColors
                label="colors"
                bind:values={params.colors}
                defaults={DEFAULT_PALETTE}
                max={5}
                min={1}
                onChange={markCustom}
            />
            <PlaygroundColor
                label="colorGap"
                bind:value={params.colorGap}
                onChange={markCustom}
            />
            <PlaygroundColor
                label="colorGlow"
                bind:value={params.colorGlow}
                onChange={markCustom}
            />
            <PlaygroundSlider
                label="stepsPerColor"
                bind:value={params.stepsPerColor}
                min={1}
                max={3}
                step={1}
                onChange={markCustom}
            />
            <PlaygroundSlider
                label="distortion"
                bind:value={params.distortion}
                min={0}
                max={0.5}
                step={0.005}
                onChange={markCustom}
            />
            <PlaygroundSlider
                label="gap"
                bind:value={params.gap}
                min={0}
                max={0.1}
                step={0.001}
                onChange={markCustom}
            />
            <PlaygroundSlider
                label="glow"
                bind:value={params.glow}
                min={0}
                max={1}
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
