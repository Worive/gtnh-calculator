import type { ModelObject } from '$lib/models/base/ModelObject';

export type ActionHandler = (obj: ModelObject, event: Event, parent: ModelObject) => void;
