<script lang="ts">
    import { MeshGradient } from "@devmischief/shaders-svelte";
    import AspectRatio from "$lib/aspectRatio.svelte";
    import {
        PlaygroundShell,
        PlaygroundSlider,
        PlaygroundColors,
        PlaygroundSelect,
        PlaygroundPresets,
        type Prop,
    } from "$lib/playground";

    type Fit = "cover" | "contain";

    type Params = {
        colors: string[];
        distortion: number;
        swirl: number;
        grainMixer: number;
        grainOverlay: number;
        scale: number;
        rotation: number;
        offsetX: number;
        offsetY: number;
        speed: number;
        fit: Fit;
    };

    const DEFAULT_PALETTE: string[] = [
        "#ff6b9d",
        "#ff9966",
        "#ffd06b",
        "#a8e6cf",
        "#7eb6ff",
        "#a78bfa",
        "#f472b6",
        "#fcd34d",
        "#34d399",
        "#60a5fa",
    ];

    const presets: Record<string, Params> = {
        default: {
            colors: DEFAULT_PALETTE.slice(0, 5),
            distortion: 0.8,
            swirl: 0.1,
            grainMixer: 0,
            grainOverlay: 0,
            scale: 1,
            rotation: 0,
            offsetX: 0,
            offsetY: 0,
            speed: 1,
            fit: "contain",
        },
        sunset: {
            colors: ["#ff3d6e", "#ff6b6b", "#ff9248", "#ffba47", "#ffe066"],
            distortion: 0.7,
            swirl: 0.2,
            grainMixer: 0,
            grainOverlay: 0.1,
            scale: 1,
            rotation: 0,
            offsetX: 0,
            offsetY: 0,
            speed: 0.8,
            fit: "contain",
        },
        ocean: {
            colors: ["#001a4d", "#0046a3", "#0099d4", "#00d4d4", "#a3f0d6"],
            distortion: 0.9,
            swirl: 0.4,
            grainMixer: 0,
            grainOverlay: 0,
            scale: 1,
            rotation: 0,
            offsetX: 0,
            offsetY: 0,
            speed: 1,
            fit: "contain",
        },
        dreamy: {
            colors: [
                "#fce4ec",
                "#f8bbd0",
                "#e1bee7",
                "#d1c4e9",
                "#c5cae9",
                "#b3e5fc",
            ],
            distortion: 1,
            swirl: 0.6,
            grainMixer: 0.4,
            grainOverlay: 0.3,
            scale: 1,
            rotation: 0,
            offsetX: 0,
            offsetY: 0,
            speed: 0.6,
            fit: "contain",
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
            description: "Mesh gradient color spots (up to 10).",
            type: "string[]",
            values: "hex / rgb",
        },
        {
            name: "distortion",
            description: "Power of organic noise distortion.",
            type: "number",
            values: "0 → 1",
        },
        {
            name: "swirl",
            description: "Power of vortex distortion around the canvas center.",
            type: "number",
            values: "0 → 1",
        },
        {
            name: "grainMixer",
            description: "Grain distortion applied to color edges.",
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
            name: "speed",
            description: "Animation speed of the flowing colors.",
            type: "number",
            values: "0 → 3",
        },
        {
            name: "fit",
            description: "How the gradient world is fit into the canvas.",
            type: "string",
            values: "cover · contain",
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
        return `import { MeshGradient } from '@devmischief/shaders-svelte';

<MeshGradient
  width={1280}
  height={720}
  colors={${colorsLine}}
  distortion={${params.distortion}}
  swirl={${params.swirl}}
  grainMixer={${params.grainMixer}}
  grainOverlay={${params.grainOverlay}}
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
    title="mesh gradient"
    description="A flowing composition of color spots moving along distinct trajectories, transformed by organic distortion and optional swirl."
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
                    <MeshGradient
                        colors={params.colors}
                        distortion={params.distortion}
                        swirl={params.swirl}
                        grainMixer={params.grainMixer}
                        grainOverlay={params.grainOverlay}
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
                options={["cover", "contain"]}
                onChange={markCustom}
            />
        </div>
    {/snippet}
</PlaygroundShell>
