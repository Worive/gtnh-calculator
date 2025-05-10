<script lang="ts">
    import type {Recipe} from "$lib/core/data/models/Recipe";
    import {get} from "svelte/store";
    import {neiStore} from "$lib/stores/nei.store";
    import {elementSize} from "$lib/types/constants/nei.consts";
    import NeiRecipeItemGrid from "$lib/components/nei/NeiRecipeItemGrid.svelte";
    import {RecipeIoType} from "$lib/types/enums/RecipeIoType";

    export let recipe: Recipe;

    const recipeType = recipe.recipeType;
    const builder = get(neiStore).mapRecipeTypeToRecipeList[recipeType.name];

    const width = builder.CalculateWidth();
    const height = builder.CalculateHeight(recipe);

    const showNeiCallback = get(neiStore).showNeiCallback;
    const canSelectRecipe = showNeiCallback?.onSelectRecipe != null;

</script>

<div class="nei-recipe-box" style="left:0px; top:0px; width:{Math.round(width * elementSize)}px; height:${height * elementSize}px">
    <div class="nei-recipe-io">
        <div class="nei-recipe-items">
            <NeiRecipeItemGrid items={recipe.items} recipeTypeInfo={builder} types={[RecipeIoType.OreDictInput, RecipeIoType.ItemInput]}></NeiRecipeItemGrid>
        </div>

        <div class="arrow-container">
            <div class="arrow"></div>

            {#if canSelectRecipe}
                <button class="select-recipe-btn" data-recipe="${recipe.objectOffset}">+</button>
            {/if}
        </div>
    </div>
</div>
{@html builder.BuildRowDom([recipe], width, height, 0)}
