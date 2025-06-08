import type { Repository } from '$lib/core/data/Repository';

export interface IMemMappedObjectPrototype<T extends MemMappedObject> {
	new (repository: Repository, offset: number): T;
}

export interface MemMappedObject {
	repository: Repository;
	objectOffset: number;
}
