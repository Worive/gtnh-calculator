import { neiStore } from '../stores/nei.store';
import { get } from 'svelte/store';
import { NeiRecipeTypeInfo } from '$lib/core/NeiRecipeTypeInfo';
import { RecipeType } from '$lib/core/data/models/RecipeType';
import type { Recipe } from '$lib/core/data/models/Recipe';
import {repositoryStore} from "$lib/stores/repository.store";

export class NeiService {
	static initialize() {
		const repository = get(repositoryStore);

		let allRecipeTypePointers = repository!.recipeTypes;

		for (let i = 0; i < allRecipeTypePointers.length; i++) {
			const recipeType = repository!.GetObject(allRecipeTypePointers[i], RecipeType);

			neiStore.update((state) => {
				state.mapRecipeTypeToRecipeList[recipeType.name] = new NeiRecipeTypeInfo(recipeType);
				state.allRecipeTypes.push(recipeType);
				return state;
			});
		}
	}

	static getSingleRecipeDOM(recipe: Recipe): string {
		const recipeType = recipe.recipeType;

		const builder = get(neiStore).mapRecipeTypeToRecipeList[recipeType.name];

		const width = builder.CalculateWidth();
		const height = builder.CalculateHeight(recipe);

		return builder.BuildRowDom([recipe], width, height, 0);
	}
}
