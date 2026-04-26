<script lang="ts">
    import { Spiral } from "@devmischief/shaders-svelte";
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
        density: number;
        distortion: number;
        strokeWidth: number;
        strokeTaper: number;
        strokeCap: number;
        noise: number;
        noiseFrequency: number;
        softness: number;
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
            colorBack: "#001429",
            colorFront: "#7ad1ff",
            density: 1,
            distortion: 0,
            strokeWidth: 0.5,
            strokeTaper: 0,
            strokeCap: 0,
            noise: 0,
            noiseFrequency: 0,
            softness: 0,
            scale: 1,
            rotation: 0,
            offsetX: 0,
            offsetY: 0,
            speed: 1,
            fit: "contain",
        },
        whirlpool: {
            colorBack: "#000000",
            colorFront: "#ffffff",
            density: 0.5,
            distortion: 0,
            strokeWidth: 0.5,
            strokeTaper: 0,
            strokeCap: 0.5,
            noise: 0,
            noiseFrequency: 0,
            softness: 0,
            scale: 1,
            rotation: 0,
            offsetX: 0,
            offsetY: 0,
            speed: 0.5,
            fit: "contain",
        },
        tornado: {
            colorBack: "#0a0a14",
            colorFront: "#ff3d6e",
            density: 0.8,
            distortion: 0.7,
            strokeWidth: 0.4,
            strokeTaper: 0.3,
            strokeCap: 0.4,
            noise: 0.3,
            noiseFrequency: 0.5,
            softness: 0.2,
            scale: 1,
            rotation: 0,
            offsetX: 0,
            offsetY: 0,
            speed: 1.8,
            fit: "contain",
        },
        paper: {
            colorBack: "#f7f3e8",
            colorFront: "#0a0a0a",
            density: 0.7,
            distortion: 0.1,
            strokeWidth: 0.35,
            strokeTaper: 0.6,
            strokeCap: 0.2,
            noise: 0.4,
            noiseFrequency: 0.35,
            softness: 0.15,
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
            name: "colorBack",
            description: "Background color shown behind the spiral.",
            type: "string",
            values: "hex / rgba",
        },
        {
            name: "colorFront",
            description: "Spiral ink color.",
            type: "string",
            values: "hex / rgb",
        },
        {
            name: "density",
            description:
                "Spacing falloff that simulates perspective. 0 = evenly-spaced flat spiral, 1 = full perspective.",
            type: "number",
            values: "0 → 1",
        },
        {
            name: "distortion",
            description: "Strength of shape distortion along the spiral path.",
            type: "number",
            values: "0 → 1",
        },
        {
            name: "strokeWidth",
            description: "Thickness of the spiral curve.",
            type: "number",
            values: "0 → 1",
        },
        {
            name: "strokeTaper",
            description:
                "Stroke width loss away from center. 0 = full visibility everywhere.",
            type: "number",
            values: "0 → 1",
        },
        {
            name: "strokeCap",
            description:
                "Extra stroke width at the center. No effect when strokeWidth = 0.5.",
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
            name: "softness",
            description:
                "Color transition sharpness. 0 = hard edge, 1 = smooth gradient.",
            type: "number",
            values: "0 → 1",
        },
        {
            name: "speed",
            description: "Animation speed of the spinning spiral.",
            type: "number",
            values: "0 → 3",
        },
        {
            name: "fit",
            description: "How the spiral world is fit into the canvas.",
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

    const code = $derived(`import { Spiral } from '@devmischief/shaders-svelte';

<Spiral
  width={1280}
  height={720}
  colorBack="${params.colorBack}"
  colorFront="${params.colorFront}"
  density={${params.density}}
  distortion={${params.distortion}}
  strokeWidth={${params.strokeWidth}}
  strokeTaper={${params.strokeTaper}}
  strokeCap={${params.strokeCap}}
  noise={${params.noise}}
  noiseFrequency={${params.noiseFrequency}}
  softness={${params.softness}}
  scale={${params.scale}}
  rotation={${params.rotation}}
  offsetX={${params.offsetX}}
  offsetY={${params.offsetY}}
  speed={${params.speed}}
  fit="${params.fit}"
/>`);
</script>

<PlaygroundShell
    title="spiral"
    description="An animated two-colour spiral with stroke taper, perspective falloff, and noise distortion. Goes from crisp geometry to flowing whirlpool to wavy rings."
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
                    <Spiral
                        colorBack={params.colorBack}
                        colorFront={params.colorFront}
                        density={params.density}
                        distortion={params.distortion}
                        strokeWidth={params.strokeWidth}
                        strokeTaper={params.strokeTaper}
                        strokeCap={params.strokeCap}
                        noise={params.noise}
                        noiseFrequency={params.noiseFrequency}
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
                label="density"
                bind:value={params.density}
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
                label="strokeWidth"
                bind:value={params.strokeWidth}
                min={0}
                max={1}
                step={0.01}
                onChange={markCustom}
            />
            <PlaygroundSlider
                label="strokeTaper"
                bind:value={params.strokeTaper}
                min={0}
                max={1}
                step={0.01}
                onChange={markCustom}
            />
            <PlaygroundSlider
                label="strokeCap"
                bind:value={params.strokeCap}
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
