import type { MemMappedObject } from '$lib/core/data/models/MemMappedObject';
import type { SearchableObject } from '$lib/core/data/models/SearchableObject';
import { Item } from '$lib/core/data/models/Item';
import { Fluid } from '$lib/core/data/models/Fluid';
import { Recipe } from '$lib/core/data/models/Recipe';
import type { SearchQuery } from '$lib/core/data/models/SearchQuery';
import { OreDict } from '$lib/core/data/models/OreDict';
import type { IMemMappedObjectPrototype } from '$lib/types/core/MemMappedObject.interface';
import { repositoryStore } from '$lib/stores/repository.store';

const charCodeItem = 'i'.charCodeAt(0);
const charCodeFluid = 'f'.charCodeAt(0);
const charCodeRecipe = 'r'.charCodeAt(0);

const DATA_VERSION = 3;

export class Repository {
	elements: Int32Array;
	bytes: Uint8Array;
	textReader: TextDecoder;
	objects: { [index: number]: MemMappedObject | Int32Array | string } = {};
	items: Int32Array;
	fluids: Int32Array;
	recipeTypes: Int32Array;
	recipes: Int32Array;
	oreDicts: Int32Array;
	service: Int32Array;

	objectPositionMap: { [id: string]: number } = {};

	constructor(data: ArrayBuffer) {
		this.bytes = new Uint8Array(data);
		this.elements = new Int32Array(data);
		this.textReader = new TextDecoder();
		let dataVersion = this.elements[0];
		if (dataVersion != DATA_VERSION)
			throw new Error(
				`Unsupported data version: ${dataVersion} (Required: ${DATA_VERSION}). This may be caused by the browser cache. Please try reloading using F5 or Ctrl+F5.`
			);

		this.items = this.GetSlice(this.elements[1]);
		this.fluids = this.GetSlice(this.elements[2]);
		this.oreDicts = this.GetSlice(this.elements[3]);
		this.recipeTypes = this.GetSlice(this.elements[4]);
		this.recipes = this.GetSlice(this.elements[5]);
		this.service = this.GetSlice(this.elements[6]);
		this.FillObjectPositionMap(this.items);
		this.FillObjectPositionMap(this.fluids);
		this.FillObjectPositionMap(this.oreDicts);
		this.FillObjectPositionMap(this.recipes);
	}

	private FillObjectPositionMap(elements: Int32Array) {
		for (var i = 0; i < elements.length; i++) {
			var id = this.GetString(this.elements[elements[i] + 4]);
			this.objectPositionMap[id] = elements[i];
		}
	}

	public GetById<T extends SearchableObject>(id: string): T | null {
		if (!id) return null;
		var idCode = id.charCodeAt(0);
		var type: IMemMappedObjectPrototype<SearchableObject> =
			idCode == charCodeItem
				? Item
				: idCode == charCodeFluid
					? Fluid
					: idCode == charCodeRecipe
						? Recipe
						: OreDict;
		if (!this.objectPositionMap[id]) return null;
		return this.GetObject(this.objectPositionMap[id], type) as T;
	}

	public ObjectMatchQueryBits(query: SearchQuery, pointer: number): boolean {
		var arr = query.indexBits;
		for (var i = 0; i < 4; i++) {
			if ((this.elements[pointer + i] & arr[i]) !== arr[i]) return false;
		}
		return true;
	}

	GetString(pointer: number): string {
		if (pointer == -1) return null as unknown as string;
		return (this.objects[pointer] as string) ?? (this.objects[pointer] = this.ReadString(pointer));
	}

	private ReadString(pointer: number): string {
		var length = this.elements[pointer];
		var begin = pointer * 4 + 4;
		return this.textReader.decode(this.bytes.subarray(begin, begin + length));
	}

	GetSlice(pointer: number): Int32Array {
		return (
			(this.objects[pointer] as Int32Array) ?? (this.objects[pointer] = this.ReadSlice(pointer))
		);
	}

	private ReadSlice(pointer: number): Int32Array {
		var length = this.elements[pointer];
		return this.elements.subarray(pointer + 1, pointer + 1 + length);
	}

	GetObject<T extends MemMappedObject>(
		pointer: number,
		prototype: IMemMappedObjectPrototype<T>
	): T {
		if (pointer === -1) return null as unknown as T;
		return (
			(this.objects[pointer] as T) ??
			(this.objects[pointer] = this.ReadObject<T>(pointer, prototype))
		);
	}

	private ReadObject<T extends MemMappedObject>(
		pointer: number,
		prototype: IMemMappedObjectPrototype<T>
	): T {
		return new prototype(this, pointer);
	}

	GetObjectIfMatchingSearch<T extends SearchableObject>(
		query: SearchQuery | null,
		pointer: number,
		prototype: IMemMappedObjectPrototype<T>
	): T | null {
		if (query === null) return this.GetObject(pointer, prototype);
		if (!this.ObjectMatchQueryBits(query, pointer)) return null;
		var inst = this.GetObject(pointer, prototype);
		if (query.original.length === 1) return inst;
		return inst.MatchSearchText(query) ? inst : null;
	}

	IsObjectMatchingSearch(obj: SearchableObject, query: SearchQuery | null): boolean {
		if (query === null) return true;
		if (!this.ObjectMatchQueryBits(query, obj.objectOffset)) return false;
		if (query.original.length === 1) return true;
		return obj.MatchSearchText(query);
	}

	static load(data: ArrayBuffer): Repository {
		const repository = new Repository(data);
		repositoryStore.set(repository);
		return repository;
	}
}
