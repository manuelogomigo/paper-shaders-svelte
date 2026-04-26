<script lang="ts">
    import { PulsingBorder } from "@devmischief/shaders-svelte";
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

    type AspectRatioMode = "auto" | "square";
    type Fit = "none" | "cover" | "contain";

    type Params = {
        colors: string[];
        colorBack: string;
        roundness: number;
        thickness: number;
        softness: number;
        aspectRatio: AspectRatioMode;
        intensity: number;
        bloom: number;
        spots: number;
        spotSize: number;
        pulse: number;
        smoke: number;
        smokeSize: number;
        margin: number;
        scale: number;
        rotation: number;
        offsetX: number;
        offsetY: number;
        speed: number;
        fit: Fit;
    };

    const aspectRatioOptions = ["auto", "square"] as const;
    const fitOptions = ["none", "cover", "contain"] as const;

    const DEFAULT_PALETTE: string[] = [
        "#ff006e",
        "#3a86ff",
        "#06d6a0",
        "#ffbe0b",
        "#8338ec",
    ];

    const presets: Record<string, Params> = {
        default: {
            colors: DEFAULT_PALETTE.slice(0, 3),
            colorBack: "#000000",
            roundness: 0.25,
            thickness: 0.1,
            softness: 0.75,
            aspectRatio: "auto",
            intensity: 0.2,
            bloom: 0.25,
            spots: 4,
            spotSize: 0.5,
            pulse: 0.25,
            smoke: 0.3,
            smokeSize: 0.6,
            margin: 0,
            scale: 0.6,
            rotation: 0,
            offsetX: 0,
            offsetY: 0,
            speed: 1,
            fit: "contain",
        },
        notification: {
            colors: ["#06d6a0"],
            colorBack: "#0a0a0a",
            roundness: 0.5,
            thickness: 0.06,
            softness: 0.4,
            aspectRatio: "auto",
            intensity: 0.4,
            bloom: 0.2,
            spots: 2,
            spotSize: 0.6,
            pulse: 0.6,
            smoke: 0,
            smokeSize: 0.6,
            margin: 0.04,
            scale: 0.6,
            rotation: 0,
            offsetX: 0,
            offsetY: 0,
            speed: 1.5,
            fit: "contain",
        },
        aurora: {
            colors: ["#3a86ff", "#06d6a0", "#a78bfa", "#ff7eb0", "#ffd166"],
            colorBack: "#000a14",
            roundness: 0.3,
            thickness: 0.18,
            softness: 1,
            aspectRatio: "auto",
            intensity: 0.3,
            bloom: 0.5,
            spots: 8,
            spotSize: 0.7,
            pulse: 0.15,
            smoke: 0.6,
            smokeSize: 0.8,
            margin: 0,
            scale: 0.6,
            rotation: 0,
            offsetX: 0,
            offsetY: 0,
            speed: 0.6,
            fit: "contain",
        },
        neon: {
            colors: ["#ff006e", "#8338ec", "#3a86ff"],
            colorBack: "#0a0014",
            roundness: 0.2,
            thickness: 0.08,
            softness: 0.6,
            aspectRatio: "auto",
            intensity: 0.4,
            bloom: 1,
            spots: 6,
            spotSize: 0.4,
            pulse: 0.5,
            smoke: 0,
            smokeSize: 0.6,
            margin: 0,
            scale: 0.6,
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
            description: "Spot colors that flow along the border (up to 5).",
            type: "string[]",
            values: "hex / rgb",
        },
        {
            name: "colorBack",
            description: "Background color shown behind the border.",
            type: "string",
            values: "hex / rgba",
        },
        {
            name: "roundness",
            description: "Corner radius of the border.",
            type: "number",
            values: "0 → 1",
        },
        {
            name: "thickness",
            description: "Base width of the border.",
            type: "number",
            values: "0 → 1",
        },
        {
            name: "softness",
            description:
                "Border edge sharpness. 0 = hard edge, 1 = smooth gradient.",
            type: "number",
            values: "0 → 1",
        },
        {
            name: "aspectRatio",
            description:
                "Aspect ratio mode. auto = follows the canvas, square = forces a square border.",
            type: "string",
            values: aspectRatioOptions.join(" · "),
        },
        {
            name: "intensity",
            description: "Thickness of individual color spots along the border.",
            type: "number",
            values: "0 → 1",
        },
        {
            name: "bloom",
            description:
                "Glow blend mode. 0 = normal blending, 1 = additive blending.",
            type: "number",
            values: "0 → 1",
        },
        {
            name: "spots",
            description: "Number of spots added for each color.",
            type: "number",
            values: "1 → 20",
        },
        {
            name: "spotSize",
            description: "Angular size of each spot along the border.",
            type: "number",
            values: "0 → 1",
        },
        {
            name: "pulse",
            description: "Pulsing animation intensity.",
            type: "number",
            values: "0 → 1",
        },
        {
            name: "smoke",
            description: "Noisy shape extending the border outward.",
            type: "number",
            values: "0 → 1",
        },
        {
            name: "smokeSize",
            description: "Scale of the smoke effect.",
            type: "number",
            values: "0 → 1",
        },
        {
            name: "margin",
            description: "Distance from each canvas edge to the border.",
            type: "number",
            values: "0 → 1",
        },
        {
            name: "speed",
            description: "Animation speed of the flowing spots.",
            type: "number",
            values: "0 → 3",
        },
        {
            name: "fit",
            description: "How the border world is fit into the canvas.",
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
        return `import { PulsingBorder } from '@devmischief/shaders-svelte';

<PulsingBorder
  width={1280}
  height={720}
  colors={${colorsLine}}
  colorBack="${params.colorBack}"
  roundness={${params.roundness}}
  thickness={${params.thickness}}
  softness={${params.softness}}
  aspectRatio="${params.aspectRatio}"
  intensity={${params.intensity}}
  bloom={${params.bloom}}
  spots={${params.spots}}
  spotSize={${params.spotSize}}
  pulse={${params.pulse}}
  smoke={${params.smoke}}
  smokeSize={${params.smokeSize}}
  margin={${params.margin}}
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
    title="pulsing border"
    description="A luminous animated border with flowing spots of colour, optional smoke trails, and pulsing glow. Great for highlighting CTAs or wrapping a hero image."
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
                    <PulsingBorder
                        colors={params.colors}
                        colorBack={params.colorBack}
                        roundness={params.roundness}
                        thickness={params.thickness}
                        softness={params.softness}
                        aspectRatio={params.aspectRatio}
                        intensity={params.intensity}
                        bloom={params.bloom}
                        spots={params.spots}
                        spotSize={params.spotSize}
                        pulse={params.pulse}
                        smoke={params.smoke}
                        smokeSize={params.smokeSize}
                        margin={params.margin}
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
            <PlaygroundSlider
                label="roundness"
                bind:value={params.roundness}
                min={0}
                max={1}
                step={0.01}
                onChange={markCustom}
            />
            <PlaygroundSlider
                label="thickness"
                bind:value={params.thickness}
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
            <PlaygroundSelect
                label="aspectRatio"
                bind:value={params.aspectRatio}
                options={aspectRatioOptions}
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
                label="bloom"
                bind:value={params.bloom}
                min={0}
                max={1}
                step={0.01}
                onChange={markCustom}
            />
            <PlaygroundSlider
                label="spots"
                bind:value={params.spots}
                min={1}
                max={20}
                step={1}
                onChange={markCustom}
            />
            <PlaygroundSlider
                label="spotSize"
                bind:value={params.spotSize}
                min={0}
                max={1}
                step={0.01}
                onChange={markCustom}
            />
            <PlaygroundSlider
                label="pulse"
                bind:value={params.pulse}
                min={0}
                max={1}
                step={0.01}
                onChange={markCustom}
            />
            <PlaygroundSlider
                label="smoke"
                bind:value={params.smoke}
                min={0}
                max={1}
                step={0.01}
                onChange={markCustom}
            />
            <PlaygroundSlider
                label="smokeSize"
                bind:value={params.smokeSize}
                min={0}
                max={1}
                step={0.01}
                onChange={markCustom}
            />
            <PlaygroundSlider
                label="margin"
                bind:value={params.margin}
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
