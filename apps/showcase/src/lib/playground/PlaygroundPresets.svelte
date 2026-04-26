<script lang="ts">
	type Props = {
		names: readonly string[];
		active: string;
		onApply: (name: string) => void;
	};

	let { names, active, onApply }: Props = $props();

	function capitalize(s: string) {
		const formatted = s.replace(/_/g, '-');
		return formatted.charAt(0).toUpperCase() + formatted.slice(1);
	}
</script>

<div class="px-4 pt-4 pb-3">
	<div class="mb-2 text-pg-text-2">Presets</div>
	<div class="grid grid-cols-2 gap-2">
		{#each names as name}
			{@const isActive = active === name}
			<button
				type="button"
				onclick={() => onApply(name)}
				class="cursor-pointer rounded-md border border-pg-divider bg-pg-surface-2 px-2 py-1 text-pg-text transition-colors hover:border-pg-border hover:bg-pg-btn-hover hover:text-pg-text-bright {isActive
					? 'border-pg-border text-pg-text-bright ring-1 ring-pg-border'
					: ''}"
			>
				{capitalize(name)}
			</button>
		{/each}
	</div>
</div>
