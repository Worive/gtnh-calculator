import type { RecipeObject } from '$lib/models/recipe/recipeObject';
import type { ShowNeiMode } from '$lib/types/enums/showNeiMode';

export type History = {
	goods: RecipeObject | null;
	mode: ShowNeiMode;
	tabIndex: number;
};
