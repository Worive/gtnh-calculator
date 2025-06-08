import type { Goods } from '$lib/models/items/goods';
import type { Recipe } from '$lib/models/recipe/recipe';

export type ShowCallback = {
	onSelectGoods?(goods: Goods): void;
	onSelectRecipe?(recipe: Recipe): void;
};
