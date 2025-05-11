import { SearchQuery } from '$lib/core/data/models/SearchQuery';
import type { NeiRecipeMap } from '$lib/types/nei-recipe-map';
import type { NeiGrid } from '$lib/core/data/models/NeiGrid';

export type NeiFiller = (grid: NeiGrid, search: SearchQuery | null, recipes: NeiRecipeMap) => void;
