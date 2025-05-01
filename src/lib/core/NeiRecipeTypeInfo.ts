import { RecipeTypeAllocator } from '$lib/core/RecipeTypeAllocator';
import { elementSize } from '$lib/types/constants/nei.consts';
import { get } from 'svelte/store';
import { neiStore } from '$lib/stores/nei.store';
import type { NeiRowAllocator } from '$lib/types/nei-row-allocator.interface';
import type { RecipeType } from '$lib/core/data/models/RecipeType';
import type { Recipe } from '$lib/core/data/models/Recipe';
import type { RecipeInOut } from '$lib/types/models/Recipe';
import { RecipeIoType } from '$lib/types/enums/RecipeIoType';
import { Fluid } from '$lib/core/data/models/Fluid';
import { Goods } from '$lib/core/data/models/Goods';
import { voltageTier } from '$lib/types/constants/voltageTiers.const';
import {formatAmount} from "$lib/utils/Formatting";

export class NeiRecipeTypeInfo extends Array implements NeiRowAllocator<Recipe> {
	type: RecipeType;
	dimensions: Int32Array;
	allocator: RecipeTypeAllocator;
	constructor(type: RecipeType) {
		super();
		this.type = type;
		this.dimensions = type.dimensions;
		this.allocator = new RecipeTypeAllocator();
	}

	CalculateWidth(): number {
		var dims = this.dimensions;
		return Math.max(dims[0], dims[2]) + Math.max(dims[4], dims[6]) + 3;
	}

	CalculateHeight(recipe: Recipe): number {
		var dims = this.dimensions;
		var h = Math.max(dims[1] + dims[3], dims[5] + dims[7], 2) + 1;
		var gtRecipe = recipe.gtRecipe;
		if (gtRecipe != null) {
			h++;
			if (gtRecipe.additionalInfo !== null) h++;
		}
		return h;
	}

	BuildRecipeItemGrid(
		dom: string[],
		items: RecipeInOut[],
		index: number,
		type: RecipeIoType,
		dimensionOffset: number
	): number {
		var dimX = this.dimensions[dimensionOffset];
		if (dimX == 0) return index;
		var dimY = this.dimensions[dimensionOffset + 1];
		var count = dimX * dimY;
		const gridWidth = dimX * 36;
		const gridHeight = dimY * 36;
		dom.push(
			`<div class="icon-grid" style="--grid-pixel-width:${gridWidth}px; --grid-pixel-height:${gridHeight}px">`
		);
		for (; index < items.length; index++) {
			var item = items[index];
			if (item.type > type) break;
			if (item.slot >= count) continue;
			var goods = item.goods;
			const gridX = (item.slot % dimX) * 36 + 2;
			const gridY = Math.floor(item.slot / dimX) * 36 + 2;
			var iconAttrs = `class="item-icon-grid" style="--grid-x:${gridX}px; --grid-y:${gridY}px" data-id="${goods.id}"`;
			var amountText = formatAmount(item.amount);

			var isFluid = goods instanceof Fluid;
			var isGoods = goods instanceof Goods;
			if (isFluid || item.amount != 1) iconAttrs += ` data-amount="${amountText}"`;
			dom.push(`<item-icon ${iconAttrs}>`);
			if (
				item.probability < 1 &&
				(type == RecipeIoType.ItemOutput || type == RecipeIoType.FluidOutput)
			)
				dom.push(`<span class="probability">${Math.round(item.probability * 100)}%</span>`);
			dom.push(`</item-icon>`);
		}
		dom.push(`</div>`);
		return index;
	}

	BuildRecipeIoDom(
		dom: string[],
		items: RecipeInOut[],
		index: number,
		item: RecipeIoType,
		fluid: RecipeIoType,
		dimensionOffset: number
	): number {
		dom.push(`<div class = "nei-recipe-items">`);
		index = this.BuildRecipeItemGrid(dom, items, index, item, dimensionOffset);
		index = this.BuildRecipeItemGrid(dom, items, index, fluid, dimensionOffset + 2);
		dom.push(`</div>`);
		return index;
	}

	BuildRowDom(
		elements: Recipe[],
		elementWidth: number,
		elementHeight: number,
		rowY: number
	): string {
		let dom: string[] = [];

		const showNeiCallback = get(neiStore).showNeiCallback;
		const canSelectRecipe = showNeiCallback?.onSelectRecipe != null;

		for (let i = 0; i < elements.length; i++) {
			let recipe = elements[i];
			let recipeItems = recipe.items;
			dom.push(
				`<div class="nei-recipe-box" style="left:${Math.round(i * elementWidth * elementSize)}px; top:${rowY * elementSize}px; width:${Math.round(elementWidth * elementSize)}px; height:${elementHeight * elementSize}px">`
			);
			dom.push(`<div class="nei-recipe-io">`);
			let index = this.BuildRecipeIoDom(
				dom,
				recipeItems,
				0,
				RecipeIoType.OreDictInput,
				RecipeIoType.FluidInput,
				0
			);
			dom.push(`<div class="arrow-container">`);
			dom.push(`<div class="arrow"></div>`);
			if (canSelectRecipe) {
				dom.push(
					`<button class="select-recipe-btn" data-recipe="${recipe.objectOffset}">+</button>`
				);
			}
			dom.push(`</div>`);
			this.BuildRecipeIoDom(
				dom,
				recipeItems,
				index,
				RecipeIoType.ItemOutput,
				RecipeIoType.FluidOutput,
				4
			);
			dom.push(`</div>`);
			if (recipe.gtRecipe != null) {
				dom.push(
					`<span>${voltageTier[recipe.gtRecipe.voltageTier].name} • ${recipe.gtRecipe.durationSeconds}s`
				);
				if (recipe.gtRecipe.cleanRoom) dom.push(` • Cleanroom`);
				if (recipe.gtRecipe.lowGravity) dom.push(` • Low gravity`);
				if (recipe.gtRecipe.amperage != 1) dom.push(` • ${recipe.gtRecipe.amperage}A`);
				dom.push(
					`</span><span class="text-small">${formatAmount(recipe.gtRecipe.voltage)}v • ${formatAmount(recipe.gtRecipe.voltage * recipe.gtRecipe.amperage * recipe.gtRecipe.durationTicks)}eu</span>`
				);
				if (recipe.gtRecipe.additionalInfo != null) {
					dom.push(`<span class="text-small">`);
					dom.push(recipe.gtRecipe.additionalInfo);
					dom.push(`</span>`);
				}
			}
			dom.push(`</div>`);
		}
		return dom.join('');
	}
}
