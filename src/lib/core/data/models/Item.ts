import { Goods } from '$lib/core/data/models/Goods';
import { FluidContainer } from '$lib/core/data/models/FluidContainer';

export class Item extends Goods {
	get stackSize(): number {
		return this.GetInt(15);
	}
	get damage(): number {
		return this.GetInt(16);
	}
	get container(): FluidContainer | null {
		return this.GetObject(17, FluidContainer);
	}

	get tooltipDebugInfo(): string {
		var baseInfo = `${this.mod}:${this.internalName} (${this.numericId}:${this.damage})`;
		var nbt = this.nbt;
		if (nbt != null) baseInfo += '\n' + nbt;
		return baseInfo;
	}
}
