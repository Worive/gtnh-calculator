import type { Component } from 'svelte';
import type { NeiStore } from '$lib/stores/nei.store';

export interface Tab {
	name: string;
	iconId: number;
	component: Component<any>;
	componentProps?: Record<string, any>;
	visible: (store: NeiStore) => boolean;
}
