import type { Recipe } from '$lib/models/recipe/recipe';
import type { Goods } from '$lib/models/items/goods';
import type { RecipeType } from '$lib/models/recipe/recipeType';

export type GridContents = Recipe | Goods | RecipeType;
