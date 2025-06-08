import { neiStore } from '$lib/stores/nei/nei.store';
import { get } from 'svelte/store';
import { NeiRecipeTypeInfo } from '$lib/services/ui/neiRecipeTypeInfo';
import { RecipeType } from '$lib/models/recipe/recipeType';
import { Recipe } from '$lib/models/recipe/recipe';
import { repositoryStore } from '$lib/stores/recipe/repository.store';
import type { RecipeObject } from '$lib/models/recipe/recipeObject';
import { ShowNeiMode } from '$lib/types/enums/showNeiMode';
import type { ShowCallback } from '$lib/types/nei/showCallback';
import { OreDict } from '$lib/models/items/oreDict';
import { Fluid } from '$lib/models/items/fluid';
import { Item } from '$lib/models/items/item';
import { Goods } from '$lib/models/items/goods';
import NeiItemsTab from '$lib/components/nei/tabs/NeiItemsTab.svelte';
import NeiAllRecipesTab from '$lib/components/nei/tabs/NeiAllRecipesTab.svelte';
import type { Tab } from '$lib/types/nei/tab';
import type { Repository } from '$lib/services/data/repository';
import type { GroupedRecipes } from '$lib/types/recipe/groupedRecipes';
import { SearchQuery } from '$lib/models/search/searchQuery';
import NeiRecipesTab from '$lib/components/nei/tabs/NeiRecipesTab.svelte';

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

	static getGroupedRecipes(mode: ShowNeiMode, search: string | null): GroupedRecipes {
		const nei = get(neiStore);
		const repository = get(repositoryStore);

		if (nei.currentGoods instanceof Goods) {
			let goods: Int32Array;

			if (mode === ShowNeiMode.Production) {
				goods = nei.currentGoods.production;
			} else if (mode === ShowNeiMode.Consumption) {
				goods = nei.currentGoods.consumption;
			} else {
				throw new Error('Unknown NEI mode: ' + mode);
			}

			return Array.from(goods)
				.map((pointer) => repository?.GetObject(pointer, Recipe))
				.filter((recipe): recipe is Recipe => recipe !== undefined)
				.filter((recipe) => (search ? recipe.MatchSearchText(new SearchQuery(search)) : true))
				.sort(Recipe.sortByNei)
				.reduce((result: GroupedRecipes, recipe: Recipe) => {
					const key = recipe.recipeType.name;

					if (!result[key]) {
						result[key] = {
							type: recipe.recipeType,
							recipes: []
						};
					}

					result[key].recipes.push(recipe);
					return result;
				}, {} as GroupedRecipes);
		}

		return {};
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

	private static getAllItemsTab(repository: Repository): Tab {
		return {
			name: 'All Items',
			iconId: repository.GetObject(repository.service[0], Item).iconId,
			component: NeiItemsTab,
			visible: () => true
		};
	}

	private static getAllRecipesTab(repository: Repository): Tab {
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
		callback: ShowCallback | null = null
	): void {
		console.debug('ShowNei', goods, mode, callback);

		if (callback != null) {
			neiStore.update((state) => ({
				...state,
				showNeiCallback: callback,
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

		neiStore.update((state) => ({
			...state,
			search: null
		}));

		const newTabIndex = tabIndex === -1 ? (goods === null ? 0 : 1) : tabIndex;

		neiStore.update((state) => ({
			...state,
			activeTabIndex: newTabIndex
		}));

		const nei = get(neiStore);

		this.updateTabsWithRecipes(nei.currentMode, nei.search);
	}

	private static updateTabsWithRecipes(mode: ShowNeiMode, search: string | null): void {
		const repository = get(repositoryStore);

		if (!repository) {
			return;
		}

		const groupedRecipes = this.getGroupedRecipes(mode, search);

		const tabs = [this.getAllItemsTab(repository), this.getAllRecipesTab(repository)];

		for (const recipeGroup of Object.values(groupedRecipes)) {
			const recipeType = recipeGroup.type;

			tabs.push({
				name: recipeType.name,
				iconId: recipeType.defaultCrafter.iconId,
				component: NeiRecipesTab,
				componentProps: {
					recipes: recipeGroup.recipes
				},
				visible: () => true
			});
		}

		neiStore.update((state) => ({
			...state,
			tabs: tabs
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
