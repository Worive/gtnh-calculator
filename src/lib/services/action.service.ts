import { IconBox } from '$lib/legacy/itemIcon';
import type { ModelObject } from '$lib/core/data/models/ModelObject';
import { RecipeGroupModel } from '$lib/core/data/models/RecipeGroupModel';
import { ShowNeiMode } from '$lib/types/enums/ShowNeiMode';
import type { Recipe } from '$lib/core/data/models/Recipe';
import type { ShowNeiCallback } from '$lib/types/show-nei-callback';
import { RecipeList } from '$lib/core/data/models/RecipeList';
import { ShowNei } from '$lib/legacy/nei';

export class ActionService {
	static itemIconClick(event: MouseEvent, obj: ModelObject): void {
		if (
			(event.type === 'click' || event.type === 'contextmenu') &&
			event.target instanceof IconBox &&
			obj instanceof RecipeGroupModel
		) {
			const goods = event.target.obj;
			const mode = event.type === 'click' ? ShowNeiMode.Production : ShowNeiMode.Consumption;

			if (event.type === 'contextmenu') event.preventDefault();

			const callback: ShowNeiCallback = {
				onSelectRecipe: (recipe: Recipe) => {
					RecipeList.current.addRecipe(recipe, obj);
				}
			};

			ShowNei(goods, mode, callback);
		}
	}
}
