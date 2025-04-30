import * as fs from 'fs/promises';
import * as path from 'path';
import * as zlib from 'zlib';
import { Repository } from '$lib/core/data/Repository';

export async function setupRepository() {
	const dataPath = path.join(process.cwd(), 'static', 'data', 'data.bin');
	const compressedData = await fs.readFile(dataPath);
	const buffer = await new Promise<ArrayBuffer>((resolve, reject) => {
		zlib.gunzip(compressedData, (err, decompressed) => {
			if (err) reject(err);
			else {
				const arrayBuffer = new ArrayBuffer(decompressed.length);
				const view = new Uint8Array(arrayBuffer);
				decompressed.copy(view);
				resolve(arrayBuffer);
			}
		});
	});

	Repository.load(buffer);
}
