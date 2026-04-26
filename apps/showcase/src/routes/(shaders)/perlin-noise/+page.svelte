<script lang="ts">
    import { PerlinNoise } from "@devmischief/shaders-svelte";
    import AspectRatio from "$lib/aspectRatio.svelte";
    import {
        PlaygroundShell,
        PlaygroundSlider,
        PlaygroundColor,
        PlaygroundSelect,
        PlaygroundPresets,
        type Prop,
    } from "$lib/playground";

    type Fit = "none" | "cover" | "contain";

    type Params = {
        colorBack: string;
        colorFront: string;
        proportion: number;
        softness: number;
        octaveCount: number;
        persistence: number;
        lacunarity: number;
        scale: number;
        rotation: number;
        offsetX: number;
        offsetY: number;
        speed: number;
        fit: Fit;
    };

    const fitOptions = ["none", "cover", "contain"] as const;

    const presets: Record<string, Params> = {
        default: {
            colorBack: "#632ad5",
            colorFront: "#fccff7",
            proportion: 0.35,
            softness: 0.1,
            octaveCount: 1,
            persistence: 1,
            lacunarity: 1.5,
            scale: 1,
            rotation: 0,
            offsetX: 0,
            offsetY: 0,
            speed: 0.5,
            fit: "none",
        },
        clouds: {
            colorBack: "#7eaaff",
            colorFront: "#ffffff",
            proportion: 0.55,
            softness: 0.6,
            octaveCount: 5,
            persistence: 0.6,
            lacunarity: 2,
            scale: 1,
            rotation: 0,
            offsetX: 0,
            offsetY: 0,
            speed: 0.3,
            fit: "none",
        },
        marble: {
            colorBack: "#1a1208",
            colorFront: "#f0d8b8",
            proportion: 0.5,
            softness: 0.05,
            octaveCount: 4,
            persistence: 0.85,
            lacunarity: 2.5,
            scale: 1,
            rotation: 0,
            offsetX: 0,
            offsetY: 0,
            speed: 0.4,
            fit: "none",
        },
        lava: {
            colorBack: "#1a0500",
            colorFront: "#ff5a1f",
            proportion: 0.4,
            softness: 0.15,
            octaveCount: 2,
            persistence: 0.7,
            lacunarity: 3,
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
            name: "colorBack",
            description: "Background color of the noise field.",
            type: "string",
            values: "hex / rgba",
        },
        {
            name: "colorFront",
            description: "Foreground color of the noise field.",
            type: "string",
            values: "hex / rgb",
        },
        {
            name: "proportion",
            description:
                "Blend point between front and back colors. 0.5 = equal distribution.",
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
            name: "octaveCount",
            description:
                "Number of noise octaves stacked. More octaves = more detail.",
            type: "number",
            values: "1 → 8",
        },
        {
            name: "persistence",
            description: "Roughness — how much each octave contributes.",
            type: "number",
            values: "0.3 → 1",
        },
        {
            name: "lacunarity",
            description:
                "Frequency step between octaves — how compressed each octave is.",
            type: "number",
            values: "1.5 → 10",
        },
        {
            name: "speed",
            description: "Animation speed of the drifting noise.",
            type: "number",
            values: "0 → 3",
        },
        {
            name: "fit",
            description: "How the noise field is fit into the canvas.",
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

    const code = $derived(`import { PerlinNoise } from '@devmischief/shaders-svelte';

<PerlinNoise
  width={1280}
  height={720}
  colorBack="${params.colorBack}"
  colorFront="${params.colorFront}"
  proportion={${params.proportion}}
  softness={${params.softness}}
  octaveCount={${params.octaveCount}}
  persistence={${params.persistence}}
  lacunarity={${params.lacunarity}}
  scale={${params.scale}}
  rotation={${params.rotation}}
  offsetX={${params.offsetX}}
  offsetY={${params.offsetY}}
  speed={${params.speed}}
  fit="${params.fit}"
/>`);
</script>

<PlaygroundShell
    title="perlin noise"
    description="Classic animated 3D Perlin noise with all the canonical controls — octave count, persistence, and lacunarity. From single-layer drift to multi-octave clouds."
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
                    <PerlinNoise
                        colorBack={params.colorBack}
                        colorFront={params.colorFront}
                        proportion={params.proportion}
                        softness={params.softness}
                        octaveCount={params.octaveCount}
                        persistence={params.persistence}
                        lacunarity={params.lacunarity}
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
                label="octaveCount"
                bind:value={params.octaveCount}
                min={1}
                max={8}
                step={1}
                onChange={markCustom}
            />
            <PlaygroundSlider
                label="persistence"
                bind:value={params.persistence}
                min={0.3}
                max={1}
                step={0.01}
                onChange={markCustom}
            />
            <PlaygroundSlider
                label="lacunarity"
                bind:value={params.lacunarity}
                min={1.5}
                max={10}
                step={0.05}
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
