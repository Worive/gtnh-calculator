import type { ModelObjectVisitor } from '$lib/models/base/modelObjectVisitor';

let nextIid = 0;

export abstract class ModelObject {
	iid: number;
	abstract Visit(visitor: ModelObjectVisitor): void;

	constructor() {
		this.iid = nextIid++;
	}
}
