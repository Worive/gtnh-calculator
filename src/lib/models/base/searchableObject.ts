import { MemMappedObject } from '$lib/models/base/memMappedObject';
import type { SearchQuery } from '$lib/models/search/searchQuery';

export abstract class SearchableObject extends MemMappedObject {
	id: string = this.GetString(4);
	// Elements 0-3 are reserved for 128-bit index
	abstract MatchSearchText(query: SearchQuery): boolean;
}
