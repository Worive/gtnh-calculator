import { TooltipService } from '$lib/services/tooltip.service';
import { get } from 'svelte/store';
import { neiStore } from '$lib/stores/nei.store';
import type { NeiRecipeTypeInfo } from '$lib/core/NeiRecipeTypeInfo';
import type { NeiRowAllocator } from '$lib/types/nei-row-allocator.interface';
import type { ShowNeiCallback } from '$lib/types/show-nei-callback';
import type { RecipeObject } from '$lib/core/data/models/RecipeObject';
import { Goods } from '$lib/core/data/models/Goods';
import { Fluid } from '$lib/core/data/models/Fluid';
import { Item } from '$lib/core/data/models/Item';
import type { IMemMappedObjectPrototype } from '$lib/types/core/MemMappedObject.interface';
import type { RecipeType } from '$lib/core/data/models/RecipeType';
import { Recipe } from '$lib/core/data/models/Recipe';
import { OreDict } from '$lib/core/data/models/OreDict';
import { SearchQuery } from '$lib/core/data/models/SearchQuery';
import { ShowNeiMode } from '$lib/types/enums/ShowNeiMode';
import { repositoryStore } from '$lib/stores/repository.store';

const repository = get(repositoryStore);
const nei = document.getElementById('nei')!;
const neiScrollBox = nei.querySelector('#nei-scroll') as HTMLElement;
const neiContent = nei.querySelector('#nei-content') as HTMLElement;
const searchBox = nei.querySelector('#nei-search') as HTMLInputElement;
const neiTabs = nei.querySelector('#nei-tabs') as HTMLElement;
const neiBack = nei.querySelector('#nei-back') as HTMLButtonElement;
const neiClose = nei.querySelector('#nei-close') as HTMLButtonElement;
const elementSize = 36;

let currentGoods: RecipeObject | null = null;

document.addEventListener('keydown', (event) => {
	if (nei.classList.contains('hidden')) return;
	// Handle Escape key
	if (event.key === 'Escape') {
		if (searchBox.value == '') {
			HideNei();
		} else {
			searchBox.value = '';
			SearchChanged();
		}
		return;
	}

	if (event.key === 'Backspace' && document.activeElement !== searchBox) {
		Back();
		return;
	}

	// Only handle printable characters
	if (
		event.key.length === 1 &&
		!event.ctrlKey &&
		!event.metaKey &&
		!event.altKey &&
		searchBox.value == ''
	) {
		if (document.activeElement !== searchBox) {
			searchBox.focus();
		}
	}
});

searchBox.addEventListener('input', SearchChanged);
neiScrollBox.addEventListener('scroll', UpdateVisibleItems);
neiBack.addEventListener('click', Back);
neiClose.addEventListener('click', HideNei);

var scrollbarWidth: number | undefined;

function GetScrollbarWidth() {
	if (scrollbarWidth === undefined) {
		// Create the measurement node
		var scrollDiv = document.createElement('div');
		scrollDiv.className = 'scrollbar-measure';
		document.body.appendChild(scrollDiv);

		// Get the scrollbar width
		scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;

		// Delete the DIV
		document.body.removeChild(scrollDiv);
		console.log('Scrollbar width: ' + scrollbarWidth);
	}
	return scrollbarWidth;
}

let unitWidth = 0,
	unitHeight = 0;
let scrollWidth = GetScrollbarWidth();
window.addEventListener('resize', Resize);

type NeiFiller = (grid: NeiGrid, search: SearchQuery | null, recipes: NeiRecipeMap) => void;

class ItemAllocator implements NeiRowAllocator<Goods> {
	CalculateWidth(): number {
		return 1;
	}
	CalculateHeight(obj: Goods): number {
		return 1;
	}
	BuildRowDom(
		elements: Goods[],
		elementWidth: number,
		elementHeight: number,
		rowY: number
	): string {
		var dom: string[] = [];
		const showNeiCallback = get(neiStore).showNeiCallback;
		const isSelectingGoods = showNeiCallback?.onSelectGoods != null;
		const selectGoodsAction = isSelectingGoods ? ' data-action="select"' : '';
		const gridWidth = elements.length * 36;
		dom.push(
			`<div class="nei-items-row icon-grid" style="--grid-pixel-width:${gridWidth}px; --grid-pixel-height:36px; top:${elementSize * rowY}px">`
		);
		for (var i = 0; i < elements.length; i++) {
			var elem = elements[i];
			const gridX = (i % elements.length) * 36 + 2;
			const gridY = Math.floor(i / elements.length) * 36 + 2;
			dom.push(
				`<item-icon class="item-icon-grid" style="--grid-x:${gridX}px; --grid-y:${gridY}px" data-id="${elem.id}"${selectGoodsAction}></item-icon>`
			);
		}
		dom.push(`</div>`);
		return dom.join('');
	}
}

