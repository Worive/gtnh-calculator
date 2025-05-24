import { Recipe } from '$lib/core/data/models/Recipe';
import type { RecipeType } from '$lib/core/data/models/RecipeType';

export interface GroupedRecipesDict {
	[key: string]: GroupedRecipe;
}

export interface GroupedRecipe {
	type: RecipeType;
	recipes: Recipe[];
}
