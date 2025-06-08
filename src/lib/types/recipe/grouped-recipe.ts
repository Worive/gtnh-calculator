import type { RecipeType } from '$lib/core/data/models/RecipeType';
import { Recipe } from '$lib/core/data/models/Recipe';

export interface GroupedRecipe {
	type: RecipeType;
	recipes: Recipe[];
}