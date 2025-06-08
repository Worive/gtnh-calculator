import type { RecipeIoType } from '$lib/types/enums/recipeIoType';
import type { RecipeObject } from '$lib/models/recipe/recipeObject';

export type RecipeIo = {
	type: RecipeIoType;
	goodsPtr: number;
	goods: RecipeObject;
	slot: number;
	amount: number;
	probability: number;
};
