<script lang="ts">
    import type {Recipe} from "$lib/core/data/models/Recipe";
    import {get} from "svelte/store";
    import {neiStore} from "$lib/stores/nei.store";
    import {elementSize} from "$lib/types/constants/nei.consts";
    import NeiRecipeItemGrid from "$lib/components/nei/NeiRecipeItemGrid.svelte";
    import {RecipeIoType} from "$lib/types/enums/RecipeIoType";
    import type {RecipeInOut} from "$lib/types/models/Recipe";

    export let recipe: Recipe;

    const recipeType = recipe.recipeType;
    const builder = get(neiStore).mapRecipeTypeToRecipeList[recipeType.name];

    const width = builder.CalculateWidth();
    const height = builder.CalculateHeight(recipe);

    const showNeiCallback = get(neiStore).showNeiCallback;
    const canSelectRecipe = showNeiCallback?.onSelectRecipe != null;

    function itemsFilteredByType(items: RecipeInOut[], types: RecipeIoType[]): RecipeInOut[] {
        return items.filter((item) => types.includes(item.type));
    }
</script>

<div class="nei-recipe-box" style="left:0px; top:0px; width:{Math.round(width * elementSize)}px; height:${height * elementSize}px">
    <div class="nei-recipe-io">
        <div class="nei-recipe-items">
            <NeiRecipeItemGrid
                    items={itemsFilteredByType(recipe.items, [RecipeIoType.OreDictInput, RecipeIoType.ItemInput])}
                    recipeTypeInfo={builder}
            />

            <NeiRecipeItemGrid
                    items={itemsFilteredByType(recipe.items, [RecipeIoType.FluidInput])}
                    recipeTypeInfo={builder}
                    dimensionOffset={2}
            />
        </div>

        <div class="arrow-container">
            <div class="arrow"></div>

            {#if canSelectRecipe}
                <button class="mc-button select-recipe-btn" data-recipe="${recipe.objectOffset}">+</button>
            {/if}
        </div>

        <div class="nei-recipe-items">
            <NeiRecipeItemGrid
                    items={itemsFilteredByType(recipe.items, [RecipeIoType.ItemOutput])}
                    recipeTypeInfo={builder}
                    dimensionOffset={4}
            />
            <NeiRecipeItemGrid
                    items={itemsFilteredByType(recipe.items, [RecipeIoType.FluidOutput])}
                    recipeTypeInfo={builder}
                    dimensionOffset={6}
            />
        </div>
    </div>

    {#if recipe.gtRecipe}
            <span>
                {voltageTier[recipe.gtRecipe.voltageTier].name}
                • {recipe.gtRecipe.durationSeconds}s
                {#if recipe.gtRecipe.cleanRoom} • Cleanroom{/if}
                {#if recipe.gtRecipe.lowGravity} • Low gravity{/if}
                {#if recipe.gtRecipe.amperage !== 1} • {recipe.gtRecipe.amperage}A{/if}
            </span>

        <span class="text-small">
                {formatAmount(recipe.gtRecipe.voltage)}v •
            {formatAmount(recipe.gtRecipe.voltage * recipe.gtRecipe.amperage * recipe.gtRecipe.durationTicks)}eu
            </span>

        {#if recipe.gtRecipe.additionalInfo}
                <span class="text-small">
                  {recipe.gtRecipe.additionalInfo}
                </span>
        {/if}
    {/if}
</div>
{@html builder.BuildRowDom([recipe], width, height, 0)}
