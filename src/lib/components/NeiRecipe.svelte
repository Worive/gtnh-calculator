<script lang="ts">
	import type { Recipe } from '$lib/core/data/models/Recipe';
	import { get } from 'svelte/store';
	import { neiStore } from '$lib/stores/nei.store';
	import NeiRecipeItemGrid from '$lib/components/nei/NeiRecipeItemGrid.svelte';
	import { RecipeIoType } from '$lib/types/enums/RecipeIoType';
	import type { RecipeInOut } from '$lib/types/models/Recipe';
	import { voltageTier } from '$lib/types/constants/voltageTiers.const';
	import { formatAmount } from '$lib/utils/Formatting';
	import McButton from '$lib/components/McButton.svelte';
	import { currentPageStore } from '$lib/stores/currentPage.store';
	import { repositoryStore } from '$lib/stores/repository.store';
	import { NeiService } from '$lib/services/nei.service';

	export let recipe: Recipe;

	const recipeType = recipe.recipeType;
	const builder = get(neiStore).mapRecipeTypeToRecipeList[recipeType.name];

	const showNeiCallback = get(neiStore).showNeiCallback;
	const canSelectRecipe = showNeiCallback?.onSelectRecipe != null;

	function itemsFilteredByType(items: RecipeInOut[], types: RecipeIoType[]): RecipeInOut[] {
		return items.filter((item) => types.includes(item.type));
	}

	function onSelectRecipe() {
		if (canSelectRecipe && showNeiCallback && showNeiCallback.onSelectRecipe) {
			showNeiCallback.onSelectRecipe(recipe);
			NeiService.hide();
		}
	}
</script>

<div class="nei-recipe-box">
	<div class="nei-recipe-io">
		<div class="nei-recipe-items">
			<NeiRecipeItemGrid
				items={itemsFilteredByType(recipe.items, [
					RecipeIoType.OreDictInput,
					RecipeIoType.ItemInput
				])}
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
				<McButton on:click={onSelectRecipe}>+</McButton>
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
			{#if recipe.gtRecipe.cleanRoom}
				• Cleanroom{/if}
			{#if recipe.gtRecipe.lowGravity}
				• Low gravity{/if}
			{#if recipe.gtRecipe.amperage !== 1}
				• {recipe.gtRecipe.amperage}A{/if}
		</span>

		<span class="text-small">
			{formatAmount(recipe.gtRecipe.voltage)}v •
			{formatAmount(
				recipe.gtRecipe.voltage * recipe.gtRecipe.amperage * recipe.gtRecipe.durationTicks
			)}eu
		</span>

		{#if recipe.gtRecipe.additionalInfo}
			<span class="text-small">
				{recipe.gtRecipe.additionalInfo}
			</span>
		{/if}
	{/if}
</div>

<style>
	.nei-recipe-box {
		padding: 5px;
		position: unset;
	}
</style>
