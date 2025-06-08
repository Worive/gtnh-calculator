import { writable } from 'svelte/store';
import type { ShowCallback } from '$lib/types/nei/show-callback';
import type { RecipeType } from '$lib/models/recipe/RecipeType';
import type { History } from '$lib/types/nei/history';
import type { RecipeMap } from '$lib/types/nei/recipe-map';
import type { RecipeObject } from '$lib/models/recipe/RecipeObject';
import { ShowNeiMode } from '$lib/types/enums/ShowNeiMode';
import type { NeiGrid } from '$lib/models/nei/NeiGrid';
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
