import { SearchableObject } from '$lib/models/base/SearchableObject';
import type { SearchQuery } from '$lib/models/search/SearchQuery';
import type { RecipeObject } from '$lib/models/recipe/RecipeObject';
import { RecipeType } from '$lib/models/recipe/RecipeType';
import { GtRecipe } from '$lib/models/recipe/GtRecipe';
import { Item } from '$lib/models/items/Item';
import { OreDict } from '$lib/models/items/OreDict';
import { Fluid } from '$lib/models/items/Fluid';
import type { RecipeIoType } from '$lib/types/enums/RecipeIoType';
import type { IMemMappedObjectPrototype } from '$lib/types/core/MemMappedObject';
import type { RecipeIo } from '$lib/types/recipe/recipe-io';

const RecipeIoTypePrototypes: IMemMappedObjectPrototype<RecipeObject>[] = [
	Item,
	OreDict,
	Fluid,
	Item,
	Fluid
];

export class Recipe extends SearchableObject {
	readonly recipeType: RecipeType = this.GetObject(6, RecipeType);
	get gtRecipe(): GtRecipe {
		return this.GetObject(7, GtRecipe);
	}
	private computedIo: RecipeIo[] | undefined;

	get items(): RecipeIo[] {
		return this.computedIo ?? (this.computedIo = this.ComputeItems());
	}

	private ComputeItems(): RecipeIo[] {
		const slice = this.GetSlice(5);
		const elements = slice.length / 5;
		const result: RecipeIo[] = new Array(elements);
		let index = 0;
		for (let i = 0; i < elements; i++) {
			const type: RecipeIoType = slice[index++];
			const ptr = slice[index++];
			result[i] = {
				type: type,
				goodsPtr: ptr,
				goods: this.repository.GetObject<RecipeObject>(ptr, RecipeIoTypePrototypes[type]),
				slot: slice[index++],
				amount: slice[index++],
				probability: slice[index++] / 100
			};
		}
		return result;
	}

	MatchSearchText(query: SearchQuery): boolean {
		const slice = this.GetSlice(5);
		const count = slice.length / 5;
		for (let i = 0; i < count; i++) {
			const pointer = slice[i * 5 + 1];
			if (!this.repository.ObjectMatchQueryBits(query, pointer)) continue;
			const objType = RecipeIoTypePrototypes[slice[i * 5]];
			const obj = this.repository.GetObject<RecipeObject>(pointer, objType);
			if (obj.MatchSearchText(query)) return true;
		}
		return false;
	}

	static sortByNei(a: Recipe, b: Recipe): number {
		if (!a.gtRecipe && b.gtRecipe) return 1;
		if (a.gtRecipe && !b.gtRecipe) return -1;
		if (!a.gtRecipe && !b.gtRecipe) return 0;

		if (a.gtRecipe.voltageTier < b.gtRecipe.voltageTier) return -1;
		if (a.gtRecipe.voltageTier > b.gtRecipe.voltageTier) return 1;

		if (a.gtRecipe.durationTicks < b.gtRecipe.durationTicks) return -1;
		if (a.gtRecipe.durationTicks > b.gtRecipe.durationTicks) return 1;

		return 0;
	}
}
