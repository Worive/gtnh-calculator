<script lang="ts">
	import NeiRecipeGroup from '$lib/components/nei/NeiRecipeGroup.svelte';
	import type { Recipe } from '$lib/models/recipe/Recipe';

	export let recipes: Recipe[];
</script>

<div class="recipe-list">
	<div class="recipe-group">
		<NeiRecipeGroup {recipes} />
	</div>
</div>

<style>
	.recipe-list {
		max-height: 80vh;
		overflow-y: scroll;
	}
</style>
