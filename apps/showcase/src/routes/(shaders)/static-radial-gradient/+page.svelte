<script lang="ts">
    import { StaticRadialGradient } from "@devmischief/shaders-svelte";
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

    type Fit = "cover" | "contain";

    type Params = {
        colors: string[];
        colorBack: string;
        radius: number;
        focalDistance: number;
        focalAngle: number;
        falloff: number;
        mixing: number;
        distortion: number;
        distortionShift: number;
        distortionFreq: number;
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
        "#00bbff",
        "#00ffe1",
        "#ffffff",
        "#6bd8ff",
        "#ffe77a",
        "#ff9a1f",
        "#ff4d00",
        "#9933cc",
        "#cc3399",
        "#cc3333",
    ];

    const presets: Record<string, Params> = {
        default: {
            colors: DEFAULT_PALETTE.slice(0, 5),
            colorBack: "#191919",
            radius: 0.8,
            focalDistance: 0.99,
            focalAngle: 0,
            falloff: 0.24,
            mixing: 0.5,
            distortion: 0,
            distortionShift: 0,
            distortionFreq: 12,
            grainMixer: 0,
            grainOverlay: 0,
            scale: 1,
            rotation: 0,
            offsetX: 0,
            offsetY: 0,
            speed: 0,
            fit: "contain",
        },
        halo: {
            colors: ["#fff8e7", "#ffd166", "#ff9248", "#ff3d6e", "#5511aa"],
            colorBack: "#0a0014",
            radius: 1.2,
            focalDistance: 0,
            focalAngle: 0,
            falloff: 0.6,
            mixing: 0.9,
            distortion: 0,
            distortionShift: 0,
            distortionFreq: 12,
            grainMixer: 0,
            grainOverlay: 0.1,
            scale: 1,
            rotation: 0,
            offsetX: 0,
            offsetY: 0,
            speed: 0,
            fit: "contain",
        },
        aurora: {
            colors: ["#0d3a5c", "#1ab98c", "#a0eaff", "#ff7eb0", "#ffd4e8"],
            colorBack: "#000a14",
            radius: 1.5,
            focalDistance: 0.5,
            focalAngle: 90,
            falloff: -0.3,
            mixing: 0.7,
            distortion: 0.6,
            distortionShift: 0.2,
            distortionFreq: 6,
            grainMixer: 0,
            grainOverlay: 0.05,
            scale: 1,
            rotation: 0,
            offsetX: 0,
            offsetY: 0,
            speed: 0,
            fit: "contain",
        },
        sunset: {
            colors: ["#ffeb3b", "#ff9248", "#ff3d6e", "#a3196f"],
            colorBack: "#1a0033",
            radius: 1.4,
            focalDistance: 1.0,
            focalAngle: 270,
            falloff: 0.4,
            mixing: 0.8,
            distortion: 0,
            distortionShift: 0,
            distortionFreq: 12,
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
            description: "Radial gradient colors (up to 10).",
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
            name: "radius",
            description: "Size of the radial gradient shape.",
            type: "number",
            values: "0 → 3",
        },
        {
            name: "focalDistance",
            description: "Distance of the focal point from canvas center.",
            type: "number",
            values: "0 → 3",
        },
        {
            name: "focalAngle",
            description:
                "Direction of the focal point. Effective when focalDistance > 0.",
            type: "number",
            values: "0 → 360°",
        },
        {
            name: "falloff",
            description:
                "Gradient decay curve. 0 = linear, negative compresses toward the rim, positive stretches outward.",
            type: "number",
            values: "−1 → 1",
        },
        {
            name: "mixing",
            description:
                "Blend sharpness. 0 = hard stripes, 1 = smooth gradient.",
            type: "number",
            values: "0 → 1",
        },
        {
            name: "distortion",
            description: "Strength of radial distortion.",
            type: "number",
            values: "0 → 1",
        },
        {
            name: "distortionShift",
            description:
                "Radial distortion phase offset. Effective when distortion > 0.",
            type: "number",
            values: "−1 → 1",
        },
        {
            name: "distortionFreq",
            description:
                "Radial distortion frequency. Higher values produce tighter wrinkles.",
            type: "number",
            values: "0 → 20",
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
                "Animation speed. Default 0 — the gradient is static unless you set this above zero.",
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
        return `import { StaticRadialGradient } from '@devmischief/shaders-svelte';

<StaticRadialGradient
  width={1280}
  height={720}
  colors={${colorsLine}}
  colorBack="${params.colorBack}"
  radius={${params.radius}}
  focalDistance={${params.focalDistance}}
  focalAngle={${params.focalAngle}}
  falloff={${params.falloff}}
  mixing={${params.mixing}}
  distortion={${params.distortion}}
  distortionShift={${params.distortionShift}}
  distortionFreq={${params.distortionFreq}}
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
    title="static radial gradient"
    description="A radial gradient with up to ten colors, an off-center focal point, custom falloff curve, and optional radial distortion. Static by default."
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
                class="w-full overflow-hidden rounded-xl bg-pg-surface"
            >
                <div class="flex h-full w-full overflow-hidden">
                    <StaticRadialGradient
                        colors={params.colors}
                        colorBack={params.colorBack}
                        radius={params.radius}
                        focalDistance={params.focalDistance}
                        focalAngle={params.focalAngle}
                        falloff={params.falloff}
                        mixing={params.mixing}
                        distortion={params.distortion}
                        distortionShift={params.distortionShift}
                        distortionFreq={params.distortionFreq}
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
            <PlaygroundColor
                label="colorBack"
                bind:value={params.colorBack}
                onChange={markCustom}
            />
            <PlaygroundSlider
                label="radius"
                bind:value={params.radius}
                min={0}
                max={3}
                step={0.01}
                onChange={markCustom}
            />
            <PlaygroundSlider
                label="focalDistance"
                bind:value={params.focalDistance}
                min={0}
                max={3}
                step={0.01}
                onChange={markCustom}
            />
            <PlaygroundSlider
                label="focalAngle"
                bind:value={params.focalAngle}
                min={0}
                max={360}
                step={1}
                onChange={markCustom}
            />
            <PlaygroundSlider
                label="falloff"
                bind:value={params.falloff}
                min={-1}
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
                label="distortion"
                bind:value={params.distortion}
                min={0}
                max={1}
                step={0.01}
                onChange={markCustom}
            />
            <PlaygroundSlider
                label="distortionShift"
                bind:value={params.distortionShift}
                min={-1}
                max={1}
                step={0.01}
                onChange={markCustom}
            />
            <PlaygroundSlider
                label="distortionFreq"
                bind:value={params.distortionFreq}
                min={0}
                max={20}
                step={0.1}
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
