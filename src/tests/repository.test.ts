import { setupRepository } from './setup';
import { beforeAll, describe, expect, it } from 'vitest';
import type { Item } from '$lib/models/items/item';
import type { Fluid } from '$lib/models/items/fluid';
import { get } from 'svelte/store';
import { repositoryStore } from '$lib/stores/recipe/repository.store';

describe('Repository', () => {
	beforeAll(async () => {
		await setupRepository();
	});

	it('should load repository data', () => {
		expect(get(repositoryStore)).toBeDefined();
	});

	it('should find items by id', () => {
		const item = get(repositoryStore)!.GetById<Item>('i:gregtech:gt.blockmachines:1000');
		expect(item).toBeDefined();
		expect(item?.name).toBe('Electric Blast Furnace');
	});

	it('should find fluids by id', () => {
		const fluid = get(repositoryStore)!.GetById<Fluid>('f:IC2:ic2steam');
		expect(fluid).toBeDefined();
		expect(fluid?.name).toBe('Steam');
	});
});
