import type { RecipeObject } from '$lib/models/recipe/RecipeObject';
import type { ShowNeiMode } from '$lib/types/enums/ShowNeiMode';

export type History = {
	goods: RecipeObject | null;
	mode: ShowNeiMode;
	tabIndex: number;
};
