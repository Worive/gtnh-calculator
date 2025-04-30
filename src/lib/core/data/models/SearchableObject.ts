import { MemMappedObject } from '$lib/core/data/models/MemMappedObject';
import type { SearchQuery } from '$lib/core/data/models/SearchQuery';

export abstract class SearchableObject extends MemMappedObject {
	id: string = this.GetString(4);
	// Elements 0-3 are reserved for 128-bit index
	abstract MatchSearchText(query: SearchQuery): boolean;
}
