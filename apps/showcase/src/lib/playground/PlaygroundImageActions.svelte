<script lang="ts">
	type Props = {
		image: string | undefined;
		onUpload: (url: string) => void;
		onDelete: () => void;
		onRandom?: () => void;
	};

	let { image, onUpload, onDelete, onRandom }: Props = $props();

	let fileInputEl: HTMLInputElement | null = $state(null);

	function handleUpload(e: Event) {
		const input = e.currentTarget as HTMLInputElement;
		const file = input.files?.[0];
		if (!file) return;
		const url = URL.createObjectURL(file);
		onUpload(url);
	}

	function handleDelete() {
		if (image?.startsWith("blob:")) URL.revokeObjectURL(image);
		if (fileInputEl) fileInputEl.value = "";
		onDelete();
	}
</script>

<div
	class="grid {onRandom
		? 'grid-cols-3'
		: 'grid-cols-2'} gap-2 border-t border-pg-divider/60 px-4 py-3"
>
	<button
		type="button"
		onclick={() => fileInputEl?.click()}
		class="cursor-pointer rounded-md border border-pg-divider bg-pg-surface-2 px-3 py-1 text-pg-text transition-colors hover:border-pg-border hover:bg-pg-btn-hover hover:text-pg-text-bright"
	>
		Upload
	</button>
	{#if onRandom}
		<button
			type="button"
			onclick={onRandom}
			class="cursor-pointer rounded-md border border-pg-divider bg-pg-surface-2 px-3 py-1 text-pg-text transition-colors hover:border-pg-border hover:bg-pg-btn-hover hover:text-pg-text-bright"
		>
			Random
		</button>
	{/if}
	<button
		type="button"
		onclick={handleDelete}
		disabled={!image}
		class="cursor-pointer rounded-md border border-pg-divider bg-pg-surface-2 px-3 py-1 text-pg-text transition-colors hover:border-pg-border hover:bg-pg-btn-hover hover:text-pg-text-bright disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-pg-divider disabled:hover:bg-pg-surface-2 disabled:hover:text-pg-text"
	>
		Delete
	</button>
	<input
		bind:this={fileInputEl}
		type="file"
		accept="image/*"
		onchange={handleUpload}
		class="hidden"
	/>
</div>
