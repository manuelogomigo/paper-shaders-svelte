<script lang="ts">
    import { GemSmoke } from "@devmischief/shaders-svelte";
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

    type Shape = "none" | "circle" | "daisy" | "diamond" | "metaballs";
    type Fit = "cover" | "contain";

    type Params = {
        image?: string;
        colors: string[];
        colorBack: string;
        colorInner: string;
        shape: Shape;
        innerDistortion: number;
        outerDistortion: number;
        outerGlow: number;
        innerGlow: number;
        offset: number;
        angle: number;
        size: number;
        scale: number;
        rotation: number;
        offsetX: number;
        offsetY: number;
        speed: number;
        fit: Fit;
    };

    const shapes = ["none", "circle", "daisy", "diamond", "metaballs"] as const;

    const DEFAULT_PALETTE: string[] = [
        "#1f1147",
        "#5b1d9b",
        "#a04ad9",
        "#ff7eb0",
        "#ffd4e8",
        "#ffffff",
    ];

    const presets: Record<string, Params> = {
        default: {
            colors: DEFAULT_PALETTE.slice(0, 4),
            colorBack: "#f0efea",
            colorInner: "#fafaf5",
            shape: "diamond",
            innerDistortion: 0.8,
            outerDistortion: 0.6,
            outerGlow: 0.55,
            innerGlow: 1,
            offset: 0,
            angle: 0,
            size: 0.8,
            scale: 0.6,
            rotation: 0,
            offsetX: 0,
            offsetY: 0,
            speed: 1,
            fit: "contain",
        },
        amethyst: {
            colors: ["#1f1147", "#5b1d9b", "#a04ad9", "#ff7eb0"],
            colorBack: "#0a0418",
            colorInner: "#2a1450",
            shape: "diamond",
            innerDistortion: 0.9,
            outerDistortion: 0.7,
            outerGlow: 0.6,
            innerGlow: 1,
            offset: 0.1,
            angle: 30,
            size: 0.85,
            scale: 0.6,
            rotation: 0,
            offsetX: 0,
            offsetY: 0,
            speed: 1,
            fit: "contain",
        },
        obsidian: {
            colors: ["#000000", "#1a1a1a", "#444444", "#888888", "#cccccc"],
            colorBack: "#050505",
            colorInner: "#1a1a1a",
            shape: "metaballs",
            innerDistortion: 1,
            outerDistortion: 0.8,
            outerGlow: 0.7,
            innerGlow: 0.9,
            offset: -0.2,
            angle: 90,
            size: 0.9,
            scale: 0.6,
            rotation: 0,
            offsetX: 0,
            offsetY: 0,
            speed: 0.8,
            fit: "contain",
        },
        aurora: {
            colors: ["#001f3f", "#005f7a", "#1ab98c", "#a0eaff", "#ffffff", "#fff5d6"],
            colorBack: "#000a14",
            colorInner: "#03304a",
            shape: "circle",
            innerDistortion: 0.7,
            outerDistortion: 0.85,
            outerGlow: 0.65,
            innerGlow: 0.95,
            offset: 0,
            angle: 60,
            size: 0.85,
            scale: 0.7,
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
            name: "image",
            description:
                "Optional source image used as the gem mask. When omitted, the chosen shape is used.",
            type: "string",
            values: "url",
        },
        {
            name: "colors",
            description: "Smoke gradient colors (up to 6).",
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
            name: "colorInner",
            description: "Additional color mixed into the smoke inside the shape.",
            type: "string",
            values: "hex / rgb",
        },
        {
            name: "shape",
            description:
                "Built-in fallback shape used when no image is provided.",
            type: "string",
            values: shapes.join(" · "),
        },
        {
            name: "innerDistortion",
            description: "Power of smoke distortion inside the shape.",
            type: "number",
            values: "0 → 1",
        },
        {
            name: "outerDistortion",
            description: "Power of smoke distortion outside the shape.",
            type: "number",
            values: "0 → 1",
        },
        {
            name: "outerGlow",
            description: "Visibility of smoke outside the shape.",
            type: "number",
            values: "0 → 1",
        },
        {
            name: "innerGlow",
            description: "Visibility of smoke inside the shape.",
            type: "number",
            values: "0 → 1",
        },
        {
            name: "offset",
            description: "Vertical drift of the smoke inside the shape.",
            type: "number",
            values: "−1 → 1",
        },
        {
            name: "angle",
            description: "Direction of the flowing smoke.",
            type: "number",
            values: "0 → 360°",
        },
        {
            name: "size",
            description: "Size of the smoke shape relative to the image box.",
            type: "number",
            values: "0 → 1",
        },
        {
            name: "speed",
            description: "Animation speed of the smoke.",
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
        return `import { GemSmoke } from '@devmischief/shaders-svelte';

<GemSmoke
  width={1280}
  height={720}${params.image ? `\n  image="${params.image}"` : ""}
  colors={${colorsLine}}
  colorBack="${params.colorBack}"
  colorInner="${params.colorInner}"
  shape="${params.shape}"
  innerDistortion={${params.innerDistortion}}
  outerDistortion={${params.outerDistortion}}
  outerGlow={${params.outerGlow}}
  innerGlow={${params.innerGlow}}
  offset={${params.offset}}
  angle={${params.angle}}
  size={${params.size}}
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
    title="gem smoke"
    description="A glassy gem with animated smoke flowing inside and around it. Up to six smoke colors, configurable distortion, and built-in fallback shapes."
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
                    <GemSmoke
                        image={params.image ?? ""}
                        colors={params.colors}
                        colorBack={params.colorBack}
                        colorInner={params.colorInner}
                        shape={params.shape}
                        innerDistortion={params.innerDistortion}
                        outerDistortion={params.outerDistortion}
                        outerGlow={params.outerGlow}
                        innerGlow={params.innerGlow}
                        offset={params.offset}
                        angle={params.angle}
                        size={params.size}
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
                Upload your own logo or silhouette — or delete the image to use the built-in shape.
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
                max={6}
                min={1}
                onChange={markCustom}
            />
            <PlaygroundColor
                label="colorBack"
                bind:value={params.colorBack}
                onChange={markCustom}
            />
            <PlaygroundColor
                label="colorInner"
                bind:value={params.colorInner}
                onChange={markCustom}
            />
            <PlaygroundSelect
                label="shape"
                bind:value={params.shape}
                options={shapes}
                onChange={markCustom}
            />
            <PlaygroundSlider
                label="innerDistortion"
                bind:value={params.innerDistortion}
                min={0}
                max={1}
                step={0.01}
                onChange={markCustom}
            />
            <PlaygroundSlider
                label="outerDistortion"
                bind:value={params.outerDistortion}
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
                label="innerGlow"
                bind:value={params.innerGlow}
                min={0}
                max={1}
                step={0.01}
                onChange={markCustom}
            />
            <PlaygroundSlider
                label="offset"
                bind:value={params.offset}
                min={-1}
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
                label="size"
                bind:value={params.size}
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
