import { SearchQuery } from '$lib/core/data/models/SearchQuery';
import type { RecipeMap } from '$lib/types/nei/recipe-map';
import type { NeiGrid } from '$lib/core/data/models/NeiGrid';

export type Filler = (grid: NeiGrid, search: SearchQuery | null, recipes: RecipeMap) => void;
