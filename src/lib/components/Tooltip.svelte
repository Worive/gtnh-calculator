<script lang="ts">
	import { tooltipStore } from '../stores/tooltip.store';
	import { NeiService } from '$lib/services/nei.service';
	import NeiRecipe from '$lib/components/NeiRecipe.svelte';

	let tooltipElement: HTMLElement;
	let position = { left: 0, top: 0 };

	// Reactive statement with all dependencies
	$: if ($tooltipStore.visible && $tooltipStore.targetElement && tooltipElement) {
		position = updatePosition() ?? { left: 0, top: 0 };
	}

	function updatePosition() {
		const target = $tooltipStore.targetElement;
		if (!target || !tooltipElement) return;

		const targetRect = target.getBoundingClientRect();
		const tooltipRect = tooltipElement.getBoundingClientRect();

		return calculatePosition(targetRect, tooltipRect);
	}

	function calculatePosition(targetRect: DOMRect, tooltipRect: DOMRect) {
		const viewportWidth = window.innerWidth;
		const viewportHeight = window.innerHeight;

		// Horizontal positioning
		const left =
			targetRect.left > viewportWidth / 2 ? targetRect.left - tooltipRect.width : targetRect.right;

		// Vertical positioning
		const top =
			targetRect.top + tooltipRect.height > viewportHeight
				? viewportHeight - tooltipRect.height
				: Math.max(targetRect.top, 0);

		return { left, top };
	}
</script>

{#if $tooltipStore.visible}
	<div
		id="tooltip"
		bind:this={tooltipElement}
		style="left: {position.left}px; top: {position.top}px"
	>
		<header id="tooltip-header">{@html $tooltipStore.content?.header}</header>

		{#if $tooltipStore.content?.debug}
			<p id="tooltip-debug">{$tooltipStore.content.debug}</p>
		{/if}

		{#if $tooltipStore.content?.text}
			<p id="tooltip-text">{@html $tooltipStore.content.text}</p>
		{/if}

		{#if $tooltipStore.content?.action}
			<p id="tooltip-action">{$tooltipStore.content.action}</p>
		{/if}

		{#if $tooltipStore.content?.mod}
			<p id="tooltip-mod">{$tooltipStore.content.mod}</p>
		{/if}

		{#if $tooltipStore.content?.recipe}
			<div id="tooltip-recipe">
				{#if $tooltipStore.content !== null}
					<NeiRecipe recipe={$tooltipStore.content.recipe} />
				{/if}
			</div>
		{/if}
	</div>
{/if}

<style>
	#tooltip {
		max-width: 500px;
		border-style: solid;
		background-color: #100010;
		border-color: #100010;
		border-radius: 2px;
		border-width: 2px;
		text-shadow: 2px 2px #342c34;
		display: table;
		padding: 2px 10px 0;
		position: absolute;
		box-shadow: inset 0 0 0 2px #4300d650;
	}

	#tooltip {
		z-index: 2000;
	}

	#tooltip-header {
		color: white;
		white-space: pre-line;
	}

	#tooltip-debug {
		color: #ffffff69;
		font-size: 8px;
		word-spacing: 1px;
		text-shadow: 1px 1px #342c34;
		line-height: 16px;
		white-space: pre-line;
	}

	#tooltip-text {
		color: #aca1ab;
		white-space: pre-line;
	}

	#tooltip-action {
		color: #cecf76;
		white-space: pre-line;
	}

	#tooltip-mod {
		color: #5457fa;
		line-height: 1;
	}
</style>
