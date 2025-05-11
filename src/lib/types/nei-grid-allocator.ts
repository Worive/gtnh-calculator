import type { NeiGridContents } from '$lib/types/nei-grid-contents';

export interface NeiGridAllocator<T extends NeiGridContents> {
	Add(element: T): void;
}
