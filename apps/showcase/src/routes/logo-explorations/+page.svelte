<script lang="ts">
    import { FlutedGlass, PulsingBorder } from "@devmischief/shaders-svelte";
    import DevMischiefMark from "$lib/DevMischiefMark.svelte";

    type Exploration = {
        id: string;
        name: string;
        direction: string;
    };

    const chunkLetters = "DEVMISCHIEF".split("");
    const chunkTransforms = [
        "rotate(-3deg) translateY(0)",
        "rotate(2deg) translateY(-2px)",
        "rotate(-1deg) translateY(1px)",
        "rotate(1deg) translateY(-1px)",
        "rotate(-2deg) translateY(0)",
        "rotate(0deg) translateY(1px)",
        "rotate(2deg) translateY(0)",
        "rotate(-2deg) translateY(-1px)",
        "rotate(1deg) translateY(0)",
        "rotate(-1deg) translateY(1px)",
        "rotate(3deg) translateY(-1px)",
    ];

    const metas: Exploration[] = [
        {
            id: "001",
            name: "Displaced Pixel Grid",
            direction:
                "Geometric mischief — eight squares in formation, one rotated off-grid.",
        },
        {
            id: "002",
            name: "Blinking Cursor",
            direction:
                "Terminal prompt as brand. The logo is never finished typing.",
        },
        {
            id: "003",
            name: "Dropped M",
            direction:
                "The word 'mischief' literally can't stay on the baseline.",
        },
        {
            id: "004",
            name: "Footnote Asterisk",
            direction:
                "There's always more to the story. Asterisk as an invitation.",
        },
        {
            id: "005",
            name: "Crooked Tittle",
            direction: "The dot on the i is a pixel rotated just enough.",
        },
        {
            id: "006",
            name: "Underscore Prefix",
            direction: "Draft mode. Private member. Still being written.",
        },
        {
            id: "007",
            name: "Rubber Stamp",
            direction: "Handstamped onto the prototype. Workshop label energy.",
        },
        {
            id: "008",
            name: "Misregistration",
            direction: "Riso-press offset. Zine-copier vibe. Analog accident.",
        },
        {
            id: "009",
            name: "Monogram Tag",
            direction: "Self-closing dev-tag, collapsed to a monogram.",
        },
        {
            id: "010",
            name: "DM Ligature",
            direction: "Two letters fused into a single dense letterform.",
        },
        {
            id: "011",
            name: "Sparkle Constellation",
            direction: "Four pixels off-axis, like a wink across the void.",
        },
        {
            id: "012",
            name: "Shader Dogfood",
            direction:
                "The product becomes the mark. The library wears itself.",
        },
        {
            id: "013",
            name: "Slash Divide",
            direction:
                "Path semantics. dev/mischief reads like a URL or folder route.",
        },
        {
            id: "014",
            name: "Bracket Frame",
            direction: "Editorial enclosure. The brackets are the mark.",
        },
        {
            id: "015",
            name: "Handwritten Signature",
            direction: "Made-by-a-person mark. Workshop, not corporate.",
        },
        {
            id: "016",
            name: "Missing Letter",
            direction: "dev_ischief — the mischief is the letter left blank.",
        },
        {
            id: "017",
            name: "Arrow Velocity",
            direction: "Pointing forward. Shipping, not sitting.",
        },
        {
            id: "018",
            name: "Shell Prompt",
            direction: "$ devmischief — run-this-command energy.",
        },
        {
            id: "019",
            name: "Dymo Label Tape",
            direction:
                "Embossed plastic label, hand-stuck, slightly crooked. Pure workshop.",
        },
        {
            id: "020",
            name: "Hazard Tape",
            direction:
                "Caution: mischief in progress. Industrial loud, not SaaS quiet.",
        },
        {
            id: "021",
            name: "Sketchpad Mark",
            direction:
                "Drawn with a marker on a napkin. Genuinely undesigned.",
        },
        {
            id: "022",
            name: "Chunk Marker",
            direction:
                "Heavy hand-lettered caps. Comic-book confidence, indie-game energy.",
        },
        {
            id: "023",
            name: "Mascot Mark",
            direction:
                "Friendly blob, two big eyes, a sparkle of mischief. The answer.",
        },
    ];
