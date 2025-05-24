import type { Component } from 'svelte';
import type { NeiStore } from '$lib/stores/nei.store';

export interface NeiTab {
	name: string;
	iconId: number;
	component: Component;
	visible: (store: NeiStore) => boolean;
}
