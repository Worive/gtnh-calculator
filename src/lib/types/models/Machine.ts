import type { RecipeModel } from '$lib/core/data/models/RecipeModel';

export type MachineCoefficient =
	| number
	| ((recipe: RecipeModel, choices: { [key: string]: number }) => number);

export type Machine = {
	choices?: { [key: string]: Choice };
	perfectOverclock: MachineCoefficient;
	speed: MachineCoefficient;
	power: MachineCoefficient;
	parallels: MachineCoefficient;
	info?: string;
};

export type Choice = {
	description: string;
	choices?: string[];
	min?: number;
	max?: number;
};
