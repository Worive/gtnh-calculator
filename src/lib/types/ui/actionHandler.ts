import type { ModelObject } from '$lib/models/base/modelObject';

export type ActionHandler = (obj: ModelObject, event: Event, parent: ModelObject) => void;
