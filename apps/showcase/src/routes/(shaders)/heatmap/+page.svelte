<script lang="ts">
    import { Heatmap } from "@devmischief/shaders-svelte";
    import AspectRatio from "$lib/aspectRatio.svelte";
    import {
        PlaygroundShell,
        PlaygroundSlider,
        PlaygroundColor,
        PlaygroundColors,
        PlaygroundSelect,
        PlaygroundPresets,
        PlaygroundImageActions,
        type Prop,
    } from "$lib/playground";

    type Fit = "cover" | "contain";

    type Params = {
        image?: string;
        colors: string[];
        colorBack: string;
        contour: number;
        angle: number;
        noise: number;
        innerGlow: number;
        outerGlow: number;
        scale: number;
        rotation: number;
        offsetX: number;
        offsetY: number;
        speed: number;
        fit: Fit;
    };

    const DEFAULT_PALETTE: string[] = [
        "#112069",
        "#1f3ca3",
        "#3265e7",
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
            colors: DEFAULT_PALETTE.slice(0, 7),
            colorBack: "#000000",
            contour: 0.5,
            angle: 0,
            noise: 0,
            innerGlow: 0.5,
            outerGlow: 0.5,
            scale: 0.75,
            rotation: 0,
            offsetX: 0,
            offsetY: 0,
            speed: 1,
            fit: "contain",
        },
        magma: {
            colors: ["#000004", "#3b0f70", "#8c2981", "#de4968", "#fe9f6d", "#fcfdbf"],
            colorBack: "#000004",
            contour: 0.55,
            angle: 30,
            noise: 0.05,
            innerGlow: 0.6,
            outerGlow: 0.4,
            scale: 0.75,
            rotation: 0,
            offsetX: 0,
            offsetY: 0,
            speed: 1,
            fit: "contain",
        },
        lava: {
            colors: ["#1a0500", "#7a1a00", "#d4380c", "#ff8a1f", "#ffe066"],
            colorBack: "#0a0200",
            contour: 0.45,
            angle: 90,
            noise: 0.1,
            innerGlow: 0.7,
            outerGlow: 0.6,
            scale: 0.75,
            rotation: 0,
            offsetX: 0,
            offsetY: 0,
            speed: 1.2,
            fit: "contain",
        },
        frost: {
            colors: ["#01172e", "#073a73", "#1c8ec4", "#7dd6e8", "#f5fbff"],
            colorBack: "#02101f",
            contour: 0.4,
            angle: 45,
            noise: 0,
            innerGlow: 0.6,
            outerGlow: 0.55,
            scale: 0.75,
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
            name: "image",
            description:
                "Source image used as the heat shape. Silhouettes and logos work best.",
            type: "string",
            values: "url",
        },
        {
            name: "colors",
            description: "Heatmap gradient colors (up to 10).",
            type: "string[]",
            values: "hex / rgb",
        },
        {
            name: "colorBack",
            description: "Background color shown behind the shape.",
            type: "string",
            values: "hex / rgba",
        },
        {
            name: "contour",
            description: "Heat intensity near the edges of the shape.",
            type: "number",
            values: "0 → 1",
        },
        {
            name: "angle",
            description: "Direction of the flowing heatwaves.",
            type: "number",
            values: "0 → 360°",
        },
        {
            name: "noise",
            description: "Grain applied across the entire graphic.",
            type: "number",
            values: "0 → 1",
        },
        {
            name: "innerGlow",
            description: "Size of the heated area inside the shape.",
            type: "number",
            values: "0 → 1",
        },
        {
            name: "outerGlow",
            description: "Size of the heated area outside the shape.",
            type: "number",
            values: "0 → 1",
        },
        {
            name: "speed",
            description: "Animation speed of the heatwaves.",
            type: "number",
            values: "0 → 3",
        },
        {
            name: "fit",
            description: "How the source image is fit into the canvas.",
            type: "string",
            values: "cover · contain",
        },
    ];

    const commonProps: Prop[] = [
        {
            name: "scale",
            description: "Overall zoom level of the graphics.",
            type: "number",
            values: "0.01 → 4",
        },
        {
            name: "rotation",
            description: "Overall rotation angle of the graphics.",
            type: "number",
            values: "0 → 360",
        },
        {
            name: "offsetX",
            description: "Horizontal offset of the graphics.",
            type: "number",
            values: "−1 → 1",
        },
        {
            name: "offsetY",
            description: "Vertical offset of the graphics.",
            type: "number",
            values: "−1 → 1",
        },
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
        return `import { Heatmap } from '@devmischief/shaders-svelte';

<Heatmap
  width={1280}
  height={720}${params.image ? `\n  image="${params.image}"` : ""}
  colors={${colorsLine}}
  colorBack="${params.colorBack}"
  contour={${params.contour}}
  angle={${params.angle}}
  noise={${params.noise}}
  innerGlow={${params.innerGlow}}
  outerGlow={${params.outerGlow}}
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
    title="heatmap"
    description="A glowing animated gradient flowing through any silhouette. Up to ten palette colors, controllable wave direction and noise."
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
                    <Heatmap
                        image={params.image}
                        colors={params.colors}
                        colorBack={params.colorBack}
                        contour={params.contour}
                        angle={params.angle}
                        noise={params.noise}
                        innerGlow={params.innerGlow}
                        outerGlow={params.outerGlow}
                        scale={params.scale}
                        rotation={params.rotation}
                        offsetX={params.offsetX}
                        offsetY={params.offsetY}
                        speed={params.speed}
                        fit={params.fit}
                    />
                </div>
            </AspectRatio>
            <span
                class="pointer-events-none mx-auto py-4 text-center text-sm text-pg-text-muted select-none"
            >
                Upload your own silhouette or logo (SVG / PNG with transparency works best).
            </span>
        </div>
    {/snippet}

    {#snippet controls()}
        <PlaygroundPresets
            names={Object.keys(presets)}
            active={activePreset}
            onApply={applyPreset}
        />

        <PlaygroundImageActions
            image={params.image}
            onUpload={(url) => {
                params.image = url;
                markCustom();
            }}
            onDelete={() => {
                params.image = undefined;
                markCustom();
            }}
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
                label="contour"
                bind:value={params.contour}
                min={0}
                max={1}
                step={0.01}
                onChange={markCustom}
            />
            <PlaygroundSlider
                label="angle"
                bind:value={params.angle}
                min={0}
                max={360}
                step={1}
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
                label="innerGlow"
                bind:value={params.innerGlow}
                min={0}
                max={1}
                step={0.01}
                onChange={markCustom}
            />
            <PlaygroundSlider
                label="outerGlow"
                bind:value={params.outerGlow}
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
