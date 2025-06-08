import type { RecipeIoType } from '$lib/types/enums/RecipeIoType';
import type { RecipeObject } from '$lib/models/recipe/RecipeObject';

export type RecipeIo = {
	type: RecipeIoType;
	goodsPtr: number;
	goods: RecipeObject;
	slot: number;
	amount: number;
	probability: number;
};
