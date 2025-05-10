<script lang="ts">
    import {repositoryStore} from "$lib/stores/repository.store";
    import {SearchQuery} from "$lib/core/data/models/SearchQuery";
    import {Fluid} from "$lib/core/data/models/Fluid";
    import ItemIcon from "$lib/components/nei/ItemIcon.svelte";
    import type {Goods} from "$lib/core/data/models/Goods";
    import {Item} from "$lib/core/data/models/Item";
    import VirtualScroll from "$lib/components/nei/VirtualScroll.svelte";

    export let containerElement: HTMLDivElement | null = null;

    export let search: string;
    $: repository = $repositoryStore;

    let goods: Goods[] = [];

    $: {
        if (repository) {
            goods = [];
            const searchQuery = new SearchQuery(search ?? "");

            for (let i = 0; i < repository.fluids.length; i++) {
                const element = repository.GetObjectIfMatchingSearch(searchQuery, repository.fluids[i], Fluid);

                if (element) {
                    goods.push(element);
                }
            }

            for (let i = 0; i < repository.items.length; i++) {
                const element = repository.GetObjectIfMatchingSearch(searchQuery, repository.items[i], Item);

                if (element) {
                    goods.push(element);
                }
            }
        }
    }
</script>

<div style="width: 100%; height: 80vh;">
    <VirtualScroll items={goods} itemSize={36} bind:containerElement={containerElement}>
        <div slot="item" let:item style="padding: 2px">
            <ItemIcon dataId="{item.id}"/>
        </div>
    </VirtualScroll>
</div>


