<script lang="ts">
    import { NeuroNoise } from "@devmischief/shaders-svelte";
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
        colorMid: string;
        colorFront: string;
        brightness: number;
        contrast: number;
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
            colorBack: "#000000",
            colorMid: "#47a6ff",
            colorFront: "#ffffff",
            brightness: 0.05,
            contrast: 0.3,
            scale: 1,
            rotation: 0,
            offsetX: 0,
            offsetY: 0,
            speed: 1,
            fit: "none",
        },
        bio: {
            colorBack: "#001a0a",
            colorMid: "#22aa66",
            colorFront: "#aaffcc",
            brightness: 0.15,
            contrast: 0.5,
            scale: 1,
            rotation: 0,
            offsetX: 0,
            offsetY: 0,
            speed: 0.7,
            fit: "none",
        },
        circuit: {
            colorBack: "#1a0500",
            colorMid: "#ff3d00",
            colorFront: "#ffe066",
            brightness: 0.25,
            contrast: 0.85,
            scale: 1,
            rotation: 0,
            offsetX: 0,
            offsetY: 0,
            speed: 1.2,
            fit: "none",
        },
        mist: {
            colorBack: "#0a0a0a",
            colorMid: "#bbbbbb",
            colorFront: "#ffffff",
            brightness: 0.05,
            contrast: 0.15,
            scale: 1,
            rotation: 0,
            offsetX: 0,
            offsetY: 0,
            speed: 0.4,
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
            description: "Background color shown behind the web.",
            type: "string",
            values: "hex / rgba",
        },
        {
            name: "colorMid",
            description: "Main color of the fluid lines.",
            type: "string",
            values: "hex / rgb",
        },
        {
            name: "colorFront",
            description: "Highlight color at line intersections.",
            type: "string",
            values: "hex / rgb",
        },
        {
            name: "brightness",
            description: "Luminosity of the crossing points.",
            type: "number",
            values: "0 → 1",
        },
        {
            name: "contrast",
            description: "Sharpness of the bright-to-dark transition.",
            type: "number",
            values: "0 → 1",
        },
        {
            name: "speed",
            description: "Animation speed of the flowing web.",
            type: "number",
            values: "0 → 3",
        },
        {
            name: "fit",
            description: "How the pattern is fit into the canvas.",
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

    const code = $derived(`import { NeuroNoise } from '@devmischief/shaders-svelte';

<NeuroNoise
  width={1280}
  height={720}
  colorBack="${params.colorBack}"
  colorMid="${params.colorMid}"
  colorFront="${params.colorFront}"
  brightness={${params.brightness}}
  contrast={${params.contrast}}
  scale={${params.scale}}
  rotation={${params.rotation}}
  offsetX={${params.offsetX}}
  offsetY={${params.offsetY}}
  speed={${params.speed}}
  fit="${params.fit}"
/>`);
</script>

<PlaygroundShell
    title="neuro noise"
    description="A glowing, web-like structure of fluid lines and soft intersections. Atmospheric and organic — three colours and two contrast knobs are all you need."
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
                    <NeuroNoise
                        colorBack={params.colorBack}
                        colorMid={params.colorMid}
                        colorFront={params.colorFront}
                        brightness={params.brightness}
                        contrast={params.contrast}
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
                label="colorMid"
                bind:value={params.colorMid}
                onChange={markCustom}
            />
            <PlaygroundColor
                label="colorFront"
                bind:value={params.colorFront}
                onChange={markCustom}
            />
            <PlaygroundSlider
                label="brightness"
                bind:value={params.brightness}
                min={0}
                max={1}
                step={0.01}
                onChange={markCustom}
            />
            <PlaygroundSlider
                label="contrast"
                bind:value={params.contrast}
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
