import type { RecipeType } from '$lib/models/recipe/recipeType';
import { Recipe } from '$lib/models/recipe/recipe';

export interface GroupedRecipes {
	[key: string]: GroupedRecipe;
}

export interface GroupedRecipe {
	type: RecipeType;
	recipes: Recipe[];
}
