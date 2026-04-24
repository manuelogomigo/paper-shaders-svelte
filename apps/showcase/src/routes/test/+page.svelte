<script lang="ts">
	import { mode } from "mode-watcher";

	import { browser } from "$app/environment";
	import { Dithering } from "@devmischief/shaders-svelte";
	import {
		defaultPatternSizing,
		DitheringShapes,
		DitheringTypes,
		ditheringFragmentShader,
		getShaderColorFromString,
		ShaderFitOptions,
		ShaderMount,
	} from "@paper-design/shaders";

	const DEFAULT_COLOR_FRONT = "#f5f5f5";
	const SHADER_FADE_MS = 500;
	let colorBack = $derived(mode.current === "dark" ? "#191919" : "#ffffff");
	let colorFront = $state(DEFAULT_COLOR_FRONT);
	let isShaderVisible = $state(false);
	let hideTimer: ReturnType<typeof setTimeout> | undefined;

	function showShader(color: string) {
		if (hideTimer) {
			clearTimeout(hideTimer);
			hideTimer = undefined;
		}
		colorFront = color;
		isShaderVisible = true;
	}

	function hideShader() {
		isShaderVisible = false;
		if (hideTimer) clearTimeout(hideTimer);
		hideTimer = setTimeout(() => {
			colorFront = DEFAULT_COLOR_FRONT;
			hideTimer = undefined;
		}, SHADER_FADE_MS);
	}

	const ditheringUniforms = $derived({
		u_colorBack: getShaderColorFromString(colorBack),
		u_colorFront: getShaderColorFromString(colorFront),
		u_shape: DitheringShapes.warp,
		u_type: DitheringTypes["4x4"],
		u_pxSize: 2,
		u_fit: ShaderFitOptions[defaultPatternSizing.fit],
		u_scale: 1.2,
		u_rotation: defaultPatternSizing.rotation,
		u_originX: defaultPatternSizing.originX,
		u_originY: defaultPatternSizing.originY,
		u_offsetX: 2,
		u_offsetY: defaultPatternSizing.offsetY,
		u_worldWidth: defaultPatternSizing.worldWidth,
		u_worldHeight: defaultPatternSizing.worldHeight,
	});

	const ditheringMountConfig = $derived({
		uniforms: ditheringUniforms,
		visible: isShaderVisible,
	});

	function mountDithering(
		node: HTMLDivElement,
		config: typeof ditheringMountConfig,
	) {
		if (!browser) return;

		const shader = new ShaderMount(
			node,
			ditheringFragmentShader,
			config.uniforms,
			undefined,
			1,
			undefined,
			1,
			1920 * 1080,
		);

		let isWarmedUp = false;
		let warmupFrame: number | undefined;
		let latestConfig = config;

		warmupFrame = requestAnimationFrame(() => {
			warmupFrame = requestAnimationFrame(() => {
				shader.setSpeed(latestConfig.visible ? 1 : 0);
				isWarmedUp = true;
				warmupFrame = undefined;
			});
		});

		return {
			update(nextConfig: typeof ditheringMountConfig) {
				latestConfig = nextConfig;
				shader.setUniforms(nextConfig.uniforms);
				if (isWarmedUp || nextConfig.visible) {
					shader.setSpeed(nextConfig.visible ? 1 : 0);
				}
			},
			destroy() {
				if (warmupFrame !== undefined)
					cancelAnimationFrame(warmupFrame);
				shader.dispose();
			},
		};
	}
</script>

