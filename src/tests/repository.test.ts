import { Repository, Item, Fluid, Recipe, OreDict } from '$lib/legacy/repository';
import { setupRepository } from './setup';
import {beforeAll, describe, expect, it} from "vitest";

describe('Repository', () => {
    beforeAll(async () => {
        await setupRepository();
    });

    it('should load repository data', () => {
        expect(Repository.current).toBeDefined();
    });

    it('should find items by id', () => {
        const item = Repository.current.GetById<Item>('i:gregtech:gt.blockmachines:1000');
        expect(item).toBeDefined();
        expect(item?.name).toBe('Electric Blast Furnace');
    });

    it('should find fluids by id', () => {
        const fluid = Repository.current.GetById<Fluid>('f:IC2:ic2steam');
        expect(fluid).toBeDefined();
        expect(fluid?.name).toBe('Steam');
    });
}); 