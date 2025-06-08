import type { RecipeType } from '$lib/models/recipe/RecipeType';
import { Recipe } from '$lib/models/recipe/Recipe';

export interface GroupedRecipes {
	[key: string]: GroupedRecipe;
}

export interface GroupedRecipe {
	type: RecipeType;
	recipes: Recipe[];
}
