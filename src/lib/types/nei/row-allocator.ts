import type { GridContents } from '$lib/types/nei/grid-contents';

export interface NeiRowAllocator<T extends GridContents> {
	CalculateWidth(): number;
	CalculateHeight(obj: T): number;
	BuildRowDom(elements: T[], elementWidth: number, elementHeight: number, rowY: number): string;
}
