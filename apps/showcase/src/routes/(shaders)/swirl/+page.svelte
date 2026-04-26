<script lang="ts">
    import { Swirl } from "@devmischief/shaders-svelte";
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
        bandCount: number;
        twist: number;
        center: number;
        proportion: number;
        softness: number;
        noise: number;
        noiseFrequency: number;
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
        "#fb5607",
        "#ffbe0b",
        "#06d6a0",
        "#3a86ff",
        "#8338ec",
        "#118ab2",
        "#ef476f",
        "#ffd166",
        "#073b4c",
    ];

    const presets: Record<string, Params> = {
        default: {
            colors: DEFAULT_PALETTE.slice(0, 4),
            colorBack: "#330000",
            bandCount: 4,
            twist: 0.1,
            center: 0.2,
            proportion: 0.5,
            softness: 0,
            noise: 0.2,
            noiseFrequency: 0.4,
            scale: 1,
            rotation: 0,
            offsetX: 0,
            offsetY: 0,
            speed: 0.32,
            fit: "contain",
        },
        kaleidoscope: {
            colors: [
                "#ff006e",
                "#fb5607",
                "#ffbe0b",
                "#06d6a0",
                "#3a86ff",
                "#8338ec",
            ],
            colorBack: "#0a0014",
            bandCount: 12,
            twist: 0.7,
            center: 0,
            proportion: 0.5,
            softness: 0.2,
            noise: 0.1,
            noiseFrequency: 0.3,
            scale: 1,
            rotation: 0,
            offsetX: 0,
            offsetY: 0,
            speed: 0.5,
            fit: "contain",
        },
        vortex: {
            colors: ["#ffffff", "#06d6a0", "#1a0033"],
            colorBack: "#000000",
            bandCount: 3,
            twist: 1,
            center: 0.05,
            proportion: 0.4,
            softness: 0.4,
            noise: 0.3,
            noiseFrequency: 0.5,
            scale: 1,
            rotation: 0,
            offsetX: 0,
            offsetY: 0,
            speed: 0.8,
            fit: "contain",
        },
        ripple: {
            colors: ["#001f3f", "#0099d4", "#a3f0d6", "#ffffff"],
            colorBack: "#000a14",
            bandCount: 0,
            twist: 0,
            center: 0,
            proportion: 0.5,
            softness: 1,
            noise: 0,
            noiseFrequency: 0,
            scale: 1,
            rotation: 0,
            offsetX: 0,
            offsetY: 0,
            speed: 0.3,
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
            description: "Stripe colors of the swirl (up to 10).",
            type: "string[]",
            values: "hex / rgb",
        },
        {
            name: "colorBack",
            description: "Background color shown behind the swirl.",
            type: "string",
            values: "hex / rgba",
        },
        {
            name: "bandCount",
            description:
                "Number of color bands. 0 = concentric ripples instead of bands.",
            type: "number",
            values: "0 → 15",
        },
        {
            name: "twist",
            description:
                "Vortex power. 0 = straight pie-slice sectors, 1 = full spiral.",
            type: "number",
            values: "0 → 1",
        },
        {
            name: "center",
            description:
                "How far from the center the swirl colors begin to appear. Higher values leave a hole in the middle.",
            type: "number",
            values: "0 → 1",
        },
        {
            name: "proportion",
            description:
                "Blend point between colors. 0.5 = equal distribution.",
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
            name: "noise",
            description:
                "Noise distortion strength. No effect when noiseFrequency = 0.",
            type: "number",
            values: "0 → 1",
        },
        {
            name: "noiseFrequency",
            description:
                "Frequency of the noise distortion. No effect when noise = 0.",
            type: "number",
            values: "0 → 1",
        },
        {
            name: "speed",
            description: "Animation speed of the swirling motion.",
            type: "number",
            values: "0 → 3",
        },
        {
            name: "fit",
            description: "How the swirl world is fit into the canvas.",
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
        return `import { Swirl } from '@devmischief/shaders-svelte';

<Swirl
  width={1280}
  height={720}
  colors={${colorsLine}}
  colorBack="${params.colorBack}"
  bandCount={${params.bandCount}}
  twist={${params.twist}}
  center={${params.center}}
  proportion={${params.proportion}}
  softness={${params.softness}}
  noise={${params.noise}}
  noiseFrequency={${params.noiseFrequency}}
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
    title="swirl"
    description="Animated bands of colour twisting around a centre — pie-slice sectors at zero twist, full spirals at one. Drop bandCount to zero for concentric ripples."
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
                    <Swirl
                        colors={params.colors}
                        colorBack={params.colorBack}
                        bandCount={params.bandCount}
                        twist={params.twist}
                        center={params.center}
                        proportion={params.proportion}
                        softness={params.softness}
                        noise={params.noise}
                        noiseFrequency={params.noiseFrequency}
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
            <PlaygroundColor
                label="colorBack"
                bind:value={params.colorBack}
                onChange={markCustom}
            />
            <PlaygroundSlider
                label="bandCount"
                bind:value={params.bandCount}
                min={0}
                max={15}
                step={1}
                onChange={markCustom}
            />
            <PlaygroundSlider
                label="twist"
                bind:value={params.twist}
                min={0}
                max={1}
                step={0.01}
                onChange={markCustom}
            />
            <PlaygroundSlider
                label="center"
                bind:value={params.center}
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
                label="noise"
                bind:value={params.noise}
                min={0}
                max={1}
                step={0.01}
                onChange={markCustom}
            />
            <PlaygroundSlider
                label="noiseFrequency"
                bind:value={params.noiseFrequency}
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
