import type { GridContents } from '$lib/types/nei/gridContents';

export interface GridAllocator<T extends GridContents> {
	Add(element: T): void;
}