let itemAllocator = new ItemAllocator();
var FillNeiAllItems: NeiFiller = function (grid: NeiGrid, search: SearchQuery | null) {
	var allocator = grid.BeginAllocation(itemAllocator);

	const currentRepository = get(repositoryStore);

	FillNeiItemsWith(allocator, search, currentRepository!.fluids, Fluid);
	FillNeiItemsWith(allocator, search, currentRepository!.items, Item);
};

function FillNeiItemsWith<T extends Goods>(
	grid: NeiGridAllocator<Goods>,
	search: SearchQuery | null,
	arr: Int32Array,
	proto: IMemMappedObjectPrototype<T>
): void {
	var len = arr.length;
	for (var i = 0; i < len; i++) {
		var element = repository!.GetObjectIfMatchingSearch(search, arr[i], proto);
		if (element !== null) grid.Add(element);
	}
}

var FillNeiAllRecipes: NeiFiller = function (
	grid: NeiGrid,
	search: SearchQuery | null,
	recipes: NeiRecipeMap
) {
	for (const recipeType of get(neiStore).allRecipeTypes) {
		var list = recipes[recipeType.name];
		if (list.length > 0) {
			{
				let allocator = grid.BeginAllocation(list.allocator);
				allocator.Add(recipeType);
			}

			{
				let allocator = grid.BeginAllocation(list);
				for (let i = 0; i < list.length; i++) {
					if (search == null || repository!.IsObjectMatchingSearch(list[i], search))
						allocator.Add(list[i]);
				}
			}
		}
	}
};

function FillNeiSpecificRecipes(recipeType: RecipeType): NeiFiller {
	return function (grid: NeiGrid, search: SearchQuery | null, recipes: NeiRecipeMap) {
		var list = recipes[recipeType.name];
		let allocator = grid.BeginAllocation(list);
		for (let i = 0; i < list.length; i++)
			if (search == null || repository!.IsObjectMatchingSearch(list[i], search))
				allocator.Add(list[i]);
	};
}

function SearchChanged() {
	search = searchBox.value === '' ? null : new SearchQuery(searchBox.value);
	if (search !== null && search.words.length === 0 && search.mod === null) search = null;
	RefreshNeiContents();
}

export type NeiRecipeMap = { [type: string]: NeiRecipeTypeInfo };

let filler: NeiFiller = FillNeiAllItems;
let search: SearchQuery | null = null;

let currentMode: ShowNeiMode = ShowNeiMode.Production;

export enum ShowNeiContext {
	None,
	Click,
	SelectRecipe,
	SelectGoods
}

export function HideNei() {
	nei.classList.add('hidden');
	neiStore.update((state) => {
		state.showNeiCallback = null;
		return state;
	});
	currentGoods = null;
}

export function NeiSelect(goods: Goods) {
	console.log('ShowNei select (Goods): ', goods);

	const showNeiCallback = get(neiStore).showNeiCallback;

	if (showNeiCallback != null && showNeiCallback.onSelectGoods) {
		showNeiCallback.onSelectGoods(goods);
	}
	HideNei();
}

function AddToSet(set: Set<Recipe>, goods: Goods, mode: ShowNeiMode) {
	let list = mode == ShowNeiMode.Production ? goods.production : goods.consumption;
	for (var i = 0; i < list.length; i++) set.add(repository!.GetObject(list[i], Recipe));
}

function GetAllOreDictRecipes(set: Set<Recipe>, goods: OreDict, mode: ShowNeiMode): void {
	for (var i = 0; i < goods.items.length; i++) {
		AddToSet(set, goods.items[i], mode);
	}
}

function GetAllFluidRecipes(set: Set<Recipe>, goods: Fluid, mode: ShowNeiMode): void {
	AddToSet(set, goods, mode);
	let containers = goods.containers;
	for (var i = 0; i < containers.length; i++) {
		var container = repository!.GetObject(repository!.items[containers[i]], Item);
		AddToSet(set, container, mode);
	}
}

function Back() {
	neiStore.update((state) => {
		const last = state.history[state.history.length - 1];
		const newHistory = state.history.slice(0, state.history.length - 1);

		if (last) {
			ShowNeiInternal(last.goods, last.mode, last.tabIndex);
		}

		return {
			...state,
			history: newHistory
		};
	});
}

