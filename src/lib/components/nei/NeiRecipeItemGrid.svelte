<script lang="ts">

    import type {NeiRecipeTypeInfo} from "$lib/core/NeiRecipeTypeInfo";
    import type {RecipeInOut} from "$lib/types/models/Recipe";
    import {RecipeIoType} from "$lib/types/enums/RecipeIoType";

    export let recipeTypeInfo: NeiRecipeTypeInfo;

    export let items: RecipeInOut[];
    export let dimensionOffset: number = 0;
    export let types: RecipeIoType[];
    var dimX = recipeTypeInfo.dimensions[dimensionOffset];
    var dimY = recipeTypeInfo.dimensions[dimensionOffset + 1];
    const gridWidth = dimX * 36;
    const gridHeight = dimY * 36;

    function getGridX(item: RecipeInOut): number {
        return (item.slot % dimX) * 36 + 2;
    }

    function getGridY(item: RecipeInOut): number {
        return Math.floor(item.slot / dimX) * 36 + 2
    }
</script>

<div class="icon-grid" style="--grid-pixel-width:{gridWidth}px; --grid-pixel-height:{gridHeight}px">
    {#each items as item}
        {#if types.includes(item.type)}
            <item-icon class="item-icon-grid"
                       data-id="{item.goods.id}"
                       data-amount="{item.amount}"
            >
                {#if item.probability < 1 && (item.type === RecipeIoType.ItemOutput || item.type === RecipeIoType.FluidOutput)}
                    <span class="probability">{Math.round(item.probability * 100)}%</span>
                {/if}
            </item-icon>
        {/if}
    {/each}
</div>
