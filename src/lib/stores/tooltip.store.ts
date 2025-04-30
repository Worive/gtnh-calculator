import { writable } from 'svelte/store';
import type { TooltipState, TooltipContent } from '../types/tooltip';

const initialState: TooltipState = {
	visible: false,
	content: null,
	targetElement: null,
	position: { left: 0, top: 0 }
};

export const tooltipStore = writable<TooltipState>(initialState);
