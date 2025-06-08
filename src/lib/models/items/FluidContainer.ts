import { MemMappedObject } from '$lib/models/base/MemMappedObject';
import { Item } from '$lib/models/items/Item';
import { Fluid } from '$lib/models/items/Fluid';

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
