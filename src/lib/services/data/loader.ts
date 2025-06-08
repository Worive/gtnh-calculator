import { base } from '$app/paths';
import { browser } from '$app/environment';

export class Loader {
	private static atlasPromise: Promise<HTMLImageElement> | null = null;

	static loadAtlas(src: string = `${base}/data/atlas.webp`): Promise<HTMLImageElement> {
		if (this.atlasPromise) return this.atlasPromise;
		if (!browser) throw new Error('Loader.loadAtlas() can only run in the browser');

		this.atlasPromise = new Promise((resolve, reject) => {
			const img = new Image();
			img.onload = () => {
				console.debug(`[DataLoader] Atlas loaded (${img.naturalWidth}×${img.naturalHeight})`);
				resolve(img);
			};
			img.onerror = (e) => reject(new Error(`Unable to load atlas at ${src}`));
			img.src = src;
		});

		return this.atlasPromise;
	}
}
