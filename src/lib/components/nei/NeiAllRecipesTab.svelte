<script lang="ts">
	import { neiStore } from '$lib/stores/nei.store.js';
	import ItemIcon from '$lib/components/nei/ItemIcon.svelte';
	import NeiRecipeGroup from '$lib/components/nei/NeiRecipeGroup.svelte';
	import { NeiService } from '$lib/services/nei.service.js';

	$: mode = $neiStore.currentMode;

	$: groupedRecipes = NeiService.getGroupedRecipes(mode, $neiStore.search);
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

			<NeiRecipeGroup recipes={groupedRecipe.recipes} />
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

	.recipe-group-machines {
		display: flex;
		flex-wrap: wrap;
		gap: 2px;
		margin: 0 5px;
		width: fit-content;
	}
</style>
