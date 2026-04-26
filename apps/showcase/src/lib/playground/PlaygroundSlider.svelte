<script lang="ts">
	type Props = {
		label: string;
		value: number;
		min: number;
		max: number;
		step: number;
		onChange?: () => void;
	};

	let { label, value = $bindable(), min, max, step, onChange }: Props = $props();
</script>

<div class="grid grid-cols-[7rem_1fr] items-center gap-3">
	<span class="text-pg-text">{label}</span>
	<div class="flex w-full items-center gap-2">
		<input
			type="range"
			{min}
			{max}
			{step}
			{value}
			oninput={(e) => {
				value = +e.currentTarget.value;
				onChange?.();
			}}
			class="paper-range h-[2px] w-full cursor-pointer appearance-none bg-pg-border-2"
		/>
		<input
			type="number"
			{min}
			{max}
			{step}
			{value}
			oninput={(e) => {
				const next = Number.parseFloat(e.currentTarget.value);
				if (!Number.isFinite(next)) return;
				const clamped = Math.min(max, Math.max(min, next));
				if (clamped !== next) e.currentTarget.value = String(clamped);
				value = clamped;
				onChange?.();
			}}
			class="h-7 w-18 rounded-md text-sm border border-pg-divider bg-pg-bg px-2 text-right font-mono tabular-nums text-pg-text outline-none focus:border-pg-border"
			aria-label="{label} value"
		/>
	</div>
</div>
