import { writable } from 'svelte/store';
import { PageModel } from '$lib/models/page/PageModel';

export const currentPageStore = writable<PageModel>(new PageModel());
