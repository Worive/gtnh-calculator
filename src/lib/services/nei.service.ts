import { neiStore } from '$lib/stores/nei.store';
import { get } from 'svelte/store';
import { NeiRecipeTypeInfo } from '$lib/core/NeiRecipeTypeInfo';
import { RecipeType } from '$lib/core/data/models/RecipeType';
import { Recipe } from '$lib/core/data/models/Recipe';
import { repositoryStore } from '$lib/stores/repository.store';
import type {RecipeObject} from "$lib/core/data/models/RecipeObject";
import {ShowNeiMode} from "$lib/types/enums/ShowNeiMode";
import type {ShowNeiCallback} from "$lib/types/show-nei-callback";
import {OreDict} from "$lib/core/data/models/OreDict";
import {Fluid} from "$lib/core/data/models/Fluid";
import {Item} from "$lib/core/data/models/Item";
import {Goods} from "$lib/core/data/models/Goods";

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

	static show(goods: RecipeObject | null,
				mode: ShowNeiMode,
				callback: ShowNeiCallback | null = null): void {
		console.debug('ShowNei', goods, mode, callback);

		if (callback != null) {
			neiStore.update((state) => ({
				...state,
				showNeiCallback: callback
			}));

			neiStore.update((state) => ({
				...state,
				history: []
			}));
		} else {
			if (get(neiStore).visible) {
				neiStore.update((state) => {
					return {
						...state,
						history: [
							...state.history,
							{
								goods: state.currentGoods,
								mode: state.currentMode,
								tabIndex: state.activeTabIndex
							}
						]
					};
				});
			}
		}

		neiStore.update((state) => ({
			...state,
			visible: true
		}));

		this.showNeiInternal(goods, mode);
	}

	private static showNeiInternal(goods: RecipeObject | null, mode: ShowNeiMode, tabIndex: number = -1): void {
		neiStore.update((state) => ({
			...state,
			currentMode: mode,
			currentGoods: goods,
		}))

		let recipes: Set<Recipe> = new Set();
		if (goods instanceof OreDict) {
			this.getAllOreDictRecipes(recipes, goods, mode);
		} else if (goods instanceof Fluid) {
			this.getAllFluidRecipes(recipes, goods, mode);
		} else if (goods instanceof Item && goods.container) {
			this.getAllFluidRecipes(recipes, goods.container.fluid, mode);
		} else if (goods instanceof Goods) {
			this.addToSet(recipes, goods, mode);
		}

		// Clear all recipe lists first
		for (const recipeType of get(neiStore).allRecipeTypes) {
			neiStore.update((state) => {
				state.mapRecipeTypeToRecipeList[recipeType.name].length = 0;
				return state;
			});
		}

		// Fill recipe lists
		for (var recipe of recipes) {
			var recipeType = recipe.recipeType;
			var list = get(neiStore).mapRecipeTypeToRecipeList[recipeType.name];
			list.push(recipe);
		}

		neiStore.update((state) => ({
			...state,
			search: null,
		}));

		const newTabIndex = tabIndex === -1 ? (goods === null ? 0 : 1) : tabIndex;

		neiStore.update((state) => ({
			...state,
			activeTabIndex: newTabIndex,
		}))
	}

	private static getAllOreDictRecipes(set: Set<Recipe>, goods: OreDict, mode: ShowNeiMode): void {
		for (var i = 0; i < goods.items.length; i++) {
			this.addToSet(set, goods.items[i], mode);
		}
	}

	private static getAllFluidRecipes(set: Set<Recipe>, goods: Fluid, mode: ShowNeiMode): void {
		this.addToSet(set, goods, mode);
		let containers = goods.containers;

		const repository = get(repositoryStore);

		for (var i = 0; i < containers.length; i++) {
			var container = repository!.GetObject(repository!.items[containers[i]], Item);
			this.addToSet(set, container, mode);
		}
	}

	private static addToSet(set: Set<Recipe>, goods: Goods, mode: ShowNeiMode) {
		let list = mode == ShowNeiMode.Production ? goods.production : goods.consumption;
		for (var i = 0; i < list.length; i++) set.add(get(repositoryStore)!.GetObject(list[i], Recipe));
	}

	static select(goods: Goods): void {
		console.log('ShowNei select (Goods): ', goods);

		const showNeiCallback = get(neiStore).showNeiCallback;

		if (showNeiCallback != null && showNeiCallback.onSelectGoods) {
			showNeiCallback.onSelectGoods(goods);
		}

		this.hide();
	}

	static hide(): void {
		neiStore.update((state) => {
			state.visible = false;
			state.showNeiCallback = null;
			state.currentGoods = null;
			return state;
		});
	}

	static back(): void {
		neiStore.update((state) => {
			const last = state.history[state.history.length - 1];
			const newHistory = state.history.slice(0, state.history.length - 1);

			if (last) {
				this.showNeiInternal(last.goods, last.mode, last.tabIndex);
			}

			return {
				...state,
				history: newHistory
			};
		});
	}
}
