import { MemMappedObject } from '$lib/models/base/memMappedObject';
import { Item } from '$lib/models/items/item';
import { Fluid } from '$lib/models/items/fluid';

export class FluidContainer extends MemMappedObject {
	get fluid(): Fluid {
		return this.GetObject(0, Fluid);
	}
	get amount(): number {
		return this.GetInt(1);
	}
	get empty(): Item {
		return this.GetObject(2, Item);
	}
}
