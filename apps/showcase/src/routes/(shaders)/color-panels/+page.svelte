<script lang="ts">
    import { ColorPanels } from "@devmischief/shaders-svelte";
    import AspectRatio from "$lib/aspectRatio.svelte";
    import {
        PlaygroundShell,
        PlaygroundSlider,
        PlaygroundColor,
        PlaygroundColors,
        PlaygroundSelect,
        PlaygroundToggle,
        PlaygroundPresets,
        type Prop,
    } from "$lib/playground";

    type Fit = "none" | "cover" | "contain";

    type Params = {
        colors: string[];
        colorBack: string;
        density: number;
        angle1: number;
        angle2: number;
        length: number;
        edges: boolean;
        blur: number;
        fadeIn: number;
        fadeOut: number;
        gradient: number;
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
        "#3a86ff",
        "#06d6a0",
        "#ffbe0b",
        "#8338ec",
        "#fb5607",
        "#ef476f",
    ];

    const presets: Record<string, Params> = {
        default: {
            colors: DEFAULT_PALETTE.slice(0, 4),
            colorBack: "#000000",
            density: 3,
            angle1: 0,
            angle2: 0,
            length: 1.1,
            edges: true,
            blur: 0,
            fadeIn: 1,
            fadeOut: 0.3,
            gradient: 0,
            scale: 0.8,
            rotation: 0,
            offsetX: 0,
            offsetY: 0,
            speed: 0.5,
            fit: "contain",
        },
        kaleidoscope: {
            colors: [
                "#ff006e",
                "#fb5607",
                "#ffbe0b",
                "#06d6a0",
                "#3a86ff",
                "#8338ec",
            ],
            colorBack: "#0a0014",
            density: 1,
            angle1: 0,
            angle2: 0,
            length: 1.5,
            edges: false,
            blur: 0.05,
            fadeIn: 0.5,
            fadeOut: 0.2,
            gradient: 1,
            scale: 0.8,
            rotation: 0,
            offsetX: 0,
            offsetY: 0,
            speed: 0.7,
            fit: "contain",
        },
        glass: {
            colors: ["#a0eaff", "#7eb6ff", "#ffffff"],
            colorBack: "#02101f",
            density: 4,
            angle1: 0.2,
            angle2: -0.2,
            length: 1.2,
            edges: true,
            blur: 0.4,
            fadeIn: 0.9,
            fadeOut: 0.6,
            gradient: 0.5,
            scale: 0.8,
            rotation: 0,
            offsetX: 0,
            offsetY: 0,
            speed: 0.3,
            fit: "contain",
        },
        prism: {
            colors: ["#ff3d6e", "#ffbe0b", "#06d6a0", "#3a86ff", "#8338ec"],
            colorBack: "#0a0a0a",
            density: 1.5,
            angle1: 0.4,
            angle2: 0.4,
            length: 2,
            edges: true,
            blur: 0,
            fadeIn: 0.7,
            fadeOut: 0.1,
            gradient: 0,
            scale: 0.8,
            rotation: 0,
            offsetX: 0,
            offsetY: 0,
            speed: 0.6,
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
            description: "Panel colors (up to 7).",
            type: "string[]",
            values: "hex / rgb",
        },
        {
            name: "colorBack",
            description: "Background color shown behind the panels.",
            type: "string",
            values: "hex / rgba",
        },
        {
            name: "density",
            description: "Angle between every two panels.",
            type: "number",
            values: "0.25 → 7",
        },
        {
            name: "angle1",
            description: "First skew angle applied to all panels.",
            type: "number",
            values: "−1 → 1",
        },
        {
            name: "angle2",
            description: "Second skew angle applied to all panels.",
            type: "number",
            values: "−1 → 1",
        },
        {
            name: "length",
            description: "Panel length relative to total height.",
            type: "number",
            values: "0 → 3",
        },
        {
            name: "edges",
            description: "Color highlight along the panel edges.",
            type: "boolean",
            values: "true · false",
        },
        {
            name: "blur",
            description: "Side blur. 0 = sharp edges.",
            type: "number",
            values: "0 → 0.5",
        },
        {
            name: "fadeIn",
            description: "Transparency near the central axis.",
            type: "number",
            values: "0 → 1",
        },
        {
            name: "fadeOut",
            description: "Transparency near the viewer.",
            type: "number",
            values: "0 → 1",
        },
        {
            name: "gradient",
            description:
                "Color mixing within a panel. 0 = solid, 1 = gradient.",
            type: "number",
            values: "0 → 1",
        },
        {
            name: "speed",
            description: "Rotation speed of the panels.",
            type: "number",
            values: "0 → 3",
        },
        {
            name: "fit",
            description: "How the panels world is fit into the canvas.",
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
        return `import { ColorPanels } from '@devmischief/shaders-svelte';

<ColorPanels
  width={1280}
  height={720}
  colors={${colorsLine}}
  colorBack="${params.colorBack}"
  density={${params.density}}
  angle1={${params.angle1}}
  angle2={${params.angle2}}
  length={${params.length}}
  edges={${params.edges}}
  blur={${params.blur}}
  fadeIn={${params.fadeIn}}
  fadeOut={${params.fadeOut}}
  gradient={${params.gradient}}
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
    title="color panels"
    description="Pseudo-3D semi-transparent panels rotating around a central axis. Skew, blur, and fade for kaleidoscope, glass-slat, and prism looks."
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
                    <ColorPanels
                        colors={params.colors}
                        colorBack={params.colorBack}
                        density={params.density}
                        angle1={params.angle1}
                        angle2={params.angle2}
                        length={params.length}
                        edges={params.edges}
                        blur={params.blur}
                        fadeIn={params.fadeIn}
                        fadeOut={params.fadeOut}
                        gradient={params.gradient}
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
            <PlaygroundSlider
                label="density"
                bind:value={params.density}
                min={0.25}
                max={7}
                step={0.05}
                onChange={markCustom}
            />
            <PlaygroundSlider
                label="angle1"
                bind:value={params.angle1}
                min={-1}
                max={1}
                step={0.01}
                onChange={markCustom}
            />
            <PlaygroundSlider
                label="angle2"
                bind:value={params.angle2}
                min={-1}
                max={1}
                step={0.01}
                onChange={markCustom}
            />
            <PlaygroundSlider
                label="length"
                bind:value={params.length}
                min={0}
                max={3}
                step={0.01}
                onChange={markCustom}
            />
            <PlaygroundToggle
                label="edges"
                bind:value={params.edges}
                onChange={markCustom}
            />
            <PlaygroundSlider
                label="blur"
                bind:value={params.blur}
                min={0}
                max={0.5}
                step={0.005}
                onChange={markCustom}
            />
            <PlaygroundSlider
                label="fadeIn"
                bind:value={params.fadeIn}
                min={0}
                max={1}
                step={0.01}
                onChange={markCustom}
            />
            <PlaygroundSlider
                label="fadeOut"
                bind:value={params.fadeOut}
                min={0}
                max={1}
                step={0.01}
                onChange={markCustom}
            />
            <PlaygroundSlider
                label="gradient"
                bind:value={params.gradient}
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
