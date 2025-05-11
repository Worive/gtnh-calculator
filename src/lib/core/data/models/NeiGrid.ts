import type { NeiRowAllocator } from '$lib/types/nei-row-allocator.interface';
import type { NeiGridAllocator } from '$lib/types/nei-grid-allocator';
import type { NeiGridContents } from '$lib/types/nei-grid-contents';
import { NeiGridRow } from '$lib/core/data/models/NeiGridRow';

export class NeiGrid implements NeiGridAllocator<any> {
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
