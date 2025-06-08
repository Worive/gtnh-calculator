import { MemMappedObject } from '$lib/models/base/MemMappedObject';
import type { SearchQuery } from '$lib/models/search/SearchQuery';

export abstract class SearchableObject extends MemMappedObject {
	id: string = this.GetString(4);
	// Elements 0-3 are reserved for 128-bit index
	abstract MatchSearchText(query: SearchQuery): boolean;
}
