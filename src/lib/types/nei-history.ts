import type { RecipeObject } from '$lib/core/data/models/RecipeObject';
import type { ShowNeiMode } from '$lib/types/enums/ShowNeiMode';

export type NeiHistory = {
	goods: RecipeObject | null;
	mode: ShowNeiMode;
	tabIndex: number;
};
