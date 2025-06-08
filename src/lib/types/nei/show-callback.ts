import type { Goods } from '$lib/core/data/models/Goods';
import type { Recipe } from '$lib/core/data/models/Recipe';

export type ShowCallback = {
	onSelectGoods?(goods: Goods): void;
	onSelectRecipe?(recipe: Recipe): void;
};
