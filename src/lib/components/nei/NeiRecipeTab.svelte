<script lang="ts">
import {Goods} from "$lib/core/data/models/Goods.js";
import {Recipe} from "$lib/core/data/models/Recipe.js";
import NeiRecipe from "$lib/components/NeiRecipe.svelte";
import {neiStore} from "$lib/stores/nei.store.js";
import {repositoryStore} from "$lib/stores/repository.store.js";
import {SearchQuery} from "$lib/core/data/models/SearchQuery.js";

$: search = $neiStore.search;

$: recipes = ($neiStore.currentGoods instanceof Goods) ? Array.from($neiStore.currentGoods.production)
    .map((pointer) => $repositoryStore?.GetObject(pointer, Recipe))
    .filter((recipe) => recipe !== undefined)
    .filter((recipe) => search ? recipe.MatchSearchText(new SearchQuery(search)) : true)
    : [];

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
        display:flex;
        max-height: 80vh;
        flex-wrap: wrap;
        overflow-y: scroll;
    }
</style>