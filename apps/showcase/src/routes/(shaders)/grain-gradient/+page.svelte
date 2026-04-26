<script lang="ts">
    import { GrainGradient } from "@devmischief/shaders-svelte";
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

    type GrainShape =
        | "wave"
        | "dots"
        | "truchet"
        | "corners"
        | "ripple"
        | "blob"
        | "sphere";
    type Fit = "none" | "cover" | "contain";

    type Params = {
        colors: string[];
        colorBack: string;
        softness: number;
        intensity: number;
        noise: number;
        shape: GrainShape;
        scale: number;
        rotation: number;
        offsetX: number;
        offsetY: number;
        speed: number;
        fit: Fit;
    };

    const grainShapes = [
        "wave",
        "dots",
        "truchet",
        "corners",
        "ripple",
        "blob",
        "sphere",
    ] as const;
    const fitOptions = ["none", "cover", "contain"] as const;

    const DEFAULT_PALETTE: string[] = [
        "#3a86ff",
        "#06d6a0",
        "#ffd166",
        "#ef476f",
        "#8338ec",
        "#118ab2",
        "#fb5607",
    ];

    const presets: Record<string, Params> = {
        default: {
            colors: DEFAULT_PALETTE.slice(0, 4),
            colorBack: "#000000",
            softness: 0.5,
            intensity: 0.5,
            noise: 0.25,
            shape: "corners",
            scale: 1,
            rotation: 0,
            offsetX: 0,
            offsetY: 0,
            speed: 1,
            fit: "contain",
        },
        cosmic: {
            colors: ["#0a0033", "#3d1574", "#8338ec", "#a76bff", "#e0caff"],
            colorBack: "#02000a",
            softness: 0.8,
            intensity: 0.6,
            noise: 0.3,
            shape: "sphere",
            scale: 1,
            rotation: 0,
            offsetX: 0,
            offsetY: 0,
            speed: 0.6,
            fit: "contain",
        },
        flow: {
            colors: ["#00343a", "#0d6e80", "#1ab98c", "#7be8b6", "#daf6e8"],
            colorBack: "#001f24",
            softness: 1,
            intensity: 0.45,
            noise: 0.15,
            shape: "blob",
            scale: 1,
            rotation: 0,
            offsetX: 0,
            offsetY: 0,
            speed: 0.8,
            fit: "contain",
        },
        pop: {
            colors: ["#ff006e", "#ffbe0b", "#06d6a0", "#3a86ff"],
            colorBack: "#0a0a0a",
            softness: 0.3,
            intensity: 0.85,
            noise: 0.55,
            shape: "corners",
            scale: 1,
            rotation: 0,
            offsetX: 0,
            offsetY: 0,
            speed: 1.2,
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
            description: "Gradient colors (up to 7).",
            type: "string[]",
            values: "hex / rgb",
        },
        {
            name: "colorBack",
            description: "Background color shown beyond the gradient.",
            type: "string",
            values: "hex / rgba",
        },
        {
            name: "shape",
            description: "Underlying gradient shape.",
            type: "string",
            values: grainShapes.join(" · "),
        },
        {
            name: "softness",
            description:
                "Color transition sharpness. 0 = hard edge, 1 = smooth gradient.",
            type: "number",
            values: "0 → 1",
        },
        {
            name: "intensity",
            description: "Distortion power between color bands.",
            type: "number",
            values: "0 → 1",
        },
        {
            name: "noise",
            description: "Strength of the grainy noise overlay.",
            type: "number",
            values: "0 → 1",
        },
        {
            name: "speed",
            description: "Animation speed of the gradient.",
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
        return `import { GrainGradient } from '@devmischief/shaders-svelte';

<GrainGradient
  width={1280}
  height={720}
  colors={${colorsLine}}
  colorBack="${params.colorBack}"
  shape="${params.shape}"
  softness={${params.softness}}
  intensity={${params.intensity}}
  noise={${params.noise}}
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
    title="grain gradient"
    description="A multi-colour gradient with grainy texture, available in seven animated abstract forms — from soft blobs to sharp corners to ripples and spheres."
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
                    <GrainGradient
                        colors={params.colors}
                        colorBack={params.colorBack}
                        softness={params.softness}
                        intensity={params.intensity}
                        noise={params.noise}
                        shape={params.shape}
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
                max={7}
                min={1}
                onChange={markCustom}
            />
            <PlaygroundColor
                label="colorBack"
                bind:value={params.colorBack}
                onChange={markCustom}
            />
            <PlaygroundSelect
                label="shape"
                bind:value={params.shape}
                options={grainShapes}
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
                label="intensity"
                bind:value={params.intensity}
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
