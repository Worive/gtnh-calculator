<script lang="ts">
    import {Goods} from "$lib/core/data/models/Goods.js";
    import {Recipe} from "$lib/core/data/models/Recipe.js";
    import NeiRecipe from "$lib/components/NeiRecipe.svelte";
    import {neiStore} from "$lib/stores/nei.store.js";
    import {repositoryStore} from "$lib/stores/repository.store.js";
    import {SearchQuery} from "$lib/core/data/models/SearchQuery.js";
    import {ShowNeiMode} from "$lib/types/enums/ShowNeiMode";

    $: search = $neiStore.search;

    $: mode = $neiStore.currentMode;

    $: recipes = getRecipes();

    function getRecipes() {
        if ($neiStore.currentGoods instanceof Goods) {

            let goods: Int32Array;

            if (mode === ShowNeiMode.Production) {
                goods = $neiStore.currentGoods.production
            } else if (mode === ShowNeiMode.Consumption) {
                goods = $neiStore.currentGoods.consumption
            } else {
                throw new Error('Unknown NEI mode: ' + mode);
            }

            return Array.from(goods)
                .map((pointer) => $repositoryStore?.GetObject(pointer, Recipe))
                .filter((recipe) => recipe !== undefined)
                .filter((recipe) => search ? recipe.MatchSearchText(new SearchQuery(search)) : true);
        }

        return [];
    }

</script>

<div class="recipe-list">
    {#each recipes as recipe}
        {#if recipe}
            <NeiRecipe recipe={recipe}/>
        {/if}
    {/each}
</div>

<style>
    .recipe-list {
        display: flex;
        max-height: 80vh;
        flex-wrap: wrap;
        overflow-y: scroll;
    }
</style>