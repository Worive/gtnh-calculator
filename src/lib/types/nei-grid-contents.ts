import type { Recipe } from '$lib/core/data/models/Recipe';
import type { Goods } from '$lib/core/data/models/Goods';
import type { RecipeType } from '$lib/core/data/models/RecipeType';

export type NeiGridContents = Recipe | Goods | RecipeType;
