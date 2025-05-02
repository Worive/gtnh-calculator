import {writable} from "svelte/store";
import type {Repository} from "$lib/core/data/Repository";

export const repositoryStore = writable<Repository | null>(null);