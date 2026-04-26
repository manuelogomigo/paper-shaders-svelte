<script lang="ts">
    import { SmokeRing } from "@devmischief/shaders-svelte";
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
        noiseScale: number;
        thickness: number;
        radius: number;
        innerShape: number;
        noiseIterations: number;
        scale: number;
        rotation: number;
        offsetX: number;
        offsetY: number;
        speed: number;
        fit: Fit;
    };

    const fitOptions = ["none", "cover", "contain"] as const;

    const DEFAULT_PALETTE: string[] = [
        "#1f1147",
        "#5b1d9b",
        "#a04ad9",
        "#ff7eb0",
        "#ffd4e8",
        "#ffffff",
        "#3a86ff",
        "#06d6a0",
        "#ffbe0b",
        "#073b4c",
    ];

    const presets: Record<string, Params> = {
        default: {
            colors: DEFAULT_PALETTE.slice(0, 4),
            colorBack: "#000000",
            noiseScale: 3,
            thickness: 0.65,
            radius: 0.25,
            innerShape: 0.7,
            noiseIterations: 8,
            scale: 0.8,
            rotation: 0,
            offsetX: 0,
            offsetY: 0,
            speed: 0.5,
            fit: "contain",
        },
        nebula: {
            colors: ["#1f1147", "#5b1d9b", "#a04ad9", "#ff7eb0", "#ffd4e8"],
            colorBack: "#02000a",
            noiseScale: 2.2,
            thickness: 0.8,
            radius: 0.4,
            innerShape: 0.9,
            noiseIterations: 8,
            scale: 0.8,
            rotation: 0,
            offsetX: 0,
            offsetY: 0,
            speed: 0.3,
            fit: "contain",
        },
        aurora: {
            colors: ["#001f3f", "#005f7a", "#1ab98c", "#a0eaff", "#ffffff"],
            colorBack: "#000a14",
            noiseScale: 1.5,
            thickness: 0.55,
            radius: 0.3,
            innerShape: 1.5,
            noiseIterations: 6,
            scale: 0.8,
            rotation: 0,
            offsetX: 0,
            offsetY: 0,
            speed: 0.6,
            fit: "contain",
        },
        vortex: {
            colors: ["#0a0014", "#ff006e", "#ffd166", "#ffffff"],
            colorBack: "#0a0014",
            noiseScale: 4,
            thickness: 0.4,
            radius: 0.18,
            innerShape: 0.5,
            noiseIterations: 8,
            scale: 0.8,
            rotation: 0,
            offsetX: 0,
            offsetY: 0,
            speed: 1,
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
            description: "Smoke gradient colors (up to 10).",
            type: "string[]",
            values: "hex / rgb",
        },
        {
            name: "colorBack",
            description: "Background color shown behind the ring.",
            type: "string",
            values: "hex / rgba",
        },
        {
            name: "noiseScale",
            description:
                "Noise frequency. Low values = big slow waves, high values = tight detail.",
            type: "number",
            values: "0.01 → 5",
        },
        {
            name: "thickness",
            description: "Thickness of the ring shape.",
            type: "number",
            values: "0.01 → 1",
        },
        {
            name: "radius",
            description: "Radius of the ring shape.",
            type: "number",
            values: "0 → 1",
        },
        {
            name: "innerShape",
            description:
                "Ring inner fill amount. Values above 1 fill in the center.",
            type: "number",
            values: "0 → 4",
        },
        {
            name: "noiseIterations",
            description:
                "Layered noise passes. More iterations = more detail, higher GPU cost.",
            type: "number",
            values: "1 → 8",
        },
        {
            name: "speed",
            description: "Animation speed of the smoky drift.",
            type: "number",
            values: "0 → 3",
        },
        {
            name: "fit",
            description: "How the ring world is fit into the canvas.",
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
        return `import { SmokeRing } from '@devmischief/shaders-svelte';

<SmokeRing
  width={1280}
  height={720}
  colors={${colorsLine}}
  colorBack="${params.colorBack}"
  noiseScale={${params.noiseScale}}
  thickness={${params.thickness}}
  radius={${params.radius}}
  innerShape={${params.innerShape}}
  noiseIterations={${params.noiseIterations}}
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
    title="smoke ring"
    description="A radial multi-colour gradient shaped with layered noise — wispy gas clouds, nebulae, and aurora rings."
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
                    <SmokeRing
                        colors={params.colors}
                        colorBack={params.colorBack}
                        noiseScale={params.noiseScale}
                        thickness={params.thickness}
                        radius={params.radius}
                        innerShape={params.innerShape}
                        noiseIterations={params.noiseIterations}
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
                label="noiseScale"
                bind:value={params.noiseScale}
                min={0.01}
                max={5}
                step={0.01}
                onChange={markCustom}
            />
            <PlaygroundSlider
                label="thickness"
                bind:value={params.thickness}
                min={0.01}
                max={1}
                step={0.01}
                onChange={markCustom}
            />
            <PlaygroundSlider
                label="radius"
                bind:value={params.radius}
                min={0}
                max={1}
                step={0.01}
                onChange={markCustom}
            />
            <PlaygroundSlider
                label="innerShape"
                bind:value={params.innerShape}
                min={0}
                max={4}
                step={0.01}
                onChange={markCustom}
            />
            <PlaygroundSlider
                label="noiseIterations"
                bind:value={params.noiseIterations}
                min={1}
                max={8}
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
