<script lang="ts">
    import { StaticMeshGradient } from "@devmischief/shaders-svelte";
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
        positions: number;
        waveX: number;
        waveXShift: number;
        waveY: number;
        waveYShift: number;
        mixing: number;
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
        "#3a86ff",
        "#8338ec",
        "#ff006e",
        "#fb5607",
        "#ffbe0b",
        "#06d6a0",
        "#118ab2",
        "#073b4c",
        "#ef476f",
        "#ffd166",
    ];

    const presets: Record<string, Params> = {
        default: {
            colors: DEFAULT_PALETTE.slice(0, 5),
            positions: 2,
            waveX: 1,
            waveXShift: 0.6,
            waveY: 1,
            waveYShift: 0.21,
            mixing: 0.93,
            grainMixer: 0,
            grainOverlay: 0,
            scale: 1,
            rotation: 270,
            offsetX: 0,
            offsetY: 0,
            speed: 0,
            fit: "contain",
        },
        synthwave: {
            colors: ["#0a0033", "#5511aa", "#ff00ff", "#00ddff", "#ffeb3b"],
            positions: 7,
            waveX: 0.8,
            waveXShift: 0.5,
            waveY: 1,
            waveYShift: 0.3,
            mixing: 0.4,
            grainMixer: 0,
            grainOverlay: 0.05,
            scale: 1,
            rotation: 0,
            offsetX: 0,
            offsetY: 0,
            speed: 0,
            fit: "contain",
        },
        pastel: {
            colors: ["#fde2e4", "#fad2e1", "#cddafd", "#bee1e6", "#dbe7e4"],
            positions: 4,
            waveX: 0.7,
            waveXShift: 0.2,
            waveY: 0.7,
            waveYShift: 0.7,
            mixing: 1,
            grainMixer: 0.2,
            grainOverlay: 0.15,
            scale: 1,
            rotation: 270,
            offsetX: 0,
            offsetY: 0,
            speed: 0,
            fit: "contain",
        },
        tropical: {
            colors: ["#06d6a0", "#118ab2", "#ffd166", "#ef476f", "#fb5607"],
            positions: 11,
            waveX: 1,
            waveXShift: 0.8,
            waveY: 0.9,
            waveYShift: 0.4,
            mixing: 0.85,
            grainMixer: 0,
            grainOverlay: 0,
            scale: 1,
            rotation: 0,
            offsetX: 0,
            offsetY: 0,
            speed: 0,
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
            name: "positions",
            description:
                "Seed for color-spot placement. Each integer produces a different layout.",
            type: "number",
            values: "0 → 100",
        },
        {
            name: "waveX",
            description: "Strength of the X-axis sine wave distortion.",
            type: "number",
            values: "0 → 1",
        },
        {
            name: "waveXShift",
            description: "Phase offset of the X-axis wave.",
            type: "number",
            values: "0 → 1",
        },
        {
            name: "waveY",
            description: "Strength of the Y-axis sine wave distortion.",
            type: "number",
            values: "0 → 1",
        },
        {
            name: "waveYShift",
            description: "Phase offset of the Y-axis wave.",
            type: "number",
            values: "0 → 1",
        },
        {
            name: "mixing",
            description:
                "Blend sharpness. 0 = hard stripes, 0.5 = smooth bands, 1 = gradual blend.",
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
            description:
                "Animation speed. Default 0 — the mesh is static unless you set this above zero.",
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
        return `import { StaticMeshGradient } from '@devmischief/shaders-svelte';

<StaticMeshGradient
  width={1280}
  height={720}
  colors={${colorsLine}}
  positions={${params.positions}}
  waveX={${params.waveX}}
  waveXShift={${params.waveXShift}}
  waveY={${params.waveY}}
  waveYShift={${params.waveYShift}}
  mixing={${params.mixing}}
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
    title="static mesh gradient"
    description="A multi-point mesh gradient driven by two perpendicular sine waves. Static by default — flip a layout seed, or animate by setting speed above zero."
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
                    <StaticMeshGradient
                        colors={params.colors}
                        positions={params.positions}
                        waveX={params.waveX}
                        waveXShift={params.waveXShift}
                        waveY={params.waveY}
                        waveYShift={params.waveYShift}
                        mixing={params.mixing}
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
                label="positions"
                bind:value={params.positions}
                min={0}
                max={100}
                step={1}
                onChange={markCustom}
            />
            <PlaygroundSlider
                label="waveX"
                bind:value={params.waveX}
                min={0}
                max={1}
                step={0.01}
                onChange={markCustom}
            />
            <PlaygroundSlider
                label="waveXShift"
                bind:value={params.waveXShift}
                min={0}
                max={1}
                step={0.01}
                onChange={markCustom}
            />
            <PlaygroundSlider
                label="waveY"
                bind:value={params.waveY}
                min={0}
                max={1}
                step={0.01}
                onChange={markCustom}
            />
            <PlaygroundSlider
                label="waveYShift"
                bind:value={params.waveYShift}
                min={0}
                max={1}
                step={0.01}
                onChange={markCustom}
            />
            <PlaygroundSlider
                label="mixing"
                bind:value={params.mixing}
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
