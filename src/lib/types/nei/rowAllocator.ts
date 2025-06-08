import type { GridContents } from '$lib/types/nei/gridContents';

export interface RowAllocator<T extends GridContents> {
	CalculateWidth(): number;
	CalculateHeight(obj: T): number;
	BuildRowDom(elements: T[], elementWidth: number, elementHeight: number, rowY: number): string;
}
