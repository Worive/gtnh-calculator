<script lang="ts">
	import { Goods } from '$lib/core/data/models/Goods.js';
	import { Recipe } from '$lib/core/data/models/Recipe.js';
	import NeiRecipe from '$lib/components/NeiRecipe.svelte';
	import { neiStore } from '$lib/stores/nei.store.js';
	import { repositoryStore } from '$lib/stores/repository.store.js';
	import { SearchQuery } from '$lib/core/data/models/SearchQuery.js';
	import { ShowNeiMode } from '$lib/types/enums/ShowNeiMode';
	import type { GroupedRecipe } from '$lib/types/grouped-recipe';
	import ItemIcon from '$lib/components/nei/ItemIcon.svelte';

	$: mode = $neiStore.currentMode;

	$: groupedRecipes = getGroupedRecipes($neiStore.search);

	function getGroupedRecipes(search: string | null): GroupedRecipe {
		if ($neiStore.currentGoods instanceof Goods) {
			let goods: Int32Array;

			if (mode === ShowNeiMode.Production) {
				goods = $neiStore.currentGoods.production;
			} else if (mode === ShowNeiMode.Consumption) {
				goods = $neiStore.currentGoods.consumption;
			} else {
				throw new Error('Unknown NEI mode: ' + mode);
			}

			return Array.from(goods)
				.map((pointer) => $repositoryStore?.GetObject(pointer, Recipe))
				.filter((recipe): recipe is Recipe => recipe !== undefined)
				.filter((recipe) => (search ? recipe.MatchSearchText(new SearchQuery(search)) : true))
				.sort(Recipe.sortByNei)
				.reduce((result: GroupedRecipe, recipe: Recipe) => {
					const key = recipe.recipeType.name;

					if (!result[key]) {
						result[key] = {
							type: recipe.recipeType,
							recipes: []
						};
					}

					result[key].recipes.push(recipe);
					return result;
				}, {} as GroupedRecipe);
		}

		return {};
	}
</script>

<div class="recipe-list">
	{#each Object.entries(groupedRecipes) as [recipeTypeName, groupedRecipe]}
		<div class="recipe-group">
			<div class="header">
				<div class="recipe-group-machines">
					{#each groupedRecipe.type.singleblocks as block}
						<ItemIcon dataId={block.id} />
					{/each}

					{#each groupedRecipe.type.multiblocks as block}
						<ItemIcon dataId={block.id} />
					{/each}
				</div>
				<p>{recipeTypeName}</p>
			</div>

			<div class="recipe-group-recipes">
				{#each groupedRecipe.recipes as recipe}
					{#if recipe}
						<NeiRecipe {recipe} />
					{/if}
				{/each}
			</div>
		</div>
	{/each}
</div>

<style>
	.recipe-list {
		max-height: 80vh;
		overflow-y: scroll;
	}

	.header {
		display: inline-flex;
	}

	.recipe-group-recipes {
		display: flex;
		flex-wrap: wrap;
		width: 100%;
	}

	.recipe-group-machines {
		display: flex;
		flex-wrap: wrap;
		gap: 2px;
		margin: 0 5px;
		width: fit-content;
	}
</style>