<div class="dark relative min-h-screen overflow-hidden bg-pg-bg">
	<!-- <div
		class="pointer-events-none fixed inset-0 z-0 h-screen w-screen transition-opacity duration-500 ease-out"
		class:opacity-0={!isShaderVisible}
		class:opacity-20={isShaderVisible}
		aria-hidden="true"
		use:mountDithering={ditheringMountConfig}
	></div> -->

	<Dithering
		width={"100%"}
		height={"100%"}
		{colorBack}
		{colorFront}
		size={2}
		scale={1.2}
		offsetX={2}
		minPixelRatio={1}
		maxPixelCount={1920 * 1080}
		class="pointer-events-none fixed inset-0 z-0 {isShaderVisible
			? 'opacity-20'
			: 'opacity-0'} transition-opacity duration-500 ease-out"
	/>

	<div class="relative mx-auto w-full max-w-[1792px] p-5 lg:p-14">
		<div
			id="products"
			data-section
			class="relative z-20 grid w-full grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-11"
		>
			<div class="flex w-full flex-col justify-between lg:min-h-[664px]">
				<!-- Top Column -->
				<div class="mb-32 flex flex-col gap-12 lg:mb-0">
					<!-- Avatar and Name -->
					<div class="flex flex-col items-start gap-5">
						<div class="group relative">
							<div
								class="relative h-12 w-12 overflow-hidden bg-pg-avatar shadow-[0px_0px_1px_0.5px_var(--pg-border)]"
							>
								<div
									class="bg-[#d3d3d3] dark:bg-[#535353]"
									style="position:absolute;left:14px;top:7px;width:48px;height:58px;filter:blur(9px)"
								></div>
								<div
									class="bg-[#bcbcbc] dark:bg-[#717171]"
									style="position:absolute;left:28px;top:17px;width:55px;height:58px;filter:blur(9px)"
								></div>
								<div
									class="bg-[#ededed] dark:bg-[#929292]"
									style="position:absolute;left:7px;top:29px;width:14px;height:27px;filter:blur(9px)"
								></div>
							</div>
							<img
								class="pointer-events-none absolute bottom-0 left-0 w-[140px] max-w-none translate-y-1 opacity-0 transition-all duration-100 ease-out group-hover:translate-y-0 group-hover:opacity-100"
								src="/assets/me.png"
								alt="Manuel"
							/>
						</div>
						<div class="flex w-full min-w-0 flex-col gap-0.5">
							<span
								class="text-[20px] leading-[28px] font-medium text-pg-text"
								>Hey, I'm Manuel.</span
							>
							<span
								class="font-serif text-[20px] leading-[28px] text-pg-text-2"
								>Designer · Builder · Founder</span
							>
						</div>
					</div>

					<!--H1-->
					<div class="flex flex-col gap-9">
						<div class="flex flex-col gap-5">
							<h1
								class="text-[28px] leading-[36px] font-medium text-pg-text"
							>
								<span>I've been the founder.</span><br />
								<span
									class="font-serif text-[30px] leading-[36px] font-normal text-pg-text"
									>Now I build for them.</span
								>
							</h1>

							<p
								class="max-w-[488px] text-[20px] leading-[24px] font-medium text-pg-text-muted md:text-[24px] md:leading-[28px]"
							>
								I build like someone who's had to ship under
								pressure, fast, focused, and close to real use.
							</p>
						</div>

						<!-- <button
							class="h-11 w-fit border border-pg-border bg-pg-surface-2 px-4 text-[16px] leading-[20px] font-medium text-pg-text-bright"
						>
							Tell me what you're building
						</button> -->

						<button
							class="h-11 w-fit px-4 text-base dark:bg-neutral-300 dark:hover:bg-neutral-200"
							>Tell me what you're building</button
						>
					</div>
				</div>

				<!-- Bottom Column -->
				<div
					class="pointer-events-none mt-8 max-w-[720px] text-[20px] leading-[28px] font-medium text-pg-text-muted select-none md:text-[24px] md:leading-[28px] lg:mt-0"
				>
					<button
						onmouseenter={() => showShader("#F6590A")}
						onmousemove={() => showShader("#F6590A")}
						onfocus={() => showShader("#F6590A")}
						onmouseleave={hideShader}
						onblur={hideShader}
						ontouchstart={() => showShader("#F6590A")}
						ontouchend={hideShader}
						ontouchcancel={hideShader}
						onclick={() =>
							window.open(
								"https://tryflowdrive.com?ref=manuelogomigo",
								"_blank",
							)}
						class="pointer-events-auto inline-flex cursor-pointer items-center gap-2 border border-pg-border bg-pg-surface px-2 transition-colors duration-200 hover:border-[#F6590A] hover:text-pg-text-bright"
					>
						<span class="h-4 w-4 bg-pg-text"> </span>
						Flowdrive
					</button>,
					<button
						onmouseenter={() => showShader("#31F3A2")}
						onmousemove={() => showShader("#31F3A2")}
						onfocus={() => showShader("#31F3A2")}
						onmouseleave={hideShader}
						onblur={hideShader}
						ontouchstart={() => showShader("#31F3A2")}
						ontouchend={hideShader}
						ontouchcancel={hideShader}
						onclick={() =>
							window.open(
								"https://scheduleflow.app?ref=manuelogomigo",
								"_blank",
							)}
						class="pointer-events-auto inline-flex cursor-pointer items-center gap-2 border border-pg-border bg-pg-surface px-2 transition-colors duration-200 hover:border-[#31F3A2] hover:text-pg-text-bright"
					>
						<span class="h-4 w-4 bg-pg-text"> </span>
						Scheduleflow
					</button>,
					<button
						onmouseenter={() => showShader("#C4FC5E")}
						onmousemove={() => showShader("#C4FC5E")}
						onfocus={() => showShader("#C4FC5E")}
						onmouseleave={hideShader}
						onblur={hideShader}
						ontouchstart={() => showShader("#C4FC5E")}
						ontouchend={hideShader}
						ontouchcancel={hideShader}
						onclick={() =>
							window.open(
								"https://flowscriipt.com?ref=manuelogomigo",
								"_blank",
							)}
						class="pointer-events-auto inline-flex cursor-pointer items-center gap-2 border border-pg-border bg-pg-surface px-2 transition-colors duration-200 hover:border-[#C4FC5E] hover:text-pg-text-bright"
					>
						<span class="h-4 w-4 bg-pg-text"> </span>
						Flowscriipt
					</button>,
					<button
						onmouseenter={() => showShader("#6702E5")}
						onmousemove={() => showShader("#6702E5")}
						onfocus={() => showShader("#6702E5")}
						onmouseleave={hideShader}
						onblur={hideShader}
						ontouchstart={() => showShader("#6702E5")}
						ontouchend={hideShader}
						ontouchcancel={hideShader}
						onclick={() =>
							window.open(
								"https://markdrop.app?ref=manuelogomigo",
								"_blank",
							)}
						class="pointer-events-auto inline-flex cursor-pointer items-center gap-2 border border-pg-border bg-pg-surface px-2 transition-colors duration-200 hover:border-[#6702E5] hover:text-pg-text-bright"
					>
						<span class="h-4 w-4 bg-pg-text"> </span>
						Markdrop
					</button>, shipped solo. Used by people at ElevenLabs,
					Webflow, Monday.com, Chili Piper, Kajabi, The Washington
					Post, and Dagster.
				</div>
			</div>
		</div>

		<div
			class="pointer-events-none absolute top-0 left-0 z-0 hidden h-full w-full gap-11 px-14 lg:flex"
		>
			<div class="h-full w-full pt-[780px]">
				<div
					class="mx-auto h-full w-full border-l border-pg-border"
					style="width:1px;"
				></div>
			</div>
			<div class="h-full w-full">
				<div
					class="mx-auto h-full w-full border-l border-pg-border"
					style="width:1px;"
				></div>
			</div>
		</div>
	</div>
</div>

<!-- <style>
	@import url('https://fonts.googleapis.com/css2?family=Inter+Tight&display=swap');

	:global(html),
	:global(body) {
		font-family: 'Inter Tight', sans-serif;
	}

	:global(.font-serif) {
		font-family: 'PP Mondwest', sans-serif;
	}
</style> -->
