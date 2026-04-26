<script lang="ts">
    import { GodRays } from "@devmischief/shaders-svelte";
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
        colorBack: string;
        colorBloom: string;
        bloom: number;
        intensity: number;
        density: number;
        spotty: number;
        midSize: number;
        midIntensity: number;
        scale: number;
        rotation: number;
        offsetX: number;
        offsetY: number;
        speed: number;
        fit: Fit;
    };

    const fitOptions = ["none", "cover", "contain"] as const;

    const DEFAULT_PALETTE: string[] = [
        "#ffffff",
        "#ffe066",
        "#ffba47",
        "#ff8a1f",
        "#ff3d6e",
    ];

    const presets: Record<string, Params> = {
        default: {
            colors: DEFAULT_PALETTE.slice(0, 3),
            colorBack: "#000000",
            colorBloom: "#0000ff",
            bloom: 0.4,
            intensity: 0.8,
            density: 0.3,
            spotty: 0.3,
            midSize: 0.2,
            midIntensity: 0.4,
            scale: 1,
            rotation: 0,
            offsetX: 0,
            offsetY: -0.55,
            speed: 0.75,
            fit: "contain",
        },
        sunset: {
            colors: ["#ffe066", "#ffba47", "#ff8a1f", "#ff3d6e"],
            colorBack: "#1a0033",
            colorBloom: "#ff6b00",
            bloom: 0.7,
            intensity: 0.9,
            density: 0.4,
            spotty: 0.2,
            midSize: 0.4,
            midIntensity: 0.7,
            scale: 1,
            rotation: 0,
            offsetX: 0,
            offsetY: 0.3,
            speed: 0.5,
            fit: "contain",
        },
        cathedral: {
            colors: ["#ffffff", "#fff8e7", "#ffe066"],
            colorBack: "#0a0a14",
            colorBloom: "#5577ff",
            bloom: 0.5,
            intensity: 0.85,
            density: 0.25,
            spotty: 0.5,
            midSize: 0.15,
            midIntensity: 0.3,
            scale: 1,
            rotation: 0,
            offsetX: 0,
            offsetY: -0.7,
            speed: 0.3,
            fit: "contain",
        },
        nebula: {
            colors: ["#a78bfa", "#8338ec", "#ff7eb0", "#ffffff"],
            colorBack: "#02000a",
            colorBloom: "#3a86ff",
            bloom: 1,
            intensity: 0.95,
            density: 0.5,
            spotty: 0.15,
            midSize: 0.5,
            midIntensity: 0.8,
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
            description: "Ray colors (up to 5).",
            type: "string[]",
            values: "hex / rgb",
        },
        {
            name: "colorBack",
            description: "Background color shown behind the rays.",
            type: "string",
            values: "hex / rgba",
        },
        {
            name: "colorBloom",
            description: "Color overlay blended with the rays.",
            type: "string",
            values: "hex / rgb",
        },
        {
            name: "bloom",
            description:
                "Bloom blend mode. 0 = alpha blending, 1 = additive blending.",
            type: "number",
            values: "0 → 1",
        },
        {
            name: "intensity",
            description: "Visibility / strength of the rays.",
            type: "number",
            values: "0 → 1",
        },
        {
            name: "density",
            description: "Number of rays radiating from the center.",
            type: "number",
            values: "0 → 1",
        },
        {
            name: "spotty",
            description:
                "Length of the rays. Higher = shorter, more spotty rays.",
            type: "number",
            values: "0 → 1",
        },
        {
            name: "midSize",
            description: "Size of the circular glow at the center.",
            type: "number",
            values: "0 → 1",
        },
        {
            name: "midIntensity",
            description: "Brightness of the central glow.",
            type: "number",
            values: "0 → 1",
        },
        {
            name: "speed",
            description: "Animation speed of the rays.",
            type: "number",
            values: "0 → 3",
        },
        {
            name: "fit",
            description: "How the rays world is fit into the canvas.",
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
        return `import { GodRays } from '@devmischief/shaders-svelte';

<GodRays
  width={1280}
  height={720}
  colors={${colorsLine}}
  colorBack="${params.colorBack}"
  colorBloom="${params.colorBloom}"
  bloom={${params.bloom}}
  intensity={${params.intensity}}
  density={${params.density}}
  spotty={${params.spotty}}
  midSize={${params.midSize}}
  midIntensity={${params.midIntensity}}
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
    title="god rays"
    description="Animated rays of light radiating from a centre point — sun beams, cathedral light, nebula glow. Up to five ray colours plus a bloom overlay."
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
                    <GodRays
                        colors={params.colors}
                        colorBack={params.colorBack}
                        colorBloom={params.colorBloom}
                        bloom={params.bloom}
                        intensity={params.intensity}
                        density={params.density}
                        spotty={params.spotty}
                        midSize={params.midSize}
                        midIntensity={params.midIntensity}
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
                label="colorBack"
                bind:value={params.colorBack}
                onChange={markCustom}
            />
            <PlaygroundColor
                label="colorBloom"
                bind:value={params.colorBloom}
                onChange={markCustom}
            />
            <PlaygroundSlider
                label="bloom"
                bind:value={params.bloom}
                min={0}
                max={1}
                step={0.01}
                onChange={markCustom}
            />
            <PlaygroundSlider
                label="intensity"
                bind:value={params.intensity}
                min={0}
                max={1}
                step={0.01}
                onChange={markCustom}
            />
            <PlaygroundSlider
                label="density"
                bind:value={params.density}
                min={0}
                max={1}
                step={0.01}
                onChange={markCustom}
            />
            <PlaygroundSlider
                label="spotty"
                bind:value={params.spotty}
                min={0}
                max={1}
                step={0.01}
                onChange={markCustom}
            />
            <PlaygroundSlider
                label="midSize"
                bind:value={params.midSize}
                min={0}
                max={1}
                step={0.01}
                onChange={markCustom}
            />
            <PlaygroundSlider
                label="midIntensity"
                bind:value={params.midIntensity}
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
