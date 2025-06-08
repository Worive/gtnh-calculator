import type { Repository } from '$lib/services/data/repository';

export interface IMemMappedObjectPrototype<T extends MemMappedObject> {
	new (repository: Repository, offset: number): T;
}

export interface MemMappedObject {
	repository: Repository;
	objectOffset: number;
}
