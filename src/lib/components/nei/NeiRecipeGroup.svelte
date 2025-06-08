<script lang="ts">
	import NeiRecipe from '$lib/components/nei/NeiRecipe.svelte';
	import { Recipe } from '$lib/models/recipe/recipe.js';

	const { recipes } = $props<{
		recipes: Recipe[];
	}>();
</script>

<div class="recipe-group-recipes">
	{#each recipes as recipe (recipe)}
		{#if recipe}
			<NeiRecipe {recipe} />
		{/if}
	{/each}
</div>

<style>
	.recipe-group-recipes {
		display: flex;
		flex-wrap: wrap;
		width: 100%;
	}
</style>
