import type { PageModel } from '$lib/core/data/models/PageModel';
import { type Model, type Solution } from 'javascript-lp-solver';
import { LinkCollection } from '$lib/core/solver/LinkCollection';
import { RecipeGroupModel } from '$lib/core/data/models/RecipeGroupModel';
import { RecipeModel } from '$lib/core/data/models/RecipeModel';
import { Repository } from '$lib/core/data/Repository';
import type { Recipe } from '$lib/core/data/models/Recipe';
import { Item } from '$lib/core/data/models/Item';
import { RecipeIoType } from '$lib/types/enums/RecipeIoType';
import {
	machines,
	notImplementedMachine,
	singleBlockMachine
} from '$lib/types/constants/machines.const';
import { voltageTier } from '$lib/types/constants/voltageTiers.const';
import type { MachineCoefficient } from '$lib/types/models/Machine';
import type { OreDict } from '$lib/core/data/models/OreDict';
import { LinkAlgorithm } from '$lib/types/enums/LinkAlgorithm';
import solver from 'javascript-lp-solver';
import { FlowInformation } from '$lib/core/data/models/FlowInformation';
import type { RecipeObject } from '$lib/core/data/models/RecipeObject';
import { currentPageStore } from '$lib/stores/currentPage.store';
import { get } from 'svelte/store';
import { repositoryStore } from '$lib/stores/repository.store';
import type { SearchableObject } from '$lib/core/data/models/SearchableObject';

export class CalculatorEngine {
	private static createAndMatchLinks(
		group: RecipeGroupModel,
		model: Model,
		collection: LinkCollection
	) {
		for (const child of group.elements) {
			if (child instanceof RecipeModel) {
				this.preProcessRecipe(child, model, collection);
			} else if (child instanceof RecipeGroupModel) {
				let childCollection: LinkCollection = new LinkCollection();
				this.createAndMatchLinks(child, model, childCollection);
				collection.Merge(childCollection);
			}
		}

		console.debug('Raw collection', collection);

		let matchedOutputs: { [key: string]: boolean } = {};
		group.actualLinks = { ...group.links };

		for (const key of Object.keys(collection.inputOreDict)) {
			const currentRepository = get(repositoryStore);

			var oreDict = currentRepository?.GetById<OreDict>(key)!;
			for (const item of oreDict.items) {
				let algorithm = group.links[item.id] || LinkAlgorithm.Match;
				if (collection.output[item.id] === undefined) continue;
				// Despite the fact that we are ignoring the link, we still need to select the ore dict item to have the same item in production and consumption
				for (const recipe of collection.inputOreDictRecipe[key])
					recipe.selectedOreDicts[key] = item;
				if (algorithm === LinkAlgorithm.Ignore) continue;

				this.createLinkByAlgorithm(
					model,
					algorithm,
					group,
					item.id,
					key,
					collection.inputOreDict,
					matchedOutputs,
					collection.output[item.id]
				);
				break;
			}
		}

		for (const key of Object.keys(collection.input)) {
			var algorithm = group.links[key] || LinkAlgorithm.Match;
			if (algorithm === LinkAlgorithm.Ignore || collection.output[key] === undefined) continue;

			this.createLinkByAlgorithm(
				model,
				algorithm,
				group,
				key,
				key,
				collection.input,
				matchedOutputs,
				collection.output[key]
			);
		}

		for (const key in matchedOutputs) {
			var linkName = `link_${group.iid}_${key}`;
			this.matchVariablesToConstraints(model, linkName, collection.output[key]);
			delete collection.output[key];
		}

		return collection;
	}

