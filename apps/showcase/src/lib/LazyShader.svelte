<script lang="ts">
	import type { Component } from "svelte";

	type Props = {
		component: Component<{ width: number; height: number }>;
		image: string;
		alt: string;
		width?: number;
		height?: number;
	};

	let {
		component: ShaderComponent,
		image,
		alt,
		width = 640,
		height = 480,
	}: Props = $props();

	let active = $state(false);
	let disposeTimer: ReturnType<typeof setTimeout> | null = null;

	function onEnter() {
		if (disposeTimer !== null) {
			clearTimeout(disposeTimer);
			disposeTimer = null;
		}
		active = true;
	}

	function onLeave() {
		if (disposeTimer !== null) clearTimeout(disposeTimer);
		disposeTimer = setTimeout(() => {
			active = false;
			disposeTimer = null;
		}, 150);
	}
</script>

<div
	class="relative h-full w-full"
	onmouseenter={onEnter}
	onmouseleave={onLeave}
	role="presentation"
>
	<img
		src={image}
		{alt}
		class="absolute inset-0 h-full w-full object-cover"
		loading="lazy"
		decoding="async"
		draggable="false"
	/>
	{#if active}
		<div class="absolute inset-0 flex items-center justify-center">
			<ShaderComponent {width} {height} />
		</div>
	{/if}
</div>
