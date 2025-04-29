import { writable } from 'svelte/store';
import type {NeiRecipeMap} from "$lib/legacy/nei";
import type {RecipeType} from "$lib/legacy/repository";
import type {ShowNeiCallback} from "$lib/types/show-nei-callback";


type NeiStore = {
    mapRecipeTypeToRecipeList: NeiRecipeMap;
    allRecipeTypes: RecipeType[];
    showNeiCallback: ShowNeiCallback | null;
}

export const neiStore = writable<NeiStore>({
    mapRecipeTypeToRecipeList: {},
    allRecipeTypes: [],
    showNeiCallback: null,
});

