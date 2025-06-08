import type { Goods } from '$lib/models/items/Goods';
import type { Recipe } from '$lib/models/recipe/Recipe';

export type ShowCallback = {
	onSelectGoods?(goods: Goods): void;
	onSelectRecipe?(recipe: Recipe): void;
};
