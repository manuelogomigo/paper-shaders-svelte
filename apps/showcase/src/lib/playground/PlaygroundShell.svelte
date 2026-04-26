<script lang="ts">
	import type { Snippet } from "svelte";
	import { page } from "$app/state";
	import { getShaderNeighbours } from "$lib/shaders";
	import SiteHeader from "$lib/SiteHeader.svelte";
	import type { Prop } from "./types";

	type Props = {
		title: string;
		description: string;
		installCmd?: string;
		code: string;
		shaderProps?: Prop[];
		commonProps?: Prop[];
		preview: Snippet;
		controls: Snippet;
	};

	let {
		title,
		description,
		installCmd = "npm i @devmischief/shaders-svelte",
		code,
		shaderProps = [],
		commonProps = [],
		preview,
		controls,
	}: Props = $props();

	let copiedInstall = $state(false);
	let copiedCode = $state(false);

	const neighbours = $derived(getShaderNeighbours(page.url.pathname));

	async function copy(text: string, set: (v: boolean) => void) {
		try {
			await navigator.clipboard.writeText(text);
			set(true);
			setTimeout(() => set(false), 1400);
		} catch {
			// clipboard blocked — no-op
		}
	}
</script>

<main class="dark min-h-dvh bg-pg-bg text-pg-text antialiased">
	<div
		class="mx-auto box-content max-w-[1200px] px-5 py-12 sm:px-8 sm:py-16 lg:px-12"
	>
		<SiteHeader class="mb-20 sm:mb-24" />

		<section class="mb-12 flex flex-col gap-5 sm:mb-16">
			<div
				class="flex items-center justify-between gap-4 font-mono text-[0.7rem] uppercase tracking-[0.18em] text-pg-text-muted"
			>
				<a
					href="/"
					class="inline-flex w-fit items-center gap-1.5 transition-colors hover:text-pg-text-bright"
				>
					<span aria-hidden="true">←</span>
					shaders
				</a>
				<div class="flex items-center gap-3">
					{#if neighbours.prev}
						<a
							href={neighbours.prev.href}
							class="inline-flex items-center gap-1.5 transition-colors hover:text-pg-text-bright"
							aria-label="Previous shader: {neighbours.prev.name}"
						>
							<span aria-hidden="true">←</span>
							<span class="hidden sm:inline"
								>{neighbours.prev.name}</span
							>
						</a>
					{:else}
						<span
							class="inline-flex items-center gap-1.5 opacity-30"
							aria-hidden="true"
						>
							<span>←</span>
							<span class="hidden sm:inline">start</span>
						</span>
					{/if}
					<span class="text-pg-divider" aria-hidden="true">·</span>
					{#if neighbours.next}
						<a
							href={neighbours.next.href}
							class="inline-flex items-center gap-1.5 transition-colors hover:text-pg-text-bright"
							aria-label="Next shader: {neighbours.next.name}"
						>
							<span class="hidden sm:inline"
								>{neighbours.next.name}</span
							>
							<span aria-hidden="true">→</span>
						</a>
					{:else}
						<span
							class="inline-flex items-center gap-1.5 opacity-30"
							aria-hidden="true"
						>
							<span class="hidden sm:inline">end</span>
							<span>→</span>
						</span>
					{/if}
				</div>
			</div>
			<div class="flex flex-wrap items-end justify-between gap-4">
				<h1
					class="text-4xl font-light tracking-tight text-pg-text-bright sm:text-5xl"
					style="font-feature-settings: 'ss01';"
				>
					{title}
				</h1>
				<p class="max-w-md text-sm text-pg-text-2 sm:text-base">
					{description}
				</p>
			</div>
		</section>

		<section class="mb-16">
			<div
				class="mb-8 flex items-baseline justify-between border-b border-pg-divider pb-4"
			>
				<h2
					class="text-xs font-medium uppercase tracking-[0.18em] text-pg-text-2"
				>
					Preview
				</h2>
				<span class="font-mono text-xs text-pg-text-muted">live</span>
			</div>

			<div
				class="flex w-full flex-col gap-4 lg:flex-row lg:items-start lg:gap-6"
			>
				<div class="flex min-w-0 flex-1 flex-col">
					{@render preview()}
				</div>

				<aside
					class="leva-panel flex shrink-0 flex-col overflow-hidden rounded-xl border border-pg-border-2 bg-pg-surface text-[13px] lg:w-88"
				>
					{@render controls()}
				</aside>
			</div>
		</section>

		<section class="mb-16">
			<div
				class="mb-8 flex items-baseline justify-between border-b border-pg-divider pb-4"
			>
				<h2
					class="text-xs font-medium uppercase tracking-[0.18em] text-pg-text-2"
				>
					Install
				</h2>
				<span class="font-mono text-xs text-pg-text-muted">npm</span>
			</div>
			<div
				class="flex h-11 items-center overflow-hidden rounded-lg border border-pg-border-2 bg-pg-surface font-mono text-sm"
			>
				<code class="flex h-full flex-1 items-center px-4 text-pg-text">
					{installCmd}
				</code>
				<div class="h-full w-px shrink-0 bg-pg-divider"></div>
				<button
					type="button"
					aria-label="Copy install command"
					onclick={() => copy(installCmd, (v) => (copiedInstall = v))}
					class="flex h-full w-11 shrink-0 cursor-pointer items-center justify-center text-pg-text-2 transition-colors hover:bg-pg-btn-hover hover:text-pg-text-bright focus-visible:bg-pg-btn-hover focus-visible:outline-none"
				>
					{#if copiedInstall}
						<svg
							width="14"
							height="14"
							viewBox="0 0 16 16"
							fill="none"
						>
							<path
								d="M2.5 8.5L6.5 12.5L13.5 3.5"
								stroke="currentColor"
								stroke-width="1.75"
								stroke-linecap="round"
								stroke-linejoin="round"
							/>
						</svg>
					{:else}
						<svg
							width="14"
							height="14"
							viewBox="0 0 16 16"
							fill="currentColor"
						>
							<path
								d="M11 4V2C11 1.48 10.61 1.06 10.1 1H2C1.48 1 1.06 1.39 1 1.9V10C1 10.55 1.45 11 2 11H4V6C4 4.9 4.9 4 6 4H11ZM6 5C5.48 5 5.06 5.39 5 5.9V14C5 14.55 5.45 15 6 15H14C14.55 15 15 14.55 15 14V6C15 5.48 14.61 5.06 14.1 5H6Z"
							/>
						</svg>
					{/if}
				</button>
			</div>
		</section>

		<section class="mb-16">
			<div
				class="mb-8 flex items-baseline justify-between border-b border-pg-divider pb-4"
			>
				<h2
					class="text-xs font-medium uppercase tracking-[0.18em] text-pg-text-2"
				>
					Code
				</h2>
			</div>
			<div class="relative">
				<pre
					class="overflow-x-auto relative rounded-lg border border-pg-border-2 bg-pg-surface p-5 font-mono text-[0.8rem] leading-relaxed text-pg-text"><code
						>{code}</code
					>
			
			</pre>
				<button
					type="button"
					aria-label="Copy code example"
					onclick={() => copy(code, (v) => (copiedCode = v))}
					class="flex cursor-pointer p-4 border border-pg-border-2 bg-pg-surface-2 absolute right-2 top-2 items-center gap-1.5 font-mono text-xs text-pg-text-muted transition-colors hover:text-pg-text-bright"
				>
					{#if copiedCode}
						<svg
							width="14"
							height="14"
							viewBox="0 0 16 16"
							fill="none"
						>
							<path
								d="M2.5 8.5L6.5 12.5L13.5 3.5"
								stroke="currentColor"
								stroke-width="1.75"
								stroke-linecap="round"
								stroke-linejoin="round"
							/>
						</svg>
					{:else}
						<svg
							width="14"
							height="14"
							viewBox="0 0 16 16"
							fill="currentColor"
						>
							<path
								d="M11 4V2C11 1.48 10.61 1.06 10.1 1H2C1.48 1 1.06 1.39 1 1.9V10C1 10.55 1.45 11 2 11H4V6C4 4.9 4.9 4 6 4H11ZM6 5C5.48 5 5.06 5.39 5 5.9V14C5 14.55 5.45 15 6 15H14C14.55 15 15 14.55 15 14V6C15 5.48 14.61 5.06 14.1 5H6Z"
							/>
						</svg>
					{/if}
				</button>
			</div>
		</section>

		{#if shaderProps.length > 0}
			<section class="mb-16">
				<div
					class="mb-8 flex items-baseline justify-between border-b border-pg-divider pb-4"
				>
					<h2
						class="text-xs font-medium uppercase tracking-[0.18em] text-pg-text-2"
					>
						Shader Props
					</h2>
					<span class="font-mono text-xs text-pg-text-muted">
						{shaderProps.length}
					</span>
				</div>
				<div
					class="overflow-x-auto rounded-lg border border-pg-border-2 bg-pg-surface"
				>
					<table class="w-full text-sm">
						<thead>
							<tr class="border-b border-pg-divider text-left">
								<th
									class="px-4 py-3 font-mono text-[0.7rem] font-medium uppercase tracking-[0.14em] text-pg-text-2"
									>name</th
								>
								<th
									class="px-4 py-3 font-mono text-[0.7rem] font-medium uppercase tracking-[0.14em] text-pg-text-2"
									>description</th
								>
								<th
									class="px-4 py-3 font-mono text-[0.7rem] font-medium uppercase tracking-[0.14em] text-pg-text-2"
									>type</th
								>
								<th
									class="px-4 py-3 font-mono text-[0.7rem] font-medium uppercase tracking-[0.14em] text-pg-text-2"
									>values</th
								>
							</tr>
						</thead>
						<tbody>
							{#each shaderProps as prop}
								<tr
									class="border-b border-pg-divider/60 last:border-0"
								>
									<td
										class="px-4 py-3 align-top font-mono text-pg-text-bright"
										>{prop.name}</td
									>
									<td class="px-4 py-3 align-top text-pg-text"
										>{prop.description}</td
									>
									<td
										class="px-4 py-3 align-top font-mono text-xs text-pg-text-muted"
										>{prop.type}</td
									>
									<td
										class="px-4 py-3 align-top font-mono text-xs text-pg-text-muted"
									>
										{prop.values ?? "—"}
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			</section>
		{/if}

		{#if commonProps.length > 0}
			<section class="mb-16">
				<div
					class="mb-8 flex items-baseline justify-between border-b border-pg-divider pb-4"
				>
					<h2
						class="text-xs font-medium uppercase tracking-[0.18em] text-pg-text-2"
					>
						Common Props
					</h2>
					<span class="font-mono text-xs text-pg-text-muted">
						{commonProps.length}
					</span>
				</div>
				<div
					class="overflow-x-auto rounded-lg border border-pg-border-2 bg-pg-surface"
				>
					<table class="w-full text-sm">
						<thead>
							<tr class="border-b border-pg-divider text-left">
								<th
									class="px-4 py-3 font-mono text-[0.7rem] font-medium uppercase tracking-[0.14em] text-pg-text-2"
									>name</th
								>
								<th
									class="px-4 py-3 font-mono text-[0.7rem] font-medium uppercase tracking-[0.14em] text-pg-text-2"
									>description</th
								>
								<th
									class="px-4 py-3 font-mono text-[0.7rem] font-medium uppercase tracking-[0.14em] text-pg-text-2"
									>type</th
								>
								<th
									class="px-4 py-3 font-mono text-[0.7rem] font-medium uppercase tracking-[0.14em] text-pg-text-2"
									>values</th
								>
							</tr>
						</thead>
						<tbody>
							{#each commonProps as prop}
								<tr
									class="border-b border-pg-divider/60 last:border-0"
								>
									<td
										class="px-4 py-3 align-top font-mono text-pg-text-bright"
										>{prop.name}</td
									>
									<td class="px-4 py-3 align-top text-pg-text"
										>{prop.description}</td
									>
									<td
										class="px-4 py-3 align-top font-mono text-xs text-pg-text-muted"
										>{prop.type}</td
									>
									<td
										class="px-4 py-3 align-top font-mono text-xs text-pg-text-muted"
									>
										{prop.values ?? "—"}
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			</section>
		{/if}

		<footer
			class="flex flex-col items-center gap-1 border-t border-pg-divider pt-10 pb-4 text-center text-sm text-pg-text-muted"
		>
			<p>
				built with mischief by
				<a
					href="https://devmischief.com"
					class="text-pg-text transition-colors hover:text-pg-text-bright"
				>
					devmischief
				</a>
			</p>
			<p class="font-mono text-xs">@devmischief/shaders-svelte</p>
		</footer>
	</div>
</main>

<style>
	:global(body) {
		margin: 0;
		background: var(--pg-bg);
	}

	:global(.leva-panel),
	:global(.leva-panel *) {
		font-family: ui-monospace, "SF Mono", Menlo, Consolas, "Liberation Mono",
			monospace;
	}

	:global(.paper-range::-webkit-slider-runnable-track) {
		height: 2px;
		background: var(--pg-border-2, #424242);
		border-radius: 9999px;
	}
	:global(.paper-range::-moz-range-track) {
		height: 2px;
		background: var(--pg-border-2, #424242);
		border-radius: 9999px;
	}
	:global(.paper-range::-webkit-slider-thumb) {
		-webkit-appearance: none;
		appearance: none;
		width: 8px;
		height: 16px;
		margin-top: -7px;
		border-radius: 0px;
		background: var(--pg-text-2, #919191);
		border: none;
		cursor: pointer;
		transition:
			background 0.12s ease,
			transform 0.12s ease;
	}
	:global(.paper-range:hover::-webkit-slider-thumb),
	:global(.paper-range:focus::-webkit-slider-thumb) {
		background: var(--pg-text-bright, #f0f0f0);
	}
	:global(.paper-range::-moz-range-thumb) {
		width: 8px;
		height: 16px;
		border-radius: 0px;
		background: var(--pg-text-2, #919191);
		border: none;
		cursor: pointer;
	}

	:global(.paper-select) {
		background-image: none;
	}

	:global(.leva-panel input[type="number"]::-webkit-outer-spin-button),
	:global(.leva-panel input[type="number"]::-webkit-inner-spin-button) {
		-webkit-appearance: none;
		appearance: none;
		margin: 0;
	}
	:global(.leva-panel input[type="number"]) {
		-moz-appearance: textfield;
		appearance: textfield;
	}
</style>
