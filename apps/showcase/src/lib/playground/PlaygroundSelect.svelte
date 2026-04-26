<script lang="ts" generics="T extends string">
	type Props = {
		label: string;
		value: T;
		options: readonly T[];
		onChange?: () => void;
	};

	let { label, value = $bindable(), options, onChange }: Props = $props();
</script>

<div class="grid grid-cols-[7rem_1fr] items-center gap-3">
	<span class="text-pg-text">{label}</span>
	<div class="relative">
		<select
			bind:value
			onchange={() => onChange?.()}
			class="paper-select h-8 text-sm w-full cursor-pointer appearance-none rounded-md border border-pg-divider bg-pg-bg px-2 py-0 pr-7 text-pg-text outline-none focus:border-pg-border"
		>
			{#each options as opt}
				<option value={opt}>{opt}</option>
			{/each}
		</select>
		<span
			class="pointer-events-none absolute top-1/2 right-2 -translate-y-1/2 text-pg-text-muted"
			aria-hidden="true"
		>
			▾
		</span>
	</div>
</div>
