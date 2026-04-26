<script lang="ts">
    import { HalftoneCMYK } from "@devmischief/shaders-svelte";
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

    type DotsType = "dots" | "ink" | "sharp";
    type Fit = "cover" | "contain";

    type Params = {
        image?: string;
        colorBack: string;
        colorC: string;
        colorM: string;
        colorY: string;
        colorK: string;
        size: number;
        gridNoise: number;
        type: DotsType;
        softness: number;
        contrast: number;
        floodC: number;
        floodM: number;
        floodY: number;
        floodK: number;
        gainC: number;
        gainM: number;
        gainY: number;
        gainK: number;
        grainMixer: number;
        grainOverlay: number;
        grainSize: number;
        scale: number;
        rotation: number;
        offsetX: number;
        offsetY: number;
        fit: Fit;
    };

    const dotsTypes = ["dots", "ink", "sharp"] as const;

    const presets: Record<string, Params> = {
        default: {
            colorBack: "#fbfaf4",
            colorC: "#00b3ff",
            colorM: "#fc4f9d",
            colorY: "#ffd900",
            colorK: "#231f20",
            size: 0.2,
            gridNoise: 0.2,
            type: "ink",
            softness: 1,
            contrast: 1,
            floodC: 0.15,
            floodM: 0,
            floodY: 0,
            floodK: 0,
            gainC: 0.3,
            gainM: 0,
            gainY: 0.2,
            gainK: 0,
            grainMixer: 0,
            grainOverlay: 0,
            grainSize: 0.5,
            scale: 1,
            rotation: 0,
            offsetX: 0,
            offsetY: 0,
            fit: "cover",
        },
        newsprint: {
            colorBack: "#f8f5ec",
            colorC: "#0099d6",
            colorM: "#d61f6b",
            colorY: "#e4c100",
            colorK: "#0d0d0d",
            size: 0.18,
            gridNoise: 0,
            type: "sharp",
            softness: 0.2,
            contrast: 1.4,
            floodC: 0,
            floodM: 0,
            floodY: 0,
            floodK: 0.1,
            gainC: 0,
            gainM: 0,
            gainY: 0,
            gainK: 0.3,
            grainMixer: 0,
            grainOverlay: 0.15,
            grainSize: 0.5,
            scale: 1,
            rotation: 0,
            offsetX: 0,
            offsetY: 0,
            fit: "cover",
        },
        vintage: {
            colorBack: "#f0e3c2",
            colorC: "#5fa6c9",
            colorM: "#c66890",
            colorY: "#d6b545",
            colorK: "#3a2e25",
            size: 0.28,
            gridNoise: 0.4,
            type: "ink",
            softness: 1,
            contrast: 0.8,
            floodC: -0.1,
            floodM: -0.1,
            floodY: -0.1,
            floodK: -0.2,
            gainC: 0.2,
            gainM: 0.2,
            gainY: 0.2,
            gainK: 0.1,
            grainMixer: 0.3,
            grainOverlay: 0.4,
            grainSize: 0.6,
            scale: 1,
            rotation: 0,
            offsetX: 0,
            offsetY: 0,
            fit: "cover",
        },
        bw: {
            colorBack: "#ffffff",
            colorC: "#00b3ff",
            colorM: "#fc4f9d",
            colorY: "#ffd900",
            colorK: "#0a0a0a",
            size: 0.2,
            gridNoise: 0.1,
            type: "dots",
            softness: 0.6,
            contrast: 1.2,
            floodC: -1,
            floodM: -1,
            floodY: -1,
            floodK: 0.1,
            gainC: 0,
            gainM: 0,
            gainY: 0,
            gainK: 0.4,
            grainMixer: 0,
            grainOverlay: 0,
            grainSize: 0.5,
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
            description: "Source image processed into CMYK halftone print.",
            type: "string",
            values: "url",
        },
        {
            name: "colorBack",
            description: "Paper color shown behind the inks.",
            type: "string",
            values: "hex / rgba",
        },
        {
            name: "colorC",
            description: "Cyan ink color.",
            type: "string",
            values: "hex / rgb",
        },
        {
            name: "colorM",
            description: "Magenta ink color.",
            type: "string",
            values: "hex / rgb",
        },
        {
            name: "colorY",
            description: "Yellow ink color.",
            type: "string",
            values: "hex / rgb",
        },
        {
            name: "colorK",
            description: "Black (key) ink color.",
            type: "string",
            values: "hex / rgb",
        },
        {
            name: "type",
            description: "Dot rendering style.",
            type: "string",
            values: dotsTypes.join(" · "),
        },
        {
            name: "size",
            description: "Halftone cell size relative to the image.",
            type: "number",
            values: "0 → 1",
        },
        {
            name: "gridNoise",
            description:
                "Smooth noise applied to dot positions and color sampling.",
            type: "number",
            values: "0 → 1",
        },
        {
            name: "softness",
            description: "Edge softness of the dots.",
            type: "number",
            values: "0 → 1",
        },
        {
            name: "contrast",
            description: "Contrast applied to the sampled image.",
            type: "number",
            values: "0 → 2",
        },
        {
            name: "floodC",
            description:
                "Uniform cyan dot size offset. Negative shrinks, positive grows the entire channel.",
            type: "number",
            values: "−1 → 1",
        },
        {
            name: "floodM",
            description: "Uniform magenta dot size offset.",
            type: "number",
            values: "−1 → 1",
        },
        {
            name: "floodY",
            description: "Uniform yellow dot size offset.",
            type: "number",
            values: "−1 → 1",
        },
        {
            name: "floodK",
            description: "Uniform black dot size offset.",
            type: "number",
            values: "−1 → 1",
        },
        {
            name: "gainC",
            description:
                "Proportional cyan dot size gain. Boosts only where dots already exist.",
            type: "number",
            values: "−1 → 1",
        },
        {
            name: "gainM",
            description: "Proportional magenta dot size gain.",
            type: "number",
            values: "−1 → 1",
        },
        {
            name: "gainY",
            description: "Proportional yellow dot size gain.",
            type: "number",
            values: "−1 → 1",
        },
        {
            name: "gainK",
            description: "Proportional black dot size gain.",
            type: "number",
            values: "−1 → 1",
        },
        {
            name: "grainMixer",
            description: "Grain distortion applied to dot edges.",
            type: "number",
            values: "0 → 1",
        },
        {
            name: "grainOverlay",
            description: "Post-process grain overlay on the final output.",
            type: "number",
            values: "0 → 1",
        },
        {
            name: "grainSize",
            description: "Scale of the grain distortion and overlay.",
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
        $derived(`import { HalftoneCMYK } from '@devmischief/shaders-svelte';

<HalftoneCMYK
  width={1280}
  height={720}${params.image ? `\n  image="${params.image}"` : ""}
  colorBack="${params.colorBack}"
  colorC="${params.colorC}"
  colorM="${params.colorM}"
  colorY="${params.colorY}"
  colorK="${params.colorK}"
  type="${params.type}"
  size={${params.size}}
  gridNoise={${params.gridNoise}}
  softness={${params.softness}}
  contrast={${params.contrast}}
  floodC={${params.floodC}}
  floodM={${params.floodM}}
  floodY={${params.floodY}}
  floodK={${params.floodK}}
  gainC={${params.gainC}}
  gainM={${params.gainM}}
  gainY={${params.gainY}}
  gainK={${params.gainK}}
  grainMixer={${params.grainMixer}}
  grainOverlay={${params.grainOverlay}}
  grainSize={${params.grainSize}}
  scale={${params.scale}}
  rotation={${params.rotation}}
  offsetX={${params.offsetX}}
  offsetY={${params.offsetY}}
  fit="${params.fit}"
/>`);
</script>

<PlaygroundShell
    title="halftone cmyk"
    description="A four-colour process halftone — separates the image into cyan, magenta, yellow and black channels, each with its own ink colour and dot-size controls."
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
                    <HalftoneCMYK
                        width={1920}
                        height={1080}
                        image={params.image}
                        colorBack={params.colorBack}
                        colorC={params.colorC}
                        colorM={params.colorM}
                        colorY={params.colorY}
                        colorK={params.colorK}
                        type={params.type}
                        size={params.size}
                        gridNoise={params.gridNoise}
                        softness={params.softness}
                        contrast={params.contrast}
                        floodC={params.floodC}
                        floodM={params.floodM}
                        floodY={params.floodY}
                        floodK={params.floodK}
                        gainC={params.gainC}
                        gainM={params.gainM}
                        gainY={params.gainY}
                        gainK={params.gainK}
                        grainMixer={params.grainMixer}
                        grainOverlay={params.grainOverlay}
                        grainSize={params.grainSize}
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
                label="colorC"
                bind:value={params.colorC}
                onChange={markCustom}
            />
            <PlaygroundColor
                label="colorM"
                bind:value={params.colorM}
                onChange={markCustom}
            />
            <PlaygroundColor
                label="colorY"
                bind:value={params.colorY}
                onChange={markCustom}
            />
            <PlaygroundColor
                label="colorK"
                bind:value={params.colorK}
                onChange={markCustom}
            />
            <PlaygroundSelect
                label="type"
                bind:value={params.type}
                options={dotsTypes}
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
                label="gridNoise"
                bind:value={params.gridNoise}
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
                label="contrast"
                bind:value={params.contrast}
                min={0}
                max={2}
                step={0.01}
                onChange={markCustom}
            />
            <PlaygroundSlider
                label="floodC"
                bind:value={params.floodC}
                min={-1}
                max={1}
                step={0.01}
                onChange={markCustom}
            />
            <PlaygroundSlider
                label="floodM"
                bind:value={params.floodM}
                min={-1}
                max={1}
                step={0.01}
                onChange={markCustom}
            />
            <PlaygroundSlider
                label="floodY"
                bind:value={params.floodY}
                min={-1}
                max={1}
                step={0.01}
                onChange={markCustom}
            />
            <PlaygroundSlider
                label="floodK"
                bind:value={params.floodK}
                min={-1}
                max={1}
                step={0.01}
                onChange={markCustom}
            />
            <PlaygroundSlider
                label="gainC"
                bind:value={params.gainC}
                min={-1}
                max={1}
                step={0.01}
                onChange={markCustom}
            />
            <PlaygroundSlider
                label="gainM"
                bind:value={params.gainM}
                min={-1}
                max={1}
                step={0.01}
                onChange={markCustom}
            />
            <PlaygroundSlider
                label="gainY"
                bind:value={params.gainY}
                min={-1}
                max={1}
                step={0.01}
                onChange={markCustom}
            />
            <PlaygroundSlider
                label="gainK"
                bind:value={params.gainK}
                min={-1}
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
                label="grainSize"
                bind:value={params.grainSize}
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
