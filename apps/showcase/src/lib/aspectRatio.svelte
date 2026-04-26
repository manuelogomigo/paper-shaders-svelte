<script lang="ts">
    import { AspectRatio as AspectRatioPrimitive } from "bits-ui";
    import type { Snippet } from "svelte";

    let {
        ref = $bindable(null),
        children,
        ...restProps
    }: AspectRatioPrimitive.RootProps & { children?: Snippet } = $props();
</script>

<AspectRatioPrimitive.Root bind:ref data-slot="aspect-ratio" {...restProps}>
    <div class="aspect-ratio-fill">
        {@render children?.()}
    </div>
</AspectRatioPrimitive.Root>

<style>
    .aspect-ratio-fill {
        width: 100%;
        height: 100%;
    }

    .aspect-ratio-fill :global(*) {
        max-width: 100%;
        max-height: 100%;
    }

    .aspect-ratio-fill :global([data-paper-shader]) {
        width: 100% !important;
        height: 100% !important;
    }
</style>
