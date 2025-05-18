import type { NeiRowAllocator } from '$lib/types/nei-row-allocator.interface';
import { Goods } from '$lib/core/data/models/Goods';
import { get } from 'svelte/store';
import { neiStore } from '$lib/stores/nei.store';
import { elementSize } from '$lib/types/constants/nei.consts';

export class ItemAllocator implements NeiRowAllocator<Goods> {
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
		const dom: string[] = [];
		const showNeiCallback = get(neiStore).showNeiCallback;
		const isSelectingGoods = showNeiCallback?.onSelectGoods != null;
		const selectGoodsAction = isSelectingGoods ? ' data-action="select"' : '';
		const gridWidth = elements.length * 36;
		dom.push(
			`<div class="nei-items-row icon-grid" style="--grid-pixel-width:${gridWidth}px; --grid-pixel-height:36px; top:${elementSize * rowY}px">`
		);
		for (let i = 0; i < elements.length; i++) {
			const elem = elements[i];
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