	private static preProcessRecipe(
		recipeModel: RecipeModel,
		model: Model,
		collection: LinkCollection
	) {
		const currentRepository = get(repositoryStore);
		let recipe = currentRepository?.GetById<Recipe>(recipeModel.recipeId);
		if (!recipe) return;
		recipeModel.recipe = recipe;
		let varName = `recipe_${recipeModel.iid}`;
		model.variables[varName] = { obj: 1 };
		for (const slot of recipe.items) {
			const goods = slot.goods;
			let amount = slot.amount * slot.probability;
			let container = goods instanceof Item && goods.container;

			if (slot.type == RecipeIoType.OreDictInput) {
				collection.AddInputOreDict(goods, amount, varName, recipeModel);
			} else if (container) {
				if (slot.type == RecipeIoType.ItemOutput) {
					collection.AddOutput(container.fluid, amount * container.amount, varName);
					collection.AddOutput(container.empty, amount, varName);
				} else if (slot.type == RecipeIoType.ItemInput) {
					collection.AddInput(container.fluid, amount * container.amount, varName);
					collection.AddInput(container.empty, amount, varName);
				}
			} else {
				if (slot.type == RecipeIoType.ItemOutput || slot.type == RecipeIoType.FluidOutput) {
					collection.AddOutput(goods, amount, varName);
				} else if (slot.type == RecipeIoType.ItemInput || slot.type == RecipeIoType.FluidInput) {
					collection.AddInput(goods, amount, varName);
				}
			}
		}

		recipeModel.overclockFactor = 1;

		let gtRecipe = recipe.gtRecipe;
		if (gtRecipe && gtRecipe.durationTicks > 0) {
			let crafter = recipeModel.crafter
				? (currentRepository?.GetById<Item>(recipeModel.crafter) ?? null)
				: null;
			if (crafter != null && !recipe.recipeType.multiblocks.includes(crafter)) crafter = null;
			if (crafter === null && recipe.recipeType.singleblocks.length == 0)
				crafter = recipe.recipeType.defaultCrafter;
			let machineInfo = crafter
				? machines[crafter.name] || notImplementedMachine
				: singleBlockMachine;
			recipeModel.multiblockCrafter = crafter;
			recipeModel.machineInfo = machineInfo;
			recipeModel.ValidateChoices(machineInfo);
			let actualVoltage = voltageTier[recipeModel.voltageTier].voltage;
			let machineParallels = this.getParameter(machineInfo.parallels, recipeModel, 1);
			let energyModifier = this.getParameter(machineInfo.power, recipeModel);
			let maxParallels = Math.max(
				1,
				Math.floor(actualVoltage / (gtRecipe.voltage * energyModifier * gtRecipe.amperage))
			);
			let parallels = Math.min(maxParallels, machineParallels);
			let overclockTiers = Math.min(
				recipeModel.voltageTier - gtRecipe.voltageTier,
				Math.floor(Math.log2(maxParallels / parallels) / 2)
			);
			let overclockSpeed = 1;
			let overclockPower = 1;
			let perfectOverclocks = Math.min(
				this.getParameter(machineInfo.perfectOverclock, recipeModel),
				overclockTiers
			);
			let normalOverclocks = overclockTiers - perfectOverclocks;
			if (perfectOverclocks > 0) {
				overclockSpeed = Math.pow(4, perfectOverclocks);
			}
			if (normalOverclocks > 0) {
				let coef = Math.pow(2, normalOverclocks);
				overclockSpeed *= coef;
				overclockPower *= coef;
			}
			let speedModifier = this.getParameter(machineInfo.speed, recipeModel);
			//console.log({machineParallels, maxParallels, parallels, overclockTiers, overclockSpeed, overclockPower, energyModifier, speedModifier});
			recipeModel.overclockFactor = overclockSpeed * speedModifier * parallels;
			recipeModel.powerFactor = (overclockPower * energyModifier) / speedModifier;
			recipeModel.parallels = parallels;
			recipeModel.overclockTiers = overclockTiers;
			recipeModel.perfectOverclocks = perfectOverclocks;

			if (recipeModel.fixedCrafterCount) {
				let crafterName = `fixed_${recipeModel.iid}`;
				let fixedRecipesPerMinute =
					(recipeModel.fixedCrafterCount * recipeModel.overclockFactor) /
					recipe.gtRecipe.durationMinutes;
				model.variables[varName][crafterName] = 1;
				model.constraints[crafterName] = { equal: fixedRecipesPerMinute };
			}
		}
	}

	private static getParameter(
		coefficient: MachineCoefficient,
		recipeModel: RecipeModel,
		min: number = 0
	): number {
		if (typeof coefficient === 'number') return coefficient;
		let coef = coefficient(recipeModel, recipeModel.choices);
		if (coef < min) return min;
		return coef;
	}

