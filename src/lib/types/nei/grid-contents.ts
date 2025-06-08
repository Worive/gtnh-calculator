import type { Recipe } from '$lib/models/recipe/Recipe';
import type { Goods } from '$lib/models/items/Goods';
import type { RecipeType } from '$lib/models/recipe/RecipeType';

export type GridContents = Recipe | Goods | RecipeType;
