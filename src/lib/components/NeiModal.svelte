<script lang="ts">
	import { neiStore } from '$lib/stores/nei.store';
	import type { NeiTab } from '$lib/types/nei-tab';
	import { Item } from '$lib/core/data/models/Item';
	import { get } from 'svelte/store';
	import { repositoryStore } from '$lib/stores/repository.store';
	import { SearchQuery } from '$lib/core/data/models/SearchQuery';
	import type { NeiFiller } from '$lib/types/nei-filler';
	import { NeiGrid } from '$lib/core/data/models/NeiGrid';
	import type { NeiRecipeMap } from '$lib/types/nei-recipe-map';
	import { TooltipService } from '$lib/services/tooltip.service';
	import { NeiService } from '$lib/services/nei.service';
	import NeiItemsTab from '$lib/components/nei/NeiItemsTab.svelte';
	import { afterUpdate, onDestroy, onMount } from 'svelte';
	import NeiRecipeTab from '$lib/components/nei/NeiRecipeTab.svelte';

	$: show = $neiStore.visible;

	$: repository = $repositoryStore;

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

	var FillNeiAllRecipes: NeiFiller = function (
		grid: NeiGrid,
		search: SearchQuery | null,
		recipes: NeiRecipeMap
	) {
		for (const recipeType of get(neiStore).allRecipeTypes) {
			var list = recipes[recipeType.name];
			if (list.length > 0) {
				{
					let allocator = grid.BeginAllocation(list.allocator);
					allocator.Add(recipeType);
				}

				{
					let allocator = grid.BeginAllocation(list);
					for (let i = 0; i < list.length; i++) {
						if (search == null || repository!.IsObjectMatchingSearch(list[i], search))
							allocator.Add(list[i]);
					}
				}
			}
		}
	};

	let tabs: NeiTab[] = [];

	let repositoryDefined = $repositoryStore !== null;

	repositoryStore.subscribe((value) => {
		if (!repositoryDefined && !(value === null)) {
			repositoryDefined = true;

			tabs = [
				{
					name: 'All Items',
					filler: null,
					iconId: value!.GetObject(value!.service[0], Item).iconId,
					isVisible: () => true,
					dom: null
				},
				{
					name: 'All Recipes',
					filler: FillNeiAllRecipes,
					iconId: value!.GetObject(value!.service[1], Item).iconId,
					isVisible: () => get(neiStore).currentGoods !== null,
					dom: null
				}
			];
		}
	});

	function switchTab(index: number): void {
		const activeTabIndex = get(neiStore).activeTabIndex;
		if (index === activeTabIndex) return;

		neiStore.update((state) => ({
			...state,
			activeTabIndex: index
		}));
	}

	$: activeTab = $neiStore.activeTabIndex;

	function isTabActive(index: number): boolean {
		const activeTabIndex = activeTab;

		return activeTabIndex === index;
	}
</script>

{#if show}
	<div id="nei" class="panel-tab-container" bind:this={panelContainer}>
		<div class="panel-tab-bar">
			<div id="nei-tabs" class="panel-tabs">
				{#each tabs as tab, index}
					<div
						class="panel-tab {isTabActive(index) ? 'active' : ''}"
						bind:this={tab.dom}
						on:click={() => switchTab(index)}
						on:mouseenter={() => TooltipService.show(tab.dom, { header: tab.name })}
					>
						<icon
							class="icon"
							style="--pos-x:{(tab.iconId % 256) * -32}px; --pos-y:{Math.floor(tab.iconId / 256) *
								-32}px"
						></icon>
					</div>
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
					<button class="mc-button" id="nei-back">←</button>
				{/if}

				<button class="mc-button" id="nei-close" on:click={() => NeiService.hide()}>x</button>
			</div>

			{#if $neiStore.activeTabIndex === 0}
				<NeiItemsTab bind:containerElement={gridElement} />
			{:else if $neiStore.activeTabIndex === 1}
				<NeiRecipeTab />
			{/if}
		</div>
	</div>
{/if}
