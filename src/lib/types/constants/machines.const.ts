import type { Choice, Machine } from '$lib/types/models/Machine';

export const MAX_OVERCLOCK = Number.POSITIVE_INFINITY;

export let CoilTierChoice: Choice = {
	description: 'Coils',
	choices: [
		'T1: Cupronickel',
		'T2: Kanthal',
		'T3: Nichrome',
		'T4: TPV',
		'T5: HSS-G',
		'T6: HSS-S',
		'T7: Naquadah',
		'T8: Naquadah Alloy',
		'T9: Trinium',
		'T10: Electrum Flux',
		'T11: Awakened Draconium',
		'T12: Infinity',
		'T13: Hypogen',
		'T14: Eternal'
	]
};

export const machines: Record<string, Machine> = {};

export const singleBlockMachine: Machine = {
	perfectOverclock: 0,
	speed: 1,
	power: 1,
	parallels: 1
};

export const notImplementedMachine: Machine = {
	perfectOverclock: 0,
	speed: 1,
	power: 1,
	parallels: 1,
	info: 'Machine not implemented (Calculated as a singleblock)'
};
