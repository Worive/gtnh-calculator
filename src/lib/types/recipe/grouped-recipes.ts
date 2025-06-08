import type { RecipeType } from '$lib/core/data/models/RecipeType';
import { Recipe } from '$lib/core/data/models/Recipe';

export interface GroupedRecipes {
	[key: string]: GroupedRecipe;
}

export interface GroupedRecipe {
	type: RecipeType;
	recipes: Recipe[];
}
