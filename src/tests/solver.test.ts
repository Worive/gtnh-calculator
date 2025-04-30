import { SolvePage } from '$lib/legacy/solver';
import * as fs from 'fs';
import * as path from 'path';
import { setupRepository } from './setup';
import {beforeAll, describe, expect, it} from "vitest";
import {RecipeModel} from "$lib/core/data/models/RecipeModel";
import {RecipeGroupModel} from "$lib/core/data/models/RecipeGroupModel";
import {PageModel} from "$lib/core/data/models/PageModel";

function loadTestFiles(): string[] {
    const testDir = path.join(__dirname, '..', '..', 'tests');
    const files = fs.readdirSync(testDir);
    return files.filter(file => file.endsWith('.gtnh'));
}

const testFiles = loadTestFiles();

function getRecipeExpectations(recipe: RecipeModel) {
    return {
        recipesPerMinute: recipe.recipesPerMinute,
        crafterCount: recipe.crafterCount,
        powerFactor: recipe.powerFactor,
        overclockFactor: recipe.overclockFactor,
        perfectOverclocks: recipe.perfectOverclocks,
        id: recipe.recipeId
    };
}

function processRecipeGroup(group: RecipeGroupModel): any[] {
    const expectations: any[] = [];
    for (const element of group.elements) {
        if (element instanceof RecipeModel) {
            expectations.push(getRecipeExpectations(element));
        } else if (element instanceof RecipeGroupModel) {
            expectations.push(...processRecipeGroup(element));
        }
    }
    return expectations;
}

describe('Solver', () => {
    beforeAll(async () => {
        await setupRepository();
    });

    describe('Test Files', () => {
        it('should have test files', () => {
            expect(testFiles.length).toBeGreaterThan(0);
        });
    });

    testFiles.forEach((testFile: string) => {
        describe(`Processing ${testFile}`, () => {
            it('should process without errors', async () => {
                const filePath = path.join(__dirname, '..', '..', 'tests', testFile);
                const fileContent = fs.readFileSync(filePath, 'utf-8');
                const pageData = JSON.parse(fileContent);
                
                const page = new PageModel(pageData);
                SolvePage(page);

                // Get expectations for all recipes and create a snapshot
                const expectations = processRecipeGroup(page.rootGroup);
                expect(expectations).toMatchSnapshot();
            });
        });
    });
}); 