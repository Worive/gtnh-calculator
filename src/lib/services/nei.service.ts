import { neiStore } from '$lib/stores/nei.store';
import { get } from 'svelte/store';
import { NeiRecipeTypeInfo } from '$lib/core/NeiRecipeTypeInfo';
import { RecipeType } from '$lib/core/data/models/RecipeType';
import { Recipe } from '$lib/core/data/models/Recipe';
import { repositoryStore } from '$lib/stores/repository.store';
import type { RecipeObject } from '$lib/core/data/models/RecipeObject';
import { ShowNeiMode } from '$lib/types/enums/ShowNeiMode';
import type { ShowNeiCallback } from '$lib/types/show-nei-callback';
import { OreDict } from '$lib/core/data/models/OreDict';
import { Fluid } from '$lib/core/data/models/Fluid';
import { Item } from '$lib/core/data/models/Item';
import { Goods } from '$lib/core/data/models/Goods';
import NeiItemsTab from '$lib/components/nei/NeiItemsTab.svelte';
import NeiAllRecipesTab from '$lib/components/nei/NeiAllRecipesTab.svelte';
import type { NeiTab } from '$lib/types/nei-tab';
import type { Repository } from '$lib/core/data/Repository';

export class NeiService {
	static initialize() {
		const repository = get(repositoryStore);

		const allRecipeTypePointers = repository!.recipeTypes;

		for (let i = 0; i < allRecipeTypePointers.length; i++) {
			const recipeType = repository!.GetObject(allRecipeTypePointers[i], RecipeType);

			neiStore.update((state) => {
				state.mapRecipeTypeToRecipeList[recipeType.name] = new NeiRecipeTypeInfo(recipeType);
				state.allRecipeTypes.push(recipeType);
				return state;
			});
		}

		if (repository) {
			neiStore.update((state) => ({
				...state,
				tabs: [this.getAllItemsTab(repository), this.getAllRecipesTab(repository)]
			}));

			this.changeTab(0);
		}
	}

	static changeTab(index: number): void {
		console.debug('Change NEI tab to index:', index);

		if (index < 0 || index >= get(neiStore).tabs.length) {
			console.warn('Invalid NEI tab index:', index);
			return;
		}

		neiStore.update((state) => ({
			...state,
			activeTabIndex: index
		}));
	}

	private static getAllItemsTab(repository: Repository): NeiTab {
		return {
			name: 'All Items',
			iconId: repository.GetObject(repository.service[0], Item).iconId,
			component: NeiItemsTab,
			visible: () => true
		};
	}

	private static getAllRecipesTab(repository: Repository): NeiTab {
		return {
			name: 'All Recipes',
			iconId: repository.GetObject(repository.service[1], Item).iconId,
			component: NeiAllRecipesTab,
			visible: (store) => store.currentGoods !== null
		};
	}

	static show(
		goods: RecipeObject | null,
		mode: ShowNeiMode,
		callback: ShowNeiCallback | null = null
	): void {
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

	private static showNeiInternal(
		goods: RecipeObject | null,
		mode: ShowNeiMode,
		tabIndex: number = -1
	): void {
		neiStore.update((state) => ({
			...state,
			currentMode: mode,
			currentGoods: goods
		}));

		const recipes: Set<Recipe> = new Set();
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
		for (const recipe of recipes) {
			const recipeType = recipe.recipeType;
			const list = get(neiStore).mapRecipeTypeToRecipeList[recipeType.name];
			list.push(recipe);
		}

		neiStore.update((state) => ({
			...state,
			search: null
		}));

		const newTabIndex = tabIndex === -1 ? (goods === null ? 0 : 1) : tabIndex;

		neiStore.update((state) => ({
			...state,
			activeTabIndex: newTabIndex
		}));
	}

	private static getAllOreDictRecipes(set: Set<Recipe>, goods: OreDict, mode: ShowNeiMode): void {
		for (let i = 0; i < goods.items.length; i++) {
			this.addToSet(set, goods.items[i], mode);
		}
	}

	private static getAllFluidRecipes(set: Set<Recipe>, goods: Fluid, mode: ShowNeiMode): void {
		this.addToSet(set, goods, mode);
		const containers = goods.containers;

		const repository = get(repositoryStore);

		for (let i = 0; i < containers.length; i++) {
			const container = repository!.GetObject(repository!.items[containers[i]], Item);
			this.addToSet(set, container, mode);
		}
	}

	private static addToSet(set: Set<Recipe>, goods: Goods, mode: ShowNeiMode) {
		const list = mode == ShowNeiMode.Production ? goods.production : goods.consumption;
		for (let i = 0; i < list.length; i++) set.add(get(repositoryStore)!.GetObject(list[i], Recipe));
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

			return {
				...state,
				history: newHistory,
				currentGoods: last.goods,
				currentMode: last.mode,
				activeTabIndex: last.tabIndex
			};
		});
	}
}
