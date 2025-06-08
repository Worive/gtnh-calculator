import { elementSize } from '$lib/constants/nei';
import type { RowAllocator } from '$lib/types/nei/rowAllocator';
import type { RecipeType } from '$lib/models/recipe/recipeType';

export class RecipeTypeAllocator implements RowAllocator<RecipeType> {
	CalculateWidth(): number {
		return -1;
	}
	CalculateHeight(obj: RecipeType): number {
		return 1;
	}

	BuildRowDom(
		elements: RecipeType[],
		elementWidth: number,
		elementHeight: number,
		rowY: number
	): string {
		const single = elements[0];
		const dom: string[] = [];
		dom.push(
			`<div class="nei-recipe-type" style="top:${rowY * elementSize}px; width:${elementWidth * elementSize}px">`
		);
		for (const block of single.singleblocks) {
			if (block) dom.push(`<item-icon data-id="${block.id}"></item-icon>`);
		}
		for (const block of single.multiblocks) {
			dom.push(`<item-icon data-id="${block.id}"></item-icon>`);
		}
		dom.push(`<span class="nei-recipe-type-name">${single.name}</span>`);
		dom.push(`</div>`);
		return dom.join('');
	}
}
