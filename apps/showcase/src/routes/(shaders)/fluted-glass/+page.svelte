<script lang="ts">
    import { FlutedGlass } from "@devmischief/shaders-svelte";
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

    type GridShape = "lines" | "linesIrregular" | "wave" | "zigzag" | "pattern";
    type DistortionShape = "prism" | "lens" | "contour" | "cascade" | "flat";
    type Fit = "cover" | "contain";

    type Params = {
        image?: string;
        colorBack: string;
        colorShadow: string;
        colorHighlight: string;
        shadows: number;
        highlights: number;
        size: number;
        shape: GridShape;
        angle: number;
        distortionShape: DistortionShape;
        distortion: number;
        shift: number;
        stretch: number;
        blur: number;
        edges: number;
        margin: number;
        grainMixer: number;
        grainOverlay: number;
        scale: number;
        rotation: number;
        offsetX: number;
        offsetY: number;
        fit: Fit;
    };

    const gridShapes = [
        "lines",
        "linesIrregular",
        "wave",
        "zigzag",
        "pattern",
    ] as const;
    const distortionShapes = [
        "prism",
        "lens",
        "contour",
        "cascade",
        "flat",
    ] as const;

    const presets: Record<string, Params> = {
        default: {
            colorBack: "#00000000",
            colorShadow: "#000000",
            colorHighlight: "#ffffff",
            shadows: 0.25,
            highlights: 0.1,
            size: 0.5,
            shape: "lines",
            angle: 0,
            distortionShape: "prism",
            distortion: 0.5,
            shift: 0,
            stretch: 0,
            blur: 0,
            edges: 0.25,
            margin: 0,
            grainMixer: 0,
            grainOverlay: 0,
            scale: 1,
            rotation: 0,
            offsetX: 0,
            offsetY: 0,
            fit: "cover",
        },
        abstract: {
            colorBack: "#00000000",
            colorShadow: "#000000",
            colorHighlight: "#ffffff",
            shadows: 0.0,
            highlights: 0.0,
            size: 0.7,
            shape: "linesIrregular",
            angle: 30,
            distortionShape: "flat",
            distortion: 1.0,
            shift: 0,
            stretch: 1.0,
            blur: 1.0,
            edges: 0.5,
            margin: 0,
            grainMixer: 0.1,
            grainOverlay: 0.1,
            scale: 4.0,
            rotation: 0,
            offsetX: 0,
            offsetY: 0,
            fit: "cover",
        },
        waves: {
            colorBack: "#00000000",
            colorShadow: "#000000",
            colorHighlight: "#ffffff",
            shadows: 0.0,
            highlights: 0.0,
            size: 0.9,
            shape: "wave",
            angle: 0,
            distortionShape: "contour",
            distortion: 0.5,
            shift: 0.0,
            stretch: 1.0,
            blur: 0.1,
            edges: 0.5,
            margin: 0,
            grainMixer: 0,
            grainOverlay: 0.05,
            scale: 1.2,
            rotation: 0,
            offsetX: 0,
            offsetY: 0,
            fit: "cover",
        },
        folds: {
            colorBack: "#00000000",
            colorShadow: "#000000",
            colorHighlight: "#ffffff",
            shadows: 0.4,
            highlights: 0.0,
            size: 0.4,
            shape: "lines",
            angle: 0,
            distortionShape: "cascade",
            distortion: 0.75,
            shift: 0,
            stretch: 0,
            blur: 0.25,
            edges: 0.5,
            margin: 0.1,
            grainMixer: 0,
            grainOverlay: 0,
            scale: 1,
            rotation: 0,
            offsetX: 0,
            offsetY: 0,
            fit: "cover",
        },
    };

    let params = $state<Params>({
        ...presets.default,
        image: "/assets/flowers.webp",
    });
    let activePreset = $state<string>("default");

    function applyPreset(name: string) {
        Object.assign(params, presets[name]);
        activePreset = name;
    }

    function markCustom() {
        if (activePreset !== "custom") activePreset = "custom";
    }

    function randomImage() {
        const n = Math.floor(Math.random() * 16) + 1;
        const filename = n < 10 ? `00${n}.webp` : `00${n}.webp`;
        params.image = `/assets/image-filters/${filename}`;
        markCustom();
    }

    const shaderProps: Prop[] = [
        {
            name: "image",
            description: "Source image filtered by the fluted-glass effect.",
            type: "string",
            values: "url",
        },
        {
            name: "colorBack",
            description:
                "Background color visible through transparent regions.",
            type: "string",
            values: "hex / rgba",
        },
        {
            name: "colorShadow",
            description: "Shadow color blended along the distortion shape.",
            type: "string",
            values: "hex / rgb",
        },
        {
            name: "colorHighlight",
            description: "Highlight color picked out along grid edges.",
            type: "string",
            values: "hex / rgb",
        },
        {
            name: "shadows",
            description: "Strength of the shadow gradient over the image.",
            type: "number",
            values: "0 → 1",
        },
        {
            name: "highlights",
            description: "Strength of the bright strokes along grid edges.",
            type: "number",
            values: "0 → 1",
        },
        {
            name: "size",
            description: "Size of the distortion grid cells.",
            type: "number",
            values: "0 → 1",
        },
        {
            name: "shape",
            description: "Grid pattern that drives the distortion.",
            type: "string",
            values: gridShapes.join(" · "),
        },
        {
            name: "angle",
            description: "Direction of the grid relative to the image.",
            type: "number",
            values: "0 → 180°",
        },
        {
            name: "distortionShape",
            description: "Shape of the distortion within each grid cell.",
            type: "string",
            values: distortionShapes.join(" · "),
        },
        {
            name: "distortion",
            description: "Power of the distortion applied within each stripe.",
            type: "number",
            values: "0 → 1",
        },
        {
            name: "shift",
            description: "Texture shift opposite to the grid direction.",
            type: "number",
            values: "−1 → 1",
        },
        {
            name: "stretch",
            description: "Extra distortion along the grid lines.",
            type: "number",
            values: "0 → 1",
        },
        {
            name: "blur",
            description: "One-directional blur over the image and edges.",
            type: "number",
            values: "0 → 1",
        },
        {
            name: "edges",
            description: "Glass distortion and softness on the image edges.",
            type: "number",
            values: "0 → 1",
        },
        {
            name: "margin",
            description: "Distance from each canvas edge to the effect.",
            type: "number",
            values: "0 → 1",
        },
        {
            name: "grainMixer",
            description: "Grain distortion applied to shape edges.",
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
            name: "speed",
            description: "Animation speed for time-based motion.",
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

    const code =
        $derived(`import { FlutedGlass } from '@devmischief/shaders-svelte';

<FlutedGlass
  width={1280}
  height={720}${params.image ? `\n  image="${params.image}"` : ""}
  colorBack="${params.colorBack}"
  colorShadow="${params.colorShadow}"
  colorHighlight="${params.colorHighlight}"
  shadows={${params.shadows}}
  highlights={${params.highlights}}
  size={${params.size}}
  shape="${params.shape}"
  angle={${params.angle}}
  distortionShape="${params.distortionShape}"
  distortion={${params.distortion}}
  shift={${params.shift}}
  stretch={${params.stretch}}
  blur={${params.blur}}
  edges={${params.edges}}
  margin={${params.margin}}
  grainMixer={${params.grainMixer}}
  grainOverlay={${params.grainOverlay}}
  scale={${params.scale}}
  rotation={${params.rotation}}
  offsetX={${params.offsetX}}
  offsetY={${params.offsetY}}
  fit="${params.fit}"
/>`);
</script>

<PlaygroundShell
    title="fluted glass"
    description="An image filter that streaks the source image into ribbed, prismatic distortions — somewhere between a privacy panel and a beam splitter."
    {code}
    {shaderProps}
    {commonProps}
>
    {#snippet preview()}
        <div
            onclick={randomImage}
            role="button"
            tabindex="0"
            onkeydown={(e) => {
                if (e.key === "Enter" || e.key === " ") randomImage();
            }}
            class="flex min-w-0 flex-1 cursor-pointer flex-col items-center justify-center"
        >
            <AspectRatio
                ratio={16 / 12}
                class="pointer-events-none w-full overflow-hidden rounded-xl border border-pg-border-2 bg-pg-surface"
            >
                <div class="flex h-full w-full overflow-hidden">
                    <FlutedGlass
                        width={1920}
                        height={1080}
                        image={params.image}
                        colorBack={params.colorBack}
                        colorShadow={params.colorShadow}
                        colorHighlight={params.colorHighlight}
                        shadows={params.shadows}
                        highlights={params.highlights}
                        size={params.size}
                        shape={params.shape}
                        angle={params.angle}
                        distortionShape={params.distortionShape}
                        distortion={params.distortion}
                        shift={params.shift}
                        stretch={params.stretch}
                        blur={params.blur}
                        edges={params.edges}
                        margin={params.margin}
                        grainMixer={params.grainMixer}
                        grainOverlay={params.grainOverlay}
                        scale={params.scale}
                        rotation={params.rotation}
                        offsetX={params.offsetX}
                        offsetY={params.offsetY}
                        fit={params.fit}
                    />
                </div>
            </AspectRatio>
            <span
                class="pointer-events-none mx-auto py-4 text-center text-sm text-pg-text-muted select-none"
            >
                Click the preview to load a random sample image.
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
            onRandom={randomImage}
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
                label="colorShadow"
                bind:value={params.colorShadow}
                onChange={markCustom}
            />
            <PlaygroundColor
                label="colorHighlight"
                bind:value={params.colorHighlight}
                onChange={markCustom}
            />
            <PlaygroundSlider
                label="shadows"
                bind:value={params.shadows}
                min={0}
                max={1}
                step={0.01}
                onChange={markCustom}
            />
            <PlaygroundSlider
                label="highlights"
                bind:value={params.highlights}
                min={0}
                max={1}
                step={0.01}
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
            <PlaygroundSelect
                label="shape"
                bind:value={params.shape}
                options={gridShapes}
                onChange={markCustom}
            />
            <PlaygroundSlider
                label="angle"
                bind:value={params.angle}
                min={0}
                max={180}
                step={1}
                onChange={markCustom}
            />
            <PlaygroundSelect
                label="distortionShape"
                bind:value={params.distortionShape}
                options={distortionShapes}
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
                label="shift"
                bind:value={params.shift}
                min={-1}
                max={1}
                step={0.01}
                onChange={markCustom}
            />
            <PlaygroundSlider
                label="stretch"
                bind:value={params.stretch}
                min={0}
                max={1}
                step={0.01}
                onChange={markCustom}
            />
            <PlaygroundSlider
                label="blur"
                bind:value={params.blur}
                min={0}
                max={1}
                step={0.01}
                onChange={markCustom}
            />
            <PlaygroundSlider
                label="edges"
                bind:value={params.edges}
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