	private static createLinkByAlgorithm(
		model: Model,
		algorithm: LinkAlgorithm,
		group: RecipeGroupModel,
		goodsId: string,
		collectionKey: string,
		collection: { [key: string]: { [key: string]: number } },
		matchedOutputs: { [key: string]: boolean },
		outputAmount: { [key: string]: number }
	) {
		var linkName = `link_${group.iid}_${goodsId}`;
		this.matchVariablesToConstraints(model, linkName, collection[collectionKey]);
		let amount = collection[collectionKey]['_amount'] || -outputAmount['_amount'] || 0;
		matchedOutputs[goodsId] = true;
		delete collection[collectionKey];
		group.actualLinks[goodsId] = algorithm;
		model.constraints[linkName] = { equal: amount };
	}

	private static matchVariablesToConstraints(
		model: Model,
		name: string,
		variableList: { [key: string]: number }
	): void {
		for (const key in variableList) {
			if (key === '_amount') continue;
			model.variables[key][name] = (model.variables[key][name] || 0) + variableList[key];
		}
	}

	private static applySolutionGroup(
		group: RecipeGroupModel,
		solution: Solution,
		model: Model,
		feasible: boolean
	): void {
		for (const child of group.elements) {
			if (child instanceof RecipeModel) this.applySolutionRecipe(child, solution);
			else if (child instanceof RecipeGroupModel)
				this.applySolutionGroup(child, solution, model, feasible);
		}

		let flow: FlowInformation = new FlowInformation();
		group.flow = flow;
		for (const child of group.elements) {
			flow.Merge(child.flow);
		}
		for (const link in group.actualLinks) {
			let delta = (flow.input[link] || 0) - (flow.output[link] || 0);
			if (delta > 0.01) {
				flow.input[link] = delta;
				delete flow.output[link];
			} else if (delta < -0.01) {
				flow.output[link] = -delta;
				delete flow.input[link];
			} else {
				delete flow.input[link];
				delete flow.output[link];
			}
		}
	}

	private static applySolutionRecipe(recipeModel: RecipeModel, solution: Solution): void {
		let flow: FlowInformation = new FlowInformation();
		recipeModel.flow = flow;
		let name = `recipe_${recipeModel.iid}`;
		let recipe = recipeModel.recipe!;
		let solutionValue = (solution[name] || 0) as number;
		recipeModel.recipesPerMinute = solutionValue;
		recipeModel.crafterCount = 0;
		for (const item of recipe.items) {
			var goods: RecipeObject = item.goods;
			if (item.type == RecipeIoType.OreDictInput && recipeModel.selectedOreDicts[item.goods.id])
				goods = recipeModel.selectedOreDicts[item.goods.id];

			var isProduction =
				item.type == RecipeIoType.FluidOutput || item.type == RecipeIoType.ItemOutput;
			let amount = item.amount * item.probability * solutionValue;
			let container = goods instanceof Item && goods.container;
			if (container) {
				flow.Add(container.fluid, amount * container.amount, isProduction);
				flow.Add(container.empty, amount, isProduction);
			} else flow.Add(goods, amount, isProduction);
		}

		let gtRecipe = recipe.gtRecipe;
		if (gtRecipe && gtRecipe.durationTicks > 0) {
			flow.energy[recipeModel.voltageTier] =
				gtRecipe.durationMinutes * gtRecipe.voltage * solutionValue * recipeModel.powerFactor;
			recipeModel.crafterCount =
				(solutionValue * gtRecipe.durationMinutes) / recipeModel.overclockFactor;
		}
	}

	public static solvePage(page: PageModel): void {
		try {
			let model: Model = {
				optimize: 'obj',
				opType: 'min',
				constraints: {},
				variables: {}
			};
			let timeUnit = page.settings.timeUnit;
			let timeScale = timeUnit === 'sec' ? 60 : timeUnit === 'tick' ? 20 * 60 : 1;
			page.timeScale = timeScale;
			let collection: LinkCollection = new LinkCollection();
			for (const product of page.products) {
				if (product.amount > 0) {
					collection.input[product.goodsId] = { _amount: -product.amount };
				} else {
					collection.output[product.goodsId] = { _amount: product.amount };
				}
			}
			this.createAndMatchLinks(page.rootGroup, model, collection);
			console.log('Solve model', model);

			let solution = solver.Solve(model);
			console.log('Solve solution', solution);
			page.status = solution.feasible ? (solution.bounded ? 'solved' : 'unbounded') : 'infeasible';
			this.applySolutionGroup(page.rootGroup, solution, model, solution.feasible);

			currentPageStore.set(page);

			console.log('Page solved', get(currentPageStore));
		} catch (error) {
			console.error('Error solving page', error);
		}
	}
}
