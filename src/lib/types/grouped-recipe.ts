import { Recipe } from '$lib/core/data/models/Recipe';
import type { RecipeType } from '$lib/core/data/models/RecipeType';

export interface GroupedRecipe {
	[key: string]: {
		type: RecipeType;
		recipes: Recipe[];
	};
}
