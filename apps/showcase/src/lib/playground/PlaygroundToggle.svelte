<script lang="ts">
	type Props = {
		label: string;
		value: boolean;
		onChange?: () => void;
	};

	let { label, value = $bindable(), onChange }: Props = $props();

	function toggle() {
		value = !value;
		onChange?.();
	}
</script>

<div class="grid grid-cols-[7rem_1fr] items-center gap-3">
	<span class="text-pg-text">{label}</span>
	<button
		type="button"
		role="switch"
		aria-checked={value}
		aria-label={label}
		onclick={toggle}
		class="relative h-7 w-12 shrink-0 cursor-pointer border border-pg-divider transition-colors focus:border-pg-border focus:outline-none {value
			? 'bg-pg-text-2'
			: 'bg-pg-bg'}"
	>
		<span
			class="absolute top-1/2 h-5 w-4 -translate-y-1/2 bg-pg-text-bright transition-all duration-150 {value
				? 'left-[calc(100%-1.2rem)]'
				: 'left-1'}"
		></span>
	</button>
</div>
