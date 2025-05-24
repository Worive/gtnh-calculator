<script lang="ts">
	import { neiStore } from '$lib/stores/nei.store';
	import { TooltipService } from '$lib/services/tooltip.service';
	import { NeiService } from '$lib/services/nei.service';
	import { afterUpdate, onDestroy, onMount } from 'svelte';
	import McButton from '$lib/components/McButton.svelte';

	$: show = $neiStore.visible;

	let panelContainer: HTMLDivElement;
	let gridElement: HTMLDivElement;
	const unit = 36;

	function snapWidth() {
		if (!panelContainer) return;

		const maxAllowedWidth = Math.floor(window.innerWidth * 0.9);

		// Does the grid content overflow vertically? If yes, there's a scrollbar
		const scrollbarWidth =
			gridElement?.scrollHeight > gridElement?.clientHeight
				? window.innerWidth - document.documentElement.clientWidth
				: 0;

		const usableWidth = maxAllowedWidth - scrollbarWidth;

		const snappedWidth = Math.floor(usableWidth / unit) * unit;
		panelContainer.style.width = `${snappedWidth}px`;
	}

	afterUpdate(snapWidth);

	onMount(() => {
		snapWidth();
		window.addEventListener('resize', snapWidth);
	});

	onDestroy(() => {
		window.removeEventListener('resize', snapWidth);
	});

	$: activeTab =
		$neiStore.activeTabIndex !== null ? $neiStore.tabs[$neiStore.activeTabIndex] : null;

	function isTabActive(tabId: string): boolean {
		return tabId === activeTab?.name;
	}
</script>

{#if show}
	<div id="nei" class="panel-tab-container" bind:this={panelContainer}>
		<div class="panel-tab-bar">
			<div id="nei-tabs" class="panel-tabs">
				{#each $neiStore.tabs as tab, index}
					{#if tab.visible($neiStore)}
						<div
							class="panel-tab {isTabActive(tab.name) ? 'active' : ''}"
							on:click={() => NeiService.changeTab(index)}
							on:mouseenter={(e) => TooltipService.show(e.currentTarget, { header: tab.name })}
						>
							<icon
								class="icon"
								style="--pos-x:{(tab.iconId % 256) * -32}px; --pos-y:{Math.floor(tab.iconId / 256) *
									-32}px"
							></icon>
						</div>
					{/if}
				{/each}
			</div>
		</div>
		<div class="panel">
			<div class="hgroup">
				Search:
				<input
					id="nei-search"
					placeholder="Start typing for search"
					bind:value={$neiStore.search}
				/>
				{#if $neiStore.history.length > 0}
					<McButton on:click={() => NeiService.back()}>←</McButton>
				{/if}

				<McButton on:click={() => NeiService.hide()}>x</McButton>
			</div>

			{#if activeTab}
				<svelte:component this={activeTab.component} />
			{/if}
		</div>
	</div>
{/if}
