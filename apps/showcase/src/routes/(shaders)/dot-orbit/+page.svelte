<script lang="ts">
    import { DotOrbit } from "@devmischief/shaders-svelte";
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
        stepsPerColor: number;
        size: number;
        sizeRange: number;
        spreading: number;
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
        "#fb5607",
        "#ef476f",
        "#118ab2",
        "#ffd166",
        "#073b4c",
    ];

    const presets: Record<string, Params> = {
        default: {
            colors: DEFAULT_PALETTE.slice(0, 4),
            colorBack: "#000000",
            stepsPerColor: 4,
            size: 1,
            sizeRange: 0,
            spreading: 1,
            scale: 1,
            rotation: 0,
            offsetX: 0,
            offsetY: 0,
            speed: 1.5,
            fit: "none",
        },
        confetti: {
            colors: [
                "#ff006e",
                "#ffbe0b",
                "#06d6a0",
                "#3a86ff",
                "#8338ec",
                "#fb5607",
            ],
            colorBack: "#fafafa",
            stepsPerColor: 2,
            size: 0.7,
            sizeRange: 0.6,
            spreading: 0.9,
            scale: 1,
            rotation: 0,
            offsetX: 0,
            offsetY: 0,
            speed: 1.2,
            fit: "none",
        },
        tight: {
            colors: ["#0a0a0a", "#444444", "#888888", "#cccccc"],
            colorBack: "#fafafa",
            stepsPerColor: 1,
            size: 0.5,
            sizeRange: 0,
            spreading: 0.2,
            scale: 1,
            rotation: 0,
            offsetX: 0,
            offsetY: 0,
            speed: 0.5,
            fit: "none",
        },
        chaos: {
            colors: ["#ff3d6e", "#ffb84d", "#06d6a0", "#3a86ff", "#a78bfa"],
            colorBack: "#10001a",
            stepsPerColor: 4,
            size: 0.9,
            sizeRange: 0.85,
            spreading: 1,
            scale: 1,
            rotation: 0,
            offsetX: 0,
            offsetY: 0,
            speed: 2,
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
            description: "Base dot colors (up to 10).",
            type: "string[]",
            values: "hex / rgb",
        },
        {
            name: "colorBack",
            description: "Background color shown behind the dots.",
            type: "string",
            values: "hex / rgba",
        },
        {
            name: "stepsPerColor",
            description:
                "Extra interpolated colors generated between each pair of base colors. 1 = N colors, 4 = 4×N.",
            type: "number",
            values: "1 → 4",
        },
        {
            name: "size",
            description: "Dot radius relative to cell size.",
            type: "number",
            values: "0 → 1",
        },
        {
            name: "sizeRange",
            description:
                "Random per-dot size variation. 0 = uniform, higher = more variation up to base size.",
            type: "number",
            values: "0 → 1",
        },
        {
            name: "spreading",
            description: "Maximum orbit distance around each cell center.",
            type: "number",
            values: "0 → 1",
        },
        {
            name: "speed",
            description: "Animation speed of the orbits.",
            type: "number",
            values: "0 → 3",
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

    const code = $derived.by(() => {
        const colorsLine = `[${params.colors.map((c) => `'${c}'`).join(", ")}]`;
        return `import { DotOrbit } from '@devmischief/shaders-svelte';

<DotOrbit
  width={1280}
  height={720}
  colors={${colorsLine}}
  colorBack="${params.colorBack}"
  stepsPerColor={${params.stepsPerColor}}
  size={${params.size}}
  sizeRange={${params.sizeRange}}
  spreading={${params.spreading}}
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
    title="dot orbit"
    description="An animated dot field where each dot orbits its own grid cell. Dial in size variation and orbit spread for anything from quiet polka dots to swarming chaos."
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
                    <DotOrbit
                        colors={params.colors}
                        colorBack={params.colorBack}
                        stepsPerColor={params.stepsPerColor}
                        size={params.size}
                        sizeRange={params.sizeRange}
                        spreading={params.spreading}
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
                label="stepsPerColor"
                bind:value={params.stepsPerColor}
                min={1}
                max={4}
                step={1}
                onChange={markCustom}
            />
            <PlaygroundSlider
                label="size"
                bind:value={params.size}
                min={0}
                max={1}
                step={0.01}
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
                label="spreading"
                bind:value={params.spreading}
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
