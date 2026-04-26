<script lang="ts">
    import { LiquidMetal } from "@devmischief/shaders-svelte";
    import AspectRatio from "$lib/aspectRatio.svelte";
    import {
        PlaygroundShell,
        PlaygroundSlider,
        PlaygroundColor,
        PlaygroundSelect,
        PlaygroundPresets,
        PlaygroundImageActions,
        type Prop,
    } from "$lib/playground";

    type Shape = "none" | "circle" | "daisy" | "diamond" | "metaballs";
    type Fit = "cover" | "contain";

    type Params = {
        image?: string;
        colorBack: string;
        colorTint: string;
        shape: Shape;
        repetition: number;
        softness: number;
        shiftRed: number;
        shiftBlue: number;
        distortion: number;
        contour: number;
        angle: number;
        scale: number;
        rotation: number;
        offsetX: number;
        offsetY: number;
        speed: number;
        fit: Fit;
    };

    const shapes = ["none", "circle", "daisy", "diamond", "metaballs"] as const;

    const presets: Record<string, Params> = {
        default: {
            colorBack: "#aaaaac",
            colorTint: "#ffffff",
            shape: "diamond",
            repetition: 2,
            softness: 0.1,
            shiftRed: 0.3,
            shiftBlue: 0.3,
            distortion: 0.07,
            contour: 0.4,
            angle: 70,
            scale: 0.6,
            rotation: 0,
            offsetX: 0,
            offsetY: 0,
            speed: 1,
            fit: "contain",
        },
        mercury: {
            colorBack: "#9ea1a6",
            colorTint: "#fafafa",
            shape: "metaballs",
            repetition: 1,
            softness: 0.6,
            shiftRed: 0,
            shiftBlue: 0,
            distortion: 0.2,
            contour: 0.6,
            angle: 0,
            scale: 0.7,
            rotation: 0,
            offsetX: 0,
            offsetY: 0,
            speed: 0.5,
            fit: "contain",
        },
        chrome: {
            colorBack: "#0a0a0a",
            colorTint: "#ffffff",
            shape: "diamond",
            repetition: 6,
            softness: 0.05,
            shiftRed: 0.5,
            shiftBlue: 0.5,
            distortion: 0.1,
            contour: 0.7,
            angle: 110,
            scale: 0.6,
            rotation: 0,
            offsetX: 0,
            offsetY: 0,
            speed: 1.5,
            fit: "contain",
        },
        iridescent: {
            colorBack: "#1a0033",
            colorTint: "#ffe3ff",
            shape: "circle",
            repetition: 4,
            softness: 0.4,
            shiftRed: 0.85,
            shiftBlue: 0.85,
            distortion: 0.4,
            contour: 0.5,
            angle: 45,
            scale: 0.7,
            rotation: 0,
            offsetX: 0,
            offsetY: 0,
            speed: 1,
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
                "Optional source image used as the metal mask. When omitted, the chosen shape is used.",
            type: "string",
            values: "url",
        },
        {
            name: "colorBack",
            description: "Background color shown behind the metal.",
            type: "string",
            values: "hex / rgba",
        },
        {
            name: "colorTint",
            description:
                "Overlay color blended onto the metal using colour-burn blending.",
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
            name: "repetition",
            description: "Density of the animated stripe pattern.",
            type: "number",
            values: "1 → 10",
        },
        {
            name: "softness",
            description:
                "Color transition sharpness. 0 = hard edge, 1 = smooth gradient.",
            type: "number",
            values: "0 → 1",
        },
        {
            name: "shiftRed",
            description: "R-channel chromatic dispersion.",
            type: "number",
            values: "−1 → 1",
        },
        {
            name: "shiftBlue",
            description: "B-channel chromatic dispersion.",
            type: "number",
            values: "−1 → 1",
        },
        {
            name: "distortion",
            description: "Noise distortion applied to the stripe pattern.",
            type: "number",
            values: "0 → 1",
        },
        {
            name: "contour",
            description: "Strength of the distortion at the shape edges.",
            type: "number",
            values: "0 → 1",
        },
        {
            name: "angle",
            description: "Direction of the pattern animation.",
            type: "number",
            values: "0 → 360°",
        },
        {
            name: "speed",
            description: "Animation speed of the metal flow.",
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

    const code =
        $derived(`import { LiquidMetal } from '@devmischief/shaders-svelte';

<LiquidMetal
  width={1280}
  height={720}${params.image ? `\n  image="${params.image}"` : ""}
  colorBack="${params.colorBack}"
  colorTint="${params.colorTint}"
  shape="${params.shape}"
  repetition={${params.repetition}}
  softness={${params.softness}}
  shiftRed={${params.shiftRed}}
  shiftBlue={${params.shiftBlue}}
  distortion={${params.distortion}}
  contour={${params.contour}}
  angle={${params.angle}}
  scale={${params.scale}}
  rotation={${params.rotation}}
  offsetX={${params.offsetX}}
  offsetY={${params.offsetY}}
  speed={${params.speed}}
  fit="${params.fit}"
/>`);
</script>

<PlaygroundShell
    title="liquid metal"
    description="A futuristic flowing-metal material applied to a logo, silhouette, or built-in shape. Animated stripe pattern with chromatic dispersion."
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
                    <LiquidMetal
                        image={params.image ?? ""}
                        colorBack={params.colorBack}
                        colorTint={params.colorTint}
                        shape={params.shape}
                        repetition={params.repetition}
                        softness={params.softness}
                        shiftRed={params.shiftRed}
                        shiftBlue={params.shiftBlue}
                        distortion={params.distortion}
                        contour={params.contour}
                        angle={params.angle}
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
            <PlaygroundColor
                label="colorBack"
                bind:value={params.colorBack}
                onChange={markCustom}
            />
            <PlaygroundColor
                label="colorTint"
                bind:value={params.colorTint}
                onChange={markCustom}
            />
            <PlaygroundSelect
                label="shape"
                bind:value={params.shape}
                options={shapes}
                onChange={markCustom}
            />
            <PlaygroundSlider
                label="repetition"
                bind:value={params.repetition}
                min={1}
                max={10}
                step={1}
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
                label="shiftRed"
                bind:value={params.shiftRed}
                min={-1}
                max={1}
                step={0.01}
                onChange={markCustom}
            />
            <PlaygroundSlider
                label="shiftBlue"
                bind:value={params.shiftBlue}
                min={-1}
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
