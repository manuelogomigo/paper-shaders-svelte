<script>
	import { Dithering } from '@devmischief/paper-shaders-svelte';
</script>

<main class="hero">
	<section class="content">
		<h1>paper-shaders-svelte</h1>
		<p>
			Lightweight shader components for Svelte. Drop in a component, tune a few props, and ship
			animated visual depth fast.
		</p>

		<div class="code-snippet">
			<code>pnpm add @devmischief/paper-shaders-svelte</code>
		</div>
	</section>

	<section class="demo-frame" aria-label="Dithering shader demo">
		<Dithering
			width="100%"
			height={420}
			colorBack="#0b1020"
			colorFront="#84f4a3"
			shape="warp"
			type="4x4"
			size={1}
			speed={1}
			scale={0.85}
			offsetX={-0.02}
		/>
	</section>
</main>

<style>
	.hero {
		min-height: 100vh;
		padding: 3rem 1.25rem;
		display: grid;
		align-content: center;
		gap: 2rem;
		background: radial-gradient(circle at top, #1a2240 0%, #070b16 55%, #04060c 100%);
		color: #eef2ff;
	}

	.content {
		max-width: 54rem;
		margin: 0 auto;
		text-align: center;
	}

	h1 {
		margin: 0;
		font-size: clamp(2rem, 5vw, 3.5rem);
		line-height: 1.05;
	}

	p {
		margin: 1rem auto 0;
		max-width: 42rem;
		color: #b7c1dc;
		font-size: clamp(1rem, 2.2vw, 1.15rem);
	}

	.code-snippet {
		display: inline-flex;
		margin-top: 1.25rem;
		padding: 0.5rem 0.875rem;
		border: 1px solid #2e3f67;
		border-radius: 0.625rem;
		background: rgba(8, 12, 24, 0.7);
	}

	code {
		font-size: 0.9rem;
		color: #bafbcf;
	}

	.demo-frame {
		width: min(980px, 100%);
		margin: 0 auto;
		padding: 1rem;
		border: 1px solid #2d3a5f;
		border-radius: 1rem;
		background: rgba(7, 11, 22, 0.9);
		box-shadow: 0 20px 80px rgba(2, 5, 12, 0.45);
	}
</style>
