import type { SearchQuery } from '$lib/core/data/models/SearchQuery';
import { RecipeObject } from '$lib/core/data/models/RecipeObject';

export abstract class Goods extends RecipeObject {
	get name(): string {
		return this.GetString(5);
	}
	get mod(): string {
		return this.GetString(6);
	}
	get internalName(): string {
		return this.GetString(7);
	}
	get numericId(): number {
		return this.GetInt(8);
	}
	get iconId(): number {
		return this.GetInt(9);
	}
	get tooltip(): string | null {
		return this.GetString(10);
	}
	get unlocalizedName(): string {
		return this.GetString(11);
	}
	get nbt(): string | null {
		return this.GetString(12);
	}
	get production(): Int32Array {
		return this.GetSlice(13);
	}
	get consumption(): Int32Array {
		return this.GetSlice(14);
	}

	abstract get tooltipDebugInfo(): string;

	MatchSearchText(query: SearchQuery): boolean {
		if (query.mod !== null && !this.mod.toLowerCase().includes(query.mod)) {
			return false;
		}
		return query.Match(this.name) || query.Match(this.tooltip);
	}
}
