import { writable } from 'svelte/store';
import { PageModel } from '$lib/models/page/pageModel';

export const currentPageStore = writable<PageModel>(new PageModel());
