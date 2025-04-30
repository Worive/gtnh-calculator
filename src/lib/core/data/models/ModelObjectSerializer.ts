import type { ModelObject } from '$lib/core/data/models/ModelObject';
import { ModelObjectVisitor } from '$lib/core/data/models/ModelObjectVisitor';

export class ModelObjectSerializer extends ModelObjectVisitor {
	stack: object[] = [];
	current: { [key: string]: any } = {};

	VisitData(parent: ModelObject, key: string, data: any): void {
		this.current[key] = data;
	}

	VisitObject(parent: ModelObject, key: string, obj: ModelObject): void {
		this.stack.push(this.current);
		this.current = {};
		obj.Visit(this);
		let result = this.current;
		this.current = this.stack.pop()!;
		this.current[key] = result;
	}

	VisitArray(parent: ModelObject, key: string, array: ModelObject[]): void {
		var arr = [];
		this.stack.push(this.current);
		for (const obj of array) {
			this.current = {};
			obj.Visit(this);
			arr.push(this.current);
		}
		this.current = this.stack.pop()!;
		this.current[key] = arr;
	}

	Serialize(obj: ModelObject): any {
		this.current = {};
		obj.Visit(this);
		return this.current;
	}
}
