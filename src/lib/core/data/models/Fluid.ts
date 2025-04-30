import { Goods } from '$lib/core/data/models/Goods';

export class Fluid extends Goods {
	get isGas(): boolean {
		return this.GetInt(15) === 1;
	}
	get containers(): Int32Array {
		return this.GetSlice(16);
	}
	get tooltipDebugInfo(): string {
		return `${this.mod}:${this.internalName} (${this.numericId})`;
	}
}
