import type { RowAllocator } from '$lib/types/nei/rowAllocator';
import type { GridContents } from '$lib/types/nei/gridContents';

export class NeiGridRow {
	y: number = 0;
	height: number = 1;
	elementWidth: number = 1;
	elements: GridContents[] = [];
	allocator: RowAllocator<any> | null = null;

	Clear(y: number, allocator: RowAllocator<any> | null, elementWidth: number) {
		this.allocator = allocator;
		this.y = y;
		this.height = 1;
		this.elementWidth = elementWidth;
		this.elements.length = 0;
	}

	Add(element: GridContents, height: number) {
		this.elements.push(element);
		if (height > this.height) this.height = height;
	}
}
