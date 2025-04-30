import { SearchableObject } from '$lib/core/data/models/SearchableObject';
import type { SearchQuery } from '$lib/core/data/models/SearchQuery';
import type { RecipeObject } from '$lib/core/data/models/RecipeObject';
import { RecipeType } from '$lib/core/data/models/RecipeType';
import { GtRecipe } from '$lib/core/data/models/GtRecipe';
import { Item } from '$lib/core/data/models/Item';
import { OreDict } from '$lib/core/data/models/OreDict';
import { Fluid } from '$lib/core/data/models/Fluid';
import type { RecipeIoType } from '$lib/types/enums/RecipeIoType';
import type { IMemMappedObjectPrototype } from '$lib/types/core/MemMappedObject.interface';
import type { RecipeInOut } from '$lib/types/models/Recipe';

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
	private computedIo: RecipeInOut[] | undefined;

	get items(): RecipeInOut[] {
		return this.computedIo ?? (this.computedIo = this.ComputeItems());
	}

	private ComputeItems(): RecipeInOut[] {
		var slice = this.GetSlice(5);
		var elements = slice.length / 5;
		var result: RecipeInOut[] = new Array(elements);
		var index = 0;
		for (var i = 0; i < elements; i++) {
			var type: RecipeIoType = slice[index++];
			var ptr = slice[index++];
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
		var slice = this.GetSlice(5);
		var count = slice.length / 5;
		for (var i = 0; i < count; i++) {
			var pointer = slice[i * 5 + 1];
			if (!this.repository.ObjectMatchQueryBits(query, pointer)) continue;
			var objType = RecipeIoTypePrototypes[slice[i * 5]];
			var obj = this.repository.GetObject<RecipeObject>(pointer, objType);
			if (obj.MatchSearchText(query)) return true;
		}
		return false;
	}
}
