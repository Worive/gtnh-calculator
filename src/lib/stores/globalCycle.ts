import { writable } from 'svelte/store';
import { cycleInterval } from '$lib/types/constants/nei.consts';

export const globalCycle = (() => {
	const { subscribe, update } = writable(0);
	let intervalId: NodeJS.Timeout;

	return {
		subscribe,
		start: () => {
			if (!intervalId) {
				intervalId = setInterval(() => update((n) => n + 1), cycleInterval);
			}
		},
		stop: () => {
			clearInterval(intervalId);
		}
	};
})();
