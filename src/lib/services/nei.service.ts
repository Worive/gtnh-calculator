import {neiStore} from "../stores/nei.store";
import {Recipe, RecipeType, Repository} from "$lib/legacy/repository";
import {get} from "svelte/store";
import {NeiRecipeTypeInfo} from "$lib/core/NeiRecipeTypeInfo";

export class NeiService {
    static initialize() {
        const repository = Repository.current;

        let allRecipeTypePointers = repository.recipeTypes;

        for (let i = 0; i < allRecipeTypePointers.length; i++) {
            const recipeType = repository.GetObject(allRecipeTypePointers[i], RecipeType);

            neiStore.update(state => {
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