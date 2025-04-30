import { MemMappedObject } from '$lib/core/data/models/MemMappedObject';

export class GtRecipe extends MemMappedObject {
	get voltage(): number {
		return this.GetInt(0);
	}
	get durationTicks(): number {
		return this.GetInt(1);
	}
	get durationSeconds(): number {
		return this.GetInt(1) / 20;
	}
	get durationMinutes(): number {
		return this.GetInt(1) / (20 * 60);
	}
	get amperage(): number {
		return this.GetInt(2);
	}
	get voltageTier(): number {
		return this.GetInt(3);
	}
	get cleanRoom(): boolean {
		return (this.GetInt(4) & 1) === 1;
	}
	get lowGravity(): boolean {
		return (this.GetInt(4) & 2) === 2;
	}
	get additionalInfo(): string {
		return this.GetString(5);
	}
}
