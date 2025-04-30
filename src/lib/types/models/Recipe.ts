import type {RecipeIoType} from "$lib/types/enums/RecipeIoType";
import type {RecipeObject} from "$lib/core/data/models/RecipeObject";

export type RecipeInOut =
    {
        type: RecipeIoType;
        goodsPtr: number;
        goods: RecipeObject;
        slot: number;
        amount: number;
        probability: number;
    }