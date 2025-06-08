import type { ModelObject } from '$lib/models/base/ModelObject';

export abstract class ModelObjectVisitor {
	abstract VisitData(parent: ModelObject, key: string, data: any): void;
	abstract VisitObject(parent: ModelObject, key: string, obj: ModelObject): void;
	VisitArray(parent: ModelObject, key: string, array: ModelObject[]): void {
		for (const obj of array) {
			this.VisitObject(parent, key, obj);
		}
	}
}
