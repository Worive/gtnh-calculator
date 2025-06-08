import { writable } from 'svelte/store';
import type { ShowCallback } from '$lib/types/nei/showCallback';
import type { RecipeType } from '$lib/models/recipe/recipeType';
import type { History } from '$lib/types/nei/history';
import type { RecipeMap } from '$lib/types/nei/recipeMap';
import type { RecipeObject } from '$lib/models/recipe/recipeObject';
import { ShowNeiMode } from '$lib/types/enums/showNeiMode';
import type { NeiGrid } from '$lib/models/nei/neiGrid';
import type { Tab } from '$lib/types/nei/tab';

export type NeiStore = {
	mapRecipeTypeToRecipeList: RecipeMap;
	allRecipeTypes: RecipeType[];
	showNeiCallback: ShowCallback | null;
	history: History[];
	visible: boolean;
	currentGoods: RecipeObject | null;
	currentMode: ShowNeiMode;
	activeTabIndex: number;
	search: string | null;
	currentGrid: NeiGrid | null;
	tabs: Tab[];
};

export const neiStore = writable<NeiStore>({
	mapRecipeTypeToRecipeList: {},
	allRecipeTypes: [],
	showNeiCallback: null,
	history: [],
	visible: false,
	currentGoods: null,
	currentMode: ShowNeiMode.Production,
	activeTabIndex: 0,
	search: null,
	currentGrid: null,
	tabs: []
});
