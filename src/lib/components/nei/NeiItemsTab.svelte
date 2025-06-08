<script lang="ts">
	import { repositoryStore } from '$lib/stores/recipe/repository.store';
	import { SearchQuery } from '$lib/models/search/searchQuery';
	import { Fluid } from '$lib/models/items/fluid';
	import ItemIcon from '$lib/components/nei/ItemIcon.svelte';
	import type { Goods } from '$lib/models/items/goods';
	import { Item } from '$lib/models/items/item';
	import VirtualScroll from '$lib/components/nei/VirtualScroll.svelte';
	import { neiStore } from '$lib/stores/nei/nei.store';

	export let containerElement: HTMLDivElement | null = null;

	$: search = $neiStore.search;
	$: repository = $repositoryStore;

	let goods: Goods[] = [];

	$: {
		if (repository) {
			goods = [];
			const searchQuery = new SearchQuery(search ?? '');

			for (let i = 0; i < repository.fluids.length; i++) {
				const element = repository.GetObjectIfMatchingSearch(
					searchQuery,
					repository.fluids[i],
					Fluid
				);

				if (element) {
					goods.push(element);
				}
			}

			for (let i = 0; i < repository.items.length; i++) {
				const element = repository.GetObjectIfMatchingSearch(
					searchQuery,
					repository.items[i],
					Item
				);

				if (element) {
					goods.push(element);
				}
			}
		}
	}
</script>

<div style="width: 100%; height: 80vh;">
	<VirtualScroll items={goods} itemSize={36} bind:containerElement>
		<div slot="item" let:item style="padding: 2px">
			<ItemIcon dataId={item.id} />
		</div>
	</VirtualScroll>
</div>
