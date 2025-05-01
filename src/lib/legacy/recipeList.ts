import { LinkAlgorithm } from '$lib/types/enums/LinkAlgorithm';
import type { ModelObject } from '$lib/core/data/models/ModelObject';
import { RecipeList } from '$lib/core/data/models/RecipeList';

export type ActionHandler = (obj: ModelObject, event: Event, parent: ModelObject) => void;

new RecipeList();
