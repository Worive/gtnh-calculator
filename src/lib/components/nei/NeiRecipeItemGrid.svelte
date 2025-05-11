<script lang="ts">

    import type {NeiRecipeTypeInfo} from "$lib/core/NeiRecipeTypeInfo";
    import type {RecipeInOut} from "$lib/types/models/Recipe";
    import {RecipeIoType} from "$lib/types/enums/RecipeIoType";
    import ItemIcon from "$lib/components/nei/ItemIcon.svelte";
    import {elementSize} from "$lib/types/constants/nei.consts";

    export let recipeTypeInfo: NeiRecipeTypeInfo;

    export let items: RecipeInOut[];
    export let dimensionOffset: number = 0;

    const dimX = recipeTypeInfo.dimensions[dimensionOffset];
    const dimY = recipeTypeInfo.dimensions[dimensionOffset + 1];

    function getProbability(item: RecipeInOut): number | null {
        if (item.probability >= 1) {
            return null;
        }

        if (![RecipeIoType.ItemOutput, RecipeIoType.FluidOutput].includes(item.type)) {
            return null;
        }

        return item.probability;
    }

    function getItemGridX(item: RecipeInOut): number
    {
        return item.slot % dimX + 1;
    }

    function getItemGridY(item: RecipeInOut): number
    {
        return Math.floor(item.slot / dimX) % dimY + 1;
    }
</script>

{#if items.length > 0}
    <div class="icon-grid"
                           style:grid-template-columns={`repeat(${dimX}, ${elementSize}px)`}
                           style:grid-template-rows={`repeat(${dimY}, ${elementSize}px)`}
                           data-debug-column="{dimX}"
                           data-debug-row="{dimY}"
>
    {#each items as item}
        <div class="center" style:grid-column={`${getItemGridX(item)}`} style:grid-row={`${getItemGridY(item)}`}
             data-debug-column="{getItemGridX(item)}"
             data-debug-row="{getItemGridY(item)}"
             data-debug-slot="{item.slot}"
        >
            <ItemIcon dataId="{item.goods.id}" amount="{item.amount}" probability="{getProbability(item)}"/>
        </div>
    {/each}
</div>
{/if}


<style>
    .icon-grid {
        display: grid;
        gap: 0;
        background-repeat: repeat;
        width: fit-content;
        height: fit-content;
        position: relative;
        background-size: 36px;
        background-image: url("/assets/images/Slot.png");
    }

    .center {
        display: flex;
        justify-content: center;
        align-items: center;
    }
</style>
