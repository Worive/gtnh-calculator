import { MemMappedObject } from '$lib/core/data/models/MemMappedObject';
import { Item } from '$lib/core/data/models/Item';
import { Fluid } from '$lib/core/data/models/Fluid';

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
