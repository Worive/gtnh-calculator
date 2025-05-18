import { MemMappedObject } from '$lib/core/data/models/MemMappedObject';
import { Item } from '$lib/core/data/models/Item';
import type { Repository } from '$lib/core/data/Repository';

export class RecipeType extends MemMappedObject {
	singleblocks: Item[] = [];
	multiblocks: Item[] = [];
	defaultCrafter: Item;

	constructor(repository: Repository, offset: number) {
		super(repository, offset);
		const singleblocks = this.GetSlice(5);
		const multiblocks = this.GetSlice(3);
		this.singleblocks = new Array(singleblocks.length);
		this.multiblocks = new Array(multiblocks.length);
		this.defaultCrafter = this.GetObject(6, Item);
		for (let i = 0; i < singleblocks.length; i++) {
			this.singleblocks[i] = repository.GetObject(singleblocks[i], Item);
		}
		for (let i = 0; i < multiblocks.length; i++) {
			this.multiblocks[i] = repository.GetObject(multiblocks[i], Item);
		}
	}

	get name(): string {
		return this.GetString(0);
	}
	get category(): string {
		return this.GetString(1);
	}
	get dimensions(): Int32Array {
		return this.GetSlice(2);
	}
	get shapeless(): boolean {
		return this.GetInt(4) === 1;
	}
}
