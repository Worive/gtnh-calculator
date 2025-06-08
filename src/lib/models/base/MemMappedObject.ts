import type { Repository } from '$lib/core/data/Repository';
import type { IMemMappedObjectPrototype } from '$lib/types/core/MemMappedObject.interface';

export class MemMappedObject {
	repository: Repository;
	objectOffset: number;

	constructor(repository: Repository, offset: number) {
		this.repository = repository;
		this.objectOffset = offset;
	}

	protected GetInt(offset: number) {
		return this.repository.elements[offset + this.objectOffset];
	}

	protected GetString(offset: number) {
		return this.repository.GetString(this.repository.elements[offset + this.objectOffset]);
	}

	protected GetSlice(offset: number) {
		return this.repository.GetSlice(this.repository.elements[offset + this.objectOffset]);
	}

	protected GetObject<T extends MemMappedObject>(
		offset: number,
		prototype: IMemMappedObjectPrototype<T>
	) {
		return this.repository.GetObject<T>(
			this.repository.elements[offset + this.objectOffset],
			prototype
		);
	}
}
