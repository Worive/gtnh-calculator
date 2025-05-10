import { writable } from 'svelte/store';

export const highlightedId = writable<string|null>(null);
