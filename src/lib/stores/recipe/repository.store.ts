import { writable } from 'svelte/store';
import type { Repository } from '$lib/services/data/repository';

export const repositoryStore = writable<Repository | null>(null);
