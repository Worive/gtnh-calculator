import type { GroupedRecipe } from '$lib/types/recipe/grouped-recipe';

export interface GroupedRecipes {
	[key: string]: GroupedRecipe;
}
