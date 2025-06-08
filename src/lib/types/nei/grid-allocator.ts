import type { GridContents } from '$lib/types/nei/grid-contents';

export interface GridAllocator<T extends GridContents> {
	Add(element: T): void;
}
