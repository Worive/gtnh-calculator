import { Recipe } from "../data/repository.js";

export class RecipeBox extends HTMLElement
{
    recipe:Recipe | null = null;

    SetRecipe(recipe: Recipe | null)
    {
        this.recipe = recipe;
    }

    constructor()
    {
        super();
    }
}

customElements.define("recipe-box", RecipeBox);
console.log("Registered custom element: recipe-box");