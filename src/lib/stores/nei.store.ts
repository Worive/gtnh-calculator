import { writable } from 'svelte/store';
import type { ShowNeiCallback } from '$lib/types/show-nei-callback';
import type { RecipeType } from '$lib/core/data/models/RecipeType';
import type { NeiHistory } from '$lib/types/nei-history';
import type { NeiRecipeMap } from '$lib/types/nei-recipe-map';
import type { RecipeObject } from '$lib/core/data/models/RecipeObject';
import { ShowNeiMode } from '$lib/types/enums/ShowNeiMode';
import type { NeiGrid } from '$lib/core/data/models/NeiGrid';
import type { NeiTab } from '$lib/types/nei-tab';

export type NeiStore = {
	mapRecipeTypeToRecipeList: NeiRecipeMap;
	allRecipeTypes: RecipeType[];
	showNeiCallback: ShowNeiCallback | null;
	history: NeiHistory[];
	visible: boolean;
	currentGoods: RecipeObject | null;
	currentMode: ShowNeiMode;
	activeTabIndex: number;
	search: string | null;
	currentGrid: NeiGrid | null;
	tabs: NeiTab[];
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
