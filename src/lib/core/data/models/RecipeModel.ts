import { RecipeGroupEntry } from '$lib/core/data/models/RecipeGroupEntry';
import type { Recipe } from '$lib/core/data/models/Recipe';
import type { Item } from '$lib/core/data/models/Item';
import type { ModelObjectVisitor } from '$lib/core/data/models/ModelObjectVisitor';
import type { Choice, Machine } from '$lib/types/models/Machine';
import { singleBlockMachine } from '$lib/types/constants/machines.const';

export class RecipeModel extends RecipeGroupEntry {
	type: string = 'recipe';
	recipeId: string = '';
	recipe?: Recipe;
	voltageTier: number = 0;
	crafter: string | undefined;
	choices: { [key: string]: number } = {};
	fixedCrafterCount?: number;

	recipesPerMinute: number = 0;
	crafterCount: number = 0;
	overclockFactor: number = 1;
	powerFactor: number = 1;
	parallels: number = 0;
	overclockTiers: number = 0;
	perfectOverclocks: number = 0;
	selectedOreDicts: { [key: string]: Item } = {};
	machineInfo: Machine = singleBlockMachine;
	multiblockCrafter: Item | null = null;

	Visit(visitor: ModelObjectVisitor): void {
		visitor.VisitData(this, 'type', this.type);
		visitor.VisitData(this, 'recipeId', this.recipeId);
		visitor.VisitData(this, 'voltageTier', this.voltageTier);
		visitor.VisitData(this, 'crafter', this.crafter);
		visitor.VisitData(this, 'choices', this.choices);
		visitor.VisitData(this, 'fixedCrafterCount', this.fixedCrafterCount);
	}

	constructor(source: any = undefined) {
		super();
		if (source instanceof Object) {
			if (typeof source.recipeId === 'string') this.recipeId = source.recipeId;
			if (typeof source.voltageTier === 'number') this.voltageTier = source.voltageTier;
			if (typeof source.crafter === 'string') this.crafter = source.crafter;
			if (source.choices instanceof Object) this.choices = source.choices;
			if (typeof source.fixedCrafterCount === 'number')
				this.fixedCrafterCount = source.fixedCrafterCount;
		}
	}

	ValidateChoices(machineInfo: Machine): void {
		if (!machineInfo.choices) {
			this.choices = {};
			return;
		}

		const validatedChoices: { [key: string]: number } = {};

		for (const [key, choice] of Object.entries(machineInfo.choices)) {
			const currentValue = this.choices[key];
			const typedChoice = choice as Choice;

			const min = typedChoice.min ?? 0;
			let max = typedChoice.max ?? Number.POSITIVE_INFINITY;
			if (typedChoice.choices) max = typedChoice.choices.length - 1;
			validatedChoices[key] = Math.min(Math.max(currentValue ?? min, min), max);
		}

		this.choices = validatedChoices;
	}
}
