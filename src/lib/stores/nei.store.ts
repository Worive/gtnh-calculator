import { writable } from 'svelte/store';
import type { NeiRecipeMap } from '$lib/legacy/nei';
import type { ShowNeiCallback } from '$lib/types/show-nei-callback';
import type { RecipeType } from '$lib/core/data/models/RecipeType';
import type { NeiHistory } from '$lib/types/nei-history';

type NeiStore = {
	mapRecipeTypeToRecipeList: NeiRecipeMap;
	allRecipeTypes: RecipeType[];
	showNeiCallback: ShowNeiCallback | null;
	history: NeiHistory[];
};

export const neiStore = writable<NeiStore>({
	mapRecipeTypeToRecipeList: {},
	allRecipeTypes: [],
	showNeiCallback: null,
	history: []
});