export function ShowNei(
	goods: RecipeObject | null,
	mode: ShowNeiMode,
	callback: ShowNeiCallback | null = null
) {
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
		if (!nei.classList.contains('hidden')) {
			neiStore.update((state) => {
				return {
					...state,
					history: [
						...state.history,
						{
							goods: currentGoods,
							mode: currentMode,
							tabIndex: activeTabIndex
						}
					]
				};
			});
		}
	}
	nei.classList.remove('hidden');
	ShowNeiInternal(goods, mode);
}

function ShowNeiInternal(goods: RecipeObject | null, mode: ShowNeiMode, tabIndex: number = -1) {
	currentGoods = goods;
	currentMode = mode;
	let recipes: Set<Recipe> = new Set();
	if (goods instanceof OreDict) {
		GetAllOreDictRecipes(recipes, goods, mode);
	} else if (goods instanceof Fluid) {
		GetAllFluidRecipes(recipes, goods, mode);
	} else if (goods instanceof Item && goods.container) {
		GetAllFluidRecipes(recipes, goods.container.fluid, mode);
	} else if (goods instanceof Goods) {
		AddToSet(recipes, goods, mode);
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

	search = null;
	searchBox.value = '';

	// Update tab visibility
	updateTabVisibility();

	const neiHistoryLength = get(neiStore).history.length;

	neiBack.style.display = neiHistoryLength > 0 ? '' : 'none';
	const newTabIndex = tabIndex === -1 ? (goods === null ? 0 : 1) : tabIndex;
	switchTab(newTabIndex);

	Resize();
}

type NeiGridContents = Recipe | Goods | RecipeType;

class NeiGridRow {
	y: number = 0;
	height: number = 1;
	elementWidth: number = 1;
	elements: NeiGridContents[] = [];
	allocator: NeiRowAllocator<any> | null = null;

	Clear(y: number, allocator: NeiRowAllocator<any> | null, elementWidth: number) {
		this.allocator = allocator;
		this.y = y;
		this.height = 1;
		this.elementWidth = elementWidth;
		this.elements.length = 0;
	}

	Add(element: NeiGridContents, height: number) {
		this.elements.push(element);
		if (height > this.height) this.height = height;
	}
}

interface NeiGridAllocator<T extends NeiGridContents> {
	Add(element: T): void;
}

class NeiGrid implements NeiGridAllocator<any> {
	rows: NeiGridRow[] = [];
	rowCount: number = 0;
	width: number = 1;
	height: number = 0;
	allocator: NeiRowAllocator<NeiGridContents> | null = null;
	currentRow: NeiGridRow | null = null;
	elementWidth: number = 1;
	elementsPerRow: number = 1;

	Clear(width: number) {
		this.rowCount = 0;
		this.width = width;
		this.height = 0;
		this.currentRow = null;
		this.allocator = null;
		this.elementWidth = 1;
		this.elementsPerRow = 1;
	}

	BeginAllocation<T extends NeiGridContents>(allocator: NeiRowAllocator<T>): NeiGridAllocator<T> {
		this.FinishRow();
		this.allocator = allocator;
		this.elementWidth = allocator.CalculateWidth();
		if (this.elementWidth == -1) this.elementWidth = this.width;
		this.elementsPerRow = Math.max(1, Math.trunc(this.width / this.elementWidth));
		//this.elementWidth = this.width / this.elementsPerRow;
		return this;
	}

	FinishRow() {
		if (this.currentRow === null) return;
		this.height = this.currentRow.y + this.currentRow.height;
		this.currentRow = null;
	}

	private NextRow(): NeiGridRow {
		this.FinishRow();
		var row = this.rows[this.rowCount];
		if (row === undefined) this.rows[this.rowCount] = row = new NeiGridRow();
		row.Clear(this.height, this.allocator, this.elementWidth);
		this.currentRow = row;
		this.rowCount++;
		return row;
	}

	Add<T extends NeiGridContents>(element: T) {
		var row = this.currentRow;
		if (row === null || row.elements.length >= this.elementsPerRow) row = this.NextRow();
		var height = this.allocator?.CalculateHeight(element) ?? 1;
		if (row.height < height) row.height = height;
		row.elements.push(element);
	}
}

function Resize() {
	var newUnitWidth = Math.round((window.innerWidth - 30 - scrollWidth) / elementSize);
	var newUnitHeight = Math.round((window.innerHeight - 120) / elementSize);
	var widthRemainder = window.innerWidth - newUnitWidth;
	if (newUnitWidth !== unitWidth || newUnitHeight !== unitHeight) {
		unitWidth = newUnitWidth;
		unitHeight = newUnitHeight;
		var windowWidth = unitWidth * elementSize + scrollWidth;
		var windowHeight = unitHeight * elementSize;
		if ((window.innerWidth - windowWidth) % 2 == 1) windowWidth++;
		if ((window.innerWidth - windowHeight) % 2 == 1) windowHeight++;
		neiScrollBox.style.width = `${windowWidth}px`;
		neiScrollBox.style.height = `${windowHeight}px`;
	}
	RefreshNeiContents();
}

let grid = new NeiGrid();
let maxVisibleRow = 0;
function RefreshNeiContents() {
	grid.Clear(unitWidth);
	filler(grid, search, get(neiStore).mapRecipeTypeToRecipeList);
	grid.FinishRow();
	neiContent.style.minHeight = `${grid.height * elementSize}px`;
	maxVisibleRow = 0;
	neiContent.innerHTML = '';

	UpdateVisibleItems();
}

function UpdateVisibleItems() {
	var top = Math.floor(neiScrollBox.scrollTop / elementSize);
	var bottom = top + unitHeight + 1;
	for (var i = maxVisibleRow; i < grid.rowCount; i++) {
		var row = grid.rows[i];
		if (row.y >= bottom) return;
		FillDomWithGridRow(row);
		maxVisibleRow = i + 1;
	}
}

function FillDomWithGridRow(row: NeiGridRow) {
	var allocator = row.allocator;
	if (allocator == null) return;
	var dom = allocator.BuildRowDom(row.elements, row.elementWidth, row.height, row.y);
	neiContent.insertAdjacentHTML('beforeend', dom);
}

// Tab management
interface NeiTab {
	name: string;
	filler: NeiFiller;
	iconId: number;
	isVisible(): boolean;
}

const tabs: NeiTab[] = [
	{
		name: 'All Items',
		filler: FillNeiAllItems,
		iconId: repository!.GetObject(repository!.service[0], Item).iconId,
		isVisible: () => true // Always visible
	},
	{
		name: 'All Recipes',
		filler: FillNeiAllRecipes,
		iconId: repository!.GetObject(repository!.service[1], Item).iconId,
		isVisible: () => currentGoods !== null // Visible only when viewing recipes
	}
];

// Add tabs for each recipe type
get(neiStore).allRecipeTypes.forEach((recipeType) => {
	tabs.push({
		name: recipeType.name,
		filler: FillNeiSpecificRecipes(recipeType),
		iconId: recipeType.defaultCrafter.iconId,
		isVisible: () => get(neiStore).mapRecipeTypeToRecipeList[recipeType.name].length > 0
	});
});

let activeTabIndex = 0;

function createTabs() {
	neiTabs.innerHTML = '';
	tabs.forEach((tab, index) => {
		const tabElement = document.createElement('div');
		tabElement.className = 'panel-tab';
		const iconId = tab.iconId;
		const ix = iconId % 256;
		const iy = Math.floor(iconId / 256);
		tabElement.innerHTML = `<icon class="icon" style="--pos-x:${ix * -32}px; --pos-y:${iy * -32}px"></icon>`;
		tabElement.addEventListener('click', () => switchTab(index));
		tabElement.addEventListener('mouseenter', () =>
			TooltipService.show(tabElement, { header: tab.name })
		);
		neiTabs.appendChild(tabElement);
	});
	// Set initial active tab
	neiTabs.children[0]?.classList.add('active');
}

function updateTabVisibility() {
	tabs.forEach((tab, index) => {
		const tabElement = neiTabs.children[index] as HTMLElement;
		if (tabElement) {
			tabElement.style.display = tab.isVisible() ? '' : 'none';
		}
	});
}

function switchTab(index: number) {
	if (index === activeTabIndex) return;

	// Update active state
	neiTabs.children[activeTabIndex]?.classList.remove('active');
	neiTabs.children[index]?.classList.add('active');
	activeTabIndex = index;

	// Update filler and refresh content
	filler = tabs[index].filler;
	RefreshNeiContents();
}

// Initialize tabs
createTabs();

// Add global click handler for recipe selection
neiContent.addEventListener('click', (event) => {
	const target = event.target as HTMLElement;
	const selectButton = target.closest('.select-recipe-btn');
	const showNeiCallback = get(neiStore).showNeiCallback;

	if (selectButton && showNeiCallback?.onSelectRecipe) {
		const recipeOffset = parseInt(selectButton.getAttribute('data-recipe') || '0');
		const recipe = repository!.GetObject(recipeOffset, Recipe);
		console.log('ShowNei result (Recipe): ', recipe.id, recipe);
		showNeiCallback.onSelectRecipe(recipe);
		HideNei();
	}
});
