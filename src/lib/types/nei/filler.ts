import { SearchQuery } from '$lib/models/search/searchQuery';
import type { RecipeMap } from '$lib/types/nei/recipeMap';
import type { NeiGrid } from '$lib/models/nei/neiGrid';

export type Filler = (grid: NeiGrid, search: SearchQuery | null, recipes: RecipeMap) => void;
