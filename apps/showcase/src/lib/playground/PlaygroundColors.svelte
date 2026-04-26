<script lang="ts">
	type Props = {
		label: string;
		values: string[];
		max?: number;
		min?: number;
		defaults?: string[];
		onChange?: () => void;
	};

	let {
		label,
		values = $bindable(),
		max = 10,
		min = 1,
		defaults = [],
		onChange,
	}: Props = $props();

	// Persistent per-slot storage. slots[i] always holds the latest color set for
	// slot i, even when i is currently outside the active count window.
	// Uninitialised slots fall back to `defaults[i]`, then to the last visible value.
	let slots = $state<string[]>(
		Array.from({ length: max }, (_, i) => {
			if (i < values.length) return values[i];
			return (
				defaults[i] ??
				values[values.length - 1] ??
				defaults[defaults.length - 1] ??
				"#ffffff"
			);
		}),
	);

	// Absorb external reassignments (e.g. preset application replacing the array)
	// into the slot store. Guarded by equality so internal mutations don't loop.
	$effect(() => {
		for (let i = 0; i < values.length; i++) {
			if (slots[i] !== values[i]) slots[i] = values[i];
		}
	});

	function setColor(i: number, v: string) {
		slots[i] = v;
		values[i] = v;
		onChange?.();
	}

	function commitHex(i: number, raw: string) {
		const v = raw.trim();
		if (/^#[0-9a-fA-F]{6}$/.test(v) || /^#[0-9a-fA-F]{8}$/.test(v)) {
			setColor(i, v);
		}
	}

	function setCount(n: number) {
		const target = Math.min(max, Math.max(min, n));
		const current = values.length;
		if (target === current) return;
		if (target < current) {
			values.length = target;
		} else {
			for (let i = current; i < target; i++) {
				const fallback =
					slots[i] ??
					defaults[i] ??
					slots[current - 1] ??
					"#ffffff";
				values.push(fallback);
				if (!slots[i]) slots[i] = fallback;
			}
		}
		onChange?.();
	}
</script>

<div class="flex flex-col gap-2">
	<div class="grid grid-cols-[7rem_1fr] items-center gap-3">
		<span class="text-pg-text">{label}</span>
		<div class="flex w-full items-center gap-2">
			<input
				type="range"
				{min}
				{max}
				step={1}
				value={values.length}
				oninput={(e) => setCount(+e.currentTarget.value)}
				class="paper-range h-[2px] w-full cursor-pointer appearance-none bg-pg-border-2"
				aria-label="{label} count"
			/>
			<input
				type="number"
				{min}
				{max}
				step={1}
				value={values.length}
				oninput={(e) => {
					const next = Number.parseInt(e.currentTarget.value, 10);
					if (!Number.isFinite(next)) return;
					setCount(next);
				}}
				class="h-7 w-18 rounded-md border border-pg-divider bg-pg-bg px-2 text-right font-mono tabular-nums text-pg-text outline-none focus:border-pg-border"
				aria-label="{label} count value"
			/>
		</div>
	</div>
	{#each values as v, i (i)}
		<div class="grid grid-cols-[7rem_1fr] items-center gap-3">
			<span
				class="pl-3 font-mono text-xs text-pg-text-muted tabular-nums"
				>{String(i + 1).padStart(2, "0")}</span
			>
			<div class="flex w-full items-center gap-2">
				<label
					class="relative flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-md border border-pg-divider"
					style="background-color: {v};"
				>
					<input
						type="color"
						value={v}
						oninput={(e) => setColor(i, e.currentTarget.value)}
						class="absolute inset-0 h-full w-full cursor-pointer opacity-0"
						aria-label="{label} {i + 1}"
					/>
				</label>
				<input
					type="text"
					value={v}
					oninput={(e) => commitHex(i, e.currentTarget.value)}
					class="h-7 w-full rounded-md border border-pg-divider bg-pg-bg px-2 text-pg-text outline-none focus:border-pg-border"
				/>
			</div>
		</div>
	{/each}
</div>
