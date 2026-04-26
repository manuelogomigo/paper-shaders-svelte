<script lang="ts">
    import { Warp } from "@devmischief/shaders-svelte";
    import AspectRatio from "$lib/aspectRatio.svelte";
    import {
        PlaygroundShell,
        PlaygroundSlider,
        PlaygroundColors,
        PlaygroundSelect,
        PlaygroundPresets,
        type Prop,
    } from "$lib/playground";

    type WarpPattern = "checks" | "stripes" | "edge";
    type Fit = "none" | "cover" | "contain";

    type Params = {
        colors: string[];
        proportion: number;
        softness: number;
        shape: WarpPattern;
        shapeScale: number;
        distortion: number;
        swirl: number;
        swirlIterations: number;
        scale: number;
        rotation: number;
        offsetX: number;
        offsetY: number;
        speed: number;
        fit: Fit;
    };

    const warpPatterns = ["checks", "stripes", "edge"] as const;
    const fitOptions = ["none", "cover", "contain"] as const;

    const DEFAULT_PALETTE: string[] = [
        "#3a86ff",
        "#06d6a0",
        "#ffd166",
        "#ef476f",
        "#8338ec",
        "#118ab2",
        "#fb5607",
        "#ff006e",
        "#ffbe0b",
        "#073b4c",
    ];

    const presets: Record<string, Params> = {
        default: {
            colors: DEFAULT_PALETTE.slice(0, 4),
            proportion: 0.45,
            softness: 1,
            shape: "checks",
            shapeScale: 0.1,
            distortion: 0.25,
            swirl: 0.8,
            swirlIterations: 10,
            scale: 1,
            rotation: 0,
            offsetX: 0,
            offsetY: 0,
            speed: 1,
            fit: "none",
        },
        marble: {
            colors: ["#1a0f08", "#6e3a1c", "#c79b6c", "#f0d8b8"],
            proportion: 0.5,
            softness: 1,
            shape: "edge",
            shapeScale: 0.15,
            distortion: 0.3,
            swirl: 1,
            swirlIterations: 14,
            scale: 1,
            rotation: 0,
            offsetX: 0,
            offsetY: 0,
            speed: 0.4,
            fit: "none",
        },
        liquid: {
            colors: ["#ff006e", "#8338ec", "#3a86ff", "#06d6a0", "#ffd166"],
            proportion: 0.5,
            softness: 0.9,
            shape: "checks",
            shapeScale: 0.2,
            distortion: 0.85,
            swirl: 0.4,
            swirlIterations: 6,
            scale: 1,
            rotation: 0,
            offsetX: 0,
            offsetY: 0,
            speed: 1.5,
            fit: "none",
        },
        barber: {
            colors: ["#ffffff", "#ff3d6e", "#0a3a5c"],
            proportion: 0.5,
            softness: 0.1,
            shape: "stripes",
            shapeScale: 0.05,
            distortion: 0,
            swirl: 0,
            swirlIterations: 0,
            scale: 1,
            rotation: 0,
            offsetX: 0,
            offsetY: 0,
            speed: 0.6,
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
            description: "Warp gradient colors (up to 10).",
            type: "string[]",
            values: "hex / rgb",
        },
        {
            name: "shape",
            description: "Base pattern that the colors warp over.",
            type: "string",
            values: warpPatterns.join(" · "),
        },
        {
            name: "shapeScale",
            description: "Zoom level of the base pattern.",
            type: "number",
            values: "0 → 1",
        },
        {
            name: "proportion",
            description:
                "Blend midpoint between colors. 0.5 = equal distribution; tilt toward 0 or 1 to weight one end.",
            type: "number",
            values: "0 → 1",
        },
        {
            name: "softness",
            description:
                "Color transition sharpness. 0 = hard edge, 1 = smooth gradient.",
            type: "number",
            values: "0 → 1",
        },
        {
            name: "distortion",
            description: "Strength of noise-based distortion.",
            type: "number",
            values: "0 → 1",
        },
        {
            name: "swirl",
            description: "Strength of the swirl distortion.",
            type: "number",
            values: "0 → 1",
        },
        {
            name: "swirlIterations",
            description:
                "Layered swirl passes. More iterations = deeper marbling, but higher GPU cost. Effective with swirl > 0.",
            type: "number",
            values: "0 → 20",
        },
        {
            name: "speed",
            description: "Animation speed of the warping motion.",
            type: "number",
            values: "0 → 3",
        },
        {
            name: "fit",
            description: "How the gradient world is fit into the canvas.",
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
        return `import { Warp } from '@devmischief/shaders-svelte';

<Warp
  width={1280}
  height={720}
  colors={${colorsLine}}
  shape="${params.shape}"
  shapeScale={${params.shapeScale}}
  proportion={${params.proportion}}
  softness={${params.softness}}
  distortion={${params.distortion}}
  swirl={${params.swirl}}
  swirlIterations={${params.swirlIterations}}
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
    title="warp"
    description="Animated colours warped by noise and swirls over a base pattern. The marbled-paper / liquid / smoky look — pick a base, dial in the distortion."
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
                    <Warp
                        colors={params.colors}
                        proportion={params.proportion}
                        softness={params.softness}
                        shape={params.shape}
                        shapeScale={params.shapeScale}
                        distortion={params.distortion}
                        swirl={params.swirl}
                        swirlIterations={params.swirlIterations}
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
                max={10}
                min={1}
                onChange={markCustom}
            />
            <PlaygroundSelect
                label="shape"
                bind:value={params.shape}
                options={warpPatterns}
                onChange={markCustom}
            />
            <PlaygroundSlider
                label="shapeScale"
                bind:value={params.shapeScale}
                min={0}
                max={1}
                step={0.01}
                onChange={markCustom}
            />
            <PlaygroundSlider
                label="proportion"
                bind:value={params.proportion}
                min={0}
                max={1}
                step={0.01}
                onChange={markCustom}
            />
            <PlaygroundSlider
                label="softness"
                bind:value={params.softness}
                min={0}
                max={1}
                step={0.01}
                onChange={markCustom}
            />
            <PlaygroundSlider
                label="distortion"
                bind:value={params.distortion}
                min={0}
                max={1}
                step={0.01}
                onChange={markCustom}
            />
            <PlaygroundSlider
                label="swirl"
                bind:value={params.swirl}
                min={0}
                max={1}
                step={0.01}
                onChange={markCustom}
            />
            <PlaygroundSlider
                label="swirlIterations"
                bind:value={params.swirlIterations}
                min={0}
                max={20}
                step={1}
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
