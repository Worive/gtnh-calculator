import type { RecipeModel } from '$lib/core/data/models/RecipeModel';
import type { RecipeObject } from '$lib/core/data/models/RecipeObject';

export class LinkCollection {
	output: { [key: string]: { [key: string]: number } } = {};
	input: { [key: string]: { [key: string]: number } } = {};
	inputOreDict: { [key: string]: { [key: string]: number } } = {};
	inputOreDictRecipe: { [key: string]: RecipeModel[] } = {};

	AddInput(goods: RecipeObject, amount: number, linkVar: string): void {
		if (amount === 0) return;
		let input = (this.input[goods.id] ||= {});
		input[linkVar] = (input[linkVar] || 0) + amount;
	}

	AddOutput(goods: RecipeObject, amount: number, linkVar: string): void {
		let output = (this.output[goods.id] ||= {});
		output[linkVar] = (output[linkVar] || 0) - amount;
	}

	AddInputOreDict(
		oreDict: RecipeObject,
		amount: number,
		linkVar: string,
		recipe: RecipeModel
	): void {
		if (amount === 0) return;
		let inputOreDict = (this.inputOreDict[oreDict.id] ||= {});
		inputOreDict[linkVar] = (inputOreDict[linkVar] || 0) + amount;
		let inputOreDictRecipe = (this.inputOreDictRecipe[oreDict.id] ||= []);
		inputOreDictRecipe.push(recipe);
	}

	Merge(other: LinkCollection): void {
		for (const key in other.output) {
			this.output[key] = { ...this.output[key], ...other.output[key] };
		}
		for (const key in other.input) {
			this.input[key] = { ...this.input[key], ...other.input[key] };
		}
		for (const key in other.inputOreDict) {
			this.inputOreDict[key] = { ...this.inputOreDict[key], ...other.inputOreDict[key] };
		}
		for (const key in other.inputOreDictRecipe) {
			this.inputOreDictRecipe[key] = [
				...(this.inputOreDictRecipe[key] || []),
				...other.inputOreDictRecipe[key]
			];
		}
	}
}
