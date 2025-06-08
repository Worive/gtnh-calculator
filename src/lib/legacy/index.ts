// keep the file a module even though everything is now inside a function
import { NeiService } from '$lib/services/nei.service';
import { Repository } from '$lib/services/data/repository';
import { Loader } from '$lib/services/data/loader';
import { get } from 'svelte/store';
import { repositoryStore } from '$lib/stores/recipe/repository.store';

export {};

// run everything inside a self-executing async function
(async () => {
	const loading = document.getElementById('loading') as HTMLElement;

	try {
		/* ---------- 1. load the atlas image ---------- */
		await Loader.loadAtlas();

		/* ---------- 2. load repository + binary data in parallel ---------- */
		const [response] = await Promise.all([
			fetch(new URL('/data/data.bin', import.meta.url)) // avoids resolve() in older bundlers
		]);

		const stream = response.body!.pipeThrough(new DecompressionStream('gzip'));
		const buffer = await new Response(stream).arrayBuffer();
		Repository.load(buffer);
		console.log('Repository loaded', get(repositoryStore));

		NeiService.initialize();
		/* ---------- 3. lazy-load the rest of the UI modules ---------- */
		await Promise.all([
			import('./machines.js'),
			import('./itemIcon.js'),
			import('./menu.js'),
			import('./recipeList.js')
		]);

		const page = await import('./page.js');
		page.UpdateProject();

		/* ---------- 4. done: remove the spinner ---------- */
		loading.remove();
	} catch (err: any) {
		loading.innerHTML = 'An error occurred while loading:<br>' + err.message;
		console.error(err);
	}
})();
