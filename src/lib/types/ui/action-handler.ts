import type { ModelObject } from '$lib/core/data/models/ModelObject';

export type ActionHandler = (obj: ModelObject, event: Event, parent: ModelObject) => void;
