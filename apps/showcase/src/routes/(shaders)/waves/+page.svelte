<script lang="ts">
    import { Waves } from "@devmischief/shaders-svelte";
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
        shape: number;
        frequency: number;
        amplitude: number;
        spacing: number;
        proportion: number;
        softness: number;
        scale: number;
        rotation: number;
        offsetX: number;
        offsetY: number;
        fit: Fit;
    };

    const fitOptions = ["none", "cover", "contain"] as const;

    const presets: Record<string, Params> = {
        default: {
            colorBack: "#000000",
            colorFront: "#ffbb00",
            shape: 1,
            frequency: 0.5,
            amplitude: 0.5,
            spacing: 1.2,
            proportion: 0.1,
            softness: 0,
            scale: 0.6,
            rotation: 0,
            offsetX: 0,
            offsetY: 0,
            fit: "none",
        },
        zigzag: {
            colorBack: "#0a0a0a",
            colorFront: "#ff3d6e",
            shape: 0,
            frequency: 0.6,
            amplitude: 0.7,
            spacing: 1,
            proportion: 0.15,
            softness: 0,
            scale: 0.6,
            rotation: 0,
            offsetX: 0,
            offsetY: 0,
            fit: "none",
        },
        liquid: {
            colorBack: "#001f3f",
            colorFront: "#a3f0d6",
            shape: 2.5,
            frequency: 0.4,
            amplitude: 0.8,
            spacing: 1.4,
            proportion: 0.3,
            softness: 0.4,
            scale: 0.6,
            rotation: 0,
            offsetX: 0,
            offsetY: 0,
            fit: "none",
        },
        dense: {
            colorBack: "#fafafa",
            colorFront: "#0a0a0a",
            shape: 1,
            frequency: 1.5,
            amplitude: 0.3,
            spacing: 0.5,
            proportion: 0.5,
            softness: 0.05,
            scale: 0.6,
            rotation: 0,
            offsetX: 0,
            offsetY: 0,
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
            description: "Background color shown behind the waves.",
            type: "string",
            values: "hex / rgba",
        },
        {
            name: "colorFront",
            description: "Wave line color.",
            type: "string",
            values: "hex / rgb",
        },
        {
            name: "shape",
            description:
                "Wave shape morph. 0 = zigzag, 1 = sine, 2–3 = irregular waves. Fractional values blend between shapes.",
            type: "number",
            values: "0 → 3",
        },
        {
            name: "frequency",
            description: "Wave frequency.",
            type: "number",
            values: "0 → 2",
        },
        {
            name: "amplitude",
            description: "Wave amplitude.",
            type: "number",
            values: "0 → 1",
        },
        {
            name: "spacing",
            description: "Space between every two wavy lines.",
            type: "number",
            values: "0 → 2",
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
            name: "fit",
            description: "How the wave pattern is fit into the canvas.",
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

    const code = $derived(`import { Waves } from '@devmischief/shaders-svelte';

<Waves
  width={1280}
  height={720}
  colorBack="${params.colorBack}"
  colorFront="${params.colorFront}"
  shape={${params.shape}}
  frequency={${params.frequency}}
  amplitude={${params.amplitude}}
  spacing={${params.spacing}}
  proportion={${params.proportion}}
  softness={${params.softness}}
  scale={${params.scale}}
  rotation={${params.rotation}}
  offsetX={${params.offsetX}}
  offsetY={${params.offsetY}}
  fit="${params.fit}"
/>`);
</script>

<PlaygroundShell
    title="waves"
    description="A static line pattern that morphs continuously from sharp zigzags to smooth sine waves to irregular flowing forms — fractional shape values blend between them."
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
                    <Waves
                        colorBack={params.colorBack}
                        colorFront={params.colorFront}
                        shape={params.shape}
                        frequency={params.frequency}
                        amplitude={params.amplitude}
                        spacing={params.spacing}
                        proportion={params.proportion}
                        softness={params.softness}
                        scale={params.scale}
                        rotation={params.rotation}
                        offsetX={params.offsetX}
                        offsetY={params.offsetY}
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
                label="shape"
                bind:value={params.shape}
                min={0}
                max={3}
                step={0.01}
                onChange={markCustom}
            />
            <PlaygroundSlider
                label="frequency"
                bind:value={params.frequency}
                min={0}
                max={2}
                step={0.01}
                onChange={markCustom}
            />
            <PlaygroundSlider
                label="amplitude"
                bind:value={params.amplitude}
                min={0}
                max={1}
                step={0.01}
                onChange={markCustom}
            />
            <PlaygroundSlider
                label="spacing"
                bind:value={params.spacing}
                min={0}
                max={2}
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