</script>

<main class="dark min-h-dvh bg-pg-bg text-pg-text antialiased">
    <div
        class="mx-auto box-content max-w-[1200px] px-5 py-12 sm:px-8 sm:py-16 lg:px-12"
    >
        <header class="mb-16 flex items-start justify-between gap-6 sm:mb-20">
            <div class="flex flex-col gap-1">
                <a
                    href="/"
                    class="inline-flex items-center gap-1.5 font-mono text-xs text-pg-text-muted transition-colors hover:text-pg-text-bright"
                >
                    <span aria-hidden="true">←</span> back to shaders
                </a>
                <h1
                    class="mt-4 text-3xl font-light tracking-tight text-pg-text-bright sm:text-4xl"
                >
                    logo explorations
                </h1>
                <p class="mt-3 max-w-xl text-sm text-pg-text-2 sm:text-base">
                    Twelve directions for the devmischief mark, ordered by
                    register — geometric, typographic, analog, and weird. Pick a
                    feeling, not a detail.
                </p>
            </div>
            <span class="mt-1 shrink-0 font-mono text-xs text-pg-text-muted">
                {metas.length} explorations
            </span>
        </header>
        
        <div
            class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-5 lg:grid-cols-3"
        >
            {#each metas as meta, i}
                <article
                    class="group flex flex-col overflow-hidden rounded-xl border border-pg-divider bg-pg-surface transition-colors hover:border-pg-border"
                >
                    <div
                        class="logo-stage relative flex items-center justify-center overflow-hidden bg-pg-bg min-h-80"
                    >
                        {#if i === 0}
                            <!-- 001 · Displaced Pixel Grid -->
                            <div class="flex items-center gap-3">
                                <span
                                    class="inline-grid h-10 w-10 grid-cols-3 grid-rows-3 gap-[3px]"
                                    aria-hidden="true"
                                >
                                    {#each Array(9) as _, j}
                                        {#if j === 2}
                                            <span
                                                class="rounded-[2px] bg-pg-text-bright rotate-12 transition-transform duration-500 ease-out group-hover:translate-x-[2px] group-hover:translate-y-[-2px] group-hover:rotate-[-18deg]"
                                            ></span>
                                        {:else}
                                            <span
                                                class="rounded-[2px] bg-pg-text-bright"
                                            ></span>
                                        {/if}
                                    {/each}
                                </span>
                                <span
                                    class="text-xl font-medium tracking-tight text-pg-text-bright"
                                >
                                    devmischief
                                </span>
                            </div>
                        {:else if i === 1}
                            <!-- 002 · Blinking Cursor -->
                            <span
                                class="text-2xl font-medium tracking-tight text-pg-text-bright"
                            >
                                devmischief<span
                                    class="cursor-block ml-1 inline-block align-[-3px]"
                                ></span>
                            </span>
                        {:else if i === 2}
                            <!-- 003 · Dropped M -->
                            <span
                                class="text-2xl font-medium tracking-tight text-pg-text-bright"
                            >
                                dev<span class="dropped-m">m</span>ischief
                            </span>
                        {:else if i === 3}
                            <!-- 004 · Footnote Asterisk -->
                            <span
                                class="text-2xl font-medium tracking-tight text-pg-text-bright"
                            >
                                devmischief<span
                                    class="ml-0.5 align-super text-sm text-pg-text-2 transition-transform duration-300 group-hover:scale-125 group-hover:text-pg-text-bright inline-block"
                                    >*</span
                                >
                            </span>
                        {:else if i === 4}
                            <!-- 005 · Crooked Tittle -->
                            <span
                                class="text-2xl font-medium tracking-tight text-pg-text-bright"
                            >
                                devm<span class="crooked-i"
                                    >ı<span class="tittle" aria-hidden="true"
                                    ></span></span
                                >schief
                            </span>
                        {:else if i === 5}
                            <!-- 006 · Underscore Prefix -->
                            <span
                                class="font-mono text-2xl font-medium text-pg-text-bright"
                            >
                                <span class="underscore-mark">_</span
                                >devmischief
                            </span>
                        {:else if i === 6}
                            <!-- 007 · Rubber Stamp -->
                            <div
                                class="stamp-mark rotate-[-4deg] border-2 border-dashed border-pg-text-bright/80 px-4 py-2 font-mono text-lg font-bold uppercase tracking-[0.12em] text-pg-text-bright/90"
                            >
                                devmischief
                            </div>
                        {:else if i === 7}
                            <!-- 008 · Misregistration -->
                            <div
                                class="relative text-2xl font-semibold tracking-tight"
                            >
                                <span
                                    class="absolute inset-0 translate-x-[-1.5px] -translate-y-px text-cyan-400/80 mix-blend-screen"
                                    aria-hidden="true"
                                >
                                    devmischief
                                </span>
                                <span
                                    class="absolute inset-0 translate-x-[1.5px] translate-y-px text-rose-400/80 mix-blend-screen"
                                    aria-hidden="true"
                                >
                                    devmischief
                                </span>
                                <span class="relative text-pg-text-bright">
                                    devmischief
                                </span>
                            </div>
                        {:else if i === 8}
                            <!-- 009 · Monogram Tag -->
                            <div class="flex items-center gap-3">
                                <span
                                    class="font-mono text-3xl font-semibold text-pg-text-bright"
                                >
                                    &lt;dm/&gt;
                                </span>
                                <span
                                    class="text-xl font-medium tracking-tight text-pg-text-2"
                                >
                                    devmischief
                                </span>
                            </div>
                        {:else if i === 9}
                            <!-- 010 · DM Ligature -->
                            <div class="flex items-center gap-3">
                                <span
                                    class="ligature-mark text-5xl text-pg-text-bright"
                                >
                                    dm
                                </span>
                                <span
                                    class="text-xl font-medium tracking-tight text-pg-text-2"
                                >
                                    devmischief
                                </span>
                            </div>
                        {:else if i === 10}
                            <!-- 011 · Sparkle Constellation -->
                            <div class="flex items-center gap-3">
                                <span
                                    class="sparkle-mark relative block h-10 w-14"
                                    aria-hidden="true"
                                >
                                    <span
                                        class="absolute top-[14%] left-[12%] h-[5px] w-[5px] bg-pg-text-bright"
                                    ></span>
                                    <span
                                        class="absolute top-[48%] left-[38%] h-[7px] w-[7px] bg-pg-text-bright"
                                    ></span>
                                    <span
                                        class="absolute top-[22%] left-[72%] h-[3px] w-[3px] bg-pg-text-bright opacity-70"
                                    ></span>
                                    <span
                                        class="absolute top-[70%] left-[22%] h-[4px] w-[4px] bg-pg-text-bright opacity-80"
                                    ></span>
                                </span>
                                <span
                                    class="text-xl font-medium tracking-tight text-pg-text-bright"
                                >
                                    devmischief
                                </span>
                            </div>
                        {:else if i === 11}
                            <!-- 012 · Shader Dogfood -->
                            <div class="flex items-center gap-3">
                                <span
                                    class="relative block h-12 w-12 overflow-hidden rounded-lg border border-pg-border-2"
                                >
                                    <FlutedGlass width={96} height={96} />
                                </span>
                                <span
                                    class="text-xl font-medium tracking-tight text-pg-text-bright"
                                >
                                    devmischief
                                </span>
                            </div>
                        {:else if i === 12}
                            <!-- 013 · Slash Divide -->
                            <span
                                class="text-2xl font-medium tracking-tight text-pg-text-bright"
                            >
                                dev<span
                                    class="slash-mark mx-0.5 font-light text-pg-text-2"
                                    >/</span
                                >mischief
                            </span>
                        {:else if i === 13}
                            <!-- 014 · Bracket Frame -->
                            <div class="flex items-baseline gap-1.5">
                                <span
                                    class="bracket-mark text-3xl font-light text-pg-text-2"
                                    aria-hidden="true">[</span
                                >
                                <span
                                    class="text-xl font-medium tracking-tight text-pg-text-bright"
                                >
                                    devmischief
                                </span>
                                <span
                                    class="bracket-mark text-3xl font-light text-pg-text-2"
                                    aria-hidden="true">]</span
                                >
                            </div>
                        {:else if i === 14}
                            <!-- 015 · Handwritten Signature -->
                            <span
                                class="signature-mark text-4xl text-pg-text-bright"
                            >
                                devmischief
                            </span>
                        {:else if i === 15}
                            <!-- 016 · Missing Letter -->
                            <span
                                class="text-2xl font-medium tracking-tight text-pg-text-bright"
                            >
                                dev<span
                                    class="missing-mark text-pg-text-2"
                                    aria-label="m">_</span
                                >ischief
                            </span>
                        {:else if i === 16}
                            <!-- 017 · Arrow Velocity -->
                            <div class="flex items-center gap-2.5">
                                <span
                                    class="arrow-mark text-2xl text-pg-text-bright"
                                    aria-hidden="true"
                                >
                                    →
                                </span>
                                <span
                                    class="text-xl font-medium tracking-tight text-pg-text-bright"
                                >
                                    devmischief
                                </span>
                            </div>
                        {:else if i === 17}
                            <!-- 018 · Shell Prompt -->
                            <span
                                class="font-mono text-2xl font-medium text-pg-text-bright"
                            >
                                <span
                                    class="prompt-mark text-pg-text-2"
                                    aria-hidden="true">$</span
                                >
                                devmischief
                            </span>
                        {:else if i === 18}
                            <!-- 019 · Dymo Label Tape -->
                            <div class="dymo-strip relative">
                                <span
                                    class="dymo-text font-mono text-base font-extrabold uppercase tracking-[0.22em]"
                                >
                                    devmischief
                                </span>
                            </div>
                        {:else if i === 19}
                            <!-- 020 · Hazard Tape -->
                            <div class="flex flex-col items-center gap-2">
                                <span
                                    class="text-3xl font-extrabold uppercase tracking-tight text-pg-text-bright"
                                >
                                    devmischief
                                </span>
                                <span
                                    class="hazard-tape h-[7px] w-[280px]"
                                    aria-hidden="true"
                                ></span>
                                <span
                                    class="font-mono text-[0.6rem] uppercase tracking-[0.2em] text-pg-text-muted"
                                >
                                    caution · mischief in progress
                                </span>
                            </div>
                        {:else if i === 20}
                            <!-- 021 · Sketchpad Mark -->
                            <div
                                class="sketchpad flex flex-col items-center"
                            >
                                <span
                                    class="sketch-mark text-4xl text-pg-text-bright"
                                >
                                    devmischief
                                </span>
                                <svg
                                    class="sketch-underline -mt-1 w-[230px]"
                                    viewBox="0 0 230 12"
                                    fill="none"
                                    aria-hidden="true"
                                >
                                    <path
                                        d="M 6 7 Q 30 3, 60 5 T 110 6 T 165 4 T 224 5"
                                        stroke="currentColor"
                                        stroke-width="1.6"
                                        stroke-linecap="round"
                                    />
                                </svg>
                                <span
                                    class="sketch-doodle mt-1 text-xs text-pg-text-2"
                                >
                                    ✱ a maker lab
                                </span>
                            </div>
                        {:else if i === 21}
                            <!-- 022 · Chunk Marker -->
                            <div class="chunk-wrap">
                                <span class="chunk-mark">
                                    {#each chunkLetters as char, idx}
                                        <span
                                            class="chunk-letter"
                                            style="transform: {chunkTransforms[
                                                idx
                                            ]}"
                                        >
                                            {char}
                                        </span>
                                    {/each}
                                </span>
                            </div>
                        {:else if i === 22}
                            <!-- 023 · Mascot Mark -->
                            <DevMischiefMark
                                class="w-[280px] max-w-full"
                            />
                        {/if}
                    </div>

                    <div
                        class="flex flex-col gap-1.5 border-t border-pg-divider px-4 py-3.5"
                    >
                        <div class="flex items-baseline justify-between">
                            <span
                                class="font-mono text-[0.68rem] uppercase tracking-[0.16em] text-pg-text-muted"
                            >
                                logo {meta.id}
                            </span>
                            <span
                                class="font-mono text-[0.68rem] text-pg-text-dim"
                            >
                                / {String(metas.length).padStart(3, "0")}
                            </span>
                        </div>
                        <div class="text-sm font-medium text-pg-text-bright">
                            {meta.name}
                        </div>
                        <p class="text-xs leading-relaxed text-pg-text-2">
                            {meta.direction}
                        </p>
                    </div>
                </article>
            {/each}
        </div>

        <footer
            class="mt-20 border-t border-pg-divider pt-8 text-center text-xs text-pg-text-muted"
        >
            <p class="font-mono">devmischief · logo explorations · v0</p>
        </footer>
    </div>
</main>

<style>
    @import url("https://fonts.googleapis.com/css2?family=Bangers&display=swap");

    :global(body) {
        margin: 0;
        background: var(--pg-bg);
    }

    /* 002 — blinking block cursor */
    .cursor-block {
        width: 0.55em;
        height: 1em;
        background: currentColor;
        animation: blink 1.1s steps(2) infinite;
    }

    @keyframes blink {
        50% {
            opacity: 0;
        }
    }

    /* 003 — dropped m */
    .dropped-m {
        display: inline-block;
        transform: translateY(4px);
        transition: transform 300ms ease;
    }

    .group:hover .dropped-m {
        transform: translateY(7px);
    }

    /* 005 — crooked tittle over dotless i */
    .crooked-i {
        position: relative;
        display: inline-block;
    }

    .crooked-i .tittle {
        position: absolute;
        top: -0.15em;
        left: 50%;
        width: 0.2em;
        height: 0.2em;
        background: currentColor;
        transform: translateX(-50%) rotate(22deg);
        transition: transform 300ms ease;
    }

    .group:hover .crooked-i .tittle {
        transform: translateX(-50%) rotate(-15deg);
    }

    /* 006 — underscore prefix, subtle blink */
    .underscore-mark {
        display: inline-block;
        animation: blink 1.4s steps(2) infinite;
    }

    /* 007 — rubber stamp, subtle ink-offset via filter */
    .stamp-mark {
        text-shadow:
            0.5px 0.5px 0 rgba(240, 240, 240, 0.15),
            -0.5px -0.5px 0 rgba(240, 240, 240, 0.1);
        transition: transform 300ms ease;
    }

    .group:hover .stamp-mark {
        transform: rotate(-2deg) scale(1.02);
    }

    /* 010 — dm ligature: heavy weight, negative tracking, fused */
    .ligature-mark {
        font-family: "Inter Tight", system-ui, sans-serif;
        font-weight: 800;
        letter-spacing: -0.12em;
        font-feature-settings: "ss01";
    }

    /* 013 — slash divide, slight hover accent */
    .slash-mark {
        display: inline-block;
        transition:
            color 300ms ease,
            transform 300ms ease;
    }

    .group:hover .slash-mark {
        color: var(--pg-text-bright);
        transform: skewX(-8deg);
    }

    /* 014 — brackets subtly expand on hover */
    .bracket-mark {
        display: inline-block;
        transition: transform 300ms ease;
    }

    .group:hover .bracket-mark:first-child {
        transform: translateX(-3px);
    }

    .group:hover .bracket-mark:last-child {
        transform: translateX(3px);
    }

    /* 015 — handwritten signature */
    .signature-mark {
        font-family: "Snell Roundhand", "Apple Chancery", "Brush Script MT",
            cursive;
        font-style: italic;
        font-weight: 600;
        letter-spacing: 0.01em;
        transform: rotate(-3deg);
        display: inline-block;
    }

    /* 016 — missing letter blinks, as if waiting to be filled */
    .missing-mark {
        display: inline-block;
        animation: blink 1.6s steps(2) infinite;
    }

    /* 017 — arrow slides forward on hover */
    .arrow-mark {
        display: inline-block;
        transition: transform 300ms ease;
    }

    .group:hover .arrow-mark {
        transform: translateX(4px);
    }

    /* 018 — shell prompt subtle blink */
    .prompt-mark {
        display: inline-block;
        animation: blink 1.8s steps(2) infinite;
    }

    /* 019 — Dymo embossed label tape */
    .dymo-strip {
        background:
            linear-gradient(
                180deg,
                rgba(255, 255, 255, 0.05) 0%,
                transparent 35%,
                rgba(0, 0, 0, 0.25) 100%
            ),
            #0a0a0a;
        border-radius: 8px;
        padding: 18px 32px;
        transform: rotate(-3.5deg);
        box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.1),
            inset 0 -2px 2px rgba(0, 0, 0, 0.6),
            0 10px 28px -6px rgba(0, 0, 0, 0.7),
            0 3px 6px rgba(0, 0, 0, 0.5);
        transition: transform 400ms ease;
    }

    .dymo-text {
        color: #f5f5f5;
        text-shadow:
            0 -1px 0 rgba(255, 255, 255, 0.35),
            0 1px 1px rgba(0, 0, 0, 0.7),
            1px 0 0 rgba(0, 0, 0, 0.25),
            -1px 0 0 rgba(255, 255, 255, 0.18);
    }

    .group:hover .dymo-strip {
        transform: rotate(-1.5deg) scale(1.04);
        box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.12),
            inset 0 -2px 2px rgba(0, 0, 0, 0.6),
            0 14px 36px -6px rgba(0, 0, 0, 0.75),
            0 5px 10px rgba(0, 0, 0, 0.55);
    }

    /* 020 — Hazard tape underline */
    .hazard-tape {
        background: repeating-linear-gradient(
            -45deg,
            #facc15 0px,
            #facc15 9px,
            #0a0a0a 9px,
            #0a0a0a 18px
        );
        border-radius: 1px;
        box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.06),
            0 3px 8px rgba(0, 0, 0, 0.45);
        transition: transform 300ms ease;
    }

    .group:hover .hazard-tape {
        transform: scaleX(1.05);
    }

    /* 021 — Sketchpad / napkin marker */
    .sketch-mark {
        font-family:
            "Marker Felt", "Bradley Hand", "Permanent Marker",
            "Comic Sans MS", cursive;
        font-weight: 600;
        letter-spacing: 0.005em;
        transform: rotate(-1.8deg);
        display: inline-block;
    }

    .sketch-underline {
        color: var(--pg-text-bright);
        transform: rotate(-0.8deg);
        transition: transform 400ms ease;
    }

    .group:hover .sketch-underline {
        transform: rotate(-1.8deg) translateX(-2px);
    }

    .sketch-doodle {
        font-family:
            "Marker Felt", "Bradley Hand", "Permanent Marker",
            "Comic Sans MS", cursive;
        transform: rotate(1deg);
    }

    /* 022 — Chunk Marker, hand-lettered comic-book caps */
    .chunk-wrap {
        display: inline-block;
        transform: rotate(-2deg);
        transition: transform 400ms ease;
    }

    .group:hover .chunk-wrap {
        transform: rotate(-1deg) scale(1.04);
    }

    .chunk-mark {
        font-family: "Bangers", "Impact", "Anton", system-ui, sans-serif;
        font-size: 3.5rem;
        line-height: 1;
        color: var(--pg-text-bright);
        letter-spacing: 0.03em;
        display: inline-block;
        text-shadow:
            2px 3px 0 rgba(0, 0, 0, 0.55),
            -1px -1px 0 rgba(255, 255, 255, 0.05);
    }

    .chunk-letter {
        display: inline-block;
        transform-origin: center;
        transition: transform 250ms ease;
    }

    .group:hover .chunk-letter:nth-child(odd) {
        animation: chunk-jiggle-a 600ms ease infinite alternate;
    }

    .group:hover .chunk-letter:nth-child(even) {
        animation: chunk-jiggle-b 600ms ease infinite alternate;
    }

    @keyframes chunk-jiggle-a {
        from {
            transform: translateY(0) rotate(-2deg);
        }
        to {
            transform: translateY(-3px) rotate(2deg);
        }
    }

    @keyframes chunk-jiggle-b {
        from {
            transform: translateY(-1px) rotate(2deg);
        }
        to {
            transform: translateY(2px) rotate(-3deg);
        }
    }
</style>
