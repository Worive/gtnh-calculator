import type { iidScanResult } from '$lib/types/iidScanResult';
import { ModelObjectVisitor } from '$lib/core/data/models/ModelObjectVisitor';
import type { ModelObject } from '$lib/core/data/models/ModelObject';

export class ModelObjectIidScanner extends ModelObjectVisitor {
	iid: number = 0;
	result: ModelObject | null = null;
	resultParent: ModelObject | null = null;

	VisitData(parent: ModelObject, key: string, data: any): void {}
	VisitObject(parent: ModelObject, key: string, obj: ModelObject): void {
		if (this.result !== null) return;
		if (obj.iid === this.iid) {
			this.result = obj;
			this.resultParent = parent;
			return;
		}
		obj.Visit(this);
	}

	Scan(obj: ModelObject, parent: ModelObject, iid: number): iidScanResult {
		if (obj.iid === iid) {
			return { current: obj, parent: parent };
		}
		this.result = null;
		this.iid = iid;
		obj.Visit(this);
		return this.result === null || this.resultParent === null
			? null
			: { current: this.result, parent: this.resultParent };
	}
}
