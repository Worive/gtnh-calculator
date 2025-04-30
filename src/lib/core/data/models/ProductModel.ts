import type { ModelObjectVisitor } from '$lib/core/data/models/ModelObjectVisitor';
import { ModelObject } from '$lib/core/data/models/ModelObject';

export class ProductModel extends ModelObject {
	goodsId: string;
	amount: number = 1;

	Visit(visitor: ModelObjectVisitor): void {
		visitor.VisitData(this, 'goodsId', this.goodsId);
		visitor.VisitData(this, 'amount', this.amount);
	}

	constructor(source: any = undefined) {
		super();
		this.goodsId = '';
		if (source instanceof Object) {
			if (typeof source.goodsId === 'string') this.goodsId = source.goodsId;
			if (typeof source.amount === 'number') this.amount = source.amount;
		}
	}
}
