import { writable } from 'svelte/store';
import { PageModel } from '$lib/core/data/models/PageModel';

export const currentPageStore = writable<PageModel>(new PageModel());
