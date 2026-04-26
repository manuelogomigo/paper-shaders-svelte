<script lang="ts">
    import { SimplexNoise } from "@devmischief/shaders-svelte";
    import AspectRatio from "$lib/aspectRatio.svelte";
    import {
        PlaygroundShell,
        PlaygroundSlider,
        PlaygroundColors,
        PlaygroundSelect,
        PlaygroundPresets,
        type Prop,
    } from "$lib/playground";

    type Fit = "none" | "cover" | "contain";

    type Params = {
        colors: string[];
        stepsPerColor: number;
        softness: number;
        scale: number;
        rotation: number;
        offsetX: number;
        offsetY: number;
        speed: number;
        fit: Fit;
    };

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
            colors: DEFAULT_PALETTE.slice(0, 5),
            stepsPerColor: 2,
            softness: 0,
            scale: 0.2,
            rotation: 0,
            offsetX: 0,
            offsetY: 0,
            speed: 2,
            fit: "none",
        },
        aurora: {
            colors: ["#001f3f", "#005f7a", "#1ab98c", "#a0eaff", "#ff7eb0"],
            stepsPerColor: 4,
            softness: 0.6,
            scale: 0.3,
            rotation: 0,
            offsetX: 0,
            offsetY: 0,
            speed: 0.8,
            fit: "none",
        },
        pastel: {
            colors: [
                "#fce4ec",
                "#f8bbd0",
                "#e1bee7",
                "#d1c4e9",
                "#c5cae9",
                "#b3e5fc",
            ],
            stepsPerColor: 6,
            softness: 0.9,
            scale: 0.4,
            rotation: 0,
            offsetX: 0,
            offsetY: 0,
            speed: 0.5,
            fit: "none",
        },
        posterize: {
            colors: ["#0a0a0a", "#ff006e", "#ffd166", "#06d6a0", "#3a86ff"],
            stepsPerColor: 1,
            softness: 0,
            scale: 0.5,
            rotation: 0,
            offsetX: 0,
            offsetY: 0,
            speed: 1,
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
            description: "Base palette colors (up to 10).",
            type: "string[]",
            values: "hex / rgb",
        },
        {
            name: "stepsPerColor",
            description:
                "Extra interpolated colors generated between each pair of base colors. 1 = N colors, 10 = 10×N.",
            type: "number",
            values: "1 → 10",
        },
        {
            name: "softness",
            description:
                "Color transition sharpness. 0 = hard edge, 1 = smooth gradient.",
            type: "number",
            values: "0 → 1",
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

    const code = $derived.by(() => {
        const colorsLine = `[${params.colors.map((c) => `'${c}'`).join(", ")}]`;
        return `import { SimplexNoise } from '@devmischief/shaders-svelte';

<SimplexNoise
  width={1280}
  height={720}
  colors={${colorsLine}}
  stepsPerColor={${params.stepsPerColor}}
  softness={${params.softness}}
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
    title="simplex noise"
    description="A multi-colour gradient mapped onto a smooth, animated combination of two simplex noises. Pure palette and softness — no other knobs needed."
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
                    <SimplexNoise
                        colors={params.colors}
                        stepsPerColor={params.stepsPerColor}
                        softness={params.softness}
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
                label="stepsPerColor"
                bind:value={params.stepsPerColor}
                min={1}
                max={10}
                step={1}
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
