<script lang="ts">
	import DevMischiefMark from "$lib/DevMischiefMark.svelte";

	type Props = {
		class?: string;
	};

	let { class: className = "" }: Props = $props();
</script>

<header class="flex items-center justify-between {className}">
	<a
		href="/"
		class="group flex items-center outline-none"
		aria-label="devmischief home"
	>
		<DevMischiefMark
			class="dm-header-mark h-9 w-auto text-pg-text-bright"
		/>
	</a>
	<nav class="flex items-center gap-6 text-sm text-pg-text-nav">
		<a href="/" class="transition-colors hover:text-pg-text-nav-hover">
			shaders
		</a>
		<a
			href="https://devmischief.com"
			class="transition-colors hover:text-pg-text-nav-hover"
		>
			hq
		</a>
	</nav>
</header>
