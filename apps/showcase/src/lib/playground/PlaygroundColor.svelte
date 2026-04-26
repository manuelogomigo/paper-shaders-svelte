<script lang="ts">
	type Props = {
		label: string;
		value: string;
		onChange?: () => void;
	};

	let { label, value = $bindable(), onChange }: Props = $props();
</script>

<div class="grid grid-cols-[7rem_1fr] items-center gap-3">
	<span class="text-pg-text">{label}</span>
	<div class="flex w-full items-center gap-2">
		<label
			class="relative flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-md border border-pg-divider"
			style="background-color: {value};"
		>
			<input
				type="color"
				{value}
				oninput={(e) => {
					value = e.currentTarget.value;
					onChange?.();
				}}
				class="absolute inset-0 h-full w-full cursor-pointer opacity-0"
				aria-label={label}
			/>
		</label>
		<input
			type="text"
			{value}
			oninput={(e) => {
				const v = e.currentTarget.value.trim();
				if (/^#[0-9a-fA-F]{6}$/.test(v) || /^#[0-9a-fA-F]{8}$/.test(v)) {
					value = v;
					onChange?.();
				}
			}}
			class="h-7 w-full rounded-md border border-pg-divider bg-pg-bg px-2 text-pg-text outline-none focus:border-pg-border"
		/>
	</div>
</div>
